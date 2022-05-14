import { Action } from './action';
import { DispatchFunc, GetFunc, SetFunc } from './typeUtils';

export interface EffectProps<TPayload> {
	dispatch: DispatchFunc<TPayload>;
	get: GetFunc<TPayload>;
	set: SetFunc<TPayload>;
}

export type EffectCallback<TPayload> = (props: EffectProps<TPayload>, payload: TPayload) => void;

export type Effect<TPayload> = Readonly<{
	action: Action<TPayload>,
	callback: EffectCallback<TPayload>
}>;

export function createEffect<TPayload>(action: Action<TPayload>, callback: EffectCallback<TPayload>): Effect<TPayload> {
	return Object.freeze({ action, callback });
}
