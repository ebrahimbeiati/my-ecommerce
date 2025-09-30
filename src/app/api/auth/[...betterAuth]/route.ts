import { betterAuth } from "better-auth";

export const { GET, POST } = betterAuth({
	secret: process.env.AUTH_SECRET ?? "",
	emailAndPassword: { enabled: true },
});


