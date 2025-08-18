import { adminOnly } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDifferences } from "@/lib/get-difference";
import { APIError } from "@/lib/handle-api-errors";
import { NextRequest, NextResponse } from "next/server";
import { EditTripType } from "@/schemas/edit-trip";

export async function POST(request: NextRequest) {
  const isAdminResponse = adminOnly(request);

  if (isAdminResponse instanceof APIError) {
    return NextResponse.json(isAdminResponse, { status: 401 });
  }

  const body = (await request.json()) as EditTripType & { id: string };

  const record = await db.trip.findUnique({
    where: { id: body.id },
  });

  if (!record) {
    return NextResponse.json(
      new APIError("خطأ", "يبدو ان هذه الرحلة غير مسجل بالنظام"),
      {
        status: 400,
      },
    );
  }

  const difference = getDifferences(record, body);

  try {
    await db.trip.update({ where: { id: body.id }, data: { ...difference } });
    return NextResponse.json(
      { message: "تم تحديث البيانات بنجاح" },
      { status: 200 },
    );

    // eslint-disable-next-line
  } catch (err) {
    return NextResponse.json(
      new APIError("خطأ", "حدث خطأ غير معروف اثناء تحديث بيانات الرحلة"),
      { status: 500 },
    );
  }
}
