import { create } from 'zustand';
export type HintType = 'camera' | 'microphone' | 'notification' | 'none';
type PermissionState = {
  hintType: HintType;
};

type PermissionActions = {
  setHintType: (hintType: HintType) => void;
};

type PermissionStore = PermissionState & PermissionActions;

export const usePermissionStore = create<PermissionStore>()((set, get) => ({
  hintType: 'none',
  setHintType: (hintType) => set({ hintType }),
}));
