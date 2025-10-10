// store/notificationStore.ts
import { create } from "zustand";

interface NotificationStore {
  refreshNoteSignal: number; // رقم عشوائي للتغيير
  triggerRefresh: () => void; // function لتحديث الاشعار
}

export const useNoteNotificationStore = create<NotificationStore>((set) => ({
  refreshNoteSignal: 0,
  triggerRefresh: () => set((state) => ({ refreshNoteSignal: state.refreshNoteSignal + 1 })),
}));
