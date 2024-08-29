import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const parsedCredentials = credentialsSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new Error('Invalid credentials');
        }

        // 在这里进行身份验证的逻辑，例如数据库查询或 API 调用
        const user = { id: '1', name: 'User', email: parsedCredentials.data.email }; 
        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; 
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        if (user.id) {
          token.id = user.id.toString(); // 确保 token.id 是字符串
        }
      }
      return token;
    }
  },
  // 选项：可以配置 Cookie 的属性
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 天
    updateAge: 24 * 60 * 60, // 每天更新一次
  }
});