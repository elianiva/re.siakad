export function get(str: string, obj: Record<string, unknown>) {
	const keys = str.split(".");
	let value = obj;

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (value === null || value === undefined || key === undefined) {
			return undefined;
		}
		const isArray = Array.isArray(value) && !isNaN(parseInt(key));
		// @ts-expect-error - ok to ignore
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		value = isArray ? value[parseInt(key)] : value[key];
	}

	return value;
}
