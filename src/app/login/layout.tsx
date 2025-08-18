"use client";
import { ar } from "yup-locales";
import * as yup from "yup";
import { ReactNode } from "react";

yup.setLocale(ar);

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
