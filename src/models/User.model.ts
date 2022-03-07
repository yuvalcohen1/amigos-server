export interface UserModel {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  encryptedPassword: string;
  birthday: Date;
  isAdmin: 0 | 1;
}
