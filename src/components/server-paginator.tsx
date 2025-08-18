"use client";

import { usePagination } from "@mantine/hooks";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ServerPaginator({ total }: { total: number }) {
  const searchParams = useSearchParams();

  const router = useRouter();

  const { previous, next, active, setPage, range } = usePagination({
    total,
  });

  useEffect(() => {
    const mutableSearchParams = new URLSearchParams(searchParams);

    mutableSearchParams.set("page", active + "");

    router.push(`?${mutableSearchParams.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={previous} />
        </PaginationItem>
        
        {range.map((item, index) => {
          if (item === "dots")
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );

          return (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={active === item}
                onClick={() => setPage(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext onClick={next} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
