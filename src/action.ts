/**
 * It is some action that takes places.
 * @template TPayload - type of a value that this action is dispatched with.
 */
export type Action<TPayload> = Readonly<{
	name: string;
}>;

/**
 * creates an action.
 * @see Action
 * @param name - name of the action. Used only for debugging purposes.
 */
export function createAction<TPayload>(name: string): Action<TPayload> {
	return Object.freeze({ name });
}
