import { Action } from './action';
import { Grain } from './grain';
import { StreamClosedError } from './utils/StreamClosedError';

export interface EffectProps {
	dispatch: <TPayload>(action: ReturnType<Action<TPayload>>) => void;
	get: <TValue>(grain: Grain<TValue>) => TValue;
	set: <TValue>(grain: Grain<TValue>, value: TValue) => void;
}

export type SimpleEffectCallback<TPayload> = (props: EffectProps, payload: TPayload) => void;

export type EffectSelector<T> = (value: T) => boolean;
export type EffectSelectFunction = <TPayload>(selector?: EffectSelector<ReturnType<Action<TPayload>>>) => Promise<ReturnType<Action<TPayload>>>;
export type Effect = (select: EffectSelectFunction, effectProps: EffectProps) => Promise<void>;

export function createSimpleEffect<TPayload>(action: Action<TPayload>, callback: SimpleEffectCallback<TPayload>): Effect {
	return async (select: EffectSelectFunction, effectProps: EffectProps) => {
		while (true) {
			let dispatchedAction: ReturnType<Action<TPayload>>;
			try {
				dispatchedAction = await select((a) => a.type === action);
			} catch (error) {
				if (error instanceof StreamClosedError) {
					return;
				}
				throw error;
			}

			callback(effectProps, dispatchedAction.payload);
		}
	};
}
