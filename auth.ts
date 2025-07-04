import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import { ActionResponse } from "./types/global";
import { IAccountDoc } from "./database/account.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub, Google],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;

            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                const { success, data: existingAccount } =
                    (await api.accounts.getByProvider(
                        account.type === "credentials"
                            ? (account.email! as string)
                            : (account.providerAccountId! as string)
                    )) as ActionResponse<IAccountDoc>;

                if (!success || !existingAccount) return token;

                const userId = existingAccount?.userId;

                if (userId) token.sub = userId.toString();
            }
            return token;
        },
        async signIn({ user, profile, account }) {
            if (account?.type === "credentials") return true;
            if (!account || !user) return false;

            const userInfo = {
                name: user.name!,
                email: user.email!,
                image: user.image!,
                username:
                    account.provder === "github"
                        ? (profile?.login as string)
                        : (user.name?.toLowerCase() as string),
            };

            const { success } = (await api.auth.oAuthSignIn({
                user: userInfo,
                provider: account.provider as "google" | "github",
                providerAccountId: account.providerAccountId,
            })) as ActionResponse;

            if (!success) return false;

            return true;
        },
    },
});
