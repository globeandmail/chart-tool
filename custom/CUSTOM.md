# Customizing your Chart Tool

This folder contains a series of files that allow you to customize your Chart Tool as you find appropriate. Chart Tool requires a few core files to always live in this folder, or bad things will happen:

* `chart-tool-config.json`: An absolutely essential file for generating new charts. Chart Tool uses this config file to scaffold a basic chart object. Includes instructions for the Chart Tool on how to abbreviate months, debounce and tooltip timeouts, desktop and mobile ratios, style prefixes, and so on.
* `custom.js`: A function that is optionally invoked for each chart after all a chart's elements are rendered. Useful to perform blanket tweaks to a chart's structure as mandated by a style guide — for instance, if your style requires axis labels, you can easily add them via `custom.js` by invoking the axis nodes and dimensions and generating new SVG `text` objects. Off by default. If you'd like to enable the use of `custom.js`, make sure to change the `CUSTOM` declaration in `chart-tool-config.json` to `true`.
* `base.scss`: This base file can contain overrides for fonts, sizes, and other SASS variables Chart Tool needs to build a fresh copy of its style library. If you don't want to override any base SASS variables, just comment this file out.
* `custom.scss`: Similar to `base.scss`, except this file sits at the bottom of Chart Tool's style imports file, meaning any styles in this file will override any other styles previously set in the library. Like with `base.scss`, if you don't want to add custom styles, just leave the file blank or commented out.

### A note on class prefixes

Chart Tool charts are aggressively namespaced. If you want to override chart class prefixes (for instance, changing all chart classes from `ct-[chart-element-here]` to 'globe-[chart-element-here]'), you'll need to make that change in two places: `chart-tool-config.json`'s `prefix` property, and `base.scss`'s `$prefix` SASS variable.