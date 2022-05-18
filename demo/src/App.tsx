import * as React from 'react';
import { AppStoreProvider } from "./AppStoreProvider";
import { Sidebar } from "./Sidebar";

function App() {
	return (
		<AppStoreProvider>
			<div className='w-screen h-screen flex'>
				<Sidebar />
			</div>
		</AppStoreProvider>
	)
}

export default App;
