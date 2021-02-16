import retry from '@skidding/async-retry';
import { createPlugin } from '../createPlugin';
import { getPluginContext, loadPlugins, resetPlugins } from '../loadPlugins';
import { onStateChange } from '../pluginStore';

interface Terry {
  name: 'terry';
  state: { size: number };
}

afterEach(resetPlugins);

it('emits state change event', async () => {
  const handleChange = jest.fn();
  onStateChange(handleChange);

  createPlugin<Terry>({
    name: 'terry',
    initialState: { size: 5 },
  }).register();
  loadPlugins();

  const { getState, setState } = getPluginContext<Terry>('terry');
  setState({ size: 10 });

  await retry(() => expect(getState()).toEqual({ size: 10 }));
  expect(handleChange).toBeCalledTimes(1);
});

it('makes context available in state change handler', () => {
  // This is a regression test. Before the issues was fixed, global state change
  // handlers could be called before the plugin context was made available, due
  // to incorrect initialization order.
  expect.assertions(1);

  const { onLoad, register } = createPlugin<Terry>({
    name: 'terry',
    initialState: { size: 0 },
  });
  onLoad(context => {
    context.setState({ size: 1 });
  });
  register();

  onStateChange(() => {
    expect(() => getPluginContext('terry')).not.toThrowError();
  });

  loadPlugins();
});
