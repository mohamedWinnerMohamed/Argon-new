"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function TopSection() {
  const [search, setSearch] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const mutableSearchParams = new URLSearchParams(searchParams);

    mutableSearchParams.set("search", search);

    router.push(`?${mutableSearchParams}`);
  }

  function clear() {
    setSearch("");

    const mutableSearchParams = new URLSearchParams(searchParams);

    mutableSearchParams.delete("search");

    router.push(`?${mutableSearchParams}`);
  }

  return (
    <div className="flex justify-between gap-4">
      <form onSubmit={handleSubmit} className="relative max-w-[250px] w-full">
        <Input
          placeholder="بحث"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {!search && (
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            color="#94a3b8"
          />
        )}
        {!!search && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 h-full aspect-square flex justify-center items-center"
            onClick={clear}
            type="button"
          >
            <X size={15} weight="bold" className="text-red-500" />
          </button>
        )}
      </form>
      <Button asChild>
        <Link href="/movables/create">إضافة</Link>
      </Button>
    </div>
  );
}
