import { deleteMovables } from "@/apis/movable-crud";
import { Button } from "@/components/ui/button";
import { apiErrorHandler } from "@/lib/handle-api-errors";
import { Trash } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteMovablesButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();

  async function onClick() {
    setIsPending(true);
    const res = await apiErrorHandler(deleteMovables({ id }));
    setIsPending(false);

    if (!res) return;

    toast.success(res.data.message);

    router.refresh();
  }

  return (
    <Button
      size="icon"
      variant="destructive"
      onClick={onClick}
      disabled={isPending}
    >
      {isPending && <Loader2 className="animate-spin" />}
      {!isPending && <Trash />}
    </Button>
  );
}
