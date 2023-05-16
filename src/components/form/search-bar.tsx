import { type KeyboardEvent, useState } from "react";
import { AiOutlineSearch as SearchIcon } from "react-icons/ai";

type SearchBarProps = {
	onSubmit: (value: string) => void;
};

export function SearchBar(props: SearchBarProps) {
	const [value, setValue] = useState("");

	function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key !== "Enter") return;
		props.onSubmit(value);
	}

	return (
		<div className="mb-4 flex w-full items-center gap-4 rounded-md border-b-2 border-orange-400 bg-white px-6 py-4 shadow-sm">
			<input
				onKeyUp={handleKeyDown}
				value={value}
				onChange={(e) => setValue(e.currentTarget.value)}
				className="flex-1 outline-none "
				placeholder="Type to search..."
				type="text"
			/>
			<SearchIcon className="h-6 w-6 text-neutral-500" />
		</div>
	);
}
