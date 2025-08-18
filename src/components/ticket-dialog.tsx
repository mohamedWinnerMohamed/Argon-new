import { ReactNode, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Ticket, { TicketType } from "./ticket";
import { Button } from "./ui/button";
import { useReactToPrint } from "react-to-print";
import { Optional } from "@prisma/client/runtime/library";

export default function TicketDialog({
  children,
  open,
  onClose,
  ...ticketProps
}: {
  children?: ReactNode;
  open?: boolean;
  onClose?: () => void;
} & Optional<TicketType>) {
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          if (onClose) onClose();
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-max overflow-hidden">
        <DialogTitle>طباعة التذكرة</DialogTitle>
        <div className="w-full overflow-x-auto">
          <Ticket ref={contentRef} {...ticketProps} />
        </div>
        <Button onClick={() => reactToPrintFn()}>طباعة</Button>
      </DialogContent>
    </Dialog>
  );
}
