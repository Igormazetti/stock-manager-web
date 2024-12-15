import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

console.log(apiUrl);

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const response = await fetch("http://localhost:6060/company/login", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }).then((response) => response.json());

          if (response.token && response.company) {
            cookies().set("auth-token", response.token);
            cookies().set("company", JSON.stringify(response.company));
            return response;
          }

          console.error(response.errorMessage);
          return null;
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
