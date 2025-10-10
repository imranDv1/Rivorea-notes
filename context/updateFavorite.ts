// store/notificationStore.ts
import { create } from "zustand";

interface NotificationStore {
  refreshFavSignal: number; // رقم عشوائي للتغيير
  triggerFavRefresh: () => void; // function لتحديث الاشعار
}

export const useFavNotificationStore = create<NotificationStore>((set) => ({
  refreshFavSignal: 0,
  triggerFavRefresh: () => set((state) => ({ refreshFavSignal: state.refreshFavSignal + 1 })),
}));
