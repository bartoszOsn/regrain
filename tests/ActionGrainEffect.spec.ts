import { createAction, createEffect, createGrain, EffectProps } from '../src';

describe('Action, Grain and Effect', function () {
	describe('Action', function () {
		it('should be properly created by createAction', function () {
			const name = 'name';
			const action = createAction(name);

			expect(action.name).toMatch(name);
		});
	});

	describe('Grain', function () {
		it('should be properly created by createGrain', function () {
			const name = 'name';
			const value = 5;
			const grain = createGrain(name, value);

			expect(grain.name).toMatch(name);
			expect(grain.initialValue).toBe(value);
		});

		it('should be immutable', function () {
			const grain = createGrain('name', 5);

			expect(() => (grain as any).name = 'otherName').toThrow(TypeError);
			expect(() => (grain as any).initialValue = 6).toThrow(TypeError);
		});
	});

	describe('Effect', function () {
		it('should be properly created by createEffect', function () {
			const action = createAction('name');
			let fired = false;
			const callback = () => fired = true;

			const effect = createEffect(action, callback);
			effect.callback(null as unknown as EffectProps);

			expect(effect.action).toBe(action);
			expect(fired).toBeTruthy();
		});

		it('should be immutable', function () {
			const effect = createEffect(createAction('name'), () => void 0);

			expect(() => (effect as any).action = createAction('otherName')).toThrow(TypeError);
			expect(() => (effect as any).callback = () => null).toThrow(TypeError);
		});
	});
});
