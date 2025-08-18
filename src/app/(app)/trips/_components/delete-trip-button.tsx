"use client";

import { deleteTrip } from "@/apis/trip-crud";
import { Button } from "@/components/ui/button";
import { apiErrorHandler } from "@/lib/handle-api-errors";
import { Trash } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";
import { toast } from "sonner";

export function DeleteTripButton({
  id,
  disabled,
  ...props
}: ComponentProps<"button"> & { id: string }) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  async function handleDelete() {
    setIsPending(true);
    const res = await apiErrorHandler(deleteTrip({ id }));
    setIsPending(false);

    if (!res) return;

    toast.success(res.data.message);

    router.refresh();
  }

  return (
    <Button
      {...props}
      onClick={handleDelete}
      size="icon"
      variant="destructive"
      disabled={disabled || isPending}
    >
      {isPending && <Loader2 className="animate-spin" />}
      {!isPending && <Trash size={32} />}
    </Button>
  );
}
