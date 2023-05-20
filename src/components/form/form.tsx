import type { ComponentProps } from "react";
import type { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { FormProvider } from "react-hook-form";

type FormProps<TSchema extends FieldValues = FieldValues> = Omit<ComponentProps<"form">, "onSubmit"> & {
	form: UseFormReturn<TSchema>;
	onSubmit: SubmitHandler<TSchema>;
};

export function Form<TSchema extends FieldValues = FieldValues>({ onSubmit, ...props }: FormProps<TSchema>) {
	return (
		<FormProvider {...props.form}>
			<form
				method="post"
				className={props.className}
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onSubmit={props.form.handleSubmit(
					(data, event) => {
						event?.preventDefault();
						try {
							onSubmit(data);
						} catch (err: unknown) {
							/* noop */
						}
					},
					(errors) => {
						console.log({ errors });
					}
				)}
			>
				<fieldset className="flex flex-col gap-4" disabled={props.form.formState.isSubmitting}>
					{props.children}
				</fieldset>
			</form>
		</FormProvider>
	);
}
