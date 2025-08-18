"use client";
import Image from "next/image";
import { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { createElement } from "react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  tabs: {
    id: number | string;
    icon: Icon;
    name: string;
    path: string;
  }[];
}

export function Sidebar({ tabs, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function setTab(path: string) {
    router.push(path);
  }

  return (
    <>
      <div
        className={cn(
          "bg-black/20 fixed top-0 left-0 right-0 bottom-0 z-40 transition-opacity",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      ></div>
      <div
        className={cn(
          "flex flex-col items-start justify-start border-e border-black/10 md:static fixed z-50 h-full bg-white transition-all duration-700 max-md:w-[200px]",
          open ? "right-0" : "-right-full",
        )}
      >
        <div className="p-4 w-full">
          <Image
            src="/images/logo.png"
            width={100}
            height={100}
            alt="Logo"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col p-4 justify-center items-center w-full gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.path)}
              className={cn(
                "w-full h-max rounded-md p-3 justify-start items-center flex hover:bg-muted border border-transparent",
                pathname === tab.path && "bg-muted shadow-sm border-input",
              )}
            >
              <div className="w-[30px] flex">
                {createElement(tab.icon, { size: 20 })}
              </div>
              <p className="text-sm">{tab.name}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
