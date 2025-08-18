import { db } from "@/lib/db";
import ClientPage from "./_components/client-page";

export default async function Page({
  searchParams: propSearchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const searchParams = await propSearchParams;

  const movables = await db.movable.findMany({
    where: {
      senderId: Array.isArray(searchParams.id)
        ? searchParams.id[0]
        : searchParams.id,
    },
    include: {
      sender: true,
    },
  });
  return <ClientPage data={movables} />;
}
