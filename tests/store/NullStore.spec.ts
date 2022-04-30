import { NullStore } from "../../src/store/NullStore";
import { createAction, createGrain } from "../../src";

describe('NullStore', function () {
	it('should be singleton', function () {
		const store1 = NullStore.get();
		const store2 = NullStore.get();

		expect(store1).toBe(store2);
	});

	it('should throw error when any method is called', function () {
		const store = NullStore.get();

		const action = createAction('action');
		const grain = createGrain('grain', null);

		expect(() => store.get(grain)).toThrow();
		expect(() => store.set(grain, null)).toThrow();
		expect(() => store.dispatch(action, null)).toThrow();
		expect(() => store.listen(grain, () => void 0)).toThrow();
	});
});
