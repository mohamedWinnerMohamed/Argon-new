"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteOfficeButton } from "../_components/delete-office-button";
import { EditOfficeButton } from "../_components/edit-office-button";
import { DisableButtonForNonAdmin } from "@/components/disable-for-non-admin";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Office = {
  id: string;
  name: string;
  username: string;
};

export const columns: ColumnDef<Office>[] = [
  {
    accessorKey: "name",
    header: "إسم المكتب",
  },
  {
    accessorKey: "username",
    header: "إسم المستخدم",
  },
  {
    id: "actions",
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-2">
          <DisableButtonForNonAdmin>
            <EditOfficeButton data={data} />
          </DisableButtonForNonAdmin>
          <DisableButtonForNonAdmin>
            <DeleteOfficeButton id={data.id} />
          </DisableButtonForNonAdmin>
        </div>
      );
    },
  },
];
