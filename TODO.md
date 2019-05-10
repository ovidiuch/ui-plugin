- [ ] createPluginStore (and avoid globals)

---

- [x] No longer return unmount cb in `mountPlugins`
- [x] Expose global getPluginContext method under top level API
- [x] Add enabled plugin state
- [x] Re-mount plugins when adding plugin (if mounted)
- [x] Improve naming (s/mountPlugins/loadPlugins)
- [x] reloadPlugins
- [x] Export global add/remove state change handlers
- [x] Add loadPlugins callback
- [x] Publish Flow types
- [x] Export IPlugin flow type
- [x] Create global onPluginChange event
- [ ] ~~Replace `name` with `key` (overridable) and `id` with `name` (unique)~~
- [ ] ~~Add logging~~
