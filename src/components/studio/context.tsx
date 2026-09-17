"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface StudioContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <StudioContext.Provider value={{ open, setOpen }}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside <StudioProvider>");
  return ctx;
}
