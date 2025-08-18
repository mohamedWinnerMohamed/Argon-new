import { db } from "@/lib/db";
import ClientPage from "../_page";
import { redirect } from "next/navigation";

export default async function Page({
  params: paramsProps,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = await paramsProps;

  const passenger = await db.passenger.findUnique({
    where: { id: params.slug },
    include: {
      trip: {
        select: {
          id: true,
          destination: true,
        },
      },
    },
  });

  if (!passenger) return redirect("/passengers");

  const { price, ...data } = passenger;

  return <ClientPage data={{ ...data, price: price }} />;
}
