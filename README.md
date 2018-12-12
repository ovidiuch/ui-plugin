# ui-plugin

API for composable 3rd party UI plugins

## Goal

Enable a system of user interface plugins that meets the following criteria:

- Plugins are authered, compiled and deployed independently, by anyone under any repository.
- Plugins can also be authored locally, sharing modules and compilation with the host project.
- Plugins can be installed at run time. This includes download from an external repository like npm.
- Plugins can be enabled and disabled at run time, including newly installed ones. No restart of the host app required.
- Plugins can manage visual components, app state, or both.
- Plugins can emit events that other plugins can subscribe to.
- Plugins expose public methods that other plugins can call synchronously.
- Each plugin has read-write access to own its state, and read-only access other plugins' state.
- Plugins can define render slots that other plugins can plug into. More plugins can take up the same slot and can choose to compose or override each other.
- Render slots derive their inputs from plugin state (from one or more plugins) and update automatically whenever any of the relevant plugin state changes.
- Renders slots are free to manage their own private state that isn't accessible at plugin level.
- Plugin API is type-friendly.
- Plugins can share common libraries (eg. React) by configuring the host app to attach those libraries to the global namespace and configuring the plugin build to map related imports to the global namespace.

## Strategy

Use the global namespace to connect plugins from different script files. Expose declarative APIs for defining and registering plugins that abstracts the global namespace.

## Design

- Registered plugins are enabled by default. In the user land, this indirectly leads to using a _disabled_ plugin list to configure the enabled state of installed plugins (ie. a _deny_ list).
- Plugins are registered using multiple function calls. The first call takes in the metadata (name, default config and initial state). _Init_, _method_ and _event_ handlers are then registered using specific calls for each. This aids type safety and aesthetics. But it rasises one issue: When is a new plugin ready to be loaded? To reliably, automatically load a plugin at run-time upon registration, we expect all plugin registration to consist of sync function calls inside the same event loop iteration.
- Enabling a plugin at run-time will reload all plugins. Other plugins' _init_ handlers might perform actions that are relevant to the newly enabled plugin. This leads to a deterministic collective plugin outcome, regardless of when a plugin is enabled. But while plugin execution resets, previous state is preserved.
