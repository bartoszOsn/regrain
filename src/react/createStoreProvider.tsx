import { StoreOptions } from '../store';
import React, { useEffect } from 'react';
import { storeContext } from './storeContext';
import { useStore } from './useStore';
import { SubjectStore } from '../store/SubjectStore';

export function createStoreProvider(options: StoreOptions): React.FC<{ children: React.ReactNode }> {

	return ({ children }) => {
		const parentStore = useStore();
		const store = React.useMemo(() => new SubjectStore({
			...options,
			parent: parentStore,
		}), [parentStore]);

		useEffect(() => {
			return () => {
				store.finalize();
			};
		}, []);

		return (
			<storeContext.Provider value={store}>
				{children}
			</storeContext.Provider>
		);
	};
}
