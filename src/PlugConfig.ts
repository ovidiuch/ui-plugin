import * as React from 'react';
import { IPluginContext } from './PluginContext';

interface IGetPropsArgs<State> {
  pluginContext: IPluginContext<State>;
  slotProps: any;
}

export interface IPlugConfig<State, PlugProps> {
  readonly slotName: string;
  readonly type: React.ComponentType<PlugProps>;
  readonly getProps: (args: IGetPropsArgs<State>) => PlugProps;
}
