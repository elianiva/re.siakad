import { type GetServerSidePropsContext, type GetServerSidePropsResult } from "next";
import { useForm } from "react-hook-form";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn, type LoginRequest, loginRequest } from "~/features/auth";
import { Form, Input } from "~/components/form";
import { getServerAuthSession } from "~/server/auth";

const SignInPage: NextPageWithLayout = () => {
	const router = useRouter();
	const form = useForm<LoginRequest>({
		resolver: zodResolver(loginRequest),
	});
	const { mutate: signIn } = useSignIn();

	function handleSignIn(data: LoginRequest) {
		signIn(data, {
			async onSuccess() {
				await router.push("/app");
			},
		});
	}

	return (
		<>
			<Head>
				<title>RE:SIAKAD</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Image className="-z-20" src="/bg.jpg" alt="Background" fill style={{ objectFit: "cover" }} />
			<div className="fixed bottom-0 left-0 right-0 top-0 -z-10 bg-white/60 backdrop-blur-md" />
			<div className="flex h-full w-full items-center justify-center">
				<div className="relative">
					<div className="relative z-10 flex w-full items-center gap-20 rounded-xl bg-white/75 px-20 py-16 shadow-lg backdrop-blur-lg">
						<Image src="/logo.png" alt="RE:SIAKAD" width={280} height={280} />
						<div className="h-80 w-[2px] rounded-full bg-neutral-300" />
						<Form form={form} onSubmit={handleSignIn}>
							<Input label="NIM" placeholder="2241720000" {...form.register("nim")} />
							<Input
								label="Password"
								type="password"
								placeholder="••••••••"
								{...form.register("password")}
							/>
							<button className="mx-auto mt-8 w-fit rounded-md bg-gradient-to-tr from-orange-500 to-orange-400 px-6 py-2 text-xl font-bold text-white shadow-xl shadow-orange-200">
								LOGIN
							</button>
						</Form>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignInPage;

export async function getServerSideProps({
	req,
	res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<unknown>> {
	const session = await getServerAuthSession({ req, res });
	if (session !== null) {
		return {
			redirect: {
				permanent: false,
				destination: "/app",
			},
		};
	}

	return { props: {} };
}
