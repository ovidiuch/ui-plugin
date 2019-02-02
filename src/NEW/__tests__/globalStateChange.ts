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
