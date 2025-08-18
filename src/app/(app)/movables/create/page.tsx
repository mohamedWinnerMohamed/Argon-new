import MovablesForm from "./_components/movables-form";

export default async function Page() {
  return (
    <div className="flex flex-col p-4 gap-4">
      <p className="text-2xl font-bold">إضافة منقولات</p>
      <MovablesForm />
    </div>
  );
}
