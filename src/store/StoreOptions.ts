import { Grain } from '../grain';
import { Action } from '../action';
import { Effect } from '../effect';

export type StoreOptions = {
	grains: Grain<any>[],
	actions: Action<any>[]
	effects: Effect<any>[]
};
