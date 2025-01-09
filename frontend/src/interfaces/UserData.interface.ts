export interface UserData {
  _id: string;
  username: string;
  fullname?: string;
  email?: string;
  followers?: string[];
  following?: string[];
  profileImg?: string;
  coverImg?: string;
  bio?: string;
  link?: string;
  likedPosts?: string[];
  postCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
