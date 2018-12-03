import { mountPlugins, registerPlugin, unregisterPlugins } from '..';

afterEach(unregisterPlugins);

it('calls init handler on mount', () => {
  const { init } = registerPlugin({
    name: 'test-plugin',
  });

  const initHandler = jest.fn();
  init(initHandler);

  mountPlugins();

  expect(initHandler).toBeCalled();
});

it('calls return callback of init handler on unmount', () => {
  const { init } = registerPlugin({
    name: 'test-plugin',
  });

  const returnCallback = jest.fn();
  init(() => returnCallback);

  const unmount = mountPlugins();
  unmount();

  expect(returnCallback).toBeCalled();
});

it('gets default config from context in init handler', () => {
  expect.assertions(1);

  const { init } = registerPlugin({
    name: 'test-plugin',
    defaultConfig: { enabled: false },
  });

  init(({ getConfig }) => {
    expect(getConfig().enabled).toBe(false);
  });

  mountPlugins();
});

it('gets custom config from context in init handler', () => {
  expect.assertions(1);

  const { init } = registerPlugin({
    name: 'test-plugin',
    defaultConfig: { enabled: false },
  });

  init(({ getConfig }) => {
    expect(getConfig().enabled).toBe(true);
  });

  mountPlugins({
    config: {
      'test-plugin': { enabled: true },
    },
  });
});

it('gets initial state from context in init handler', () => {
  expect.assertions(1);

  const { init } = registerPlugin({
    name: 'test-plugin',
    initialState: { counter: 0 },
  });

  init(({ getState }) => {
    expect(getState().counter).toBe(0);
  });

  mountPlugins();
});

it('gets custom state from context in init handler', () => {
  expect.assertions(1);

  const { init } = registerPlugin({
    name: 'test-plugin',
    initialState: { counter: 0 },
  });

  init(({ getState }) => {
    expect(getState().counter).toBe(5);
  });

  mountPlugins({
    state: {
      'test-plugin': { counter: 5 },
    },
  });
});
