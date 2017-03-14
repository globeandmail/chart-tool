# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.3] - 2017-03-14
### Changed
- Social [export styling tweaks](https://github.com/thebuffalonews/chart-tool/commit/d18eb7271fa2396feabd1c38aad3e36e35fcd2d9)
- Utilized qualifier as subhead
- Add Slack webhook notification for new chart
- Add Slack login system

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
