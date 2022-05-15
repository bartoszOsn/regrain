import { useCallback } from 'react';
import { useStore } from './useStore';
import { Action } from '../action';

export function useDispatch<TPayload = void>() {
	const store = useStore();
	return useCallback((action: ReturnType<Action<TPayload>>) => store.dispatch<TPayload>(action), [store]);
}
//TODO better typing, use DispatchFunc.
