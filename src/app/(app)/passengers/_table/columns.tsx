"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DeletePassengerButton } from "../_components/delete-passenger-button";
import { EditPassengerButton } from "../_components/edit-passenger-button";
import TicketDialog from "@/components/ticket-dialog";
import { Button } from "@/components/ui/button";
import { TicketType } from "@/components/ticket";
import { Ticket } from "@phosphor-icons/react";
import { Office, Passenger, Trip } from "@prisma/client";
import { DisableButtonForNonAdmin } from "@/components/disable-for-non-admin";
import DisableButtonForOtherOffices from "@/components/disable-for-other-offices";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<
  Passenger & { trip: Trip; createdBy: Office | null }
>[] = [
  {
    accessorKey: "fullName",
    header: "الإسم",
  },
  {
    accessorKey: "mediatorName",
    header: "الوسيط",
    cell: ({ row: { original: data } }) =>
      data?.mediatorName ? data?.mediatorName : "-",
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
  },
  {
    accessorKey: "trip",
    header: "الرحلة",
    cell: ({ row: { original: data } }) => data.trip.destination,
  },
  {
    accessorKey: "seatNo",
    header: "رقم المقعد",
  },
  {
    accessorKey: "passportNo",
    header: "رقم الباسبورت",
  },
  {
    accessorKey: "price",
    header: "سعر خاص",
    cell: ({ row: { original: data } }) => data?.price ?? "-",
  },
  {
    accessorKey: "createdBy",
    header: "إسم المسجِل",
    cell: ({ row: { original: data } }) =>
      data?.createdBy ? data?.createdBy.name : "مسؤول النظام",
  },
  {
    id: "actions",
    cell: ({ row: { original: data } }) => {
      const ticketData = {
        name: data.fullName,
        mediatorName: data.mediatorName,
        price: data.price ? data.price + "" : data.trip.price + "",
        seatNo: data.seatNo + "",
        createdAt: data.createdAt.toString(),
        arrivalDate: data.trip.arrivalDate.toString(),
        departureDate: data.trip.departureDate.toString(),
        code: data.code,
        trip: `${data.trip.destination} - ${data.destination}`,
      } as TicketType;

      return (
        <div className="flex gap-2">
          <TicketDialog {...ticketData}>
            <Button size="icon">
              <Ticket />
            </Button>
          </TicketDialog>
          <DisableButtonForOtherOffices officeId={data.officeId!}>
            <EditPassengerButton id={data.id} />
          </DisableButtonForOtherOffices>
          <DisableButtonForNonAdmin>
            <DeletePassengerButton id={data.id} />
          </DisableButtonForNonAdmin>
        </div>
      );
    },
  },
];
