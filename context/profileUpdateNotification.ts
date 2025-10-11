// store/notificationStore.ts
import { create } from "zustand";

interface NotificationStore {
  refreshSignal: number; // رقم عشوائي للتغيير
  triggerRefresh: () => void; // function لتحديث الاشعار
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  refreshSignal: 0,
  triggerRefresh: () => set((state) => ({ refreshSignal: state.refreshSignal + 1 })),
}));
