# Gulp commands

Chart Tool has several Gulp commands you can use:

* **`gulp`**: Default command, will build JS and CSS files, watch for changes, and start up both BrowserSync and Meteor.js servers for development. Equivalent to running **`gulp lib-serve && gulp meteor-serve`**
* **`gulp meteor-serve`**: Starts up a local Meteor instance of the interface at [localhost:3000](http://localhost:3000) and watches for file changes
* **`gulp lib-serve`**: Starts up a local BrowserSync instance of the frontend at [localhost:3030](http://localhost:3030) and watches for file changes
* **`gulp meteor-build`**: Builds the back end into a tarball in the `/dist/` folder, ready for deployment to a server
* **`gulp lib-build`**: Build the static assets for the front-end library into the `/dist` folder
* **`gulp buildver`: ** Returns the buildVer variable present in package.json. Optionally, accepts a `set` argument which edits the buildVer value. For instance, **`gulp buildver --set=12`** will set the buildVer in package.json to "12". Used for tracking build versions during the deployment process

There are also a few gulp tasks used by _other_ gulp tasks. They are:

* `gulp _browsersync`: Starts up a BrowserSync server
* `gulp _browserSyncWatch`: Watches for file changes and reloads BrowserSync when a change is detected
* `gulp _scss`: Processes SCSS files for the library
* `gulp _scss-build`: Builds minified CSS files from the SCSS source
* `gulp _webpack-build-dev`: Processes JS files for the library
* `gulp _webpack-build`: Builds and minifies JS files for the library
* `gulp _meteor-dev`: Runs a development Meteor environment
* `gulp _set-version`: Propagates the current version in `package.json` to all files that require a version string. Automatically run for all other gulp tasks
* `gulp _clean-lib`: Removes everything from the `dist` folder specific to the project version
* `gulp _clean-meteor`:* Removes all built Meteor tarballs from `dist/meteor`
* `gulp _watch`: Watches for file changes and triggers `gulp _webpack-build-dev` and `gulp _scss` when a change is detected
