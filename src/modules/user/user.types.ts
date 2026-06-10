// src/modules/user/user.types.ts
export type OAuthLoginDTO = {
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};