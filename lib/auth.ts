import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter:PrismaAdapter(prisma),
    providers: [Google,
        Credentials({
            name:"credentials",
            credentials: {
                email: {label: "Email", type:"email"},
                password: {label:"Passwprd", type:"password"}
            },
            async authorize(credentials){
                if (!credentials?.email || !credentials?.password) return null;
                const user = await prisma.user.findUnique({
                    where:{email: credentials.email as string}
                });

                if (!user || !user.password) return null;

                const isValid =  await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )
                if(!isValid) return null;
                return {
                    id:user.id,
                    email:user.email,
                    name:user.email,
                    role:user.role,
                }
            }
        })
    ],
    session: { strategy: "jwt" },
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        jwt({token, user}) {
            if(user) token.role = user.role;
            return token;
        },
        session({session, token}){
            session.user.id =  token.sub;
            session.user.role = token.role
            return session;
        }
    }
});