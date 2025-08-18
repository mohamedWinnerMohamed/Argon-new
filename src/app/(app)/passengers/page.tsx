import { ServerPaginator } from "@/components/server-paginator";
import { db } from "@/lib/db";
import { DataTable } from "./_table/data-table";
import { columns } from "./_table/columns";
import TopSection from "./_components/top-section";

const ITEMS_PER_PAGE = 20;

export default async function Page({
  searchParams: PropsSearchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const searchParams = await PropsSearchParams;

  const page = +(searchParams?.page ?? 1);

  const totalPassengers = await db.passenger.count();

  const totalPassengersPages = Math.ceil(totalPassengers / ITEMS_PER_PAGE);

  const passengers = await db.passenger.findMany({
    where: {
      OR: [
        {
          fullName: {
            contains: searchParams?.search ?? "",
          },
        },
      ],
    },
    take: ITEMS_PER_PAGE,
    skip: (page - 1) * ITEMS_PER_PAGE,
    include: {
      trip: true,
      createdBy: true,
    },
  });

  return (
    <div className="p-4 flex flex-col gap-4">
      <p className="text-2xl font-bold">المسافرين</p>
      <TopSection />

      <DataTable columns={columns} data={passengers} />

      {totalPassengersPages > 1 && (
        <ServerPaginator total={totalPassengersPages} />
      )}
    </div>
  );
}
