import { CommentData } from './CommentData.interface';
import { UserData } from './UserData.interface';

export interface PostData {
  _id: string;
  text: string;
  img?: string;
  user: UserData;
  comments: CommentData[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
}
