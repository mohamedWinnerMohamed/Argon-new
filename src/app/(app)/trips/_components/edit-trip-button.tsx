import { editTrip } from "@/apis/trip-crud";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiErrorHandler } from "@/lib/handle-api-errors";
import { editTripSchema, EditTripType } from "@/schemas/edit-trip";
import { yupResolver } from "@hookform/resolvers/yup";
import { Pencil } from "@phosphor-icons/react";
import { ar } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { toast } from "sonner";

export function EditTripButton({
  data: { id, departureDate, arrivalDate, ...data },
  ...props
}: {
  data: {
    destination: string;
    price: number;
    id: string;
    departureDate: Date;
    arrivalDate: Date;
  };
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EditTripType>({
    resolver: yupResolver(editTripSchema),
    values: {
      departureDate: new Date(departureDate),
      arrivalDate: new Date(arrivalDate),
      ...data,
    },
  });

  const { field: arrivialField } = useController({
    control,
    name: "arrivalDate",
  });

  const { field: departureField } = useController({
    control,
    name: "departureDate",
  });

  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const [isPending, setIsPending] = useState<boolean>(false);

  async function onSubmit(data: Omit<EditTripType, "id">) {
    setIsPending(true);
    const res = await apiErrorHandler(editTrip({ ...data, id }));
    setIsPending(false);

    if (!res) return;

    const message = res.data.message;

    toast.success(message);
    setOpen(false);

    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open === true) reset();

        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button {...props} size="icon" variant="outline">
          <Pencil size={32} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل رحلة</DialogTitle>
          <DialogDescription>
            يمكنك التعديل على اي من الحقول التالية
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="w-full flex flex-col gap-3">
            <Label className="w-full" htmlFor="destination-input">
              الوجهة
            </Label>
            <Input
              {...register("destination")}
              placeholder="الوجهة"
              id="destination-input"
            />
            <p className="text-red-500 text-xs">
              {errors?.destination?.message}
            </p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <Label className="w-full" htmlFor="price-input">
              السعر
            </Label>
            <Input
              {...register("price", {
                valueAsNumber: true,
                value: 0,
              })}
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.value === "") {
                  e.target.value = "0";
                }
                e.target.value = e.target.value.replace(/\D+/g, "");
              }}
              type="number"
              placeholder="السعر..."
              id="price-input"
            />
            <p className="text-red-500 text-xs">{errors?.price?.message}</p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <Label className="w-full" htmlFor="arrival-date-input">
              موعد الحضور
            </Label>
            <DateTimePicker
              use12HourFormat
              onChange={arrivialField.onChange}
              value={arrivialField.value}
              locale={ar}
              id="arrival-date-input"
              placeholder="موعد الحضور..."
            />
            <p className="text-red-500 text-xs">
              {errors?.arrivalDate?.message}
            </p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <Label className="w-full" htmlFor="departure-date-input">
              موعد القيام
            </Label>
            <DateTimePicker
              use12HourFormat
              onChange={departureField.onChange}
              value={departureField.value}
              locale={ar}
              id="departure-date-input"
              placeholder="موعد القيام"
            />
            <p className="text-red-500 text-xs">
              {errors?.departureDate?.message}
            </p>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              تحديث
            </Button>
            <DialogClose disabled={isPending} asChild>
              <Button variant="outline" type="button">
                إلغاء
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
