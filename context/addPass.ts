// store/notificationStore.ts
import { create } from "zustand";

interface NotificationAddPassStore {
  refreshAddPassSignal: number; // رقم عشوائي للتغيير
  refreshAddPass: () => void; // function لتحديث الاشعار
}

export const useAddPassNotificationStore = create<NotificationAddPassStore>((set) => ({
  refreshAddPassSignal: 0,
  refreshAddPass: () => set((state) => ({ refreshAddPassSignal: state.refreshAddPassSignal + 1 })),
}));
