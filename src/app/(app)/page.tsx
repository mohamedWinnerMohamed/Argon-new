import { DataTable } from "./_table/data-table";
import { columns } from "./_table/columns";
import TopSection from "./_components/top-section";
import { db } from "@/lib/db";
import { ServerPaginator } from "@/components/server-paginator";

const ITEMS_PER_PAGE = 8;

export default async function HomePage({
  searchParams: PropsSearchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const searchParams = await PropsSearchParams;

  const page = +(searchParams?.page ?? 1);

  const totalOffices = await db.office.count();

  const totalOfficesPages = Math.ceil(totalOffices / ITEMS_PER_PAGE);

  const offices = await db.office.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchParams?.search ?? "",
          },
        },
        {
          username: {
            contains: searchParams?.search ?? "",
          },
        },
      ],
    },
    take: ITEMS_PER_PAGE,
    skip: (page - 1) * ITEMS_PER_PAGE,
    select: {
      username: true,
      id: true,
      name: true,
    },
  });

  return (
    <div className="p-4 flex flex-col gap-4">
      <p className="text-2xl font-bold">المكاتب</p>
      <TopSection />

      <DataTable
        columns={columns}
        data={
          offices as {
            id: string;
            name: string;
            username: string;
          }[]
        }
      />

      {totalOfficesPages > 1 && <ServerPaginator total={totalOfficesPages} />}
    </div>
  );
}
