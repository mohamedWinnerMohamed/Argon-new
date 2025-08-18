"use client";
import { Passenger, Trip } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type PageType = {
//   id: string;
//   name: string;
//   destination: string;
//   passportNo: string | number;
// };

export const columns: ColumnDef<Passenger & { trip: Trip }>[] = [
  {
    id: "seatNo",
    header: "م",
    cell: ({ row: { original, index } }) => original.seatNo ?? index + 1,
  },
  {
    accessorKey: "name",
    header: "أسماء الركاب",
    cell: ({
      row: {
        original: { fullName },
      },
    }) => fullName,
  },
  {
    accessorKey: "destination",
    header: "الجهة",
    cell: ({
      row: {
        original: { destination },
      },
    }) => destination,
  },
  {
    accessorKey: "phone",
    header: "رقم التلفون",
    cell: ({
      row: {
        original: { phone },
      },
    }) => phone,
  },
];
