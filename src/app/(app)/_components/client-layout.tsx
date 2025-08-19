"use client";

import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Compass,
  List,
  Package,
  SignOut,
  SuitcaseRolling,
  UserRectangle,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { logout } from "@/apis/auth";
import { apiErrorHandler } from "@/lib/handle-api-errors";
import { toast } from "sonner";
import { ar } from "yup-locales";
import * as yup from "yup";
import { SessionDataType, useSession } from "@/session-store";

yup.setLocale(ar);

const ADMIN_TABS = [
  {
    id: 1,
    icon: UserRectangle,
    name: "المكاتب",
    path: "/",
  },
  {
    id: 2,
    icon: Compass,
    name: "الرحلات",
    path: "/trips",
  },
  {
    id: 3,
    icon: ClockCounterClockwise,
    name: "ارشيف",
    path: "/archive",
  },
  {
    id: 4,
    icon: SuitcaseRolling,
    name: "المسافرين",
    path: "/passengers",
  },
  {
    id: 5,
    icon: Package,
    name: "منقولات",
    path: "/movables",
  },
];

export default function ClientLayout({
  children,
  session,
}: {
  children: ReactNode;
  session?: Record<string, unknown>;
}) {
  const setSession = useSession((state) => state.setSession);

  useEffect(() => {
    setSession(session as SessionDataType);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isSignoutPending, setIsSignoutPending] = useState<boolean>(false);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const router = useRouter();
  async function handleSignOut() {
    setIsSignoutPending(true);
    const res = await apiErrorHandler(logout());
    if (res === null) return;

    const message = res.data.message;

    toast.info(message);

    router.refresh();
    setIsSignoutPending(false);
  }
  return (
    <div className="w-full h-[100dvh] flex justify-center items-center ">
      <div className="lg:max-w-[1200px] lg:max-h-[800px] w-full h-full bg-white shadow md:border md:border-black/10 md:rounded-lg flex overflow-hidden">
        <Sidebar
          tabs={ADMIN_TABS}
          open={openSidebar}
          onClose={() => setOpenSidebar(false)}
        />
        <div className="flex-1 w-full grid grid-rows-[auto_1fr]">
          <div className="w-full border-b border-black/10 flex items-center gap-4 p-4 truncate">
            <Button
              size="icon"
              variant="outline"
              className="flex md:hidden"
              onClick={() => setOpenSidebar((prev) => !prev)}
            >
              <List size={32} />
            </Button>
            <p className="md:text-lg text-base font-bold truncate flex-1">
              مساحة عمل {(session?.name as string) ?? "مستخدم غير معروف"}
            </p>
            <Button
              variant="outline"
              className="bg-red-100 border-red-200 hover:bg-red-200 max-md:w-9 max-md:h-9"
              onClick={handleSignOut}
            >
              {!isSignoutPending && <SignOut size={32} />}
              {isSignoutPending && <Loader2 className="animate-spin" />}
              <p className="md:flex hidden">تسجيل الخروج</p>
            </Button>
          </div>
          <div className="h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
