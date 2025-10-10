// store/notificationStore.ts
import { create } from "zustand";

interface NotificationStore {
  refreshEditorSignal: number; // رقم عشوائي للتغيير
  triggerEditorRefresh: () => void; // function لتحديث الاشعار
}

export const useEditorNotificationStore = create<NotificationStore>((set) => ({
  refreshEditorSignal: 0,
  triggerEditorRefresh: () => set((state) => ({ refreshEditorSignal: state.refreshEditorSignal + 1 })),
}));
