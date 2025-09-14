// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const issuer = process.env.AUTH0_ISSUER_BASE_URL!;
const clientId = process.env.AUTH0_CLIENT_ID!;
const clientSecret = process.env.AUTH0_CLIENT_SECRET!;
const nextAuthSecret = process.env.NEXTAUTH_SECRET!;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: nextAuthSecret,
  session: { strategy: "jwt" },
  providers: [
    Auth0Provider({
      clientId,
      clientSecret,
      issuer,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).uid = (user as any).id;

        const base =
          (user as any).username ??
          (typeof (user as any).name === "string" && (user as any).name.trim().length > 0
            ? (user as any).name
            : ((user as any).email ?? "").split("@")[0]);

        (token as any).username = (base || "user").toString().toLowerCase();
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.id = (token as any).uid as string | undefined;
      (session as any).user.username = (token as any).username as string | undefined;
      return session;
    },
  },
};
