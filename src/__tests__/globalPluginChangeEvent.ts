import retry from '@skidding/async-retry';
import delay from 'delay';
import { enablePlugin, onPluginChange, resetPlugins } from '..';
import { registerPlugin } from '../registerPlugin';

afterEach(resetPlugins);

it('emits change event on registering', async () => {
  const handlePluginChange = jest.fn();
  onPluginChange(handlePluginChange);

  registerPlugin({ name: 'test' });

  await retry(() => expect(handlePluginChange).toBeCalled());
});

it('emits change event with plugin list', async () => {
  const handlePluginChange = jest.fn();
  onPluginChange(handlePluginChange);

  const p1 = registerPlugin({ name: 'test1' });
  const p2 = registerPlugin({ name: 'test2' });

  await retry(() =>
    expect(handlePluginChange).lastCalledWith({
      [p1.pluginId]: expect.objectContaining({ name: 'test1' }),
      [p2.pluginId]: expect.objectContaining({ name: 'test2' }),
    }),
  );
});

it('emits change event on disabling', async () => {
  const handlePluginChange = jest.fn();
  onPluginChange(handlePluginChange);

  const { pluginId } = registerPlugin({ name: 'test' });
  enablePlugin(pluginId, false);

  await retry(() => {
    expect(handlePluginChange).toBeCalledTimes(2);
    expect(handlePluginChange).lastCalledWith({
      [pluginId]: expect.objectContaining({ name: 'test', enabled: false }),
    });
  });
});

it('emits change event on re-enabling', async () => {
  const handlePluginChange = jest.fn();
  onPluginChange(handlePluginChange);

  const { pluginId } = registerPlugin({ name: 'test' });
  enablePlugin(pluginId, false);
  enablePlugin(pluginId, true);

  await retry(() => {
    expect(handlePluginChange).toBeCalledTimes(3);
    expect(handlePluginChange).lastCalledWith({
      [pluginId]: expect.objectContaining({ name: 'test', enabled: true }),
    });
  });
});

it('stops emitting change event', async () => {
  const handlePluginChange = jest.fn();
  const removeHandler = onPluginChange(handlePluginChange);
  removeHandler();

  registerPlugin({ name: 'test' });

  await delay(50);
  expect(handlePluginChange).not.toBeCalled();
});
