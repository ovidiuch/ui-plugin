export interface IPluginSpec {
  name: string;
  // config: {};
  // state: any;
  public: IPluginPublicSpec;
}

export interface IPluginDef {
  name: string;
  methods: IPluginMethods;
}

export interface IPluginPublicSpec {
  methods: IPluginMethods;
  events: IPluginEvents;
}

export interface IPluginMethods {
  [methodName: string]: BaseFn;
}

export interface IPluginEvents {
  [eventName: string]: any[];
}

type BaseFn = (...args: any[]) => any;
