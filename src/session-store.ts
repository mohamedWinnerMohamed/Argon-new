import { create } from "zustand";

export type SessionDataType = {
  name: string;
  username: string;
  role: string;
  id: string;
};

export interface SessionType {
  session: SessionDataType | null;
  setSession: (data: SessionDataType) => void;
}

export const useSession = create<SessionType>((set) => ({
  session: null,
  setSession: (data: SessionDataType) => set({ session: data }),
}));
