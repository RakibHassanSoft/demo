type AuthRequest = Request & {
  user: {
    id: string;
    email?: string;
  };
};