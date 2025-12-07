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
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Call the credentials API
          const response = await loginUser({
            email: credentials.email,
            password: credentials.password
          });

          if (response.success && response.data) {
            // Extract token flexibly — different deployments return it under different keys
            const accessToken =
              (response as any)?.data?.accessToken ||
              (response as any)?.data?.token ||
              (response as any)?.accessToken ||
              (response as any)?.token;
            // Return user object that will be stored in the JWT
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.username,
              username: response.data.user.username,
              token: accessToken,
              role: response.data.user.role,
              emailVerified: response.data.user.emailVerified || false
            } as any;
          } else {
            throw new Error(response.message || 'Authentication failed');
          }
        } catch (error: any) {
          console.error('[NextAuth] Authentication error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = (user as any).id;
        token.email = user.email;
        token.username = (user as any).username;
        token.accessToken = (user as any).token;
        token.role = (user as any).role;
        token.emailVerified = (user as any).emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        const user = session.user as any; // <-- cast once

        user.id = token.id as string;
        user.email = token.email as string;
        user.name = token.username as string;
        user.username = token.username;
        user.accessToken = token.accessToken;
        user.role = token.role;
        user.emailVerified = token.emailVerified;
      }
      return session;
    }
  },

  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET_KEY,
  debug: process.env.NODE_ENV === 'development'
};
