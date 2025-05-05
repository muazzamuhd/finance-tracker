// src/auth.ts

import { NextAuthOptions, getServerSession } from "next-auth";
import Google from "next-auth/providers/google";
import { getModels } from "@/lib/models";
import { isValidObjectId } from "mongoose";

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
}

// Extend the session object
declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email || !profile.name) return false;

        try {
          const { User } = await getModels();
          const oldUser = await User.findOne({ email: profile.email });

          if (!oldUser) {
            const newUser = new User({
              name: profile.name,
              email: profile.email,
              // verified: profile.email_verified || false,
              image: profile.image || "",
            });

            await newUser.save();
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }

      return true;
    },

    async jwt({ token, user, trigger }) {
      try {
        const { User } = await getModels();

        if (user) {
          if (!isValidObjectId(user.id)) {
            const dbUser = await User.findOne({ email: user.email }).exec();
            if (dbUser) {
              token = {
                ...token,
                id: dbUser._id.toString(),
                email: dbUser.email,
                name: dbUser.name,
                verified: dbUser.verified,
                avatar: dbUser.image,
              };
            }
          } else {
            token = { ...token, ...user };
          }
        }

        if (trigger === "update" && token.email) {
          const dbUser = await User.findOne({ email: token.email }).exec();
          if (dbUser) {
            token.avatar = dbUser.image;
          }
        }
      } catch (error) {
        console.error("Error in jwt callback:", error);
      }

      return token;
    },

    session({ token, session }) {
      let user = token as typeof token & SessionUserProfile;

      if (token.user) {
        user = token.user as typeof token & SessionUserProfile;
      }

      if (user) {
        session.user = {
          ...session.user,
          id: user.id,
          email: user.email,
          name: user.name,
          verified: user.verified || false,
          avatar: user.avatar,
        };
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ Export a working auth() function
export const auth = () => getServerSession(authOptions);
