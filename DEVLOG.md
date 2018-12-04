Q: Should plugins names be camelCase or kebab-case?

> Note: Both work, but one style should be promoted in examples and tests for consistency.

Relevant: Plugin packages will be kebab-case, because they will be published to npm and will therefore be case insensitive.

Should plugin names mirror their package name, or is it acceptable for the case to differ? Ie. For a plugin published as `reponsive-preview` to have a plugin name `responsivePreview`.

Going with camel case. I think it makes more sense for plugin names to resemble function names than file names. Calling methods looks better this way. Eg. `callMethod('testPlugin.testMethod')` vs `callMethod('test-plugin.testMethod')`.
