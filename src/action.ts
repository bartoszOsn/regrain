/**
 * It is some action that takes places.
 * @template TPayload - type of a value that this action is dispatched with.
 */
export type Action<TPayload> = ((payload: TPayload) => {
	type: Action<TPayload>,
	payload: TPayload,
	name: string
}) & { name: string }

/**
 * creates an action.
 * @see Action
 * @param name - name of the action. Used only for debugging purposes.
 */
export function createAction<TPayload = void>(name: string): Action<TPayload> {
	const tmp = {
		[name]: (payload: TPayload) => {
			return {
				type: tmp[name],
				payload: payload,
				name: name
			}
		}
	};
	return tmp[name] as Action<TPayload>;
}
