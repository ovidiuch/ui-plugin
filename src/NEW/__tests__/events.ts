import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';
import { loadPlugins } from '../loadPlugins';

interface ILarry {
  name: 'larry';
}

interface IJerry {
  name: 'jerry';
  events: {
    idea(title: string, craziness: number): void;
  };
}

it('calls event handler of other plugin', () => {
  createPlugin<IJerry>({ name: 'jerry' }).register();

  const { on, register } = createPlugin<ILarry>({ name: 'larry' });
  const handleIdea = jest.fn();
  on<IJerry>('jerry', {
    idea: (context, title: string, craziness: number) => {
      // Ensure correct context is passed into event handler
      const pluginName: 'larry' = context.pluginName;
      expect(pluginName).toBe('larry');

      handleIdea(title, craziness);
    },
  });
  register();

  const sharedContext = loadPlugins();
  const { emit } = getPluginContext<IJerry>('jerry', sharedContext);
  emit('idea', 'show about nothing', 50);

  expect(handleIdea).toHaveBeenCalledWith('show about nothing', 50);
});
