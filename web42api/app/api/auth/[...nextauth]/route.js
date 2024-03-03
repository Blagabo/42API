import NextAuth from "next-auth/next";
import FortyTwoProvider from "next-auth/providers/42-school";
require("dotenv").config();

const invalidPrimaryCampus = profile => {
  const campusId = profile.campus_users.find(cu => cu.is_primary)?.campus_id;

  return campusId.toString() !== 13;
};

const handler = NextAuth({
  providers: [
    FortyTwoProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENTID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENTSECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
