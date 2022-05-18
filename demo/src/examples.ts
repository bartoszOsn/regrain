import * as React from "react";
import { BasicRoot } from "./basic";

export interface ExampleProps {
	name: string;
	component: React.ComponentType;
	urlPath: string;
	filePaths: string[];
}

export const examples: ExampleProps[] = [
	{
		name: 'Basic',
		component: BasicRoot,
		urlPath: 'basic',
		filePaths: [
			'./basic/BasicRoot.tsx'
		]
	}
]
