"use client";
import { Movable, Sender } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type PageType = {
//   id: string;
//   name: string;
//   destination: string;
//   passportNo: string | number;
// };

export const columns: ColumnDef<Movable & { sender: Sender }>[] = [
  {
    id: "passengerName",
    header: "إسم المرسِل",
    cell: ({ row: { original } }) => original.sender.name,
  },
  {
    id: "passengerPhone",
    header: "رقم هاتف المرسِل",
    cell: ({ row: { original } }) => original.sender.phone,
  },
  {
    accessorKey: "receiverName",
    header: "إسم المستلم",
  },
  {
    accessorKey: "receiverPhone",
    header: "رقم هاتف المستلم",
  },
  {
    accessorKey: "amount",
    header: "كمية",
  },
  {
    accessorKey: "name",
    header: "إسم المنقول",
  },
  {
    accessorKey: "destination",
    header: "الوجهة",
  },
  {
    accessorKey: "notes",
    header: "ملاحظات",
  },
];
