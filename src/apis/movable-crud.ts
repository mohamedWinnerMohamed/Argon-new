import { CreateMovableSchemaType } from "@/schemas/create-movable";
import { EditMovableSchemaType } from "@/schemas/edit-movable";
import axios from "axios";

export function createMovables(data: CreateMovableSchemaType) {
  return axios.post("/api/create-movables", data);
}

export function deleteMovables(data: { id: string }) {
  return axios.post("/api/delete-movables", data);
}

export function editMovables(
  data: EditMovableSchemaType & {
    senderId: string;
    movables?: { id?: string }[];
  },
) {
  return axios.post("/api/edit-movables", data);
}
