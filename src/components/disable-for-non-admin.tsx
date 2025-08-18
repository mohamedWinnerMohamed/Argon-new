import { useSession } from "@/session-store";
import { cloneElement, ReactElement } from "react";

export function DisableButtonForNonAdmin({
  children,
}: {
  children: ReactElement<{ disabled: boolean }>;
}) {
  const session = useSession((state) => state.session);

  console.log("SESSION", session);

  if (!session?.role) return children;

  if (session.role !== "ADMIN")
    return cloneElement(children, { disabled: true });

  return children;
}
