import { StreamClosedError } from './StreamClosedError';

export class AsyncValueStream<T> {
	private queue: Array<T> = [];

	private onDispatch: (() => void) | null = null;

	private isClosed: boolean = false;


	select(): Promise<T> {
		if (this.queue.length > 0) {
			return Promise.resolve(this.queue.shift()!);
		}

		if (this.isClosed) {
			throw new StreamClosedError();
		}

		return new Promise(resolve => {
			this.onDispatch = () => {
				resolve(this.queue.shift()!);
			};
		});
	}

	dispatch(value: T): void {
		this.queue.push(value);
		if (this.onDispatch) {
			this.onDispatch();
		}
		this.onDispatch = null;
	}

	close(): void {
		this.isClosed = true;
	}
}
