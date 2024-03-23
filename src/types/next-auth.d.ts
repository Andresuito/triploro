import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user: User
      id: string;
      email: string;
      token: string;
      username: string;
      created: string;
    };
  }
}
