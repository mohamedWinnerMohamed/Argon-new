"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import { TripsModal } from "../../_components/trips-modal";
import { cn } from "@/lib/utils";
import { useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createPassengerSchema,
  CreatePassengerType,
} from "@/schemas/create-passenger";
import { PhoneInput } from "@/components/ui/phone-input";
import { apiErrorHandler } from "@/lib/handle-api-errors";
import { editPassenger } from "@/apis/passenger-crud";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditPassengerType } from "@/schemas/edit-passenger";
import TicketDialog from "@/components/ticket-dialog";
import { TicketType } from "@/components/ticket";
import { Passenger, Trip } from "@prisma/client";

export default function ClientPage({
  data: { trip: tripProp, phone: phoneProp, ...data },
}: {
  data: Omit<EditPassengerType, "trip"> & {
    trip: { id: string; destination: string };
  };
}) {
  const [ticket, setTicket] = useState<TicketType | null>();
  const [trip, setTrip] = useState<{ value: string; label: string } | null>({
    label: tripProp.destination,
    value: tripProp.id,
  });
  const [openTrips, setOpenTrips] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePassengerType>({
    resolver: yupResolver(createPassengerSchema),
    values: {
      ...data,
      phone: phoneProp.replace(/\s/g, ""),
      trip: tripProp.id,
    },
  });

  const { field: tripField } = useController({ control, name: "trip" });
  const { field: phoneField } = useController({ control, name: "phone" });

  async function onSubmit({ price, ...data }: CreatePassengerType) {
    setIsPending(true);

    const res = await apiErrorHandler(
      editPassenger({
        ...data,
        ...(price ? { price: +price } : {}),
      }),
    );

    setIsPending(false);

    if (!res) return;

    toast.success(res.data.message);

    const ticketData = res.data.data as { trip: Trip } & Passenger;

    setTicket({
      name: ticketData.fullName,
      code: ticketData.code,
      seatNo: ticketData.seatNo.toString(),
      price: ticketData.price
        ? ticketData.price.toString()
        : ticketData.trip.price.toString(),
      departureDate: ticketData.trip.departureDate.toString(),
      arrivalDate: ticketData.trip.arrivalDate.toString(),
      createdAt: ticketData.createdAt.toString(),
      trip: `${ticketData.trip.destination} - ${ticketData.destination}`,
    });
  }

  return (
    <div className="p-4 overflow-y-auto">
      <p className="text-2xl font-bold">تحديث مسافر</p>
      <p className="text-muted-foreground">
        الرجاء ملئ الحقول التالية لتحديث المسافر
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="py-4 gap-4 md:grid md:grid-cols-2 flex flex-col"
      >
        <div className="flex flex-col gap-3 w-full">
          <Label className="w-full" htmlFor="name-input">
            الإسم
          </Label>
          <Input
            {...register("fullName")}
            placeholder="الإسم..."
            id="name-input"
          />
          <p className="text-red-500 text-xs">{errors?.fullName?.message}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label className="w-full" htmlFor="phone-input">
            رقم الهاتف
          </Label>
          <PhoneInput
            value={phoneField.value}
            onChange={({ target: { value } }) => phoneField.onChange(value)}
            placeholder="رقم الهاتف..."
            id="phone-input"
          />
          <p className="text-red-500 text-xs">{errors?.phone?.message}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label className="w-full" htmlFor="seat-no-input">
            رقم الكرسي
          </Label>
          <Input
            type="number"
            {...register("seatNo")}
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.value === "") {
                e.target.value = "0";
              }
              e.target.value = e.target.value.replace(/\D+/g, "");
            }}
            placeholder="رقم الكرسي..."
            id="seat-no-input"
          />
          <p className="text-red-500 text-xs">{errors?.seatNo?.message}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label className="w-full" htmlFor="passport-no-input">
            رقم الباسبورت
          </Label>
          <Input
            {...register("passportNo")}
            placeholder="رقم الباسبورت..."
            id="passport-no-input"
          />
          <p className="text-red-500 text-xs">{errors?.passportNo?.message}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label className="w-full" htmlFor="destination-input">
            الوجهة
          </Label>
          <Input
            {...register("destination")}
            placeholder="الوجهة..."
            id="destination-input"
          />
          <p className="text-red-500 text-xs">{errors?.destination?.message}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label className="w-full" htmlFor="price-input">
            سعر خاص (إختياري)
          </Label>
          <Input
            {...register("price")}
            type="number"
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.value === "") {
                e.target.value = "0";
              }
              e.target.value = e.target.value.replace(/\D+/g, "");
            }}
            placeholder="سعر خاص..."
            id="price-input"
          />
          <p className="text-red-500 text-xs">{errors?.price?.message}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label className="w-full" htmlFor="trip-input">
            الرحلة
          </Label>
          <TripsModal
            open={openTrips}
            onClose={() => setOpenTrips(false)}
            onSelect={(trip) => {
              setTrip(trip);
              tripField.onChange(trip.value);
            }}
          >
            <Button
              onClick={() => setOpenTrips((prev) => !prev)}
              type="button"
              id="trip-input"
              variant="outline"
              className="justify-start px-3 gap-1"
            >
              <p
                className={cn(
                  (!tripField.value || !trip) && "text-muted-foreground",
                )}
              >
                {tripField.value && trip ? trip.label : "الرحلة..."}
              </p>
            </Button>
          </TripsModal>
          <p className="text-red-500 text-xs">{errors?.trip?.message}</p>
        </div>
        <div className="flex gap-2 col-span-2">
          <Button disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            تحديث
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/passengers")}
          >
            إلغاء
          </Button>
        </div>
      </form>
      <TicketDialog
        open={Boolean(ticket)}
        onClose={() => setTicket(null)}
        {...ticket}
      />
    </div>
  );
}
