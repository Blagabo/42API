import NextAuth from 'next-auth/next';
import FortyTwoProvider from 'next-auth/providers/42-school';
require('dotenv').config();

export const authOptions = {
	providers: [
		FortyTwoProvider({
			clientId: process.env.CLIENTID,
			clientSecret: process.env.CLIENTSECRET,
		}),
	],
	callbacks: {
		async session({ session, user, token, account }) {
			if (token) {
				session.user.accessToken = token.accessToken;
				session.user.exp = token.exp;
				session.user.iat = token.iat;
				session.user.urlProfile = token.oauthProfile;
				session.user.login = token.login;
				session.user.image = token.image;
				session.user.id = token.id;
			}
			return session;
		},
		async jwt({ token, user, account, profile }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = profile.id;
				token.exp = account.expires_at;
				token.urlProfile = profile.url;
				token.login = profile.login;
				token.image = profile.image.link;
			}
			return token;
		},
	},
	debug: false,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
