import { AsyncValueStream } from '../../src/utils/AsyncValueStream';
import { StreamClosedError } from '../../src/utils/StreamClosedError';

describe('AsyncValueStream', function () {
	let stream: AsyncValueStream<number>;

	beforeEach(() => {
		stream = new AsyncValueStream<number>();
	});
	it('should resolve dispatched value', function (done) {
		const value = 5;

		stream.dispatch(value);

		stream.select()
			.then((v) => {
				expect(v).toBe(value);
				done();
			});
	});

	it('should resolve previously dispatched value', function (done) {
		const value = 5;

		stream.select()
			.then((v) => {
				expect(v).toBe(value);
				done();
			});

		stream.dispatch(value);
	});

	it('should queue values', function (done) {
		const values = [1, 2, 3];
		const promises = [];

		promises.push(stream.select());
		stream.dispatch(values[0]);
		stream.dispatch(values[1]);
		stream.dispatch(values[2]);
		promises.push(stream.select());
		promises.push(stream.select());

		promises.forEach((promise, i) => promise.then(v => expect(v).toBe(values[i])));

		Promise.all(promises).then(() => done());
	});

	it('should be closeable', function () {
		const value = 5;

		stream.dispatch(value);
		stream.close();

		stream.select()?.then(v => expect(v).toBe(value));
		expect(() => stream.select()).toThrow(StreamClosedError);
	});
});
