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
            token,
            expiresIn,
            iat,
            exp,
            jti,
          };
        } catch (error) {
          let errorMessage = (error as any)?.response?.data?.error;
          if (Array.isArray(errorMessage) && errorMessage[0]?.msg) {
            errorMessage = errorMessage[0].msg;
          }
          throw new Error(errorMessage);
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
