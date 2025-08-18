import { CreateOfficeType } from "@/schemas/create-office";
import { EditOfficeType } from "@/schemas/edit-office";
import axios from "axios";

export function createOffice(data: CreateOfficeType) {
  return axios.post("/api/create-office", data);
}

export function deleteOffice(data: { id: string }) {
  return axios.post("/api/delete-office", data);
}

export function editOffice(data: EditOfficeType & { id: string }) {
  return axios.post("/api/edit-office", data);
}
