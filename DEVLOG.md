Q: When installing a plugin at run-time, how do we know when the plugin is ready to load?

Problem: The `registerPlugin` call will be followed by a few other calls, like `init`, `method` and `event`, all declaring bits of the plugin, bits that the plugin cannot be activated without.

(Pragmatic) answer: Anytime starting with next _loop_ iteration. This implies that all plugin parts are called synchronously right after the registerPlugin call.

Decide: Do we automatically reload plugins after registering a plugin at run-time? Or do we expect users to manually call `reloadPlugins` after plugin registration?

Well we already know when it's safe to reload plugins to include the newly registered one: In the next event loop iteration. So we might as well reload plugins using _setTimeout_ with 0 delay after a registerPlugin call. Going with the automatic approach.

---

Q: Should event names be bound to plugins or not?

Event names should be bound to plugins to keep event management clear and concise. But it's a bit counterintuitive which plugin they bind to. Methods bind to the plugin they are registered in. Events bind to the plugin that emits them. So event handlers contain the full `pluginName.eventName` path, while emit calls only contain the event name.

---

Q: Should plugins names be camelCase or kebab-case?

> Note: Both work, but one style should be promoted in examples and tests for consistency.

Relevant: Plugin packages will be kebab-case, because they will be published to npm and will therefore be case insensitive.

Should plugin names mirror their package name, or is it acceptable for the case to differ? Ie. For a plugin published as `reponsive-preview` to have a plugin name `responsivePreview`.

Going with camel case. I think it makes more sense for plugin names to resemble function names than file names. Calling methods looks better this way. Eg. `callMethod('testPlugin.testMethod')` vs `callMethod('test-plugin.testMethod')`.
