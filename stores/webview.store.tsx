import { create } from 'zustand';

type webviewState = {
  redirectUrl: string | null;
  currentRoomId: string | null;
};

type webviewActions = {
  setRedirectUrl: (redirectUrl: string | null) => void;
  setCurrentRoomId: (roomId: string | null) => void;
};

type webviewStore = webviewState & webviewActions;

export const useWebviewStore = create<webviewStore>()((set, get) => ({
  redirectUrl: null,
  currentRoomId: null,
  setRedirectUrl: (redirectUrl) => {
    set({ redirectUrl });
  },
  setCurrentRoomId: (roomId) => {
    set({ currentRoomId: roomId });
  },
}));
