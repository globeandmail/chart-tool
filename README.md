# Chart Tool

Chart Tool is a platform for creating, storing and displaying beautiful, responsive embeddable charts. Designed to fit the needs of a fast-paced mobile and print newsroom, Chart Tool generates charts in several formats:

* **SVGs** that are both responsive and interactive, via an embed code
* **JPGs and PNGs** for use as thumbnails and sharing on social media
* **PDFs** that can be almost immediately dropped into a print content management system   


![Chart Tool interface GIF](http://i.imgur.com/yKVKVPD.gif)


----------
## Contents

* [How it works](#how-it-works)
* [Features](#features)
* [Examples and demo](#examples-and-demo)
* [Getting started](#getting-started)
* [Tutorials](#tutorials)
* [Version](#version)
* [License](#license)
* [Get in touch](#get-in-touch)

----------


## How it works

Chart Tool is made up of two parts:

**A back end interface** for storing data, creating and exporting charts, and generating a static embed code, powered by [Meteor](https://www.meteor.com/). Embed codes are static by design — if your back end goes down, all the charts on your site will still display properly. [Try out a demo of the charts interface](https://chart-tool-demo.herokuapp.com/).


**A front-end JavaScript and CSS library** that parses embed codes generated by the back end and renders a responsive chart on your website using parts of [D3.js](http://d3js.org). The front-end library also offers [an API](https://github.com/globeandmail/chart-tool/blob/master/tutorials/api.md) that can be accessed to modify charts before or after they've been drawn. [Check out some example charts on our website](http://globeandmail.github.io/chart-tool).


## Features

* **Searchable database:** All charts are stored in a searchable, taggable database for easy retrieval
* **Simple, straightforward GUI:** Easy-to-use (and easy-to-teach!) collaborative interface for editing charts, so multiple people can work on the same chart at once
* **Asset generation:** Easily generate PNGs at any size for use on social media, or PDFs for print use
* **Fallback images:** All charts come with a fallback image in case the library is unable to draw the chart. Fallbacks can be stored on AWS, or bundled as inline Base64 images
* **Fully responsive:** Charts will redraw automatically on window resize after a small period of time
* **Lots of chart types:**
  * Line charts
  * Area charts
  * Stacked area charts
  * Column charts
  * Stacked column charts
  * Bar charts
  * Stacked bar charts
  * Multiline charts
  * No pies [(sorry)](http://www.storytellingwithdata.com/blog/2011/07/death-to-pie-charts)
* **Highly configurable:** Don't want tips to appear for a specific chart, or want to manually set the number of ticks to be displayed? No problem!
* **"Ordinal-time" scales:** Treat time series data as if it were ordinal — this is very useful for visualizing stock price charts, or when you want to skip weekends and holidays
* **Pre- and post-render hooks:** All charts come with several basic custom events via D3's [dispatch library](https://github.com/d3/d3-dispatch), including pre- and post-render hooks for every chart
* **Zero external dependencies:** The Chart Tool library comes bundled with everything it'll need right out of the box
* **Lightweight libraries:** The front-end CSS and JS libraries clock in at a combined **45.536kB** minified and gzipped


## Examples and demo

Examples of the types of charts Chart Tool can generate can be found [here](http://globeandmail.github.io/chart-tool).

For a demo of the back end interface used to generate charts, images and PDFs, check out our [demo app](https://chart-tool-demo.herokuapp.com/).


## Getting started

*Curious to try out Chart Tool, but don't want to go through the process of setting it up? Try out our [hosted demo version](https://chart-tool-demo.herokuapp.com/).*

First, you'll need [Node.js](https://nodejs.org) >= 7.1.0 installed. We recommend using [nvm](https://github.com/creationix/nvm) to keep your Node version in sync with what Chart Tool expects. This is important: anything lower and Meteor will fail in spectacular and unexpected ways.

Next, you'll need to [install Meteor](https://www.meteor.com/install).

You'll also need [Gulp](http://gulpjs.com/).

```sh
$ npm install -g gulp
```

Then, clone the Chart Tool repo and install your NPM dependencies, which will make sure Gulp is set up and can run your project:

```sh
$ git clone [git-repo-url] && cd chart-tool
$ npm install
```

After that, you'll need to do `cd meteor && meteor` to get Meteor running for the first time, which provisions the Mongo database and installs all the dependencies it'll need (this might take a minute). Once that's done, you're in business. Stop the Meteor server (`CTRL-C` on a Mac) and `cd` back to the parent directory.

Then, all you need to do is:

```sh
$ gulp
```

That's it! You're running your own development copy of Chart Tool!  :tada: :tada: :tada:


## Tutorials

Now that you've got Chart Tool up and running, here are some tips on how to get rolling.

For starters, you might want to read up on how to make your first chart. A full tutorial, including how to embed it on the web or generate a static image at multiple sizes is [available here](https://github.com/globeandmail/chart-tool/blob/master/tutorials/first-chart.md).

Otherwise, these are some other tutorials you might want to check out:

* [Customize your Chart Tool with fonts, colours, etc.](https://github.com/globeandmail/chart-tool/blob/master/tutorials/customizing.md)
* [Hook up your Chart Tool to AWS for automatic fallback image generation](https://github.com/globeandmail/chart-tool/blob/master/tutorials/thumbnails.md)
* [Set up print PDF export](https://github.com/globeandmail/chart-tool/blob/master/tutorials/print.md)
* [Deploy Chart Tool to your own server](https://github.com/globeandmail/chart-tool/blob/master/tutorials/deploying.md)
* [Check out other available gulp commands](https://github.com/globeandmail/chart-tool/blob/master/tutorials/gulp.md)
* [Read up on the front-end API](https://github.com/globeandmail/chart-tool/blob/master/tutorials/api.md)
* [Learn more about the interface](https://github.com/globeandmail/chart-tool/blob/master/tutorials/interface.md)


## Version

1.2.2


## License

Chart Tool © 2017 The Globe and Mail. It is free software, and may be redistributed under the terms specified in our [MIT license](https://github.com/globeandmail/chart-tool/blob/master/LICENSE.md).


## Get in touch

If you've got any questions, feel free to send us an email, or give us a shout on Twitter:

[![Tom Cardoso](https://avatars0.githubusercontent.com/u/2408118?v=3&s=200)](https://github.com/tomcardoso) | [![Jeremy Agius](https://pbs.twimg.com/profile_images/1817572938/jagius_200x200.jpeg)](https://github.com/jagius) | [![Michael Pereira](https://avatars0.githubusercontent.com/u/212666?v=3&s=200)](https://github.com/monkeycycle) | [![Matt Frehner](https://avatars0.githubusercontent.com/u/768618?v=3&s=200)](https://github.com/mattfrehner)
---|---|---|---
[Tom Cardoso](mailto:tcardoso@globeandmail.com) <br> [@tom_cardoso](https://www.twitter.com/tom_cardoso) | [Jeremy Agius](mailto:jagius@globeandmail.com) <br> [@j_agius](https://www.twitter.com/j_agius) | [Michael Pereira](mailto:mpereira@globeandmail.com) <br> [@monkeycycle_org](https://www.twitter.com/monkeycycle_org) | [Matt Frehner](mailto:mfrehner@globeandmail.com) <br> [@mattfrehner](https://www.twitter.com/mattfrehner)
