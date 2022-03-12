export interface UserModel {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  encryptedPassword: string;
  profileImg: string;
  isAdmin: 0 | 1;
}
