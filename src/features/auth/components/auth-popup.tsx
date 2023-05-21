import * as Dialog from "@radix-ui/react-dialog";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Form, Input } from "~/components/form";
import { reAuthRequest, type ReAuthRequest } from "../schema/login";
import { zodResolver } from "@hookform/resolvers/zod";

type AuthPopupProps = {
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	icon: ReactNode;
	description: string;
	onSubmit: (data: ReAuthRequest) => void;
};

export function AuthPopup(props: AuthPopupProps) {
	const form = useForm<ReAuthRequest>({
		resolver: zodResolver(reAuthRequest),
	});

	return (
		<Dialog.Root
			open={props.isOpen}
			onOpenChange={(open) => {
				props.onOpenChange?.(open);
				if (!open) {
					form.reset();
				}
			}}
		>
			<Dialog.Trigger asChild>{props.icon}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-800/75 backdrop-blur-sm" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-[51] w-full max-w-[40rem] -translate-x-1/2 -translate-y-1/2 overflow-y-hidden rounded-md bg-white p-10">
					<Dialog.Title className="text-2xl font-bold text-neutral-800">Authentication Required</Dialog.Title>
					<Dialog.Description className="text-neutral-700">{props.description}</Dialog.Description>
					<Form form={form} onSubmit={props.onSubmit}>
						<div className="py-6">
							<Input
								label="Password"
								type="password"
								placeholder="••••••••"
								{...form.register("password")}
							/>
						</div>
						<div className="flex items-center justify-end gap-4">
							<Dialog.Close asChild>
								<button className="rounded-md bg-red-500 px-6 py-3 font-bold text-white" type="button">
									Cancel
								</button>
							</Dialog.Close>
							<button className="rounded-md bg-sky-600 px-6 py-3 font-bold text-white" type="submit">
								Confirm
							</button>
						</div>
					</Form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
