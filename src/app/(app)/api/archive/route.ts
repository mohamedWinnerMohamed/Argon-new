import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const trips = await db.trip.findMany({
    where: { isDone: true },
    select: {
      id: true,
      destination: true, 
      price: true,
      arrivalDate: true,
      departureDate: true,
      isDone: true,
    },
  });
  return NextResponse.json(trips);
}
