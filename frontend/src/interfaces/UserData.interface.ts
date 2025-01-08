import { PostData } from './PostData.interface';

export interface UserData {
  _id: string;
  username: string;
  fullname?: string;
  email?: string;
  followers?: UserData[];
  following?: UserData[];
  profileImg?: string;
  coverImg?: string;
  bio?: string;
  link?: string;
  likedPosts?: PostData[];
}
