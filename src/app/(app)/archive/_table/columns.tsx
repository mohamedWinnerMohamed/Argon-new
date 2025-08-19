"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DisableButtonForNonAdmin } from "@/components/disable-for-non-admin";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ManifestoButton } from "../_components/manifesto-button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Trip = {
  id: string;
  destination: string;
  price: number;
  arrivalDate: Date;
  departureDate: Date;
  _count: { passengers: number };
  createdAt: Date;
  isDone: boolean;
};

export const columns: ColumnDef<Trip>[] = [
  {
    accessorKey: "destination",
    header: "الوجهة",
  },
  {
    accessorKey: "price",
    header: "السعر",
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    cell: ({ row: { original: data } }) =>
      format(new Date(data.createdAt), "yyyy/M/d (hh:mm a)", { locale: ar }),
  },
  {
    accessorKey: "arrivalDate",
    header: "موعد الحضور",
    cell: ({ row: { original: data } }) =>
      format(data.arrivalDate, "MMM d, yyyy hh:mm a", {
        locale: ar,
      }),
  },
  {
    accessorKey: "departureDate",
    header: "موعد القيام",
    cell: ({ row: { original: data } }) =>
      format(data.departureDate, "MMM d, yyyy hh:mm a", {
        locale: ar,
      }),
  },
  {
    id: "passengersCount",
    header: "عدد المسافرين",
    cell: ({ row: { original: data } }) => data._count.passengers,
  },
  {
    id: "actions",
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex flex-end gap-2">
          <div className="w-9 h-9">
            <ManifestoButton
              id={data.id}
              disabled={data._count.passengers <= 0}
            />
          </div>
        </div>
      );
    },
  },
];
