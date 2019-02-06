import retry from '@skidding/async-retry';
import { resetPlugins, createPlugin, loadPlugins, getPluginContext, onStateChange } from '..';

interface ITerry {
  name: 'terry';
  state: number;
}

afterEach(resetPlugins);

it('emits state change event', async () => {
  const handleChange = jest.fn();
  onStateChange(handleChange);

  createPlugin<ITerry>({ name: 'terry', initialState: 5 }).register();
  loadPlugins();

  const { getState, setState } = getPluginContext<ITerry>('terry');
  setState(10);

  await retry(() => expect(getState()).toBe(10));
  expect(handleChange).toBeCalledTimes(1);
});

it('makes context available in state change handler', () => {
  // This is a regression test. Before the issues was fixed, global state change
  // handlers could be called before the plugin context was made available, due
  // to incorrect initialization order.
  expect.assertions(1);

  const { onLoad, register } = createPlugin<ITerry>({ name: 'terry', initialState: 0 });
  onLoad(context => {
    context.setState(1);
  });
  register();

  onStateChange(() => {
    expect(() => {
      getPluginContext('terry');
    }).not.toThrowError();
  });

  loadPlugins();
});
