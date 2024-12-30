import { UserData } from './UserData.interface';

export interface NotificationData {
  _id: string;
  from: UserData;
  type: string;
}
