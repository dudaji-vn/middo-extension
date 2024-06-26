import { axios } from '~/libs/axios';

const basePath = '/notifications';

export const notificationApi = {
  async subscribe(token: string) {
    const res = await axios.post(`${basePath}/subscribe`, {
      token,
      type: 'extension',
    });
    return res.data;
  },
  async unsubscribe(token: string) {
    const res = await axios.post(`${basePath}/unsubscribe`, { token, type: 'extension' });
    return res.data;
  },
  async checkSubscription(token: string) {
    const res = await axios.post(`${basePath}/check`, { token, type: 'extension' });
    return res.data;
  },
  async toggleRoomNotification(roomId: string) {
    const res = await axios.post(`${basePath}/room/toggle`, { roomId });
    return res.data;
  },

  async checkIsRoomMuted(roomId: string) {
    const res = await axios.post(`${basePath}/room/${roomId}/check`);
    return res.data;
  },
};
