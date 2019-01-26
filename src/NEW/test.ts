import { registerPlugin } from './registerPlugin';
import { getPluginContext } from './getPluginContext';

interface ILarryDavid {
  name: 'larry';
  methods: {
    getFullName(): string;
    getAge(realAge: boolean): number;
  };
  events: {
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

it('events', () => {
  // const { getMethodsOf } = getPluginContext<ILarryDavid>('larry');
});
