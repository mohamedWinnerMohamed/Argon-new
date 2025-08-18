import { db } from "@/lib/db";
import ClientPage from "./_components/client-page";

export default async function Page({
  searchParams: propSearchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const searchParams = await propSearchParams;

  const passengers = await db.passenger.findMany({
    where: {
      tripId: Array.isArray(searchParams.id)
        ? searchParams.id[0]
        : searchParams.id,
    },
    include: {
      trip: true,
    },

    orderBy: {
      seatNo: "asc",
    },
  });

  const seatsArray = new Array(52)
    .fill({
      seatNo: "-",
      passportNo: "-",
      fullName: "-",
      destination: "-",
    })
    .map((item, index) => {
      const seatNo = index + 1;
      const passenger = passengers.find(
        (passenger) => passenger.seatNo === seatNo,
      );

      if (passenger) return passenger;
      else return { ...item, seatNo };
    });

  return <ClientPage data={seatsArray} />;
}
