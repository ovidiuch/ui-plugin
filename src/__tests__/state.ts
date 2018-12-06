import { mountPlugins, registerPlugin, resetPlugins, unmountPlugins } from '..';

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

  mountPlugins();
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

  mountPlugins({
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

  mountPlugins();
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

  mountPlugins();
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

  mountPlugins();
});

it('throws exception after plugins unmounted', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'testPlugin',
    initialState: { counter: 0 },
  });
  init(({ setState }) => {
    setTimeout(() => {
      expect(() => {
        setState({ counter: 1 });
      }).toThrow('Unmounted plugin testPlugin called setState');
      done();
    });
  });

  mountPlugins();
  unmountPlugins();
});

it('gets state from 2nd mount context', () => {
  let counter = 0;

  const { init } = registerPlugin({
    name: 'testPlugin',
    initialState: { counter },
  });
  init(({ getState }) => {
    counter = getState().counter;
  });

  mountPlugins({
    state: { testPlugin: { counter: 5 } },
  });
  expect(counter).toBe(5);

  mountPlugins({
    state: { testPlugin: { counter: 10 } },
  });
  expect(counter).toBe(10);
});
