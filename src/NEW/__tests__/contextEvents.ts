import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';
import { initPlugins } from '../initPlugins';

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

  const lar = createPlugin<ILarry>({ name: 'larry' });
  const handleIdea = jest.fn();
  lar.on<IJerry>('jerry', {
    idea: (context, title: string, craziness: number) => {
      // Ensure correct context is passed into event handler
      const ctxPluginName: 'larry' = context.pluginName;
      expect(ctxPluginName).toBe('larry');

      handleIdea(title, craziness);
    },
  });
  lar.register();

  const sharedContext = initPlugins();
  const { emit } = getPluginContext<IJerry>('jerry', sharedContext);
  emit('idea', 'show about nothing', 50);

  expect(handleIdea).toHaveBeenCalledWith('show about nothing', 50);
});
