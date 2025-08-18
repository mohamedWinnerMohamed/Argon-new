import { adminOnly } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDifferences } from "@/lib/get-difference";
import { APIError } from "@/lib/handle-api-errors";
import { EditOfficeType } from "@/schemas/edit-office";
import { Office } from "@prisma/client";
import { Optional } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const isAdminResponse = adminOnly(request);

  if (isAdminResponse instanceof APIError) {
    return NextResponse.json(isAdminResponse, { status: 401 });
  }

  const body = (await request.json()) as EditOfficeType & { id: string };

  const record = (await db.office.findUnique({
    where: { id: body.id },
  })) as Optional<Office>;

  if (!record) {
    return NextResponse.json(
      new APIError("خطأ", "يبدو ان هذا المكتب غير مسجل بالنظام"),
      {
        status: 400,
      },
    );
  }

  const isPasswordChanged = body.hasOwnProperty("password");

  if (!isPasswordChanged) {
    delete record.password;
  } else {
    const hashedPassword = await bcrypt.hash(body.password!, 10);

    body.password = hashedPassword;
  }

  const difference = getDifferences(record, body);

  try {
    await db.office.update({ where: { id: body.id }, data: { ...difference } });
    return NextResponse.json(
      { message: "تم تحديث البيانات بنجاح" },
      { status: 200 },
    );

    // eslint-disable-next-line
  } catch (err) {
    return NextResponse.json(
      new APIError("خطأ", "حدث خطأ غير معروف اثناء تحديث بيانات المكتب"),
      { status: 500 },
    );
  }
}
