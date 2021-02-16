import { createPlugin } from '../createPlugin';
import { getPluginContext, loadPlugins, resetPlugins } from '../loadPlugins';

interface Terry {
  name: 'terry';
  state: { size: number };
}

function createTestPlugin() {
  createPlugin<Terry>({
    name: 'terry',
    initialState: { size: 5 },
  }).register();
}

function typeCheckState(state: Terry['state']) {
  return state;
}

afterEach(resetPlugins);

it('gets initial state', () => {
  createTestPlugin();
  loadPlugins();

  const { getState } = getPluginContext<Terry>('terry');
  expect(typeCheckState(getState())).toEqual({ size: 5 });
});

it('gets injected state', () => {
  createTestPlugin();
  loadPlugins({
    state: {
      terry: { size: 10 },
    },
  });

  const { getState } = getPluginContext<Terry>('terry');
  expect(typeCheckState(getState())).toEqual({ size: 10 });
});

it('sets state', done => {
  createTestPlugin();
  loadPlugins({
    state: {
      terry: { size: 10 },
    },
  });

  const { getState, setState } = getPluginContext<Terry>('terry');
  setState({ size: 20 }, () => {
    expect(getState()).toEqual({ size: 20 });
    done();
  });
});

it('sets state via updater', done => {
  createTestPlugin();
  loadPlugins({
    state: {
      terry: { size: 10 },
    },
  });

  const { getState, setState } = getPluginContext<Terry>('terry');
  setState(
    prevState => ({ size: prevState.size * 2.2 }),
    () => {
      expect(getState()).toEqual({ size: 22 });
      done();
    },
  );
});
