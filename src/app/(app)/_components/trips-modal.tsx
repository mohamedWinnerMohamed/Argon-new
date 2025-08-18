"use client";
import { getTrips } from "@/apis/trip-crud";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiErrorHandler } from "@/lib/handle-api-errors";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export interface TripsModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (trip: { value: string; label: string }) => void;
  children: ReactNode;
}

export function TripsModal({
  open,
  onClose,
  children,
  onSelect,
}: TripsModalProps) {
  const [trips, setTrips] = useState<{ value: string; label: string }[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const doMorePagesExist = !isLastPage;
  const isEmpty = isLastPage && trips.length <= 0;

  async function getMoreTrips() {
    if (isLastPage) return;
    setIsLoading(true);
    const res = await apiErrorHandler(getTrips({ search, page: page + "" }));
    setIsLoading(false);

    if (!res) return;

    const { lastPage, trips } = res.data as {
      trips: { id: string; destination: string }[];
      lastPage: number;
    };

    setTrips((prev) => [
      ...(prev ? prev : []),
      ...trips.map((trip) => ({ value: trip.id, label: trip.destination })),
    ]);

    setPage((prev) => ++prev);

    if (page >= lastPage) {
      setIsLastPage(true);
    }
  }

  useEffect(() => {
    if (open === true) getMoreTrips();
    else {
      setSearch("");
      setTrips([]);
      setPage(1);
      setIsLastPage(false);
      setSearchValue("");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, search]);

  function clear() {
    if (isLastPage && search) setIsLastPage(false);
    setSearchValue("");
    setSearch("");
    setPage(1);
    setTrips([]);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-2 p-4">
        <DialogTitle>إختر الرحلة</DialogTitle>
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (searchValue === "") return;

            setSearch(searchValue);
            setTrips([]);
            setPage(1);
            setIsLastPage(false);
          }}
        >
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="بحث..."
          />
          {!searchValue && (
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              color="#94a3b8"
            />
          )}
          {!!searchValue && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 h-full aspect-square flex justify-center items-center"
              onClick={clear}
              type="button"
            >
              <X size={15} weight="bold" className="text-red-500" />
            </button>
          )}
        </form>
        <div className="flex flex-col overflow-y-auto gap-2 max-h-[400px]">
          {!isEmpty &&
            trips!.map((trip) => (
              <Button
                variant="ghost"
                className="justify-start"
                key={trip.value}
                onClick={() => {
                  onSelect(trip);
                  onClose();
                }}
              >
                {trip.label}
              </Button>
            ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {doMorePagesExist && !isLoading && (
            <Button variant="outline" onClick={() => getMoreTrips()}>
              مزيد من الرحلات
            </Button>
          )}
          {isEmpty && <p className="w-full p-2 text-center">لا يوجد نتائج</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
