type Result<TData> = [TData, null] | [null, Error];

export async function wrapResult<TData>(promise: Promise<TData>): Promise<Result<TData>> {
	try {
		const result = await promise;
		return [result, null];
	} catch (err: unknown) {
		const error = err instanceof Error ? err : new Error("Unknown Error");
		return [null, error];
	}
}
