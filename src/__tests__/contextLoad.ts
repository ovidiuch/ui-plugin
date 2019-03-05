import { PluginContext } from '../types';
import { unloadPlugins } from '../loadPlugins';
import { resetPlugins, createPlugin, loadPlugins, enablePlugin } from '..';

interface Terry {
  name: 'terry';
}

function validateContext({ pluginName }: PluginContext<Terry>) {
  expect(pluginName).toBe('terry');
}

afterEach(resetPlugins);

it('calls load callback', () => {
  const handleLoad = jest.fn();
  const { onLoad, register } = createPlugin<Terry>({ name: 'terry' });
  onLoad(context => {
    validateContext(context);
    handleLoad();
  });
  register();

  loadPlugins();
  expect(handleLoad).toBeCalled();
});

it('omits calling load callback of disabled plugin', () => {
  const handleLoad = jest.fn();
  const { onLoad, register } = createPlugin<Terry>({ name: 'terry' });
  onLoad(context => {
    validateContext(context);
    handleLoad();
  });
  register();
  enablePlugin('terry', false);

  loadPlugins();
  expect(handleLoad).not.toBeCalled();
});

it('calls unload callback', () => {
  const handleUnload = jest.fn();
  const { onLoad, register } = createPlugin<Terry>({ name: 'terry' });
  onLoad(() => handleUnload);
  register();

  loadPlugins();
  unloadPlugins();
  expect(handleUnload).toBeCalled();
});

it('calls multiple unload callbacks', () => {
  const handleUnload1 = jest.fn();
  const handleUnload2 = jest.fn();
  const { onLoad, register } = createPlugin<Terry>({ name: 'terry' });
  onLoad(() => [handleUnload1, undefined, handleUnload2]);
  register();

  loadPlugins();
  unloadPlugins();
  expect(handleUnload1).toBeCalled();
  expect(handleUnload2).toBeCalled();
});
