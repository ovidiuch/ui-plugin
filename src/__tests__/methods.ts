import { mountPlugins, registerPlugin, unregisterPlugins } from '..';

afterEach(unregisterPlugins);

it('calls method handler', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'test-plugin1' });

  const handleMethod = jest.fn();
  method('testMethod', handleMethod);

  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ callMethod }) => {
    callMethod('test-plugin1.testMethod');
    expect(handleMethod).toBeCalled();
  });

  mountPlugins();
});

it('calls method handler with params', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'test-plugin1' });

  method('testMethod', (context, one, two) => {
    expect(one).toBe('foo');
    expect(two).toBe('bar');
  });

  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ callMethod }) => {
    callMethod('test-plugin1.testMethod', 'foo', 'bar');
  });

  mountPlugins();
});

it('returns method handler return value', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'test-plugin1' });

  const returnVal = {};
  method('testMethod', () => returnVal);

  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ callMethod }) => {
    expect(callMethod('test-plugin1.testMethod')).toBe(returnVal);
  });

  mountPlugins();
});

it('calls method handler with plugin context', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'test-plugin1', initialState: 0 });

  method('testMethod', context => {
    expect(context.getState()).toBe(0);
  });

  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ callMethod }) => {
    callMethod('test-plugin1.testMethod');
  });

  mountPlugins();
});
