import { useFormContext } from "react-hook-form";
import { get } from "~/utils/dot-notation-get";

type ErrorProps = {
	name?: string;
};

export function Error(props: ErrorProps) {
	const {
		formState: { errors },
	} = useFormContext();

	if (!props.name) return null;

	const error = get(props.name, errors);
	if (error === undefined) return null;

	return (
		<label className="block py-2">
			<span className="text-red-500">
				{error.message as string}
			</span>
		</label>
	);
}
