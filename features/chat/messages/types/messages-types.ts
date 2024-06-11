import { User } from '~/features/users';
import { BaseEntity } from '~/types';

export type MessageType =
  | 'text'
  | 'media'
  | 'call'
  | 'notification'
  | 'action'
  | 'forward'
  | 'flow-actions';

export type ActionTypes =
  | 'none'
  | 'addUser'
  | 'removeUser'
  | 'leaveGroup'
  | 'pinMessage'
  | 'unpinMessage'
  | 'updateGroupName'
  | 'updateGroupAvatar'
  | 'removeGroupName'
  | 'createGroup';

export type Reaction = {
  emoji: string;
  user: User;
};

export type Message = {
  content: string;
  contentEnglish?: string;
  sender: User;
  readBy?: User['_id'][];
  deliveredTo?: User['_id'][];
  targetUsers?: User[];
  type: MessageType;
  language: string;
  reactions?: Reaction[];
  forwardOf?: Message;
  hasChild?: boolean;
  isPinned?: boolean;
  mentions?: User[];
  action?: ActionTypes;
  clientTempId?: string;
  translations?: {
    [key: string]: string;
  };
} & BaseEntity;

export type PinMessage = {
  message: Message;
  pinnedBy: User;
} & BaseEntity;
