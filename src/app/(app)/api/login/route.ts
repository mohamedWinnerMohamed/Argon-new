import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { APIError } from "@/lib/handle-api-errors";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { SignJWT } from "jose";

const MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const body = (await request.json()) as { username: string; password: string };

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const isAdminUsername = body.username === adminUsername;
  const isAdminPassword = body.password === adminPassword;
  const iat = Math.floor(Date.now() / 1000);

  if (isAdminUsername && isAdminPassword) {
    const token = await new SignJWT({
      data: {
        username: "admin",
        role: "ADMIN",
        name: "مسؤول النظام",
        id: null,
      },
    })
      .setExpirationTime("7d")
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(new TextEncoder().encode(process.env.JWT_PRIVATE));
    const serialized = serialize("OutSiteJWT", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
    return NextResponse.json(
      { token },
      {
        status: 200,
        headers: { "Set-Cookie": serialized },
      },
    );
  }

  const office = await db.office.findUnique({
    where: { username: body.username },
  });

  if (!office) {
    return NextResponse.json(
      new APIError("معلومات غير صحيحة", "إسم المستخدم غير صحيح"),
      {
        status: 410,
      },
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    body.password,
    office.password,
  );

  if (!isPasswordCorrect) {
    return NextResponse.json(
      new APIError("معلومات غير صحيحة", "كلمة المرور غير صحيحة"),
      {
        status: 410,
      },
    );
  }

  const token = await new SignJWT({
    data: {
      username: office.username,
      role: "OFFICE",
      name: office.name,
      id: office.id,
    },
  })
    .setExpirationTime("7d")
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.JWT_PRIVATE));

  const serialized = serialize("OutSiteJWT", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
    partitioned: true,
  });

  return NextResponse.json(
    {
      token,
    },
    {
      status: 200,
      headers: { "Set-Cookie": serialized },
    },
  );
}
