import { IPluginSpec, IPluginPublicSpec } from './IPluginSpec';
import { getPluginDef } from './pluginStore';

export function getPluginContext<PluginSpec extends IPluginSpec>(
  pluginName: string,
) {
  return {
    getMethodsOf<OtherPluginPublicSpec extends IPluginPublicSpec>(
      otherPluginName: string,
    ): OtherPluginPublicSpec['methods'] {
      return getPluginDef(otherPluginName).methods;
    },
  };
}
