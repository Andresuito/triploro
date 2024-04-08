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
        try {
          const response = await axiosInstance.post("/auth/login", {
            username: credentials?.email.split("@")[0],
            email: credentials?.email,
            password: credentials?.password,
          });

          const { user, token, expiresIn, iat, exp, jti } = response.data;

          return {
            ...user,
            name: user?.username,
            token,
            expiresIn,
            iat,
            exp,
            jti,
          };
        } catch (error) {
          throw new Error((error as any)?.response?.data?.error);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...user, ...session.user };
      }

      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
