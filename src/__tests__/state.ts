import { mountPlugins, registerPlugin, unregisterPlugins } from '..';

afterEach(unregisterPlugins);

it('gets initial state from context', () => {
  expect.hasAssertions();

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
  expect.hasAssertions();

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
  expect.hasAssertions();

  registerPlugin({
    name: 'test-plugin1',
    initialState: { counter: 0 },
  });
  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ getStateOf }) => {
    expect(getStateOf('test-plugin1').counter).toBe(0);
  });

  mountPlugins();
});

it('sets state', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'test-plugin',
    initialState: { counter: 1 },
  });

  init(({ getState, setState }) => {
    setState({ counter: 2 }, () => {
      expect(getState().counter).toBe(2);
    });
  });

  mountPlugins();
});

it('sets state using updater function', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'test-plugin',
    initialState: { counter: 1 },
  });

  init(({ getState, setState }) => {
    setState(
      prevState => ({ counter: prevState.counter + 2 }),
      () => {
        expect(getState().counter).toBe(3);
      },
    );
  });

  mountPlugins();
});
