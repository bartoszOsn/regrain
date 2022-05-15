import { Grain } from '../grain';
import { Action } from '../action';

export type UnsubscribeFunc = () => void;

export interface BaseStore {
	dispatch<TPayload>(action: ReturnType<Action<TPayload>>): void;
	listen<T>(changedGrain: Grain<T>, callback: (newValue: T) => void): UnsubscribeFunc;
}
