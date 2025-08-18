"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "@phosphor-icons/react";
import { Cairo } from "next/font/google";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { DataTable } from "../_table/data-table";
import { columns } from "../_table/columns";
import { Passenger, Trip } from "@prisma/client";
import { format } from "date-fns";

const font = Cairo({
  subsets: ["arabic", "latin"],
});

const pageStyle = `
@media all {
  .page-break {
    display: none;
  }
}

@media print {
  html, body {
    height: initial !important;
    overflow: initial !important;
    -webkit-print-color-adjust: exact;
  }

  body {
    zoom: 0.9;
  }
}

@media print {
  .page-break {
    margin-top: 1rem;
    display: block;
    page-break-before: always;
  }
}

@page {
  size: auto;
  margin: 10mm;
}
`;

const MAX_ITEMS_PER_PAGE = 26;

type DataType = (Passenger & { trip: Trip })[];

function chunkArray(array: DataType, chunkSize: number) {
  const result = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
}

export default function ClientPage({ data = [] }: { data: DataType }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle,
  });

  const array = chunkArray(data, MAX_ITEMS_PER_PAGE);

  return (
    <div className="w-full min-h-[100dvh] bg-gray-100">
      <div
        className={`${font.className} flex flex-col`}
        style={{ direction: "rtl" }}
        ref={contentRef}
      >
        <div className="max-w-[850px] w-full aspect-[220/297] mx-auto bg-white p-4 flex flex-col gap-4 scale-80">
          <div className="w-full flex justify-between">
            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold">عرجون لخدمات السفر</p>
              <p className="font-bold p-1 border border-black rounded-lg w-max">
                كشف اسماء الركاب
              </p>
            </div>
            <div>
              <p>
                التاريخ:
                {" " + format(new Date(), "dd/MM/yyyy")}
              </p>
              <p>إسم السائق: ...........................................</p>
              <p>رقم السيارة: ............................................</p>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_1px_1fr] w-full border rounded-lg">
            <DataTable columns={columns} data={array[0]} />
            <div className="w-full h-full bg-gray-200" />
            <DataTable columns={columns} data={array[1]} />
          </div>
        </div>
        {/* <div className="page-break" /> */}
      </div>
      <div className="max-w-[680px] w-full fixed bottom-5 left-1/2 -translate-x-1/2 flex px-5">
        <Button
          className="w-10 h-10 rounded-full shadow-lg"
          onClick={() => reactToPrintFn()}
        >
          <Printer size={30} />
        </Button>
      </div>
    </div>
  );
}
