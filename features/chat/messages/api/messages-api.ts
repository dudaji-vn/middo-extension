import { Message } from '../types';

import { axios } from '~/libs';
import { Response } from '~/types';

const basePath = '/messages';

export type CreateMessage = {
  roomId: string;
  content: string;
  clientTempId?: string;
  language?: string;
  mentions?: string[];
};
export const messageApi = {
  async send(data: CreateMessage) {
    console.log('data', data);
    const res: Response<Message> = await axios.post(basePath, data);
    return res.data;
  },

  async getOne(id: string) {
    const res: Response<Message> = await axios.get(`${basePath}/${id}`);
    return res.data;
  },

  async remove({ id, type }: { id: string; type: 'me' | 'all' }) {
    const res: Response<Message> = await axios.delete(`${basePath}/${id}`, {
      params: { type },
    });
    return res.data;
  },

  async seen(id: string) {
    const res: Response<Message> = await axios.patch(`${basePath}/${id}/seen`);
    return res.data;
  },

  async checkSeen(id: string) {
    const res: Response<{
      seen: boolean;
    }> = await axios.get(`${basePath}/${id}/seen`);
    return res.data;
  },

  async react({ id, emoji }: { id: string; emoji: string }) {
    const res: Response<Message> = await axios.patch(`${basePath}/${id}/react`, {
      emoji,
    });
    return res.data;
  },

  async forward(data: {
    roomIds: string[];
    forwardedMessageId: string;
    message: Omit<CreateMessage, 'roomId' | 'clientTempId'>;
  }) {
    const { forwardedMessageId, ...sendData } = data;
    const res: Response<Message> = await axios.post(
      `${basePath}/${data.forwardedMessageId}/forward`,
      sendData
    );
    return res.data;
  },

  async reply(data: { repliedMessageId: string; message: Omit<CreateMessage, 'clientTempId'> }) {
    const { repliedMessageId, message } = data;
    console.log('repliedMessageId', repliedMessageId, 'message', message);
    const res: Response<Message> = await axios.post(
      `${basePath}/${repliedMessageId}/reply`,
      message
    );
    return res.data;
  },

  async getReplies(id: string) {
    const res: Response<Message[]> = await axios.get(`${basePath}/${id}/replies`);
    return res.data;
  },

  async pin(id: string) {
    const res: Response<Message> = await axios.post(`${basePath}/${id}/pin`);
    return res.data;
  },
  async translate({ id, to }: { id: string; to: string }) {
    const res: Response<Message> = await axios.patch(`${basePath}/${id}/translate`, {
      to,
    });
    return res.data;
  },
};
