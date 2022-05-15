import { StreamClosedError } from './StreamClosedError';

type AsyncValueStreamSelector<T> = (value: T) => boolean;

type AsyncValueStreamListener<T> = {
	promise: Promise<T>,
	resolve: (value: T | PromiseLike<T>) => void,
	reject: (reason?: any) => void,
	selector: AsyncValueStreamSelector<T>
};

function getAsyncValueStreamListener<T>(selector: AsyncValueStreamSelector<T>): AsyncValueStreamListener<T> {
	const result: Partial<AsyncValueStreamListener<T>> = {
		selector,
	};
	
	result.promise = new Promise<T>(((resolve, reject) => {
		result.resolve = resolve;
		result.reject = reject;
	}));
	
	return result as AsyncValueStreamListener<T>;
}

export class AsyncValueStream<T> {
	private queue: Array<T> = [];

	private promiseQueue: Array<AsyncValueStreamListener<T>> = [];

	private isClosed: boolean = false;

	async select(selector?: (value: T) => boolean): Promise<T> {
		if (!selector) {
			selector = () => true;
		}

		const listener = getAsyncValueStreamListener<T>(selector);
		this.promiseQueue.push(listener);

		this.resolvePromises();

		return listener.promise;
	}

	dispatch(value: T): void {
		if (this.isClosed) {
			return;
		}
		this.queue.push(value);
		this.resolvePromises();
	}

	close(): void {
		this.isClosed = true;
	}

	private resolvePromises(): void {
		while (this.promiseQueue.length > 0 && this.queue.length > 0) {
			const promise = this.promiseQueue[0];
			let value: T;
			while (this.queue.length > 0) {
				value = this.queue.shift()!;
				if (promise.selector(value)) {
					this.promiseQueue.shift();
					promise.resolve(value);
					break;
				}
			}
		}

		if (this.isClosed && this.queue.length === 0) {
			while (this.promiseQueue.length > 0) {
				const promise = this.promiseQueue.shift()!;
				promise.reject(new StreamClosedError());
			}
		}
	}
}
