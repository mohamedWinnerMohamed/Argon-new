import axios from "axios";

const API_URL = "/api/history";

export async function getFinishedTrips() {
  try {
    const res = await axios.get("/api/history");
    return res.data;
  } catch (error) {
    console.error("Error fetching finished trips:", error);
    throw error;
  }
}
