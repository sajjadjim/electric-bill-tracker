import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Security check: only allow your specific Gmail
      return user.email === process.env.ALLOWED_EMAIL;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};