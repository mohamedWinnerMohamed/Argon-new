import axios from "axios";

export function login(data: { username: string; password: string }) {
  return axios.post("/api/login", data);
}

export function logout() {
  return axios.get("/api/logout");
}
