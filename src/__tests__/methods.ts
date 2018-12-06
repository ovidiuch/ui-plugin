import { mountPlugins, registerPlugin, resetPlugins, unmountPlugins } from '..';

afterEach(resetPlugins);

it('calls method handler', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'testPlugin1' });
  const handleMethod = jest.fn();
  method('testMethod', handleMethod);

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ callMethod }) => {
    callMethod('testPlugin1.testMethod');
    expect(handleMethod).toBeCalled();
  });

  mountPlugins();
});

it('calls method handler with params', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'testPlugin1' });
  method('testMethod', (context, one, two) => {
    expect(one).toBe('foo');
    expect(two).toBe('bar');
  });

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ callMethod }) => {
    callMethod('testPlugin1.testMethod', 'foo', 'bar');
  });

  mountPlugins();
});

it('returns method handler return value', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'testPlugin1' });
  const returnVal = {};
  method('testMethod', () => returnVal);

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ callMethod }) => {
    expect(callMethod('testPlugin1.testMethod')).toBe(returnVal);
  });

  mountPlugins();
});

it('calls method handler with plugin context', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'testPlugin1', initialState: 0 });
  method('testMethod', context => {
    expect(context.getState()).toBe(0);
  });

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ callMethod }) => {
    callMethod('testPlugin1.testMethod');
  });

  mountPlugins();
});

it('throws exception after plugins unmounted', done => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'testPlugin1', initialState: 0 });
  method('testMethod', () => undefined);

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ callMethod }) => {
    setTimeout(() => {
      expect(() => {
        callMethod('testPlugin1.testMethod');
      }).toThrow(
        'Unmounted plugin testPlugin2 called method testPlugin1.testMethod',
      );
      done();
    });
  });

  mountPlugins();
  unmountPlugins();
});
