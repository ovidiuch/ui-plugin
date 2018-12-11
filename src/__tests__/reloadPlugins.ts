import { loadPlugins, registerPlugin, reloadPlugins, resetPlugins } from '..';

afterEach(resetPlugins);

it('preserves state after reload', done => {
  expect.assertions(2);
  let state = 0;

  const { init } = registerPlugin({ name: 'testPlugin', initialState: state });
  init(({ getState, setState }) => {
    expect(getState()).toBe(state);

    if (state === 1) {
      done();
    } else {
      setState((state = 1));
    }
  });

  loadPlugins();
  reloadPlugins();
});
