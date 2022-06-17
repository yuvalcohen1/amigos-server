export interface UserModel {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  encryptedPassword: string;
  profileImg: string;
  connections: string[];
  isAdmin: 0 | 1;
}
