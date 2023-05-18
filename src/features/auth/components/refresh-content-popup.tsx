import * as Dialog from "@radix-ui/react-dialog";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Form, Input } from "~/components/form";
import { type LoginRequest, loginRequest } from "../schema/login";
import { zodResolver } from "@hookform/resolvers/zod";

type AuthPopupProps = {
	icon: ReactNode;
	onSubmit: (data: LoginRequest) => void;
};

export function AuthPopup(props: AuthPopupProps) {
	const form = useForm<LoginRequest>({
		resolver: zodResolver(loginRequest),
	});

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{props.icon}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-800/75 backdrop-blur-sm" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-[51] w-full max-w-[40rem] -translate-x-1/2 -translate-y-1/2 overflow-y-hidden rounded-md bg-white p-10">
					<Dialog.Title className="text-2xl font-bold text-neutral-800">Authentication Required</Dialog.Title>
					<Dialog.Description className="text-neutral-700">
						We need your credentials to refresh the entire SIAKAD database. This is needed because we are
						not storing your SIAKAD session cookie. This shouldn&apos;t be the case in the future
					</Dialog.Description>
					<Form form={form} onSubmit={props.onSubmit}>
						<div className="py-6">
							<Input className="mb-4" label="NIM" placeholder="2241720000" {...form.register("nim")} />
							<Input
								label="Password"
								type="password"
								placeholder="••••••••"
								{...form.register("password")}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Dialog.Close asChild>
								<button
									className="rounded-md bg-red-500 px-4 py-3 font-medium text-white"
									type="button"
								>
									Cancel
								</button>
							</Dialog.Close>
							<Dialog.Close asChild>
								<button
									className="rounded-md bg-sky-600 px-4 py-3 font-medium text-white"
									type="submit"
								>
									Confirm
								</button>
							</Dialog.Close>
						</div>
					</Form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
