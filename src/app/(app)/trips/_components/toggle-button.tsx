"use client";

import { useState } from "react";
import { Check, X } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function ToggleTripButton({
  id,
  initialState,
}: {
  id: string;
  initialState: boolean;
}) {
  const [isDone, setIsDone] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/trips/${id}/done`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDone: !isDone }),
      });

      if (res.ok) {
        const newState = !isDone;
        setIsDone(newState);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-[0.60rem] py-1 rounded-md hover:opacity-95 ${
        isDone ? "bg-gray-400" : "bg-green-500"
      } text-white`}
    >
      {isDone ? (
        <X size={17} weight="bold" />
      ) : (
        <Check size={17} weight="bold" />
      )}
    </button>
  );
}
