import { CreateTripType } from "@/schemas/create-trip";
import { EditTripType } from "@/schemas/edit-trip";
import axios from "axios";

export function createTrip(data: CreateTripType) {
  return axios.post("/api/create-trip", data);
}

export function editTrip(data: EditTripType & { id: string }) {
  return axios.post("/api/edit-trip", data);
}

export function deleteTrip(data: { id: string }) {
  return axios.post("/api/delete-trip", data);
}

export function getTrips({
  search = "",
  page = "1",
}: {
  search: string;
  page: string;
}) {
  return axios.get("/api/get-trips", {
    params: {
      search,
      page,
    },
  });
}
