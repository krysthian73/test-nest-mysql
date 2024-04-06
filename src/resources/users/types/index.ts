export type UserFilter = {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
};

export enum Role {
  User = 'user',
  Admin = 'admin',
}
