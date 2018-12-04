import { mountPlugins, registerPlugin, unregisterPlugins } from '..';

afterEach(unregisterPlugins);

it('calls event handler', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'test-plugin1' });

  const handleEvent = jest.fn();
  on('testEvent', handleEvent);

  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ emitEvent }) => {
    emitEvent('testEvent');
    expect(handleEvent).toBeCalled();
  });

  mountPlugins();
});

it('calls event handler with params', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'test-plugin1' });

  on('testEvent', (context, one, two) => {
    expect(one).toBe('foo');
    expect(two).toBe('bar');
  });

  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ emitEvent }) => {
    emitEvent('testEvent', 'foo', 'bar');
  });

  mountPlugins();
});

it('calls event handler with plugin context', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'test-plugin1', initialState: 0 });

  on('testEvent', context => {
    expect(context.getState()).toBe(0);
  });

  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ emitEvent }) => {
    emitEvent('testEvent');
  });

  mountPlugins();
});

it('calls multiple event handlers', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'test-plugin1' });

  const handleEvent1 = jest.fn();
  const handleEvent2 = jest.fn();
  on('testEvent', handleEvent1);
  on('testEvent', handleEvent2);

  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ emitEvent }) => {
    emitEvent('testEvent');
    expect(handleEvent1).toBeCalled();
    expect(handleEvent2).toBeCalled();
  });

  mountPlugins();
});
