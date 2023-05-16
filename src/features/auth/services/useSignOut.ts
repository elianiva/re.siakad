import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

export function useSignOut() {
	return useMutation(async () => {
		await toast.promise(signOut(), {
			error: (err) => (err instanceof Error ? err.message : "Failed to sign out"),
			loading: "Signing out...",
			success: "Successfully signed out",
		});
	});
}
