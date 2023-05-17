import { type ChangeEvent } from "react";
import { useState } from "react";
import { AiOutlineSearch as SearchIcon } from "react-icons/ai";

type SearchBarProps = {
	onChange: (value: string) => void;
};

export function SearchBar(props: SearchBarProps) {
	const [value, setValue] = useState("");

	function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
		setValue(e.currentTarget.value);
		props.onChange(value);
	}

	return (
		<div className="flex w-full items-center gap-4 rounded-md border-b-2 border-orange-400 bg-white px-6 py-4 shadow-sm">
			<input
				value={value}
				onChange={handleOnChange}
				className="flex-1 outline-none "
				placeholder="Type to search..."
				type="text"
			/>
			<SearchIcon className="h-6 w-6 text-neutral-500" />
		</div>
	);
}
