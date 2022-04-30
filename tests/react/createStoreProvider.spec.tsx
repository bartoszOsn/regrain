import { createStoreProvider } from "../../src";
import { renderHook } from "@testing-library/react-hooks";
import { useStore } from "../../src/react/useStore";
import { SubjectStore } from "../../src/store/SubjectStore";
import * as React from "react";
import { NullStore } from "../../src/store/NullStore";

describe('createStoreProvider', function () {
	it('should provide a SubjectStore', function () {
		const provider = createStoreProvider({
			effects: [],
			grains: [],
			actions: []
		});

		const { result } = renderHook(() => useStore(), {
			wrapper: provider
		});

		expect(result.current).toBeInstanceOf(SubjectStore);
	});

	it('should provide a parent store if present', function () {
		const ParentProvider = createStoreProvider({
			effects: [],
			grains: [],
			actions: []
		});

		const Provider = createStoreProvider({
			effects: [],
			grains: [],
			actions: []
		});

		const wrapper = (props: {children: React.ReactNode}) => (
		<ParentProvider>
			<Provider>
				{props.children}
			</Provider>
		</ParentProvider>
	)

		const { result } = renderHook(() => useStore(), { wrapper });

		expect((result.current as SubjectStore).getParent()).toBeInstanceOf(SubjectStore);
	});

	it('should provide a NullStore as parent if not found parent in hierarchy', function () {
		const provider = createStoreProvider({
			effects: [],
			grains: [],
			actions: []
		});

		const { result } = renderHook(() => useStore(), {
			wrapper: provider
		});

		expect((result.current as SubjectStore).getParent()).toBeInstanceOf(NullStore);
	});

	// It is something that definitely should be fixed, but there are more important things to do now.
	it.skip('should be able to change parent store without reseting values', function () {
		
	});
});
