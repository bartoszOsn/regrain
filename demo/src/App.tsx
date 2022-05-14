import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { createGrain } from 'regrain';

interface Props {
	name: string
}

createGrain('asd', 5);

class App extends React.Component<Props> {
	render() {
		const { name } = this.props;
		return (
			<>
				<h1 className="text-4xl text-white bg-black">
				Hello {name}
				</h1>
			</>
		);
	}
}

export default hot(App);
