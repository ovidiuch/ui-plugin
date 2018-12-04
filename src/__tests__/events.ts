import { mountPlugins, registerPlugin, resetPluginStore } from '..';

afterEach(resetPluginStore);

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

  mountPlugins();
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

  mountPlugins();
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

  mountPlugins();
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

  mountPlugins();
});
