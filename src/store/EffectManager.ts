import { Effect, EffectProps } from '../effect';
import { Action } from '../action';

export class EffectManager {

	constructor(
		private readonly effectProps: EffectProps,
		private readonly effects: Set<Effect<unknown>>,
		private readonly actions: Set<Action<unknown>>,
	) {
	}

	initialize() {
		this.effects.forEach((effect) => {
			if (!this.actions.has(effect.action as Action<unknown>)) {
				throw new Error(`effect listen's to action that isn't present in this store: [${effect.action.name}]`);
			}
		});
	}

	canHandleAction<T>(action: Action<T>): boolean {
		return this.actions.has(action as Action<unknown>);
	}

	dispatch<T>(action: ReturnType<Action<T>>): void {
		if (!this.canHandleAction(action.type)) {
			throw new Error(`Cannot handle action ${action.name}`);
		}

		[...this.effects]
			.filter(effect => effect.action === action.type)
			.forEach(effect => effect.callback(this.effectProps, action.payload));
	}

	finalize(): void {

	}
}
