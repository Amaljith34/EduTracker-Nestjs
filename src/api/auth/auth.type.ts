export type JwTPayloadType = {
  sub?: string;
  userId?: string;
  email?: string;
  type?: UserType;
  subscriberId?: string;
};

export enum UserType {
  USER = 'User',
  ADMIN = 'Admin',
  SUBSCRIBER = 'Subscriber',
}

export type AuthUserPayload = {
  userId: string;
  id: string;
  email: string;
  fullName: string;
  name: string;
  type: UserType;
  role: UserType;
  subscriberId?: string;
  phone?: string;
};
