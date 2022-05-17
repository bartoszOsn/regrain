import { Effect, EffectProps, EffectSelector } from '../effect';
import { Action } from '../action';
import { AsyncValueStream } from '../utils/AsyncValueStream';

export class EffectManager {

	private readonly streams: AsyncValueStream<ReturnType<Action<any>>>[] = [];

	constructor(
		private readonly effectProps: EffectProps,
		private readonly effects: Set<Effect>,
		private readonly actions: Set<Action<unknown>>,
	) {
	}

	initialize() {
		this.effects.forEach((effect) => {
			const stream = new AsyncValueStream<ReturnType<Action<any>>>();
			const selectFunc = <TPayload>(selector?: EffectSelector<ReturnType<Action<TPayload>>>) => (stream.select(selector) as Promise<ReturnType<Action<TPayload>>>);
			effect(selectFunc, this.effectProps);
			this.streams.push(stream);
		});
	}

	canHandleAction<T>(action: Action<T>): boolean {
		return this.actions.has(action as Action<unknown>);
	}

	dispatch<T>(action: ReturnType<Action<T>>): void {
		if (!this.canHandleAction(action.type)) {
			throw new Error(`Cannot handle action ${action.name}`);
		}

		this.streams.forEach(stream => stream.dispatch(action));
	}

	finalize(): void {
		this.streams.forEach(stream => stream.close());
	}
}
