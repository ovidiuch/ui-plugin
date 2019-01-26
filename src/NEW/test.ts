import { registerPlugin } from './registerPlugin';
import { getPluginContext } from './getPluginContext';

interface ILarryDavidPublic {
  methods: {
    getFullName(): string;
    getAge(realAge: boolean): number;
  };
  events: {
    idea: [string, number];
  };
}

interface ILarryDavid {
  name: 'larry';
  public: ILarryDavidPublic;
}

interface IJerrySeinfeldPublic {
  methods: {
    getBillions(): number;
    getEpisodes(): number;
  };
  events: {};
}

interface IJerrySeinfeld {
  name: 'jerry';
  public: IJerrySeinfeldPublic;
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

it('register', () => {
  // method('getFullName', ctx => 'Larry David');
  // method('getAge', (ctx, realAge) => (realAge ? 66 : 55));
  // TODO: Simulate how larry would emit idea event
});

it('plugin api', () => {
  const { getMethodsOf } = getPluginContext<IJerrySeinfeld>('jerry');
  const { getFullName, getAge } = getMethodsOf<ILarryDavidPublic>('larry');

  const fullName: string = getFullName();
  const age: number = getAge(true);
  expect(fullName).toBe('Larry David');
  expect(age).toBe(66);
});

// TODO: Emit
