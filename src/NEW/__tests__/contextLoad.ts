import { IPluginContext } from '../types';
import { unloadPlugins } from '../loadPlugins';
import { resetPlugins, createPlugin, loadPlugins } from '..';

interface ITerry {
  name: 'terry';
}

function validateContext({ pluginName }: IPluginContext<ITerry>) {
  expect(pluginName).toBe('terry');
}

afterEach(resetPlugins);

it('calls load callback', () => {
  const handleLoad = jest.fn();
  const { onLoad, register } = createPlugin<ITerry>({ name: 'terry' });
  onLoad(context => {
    validateContext(context);
    handleLoad();
  });
  register();

  loadPlugins();
  expect(handleLoad).toBeCalled();
});

it('calls unload callback', () => {
  const handleUnload = jest.fn();
  const { onLoad, register } = createPlugin<ITerry>({ name: 'terry' });
  onLoad(() => handleUnload);
  register();

  loadPlugins();
  unloadPlugins();
  expect(handleUnload).toBeCalled();
});

it('calls multiple unload callbacks', () => {
  const handleUnload1 = jest.fn();
  const handleUnload2 = jest.fn();
  const { onLoad, register } = createPlugin<ITerry>({ name: 'terry' });
  onLoad(() => [handleUnload1, undefined, handleUnload2]);
  register();

  loadPlugins();
  unloadPlugins();
  expect(handleUnload1).toBeCalled();
  expect(handleUnload2).toBeCalled();
});
