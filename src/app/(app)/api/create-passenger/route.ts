import { db } from "@/lib/db";
import { APIError } from "@/lib/handle-api-errors";
import { NextRequest, NextResponse } from "next/server";
import { CreatePassengerType } from "@/schemas/create-passenger";
import { generateUniqueCode } from "@/lib/generate-unique-code";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  console.log("==== CREATE PASSENGER API CALLED ====");
  const session = getSession(request);

  if (!session) {
    return NextResponse.json(
      new APIError("غير مصرح", "الرجاء تسجيل الدخول أولاً"),
      { status: 201 },
    );
  }

  const { trip, ...body } = (await request.json()) as Omit<
    CreatePassengerType,
    "price"
  > & {
    price?: number;
  };
  console.log("BODY RECEIVED:", body, "TRIP:", trip);

  const passengerWithSeatNo = await db.passenger.findFirst({
    where: { tripId: trip, seatNo: body.seatNo },
  });

  if (passengerWithSeatNo) {
    return NextResponse.json(new APIError("خطأ", "هذا الكرسي محجوز"), {
      status: 400,
    });
  }

  const code = generateUniqueCode(8);

console.log("DATA TO CREATE:", {
  ...body,
  code,
  ...(session.data.id
    ? {
        createdBy: {
          connect: {
            id: session.data.id,
          },
        },
      }
    : {}),
  trip: {
    connect: {
      id: trip,
    },
  },
});
  
  try {
    const data = await db.passenger.create({
      data: {
        ...body,
        code,
        ...(session.data.id
          ? {
              createdBy: {
                connect: {
                  id: session.data.id,
                },
              },
            }
          : {}),
        trip: {
          connect: {
            id: trip,
          },
        },
      },
      include: {
        trip: true,
      },
    });

    return NextResponse.json(
      { message: "تمت إضافة مسافر بنجاح", data },
      { status: 201 },
    );
  } catch (err) {
    // console.log(err);
    console.log("CREATE PASSENGER ERROR:", err);
    // return NextResponse.json(
    //   new APIError("خطأ", "حدث خطأ غير معروف اثناء إضافة مسافر"),
    //   { status: 400 },
    // );
  }
}
