import { PluginContext } from '../types';
import { resetPlugins, createPlugin, loadPlugins, getPluginContext } from '..';

interface Larry {
  name: 'larry';
}

interface Jerry {
  name: 'jerry';
  events: {
    idea(title: string, craziness: number): void;
  };
}

function validateContext({ pluginName }: PluginContext<Larry>) {
  expect(pluginName).toBe('larry');
}

afterEach(resetPlugins);

it('calls event handler of other plugin', () => {
  createPlugin<Jerry>({ name: 'jerry' }).register();

  const { on, register } = createPlugin<Larry>({ name: 'larry' });
  const handleIdea = jest.fn();
  on<Jerry>('jerry', {
    idea: (context, title: string, craziness: number) => {
      validateContext(context);
      handleIdea(title, craziness);
    },
  });
  register();

  loadPlugins();
  const { emit } = getPluginContext<Jerry>('jerry');
  emit('idea', 'show about nothing', 50);

  expect(handleIdea).toHaveBeenCalledWith('show about nothing', 50);
});
