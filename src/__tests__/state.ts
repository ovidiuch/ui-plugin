import { loadPlugins, registerPlugin, resetPlugins, unloadPlugins } from '..';

afterEach(resetPlugins);

it('gets initial state from context', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'testPlugin',
    initialState: { counter: 0 },
  });
  init(({ getState }) => {
    expect(getState().counter).toBe(0);
  });

  loadPlugins();
});

it('gets custom state from context', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'testPlugin',
    initialState: { counter: 0 },
  });
  init(({ getState }) => {
    expect(getState().counter).toBe(5);
  });

  loadPlugins({
    state: { testPlugin: { counter: 5 } },
  });
});

it('gets state of other plugin from context', () => {
  expect.hasAssertions();

  registerPlugin({
    name: 'testPlugin1',
    initialState: { counter: 0 },
  });

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ getStateOf }) => {
    expect(getStateOf('testPlugin1').counter).toBe(0);
  });

  loadPlugins();
});

it('sets state', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'testPlugin',
    initialState: { counter: 1 },
  });
  init(({ getState, setState }) => {
    setState({ counter: 2 }, () => {
      expect(getState().counter).toBe(2);
    });
  });

  loadPlugins();
});

it('sets state using updater function', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'testPlugin',
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

  loadPlugins();
});

it('throws exception after plugins unloaded', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'testPlugin',
    initialState: { counter: 0 },
  });
  init(({ setState }) => {
    setTimeout(() => {
      expect(() => {
        setState({ counter: 1 });
      }).toThrow('Not loaded plugin testPlugin called setState');
      done();
    });
  });

  loadPlugins();
  unloadPlugins();
});

it('gets state from 2nd load context', () => {
  let counter = 0;

  const { init } = registerPlugin({
    name: 'testPlugin',
    initialState: { counter },
  });
  init(({ getState }) => {
    counter = getState().counter;
  });

  loadPlugins({
    state: { testPlugin: { counter: 5 } },
  });
  expect(counter).toBe(5);

  loadPlugins({
    state: { testPlugin: { counter: 10 } },
  });
  expect(counter).toBe(10);
});
