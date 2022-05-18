import * as React from "react";
import { useGrain } from "regrain";
import { examplesGrain } from "./AppStoreProvider";

export function Sidebar() {
	const examples = useGrain(examplesGrain);

	return (
		<div>
			{
				examples.map(example => (
					<a href={example.urlPath}>{ example.name }</a>
				))
			}
		</div>
	)
}
