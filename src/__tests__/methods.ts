import { loadPlugins, registerPlugin, resetPlugins, unloadPlugins } from '..';

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

  loadPlugins();
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

  loadPlugins();
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

  loadPlugins();
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

  loadPlugins();
});

it('throws exception after plugins unloaded', done => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'testPlugin1', initialState: 0 });
  method('testMethod', () => undefined);

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ callMethod }) => {
    setTimeout(() => {
      expect(() => {
        callMethod('testPlugin1.testMethod');
      }).toThrow(
        'Not loaded plugin testPlugin2 called method testPlugin1.testMethod',
      );
      done();
    });
  });

  loadPlugins();
  unloadPlugins();
});
