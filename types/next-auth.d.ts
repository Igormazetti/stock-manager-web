import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    company?: {
      id: string;
      email: string;
      name: string;
      // Adicione outros campos que sua company possui
    };
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    token?: string;
    company?: {
      id: string;
      email: string;
      name: string;
      // Adicione outros campos que sua company possui
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    company?: {
      id: string;
      email: string;
      name: string;
      // Adicione outros campos que sua company possui
    };
  }
}
