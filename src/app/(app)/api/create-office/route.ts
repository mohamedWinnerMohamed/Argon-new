import { adminOnly } from "@/lib/auth";
import { db } from "@/lib/db";
import { APIError } from "@/lib/handle-api-errors";
import { CreateOfficeType } from "@/schemas/create-office";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const isAdminResponse = adminOnly(request);

  if (isAdminResponse instanceof APIError) {
    return NextResponse.json(isAdminResponse, { status: 401 });
  }

  const body = (await request.json()) as CreateOfficeType;

  const foundOffice = await db.office.findUnique({
    where: { username: body.username },
  });

  const doesOfficeAlreadyExist = !!foundOffice;

  if (doesOfficeAlreadyExist) {
    return NextResponse.json(
      new APIError(
        "مكتب مسجل بالفعل",
        "هذا المكتب مسجل بالفعل، يمكنك التعديل عليه مباشرةً.",
      ),
      { status: 41 },
    );
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  await db.office.create({
    data: {
      username: body.username,
      name: body.name,
      password: hashedPassword,
    },
  });

  return NextResponse.json(
    { message: "تم إنشاء المكتب بنجاح" },
    { status: 201 },
  );
}
