import { StreamClosedError } from './StreamClosedError';

type LazyPromise<T> = {
	promise: Promise<T>,
	resolve: (value: T | PromiseLike<T>) => void,
	reject: (reason?: any) => void
};

function getLazyPromise<T>(): LazyPromise<T> {
	const result: Partial<LazyPromise<T>> = {};
	
	result.promise = new Promise<T>(((resolve, reject) => {
		result.resolve = resolve;
		result.reject = reject;
	}));
	
	return result as LazyPromise<T>;
}

export class AsyncValueStream<T> {
	private queue: Array<T> = [];
	private promiseQueue: Array<LazyPromise<T>> = [];

	private isClosed: boolean = false;

	async select(selector?: (value: T) => boolean): Promise<T> {
		if (!selector) {
			selector = () => true;
		}

		while(true) {
			const value = await this.selectAll();
			if (selector(value)) {
				return value;
			}
		}
	}

	private selectAll(): Promise<T> {
		const lazyPromise = getLazyPromise<T>();
		this.promiseQueue.push(lazyPromise);

		this.resolvePromises();

		return lazyPromise.promise;
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
		const count = Math.min(this.queue.length, this.promiseQueue.length);

		for (let i = 0; i < count; i++) {
			const promise = this.promiseQueue.shift()!;
			const value = this.queue.shift()!;

			promise.resolve(value);
		}

		if (this.isClosed) {
			while(this.promiseQueue.length) {
				const promise = this.promiseQueue.shift()!;
				promise.reject(new StreamClosedError());
			}
		}
	}
}
