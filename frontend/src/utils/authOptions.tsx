// NextAuth configuration
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginUser } from '@/services/credentialsApi';

/**
 * NextAuth configuration options
 * Integrates with Group 5 Credentials API
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        emailOrUsername: {
          label: 'Email or Username',
          type: 'text',
          placeholder: 'Enter your email or username',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error('Email/Username and password are required');
        }

        try {
          // Call the credentials API
          const response = await loginUser({
            emailOrUsername: credentials.emailOrUsername,
            password: credentials.password,
          });

          if (response.success && response.data) {
            // Return user object that will be stored in the JWT
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.username,
              username: response.data.user.username,
              token: response.data.token,
              role: response.data.user.role,
            };
          } else {
            throw new Error(response.message || 'Authentication failed');
          }
        } catch (error: any) {
          console.error('[NextAuth] Authentication error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = (user as any).username;
        token.accessToken = (user as any).token;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.username as string;
        (session.user as any).username = token.username;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET_KEY,
  debug: process.env.NODE_ENV === 'development',
};
