import { Store } from './Store';
import { Action } from '../action';
import { UnsubscribeFunc } from './BaseStore';
import { Grain } from '../grain';

export class NullStore extends Store {
	private static instance: NullStore | null = null;

	static get(): NullStore {
		if (!this.instance) {
			this.instance = new NullStore();
		}

		return this.instance;
	}

	override dispatch<TPayload>(action: Action<TPayload>, _payload: TPayload): void {
		throw new Error(`Didn't found a store with given action [${action.name}] in hierarchy`);
	}

	override listen<T>(changedGrain: Grain<T>, _callback: (newValue: T) => void): UnsubscribeFunc {
		throw new Error(`Didn't found a store with given grain [${changedGrain.name}] in hierarchy`);
	}

	override get<T>(_atom: Grain<T>): T {
		throw new Error();
	}

	override set<T>(_atom: Grain<T>, _value: T): void {
		throw new Error();
	}
}
