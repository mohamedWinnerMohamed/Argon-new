"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

export function EditPassengerButton({
  id,
  ...props
}: ComponentProps<"button"> & { id: string }) {
  const router = useRouter();

  async function handleClick() {
    router.push("/passengers/edit/" + id);
  }

  return (
    <Button {...props} onClick={handleClick} size="icon" variant="outline">
      <Pencil size={32} />
    </Button>
  );
}
