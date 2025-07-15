interface SignInWithOAuthParams {
    user: {
        name: string;
        username: string;
        email: string;
        image?: string;
    };
    provider: "google" | "github";
    providerAccountId: string;
}

interface AuthCredentials {
    name: string;
    username: string;
    email: string;
    password: string;
}
