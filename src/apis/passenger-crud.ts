import { CreatePassengerType } from "@/schemas/create-passenger";
import { EditPassengerType } from "@/schemas/edit-passenger";
import axios from "axios";

export function createPassenger(
  data: Omit<CreatePassengerType, "price"> & { price?: number },
) {
  return axios.post("/api/create-passenger", data);
}

export function editPassenger(
  data: Omit<EditPassengerType, "price"> & { price?: number },
) {
  return axios.post("/api/edit-passenger", data);
}

export function deletePassenger(data: { id: string }) {
  return axios.post("/api/delete-passenger", data);
}
