import { db } from "@/lib/db";
import { APIError } from "@/lib/handle-api-errors";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { CreateMovableSchemaType } from "@/schemas/create-movable";
import { getDifferences } from "@/lib/get-difference";

export async function POST(request: NextRequest) {
  const session = getSession(request);

  if (!session) {
    return NextResponse.json(
      new APIError("غير مصرح", "الرجاء تسجيل الدخول أولاً"),
      { status: 201 },
    );
  }

  const body = (await request.json()) as CreateMovableSchemaType & {
    movables?: { id?: string }[];
    senderId: string;
  };

  const senderWithMovables = await db.sender.findUnique({
    where: { id: body.senderId },
    include: {
      movables: true,
    },
  });

  if (!senderWithMovables) {
    return NextResponse.json(
      new APIError("خطأ", "يبدوا ان هذه المنقولات غير مسجلة بالنظام"),
      { status: 201 },
    );
  }

  try {
    const movables = senderWithMovables.movables;

    for (const movable of movables) {
      const item = body.movables?.find(
        (m) => (m as typeof m & { id: string }).id === movable.id,
      );

      if (!item) {
        await db.movable.delete({ where: { id: movable.id } });
        continue;
      }

      const difference = getDifferences(movable, item);

      if (Object.keys(difference).length <= 0) {
        continue;
      }

      await db.movable.update({ where: { id: movable.id }, data: difference });
    }

    for (const movable of body.movables!) {
      if (movable?.id) continue;

      await db.movable.create({
        data: {
          name: movable.name,
          amount: movable.amount,
          receiverPhone: movable.receiverPhone,
          receiverName: movable.receiverName,
          destination: movable.destination,
          price: movable.price,
          notes: movable.notes,
          sender: {
            connect: {
              id: body.senderId,
            },
          },
        },
      });
    }

    const senderDifference = getDifferences(
      { name: senderWithMovables.name, phone: senderWithMovables.phone },
      { name: body.senderName, phone: body.senderPhone },
    );

    if (Object.keys(senderDifference).length > 0) {
      await db.sender.update({
        where: { id: body.senderId },
        data: senderDifference,
      });
    }

    return NextResponse.json(
      { message: "تمت تحديث المنقولات بنجاح" },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      new APIError("خطأ", "حدث خطأ غير معروف اثناء تحديث المنقولات"),
      { status: 201 },
    );
  }
}
