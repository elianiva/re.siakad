import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import type { LoginRequest } from "../schema/login";
import { toast } from "react-hot-toast";

async function signInWithCredential(credentials: LoginRequest) {
	const response = await signIn("credentials", {
		redirect: false,
		...credentials,
	});
	if (response === undefined) return Promise.reject(new Error("Internal server error"));
	if (!response.ok) return Promise.reject(new Error(response.error));
	return Promise.resolve(undefined);
}

export function useSignIn() {
	return useMutation(async (credentials: LoginRequest) => {
		await toast.promise(signInWithCredential(credentials), {
			error: (err) => (err instanceof Error ? err.message : "Failed to sign in"),
			loading: "Signing in...",
			success: "Successfully signed in",
		});
	});
}
