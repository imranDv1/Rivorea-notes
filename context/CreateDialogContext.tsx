"use client";
import { createContext, useState, useContext, ReactNode } from "react";

// إنشاء الـ context
const DialogContext = createContext({
  isDialogOpen: false,
  openDialog: () => {},
  closeDialog: () => {},
  toggleDialog: () => {},
});

// المزود (Provider)
export function DialogProvider({ children }: {children:ReactNode}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // دوال لتغيير الحالة
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const toggleDialog = () => setIsDialogOpen((prev) => !prev);

  return (
    <DialogContext.Provider
      value={{ isDialogOpen, openDialog, closeDialog, toggleDialog }}
    >
      {children}
    </DialogContext.Provider>
  );
}

// Hook للاستخدام السهل
export function useDialog() {
  return useContext(DialogContext);
}
