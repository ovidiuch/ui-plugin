import { loadPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('calls method handler', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'test1' });
  const handleMethod = jest.fn();
  method('testMethod', handleMethod);

  const { init } = registerPlugin({ name: 'test2' });
  init(({ callMethod }) => {
    callMethod('test1.testMethod');
    expect(handleMethod).toBeCalled();
  });

  loadPlugins();
});

it('calls method handler with params', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'test1' });
  method('testMethod', (context, one, two) => {
    expect(one).toBe('foo');
    expect(two).toBe('bar');
  });

  const { init } = registerPlugin({ name: 'test2' });
  init(({ callMethod }) => {
    callMethod('test1.testMethod', 'foo', 'bar');
  });

  loadPlugins();
});

it('returns method handler return value', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'test1' });
  const returnVal = {};
  method('testMethod', () => returnVal);

  const { init } = registerPlugin({ name: 'test2' });
  init(({ callMethod }) => {
    expect(callMethod('test1.testMethod')).toBe(returnVal);
  });

  loadPlugins();
});

it('calls method handler with plugin context', () => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'test1', initialState: 0 });
  method('testMethod', context => {
    expect(context.getState()).toBe(0);
  });

  const { init } = registerPlugin({ name: 'test2' });
  init(({ callMethod }) => {
    callMethod('test1.testMethod');
  });

  loadPlugins();
});

it('throws exception on missing plugin', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'test2' });
  init(({ callMethod }) => {
    setTimeout(() => {
      expect(() => {
        callMethod('test1.testMethod');
      }).toThrow('Called method testMethod of missing plugin test1');
      done();
    });
  });

  loadPlugins();
});

it('throws exception on missing method', done => {
  expect.hasAssertions();

  registerPlugin({ name: 'test1' });

  const { init } = registerPlugin({ name: 'test2' });
  init(({ callMethod }) => {
    setTimeout(() => {
      expect(() => {
        callMethod('test1.testMethod');
      }).toThrow('Called missing method testMethod of plugin test1');
      done();
    });
  });

  loadPlugins();
});

it('throws exception on disabled plugin', done => {
  expect.hasAssertions();

  const { method } = registerPlugin({
    name: 'test1',
    enabled: false,
  });
  method('testMethod', () => undefined);

  const { init } = registerPlugin({ name: 'test2' });
  init(({ callMethod }) => {
    setTimeout(() => {
      expect(() => {
        callMethod('test1.testMethod');
      }).toThrow('Called method testMethod of disabled plugin test1');
      done();
    });
  });

  loadPlugins();
});
