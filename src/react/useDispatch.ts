import { useCallback } from 'react';
import { useStore } from './useStore';
import { Action } from '../action';

export function useDispatch<TPayload = void>() {
	const store = useStore();
	return useCallback((action: Action<TPayload>, payload: TPayload) => store.dispatch<TPayload>(action, payload), [store]);
}
//TODO better typing, use DispatchFunc.
