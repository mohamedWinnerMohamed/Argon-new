"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "@phosphor-icons/react";
import { Cairo } from "next/font/google";
import { Fragment, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { DataTable } from "../_table/data-table";
import { columns } from "../_table/columns";
import { Movable, Sender } from "@prisma/client";
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
  margin: 20mm;
}
`;

const MAX_ITEMS_PER_PAGE = 6;

type DataType = (Movable & { sender: Sender })[];

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
        {array.map((data, index) => (
          <Fragment key={index}>
            <div className="max-w-[740px] w-full aspect-[4/3] mx-auto bg-white p-4 flex flex-col gap-4">
              <div className="w-full flex justify-between">
                <div className="flex flex-col gap-4">
                  <p className="text-lg font-bold">مشروع عرجون للنقل</p>
                  <p className="font-bold p-1 border border-black rounded-lg w-max">
                    إيصال سداد عفش
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-[200px] justify-end">
                  <p>التاريخ: {format(new Date(), "dd/MM/yyyy")}</p>
                  <div className="grid grid-cols-[auto_1fr] gap-2 w-full">
                    <p>رقم الرحلة:</p>
                    <span className="border border-black border-dotted h-0 w-full self-end" />
                  </div>
                </div>
              </div>
              <DataTable columns={columns} data={data} />
              <div className="mt-auto flex flex-col gap-2">
                <p className="font-bold">
                  ملحوظة: الشركة غير مسئولة عن العفش داخل الباص وخارجه على
                  مسئولية صاحبه
                </p>
                <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-2">
                  <p>إسم المستلم:</p>
                  <span className="border border-black border-dotted h-0 self-end" />
                  <p>رقم جوال المستلم:</p>
                  <span className="border border-black border-dotted h-0 self-end" />
                  <p>التوقيع:</p>
                  <span className="border border-black border-dotted h-0 self-end" />
                </div>
              </div>
            </div>
            {index !== array.length - 1 && <div className="page-break" />}
          </Fragment>
        ))}
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
