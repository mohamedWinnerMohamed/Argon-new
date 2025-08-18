import { db } from "@/lib/db";
import { APIError } from "@/lib/handle-api-errors";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = getSession(request);

  if (!session) {
    return NextResponse.json(
      new APIError("غير مصرح", "الرجاء تسجيل الدخول أولاً"),
      { status: 201 },
    );
  }

  const body = (await request.json()) as { id: string };

  try {
    const data = await db.sender.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json(
      { message: "تمت حذف منقولات بنجاح", data },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      new APIError("خطأ", "حدث خطأ غير معروف اثناء حذف منقولات"),
      { status: 201 },
    );
  }
}
