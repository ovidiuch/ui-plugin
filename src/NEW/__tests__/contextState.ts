import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';

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

  const sharedContext = {
    config: {},
    state: { terry: 10 },
    setState: () => undefined,
  };
  const context = getPluginContext<ITerry>('terry', sharedContext);

  const state: number = context.getState();
  expect(state).toBe(10);
});

it('sets state', () => {
  createTestPlugin();

  const setState = jest.fn();
  const sharedContext = { config: {}, state: { terry: 10 }, setState };
  const context = getPluginContext<ITerry>('terry', sharedContext);

  context.setState(20);
  expect(setState).toBeCalledWith('terry', 20);
});

// TODO 'sets state via updater'
// context.setState(prevState => prevState * 2)
