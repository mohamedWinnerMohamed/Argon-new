import { Button } from "@/components/ui/button";
import { ClipboardText } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function ManifestoButton({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  return (
    <Button
      size="icon"
      variant="outline"
      disabled={disabled}
      onClick={() =>
        disabled ? null : router.push(`/trip-manifesto?id=${id}`)
      }
    >
      <ClipboardText />
    </Button>
  );
}
