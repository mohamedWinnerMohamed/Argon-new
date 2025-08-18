import { useSession } from "@/session-store";
import { cloneElement, ReactElement } from "react";

export default function DisableButtonForOtherOffices({
  children,
  officeId,
}: {
  children: ReactElement<{ disabled: boolean }>;
  officeId: string;
}) {
  const session = useSession((data) => data.session);

  const isOfficePermitted = session?.id === officeId;
  const isAdmin = session?.role === "ADMIN";

  if (!isAdmin && !isOfficePermitted) {
    return cloneElement(children, { disabled: true });
  }

  return children;
}
