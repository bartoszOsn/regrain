import { Store } from '../store/Store';
import { useContext } from 'react';
import { storeContext } from './storeContext';

export function useStore(): Store {
	return useContext(storeContext);
}
