import { IPluginContext } from '../types';
import { createPlugin, loadPlugins, getPluginContext } from '..';

interface ILarry {
  name: 'larry';
}

interface IJerry {
  name: 'jerry';
  events: {
    idea(title: string, craziness: number): void;
  };
}

function validateContext({ pluginName }: IPluginContext<ILarry>) {
  expect(pluginName).toBe('larry');
}

it('calls event handler of other plugin', () => {
  createPlugin<IJerry>({ name: 'jerry' }).register();

  const { on, register } = createPlugin<ILarry>({ name: 'larry' });
  const handleIdea = jest.fn();
  on<IJerry>('jerry', {
    idea: (context, title: string, craziness: number) => {
      validateContext(context);
      handleIdea(title, craziness);
    },
  });
  register();

  loadPlugins();
  const { emit } = getPluginContext<IJerry>('jerry');
  emit('idea', 'show about nothing', 50);

  expect(handleIdea).toHaveBeenCalledWith('show about nothing', 50);
});
