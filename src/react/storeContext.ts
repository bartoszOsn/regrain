import { createContext } from 'react';
import { Store } from '../store/Store';
import { NullStore } from '../store/NullStore';

export const storeContext = createContext<Store>(NullStore.get());
