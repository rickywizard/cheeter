export interface ProfileRequest {
  coverImg?: string | null;
  profileImg?: string | null;
  username?: string;
  fullname?: string;
  email?: string;
  bio?: string;
  link?: string;
  currentPassword?: string;
  newPassword?: string;
}
