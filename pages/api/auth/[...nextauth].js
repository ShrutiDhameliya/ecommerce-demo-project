import crypto from 'crypto';
import { promises as fs } from 'fs';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import path from 'path';

// Helper function to read users from JSON file
async function getUsers() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Helper function to hash password consistently
function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            return null;
          }

          console.log('Login attempt for:', credentials.email);
          
          // Read users from JSON file
          const users = await getUsers();
          
          // Find user by email
          const user = users.find(u => u.email === credentials.email);
          
          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          // Check if user is blocked first
          if (user.blocked) {
            console.log('Blocked user attempted login:', credentials.email);
            throw new Error('Your account has been blocked. Please contact support.');
          }

          // Hash the provided password
          const hashedPassword = hashPassword(credentials.password);

          console.log('Password comparison:', {
            provided: hashedPassword,
            stored: user.password
          });

          // Compare hashed passwords
          if (user.password !== hashedPassword) {
            console.log('Invalid password for user:', credentials.email);
            return null;
          }

          console.log('Login successful for:', credentials.email);
          
          // Return user object without password
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error('Login error:', error);
          throw error; // Propagate the error to show the blocked message
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle role-based redirection
      if (url.includes('/api/auth/signin')) {
        return `${baseUrl}/auth/login`;
      }
      
      // If it's a callback URL, redirect based on role
      if (url.includes('/api/auth/callback')) {
        return `${baseUrl}/shop`; // Default to shop page
      }

      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Allow URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key'
};

export default NextAuth(authOptions); 