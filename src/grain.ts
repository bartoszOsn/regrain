/**
 * It serves as a reference for a single value in the store.
 * @template TValue - type of a value that this grain references.
 */
export type Grain<TValue> = Readonly<{
	name: string;
	initialValue: TValue; // TODO make it DeepReadonly
}>;

/**
 * Creates a Grain
 * @param name - used only for debugging purposes.
 * @param initialValue - initial value that returned grain is referencing.
 *
 * @see Grain
 */
export function createGrain<TValue>(name: string, initialValue: TValue): Grain<TValue> {
	return Object.freeze({ name, initialValue });
}
