import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';

interface ILarry {
  name: 'larry';
  methods: {};
  events: {};
}

interface IJerry {
  name: 'jerry';
  methods: {};
  events: {
    idea(title: string, craziness: number): void;
  };
}

it('calls event handler of other plugin', () => {
  const handleIdea = jest.fn();

  const lar = createPlugin<ILarry>({
    name: 'larry',
    methods: {},
  });
  lar.register();

  createPlugin<IJerry>({
    name: 'jerry',
    methods: {},
  }).register();

  lar.on<IJerry>('jerry', {
    idea: (context, title: string, craziness: number) => {
      // Ensure correct context is passed into event handler
      const ctxPluginName: 'larry' = context.pluginName;
      expect(ctxPluginName).toBe('larry');

      handleIdea(title, craziness);
    },
  });

  const { emit } = getPluginContext<IJerry>('jerry');
  emit('idea', 'show about nothing', 50);

  expect(handleIdea).toHaveBeenCalledWith('show about nothing', 50);
});
