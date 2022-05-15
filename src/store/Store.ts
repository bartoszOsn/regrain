import { Action } from '../action';
import { BaseStore, UnsubscribeFunc } from './BaseStore';
import { Grain } from '../grain';

export abstract class Store implements BaseStore {
	abstract dispatch<TPayload>(action: ReturnType<Action<TPayload>>): void;
	abstract listen<T>(changedGrain: Grain<T>, callback: (newValue: T) => void): UnsubscribeFunc;
	abstract get<T>(atom: Grain<T>): T;
	abstract set<T>(atom: Grain<T>, value: T): void;
}
