import { Grain } from "../grain";
import { useStore } from "./useStore";
import { useEffect, useState } from "react";

export function useGrain<TValue>(grain: Grain<TValue>): TValue {
	const store = useStore();
	const [value, setValue] = useState<TValue>(grain.initialValue);

	useEffect(() => {
		return store.listen(grain, (value) => setValue(value));
	}, [store, grain]);

	return value;
}
