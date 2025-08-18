import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

export class APIError {
  constructor(
    public title: string,
    public description: string,
  ) {}
}

export async function apiErrorHandler(result: Promise<AxiosResponse>) {
  try {
    const res = await result;

    return res;
  } catch (err) {
    const data = (err as AxiosError).response?.data as APIError;
    toast.error(data.title, { description: data.description });

    return null;
  }
}
