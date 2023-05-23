import { ImSpinner8 as SpinnerIcon } from "react-icons/im";

const SIZES = {
	sm: "w-4 h-4",
	base: "w-10 h-10",
};

type LoadingProps = {
	size?: keyof typeof SIZES;
};

export function Loading({ size = "base" }: LoadingProps) {
	return (
		<div className="flex h-full w-full items-center justify-center gap-2">
			<SpinnerIcon className={`animate-spin fill-slate-400 ${SIZES[size]}`} />
		</div>
	);
}
