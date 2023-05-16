import { type ComponentProps, forwardRef } from "react";
import { Error } from "./error";

export type InputProps = Omit<ComponentProps<"input">, "label"> & {
	label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ className, type = "text", ...props },
	ref
) {
	return (
		<div className="form-control w-full">
			{props.label !== undefined ? (
				<label className="mb-2 block">
					<span className="text-xl font-bold text-neutral-800">{props.label}</span>
				</label>
			) : null}
			<input
				className={`w-full rounded-lg border border-neutral-300 bg-white/50 p-4 text-lg font-medium text-neutral-800 outline-1 outline-orange-600 placeholder:text-lg ${
					className ?? ""
				}`}
				ref={ref}
				type={type}
				{...props}
			/>
			<Error name={props.name} />
		</div>
	);
});
