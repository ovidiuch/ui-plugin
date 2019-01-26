import { registerPlugin, getPluginRegisterApi } from './registerPlugin';
import { getPluginContext } from './getPluginContext';

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
  const { getEventsOf } = getPluginRegisterApi<IJerrySeinfeld>('jerry');
  const onLarry = getEventsOf<ILarryDavid>('larry');
  onLarry('idea', (ideaName: string, ideaCraziness: number) => {
    // TODO: Add Jerry's context as first arg in this callback
    console.log({ ideaName, ideaCraziness });
  });
});
