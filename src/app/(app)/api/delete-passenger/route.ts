import { adminOnly } from "@/lib/auth";
import { db } from "@/lib/db";
import { APIError } from "@/lib/handle-api-errors";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const isAdminResponse = adminOnly(request);

  if (isAdminResponse instanceof APIError) {
    return NextResponse.json(isAdminResponse, { status: 401 });
  }

  const body = (await request.json()) as { id: string };

  try {
    await db.passenger.delete({ where: { id: body.id } });

    return NextResponse.json(
      { message: "تمت حذف المسافر بنجاح" },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      new APIError("خطأ", "حدث خطأ غير معروف اثناء حذف المسافر"),
      { status: 500 },
    );
  }
}
