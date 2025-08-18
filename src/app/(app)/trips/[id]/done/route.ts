import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isDone } = await req.json();

    const trip = await db.trip.update({
      where: { id: params.id },
      data: { isDone },
    });
    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update trip" },
      { status: 500 }
    );
  }
}
