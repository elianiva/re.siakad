import { type ComponentProps, forwardRef, useState } from "react";
import { FaEye as EyeIcon, FaEyeSlash as EyeSlashedIcon } from "react-icons/fa";
import { Error } from "./error";

export type InputProps = Omit<ComponentProps<"input">, "label"> & {
	label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ className = "", type = "text", ...props },
	ref
) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="form-control w-full">
			{props.label !== undefined ? (
				<label className="mb-2 block">
					<span className="text-xl font-bold text-neutral-800">{props.label}</span>
				</label>
			) : null}
			<div className="flex gap-2 overflow-hidden rounded-lg border-2 border-neutral-300 bg-white/50 px-4 py-2 focus-within:border-orange-400">
				<input
					className={`w-full text-lg font-medium text-neutral-800 outline-none placeholder:text-lg ${className}`}
					ref={ref}
					type={type === "password" ? (showPassword ? "text" : "password") : type}
					{...props}
				/>
				{type === "password" && (
					<button
						type="button"
						className="text-neutral-400 hover:text-neutral-500"
						onClick={() => setShowPassword((prev) => !prev)}
					>
						{showPassword ? <EyeSlashedIcon /> : <EyeIcon />}
					</button>
				)}
			</div>
			<Error name={props.name} />
		</div>
	);
});
