import { Store } from '../../src/store/Store';
import { Action, createAction, createSimpleEffect, createGrain, Effect, Grain } from '../../src';
import { SubjectStore } from '../../src/store/SubjectStore';
import Mock = jest.Mock;

function waitTick() {
	return new Promise(resolve => {
		setTimeout(resolve);
	});
}

describe('SubjectStore', function () {
	describe('basic', function () {

		let store: Store,
			action: Action<string>,
			grain: Grain<string>,
			effect: Effect,
			effectCallback: Mock;

		const grainInitialValue = 'initialValue';

		beforeEach(() => {
			effectCallback = jest.fn();

			action = createAction<string>('action');
			grain = createGrain<string>('grain', grainInitialValue);
			effect = createSimpleEffect(action, effectCallback);


			store = new SubjectStore({
				parent: null as unknown as Store,
				actions: [action],
				effects: [effect],
				grains: [grain],
			});
		});

		it('should return grain\'s value with get()', function () {
			expect(store.get(grain)).toBe(grainInitialValue);
		});

		it('should set grain\'s value with set()', function () {
			const newValue = 'new string';

			store.set(grain, newValue);

			expect(store.get(grain)).toBe(newValue);
		});

		it('should run an effect on action', async function () {
			const payload = 'asd';

			store.dispatch(action(payload));

			await waitTick();
			expect(effectCallback.mock.calls.length).toBe(1);
			expect(effectCallback.mock.calls[0][1]).toBe(payload);
		});

		it('should notify immediately of current value on listen()', function () {
			const fn = jest.fn();

			store.listen(grain, fn);

			expect(fn.mock.calls.length).toBe(1);
			expect(fn.mock.calls[0][0]).toBe(grainInitialValue);
		});

		it('should notify of value change', function () {
			const fn = jest.fn();
			const newValue = 'new value';

			store.listen(grain, fn);

			store.set(grain, newValue);

			expect(fn.mock.calls.length).toBe(2);
			expect(fn.mock.calls[0][0]).toBe(grainInitialValue);
			expect(fn.mock.calls[1][0]).toBe(newValue);
		});
	});

	describe('effects', function () {

		let store: Store,
			action: Action<string>,
			grain: Grain<string>,
			effect: Effect,
			effectCallback: Mock;

		const grainInitialValue = 'initialValue';

		beforeEach(() => {
			effectCallback = jest.fn();

			action = createAction<string>('action');
			grain = createGrain<string>('grain', grainInitialValue);
			effect = createSimpleEffect(action, effectCallback);


			store = new SubjectStore({
				parent: null as unknown as Store,
				actions: [action],
				effects: [effect],
				grains: [grain],
			});
		});

		it('should set value inside effect', async function () {
			const newValue = 'new value';

			effectCallback.mockImplementationOnce((props) => {
				props.set(grain, newValue);
			});

			store.dispatch(action(''));

			await waitTick();

			expect(store.get(grain)).toBe(newValue);
		});

		it('should get value inside effect', async function () {
			effectCallback.mockImplementationOnce((props) => {
				expect(props.get(grain)).toBe(grainInitialValue);
			});

			store.dispatch(action(''));

			await waitTick();

			expect(effectCallback.mock.calls.length).toBe(1);
		});

		it('should get a payload inside an effect', async function () {
			const actionPayload = 'new Value';

			effectCallback.mockImplementationOnce((_props, payload) => {
				expect(payload).toBe(actionPayload);
			});

			store.dispatch(action(actionPayload));

			await waitTick();

			expect(effectCallback.mock.calls.length).toBe(1);
		});

		it('should dispatch action from effect', async function () {
			const action2 = createAction('second action');
			const newEffectFn = jest.fn();
			const effect2 = createSimpleEffect(action2, newEffectFn);

			effectCallback.mockImplementationOnce((props) => {
				props.dispatch(action2());
			});

			const store2 = new SubjectStore({
				parent: null as unknown as Store,
				actions: [action, action2],
				grains: [],
				effects: [effect, effect2],
			});
			store2.dispatch(action(''));

			await waitTick();

			expect(newEffectFn.mock.calls.length).toBe(1);
		});
	});

	describe('hierarchy', function () {
		let store: Store,
			action: Action<string>,
			grain: Grain<string>,
			effect: Effect,
			effectCallback: Mock,
			parentStore: { [func in keyof Store]: Mock };

		const grainInitialValue = 'initialValue';

		beforeEach(() => {
			effectCallback = jest.fn();

			action = createAction<string>('action');
			grain = createGrain<string>('grain', grainInitialValue);
			effect = createSimpleEffect(action, effectCallback);

			parentStore = {
				set: jest.fn(),
				get: jest.fn(),
				dispatch: jest.fn(),
				listen: jest.fn(),
			};

			store = new SubjectStore({
				parent: parentStore,
				actions: [action],
				effects: [effect],
				grains: [grain],
			});
		});

		it('should fallback to parent on get if no grain in this store', function () {
			const value = 'parent value';
			parentStore.get.mockReturnValueOnce(value);

			const nonPresentGrain = createGrain<string>('non present grain', '');

			expect(store.get(nonPresentGrain)).toBe(value);
		});

		it('should throw error on set if no grain in this store, and shouldn\'t fallback', function () {
			const nonPresentGrain = createGrain<string>('non present grain', '');

			expect(() => store.set(nonPresentGrain, 'value')).toThrow();
			expect(parentStore.set.mock.calls.length).toBe(0);
		});

		it('should fallback to parent on listen if no grain in this store', function () {
			const nonPresentGrain = createGrain<string>('non present grain', '');

			store.listen(nonPresentGrain, () => void 0);

			expect(parentStore.listen.mock.calls.length).toBe(1);
		});

		it('should fallback to parent on dispatch if no action in this store', function () {
			const nonPresentAction = createAction<void>('non present action');

			store.dispatch(nonPresentAction());

			expect(parentStore.dispatch.mock.calls.length).toBe(1);
		});
	});
});
