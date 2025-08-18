import { create } from "zustand";
import { EditPassengerType } from "./schemas/edit-passenger";

export interface SessionType {
  data: EditPassengerType;
  setData: (data: EditPassengerType) => void;
}

export const useEditPassenger = create<SessionType>((set) => ({
  data: {} as EditPassengerType,
  setData: (data: EditPassengerType) => set({ data: data }),
}));
