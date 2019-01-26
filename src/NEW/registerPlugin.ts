import { IPluginSpec, IPluginDef } from './IPluginSpec';
import { addPluginDef } from './pluginStore';

export function registerPlugin<PluginSpec extends IPluginSpec>(
  pluginDef: IPluginDef,
) {
  addPluginDef(pluginDef);
  // type PluginPublicApi = PluginDef['public'];
  // type Methods = PluginPublicApi['methods'];
  // return { method };
  // function method<MethodName extends keyof Methods>(
  //   methodName: MethodName,
  //   handler: (
  //     context: {},
  //     ...args: Parameters<Methods[MethodName]>
  //   ) => ReturnType<Methods[MethodName]>,
  // ) {
  //   // console.log('called method', methodName);
  // }
}
