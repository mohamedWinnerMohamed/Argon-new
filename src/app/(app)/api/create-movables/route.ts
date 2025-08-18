import { db } from "@/lib/db";
import { APIError } from "@/lib/handle-api-errors";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { CreateMovableSchemaType } from "@/schemas/create-movable";

export async function POST(request: NextRequest) {
  const session = getSession(request);

  if (!session) {
    return NextResponse.json(
      new APIError("غير مصرح", "الرجاء تسجيل الدخول أولاً"),
      { status: 201 },
    );
  }

  const body = (await request.json()) as CreateMovableSchemaType;

  try {
    const data = await db.sender.create({
      data: {
        name: body.senderName,
        phone: body.senderPhone,
        movables: {
          createMany: {
            data: body.movables!.map((movable) => ({
              name: movable.name,
              price: movable.price,
              receiverPhone: movable.receiverPhone,
              receiverName: movable.receiverName,
              destination: movable.destination,
              amount: movable.amount,
              notes: movable.notes,
            })),
          },
        },
      },
    });

    return NextResponse.json(
      { message: "تمت إضافة منقولات بنجاح", data },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      new APIError("خطأ", "حدث خطأ غير معروف اثناء إضافة منقولات"),
      { status: 201 },
    );
  }
}
