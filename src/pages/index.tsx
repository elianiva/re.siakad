import { useForm } from "react-hook-form";
import Head from "next/head";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn, type LoginRequest, loginRequest } from "~/features/auth";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import Image from "next/image";
import { BaseSyntheticEvent } from "react";

export default function Home() {
	const form = useForm<LoginRequest>({
		resolver: zodResolver(loginRequest),
	});
	const { mutate: signIn } = useSignIn();

	function handleSignIn(data: LoginRequest) {
		signIn(data);
	}

	return (
		<>
			<Head>
				<title>RE:SIAKAD</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex h-full w-full items-center justify-center">
				<div className="with-decoration relative">
					<style jsx>{`
						.with-decoration::before {
							content: "";
							position: absolute;
							left: -1rem;
							right: -1rem;
							bottom: -1rem;
							height: 10rem;
							background-color: white;
							border-radius: 0.75rem;
							border: 4px #171717 solid;
						}
					`}</style>
					<div className="relative z-10 flex w-full items-center gap-20 rounded-xl border-4 border-neutral-900 bg-white px-20 py-16">
						<Image src="/logo.png" alt="RE:SIAKAD" width={280} height={280} />
						<div className="h-80 w-1 rounded-full bg-neutral-900" />
						<Form form={form} onSubmit={handleSignIn}>
							<Input label="NIM" placeholder="2241720000" {...form.register("nim")} />
							<Input
								label="Password"
								type="password"
								placeholder="••••••••"
								{...form.register("password")}
							/>
							<button className="mx-auto mt-8 w-fit rounded-md border-2 border-neutral-900 bg-orange-300 px-8 py-4 text-xl font-bold text-neutral-900">
								LOGIN
							</button>
						</Form>
					</div>
				</div>
			</div>
		</>
	);
}
