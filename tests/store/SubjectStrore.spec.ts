import { Store } from "../../src/store/Store";
import { Action, createAction, createEffect, createGrain, Effect, Grain } from "../../src";
import { SubjectStore } from "../../src/store/SubjectStore";
import Mock = jest.Mock;

describe('SubjectStore', function () {
	describe('basic', function () {

		let store: Store,
			action: Action<string>,
			grain: Grain<string>,
			effect: Effect<string>,
			effectCallback: Mock

		const grainInitialValue = 'initialValue';

		beforeEach(() => {
			effectCallback = jest.fn();

			action = createAction<string>('action');
			grain = createGrain<string>('grain', grainInitialValue);
			effect = createEffect(action, effectCallback);


			store = new SubjectStore({
				parent: null as unknown as Store,
				actions: [action],
				effects: [effect],
				grains: [grain]
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

		it('should run an effect on action', function () {
			const payload = 'asd';

			store.dispatch(action, payload);

			expect(effectCallback.mock.calls.length).toBe(1);
			expect(effectCallback.mock.calls[0][3]).toBe(payload);
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
			effect: Effect<string>,
			effectCallback: Mock

		const grainInitialValue = 'initialValue';

		beforeEach(() => {
			effectCallback = jest.fn();

			action = createAction<string>('action');
			grain = createGrain<string>('grain', grainInitialValue);
			effect = createEffect(action, effectCallback);


			store = new SubjectStore({
				parent: null as unknown as Store,
				actions: [action],
				effects: [effect],
				grains: [grain]
			});
		});

		it('should throw when effect listen\'s to action not present in the store', function () {
			const action = createAction('action');
			const effect = createEffect(action, () => void 0);


			expect(() => {
				new SubjectStore({
					parent: null as unknown as Store,
					actions: [],
					grains: [],
					effects: [effect]
				})
			}).toThrow();
		});

		it('should set value inside effect', function () {
			const newValue = 'new value';

			effectCallback.mockImplementationOnce((_dispatch, _get, set) => {
				set(grain, newValue);
			});

			store.dispatch(action, '');

			expect(store.get(grain)).toBe(newValue);
		});

		it('should get value inside effect', function () {
			effectCallback.mockImplementationOnce((_dispatch, get) => {
				expect(get(grain)).toBe(grainInitialValue);
			});

			store.dispatch(action, '');

			expect(effectCallback.mock.calls.length).toBe(1);
		});

		it('should get a payload inside an effect', function () {
			const actionPayload = 'new Value';

			effectCallback.mockImplementationOnce((_dispatch, _get, _set, payload) => {
				expect(payload).toBe(actionPayload);
			});

			store.dispatch(action, actionPayload);

			expect(effectCallback.mock.calls.length).toBe(1);
		});

		it('should dispatch action from effect', function () {
			const action2 = createAction('second action');
			const newEffectFn = jest.fn();
			const effect2 = createEffect(action2, newEffectFn);

			effectCallback.mockImplementationOnce((dispatch) => {
				dispatch(action2);
			});

			const store = new SubjectStore({
				parent: null as unknown as Store,
				actions: [action, action2],
				grains: [],
				effects: [effect, effect2]
			});

			store.dispatch(action, '');

			expect(newEffectFn.mock.calls.length).toBe(1);
		});
	});

	describe('hierarchy', function () {
		let store: Store,
			action: Action<string>,
			grain: Grain<string>,
			effect: Effect<string>,
			effectCallback: Mock,
			parentStore: { [func in keyof Store]: Mock };

		const grainInitialValue = 'initialValue';

		beforeEach(() => {
			effectCallback = jest.fn();

			action = createAction<string>('action');
			grain = createGrain<string>('grain', grainInitialValue);
			effect = createEffect(action, effectCallback);

			parentStore = {
				set: jest.fn(),
				get: jest.fn(),
				dispatch: jest.fn(),
				listen: jest.fn()
			};

			store = new SubjectStore({
				parent: parentStore,
				actions: [action],
				effects: [effect],
				grains: [grain]
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

			store.dispatch(nonPresentAction, null);

			expect(parentStore.dispatch.mock.calls.length).toBe(1);
		});
	});
});
