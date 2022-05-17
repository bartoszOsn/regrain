import { Action } from './action';
import { Grain } from './grain';

export interface EffectProps {
	dispatch: <TPayload>(action: ReturnType<Action<TPayload>>) => void;
	get: <TValue>(grain: Grain<TValue>) => TValue;
	set: <TValue>(grain: Grain<TValue>, value: TValue) => void;
}

export type EffectCallback<TPayload> = (props: EffectProps, payload: TPayload) => void;

export type Effect<TPayload> = Readonly<{
	action: Action<TPayload>,
	callback: EffectCallback<TPayload>
}>;

export function createSimpleEffect<TPayload>(action: Action<TPayload>, callback: EffectCallback<TPayload>): Effect<TPayload> {
	return Object.freeze({ action, callback });
}
