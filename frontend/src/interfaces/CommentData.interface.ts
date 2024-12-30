import { UserData } from './UserData.interface';

export interface CommentData {
  _id: string;
  text: string;
  user: UserData;
}
