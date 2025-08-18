import { db } from "@/lib/db";
import TopSection from "./_components/top-section";
import { columns } from "./_table/columns";
import { DataTable } from "./_table/data-table";
import { ServerPaginator } from "@/components/server-paginator";

const ITEMS_PER_PAGE = 8;

export default async function Page({
  searchParams: propSearchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const searchParams = await propSearchParams;

  const page = +(searchParams?.page ?? 1);

  const totalSenders = await db.movable.count();

  const totalSendersPages = Math.ceil(totalSenders / ITEMS_PER_PAGE);

  const senders = await db.sender.findMany({
    where: {
      OR: [
        {
          name: {
            contains: Array.isArray(searchParams?.search)
              ? searchParams?.search[0]
              : (searchParams.search ?? ""),
          },
        },
      ],
    },
    take: ITEMS_PER_PAGE,
    skip: (page - 1) * ITEMS_PER_PAGE,
    include: {
      _count: {
        select: {
          movables: true,
        },
      },
      movables: {
        select: {
          price: true,
        },
      },
    },
  });

  return (
    <div className="p-4 flex flex-col gap-4">
      <p className="text-2xl font-bold">المنقولات</p>
      <TopSection />

      <DataTable columns={columns} data={senders} />

      {totalSendersPages > 1 && <ServerPaginator total={totalSendersPages} />}
    </div>
  );
}
