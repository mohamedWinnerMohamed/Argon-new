import { Suspense } from "react";
import ClientLogin from "./_components/client-page";

export default function Login() {
  return (
    <Suspense>
      <ClientLogin />
    </Suspense>
  );
}
