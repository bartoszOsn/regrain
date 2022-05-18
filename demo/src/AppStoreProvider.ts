import { createStoreProvider, createGrain } from "regrain";
import { examples } from "./examples";

export const examplesGrain = createGrain('examples', examples);

export const AppStoreProvider = createStoreProvider({
	grains: [examplesGrain],
	actions: [],
	effects: []
});

