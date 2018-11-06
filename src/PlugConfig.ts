import * as React from 'react';
import { IPluginContext } from './PluginContext';

interface IGetPropsArgs<PluginState> {
  pluginContext: IPluginContext<PluginState>;
  slotProps: any;
}

export interface IPlugConfig<PluginState, PlugProps> {
  readonly slotName: string;
  readonly type: React.ComponentType<PlugProps>;
  readonly getProps: (args: IGetPropsArgs<PluginState>) => PlugProps;
}
