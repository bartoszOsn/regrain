import { Store } from './Store';
import { Action } from '../action';
import { Grain } from '../grain';
import { StoreOptions } from './StoreOptions';
import { Effect } from '../effect';
import { UnsubscribeFunc } from './BaseStore';
import { EffectManager } from './EffectManager';

export class SubjectStore extends Store {
	private readonly parentStore: Store;

	private readonly effectManager: EffectManager;

	private readonly values: Map<Grain<any>, any>;

	private readonly listeners: Map<Grain<any>, Set<(newValue: any) => void>>;

	constructor(
		options: StoreOptions & { parent: Store },
	) {
		super();
		this.parentStore = options.parent;
		this.values = new Map<Grain<any>, any>(options.grains.map(grain => [grain, grain.initialValue]));

		this.effectManager = new EffectManager({
			get: (grain) => this.get(grain),
			set: (grain, value) => this.set(grain, value),
			dispatch: (action) => this.dispatch(action),
		},
		new Set<Effect>(options.effects),
		new Set<Action<unknown>>(options.actions),
		);

		this.listeners = new Map<Grain<any>, Set<(newValue: any) => void>>(options.grains.map(grain => [grain, new Set<(newValue: any) => void>()]));

		this.effectManager.initialize();
	}

	finalize(): void {
		this.effectManager.finalize();
	}

	override dispatch<TPayload>(action: ReturnType<Action<TPayload>>) {
		if (!this.effectManager.canHandleAction(action.type)) {
			this.parentStore.dispatch(action);
			return;
		}

		this.effectManager.dispatch(action);
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
