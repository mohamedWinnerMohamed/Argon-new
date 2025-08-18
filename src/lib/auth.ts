import cookies from "js-cookie";
import { NextRequest } from "next/server";
import { APIError } from "./handle-api-errors";
import { decodeJwt } from "jose";

export function getSessionData() {
  cookies.get("OutSiteJWT");
}

export function isAuth(request: NextRequest) {
  const outSiteJwt = request.cookies.get("OutSiteJWT");

  if (!outSiteJwt) return false;

  return true;
}

export function isAdmin(request: NextRequest) {
  const outSiteJwt = request.cookies.get("OutSiteJWT");

  if (!outSiteJwt) {
    return null;
  }

  const token = outSiteJwt.value;

  const { data } = decodeJwt(token) as {
    data: { role: string; [key: string]: string | number };
  };

  if (data.role === "ADMIN") return true;

  return false;
}

export function adminOnly(request: NextRequest) {
  const isAuthenticated = isAuth(request);

  if (!isAuthenticated) {
    return new APIError(
      "غير مصرح",
      "يبدو انك لم تسجل الدخول بعد، الرجاء التسجيل اولاً ثم تركار العملية.",
    );
  }

  const isAdminUser = isAdmin(request);

  if (!isAdminUser) {
    return new APIError(
      "غير مصرح",
      "غير مصرح بإجراء هذه العملية إلا عن طريق مسؤول النظام",
    );
  }

  return null;
}

export function getSession(request: NextRequest) {
  const outSiteJwt = request.cookies.get("OutSiteJWT");

  if (!outSiteJwt) {
    return null;
  }

  return decodeJwt(outSiteJwt.value) as {
    data: {
      role: string;
      id: string;
      username: string;
      name: string;
    };
  };
}
