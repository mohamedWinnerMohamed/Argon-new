import { adminOnly } from "@/lib/auth";
import { db } from "@/lib/db";
import { APIError } from "@/lib/handle-api-errors";
import { NextRequest, NextResponse } from "next/server";
import { CreateTripType } from "@/schemas/create-trip";

export async function POST(request: NextRequest) {
  const isAdminResponse = adminOnly(request);

  if (isAdminResponse instanceof APIError) {
    return NextResponse.json(isAdminResponse, { status: 401 });
  }

  const body = (await request.json()) as CreateTripType;
  try {
    await db.trip.create({
      data: body,
    });

    return NextResponse.json(
      { message: "تم إنشاء الرحلة بنجاح" },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      new APIError("خطأ", "حدث خطأ غير معروف اثناء إنشاء الرحلة"),
      { status: 201 },
    );
  }
}
