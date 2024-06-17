import { create } from 'zustand';

type webviewState = {
  redirectUrl: string | null;
  currentSpaceId: string | null;
  currentRoomId: string | null;
};

type webviewActions = {
  setRedirectUrl: (redirectUrl: string | null) => void;
  setCurrentSpaceId: (spaceId: string | null) => void;
  setCurrentRoomId: (roomId: string | null) => void;
};

type webviewStore = webviewState & webviewActions;

export const useWebviewStore = create<webviewStore>()((set, get) => ({
  redirectUrl: null,
  currentSpaceId: null,
  currentRoomId: null,
  setRedirectUrl: (redirectUrl) => {
    set({ redirectUrl });
  },
  setCurrentSpaceId: (spaceId) => {
    set({ currentSpaceId: spaceId });
  },
  setCurrentRoomId: (roomId) => {
    set({ currentRoomId: roomId });
  },
}));
