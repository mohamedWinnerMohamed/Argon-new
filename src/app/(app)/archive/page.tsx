import { db } from "@/lib/db";
import TopSection from "./_components/top-section";
import { columns } from "./_table/columns";
import { DataTable } from "./_table/data-table";
import { ServerPaginator } from "@/components/server-paginator";

const ITEMS_PER_PAGE = 20;

export default async function Page({
  searchParams: PropsSearchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const searchParams = await PropsSearchParams;

  const page = +(searchParams?.page ?? 1);

  const totalTrips = await db.trip.count();

  const totalTripsPages = Math.ceil(totalTrips / ITEMS_PER_PAGE);


  const trips = await db.trip.findMany({
    where: {
      isDone: true,
      OR: [
        {
          destination: {
            contains: searchParams?.search ?? "",
          },
        },
      ],
    },
    take: ITEMS_PER_PAGE,
    skip: (page - 1) * ITEMS_PER_PAGE,

    include: {
      _count: {
        select: {
          passengers: true,
        },
      },
    },
  });


  return (
    <div className="p-4 flex flex-col gap-4">
      <p className="text-2xl font-bold">ارشيف</p>
      <TopSection />

      <DataTable columns={columns} data={trips} />

      {totalTripsPages > 1 && <ServerPaginator total={totalTripsPages} />}
    </div>
  );
}
