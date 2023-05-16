import {
	type SortingState,
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	flexRender,
	type ColumnDef,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { type ReactNode, useState } from "react";
import {
	TbArrowsSort as ArrowsDownUpIcon,
	TbArrowDown as ArrowDownIcon,
	TbArrowUp as ArrowUpIcon,
} from "react-icons/tb";

const ICON_MAP: Record<string, ReactNode> = {
	asc: <ArrowUpIcon />,
	desc: <ArrowDownIcon />,
};

type TableProps<TData> = {
	data: TData[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	columns: ColumnDef<TData, any>[];
	onRowClick?: (row: TData) => void;
};

export function Table<TData extends { uid: string }>(props: TableProps<TData>) {
	const router = useRouter();
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: props.data,
		columns: props.columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 max-h-full w-full flex-1 overflow-hidden rounded-md">
			<table className="table w-full">
				<thead>
					{table.getHeaderGroups().map((group) => (
						<tr key={group.id}>
							{group.headers.map((header) => (
								<th
									key={header.id}
									className="sticky top-0 !z-20 cursor-pointer !bg-slate-300 font-bold text-slate-800 first-of-type:!z-30 hover:!bg-slate-300"
									onClick={header.column.getToggleSortingHandler()}
								>
									<div className="flex items-center justify-between gap-6">
										{flexRender(header.column.columnDef.header, header.getContext())}
										{ICON_MAP[header.column.getIsSorted() as string] ?? <ArrowsDownUpIcon />}
									</div>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className="overflow-y-auto">
					{table.getRowModel().rows.length > 0 ? (
						table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className="hover cursor-pointer"
								onClick={() => {
									if (props.onRowClick !== undefined) {
										props.onRowClick(row.original);
										return;
									}
									void router.push(`${router.pathname}/${row.original.uid}`);
								}}
							>
								{row
									.getVisibleCells()
									.map((cell) =>
										cell.column.id === "number" ? (
											<th key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</th>
										) : (
											<td key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										)
									)}
							</tr>
						))
					) : (
						<tr>
							<td className="text-center text-xl" colSpan={props.columns.length}>
								No data available
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
