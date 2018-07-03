# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.3.0] - 2018-04-11
### Changed
- Updates Meteor to version 1.6
- Replaces outdated Meteor packages from the Atmosphere package management system with `npm` packages
- [Rips out](https://github.com/globeandmail/chart-tool/issues/118) Meteor's Blaze templating system in favour of React, which will make the interface more extensible going forward
- Charts now redraw only when presentational elements (i.e. data, headings, chart type) change, making for a faster interface
- For PDF generation, `wkhtmltopdf` has been replaced with `puppeteer`, a headless browser from the Chrome team
- PNG generation is now handled asynchronously server-side via `puppeteer`. This means PNGs will be a bit slower to generate, but should lead to more consistent PNGs regardless of your browser or environment.
- Thumbnails are also generated server-side, and done asynchronously, meaning that a large base64 string for a processed thumbnail won't lock up the interface while it gets sent to the database
- Some [fixes](https://github.com/globeandmail/chart-tool/issues/167) for certain tooltip edge cases
- Rearchitects the PNG export overlay to include more options and a preview

### Added
- `document.title` for pages now [includes the chart slug](https://github.com/globeandmail/chart-tool/issues/163) when applicable
- Adds [sorting options](https://github.com/globeandmail/chart-tool/issues/107) to the archive page
- When creating a new chart, we now do some [checking of the data](https://github.com/globeandmail/chart-tool/issues/59) for prefixes (such as "$") and suffixes ("%"), and set prefixes and suffixes for the chart accordingly, which should save a few seconds on certain chart types
- Adds [basic highlighting](https://github.com/globeandmail/chart-tool/issues/77) annotations for bar and column charts

## [1.2.0] - 2016-12-08
### Changed
- Rewrites main library to [use ES6](https://github.com/globeandmail/chart-tool/issues/89)
- Updates [D3 to v4](https://github.com/globeandmail/chart-tool/milestone/4)
- Replaced Webpack with Rollup for more efficient module bundling
- [Rewritten tooltips](https://github.com/globeandmail/chart-tool/issues/91) for column and stacked column chart types
- Bar chart code has been rewritten to [do away with a visual x-axis](https://github.com/globeandmail/chart-tool/issues/43)

### Added
- Adds JS and CSS libs [directly to embed code](https://github.com/globeandmail/chart-tool/issues/76)
- [Stacked bar chart type!](https://github.com/globeandmail/chart-tool/issues/42)
- Tooltip styles for bar and stacked bar charts

## [1.1.1] - 2016-08-31
### Changed
- Fixes `dataparse.js` bug where [heading keys were being sorted](https://github.com/globeandmail/chart-tool/issues/50)
- Fixes a bug where index values in interface [weren't being cleared](https://github.com/globeandmail/chart-tool/issues/61)

### Added
- Started using a Changelog! 🎉
- Interface data parser now recognizes [data wrapped in quote marks](https://github.com/globeandmail/chart-tool/issues/41)
