import { loadPlugins, registerPlugin, reloadPlugins, resetPlugins } from '..';

afterEach(resetPlugins);

it('preserves state after reload', done => {
  // NOTE: When this test fails, it times out
  const { init } = registerPlugin({ name: 'testPlugin', initialState: 0 });
  init(({ getState, setState }) => {
    // If the state 1 then init() was called a second time, which is only
    // possible if plugins reloaded
    if (getState() === 1) {
      done();
    } else {
      setState(1);
    }
  });

  loadPlugins();
  reloadPlugins();
});
