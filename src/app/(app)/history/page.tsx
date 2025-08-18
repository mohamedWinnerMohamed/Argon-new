// src/app/(app)/_components/history-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { getFinishedTrips } from "../../../apis/history-curd";

interface Trip {
  id: string;
  destination: string;
  price: number;
  arrivalDate: string;
  departureDate: string;
  isDone: boolean;
  createdAt: string;
}

export default function FinishedTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getFinishedTrips();
      setTrips(data);
    }
    fetchData();
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">الرحلات المنتهية</h2>
      {trips.length === 0 ? (
        <p>لا توجد رحلات منتهية</p>
      ) : (
        <ul className="space-y-2">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="p-3 bg-gray-100 rounded-lg flex justify-between"
            >
              <div>
                <p className="font-semibold">{trip.destination}</p>
                <p className="text-sm text-gray-600">
                  تاريخ القيام: {new Date(trip.departureDate).toLocaleString()}
                </p>
              </div>
              <span className="text-green-600 font-bold">✓ انتهت</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}











