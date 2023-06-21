import { type DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		id?: string;
		nim?: string;
		cookie?: string;
	}

	interface Session extends DefaultSession {
		user?: User;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		nim?: string;
	}
}
