import { resetPlugins, createPlugin, loadPlugins, getPluginContext } from '..';

interface ITerry {
  name: 'terry';
  state: number;
}

function createTestPlugin() {
  createPlugin<ITerry>({
    name: 'terry',
    initialState: 5,
  }).register();
}

afterEach(resetPlugins);

it('gets state', () => {
  createTestPlugin();

  loadPlugins({ state: { terry: 10 } });
  const { getState } = getPluginContext<ITerry>('terry');

  const state: number = getState();
  expect(state).toBe(10);
});

it('sets state', done => {
  createTestPlugin();

  loadPlugins({ state: { terry: 10 } });
  const { getState, setState } = getPluginContext<ITerry>('terry');

  setState(20, () => {
    expect(getState()).toBe(20);
    done();
  });
});

it('sets state via updater', done => {
  createTestPlugin();

  loadPlugins({ state: { terry: 10 } });
  const { getState, setState } = getPluginContext<ITerry>('terry');

  setState(
    prevState => prevState * 2.2,
    () => {
      expect(getState()).toBe(22);
      done();
    },
  );
});
