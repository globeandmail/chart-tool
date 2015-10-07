# Chart Tool

NOTE: This project is still in alpha, and not yet ready to be deployed at large. Until it's ready, you might experience some bugs.

Chart Tool is a D3.js-based tool for creating beautiful, embeddable charts. It's made up of two parts: a front-end for loading and visualizing charts, built using Gulp, and a back-end for creating data, storing it in a database and generating the embed code and exported charts, powered by Meteor and automated by Gulp. Chart Tool's goals are as follows:

* **Responsive:** Charts should work on mobile and tablet devices, UIWebViews (ugh), and have fallbacks for NoScript or non-SVG-capable browsers (like IE8).
* **&ldquo;Chart in a minute&rdquo;:** once you have your data, it shouldn't take you more than 60 seconds to generate a usable chart.
* **Forgiving with data:** Chart Tool doesn't care what kind of data you give it. TSV, CSV, weird formatting, whatever.
* **Fast:** Chart Tool's only dependency on the front-end is D3.js.
* **Exportable:** Chart Tool can generate PNGs along with its standard embed code, and PDFs for print using [wkhtmltopdf](http://www.wkhtmltopdf.org).

Chart Tool uses MongoDB paired with Meteor as a database for storing chart data. Generated charts are entirely static data-wise, relying only on D3.js, the custom Chart Tool library a chart loading function to be rendered, meaning the Mongo database is entirely archival.

## Chart Tool library

### API


### Generating documentation



## Chart Tool interface

### Backend routes

On the Meteor-side of things, Chart Tool uses [Iron Router](https://github.com/iron-meteor/iron-router/blob/devel/Guide.md). There are several routes you can access:

* `/new`: make a new chart (also the default route)
* `/list`: list and search through all generated charts
* `/chart/_id`: preview an individual chart, a handy link for sharing with colleagues
* `/chart/edit/_id`: edit or export a chart based on its Mongo ID
* `/chart/pdf/_id`: preview what an exported PDF will look like (warning: it'll be tiny due to fonts being sized for print)

### API

API for charts. This is a work in progress. Only one endpoint for now:

* `/api/get/_id`: get the full database entry for a chart based on its Mongo ID

## Getting started

Curious to try out Chart Tool, but don't want to go through the process of setting it up? Try out our [hosted demo version](http://charttool.colo.theglobeandmail.com) [COMING SOON].

If you'd like to set up your own hosted, customized Chart Tool, read on.

### Setting up your own Chart Tool

First, you'll need Node.js >=0.10.36 installed. This is important: anything lower and Meteor will fail in spectacular and unexpected ways. This project prefers a default of Node 0.10.38, as per the `.nvmrc` file, which you can use by [installing nvm](https://github.com/brianloveswords/nvm). Next, you'll need Meteor:

```sh
$ curl https://install.meteor.com | /bin/sh
```

You'll also need Gulp.

```sh
$ npm install -g gulp
```

Then, clone the Chart Tool repo, install your NPM dependencies, which will make sure Gulp is set up and can run your project:

```sh
$ git clone [git-repo-url] && cd chart-tool
$ npm install
```

(Depending on your setup, you might have to run some of these commands as `sudo`.)

After that, you'll need to do `cd meteor && meteor` to get Meteor running for the first time, which installs all the dependencies it'll need (this might take a minute). After that, you're in business. Stop the Meteor server (CTRL-C on a Mac), `cd` back to the parent directory and pick one of the Gulp commands below.

### Gulp commands

You have several Gulp commands at your disposal:

* `gulp`: Default command, will start up both a Gulp.js and a Meteor.js server for development. Equivalent to running `gulp lib-serve && gulp meteor-serve`.
* `gulp meteor-serve`: Will start up a local Meteor.js instance of the interface at localhost:3000 and watch for file changes.
* `gulp lib-serve`: Will start up a local Gulp.js instance of the frontend at localhost:3030 and watch for file changes.
* `gulp meteor-build`: Will build the backend into a tarball, ready for deployment to a server.
* `gulp lib-build`: Will build the static assets for the front-end loader.
* `gulp set-version`: Propagates the current version in `package.json` to all files that require a version string. Automatically run for all other gulp tasks.
* `gulp documentation`: Uses JSDoc to build documentation on the Chart Tool library to the `./documentation/` folder.
* `gulp buildver`: Returns the buildVer variable present in `package.json`. Optionally, can accept a `set` argument which edits the buildVer value. For instance, `gulp buildver --set=12` will set the buildVer in package.json to "12".

### Version
1.1.0

### Documentation

Chart Tool is still under active development, so better, more comprehensive documentation is forthcoming. If you've got any questions in the meantime, feel free to send us an email:

[Tom Cardoso](mailto:tcardoso@globeandmail.com)
[Jeremy Agius](mailto:jagius@globeandmail.com)
[Michael Pereira](mailto:mpereira@globeandmail.com)
[Matt Frehner](mailto:mfrehner@globeandmail.com)

### License note

While the main codebase is available under the MIT license, one element is not: the fonts used for this project. Fonts residing under `/src/styles/settings/_fonts.scss` and `/meteor/client/stylesheets/partials/base/_fonts.scss` are copyright of The Globe and Mail. These will be removed for the first release of the Chart Tool. Please do not copy them.