export interface IPluginSpec {
  name: string;
  // config: {};
  // state: any;
  methods: IPluginMethods;
  events: IPluginEvents;
}

export interface IPluginDef {
  name: string;
  methods: IPluginMethods;
}

export interface IPluginMethods {
  [methodName: string]: BaseFn;
}

export interface IPluginEvents {
  [eventName: string]: any[];
}

type BaseFn = (...args: any[]) => any;
