import { Action } from './action';
import { Grain } from "./grain";

export interface EffectProps {
	dispatch: <TPayload>(action: Action<TPayload>, payload: TPayload) => void;
	get: <TValue>(grain: Grain<TValue>) => TValue;
	set: <TValue>(grain: Grain<TValue>, value: TValue) => void;
}

export type EffectCallback<TPayload> = (props: EffectProps, payload: TPayload) => void;

export type Effect<TPayload> = Readonly<{
	action: Action<TPayload>,
	callback: EffectCallback<TPayload>
}>;

export function createEffect<TPayload>(action: Action<TPayload>, callback: EffectCallback<TPayload>): Effect<TPayload> {
	return Object.freeze({ action, callback });
}
