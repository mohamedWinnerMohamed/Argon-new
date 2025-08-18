import { db } from "@/lib/db";
import { getDifferences } from "@/lib/get-difference";
import { APIError } from "@/lib/handle-api-errors";
import { NextRequest, NextResponse } from "next/server";
import { EditPassengerType } from "@/schemas/edit-passenger";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = getSession(request);

  if (!session) {
    return NextResponse.json(
      new APIError("لم تسجل دخولك", "الرجاء تسجيل الدخول اولاً"),
      { status: 500 }
    );
  }

  const body = (await request.json()) as EditPassengerType & { id: string };

  const record = await db.passenger.findUnique({
    where: { id: body.id },
  });

  if (!record) {
    return NextResponse.json(
      new APIError("غير موجود", "يبدو ان هذا المسافر غير مسجل بالنظام"),
      {
        status: 400,
      }
    );
  }

  const passengerWithSeatNo = await db.passenger.findFirst({
    where: { tripId: body.trip, seatNo: body.seatNo },
  });



  if (passengerWithSeatNo && passengerWithSeatNo.id !== body.id) {
    return NextResponse.json(new APIError("خطأ", "هذا الكرسي محجوز"), {
      status: 400,
    });
  }

  const difference = getDifferences(record, body);


  try {
    const isAdmin = session.data.role === "ADMIN";

    const isOfficePermitted = record.officeId === session.data.id;

    if (!isAdmin && !isOfficePermitted) {
      return NextResponse.json(
        new APIError(
          "غير مسموح",
          "لا يمكن تنفيذ هذه العملية إلا من خلال المكتب المسؤول او مسؤول النظام"
        ),
        { status: 500 }
      );
    }
    await db.passenger.update({
      where: { id: body.id },
      data: { ...difference },
    });

    const data = await db.passenger.findUnique({
      where: { id: body.id },
      include: { trip: true, createdBy: true },
    });
    return NextResponse.json(
      { message: "تم تحديث البيانات بنجاح", data },
      { status: 200 }
    );

    // eslint-disable-next-line
  } catch (err) {
    return NextResponse.json(
      new APIError("خطأ", "حدث خطأ غير معروف اثناء تحديث بيانات المسافر"),
      { status: 500 }
    );
  }
}
