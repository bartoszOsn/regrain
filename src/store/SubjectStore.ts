import { Store } from './Store';
import { Action } from '../action';
import { Grain } from '../grain';
import { StoreOptions } from './StoreOptions';
import { Effect, EffectProps } from '../effect';
import { UnsubscribeFunc } from './BaseStore';

export class SubjectStore extends Store {
	private readonly parentStore: Store;

	private readonly values: Map<Grain<any>, any>;

	private readonly effects: Map<Action<any>, Set<Effect<any>>>;

	private readonly listeners: Map<Grain<any>, Set<(newValue: any) => void>>;

	private readonly dispatchFunc: EffectProps["dispatch"] = <TPayload extends unknown>(action: Action<TPayload>, payload: TPayload) => this.dispatch(action, payload);

	private readonly getFunc: EffectProps["get"] = <T extends unknown>(grain: Grain<T>) => this.get(grain);

	private readonly setFunc: EffectProps["set"] = <T extends unknown>(grain: Grain<T>, value: T) => this.set(grain, value);

	constructor(
		options: StoreOptions & { parent: Store },
	) {
		super();
		this.parentStore = options.parent;
		this.values = new Map<Grain<any>, any>(options.grains.map(grain => [grain, grain.initialValue]));

		this.effects = new Map<Action<any>, Set<Effect<any>>>(options.actions.map(action => [action, new Set<Effect<any>>()]));
		options.effects.forEach((effect) => {
			if (!this.effects.has(effect.action)) {
				throw new Error(`effect listen's to action that isn't present in this store: [${effect.action.name}]`);
			}

			this.effects.get(effect.action)!.add(effect);
		});

		this.listeners = new Map<Grain<any>, Set<(newValue: any) => void>>(options.grains.map(grain => [grain, new Set<(newValue: any) => void>()]));
	}

	override dispatch<TPayload>(action: Action<TPayload>, payload: TPayload) {
		if (!this.effects.has(action)) {
			this.parentStore.dispatch(action, payload);
			return;
		}

		const set = this.effects.get(action)!;

		for (const effect of set) {
			effect.callback({
				dispatch: this.dispatchFunc,
				get: this.getFunc,
				set: this.setFunc,
			}, payload);
		}
	}

	override listen<T>(changedAtom: Grain<T>, callback: (newValue: T) => void): UnsubscribeFunc {
		if (!this.listeners.has(changedAtom)) {
			return this.parentStore.listen(changedAtom, callback);
		}

		this.listeners.get(changedAtom)!.add(callback);

		callback(this.values.get(changedAtom));

		return () => this.listeners.get(changedAtom)!.delete(callback);
	}

	override get<T>(grain: Grain<T>): T {
		if (!this.values.has(grain)) {
			return this.parentStore.get(grain);
		}

		return this.values.get(grain);
	}

	override set<T>(grain: Grain<T>, value: T): void {
		if (!this.values.has(grain)) {
			throw new Error(`This grain [${grain.name}] doesn't belong to this store.`);
		}

		this.values.set(grain, value);
		this.listeners.get(grain)!.forEach(callback => callback(value));
	}

	getParent(): Store {
		return this.parentStore;
	}
}
