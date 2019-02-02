import { IPluginContext } from '../types';
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

  const sharedContext = loadPlugins();
  const { emit } = getPluginContext<IJerry>('jerry', sharedContext);
  emit('idea', 'show about nothing', 50);

  expect(handleIdea).toHaveBeenCalledWith('show about nothing', 50);
});
