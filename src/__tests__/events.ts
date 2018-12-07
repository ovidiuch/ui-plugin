import { loadPlugins, registerPlugin, resetPlugins, unloadPlugins } from '..';

afterEach(resetPlugins);

it('calls event handler', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'testPlugin1' });
  const handleEvent = jest.fn();
  on('testPlugin2.testEvent', handleEvent);

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ emitEvent }) => {
    emitEvent('testEvent');
    expect(handleEvent).toBeCalled();
  });

  loadPlugins();
});

it('calls event handler with params', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'testPlugin1' });
  on('testPlugin2.testEvent', (context, one, two) => {
    expect(one).toBe('foo');
    expect(two).toBe('bar');
  });

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ emitEvent }) => {
    emitEvent('testEvent', 'foo', 'bar');
  });

  loadPlugins();
});

it('calls event handler with plugin context', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'testPlugin1', initialState: 0 });
  on('testPlugin2.testEvent', context => {
    expect(context.getState()).toBe(0);
  });

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ emitEvent }) => {
    emitEvent('testEvent');
  });

  loadPlugins();
});

it('calls multiple event handlers', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'testPlugin1' });
  const handleEvent1 = jest.fn();
  const handleEvent2 = jest.fn();
  on('testPlugin2.testEvent', handleEvent1);
  on('testPlugin2.testEvent', handleEvent2);

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ emitEvent }) => {
    emitEvent('testEvent');
    expect(handleEvent1).toBeCalled();
    expect(handleEvent2).toBeCalled();
  });

  loadPlugins();
});

it('throws exception after plugins unloaded', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'testPlugin' });
  init(({ emitEvent }) => {
    setTimeout(() => {
      expect(() => {
        emitEvent('testEvent');
      }).toThrow('Not loaded plugin testPlugin emitted event testEvent');
      done();
    });
  });

  loadPlugins();
  unloadPlugins();
});
