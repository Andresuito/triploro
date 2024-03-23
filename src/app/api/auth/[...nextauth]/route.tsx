import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosInstance from "../../../utils/axiosInstance";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await axiosInstance.post("/auth/login", {
          username: credentials?.email.split("@")[0],
          email: credentials?.email,
          password: credentials?.password,
        });

        const user = response.data;

        if (Array.isArray(user.error)) {
          const errorMessage = user.error.map((err: any) => err.msg).join(", ");
          throw new Error(errorMessage);
        } else if (user.error) {
          throw new Error(user.error);
        } else {
          return user;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
