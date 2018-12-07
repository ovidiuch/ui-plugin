import {
  addStateHandler,
  loadPlugins,
  registerPlugin,
  removeStateHandler,
  resetPlugins,
} from '..';

// WARN: These tests might need to be refactored if state updates become async
afterEach(resetPlugins);

it('calls state handler', async () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'testPlugin',
    initialState: { counter: 0 },
  });

  const handler = jest.fn();
  addStateHandler({ pluginName: 'testPlugin', handler });

  init(({ setState }) => {
    setState({ counter: 1 });
    expect(handler).toBeCalled();
  });

  loadPlugins();
});

it('stops calling state handler', async () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'testPlugin',
    initialState: { counter: 0 },
  });

  const handler = jest.fn();
  addStateHandler({ pluginName: 'testPlugin', handler });

  init(({ setState }) => {
    setState({ counter: 1 });
    expect(handler).toBeCalled();

    removeStateHandler({ pluginName: 'testPlugin', handler });

    setState({ counter: 2 });
    expect(handler).toBeCalledTimes(1);
  });

  loadPlugins();
});
