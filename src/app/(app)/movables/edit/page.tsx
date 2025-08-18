import MovablesForm from "./_components/movables-form";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams: propSearchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const searchParams = await propSearchParams;

  const id =
    (Array.isArray(searchParams.id) ? searchParams.id[0] : searchParams.id) ??
    null;

  if (!id) {
    return redirect("/404");
  }

  const sender = await db.sender.findUnique({
    where: { id: id },
    include: {
      movables: true,
    },
  });

  if (!sender) {
    redirect("/404");
  }

  return (
    <div className="flex flex-col p-4 gap-4">
      <p className="text-2xl font-bold">تحديث منقولات</p>
      <MovablesForm initial={sender} senderId={id} />
    </div>
  );
}
