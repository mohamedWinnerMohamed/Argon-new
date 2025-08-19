"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Cairo } from "next/font/google";
import { format } from "date-fns";
import { Optional } from "@prisma/client/runtime/library";

const font = Cairo({
  subsets: ["arabic", "latin"],
});

export type TicketType = {
  name: string;
  mediatorName: string | null;
  arrivalDate: string;
  departureDate: string;
  seatNo: string;
  createdAt: string;
  code: string;
  trip: string;
};

const rules = [
  "التذكرة لا تُرد بعد صرفها وعند إرتجاعها يخصم 30% من القيمة",
  "اي عفش زائد عن حقيبة الملابس يدفع له قيمة",
  "عدم اصطحاب الحيوانات والمواد المحظورة داخل الحقائب",
  "الشركة غير مسئولة عن فقدان الأشياء الثمينة داخل الحقائب",
  "في حالة وجود عفش زائد يجب حضور الراكب قبل الميعاد بساعتين",
  "العفش على مسئولية صاحبه طوال الرحلة",
];

const Ticket = forwardRef<HTMLDivElement, Optional<TicketType>>(
  (
    {
      code = "SF23$%21S",
      name = "محمد ماهر حسن محمد",
      arrivalDate = "10-4-2025",
      departureDate = "10-4-2025",
      seatNo = "5",
      createdAt = "10-4-2025",
      trip = "السودان",
    },
    ref,
  ) => {
    return (
      <div
        dir="ltr"
        className={cn(
          "w-[15cm] h-[10cm] bg-gradient-to-r from-blue-100 to-blue-300 flex flex-row-reverse",
          font.className
        )}
        style={{
          backgroundImage: `url("/images/blue-blobs.png")`,
          backgroundSize: "cover",
          backgroundColor: "rgba(0,0,0,0.2)",
          backgroundBlendMode: "multiply",
        }}
        ref={ref}
      >
        <div className="flex flex-col gap-2 w-full p-4">
          <div className="flex flex-row-reverse gap-4 items-center">
            <Image
              src="/images/logo.png"
              width={50}
              height={50}
              alt="Logo"
              className="rounded-full"
            />
            <p className="font-black text-white text-2xl">شركة خواطر</p>
          </div>
          <div className="p-1 rounded-full bg-black/20 font-bold text-white backdrop-blur-lg relative">
            <p className="text-right absolute top-2 right-2 text-xs">الكود</p>
            <p className="text-center">{code}</p>
          </div>
          <div className="w-full flex gap-8 flex-row-reverse">
            <p className="text-white font-black text-sm">الإسم: {name}</p>
            <p className="text-white font-black text-sm">الوجهة: {trip}</p>
          </div>
          <table className="text-xs text-white rounded-lg overflow-hidden">
            <thead className="bg-black/30 backdrop-blur-lg">
              <tr>
                <th className="p-2">تاريخ الحجز</th>
                <th className="p-2">رقم المقعد</th>
                <th className="p-2">القيام</th>
                <th className="p-2">الحضور</th>
              </tr>
            </thead>
            <tbody className="bg-black/20 backdrop-blur-lg">
              <tr>
                <td align="right" className="p-2">
                  {format(createdAt, "d/M/yyyy hh:mm a")}
                </td>
                <td align="right" className="p-2">
                  {seatNo}
                </td>
                <td align="right" className="p-2">
                  {format(departureDate, "d/M/yyyy hh:mm a")}
                </td>
                <td align="right" className="p-2">
                  {format(arrivalDate, "d/M/yyyy hh:mm a")}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex flex-col gap-2 items-end">
            <p className="text-white py-1 px-2 border border-white rounded-full">
              تعليمات هامة
            </p>
            <ol className="list-decimal list-inside" dir="rtl">
              {rules.map((rule, index) => (
                <li key={index} className="text-white text-xs">
                  {rule}
                </li>
              ))}
            </ol>
          </div>
        </div>
        {/* <div className="flex-1 relative"> */}
        {/*   <div className="bg-gradient-to-r from-black to-transparent absolute top-0 left-0 w-[200px] h-full"></div> */}
        {/*   <Image */}
        {/*     src="/images/bus-1.jpg" */}
        {/*     width={200} */}
        {/*     height={200} */}
        {/*     alt="First Bus" */}
        {/*     className="w-full h-full bg-mask-r-0 object-cover" */}
        {/*   /> */}
        {/* </div> */}
      </div>
    );
  },
);

Ticket.displayName = "Ticket";

export default Ticket;
