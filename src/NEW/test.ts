type BaseFn = (...args: any[]) => any;

interface IBasePluginApi {
  methods: {
    [methodName: string]: BaseFn;
  };
}

function registerPlugin<PluginApi extends IBasePluginApi>() {
  type Methods = PluginApi['methods'];

  return { method };

  function method<MethodName extends keyof Methods>(
    methodName: MethodName,
    handler: (
      context: {},
      ...args: Parameters<Methods[MethodName]>
    ) => ReturnType<Methods[MethodName]>,
  ) {
    // console.log('called method', methodName);
  }
}

interface IPersonApi {
  methods: {
    getFullName(): string;
    getAge(realAge: boolean): number;
  };
}

interface IPluginContext {
  getPluginApi<PluginApi extends IBasePluginApi>(
    pluginName: 'string',
  ): PluginApi;
}

const context = {
  getPluginApi<PluginApi extends IBasePluginApi>(pluginName: string) {
    type Methods = PluginApi['methods'];

    const methods: Methods = {
      getFullName() {
        return 'Larry David';
      },
      getAge() {
        return 3;
      },
    };

    return methods;
  },
};

it('register', () => {
  const { method } = registerPlugin<IPersonApi>();

  method('getFullName', ctx => 'Larry David');
  method('getAge', (ctx, realAge) => (realAge ? 66 : 55));
});

it('call public api', () => {
  // TODO: Emit
  const { getPluginApi } = context;
  const { getFullName, getAge } = getPluginApi<IPersonApi>('person');

  getFullName();
  getAge(true);

  // TODO: Add context as first arg
  // method('getFullName', () => 'Larry David');
  // method('getAge', () => 55);
  // on('idea', (idea: string) => console.log('my idea', idea));
});
