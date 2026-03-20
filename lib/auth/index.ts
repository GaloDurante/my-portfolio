import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";
import db from "@/db";
import { authConfig } from "@/lib/auth/config";
import { user } from "@/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const userList = await db.select().from(user).where(eq(user.email, email)).limit(1);
        const currentUser = userList[0];

        if (!currentUser) {
          return null;
        }

        const isValid = await compare(password, currentUser.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
