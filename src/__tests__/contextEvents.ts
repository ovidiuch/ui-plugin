import { loadPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('calls event handler', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'test1' });
  const handleEvent = jest.fn();
  on('test2.testEvent', handleEvent);

  const { init } = registerPlugin({ name: 'test2' });
  init(({ emitEvent }) => {
    emitEvent('testEvent');
    expect(handleEvent).toBeCalled();
  });

  loadPlugins();
});

it('calls event handler with params', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'test1' });
  on('test2.testEvent', (context, one, two) => {
    expect(one).toBe('foo');
    expect(two).toBe('bar');
  });

  const { init } = registerPlugin({ name: 'test2' });
  init(({ emitEvent }) => {
    emitEvent('testEvent', 'foo', 'bar');
  });

  loadPlugins();
});

it('calls event handler with plugin context', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'test1', initialState: 0 });
  on('test2.testEvent', context => {
    expect(context.getState()).toBe(0);
  });

  const { init } = registerPlugin({ name: 'test2' });
  init(({ emitEvent }) => {
    emitEvent('testEvent');
  });

  loadPlugins();
});

it('calls multiple event handlers', () => {
  expect.hasAssertions();

  const { on } = registerPlugin({ name: 'test1' });
  const handleEvent1 = jest.fn();
  const handleEvent2 = jest.fn();
  on('test2.testEvent', handleEvent1);
  on('test2.testEvent', handleEvent2);

  const { init } = registerPlugin({ name: 'test2' });
  init(({ emitEvent }) => {
    emitEvent('testEvent');
    expect(handleEvent1).toBeCalled();
    expect(handleEvent2).toBeCalled();
  });

  loadPlugins();
});
