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

	it('should be closeable', async function () {
		const value = 5;

		stream.dispatch(value);
		stream.close();

		const v = await stream.select();
		expect(v).toBe(value);
		await expect(stream.select()).rejects.toBeInstanceOf(StreamClosedError);
	});

	it('should select only selected values', function (done) {
		const values = [1, 2, 3, 4, 5];
		const selector = (value: number) => value % 2 === 0;
		const selectedValues = values.filter(selector);
		const promises = selectedValues.map(() => stream.select(selector));

		values.forEach((v) => stream.dispatch(v));

		promises.forEach((promise, i) => promise.then(value => expect(value).toBe(selectedValues[i])));

		Promise.all(promises)
			.then(() => done());
	});
});
