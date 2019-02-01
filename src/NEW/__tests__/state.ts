import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';
import { loadPlugins } from '../loadPlugins';

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

it('gets state', () => {
  createTestPlugin();

  const sharedContext = loadPlugins({
    state: { terry: 10 },
  });
  const { getState } = getPluginContext<ITerry>('terry', sharedContext);

  const state: number = getState();
  expect(state).toBe(10);
});

it('sets state', done => {
  createTestPlugin();

  const sharedContext = loadPlugins({
    state: { terry: 10 },
  });
  const { getState, setState } = getPluginContext<ITerry>('terry', sharedContext);

  setState(20, () => {
    expect(getState()).toBe(20);
    done();
  });
});

it('sets state via updater', done => {
  createTestPlugin();

  const sharedContext = loadPlugins({
    state: { terry: 10 },
  });
  const { getState, setState } = getPluginContext<ITerry>('terry', sharedContext);

  setState(
    prevState => prevState * 2.2,
    () => {
      expect(getState()).toBe(22);
      done();
    },
  );
});
