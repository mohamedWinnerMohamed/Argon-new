import { db } from "@/lib/db";
import { APIError } from "@/lib/handle-api-errors";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 8;

export async function GET(request: NextRequest) {
  try {
    const page = +(request.nextUrl.searchParams?.get("page") ?? 1);
    const search = request.nextUrl.searchParams?.get("search") ?? "";

    const totalTrips = await db.trip.count({
      where: {
        destination: {
          contains: search,
        },
      },
    });

    const totalPages = Math.ceil(totalTrips / ITEMS_PER_PAGE);

    const trips = await db.trip.findMany({
      where: {
        destination: {
          contains: search,
        },
      },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
      select: {
        destination: true,
        id: true,
      },
    });

    console.log("PAGE", page);
    console.log("SEARCH", search);
    console.log("TRIPS", trips);

    console.log("TOTAL PAGES", totalPages);

    return NextResponse.json(
      {
        trips,
        lastPage: totalPages || 1,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      new APIError(
        "خطأ",
        "حدث خطأ غير معروف اثناء الحصول على البيانات من قاعدة البيانات",
      ),
      { status: 200 },
    );
  }
}
