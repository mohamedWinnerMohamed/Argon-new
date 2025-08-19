import axios from "axios";

const API_URL = "/api/archive";

export async function getFinishedTrips() {
  try {
    const res = await axios.get("/api/archive");
    return res.data;
  } catch (error) {
    console.error("Error fetching finished trips:", error);
    throw error;
  }
}
