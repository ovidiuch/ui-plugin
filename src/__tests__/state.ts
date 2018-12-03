import { mountPlugins, registerPlugin, unregisterPlugins } from '..';

afterEach(unregisterPlugins);

it('gets initial state from context', () => {
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

it('gets custom state from context', () => {
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

it('gets state of other plugin from context', () => {
  expect.assertions(1);

  registerPlugin({
    name: 'test-plugin',
    initialState: { counter: 0 },
  });
  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ getStateOf }) => {
    expect(getStateOf('test-plugin').counter).toBe(0);
  });

  mountPlugins();
});
