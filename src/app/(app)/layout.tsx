import { ReactNode } from "react";
import ClientLayout from "./_components/client-layout";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

export default async function Layout({ children }: { children: ReactNode }) {
  const nextCookies = await cookies();

  const outSiteJWT = nextCookies.get("OutSiteJWT");

  const token = outSiteJWT?.value;

  const { data } = decodeJwt(token!);

  return (
    <ClientLayout session={data as Record<string, unknown>}>
      {children}
    </ClientLayout>
  );
}
