"use client";
import { Sender } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DeleteMovablesButton from "../_components/delete-button";
import { Button } from "@/components/ui/button";
import { ClipboardText, Pencil, Receipt } from "@phosphor-icons/react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<
  Sender & { _count: { movables: number }; movables: { price: number }[] }
>[] = [
  {
    accessorKey: "name",
    header: "إسم المرسِل",
  },
  {
    accessorKey: "phone",
    header: "رقم هاتف المرسِل",
  },
  {
    id: "movablesAmount",
    header: "عدد انواع المنقولات",
    cell: ({ row: { original } }) => original._count.movables,
  },
  {
    id: "totalPrice",
    header: "إجمالي السعر",
    cell: ({ row: { original } }) =>
      original.movables
        .map((movable) => movable.price)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
  },
  {
    id: "actions",
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-2">
          <Button size="icon" asChild>
            <Link href={`/movables-receipt?id=${data.id}`}>
              <Receipt />
            </Link>
          </Button>
          <Button size="icon" variant="outline" asChild>
            <Link href={`/movables-manifesto?id=${data.id}`}>
              <ClipboardText />
            </Link>
          </Button>
          <Button size="icon" variant="outline" asChild>
            <Link href={`/movables/edit?id=${data.id}`}>
              <Pencil />
            </Link>
          </Button>
          <DeleteMovablesButton id={data.id} />
        </div>
      );
    },
  },
];
