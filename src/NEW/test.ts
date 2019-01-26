import { registerPlugin } from './registerPlugin';
import { getPluginContext } from './getPluginContext';
import { getEventsOf } from './getEventsOf';

interface ILarryDavid {
  name: 'larry';
  methods: {
    getFullName(): string;
    getAge(realAge: boolean): number;
  };
  events: {
    // Element names would be nice
    // https://github.com/Microsoft/TypeScript/issues/28259
    idea: [string, number];
  };
}

interface IJerrySeinfeld {
  name: 'jerry';
  methods: {
    getBillions(): number;
    getEpisodes(): number;
  };
  events: {};
}

registerPlugin<ILarryDavid>({
  name: 'larry',
  methods: {
    getFullName() {
      return 'Larry David';
    },
    getAge() {
      return 66;
    },
  },
});

registerPlugin<IJerrySeinfeld>({
  name: 'jerry',
  methods: {
    getBillions() {
      return 1;
    },
    getEpisodes() {
      return 154;
    },
  },
});

it('methods', () => {
  const { getMethodsOf } = getPluginContext<IJerrySeinfeld>('jerry');
  const { getFullName, getAge } = getMethodsOf<ILarryDavid>('larry');

  const fullName: string = getFullName();
  const age: number = getAge(true);
  expect(fullName).toBe('Larry David');
  expect(age).toBe(66);
});

it('emit event', () => {
  const { emit } = getPluginContext<ILarryDavid>('larry');
  emit('idea', 'showAboutNothing', 100);
});

it('on event', () => {
  // TODO: Bind getEventsOf to plugin context
  const onLarry = getEventsOf<ILarryDavid>('larry');
  onLarry('idea', (ideaName: string, ideaCraziness: number) => {
    console.log({ ideaName, ideaCraziness });
  });
});
