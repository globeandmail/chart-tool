# Customizing your Chart Tool

The `/custom` folder contains a series of files that allow you to customize your Chart Tool as you find appropriate.


----------


## `chart-tool-config.json`

An absolutely essential file for generating new charts. Chart Tool uses this configuration file to scaffold a basic chart object, set parameters throughout the library, and so on. Includes instructions for the Chart Tool on how to abbreviate months, debounce and tooltip timeouts, desktop and mobile ratios, style prefixes, and so on.


## `meteor-config.js`



## `custom.js`

A function that is optionally invoked for each chart after all a chart's elements are rendered. Useful to perform blanket tweaks to a chart's structure as mandated by a style guide — for instance, if your style requires axis labels, you can easily add them via `custom.js` by invoking the axis nodes and dimensions and generating new SVG `text` objects. Off by default. If you'd like to enable the use of `custom.js`, make sure to change the `CUSTOM` declaration in `chart-tool-config.json` to `true`.


## `fonts.scss`

Got some custom fonts you want to point to in your `base.scss` file? Put your `@font-face` declarations here.


## `base.scss`

This base file can contain overrides for fonts, sizes, and other SCSS variables Chart Tool needs to build a fresh copy of its style library. If you don't want to override any base SCSS variables, just comment this file out.


## `custom.scss`
Similar to `base.scss`, except this file sits at the bottom of Chart Tool's style imports file, meaning any styles in this file will override any other styles previously set in the library. Like with `base.scss`, if you don't want to add custom styles, just leave the file blank or commented out.

## `meteor-custom.scss`


----------


#### Deleting files in the `/custom` folder

Chart Tool expects to be able to see these custom files in the `/custom` folder, even if they're empty. Don't remove them! Bad things could happen if you do.

#### A note on class prefixes

Chart Tool charts are **aggressively** namespaced to prevent CSS collisions when rendering on news websites. If you want to override chart class prefixes (for instance, changing all chart classes from `ct-[chart-element-here]` to `globe-[chart-element-here]`), you'll need to make that change in two places: `chart-tool-config.json`'s `prefix` property, and `base.scss`'s `$prefix` SCSS variable.
