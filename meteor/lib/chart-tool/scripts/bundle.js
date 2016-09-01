/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Chart Tool
	 * @author Jeremy Agius <jagius@globeandmail.com>
	 * @author Tom Cardoso <tcardoso@globeandmail.com>
	 * @author Michael Pereira <mpereira@globeandmail.com>
	 * @see {@link} for further information.
	 * @see {@link http://www.github.com/globeandmail/chart-tool|Chart Tool}
	 * @license MIT
	 */
	
	(function ChartToolInit(root) {
	
	  if (root.d3) {
	
	    var ChartTool = (function ChartTool() {
	
	      var charts = root.__charttool || [],
	          dispatchFunctions = root.__charttooldispatcher || [],
	          drawn = [];
	
	      var settings = __webpack_require__(1),
	          utils = __webpack_require__(4);
	
	      var dispatcher = d3.dispatch("start", "finish", "redraw", "mouseOver", "mouseMove", "mouseOut", "click");
	
	      for (var prop in dispatchFunctions) {
	        if (dispatchFunctions.hasOwnProperty(prop)) {
	          if (d3.keys(dispatcher).indexOf(prop) > -1) {
	            dispatcher.on(prop, dispatchFunctions[prop]);
	          } else {
	            throw "Chart Tool does not offer a dispatcher of type '" + prop + "'. For available dispatcher types, please see the ChartTool.dispatch() method." ;
	          }
	        }
	      }
	
	      /**
	       * Clears previous iterations of chart objects stored in obj or the drawn array, then punts chart construction to the Chart Manager.
	       * @param  {String} container A string representing the container's selector.
	       * @param  {Object} obj       The chart ID and embed data.
	       */
	      function createChart(container, obj) {
	
	        dispatcher.start(obj);
	
	        drawn = utils.clearDrawn(drawn, obj);
	        obj = utils.clearObj(obj);
	        container = utils.clearChart(container);
	
	        var ChartManager = __webpack_require__(9);
	
	        obj.data.width = utils.getBounding(container, "width");
	        obj.dispatch = dispatcher;
	
	        var chartObj;
	
	        if (utils.svgTest(root)) {
	          chartObj = ChartManager(container, obj);
	        } else {
	          utils.generateThumb(container, obj, settings);
	        }
	
	        drawn.push({ id: obj.id, chartObj: chartObj });
	        obj.chartObj = chartObj;
	
	        d3.select(container)
	          .on("click", function() { dispatcher.click(this, chartObj); })
	          .on("mouseover", function() { dispatcher.mouseOver(this, chartObj); })
	          .on("mousemove", function() { dispatcher.mouseMove(this, chartObj);  })
	          .on("mouseout", function() { dispatcher.mouseOut(this, chartObj); });
	
	        dispatcher.finish(chartObj);
	
	      }
	
	      /**
	       * Grabs data on a chart based on an ID.
	       * @param {Array} charts Array of charts on the page.
	       * @param  {String} id The ID for the chart.
	       * @return {Object}    Returns stored embed object.
	       */
	      function readChart(id) {
	        for (var i = 0; i < charts.length; i++) {
	           if (charts[i].id === id) {
	            return charts[i];
	          }
	        };
	      }
	
	      /**
	       * List all the charts stored in the Chart Tool by chartid.
	       * @param {Array} charts Array of charts on the page.
	       * @return {Array}       List of chartid's.
	       */
	      function listCharts(charts) {
	        var chartsArr = [];
	        for (var i = 0; i < charts.length; i++) {
	          chartsArr.push(charts[i].id);
	        };
	        return chartsArr;
	      }
	
	      function updateChart(id, obj) {
	        var container = '.' + settings.baseClass() + '[data-chartid=' + settings.prefix + id + ']';
	        createChart(container, { id: id, data: obj });
	      }
	
	      function destroyChart(id) {
	        var container, obj;
	        for (var i = 0; i < charts.length; i++) {
	          if (charts[i].id === id) {
	            obj = charts[i];
	          }
	        };
	        container = '.' + settings.baseClass() + '[data-chartid=' + obj.id + ']';
	        utils.clearDrawn(drawn, obj);
	        utils.clearObj(obj);
	        utils.clearChart(container);
	      }
	
	      /**
	       * Iterate over all the charts, draw each chart into its respective container.
	       * @param {Array} charts Array of charts on the page.
	       */
	      function createLoop(charts) {
	        var chartList = listCharts(charts);
	        for (var i = 0; i < chartList.length; i++) {
	          var obj = readChart(chartList[i]);
	          var container = '.' + settings.baseClass() + '[data-chartid=' + chartList[i] + ']';
	          createChart(container, obj);
	        };
	      }
	
	      /**
	       * Chart Tool initializer which sets up debouncing and runs the createLoop(). Run only once, when the library is first loaded.
	       * @param {Array} charts Array of charts on the page.
	       */
	      function initializer(charts) {
	        createLoop(charts);
	        var debounce = utils.debounce(createLoop, charts, settings.debounce, root);
	        d3.select(root)
	          .on('resize.' + settings.prefix + 'debounce', debounce)
	          .on('resize.' + settings.prefix + 'redraw', dispatcher.redraw(charts));
	      }
	
	      return {
	
	        init: function init() {
	          return initializer(charts);
	        },
	
	        create: function create(container, obj) {
	          return createChart(container, obj);
	        },
	
	        read: function read(id) {
	          return readChart(id);
	        },
	
	        list: function list() {
	          return listCharts(charts);
	        },
	
	        update: function update(id, obj) {
	          return updateChart(id, obj);
	        },
	
	        destroy: function destroy(id) {
	          return destroyChart(id);
	        },
	
	        dispatch: function dispatch() {
	          return d3.keys(dispatcher);
	        },
	
	        wat: function wat() {
	          console.info("ChartTool v" + settings.version + " is a free, open-source chart generator and front-end library maintained by The Globe and Mail. For more information, check out our GitHub repo: www.github.com/globeandmail/chart-tool");
	        },
	
	        version: settings.version,
	        build: settings.build,
	        settings: __webpack_require__(1),
	        charts: __webpack_require__(9),
	        components: __webpack_require__(10),
	        helpers: __webpack_require__(8),
	        utils: __webpack_require__(4),
	        line: __webpack_require__(15),
	        area: __webpack_require__(20),
	        multiline: __webpack_require__(18),
	        stackedArea: __webpack_require__(21),
	        column: __webpack_require__(22),
	        stackedColumn: __webpack_require__(24),
	        streamgraph: __webpack_require__(25),
	        bar: __webpack_require__(23)
	
	      }
	
	    })();
	
	    if (!root.Meteor) { ChartTool.init(); }
	
	  } else {
	
	    var Meteor = this.Meteor || {},
	        isServer = Meteor.isServer || undefined;
	
	    if (!isServer) {
	      console.error("Chart Tool: no D3 library detected.");
	    }
	
	
	  }
	
	  root.ChartTool = ChartTool;
	
	})(typeof window !== "undefined" ? window : this);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var version = {
	  version: __webpack_require__(2).version,
	  build: __webpack_require__(2).buildver
	};
	
	var settings = __webpack_require__(3);
	
	module.exports = {
	
	  CUSTOM: settings.CUSTOM,
	  version: version.version,
	  build: version.build,
	  id: "",
	  data: "",
	  dateFormat: settings.dateFormat,
	  timeFormat: settings.timeFormat,
	  image: settings.image,
	  heading: "",
	  qualifier: "",
	  source: "",
	  deck: "",
	  index: "",
	  hasHours: false,
	  social: settings.social,
	  seriesHighlight: function() {
	    if (this.data.seriesAmount && this.data.seriesAmount <= 1) {
	      return 1;
	    } else {
	      return 0;
	    }
	  },
	  baseClass: function() { return this.prefix + "chart"; },
	  customClass: "",
	
	  options: {
	    type: "line",
	    interpolation: "linear",
	    stacked: false,
	    expanded: false,
	    head: true,
	    deck: false,
	    qualifier: true,
	    legend: true,
	    footer: true,
	    x_axis: true,
	    y_axis: true,
	    tips: false,
	    annotations: false,
	    range: false,
	    series: false,
	    share_data: true,
	    social: true
	  },
	
	  range: {},
	  series: {},
	  xAxis: settings.xAxis,
	  yAxis: settings.yAxis,
	
	  exportable: false, // this can be overwritten by the backend as needed
	  editable: false,
	
	  prefix: settings.prefix,
	  debounce: settings.debounce,
	  tipTimeout: settings.tipTimeout,
	  monthsAbr: settings.monthsAbr,
	
	  dimensions: {
	    width: 0,
	    computedWidth: function() {
	      return this.width - this.margin.left - this.margin.right;
	    },
	    height: function() {
	      var ratioScale = d3.scale.linear().range([300, 900]).domain([this.width * this.ratioMobile, this.width * this.ratioDesktop]);
	      return Math.round(ratioScale(this.width));
	    },
	    computedHeight: function() {
	      return (this.height() - this.headerHeight - this.footerHeight - this.margin.top - this.margin.bottom);
	    },
	    ratioMobile: settings.ratioMobile,
	    ratioDesktop: settings.ratioDesktop,
	    margin: settings.margin,
	    tipPadding: settings.tipPadding,
	    tipOffset: settings.tipOffset,
	    headerHeight: 0,
	    footerHeight: 0,
	    xAxisHeight: 0,
	    yAxisHeight: function() {
	      return (this.computedHeight() - this.xAxisHeight);
	    },
	    xAxisWidth: 0,
	    labelWidth: 0,
	    yAxisPaddingRight: settings.yAxis.paddingRight,
	    tickWidth: function() {
	      return (this.computedWidth() - (this.labelWidth + this.yAxisPaddingRight));
	    },
	    barHeight: settings.barHeight,
	    bands: {
	      padding: settings.bands.padding,
	      offset: settings.bands.offset,
	      outerPadding: settings.bands.outerPadding
	    }
	  }
	
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
		"name": "chart-tool",
		"version": "1.1.0",
		"buildVer": "0",
		"description": "A responsive charting application",
		"main": "gulpfile.js",
		"dependencies": {},
		"devDependencies": {
			"browser-sync": "^2.8.0",
			"gulp": "^3.8.11",
			"gulp-clean": "^0.3.1",
			"gulp-json-editor": "^2.2.1",
			"gulp-minify-css": "^1.2.0",
			"gulp-rename": "^1.2.2",
			"gulp-replace": "^0.5.3",
			"gulp-sass": "^2.0.4",
			"gulp-shell": "^0.4.2",
			"gulp-sourcemaps": "^1.5.2",
			"gulp-util": "^3.0.6",
			"jsdoc": "^3.3.2",
			"json-loader": "^0.5.3",
			"run-sequence": "^1.1.4",
			"webpack": "^1.12.14",
			"webpack-stream": "^3.1.0",
			"yargs": "^3.15.0"
		},
		"scripts": {
			"test": ""
		},
		"keywords": [
			"charts",
			"d3",
			"d3js",
			"meteor",
			"gulp",
			"webpack",
			"data visualization",
			"chart",
			"mongo"
		],
		"repository": {
			"type": "git",
			"url": "git@github.com:globeandmail/chart-tool.git"
		},
		"contributors": [
			{
				"author": "Tom Cardoso",
				"email": "tcardoso@globeandmail.com"
			},
			{
				"author": "Jeremy Agius",
				"email": "jagius@globeandmail.com"
			},
			{
				"author": "Michael Pereira",
				"email": "mpereira@globeandmail.com"
			}
		],
		"license": "MIT"
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
		"CUSTOM": false,
		"prefix": "ct-",
		"monthsAbr": [
			"Jan.",
			"Feb.",
			"Mar.",
			"Apr.",
			"May",
			"June",
			"July",
			"Aug.",
			"Sept.",
			"Oct.",
			"Nov.",
			"Dec.",
			"Jan."
		],
		"debounce": 500,
		"tipTimeout": 5000,
		"ratioMobile": 1.15,
		"ratioDesktop": 0.65,
		"dateFormat": "%Y-%m-%d",
		"timeFormat": "%H:%M",
		"margin": {
			"top": 10,
			"right": 3,
			"bottom": 0,
			"left": 0
		},
		"tipOffset": {
			"vertical": 4,
			"horizontal": 1
		},
		"tipPadding": {
			"top": 4,
			"right": 9,
			"bottom": 4,
			"left": 9
		},
		"yAxis": {
			"display": true,
			"scale": "linear",
			"ticks": "auto",
			"orient": "right",
			"format": "comma",
			"prefix": "",
			"suffix": "",
			"min": "",
			"max": "",
			"rescale": false,
			"nice": true,
			"paddingRight": 9,
			"tickLowerBound": 3,
			"tickUpperBound": 8,
			"tickGoal": 5,
			"widthThreshold": 420,
			"dy": "",
			"textX": 0,
			"textY": ""
		},
		"xAxis": {
			"display": true,
			"scale": "time",
			"ticks": "auto",
			"orient": "bottom",
			"format": "auto",
			"prefix": "",
			"suffix": "",
			"min": "",
			"max": "",
			"rescale": false,
			"nice": false,
			"rangePoints": 1,
			"tickTarget": 6,
			"ticksSmall": 4,
			"widthThreshold": 420,
			"dy": 0.7,
			"barOffset": 9,
			"upper": {
				"tickHeight": 7,
				"textX": 6,
				"textY": 7
			},
			"lower": {
				"tickHeight": 12,
				"textX": 6,
				"textY": 2
			}
		},
		"barHeight": 30,
		"bands": {
			"padding": 0.06,
			"offset": 0.12,
			"outerPadding": 0.03
		},
		"source": {
			"prefix": "CHART TOOL",
			"suffix": " » SOURCE:"
		},
		"social": {
			"facebook": {
				"label": "Facebook",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-facebook.svg",
				"redirect": "",
				"appID": ""
			},
			"twitter": {
				"label": "Twitter",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-twitter.svg",
				"via": "",
				"hashtag": ""
			},
			"email": {
				"label": "Email",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-mail.svg"
			},
			"sms": {
				"label": "SMS",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-telephone.svg"
			}
		},
		"image": {
			"enable": false,
			"base_path": "",
			"expiration": 30000,
			"filename": "thumbnail",
			"extension": "png",
			"thumbnailWidth": 460
		}
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Utilities module. Functions that aren't specific to any one module.
	 * @module utils/utils
	 */
	
	/**
	 * Given a function to perform, a timeout period, a parameter to pass to the performed function, and a reference to the window, fire a specific function.
	 * @param  {Function} fn      Function to perform on debounce.
	 * @param  {Object} obj      Object passed to Function which is performed on debounce.
	 * @param  {Integer}   timeout Timeout period in milliseconds.
	 * @param  {Object}   root    Window object.
	 * @return {Function}           Final debounce function.
	 */
	function debounce(fn, obj, timeout, root) {
	  var timeoutID = -1;
	  return function() {
	    if (timeoutID > -1) { root.clearTimeout(timeoutID); }
	    timeoutID = root.setTimeout(function(){
	      fn(obj)
	    }, timeout);
	  }
	};
	
	/**
	 * Remove chart SVG and divs inside a container from the DOM.
	 * @param  {String} container
	 */
	function clearChart(container) {
	
	  var cont = document.querySelector(container);
	
	  while (cont && cont.querySelectorAll("svg").length) {
	    var svg = cont.querySelectorAll("svg");
	    svg[svg.length - 1].parentNode.removeChild(svg[svg.length - 1]);
	  }
	
	  while (cont && cont.querySelectorAll("div").length) {
	    var div = cont.querySelectorAll("div");
	    div[div.length - 1].parentNode.removeChild(div[div.length - 1]);
	  }
	
	  return container;
	}
	
	/**
	 * Clears the chart data of its post-render chartObj object.
	 * @param  {Object} obj Object used to construct charts.
	 * @return {Object}     The new version of the object.
	 */
	function clearObj(obj) {
	  if (obj.chartObj) { obj.chartObj = undefined; }
	  return obj;
	}
	
	/**
	 * Clears the drawn array.
	 * @param  {Array} drawn
	 * @param  {Object} obj
	 * @return {Array}
	 */
	function clearDrawn(drawn, obj) {
	  if (drawn.length) {
	    for (var i = drawn.length - 1; i >= 0; i--) {
	      if (drawn[i].id === obj.id) {
	        drawn.splice(i, 1);
	      }
	    };
	  }
	
	  return drawn;
	}
	
	/**
	 * Get the boundingClientRect dimensions given a selector.
	 * @param  {String} container
	 * @return {Object}           The boundingClientRect object.
	 */
	function getBounding(selector, dimension) {
	  return document.querySelector(selector).getBoundingClientRect()[dimension];
	}
	
	/**
	 * Basic factory for figuring out amount of milliseconds in a given time period.
	 */
	function TimeObj() {
	  this.sec = 1000;
	  this.min = this.sec * 60;
	  this.hour = this.min * 60;
	  this.day = this.hour * 24;
	  this.week = this.day * 7;
	  this.month = this.day * 30;
	  this.year = this.day * 365;
	}
	
	/**
	 * Slightly altered Bostock magic to wrap SVG <text> nodes based on available width
	 * @param  {Object} text    D3 text selection.
	 * @param  {Integer} width
	 */
	function wrapText(text, width) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 1.0, // ems
	        x = 0,
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan")
	          .attr("x", x)
	          .attr("y", y)
	          .attr("dy", dy + "em");
	
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan")
	          .attr("x", x)
	          .attr("y", y)
	          .attr("dy", ++lineNumber * lineHeight + dy + "em")
	          .text(word);
	      }
	    }
	  });
	}
	
	/**
	 * Given two dates date and a tolerance level, return a time "context" for the difference between the two values.
	 * @param  {Object} d1     Beginning date object.
	 * @param  {Object} d2     End date object.
	 * @param  {Integer} tolerance
	 * @return {String}           The resulting time context.
	 */
	function timeDiff(d1, d2, tolerance) {
	
	  var diff = d2 - d1,
	      time = new TimeObj();
	
	  // returning the context
	  if ((diff / time.year) > tolerance) { return "years"; }
	  else if ((diff / time.month) > tolerance) { return "months"; }
	  else if ((diff / time.week) > tolerance) { return "weeks"; }
	  else if ((diff / time.day) > tolerance) { return "days"; }
	  else if ((diff / time.hour) > tolerance) { return "hours"; }
	  else if ((diff / time.min) > tolerance) { return "minutes"; }
	  else { return "days"; }
	  // if none of these work i feel bad for you son
	  // i've got 99 problems but an if/else ain"t one
	
	}
	
	/**
	 * Given a dataset, figure out what the time context is and
	 * what the number of time units elapsed is
	 * @param  {Array} data
	 * @return {Integer}
	 */
	function timeInterval(data) {
	
	  var dataLength = data.length,
	      d1 = data[0].key,
	      d2 = data[dataLength - 1].key;
	
	  var ret;
	
	  var intervals = [
	    { type: "years", step: 1 },
	    { type: "months", step: 3 }, // quarters
	    { type: "months", step: 1 },
	    { type: "days", step: 1 },
	    { type: "hours", step: 1 },
	    { type: "minutes", step: 1 }
	  ];
	
	  for (var i = 0; i < intervals.length; i++) {
	    var intervalCandidate = d3.time[intervals[i].type](d1, d2, intervals[i].step).length;
	    if (intervalCandidate >= dataLength - 1) {
	      var ret = intervalCandidate;
	      break;
	    }
	  };
	
	  return ret;
	
	}
	
	/**
	 * Returns the transform position of an element as an array
	 * @param  {Object} node
	 * @return {Array}
	 */
	function getTranslateXY(node) {
	  return d3.transform(d3.select(node).attr("transform")).translate;
	}
	
	/**
	 * Returns a translate statement because it's annoying to type out
	 * @return {String}
	 */
	function translate(x, y) {
	    return "translate(" + x + ", " + y + ")";
	}
	
	/**
	 * Tests for SVG support, taken from https://github.com/viljamis/feature.js/
	 * @param  {Object} root A reference to the browser window object.
	 * @return {Boolean}
	 */
	function svgTest(root) {
	  return !!root.document && !!root.document.createElementNS && !!root.document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
	}
	
	/**
	 * Constructs the AWS URL for a given chart ID.
	 * @param  {Object} obj
	 * @return {String}
	 */
	function getThumbnailPath(obj) {
	  var imgSettings = obj.image;
	
	  imgSettings.bucket = __webpack_require__(5);
	
	  var id = obj.id.replace(obj.prefix, "");
	
	  return "https://s3.amazonaws.com/" + imgSettings.bucket + "/" + imgSettings.base_path + id + "/" + imgSettings.filename + "." + imgSettings.extension;
	}
	
	/**
	 * Given a chart object and container, generate and append a thumbnail
	 */
	function generateThumb(container, obj, settings) {
	
	  var imgSettings = settings.image;
	
	  var cont = document.querySelector(container),
	      fallback = cont.querySelector("." + settings.prefix + "base64img");
	
	  if (imgSettings && imgSettings.enable && obj.data.id) {
	
	    var img = document.createElement('img');
	
	    img.setAttribute('src', getThumbnailPath(obj));
	    img.setAttribute('alt', obj.data.heading);
	    img.setAttribute('class', settings.prefix + "thumbnail");
	
	    cont.appendChild(img);
	
	  } else if (fallback) {
	
	    fallback.style.display = 'block';
	
	  }
	
	}
	
	function csvToTable(target, data) {
	  var parsedCSV = d3.csv.parseRows(data);
	
	  target.append("table").selectAll("tr")
	    .data(parsedCSV).enter()
	    .append("tr").selectAll("td")
	    .data(function(d) { return d; }).enter()
	    .append("td")
	    .text(function(d) { return d; });
	}
	
	function dateFormatter(selection, ctx, months, data) {
	
	  var dMonth,
	      dDate,
	      dYear,
	      dHour,
	      dMinute;
	
	  selection.text(function(d) {
	    var date = !data ? d.key : data;
	    var dStr;
	    switch (ctx) {
	      case "years":
	        dStr = date.getFullYear();
	        break;
	      case "months":
	        dMonth = months[date.getMonth()];
	        dDate = date.getDate();
	        dYear = date.getFullYear();
	        dStr = dMonth + " " + dDate + ", " + dYear;
	        break;
	      case "weeks":
	      case "days":
	        dMonth = months[date.getMonth()];
	        dDate = date.getDate();
	        dYear = date.getFullYear();
	        dStr = dMonth + " " + dDate;
	        break;
	      case "hours":
	
	        dDate = date.getDate();
	        dHour = date.getHours();
	        dMinute = date.getMinutes();
	
	        var dHourStr,
	          dMinuteStr;
	
	        // Convert from 24h time
	        var suffix = (dHour >= 12) ? 'p.m.' : 'a.m.';
	
	        if (dHour === 0) {
	          dHourStr = 12;
	        } else if (dHour > 12) {
	          dHourStr = dHour - 12;
	        } else {
	          dHourStr = dHour;
	        }
	
	        // Make minutes follow Globe style
	        if (dMinute === 0) {
	          dMinuteStr = '';
	        } else if (dMinute < 10) {
	          dMinuteStr = ':0' + dMinute;
	        } else {
	          dMinuteStr = ':' + dMinute;
	        }
	
	        dStr = dHourStr + dMinuteStr + ' ' + suffix;
	
	        break;
	      default:
	        dStr = date;
	        break;
	    }
	
	    return dStr;
	
	  });
	
	}
	
	module.exports = {
	  debounce: debounce,
	  clearChart: clearChart,
	  clearObj: clearObj,
	  clearDrawn: clearDrawn,
	  getBounding: getBounding,
	  TimeObj: TimeObj,
	  wrapText: wrapText,
	  timeDiff: timeDiff,
	  timeInterval: timeInterval,
	  getTranslateXY: getTranslateXY,
	  translate: translate,
	  svgTest: svgTest,
	  getThumbnailPath: getThumbnailPath,
	  generateThumb: generateThumb,
	  csvToTable: csvToTable,
	  dateFormatter: dateFormatter,
	  dataParse: __webpack_require__(6),
	  factory: __webpack_require__(7)
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// s3_bucket is defined in webpack.config.js
	module.exports = ("chartstg");


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Data parsing module. Takes a CSV and turns it into an Object, and optionally determines the formatting to use when parsing dates.
	 * @module utils/dataparse
	 * @see module:utils/factory
	 */
	
	/**
	 * Determines whether a scale returns an input date or not.
	 * @param  {String} scaleType      The type of scale.
	 * @param  {String} defaultFormat  Format set by the chart tool settings.
	 * @param  {String} declaredFormat Format passed by the chart embed code, if there is one
	 * @return {String|Undefined}
	 */
	function inputDate(scaleType, defaultFormat, declaredFormat) {
	
	  if (scaleType === "time" || scaleType === "ordinal-time") {
	    return declaredFormat || defaultFormat;
	  } else {
	    return undefined;
	  }
	
	}
	
	/**
	 * Parses a CSV string using d3.csv.parse() and turns it into an array of objects.
	 * @param  {String} csv             CSV string to be parsed
	 * @param  {String inputDateFormat Date format in D3 strftime style, if there is one
	 * @param  {String} index           Value to index the data to, if there is one
	 * @return { {csv: String, data: Array, seriesAmount: Integer, keys: Array} }                 An object with the original CSV string, the newly-formatted data, the number of series in the data and an array of keys used.
	 */
	function parse(csv, inputDateFormat, index, stacked, type) {
	
	  var keys, val;
	
	  var firstVals = {};
	
	  var data = d3.csv.parse(csv, function(d, i) {
	
	    var obj = {};
	
	    if (i === 0) { keys = d3.keys(d); }
	
	    if (inputDateFormat) {
	      var dateFormat = d3.time.format(inputDateFormat);
	      obj.key = dateFormat.parse(d3.values(d)[0]);
	    } else {
	      obj.key = d3.values(d)[0];
	    }
	
	    obj.series = [];
	
	    for (var j = 1; j < d3.keys(d).length; j++) {
	
	      var key = d3.keys(d)[j];
	
	      if (d[key] === 0 || d[key] === "") {
	        d[key] = "__undefined__";
	      }
	
	      if (index) {
	
	        if (i === 0 && !firstVals[key]) {
	          firstVals[key] = d[key];
	        }
	
	        if (index === "0") {
	          val = ((d[key] / firstVals[key]) - 1) * 100;
	        } else {
	          val = (d[key] / firstVals[key]) * index;
	        }
	
	      } else {
	        val = d[key];
	      }
	
	      obj.series.push({
	        val: val,
	        key: key
	      });
	
	    }
	
	    return obj;
	
	  });
	
	  var seriesAmount = data[0].series.length;
	
	  if (stacked) {
	    if (type === "stream") {
	      var stack = d3.layout.stack().offset("silhouette");
	    } else {
	      var stack = d3.layout.stack();
	    }
	    var stackedData = stack(d3.range(seriesAmount).map(function(key) {
	      return data.map(function(d) {
	        return {
	          legend: keys[key + 1],
	          x: d.key,
	          y: Number(d.series[key].val),
	          raw: d
	        };
	      });
	    }));
	  }
	
	  return {
	    csv: csv,
	    data: data,
	    seriesAmount: seriesAmount,
	    keys: keys,
	    stackedData: stackedData || undefined
	  }
	}
	
	module.exports = {
	  inputDate: inputDate,
	  parse: parse
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Recipe factor factory module.
	 * @module utils/factory
	 * @see module:charts/index
	 */
	
	/**
	 * Given a "recipe" of settings for a chart, patch it with an object and parse the data for the chart.
	 * @param {Object} settings
	 * @param {Object} obj
	 * @return {Object} The final chart recipe.
	 */
	function RecipeFactory(settings, obj) {
	  var dataParse = __webpack_require__(6);
	  var helpers = __webpack_require__(8);
	
	  var t = helpers.extend(settings); // short for template
	
	  var embed = obj.data;
	  var chart = embed.chart;
	
	  // I'm not a big fan of indenting stuff like this
	  // (looking at you, Pereira), but I'm making an exception
	  // in this case because my eyes were bleeding.
	
	  t.dispatch         = obj.dispatch;
	
	  t.version          = embed.version                          || t.version;
	  t.id               = obj.id                                 || t.id;
	  t.heading          = embed.heading                          || t.heading;
	  t.qualifier        = embed.qualifier                        || t.qualifier;
	  t.source           = embed.source                           || t.source;
	  t.deck             = embed.deck                             || t.deck
	  t.customClass      = chart.class                            || t.customClass;
	
	  t.xAxis            = helpers.extend(t.xAxis, chart.x_axis)  || t.xAxis;
	  t.yAxis            = helpers.extend(t.yAxis, chart.y_axis)  || t.yAxis;
	
	  var o = t.options,
	      co = chart.options;
	
	  //  "options" area of embed code
	  o.type             = chart.options.type                     || o.type;
	  o.interpolation    = chart.options.interpolation            || o.interpolation;
	
	  o.social      = !helpers.isUndefined(co.social) === true ? co.social           : o.social;
	  o.share_data   = !helpers.isUndefined(co.share_data) === true ? co.share_data  : o.share_data;
	  o.stacked     = !helpers.isUndefined(co.stacked) === true ? co.stacked         : o.stacked;
	  o.expanded    = !helpers.isUndefined(co.expanded) === true ? co.expanded       : o.expanded;
	  o.head        = !helpers.isUndefined(co.head) === true ? co.head               : o.head;
	  o.deck        = !helpers.isUndefined(co.deck) === true ? co.deck               : o.deck;
	  o.legend      = !helpers.isUndefined(co.legend) === true ? co.legend           : o.legend;
	  o.qualifier   = !helpers.isUndefined(co.qualifier) === true ? co.qualifier     : o.qualifier;
	  o.footer      = !helpers.isUndefined(co.footer) === true ? co.footer           : o.footer;
	  o.x_axis      = !helpers.isUndefined(co.x_axis) === true ? co.x_axis           : o.x_axis;
	  o.y_axis      = !helpers.isUndefined(co.y_axis) === true ? co.y_axis           : o.y_axis;
	  o.tips        = !helpers.isUndefined(co.tips) === true ? co.tips               : o.tips;
	  o.annotations = !helpers.isUndefined(co.annotations) === true ? co.annotations : o.annotations;
	  o.range       = !helpers.isUndefined(co.range) === true ? co.range             : o.range;
	  o.series      = !helpers.isUndefined(co.series) === true ? co.series           : o.series;
	  o.index       = !helpers.isUndefined(co.indexed) === true ? co.indexed         : o.index;
	
	  //  these are specific to the t object and don't exist in the embed
	  t.baseClass        = embed.baseClass                        || t.baseClass;
	
	  t.dimensions.width = embed.width                            || t.dimensions.width;
	
	  t.prefix           = chart.prefix                           || t.prefix;
	  t.exportable       = chart.exportable                       || t.exportable;
	  t.editable         = chart.editable                         || t.editable;
	
	  if (t.exportable) {
	    t.dimensions.width = chart.exportable.width || embed.width || t.dimensions.width;
	    t.dimensions.height = function() { return chart.exportable.height; }
	    t.dimensions.margin = chart.exportable.margin || t.dimensions.margin;
	  }
	
	  if (chart.hasHours) { t.dateFormat += " " + t.timeFormat; }
	  t.hasHours         = chart.hasHours                         || t.hasHours;
	  t.dateFormat       = chart.dateFormat                       || t.dateFormat;
	
	  t.dateFormat = dataParse.inputDate(t.xAxis.scale, t.dateFormat, chart.date_format);
	  t.data = dataParse.parse(chart.data, t.dateFormat, o.index, o.stacked, o.type) || t.data;
	
	  return t;
	
	}
	
	module.exports = RecipeFactory;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Helpers that manipulate and check primitives. Nothing D3-specific here.
	 * @module helpers/helpers
	 */
	
	/**
	 * Returns true if value is an integer, false otherwise.
	 * @return {Boolean}
	 */
	function isInteger(x) {
	  return x % 1 === 0;
	}
	
	/**
	 * Returns true if value is a float.
	 * @return {Boolean}
	 */
	function isFloat(n) {
	  return n === +n && n !== (n|0);
	}
	
	/**
	 * Returns true if a value is empty. Works for Objects, Arrays, Strings and Integers.
	 * @return {Boolean}
	 */
	function isEmpty(val) {
	  if (val.constructor == Object) {
	    for (var prop in val) {
	      if (val.hasOwnProperty(prop)) { return false; }
	    }
	    return true;
	  } else if (val.constructor == Array) {
	    return !val.length;
	  } else {
	    return !val;
	  }
	}
	
	/**
	 * Simple check for whether a value is undefined or not
	 * @return {Boolean}
	 */
	function isUndefined(val) {
	  return val === undefined ? true : false;
	}
	
	/**
	 * Given two arrays, returns only unique values in those arrays.
	 * @param  {Array} a1
	 * @param  {Array} a2
	 * @return {Array}    Array of unique values.
	 */
	function arrayDiff(a1, a2) {
	  var o1 = {}, o2 = {}, diff= [], i, len, k;
	  for (i = 0, len = a1.length; i < len; i++) { o1[a1[i]] = true; }
	  for (i = 0, len = a2.length; i < len; i++) { o2[a2[i]] = true; }
	  for (k in o1) { if (!(k in o2)) { diff.push(k); } }
	  for (k in o2) { if (!(k in o1)) { diff.push(k); } }
	  return diff;
	}
	
	/**
	 * Opposite of arrayDiff(), this returns only common elements between arrays.
	 * @param  {Array} arr1
	 * @param  {Array} arr2
	 * @return {Array}      Array of common values.
	 */
	function arraySame(a1, a2) {
	  var ret = [];
	  for (i in a1) {
	    if (a2.indexOf( a1[i] ) > -1){
	      ret.push( a1[i] );
	    }
	  }
	  return ret;
	}
	
	/**
	 * Extends 'from' object with members from 'to'. If 'to' is null, a deep clone of 'from' is returned
	 * @param  {*} from
	 * @param  {*} to
	 * @return {*}      Cloned object.
	 */
	function extend(from, to) {
	  if (from == null || typeof from != "object") return from;
	  if (from.constructor != Object && from.constructor != Array) return from;
	  if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
	    from.constructor == String || from.constructor == Number || from.constructor == Boolean)
	    return new from.constructor(from);
	
	  to = to || new from.constructor();
	
	  for (var name in from) {
	    to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
	  }
	
	  return to;
	}
	
	/**
	 * Compares two objects, returning an array of unique keys.
	 * @param  {Object} o1
	 * @param  {Object} o2
	 * @return {Array}
	 */
	function uniqueKeys(o1, o2) {
	  return arrayDiff(d3.keys(o1), d3.keys(o2));
	}
	
	/**
	 * Compares two objects, returning an array of common keys.
	 * @param  {Object} o1
	 * @param  {Object} o2
	 * @return {Array}
	 */
	function sameKeys(o1, o2) {
	  return arraySame(d3.keys(o1), d3.keys(o2));
	}
	
	/**
	 * If a string is undefined, return an empty string instead.
	 * @param  {String} str
	 * @return {String}
	 */
	function cleanStr(str){
	  if (str === undefined) {
	    return "";
	  } else {
	    return str;
	  }
	}
	
	module.exports = {
	  isInteger: isInteger,
	  isFloat: isFloat,
	  isEmpty: isEmpty,
	  isUndefined: isUndefined,
	  extend: extend,
	  arrayDiff: arrayDiff,
	  arraySame: arraySame,
	  uniqueKeys: uniqueKeys,
	  sameKeys: sameKeys,
	  cleanStr: cleanStr
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Chart contruction manager module.
	 * @module charts/manager
	 */
	
	/**
	 * Manages the step-by-step creation of a chart, and returns the full configuration for the chart, including references to nodes, scales, axes, etc.
	 * @param {String} container Selector for the container the chart will be drawn into.
	 * @param {Object} obj       Object that contains settings for the chart.
	 */
	function ChartManager(container, obj) {
	
	  var Recipe = __webpack_require__(7),
	      settings = __webpack_require__(1),
	      components = __webpack_require__(10);
	
	  var chartRecipe = new Recipe(settings, obj);
	
	  var rendered = chartRecipe.rendered = {};
	
	  // check that each section is needed
	
	  if (chartRecipe.options.head) {
	    rendered.header = components.header(container, chartRecipe);
	  }
	
	  if (chartRecipe.options.footer) {
	    rendered.footer = components.footer(container, chartRecipe);
	  }
	
	  var node = components.base(container, chartRecipe);
	
	  rendered.container = node;
	
	  rendered.plot = components.plot(node, chartRecipe);
	
	  if (chartRecipe.options.qualifier) {
	    rendered.qualifier = components.qualifier(node, chartRecipe);
	  }
	
	  if (chartRecipe.options.tips) {
	    rendered.tips = components.tips(node, chartRecipe);
	  }
	
	  if (!chartRecipe.editable && !chartRecipe.exportable) {
	    if (chartRecipe.options.share_data) {
	      rendered.shareData = components.shareData(container, chartRecipe);
	    }
	    if (chartRecipe.options.social) {
	      rendered.social = components.social(container, chartRecipe);
	    }
	  }
	
	  if (chartRecipe.CUSTOM) {
	    var custom = __webpack_require__(30);
	    rendered.custom = custom(node, chartRecipe, rendered);
	  }
	
	  return chartRecipe;
	
	};
	
	module.exports = ChartManager;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var components = {
	  base: __webpack_require__(11),
	  header: __webpack_require__(12),
	  footer: __webpack_require__(13),
	  plot: __webpack_require__(14),
	  qualifier: __webpack_require__(26),
	  axis: __webpack_require__(16),
	  scale: __webpack_require__(17),
	  tips: __webpack_require__(27),
	  social: __webpack_require__(28),
	  shareData: __webpack_require__(29)
	};
	
	module.exports = components;


/***/ },
/* 11 */
/***/ function(module, exports) {

	function append(container, obj) {
	
	  var margin = obj.dimensions.margin;
	
	  var chartBase = d3.select(container)
	    .insert("svg", "." + obj.prefix + "chart_source")
	    .attr({
	      "class": obj.baseClass() + "_svg " + obj.prefix + obj.customClass + " " + obj.prefix + "type_" + obj.options.type + " " + obj.prefix + "series-" + obj.data.seriesAmount,
	      "width": obj.dimensions.computedWidth() + margin.left + margin.right,
	      "height": obj.dimensions.computedHeight() + margin.top + margin.bottom,
	      "version": 1.1,
	      "xmlns": "http://www.w3.org/2000/svg"
	    });
	
	  // background rect
	  chartBase
	    .append("rect")
	    .attr({
	      "class": obj.prefix + "bg",
	      "x": 0,
	      "y": 0,
	      "width": obj.dimensions.computedWidth(),
	      "height": obj.dimensions.computedHeight(),
	      "transform": "translate(" + margin.left + "," + margin.top + ")"
	    });
	
	  var graph = chartBase.append("g")
	    .attr({
	      "class": obj.prefix + "graph",
	      "transform": "translate(" + margin.left + "," + margin.top + ")"
	    });
	
	  return graph;
	
	}
	
	module.exports = append;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	function headerComponent(container, obj) {
	
	  var helpers = __webpack_require__(8);
	
	  var headerGroup = d3.select(container)
	    .append("div")
	    .classed(obj.prefix + "chart_title " + obj.prefix + obj.customClass, true)
	
	  // hack necessary to ensure PDF fields are sized properly
	  if (obj.exportable) {
	    headerGroup.style("width", obj.exportable.width + "px");
	  }
	
	  if (obj.heading !== "" || obj.editable) {
	    var headerText = headerGroup
	      .append("div")
	      .attr("class", obj.prefix + "chart_title-text")
	      .text(obj.heading);
	
	    if (obj.editable) {
	      headerText
	        .attr("contentEditable", true)
	        .classed("editable-chart_title", true);
	    }
	
	  }
	
	  var qualifier;
	
	  if (obj.options.type === "bar") {
	    qualifier = headerGroup
	      .append("div")
	      .attr({
	        "class": function() {
	          var str = obj.prefix + "chart_qualifier " + obj.prefix + "chart_qualifier-bar";
	          if (obj.editable) {
	            str += " editable-chart_qualifier";
	          }
	          return str;
	        },
	        "contentEditable": function() {
	          return obj.editable ? true : false;
	        }
	      })
	      .text(obj.qualifier);
	  }
	
	  if (obj.data.keys.length > 2) {
	
	    var legend = headerGroup.append("div")
	      .classed(obj.prefix + "chart_legend", true);
	
	    var keys = helpers.extend(obj.data.keys);
	
	    // get rid of the first item as it doesnt represent a series
	    keys.shift();
	
	    if (obj.options.type === "multiline") {
	      keys = [keys[0], keys[1]];
	      legend.classed(obj.prefix + "chart_legend-" + obj.options.type, true);
	    }
	
	    var legendItem = legend.selectAll("div." + obj.prefix + "legend_item")
	      .data(keys)
	      .enter()
	      .append("div")
	      .attr("class", function(d, i) {
	        return obj.prefix + "legend_item " + obj.prefix + "legend_item_" + (i);
	      });
	
	    legendItem.append("span")
	      .attr("class", obj.prefix + "legend_item_icon");
	
	    legendItem.append("span")
	      .attr("class", obj.prefix + "legend_item_text")
	      .text(function(d) { return d; });
	  }
	
	  obj.dimensions.headerHeight = headerGroup.node().getBoundingClientRect().height;
	
	  return {
	    headerGroup: headerGroup,
	    legend: legend,
	    qualifier: qualifier
	  };
	
	}
	
	module.exports = headerComponent;


/***/ },
/* 13 */
/***/ function(module, exports) {

	function footerComponent(container, obj) {
	
	  var footerGroup;
	
	  if (obj.source !== "" || obj.editable) {
	    footerGroup = d3.select(container)
	      .append("div")
	      .classed(obj.prefix + "chart_source", true);
	
	    // hack necessary to ensure PDF fields are sized properly
	    if (obj.exportable) {
	      footerGroup.style("width", obj.exportable.width + "px");
	    }
	
	    var footerText = footerGroup.append("div")
	      .attr("class", obj.prefix + "chart_source-text")
	      .text(obj.source);
	
	    if (obj.editable) {
	      footerText
	        .attr("contentEditable", true)
	        .classed("editable-chart_source", true);
	    }
	
	    obj.dimensions.footerHeight = footerGroup.node().getBoundingClientRect().height;
	
	  }
	
	  return {
	    footerGroup: footerGroup
	  };
	
	}
	
	module.exports = footerComponent;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	function plot(node, obj) {
	
	  var draw = {
	    line: __webpack_require__(15),
	    multiline: __webpack_require__(18),
	    sparkline: __webpack_require__(19),
	    area: __webpack_require__(20),
	    stackedArea: __webpack_require__(21),
	    column: __webpack_require__(22),
	    bar: __webpack_require__(23),
	    stackedColumn: __webpack_require__(24),
	    streamgraph: __webpack_require__(25)
	  };
	
	  var chartRef;
	
	  switch(obj.options.type) {
	
	    case "line":
	      chartRef = draw.line(node, obj);
	      break;
	
	    case "multiline":
	      chartRef = draw.multiline(node, obj);
	      break;
	
	    case "sparkline":
	      chartRef = draw.sparkline(node, obj);
	      break;
	
	    case "area":
	      chartRef = obj.options.stacked ? draw.stackedArea(node, obj) : draw.area(node, obj);
	      break;
	
	    case "bar":
	      chartRef = draw.bar(node, obj);
	      break;
	
	    case "column":
	      chartRef = obj.options.stacked ? draw.stackedColumn(node, obj) : draw.column(node, obj);
	      break;
	
	    case "stream":
	      chartRef = draw.streamgraph(node, obj);
	      break;
	
	    default:
	      chartRef = draw.line(node, obj);
	      break;
	  }
	
	  return chartRef;
	
	}
	
	module.exports = plot;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	function LineChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  // Secondary array is used to store a reference to all series except for the highlighted item
	  var secondaryArr = [];
	
	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines
	
	    if (i !== obj.seriesHighlight()) {
	
	      var line = d3.svg.line().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y(function(d) { return yScale(d.series[i].val); });
	
	      var pathRef = seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": line,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "line " + obj.prefix + "line-" + (i);
	            return output;
	          }
	        });
	
	      secondaryArr.push(pathRef);
	    }
	
	  }
	
	  // Loop through all the secondary series (all series except the highlighted one)
	  // and set the colours in the correct order
	
	  var secondaryArr = secondaryArr.reverse();
	
	  var hLine = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "line " + obj.prefix + "line-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      },
	      "d": hLine
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    line: line
	  };
	
	};
	
	module.exports = LineChart;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	function AxisFactory(axisObj, scale) {
	
	  var axis = d3.svg.axis()
	    .scale(scale)
	    .orient(axisObj.orient);
	
	  return axis;
	
	}
	
	function axisManager(node, obj, scale, axisType) {
	
	  var axisObj = obj[axisType];
	  var axis = new AxisFactory(axisObj, scale);
	
	  var prevAxis = node.select("." + obj.prefix + "axis-group" + "." + obj.prefix + axisType).node();
	
	  if (prevAxis !== null) { d3.select(prevAxis).remove(); }
	
	  var axisGroup = node.append("g")
	    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + axisType);
	
	  if (axisType === "xAxis") {
	    appendXAxis(axisGroup, obj, scale, axis, axisType);
	  } else if (axisType === "yAxis") {
	    appendYAxis(axisGroup, obj, scale, axis, axisType);
	  }
	
	  return {
	    node: axisGroup,
	    axis: axis
	  };
	
	}
	
	function determineFormat(context) {
	
	  switch (context) {
	    case "years": return d3.time.format("%Y");
	    case "months": return d3.time.format("%b");
	    case "weeks": return d3.time.format("%W");
	    case "days": return d3.time.format("%j");
	    case "hours": return d3.time.format("%H");
	    case "minutes": return d3.time.format("%M");
	  }
	
	}
	
	function appendXAxis(axisGroup, obj, scale, axis, axisName) {
	
	  var axisObj = obj[axisName],
	      axisSettings;
	
	  if (obj.exportable && obj.exportable.x_axis) {
	    var extend = __webpack_require__(8).extend;
	    axisSettings = extend(axisObj, obj.exportable.x_axis);
	  } else {
	    axisSettings = axisObj;
	  }
	
	  axisGroup
	    .attr("transform", "translate(0," + obj.dimensions.yAxisHeight() + ")");
	
	  var axisNode = axisGroup.append("g")
	    .attr("class", obj.prefix + "x-axis");
	
	  switch(axisObj.scale) {
	    case "time":
	      timeAxis(axisNode, obj, scale, axis, axisSettings);
	      break;
	    case "ordinal":
	      discreteAxis(axisNode, scale, axis, axisSettings, obj.dimensions);
	      break;
	    case "ordinal-time":
	      ordinalTimeAxis(axisNode, obj, scale, axis, axisSettings);
	      break;
	  }
	
	  obj.dimensions.xAxisHeight = axisNode.node().getBBox().height;
	
	}
	
	function appendYAxis(axisGroup, obj, scale, axis, axisName) {
	
	  axisGroup.attr("transform", "translate(0,0)");
	
	  var axisNode = axisGroup.append("g")
	    .attr("class", obj.prefix + "y-axis");
	
	  drawYAxis(obj, axis, axisNode);
	
	}
	
	function drawYAxis(obj, axis, axisNode) {
	
	  var axisSettings;
	
	  var axisObj = obj["yAxis"];
	
	  if (obj.exportable && obj.exportable.y_axis) {
	    var extend = __webpack_require__(8).extend;
	    axisSettings = extend(axisObj, obj.exportable.y_axis);
	  } else {
	    axisSettings = axisObj;
	  }
	
	  obj.dimensions.yAxisPaddingRight = axisSettings.paddingRight;
	
	  axis.scale().range([obj.dimensions.yAxisHeight(), 0]);
	
	  axis.tickValues(tickFinderY(axis.scale(), axisObj.ticks, axisSettings));
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("g")
	    .filter(function(d) { return d; })
	    .classed(obj.prefix + "minor", true);
	
	  axisNode.selectAll(".tick text")
	    .attr("transform", "translate(0,0)")
	    .call(updateTextY, axisNode, obj, axis, axisObj)
	    .call(repositionTextY, obj.dimensions, axisObj.textX);
	
	  axisNode.selectAll(".tick line")
	    .attr({
	      "x1": obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	      "x2": obj.dimensions.computedWidth()
	    });
	
	}
	
	function timeAxis(axisNode, obj, scale, axis, axisSettings) {
	
	  var timeDiff = __webpack_require__(4).timeDiff,
	      domain = scale.domain(),
	      ctx = timeDiff(domain[0], domain[1], 3),
	      currentFormat = determineFormat(ctx);
	
	  axis.tickFormat(currentFormat);
	
	  var ticks;
	
	  var tickGoal;
	  if (axisSettings.ticks === 'auto') {
	    tickGoal = axisSettings.tickTarget;
	  } else {
	    tickGoal = axisSettings.ticks;
	  }
	
	  if (obj.dimensions.tickWidth() > axisSettings.widthThreshold) {
	    ticks = tickFinderX(domain, ctx, tickGoal);
	  } else {
	    ticks = tickFinderX(domain, ctx, axisSettings.ticksSmall);
	  }
	
	  if (obj.options.type !== "column") {
	    axis.tickValues(ticks);
	  } else {
	    axis.ticks();
	  }
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("text")
	    .attr({
	      "x": axisSettings.upper.textX,
	      "y": axisSettings.upper.textY,
	      "dy": axisSettings.dy + "em"
	    })
	    .style("text-anchor", "start")
	    .call(setTickFormatX, ctx, axisSettings.ems, obj.monthsAbr);
	
	  if (obj.options.type === "column") { dropRedundantTicks(axisNode, ctx); }
	
	  axisNode.selectAll(".tick")
	    .call(dropTicks);
	
	  axisNode.selectAll("line")
	    .attr("y2", axisSettings.upper.tickHeight);
	
	}
	
	function discreteAxis(axisNode, scale, axis, axisSettings, dimensions) {
	
	  var wrapText = __webpack_require__(4).wrapText;
	
	  axis.tickPadding(0);
	
	  scale.rangeExtent([0, dimensions.tickWidth()]);
	
	  scale.rangeRoundBands([0, dimensions.tickWidth()], dimensions.bands.padding, dimensions.bands.outerPadding);
	
	  var bandStep = scale.rangeBand();
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("text")
	    .style("text-anchor", "middle")
	    .attr("dy", axisSettings.dy + "em")
	    .call(wrapText, bandStep);
	
	  var firstXPos = d3.transform(axisNode.select(".tick").attr("transform")).translate[0] * -1;
	
	  var xPos = (- (bandStep / 2) - (bandStep * dimensions.bands.outerPadding));
	
	  axisNode.selectAll("line")
	    .attr({
	      "x1": xPos,
	      "x2": xPos
	    });
	
	  axisNode.select("line")
	    .attr({
	      "x1": firstXPos,
	      "x2": firstXPos
	    });
	
	  axisNode.selectAll("line")
	    .attr("y2", axisSettings.upper.tickHeight);
	
	  var lastTick = axisNode.append("g")
	    .attr({
	      "class": "tick",
	      "transform": "translate(" + (dimensions.tickWidth() + (bandStep / 2) + bandStep * dimensions.bands.outerPadding) + ",0)"
	    });
	
	  lastTick.append("line")
	    .attr({
	      "y2": axisSettings.upper.tickHeight,
	      "x1": xPos,
	      "x2": xPos
	    });
	
	}
	
	function ordinalTimeAxis(axisNode, obj, scale, axis, axisSettings) {
	
	  var timeDiff = __webpack_require__(4).timeDiff,
	      domain = scale.domain(),
	      ctx = timeDiff(domain[0], domain[domain.length - 1], 3),
	      currentFormat = determineFormat(ctx);
	
	  axis.tickFormat(currentFormat);
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("text")
	    .attr({
	      "x": axisSettings.upper.textX,
	      "y": axisSettings.upper.textY,
	      "dy": axisSettings.dy + "em"
	    })
	    .style("text-anchor", "start")
	    .call(setTickFormatX, ctx, axisSettings.ems, obj.monthsAbr);
	
	  if (obj.dimensions.computedWidth() > obj.xAxis.widthThreshold) {
	    var ordinalTickPadding = 7;
	  } else {
	    var ordinalTickPadding = 4;
	  }
	
	  axisNode.selectAll(".tick")
	    .call(ordinalTimeTicks, axisNode, ctx, scale, ordinalTickPadding);
	
	  axisNode.selectAll("line")
	    .attr("y2", axisSettings.upper.tickHeight);
	
	}
	
	// text formatting functions
	
	function setTickFormatX(selection, ctx, ems, monthsAbr) {
	
	  var prevYear,
	      prevMonth,
	      prevDate,
	      dYear,
	      dMonth,
	      dDate,
	      dHour,
	      dMinute;
	
	  selection.text(function(d) {
	
	    var node = d3.select(this);
	
	    var dStr;
	
	    switch (ctx) {
	      case "years":
	        dStr = d.getFullYear();
	        break;
	      case "months":
	
	        dMonth = monthsAbr[d.getMonth()];
	        dYear = d.getFullYear();
	
	        if (dYear !== prevYear) {
	          newTextNode(node, dYear, ems);
	        }
	
	        dStr = dMonth;
	
	        prevYear = dYear;
	
	        break;
	      case "weeks":
	      case "days":
	        dYear = d.getFullYear();
	        dMonth = monthsAbr[d.getMonth()];
	        dDate = d.getDate();
	
	        if (dMonth !== prevMonth) {
	          dStr = dMonth + " " + dDate;
	        } else {
	          dStr = dDate;
	        }
	
	        if (dYear !== prevYear) {
	          newTextNode(node, dYear, ems);
	        }
	
	        prevMonth = dMonth;
	        prevYear = dYear;
	
	        break;
	
	      case "hours":
	        dMonth = monthsAbr[d.getMonth()];
	        dDate = d.getDate();
	        dHour = d.getHours();
	        dMinute = d.getMinutes();
	
	        var dHourStr,
	            dMinuteStr;
	
	        // Convert from 24h time
	        var suffix = (dHour >= 12) ? 'p.m.' : 'a.m.';
	        if (dHour === 0) {
	          dHourStr = 12;
	        } else if (dHour > 12) {
	          dHourStr = dHour - 12;
	        } else {
	          dHourStr = dHour;
	        }
	
	        // Make minutes follow Globe style
	        if (dMinute === 0) {
	          dMinuteStr = '';
	        } else if (dMinute < 10) {
	          dMinuteStr = ':0' + dMinute;
	        } else {
	          dMinuteStr = ':' + dMinute;
	        }
	
	        dStr = dHourStr + dMinuteStr + ' ' + suffix;
	
	        if (dDate !== prevDate) {
	          var dateStr = dMonth + " " + dDate;
	          newTextNode(node, dateStr, ems);
	        }
	
	        prevDate = dDate;
	
	        break;
	      default:
	        dStr = d;
	        break;
	    }
	
	    return dStr;
	
	  });
	
	}
	
	function setTickFormatY(format, d, lastTick) {
	  // checking for a format and formatting y-axis values accordingly
	
	  var isFloat = __webpack_require__(8).isFloat;
	
	  var currentFormat;
	
	  switch (format) {
	    case "general":
	      currentFormat = d3.format("g")(d);
	      break;
	    case "si":
	      var prefix = d3.formatPrefix(lastTick),
	          format = d3.format(".1f");
	      currentFormat = format(prefix.scale(d)) + prefix.symbol;
	      break;
	    case "comma":
	      if (isFloat(parseFloat(d))) {
	        currentFormat = d3.format(",.2f")(d);
	      } else {
	        currentFormat = d3.format(",g")(d);
	      }
	      break;
	    case "round1":
	      currentFormat = d3.format(",.1f")(d);
	      break;
	    case "round2":
	      currentFormat = d3.format(",.2f")(d);
	      break;
	    case "round3":
	      currentFormat = d3.format(",.3f")(d);
	      break;
	    case "round4":
	      currentFormat = d3.format(",.4f")(d);
	      break;
	    default:
	      currentFormat = d3.format(",g")(d);
	      break;
	  }
	
	  return currentFormat;
	
	}
	
	function updateTextX(textNodes, axisNode, obj, axis, axisObj) {
	
	  var lastTick = axis.tickValues()[axis.tickValues().length - 1];
	
	  textNodes
	    .text(function(d, i) {
	      var val = setTickFormatY(axisObj.format, d, lastTick);
	      if (i === axis.tickValues().length - 1) {
	        val = (axisObj.prefix || "") + val + (axisObj.suffix || "");
	      }
	      return val;
	    });
	
	}
	
	function updateTextY(textNodes, axisNode, obj, axis, axisObj) {
	
	  var arr = [],
	      lastTick = axis.tickValues()[axis.tickValues().length - 1];
	
	  textNodes
	    .attr("transform", "translate(0,0)")
	    .text(function(d, i) {
	      var val = setTickFormatY(axisObj.format, d, lastTick);
	      if (i === axis.tickValues().length - 1) {
	        val = (axisObj.prefix || "") + val + (axisObj.suffix || "");
	      }
	      return val;
	    })
	    .text(function() {
	      var sel = d3.select(this);
	      var textChar = sel.node().getBoundingClientRect().width;
	      arr.push(textChar);
	      return sel.text();
	    })
	    .attr({
	      "dy": function() {
	        if (axisObj.dy !== "") {
	          return axisObj.dy + "em";
	        } else {
	          return d3.select(this).attr("dy");
	        }
	      },
	      "x": function() {
	        if (axisObj.textX !== "") {
	          return axisObj.textX;
	        } else {
	          return d3.select(this).attr("x");
	        }
	      },
	      "y": function() {
	        if (axisObj.textY !== "") {
	          return axisObj.textY;
	        } else {
	          return d3.select(this).attr("y");
	        }
	      }
	    });
	
	  obj.dimensions.labelWidth = d3.max(arr);
	
	}
	
	function repositionTextY(text, dimensions, textX) {
	  text.attr({
	    "transform": "translate(" + (dimensions.labelWidth - textX) + ",0)",
	    "x": 0
	  });
	}
	
	// Clones current text selection and appends
	// a new text node below the selection
	function newTextNode(selection, text, ems) {
	
	  var nodeName = selection.property("nodeName"),
	      parent = d3.select(selection.node().parentNode),
	      lineHeight = ems || 1.6, // ems
	      dy = parseFloat(selection.attr("dy")),
	      x = parseFloat(selection.attr("x")),
	
	      cloned = parent.append(nodeName)
	        .attr("dy", lineHeight + dy + "em")
	        .attr("x", x)
	        .text(function() { return text; });
	
	  return cloned;
	
	}
	
	// tick dropping functions
	
	function dropTicks(selection, opts) {
	
	  var opts = opts || {};
	
	  var tolerance = opts.tolerance || 0,
	      from = opts.from || 0,
	      to = opts.to || selection[0].length;
	
	  for (var j = from; j < to; j++) {
	
	    var c = selection[0][j], // current selection
	        n = selection[0][j + 1]; // next selection
	
	    if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect) { continue; }
	
	    while ((c.getBoundingClientRect().right + tolerance) > n.getBoundingClientRect().left) {
	
	      if (d3.select(n).data()[0] === selection.data()[to]) {
	        d3.select(c).remove();
	      } else {
	        d3.select(n).remove();
	      }
	
	      j++;
	
	      n = selection[0][j + 1];
	
	      if (!n) { break; }
	
	    }
	
	  }
	
	}
	
	function dropRedundantTicks(selection, ctx) {
	
	  var ticks = selection.selectAll(".tick");
	
	  var prevYear, prevMonth, prevDate, prevHour, prevMinute, dYear, dMonth, dDate, dHour, dMinute;
	
	  ticks.each(function(d) {
	    switch (ctx) {
	      case "years":
	        dYear = d.getFullYear();
	        if (dYear === prevYear) {
	          d3.select(this).remove();
	        }
	        prevYear = dYear;
	        break;
	      case "months":
	        dYear = d.getFullYear();
	        dMonth = d.getMonth();
	        if ((dMonth === prevMonth) && (dYear === prevYear)) {
	          d3.select(this).remove();
	        }
	        prevMonth = dMonth;
	        prevYear = dYear;
	        break;
	      case "weeks":
	      case "days":
	        dYear = d.getFullYear();
	        dMonth = d.getMonth();
	        dDate = d.getDate();
	
	        if ((dDate === prevDate) && (dMonth === prevMonth) && (dYear === prevYear)) {
	          d3.select(this).remove();
	        }
	
	        prevDate = dDate;
	        prevMonth = dMonth;
	        prevYear = dYear;
	        break;
	      case "hours":
	        dDate = d.getDate();
	        dHour = d.getHours();
	        dMinute = d.getMinutes();
	
	        if ((dDate === prevDate) && (dHour === prevHour) && (dMinute === prevMinute)) {
	          d3.select(this).remove();
	        }
	
	        prevDate = dDate;
	        prevHour = dHour;
	        prevMinute = dMinute;
	        break;
	    }
	  });
	
	}
	
	function dropOversetTicks(axisNode, tickWidth) {
	
	  var axisGroupWidth = axisNode.node().getBBox().width,
	      tickArr = axisNode.selectAll(".tick")[0];
	
	  if (tickArr.length) {
	
	    var firstTickOffset = d3.transform(d3.select(tickArr[0])
	      .attr("transform")).translate[0];
	
	    if ((axisGroupWidth + firstTickOffset) >= tickWidth) {
	      var lastTick = tickArr[tickArr.length - 1];
	      d3.select(lastTick).attr("class", "last-tick-hide");
	      axisGroupWidth = axisNode.node().getBBox().width;
	      tickArr = axisNode.selectAll(".tick")[0];
	    }
	
	  }
	
	}
	
	function tickFinderX(domain, period, tickGoal) {
	
	  // set ranges
	  var startDate = domain[0],
	      endDate = domain[1];
	
	  // set upper and lower bounds for number of steps per tick
	  // i.e. if you have four months and set steps to 1, you'll get 4 ticks
	  // and if you have six months and set steps to 2, you'll get 3 ticks
	  var stepLowerBound = 1,
	      stepUpperBound = 12,
	      tickCandidates = [],
	      closestArr;
	
	  // using the tick bounds, generate multiple arrays-in-objects using
	  // different tick steps. push all those generated objects to tickCandidates
	  for (var i = stepLowerBound; i <= stepUpperBound; i++) {
	    var obj = {};
	    obj.interval = i;
	    obj.arr = d3.time[period](startDate, endDate, i).length;
	    tickCandidates.push(obj);
	  }
	
	  // reduce to find a best candidate based on the defined tickGoal
	  if (tickCandidates.length > 1) {
	    closestArr = tickCandidates.reduce(function (prev, curr) {
	      return (Math.abs(curr.arr - tickGoal) < Math.abs(prev.arr - tickGoal) ? curr : prev);
	    });
	  } else if (tickCandidates.length === 1) {
	    closestArr = tickCandidates[0];
	  } else {
	    // sigh. we tried.
	    closestArr.interval = 1;
	  }
	
	  var tickArr = d3.time[period](startDate, endDate, closestArr.interval);
	
	  var startDiff = tickArr[0] - startDate;
	  var tickDiff = tickArr[1] - tickArr[0];
	
	  // if distance from startDate to tickArr[0] is greater than half the
	  // distance between tickArr[1] and tickArr[0], add startDate to tickArr
	
	  if ( startDiff > (tickDiff / 2) ) { tickArr.unshift(startDate); }
	
	  return tickArr;
	
	}
	
	function tickFinderY(scale, tickCount, tickSettings) {
	
	  // In a nutshell:
	  // Checks if an explicit number of ticks has been declared
	  // If not, sets lower and upper bounds for the number of ticks
	  // Iterates over those and makes sure that there are tick arrays where
	  // the last value in the array matches the domain max value
	  // if so, tries to find the tick number closest to tickGoal out of the winners,
	  // and returns that arr to the scale for use
	
	  var min = scale.domain()[0],
	      max = scale.domain()[1];
	
	  if (tickCount !== "auto") {
	
	    return scale.ticks(tickCount);
	
	  } else {
	
	    var tickLowerBound = tickSettings.tickLowerBound,
	        tickUpperBound = tickSettings.tickUpperBound,
	        tickGoal = tickSettings.tickGoal,
	        arr = [],
	        tickCandidates = [],
	        closestArr;
	
	    for (var i = tickLowerBound; i <= tickUpperBound; i++) {
	      var tickCandidate = scale.ticks(i);
	
	      if (min < 0) {
	        if ((tickCandidate[0] === min) && (tickCandidate[tickCandidate.length - 1] === max)) {
	          arr.push(tickCandidate);
	        }
	      } else {
	        if (tickCandidate[tickCandidate.length - 1] === max) {
	          arr.push(tickCandidate);
	        }
	      }
	    }
	
	    arr.forEach(function (value) {
	      tickCandidates.push(value.length);
	    });
	
	    var closestArr;
	
	    if (tickCandidates.length > 1) {
	      closestArr = tickCandidates.reduce(function (prev, curr) {
	        return (Math.abs(curr - tickGoal) < Math.abs(prev - tickGoal) ? curr : prev);
	      });
	    } else if (tickCandidates.length === 1) {
	      closestArr = tickCandidates[0];
	    } else {
	      closestArr = null;
	    }
	
	    return scale.ticks(closestArr);
	
	  }
	}
	
	
	function ordinalTimeTicks(selection, axisNode, ctx, scale, tolerance) {
	
	  dropRedundantTicks(axisNode, ctx);
	
	  // dropRedundantTicks has modified the selection, so we need to reselect
	  // to get a proper idea of what's still available
	  var newSelection = axisNode.selectAll(".tick");
	
	  // if the context is "years", every tick is a majortick so we can
	  // just pass on the block below
	  if (ctx !== "years") {
	
	    // array for any "major ticks", i.e. ticks with a change in context
	    // one level up. i.e., a "months" context set of ticks with a change in the year,
	    // or "days" context ticks with a change in month or year
	    var majorTicks = [];
	
	    var prevYear, prevMonth, prevDate, dYear, dMonth, dDate;
	
	    newSelection.each(function(d) {
	      var currSel = d3.select(this);
	      switch (ctx) {
	        case "months":
	          dYear = d.getFullYear();
	          if (dYear !== prevYear) { majorTicks.push(currSel); }
	          prevYear = d.getFullYear();
	          break;
	        case "weeks":
	        case "days":
	          dYear = d.getFullYear();
	          dMonth = d.getMonth();
	          if ((dMonth !== prevMonth) && (dYear !== prevYear)) {
	            majorTicks.push(currSel);
	          } else if (dMonth !== prevMonth) {
	            majorTicks.push(currSel);
	          } else if (dYear !== prevYear) {
	            majorTicks.push(currSel);
	          }
	          prevMonth = d.getMonth();
	          prevYear = d.getFullYear();
	          break;
	        case "hours":
	          dDate = d.getDate();
	          if (dDate !== prevDate) { majorTicks.push(currSel); }
	          prevDate = dDate;
	          break;
	      }
	    });
	
	    var t0, tn;
	
	    if (majorTicks.length > 1) {
	
	      for (var i = 0; i < majorTicks.length + 1; i++) {
	
	        if (i === 0) { // from t0 to m0
	          t0 = 0;
	          tn = newSelection.data().indexOf(majorTicks[0].data()[0]);
	        } else if (i === (majorTicks.length)) { // from mn to tn
	          t0 = newSelection.data().indexOf(majorTicks[i - 1].data()[0]);
	          tn = newSelection.length - 1;
	        } else { // from m0 to mn
	          t0 = newSelection.data().indexOf(majorTicks[i - 1].data()[0]);
	          tn = newSelection.data().indexOf(majorTicks[i].data()[0]);
	        }
	
	        if (!!(tn - t0)) {
	          dropTicks(newSelection, {
	            from: t0,
	            to: tn,
	            tolerance: tolerance
	          });
	        }
	
	      }
	
	    }
	
	  } else {
	    dropTicks(newSelection, { tolerance: tolerance });
	  }
	
	}
	
	function axisCleanup(node, obj, xAxisObj, yAxisObj) {
	
	  // this section is kinda gross, sorry:
	  // resets ranges and dimensions, redraws yAxis, redraws xAxis
	  // …then redraws yAxis again if tick wrapping has changed xAxis height
	
	  drawYAxis(obj, yAxisObj.axis, yAxisObj.node);
	
	  var setRangeType = __webpack_require__(17).setRangeType,
	      setRangeArgs = __webpack_require__(17).setRangeArgs;
	
	  var scaleObj = {
	    rangeType: setRangeType(obj.xAxis),
	    range: xAxisObj.range || [0, obj.dimensions.tickWidth()],
	    bands: obj.dimensions.bands,
	    rangePoints: obj.xAxis.rangePoints
	  };
	
	  setRangeArgs(xAxisObj.axis.scale(), scaleObj);
	
	  var prevXAxisHeight = obj.dimensions.xAxisHeight;
	
	  xAxisObj = axisManager(node, obj, xAxisObj.axis.scale(), "xAxis");
	
	  xAxisObj.node
	    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	  if (obj.xAxis.scale !== "ordinal") {
	    dropOversetTicks(xAxisObj.node, obj.dimensions.tickWidth());
	  }
	
	  if (prevXAxisHeight !== obj.dimensions.xAxisHeight) {
	    drawYAxis(obj, yAxisObj.axis, yAxisObj.node);
	  }
	
	}
	
	function addZeroLine(obj, node, Axis, axisType) {
	
	  var ticks = Axis.axis.tickValues(),
	      tickMin = ticks[0],
	      tickMax = ticks[ticks.length - 1];
	
	  if ((tickMin <= 0) && (0 <= tickMax)) {
	
	    var refGroup = Axis.node.selectAll(".tick:not(." + obj.prefix + "minor)"),
	        refLine = refGroup.select("line");
	
	    // zero line
	    var zeroLine = node.append("line")
	      .style("shape-rendering", "crispEdges")
	      .attr("class", obj.prefix + "zero-line");
	
	    var transform = [0, 0];
	
	    transform[0] += d3.transform(node.select("." + obj.prefix + axisType).attr("transform")).translate[0];
	    transform[1] += d3.transform(node.select("." + obj.prefix + axisType).attr("transform")).translate[1];
	    transform[0] += d3.transform(refGroup.attr("transform")).translate[0];
	    transform[1] += d3.transform(refGroup.attr("transform")).translate[1];
	
	    if (axisType === "xAxis") {
	
	      zeroLine.attr({
	        "y1": refLine.attr("y1"),
	        "y2": refLine.attr("y2"),
	        "x1": 0,
	        "x2": 0,
	        "transform": "translate(" + transform[0] + "," + transform[1] + ")"
	      });
	
	    } else if (axisType === "yAxis") {
	
	      zeroLine.attr({
	        "x1": refLine.attr("x1"),
	        "x2": refLine.attr("x2"),
	        "y1": 0,
	        "y2": 0,
	        "transform": "translate(" + transform[0] + "," + transform[1] + ")"
	      });
	
	    }
	
	    refLine.style("display", "none");
	
	  }
	
	}
	
	module.exports = {
	  AxisFactory: AxisFactory,
	  axisManager: axisManager,
	  determineFormat: determineFormat,
	  appendXAxis: appendXAxis,
	  appendYAxis: appendYAxis,
	  drawYAxis: drawYAxis,
	  timeAxis: timeAxis,
	  discreteAxis: discreteAxis,
	  ordinalTimeAxis: ordinalTimeAxis,
	  setTickFormatX: setTickFormatX,
	  setTickFormatY: setTickFormatY,
	  updateTextX: updateTextX,
	  updateTextY: updateTextY,
	  repositionTextY: repositionTextY,
	  newTextNode: newTextNode,
	  dropTicks: dropTicks,
	  dropOversetTicks: dropOversetTicks,
	  dropRedundantTicks: dropRedundantTicks,
	  tickFinderX: tickFinderX,
	  tickFinderY: tickFinderY,
	  axisCleanup: axisCleanup,
	  addZeroLine: addZeroLine
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	function scaleManager(obj, axisType) {
	
	  var axis = obj[axisType],
	      scaleObj = new ScaleObj(obj, axis, axisType);
	
	  var scale = setScaleType(scaleObj.type);
	
	  scale.domain(scaleObj.domain);
	
	  setRangeArgs(scale, scaleObj);
	
	  if (axis.nice) { niceify(scale, axisType, scaleObj); }
	  if (axis.rescale) { rescale(scale, axisType, axis); }
	
	  return {
	    obj: scaleObj,
	    scale: scale
	  };
	
	}
	
	function ScaleObj(obj, axis, axisType) {
	  this.type = axis.scale;
	  this.domain = setDomain(obj, axis);
	  this.rangeType = setRangeType(axis);
	  this.range = setRange(obj, axisType);
	  this.bands = obj.dimensions.bands;
	  this.rangePoints = axis.rangePoints || 1.0;
	}
	
	function setScaleType(type) {
	
	  var scaleType;
	
	  switch (type) {
	    case "time":
	      scaleType = d3.time.scale();
	      break;
	    case "ordinal":
	    case "ordinal-time":
	      scaleType = d3.scale.ordinal();
	      break;
	    case "linear":
	      scaleType = d3.scale.linear();
	      break;
	    case "identity":
	      scaleType = d3.scale.identity();
	      break;
	    case "pow":
	      scaleType = d3.scale.pow();
	      break;
	    case "sqrt":
	      scaleType = d3.scale.sqrt();
	      break;
	    case "log":
	      scaleType = d3.scale.log();
	      break;
	    case "quantize":
	      scaleType = d3.scale.quantize();
	      break;
	    case "quantile":
	      scaleType = d3.scale.quantile();
	      break;
	    case "threshold":
	      scaleType = d3.scale.threshold();
	      break;
	    default:
	      scaleType = d3.scale.linear();
	      break;
	  }
	
	  return scaleType;
	
	}
	
	function setRangeType(axis) {
	
	  var type;
	
	  switch(axis.scale) {
	    case "time":
	    case "linear":
	      type = "range";
	      break;
	    case "ordinal":
	    case "discrete":
	      type = "rangeRoundBands";
	      break;
	    case "ordinal-time":
	      type = "rangePoints";
	      break;
	    default:
	      type = "range";
	      break;
	  }
	
	  return type;
	
	}
	
	function setRange(obj, axisType) {
	
	  var range;
	
	  if (axisType === "xAxis") {
	    range = [0, obj.dimensions.tickWidth()]; // operating on width
	  } else if (axisType === "yAxis") {
	    range = [obj.dimensions.yAxisHeight(), 0]; // operating on height
	  }
	
	  return range;
	
	}
	
	function setRangeArgs(scale, scaleObj) {
	
	  switch (scaleObj.rangeType) {
	    case "range":
	      return scale[scaleObj.rangeType](scaleObj.range);
	    case "rangeRoundBands":
	      return scale[scaleObj.rangeType](scaleObj.range, scaleObj.bands.padding, scaleObj.bands.outerPadding);
	    case "rangePoints":
	      return scale[scaleObj.rangeType](scaleObj.range, scaleObj.rangePoints);
	  }
	
	}
	
	function setDomain(obj, axis) {
	
	  var data = obj.data;
	  var domain;
	
	  // included fallbacks just in case
	  switch(axis.scale) {
	    case "time":
	      domain = setDateDomain(data, axis.min, axis.max);
	      break;
	    case "linear":
	      var chartType = obj.options.type,
	          forceMaxVal,
	          useDataMinimum;
	      if (chartType === "area" || chartType === "column" || chartType === "bar") {
	        forceMaxVal = true;
	      }
	      if (chartType === "sparkline") {
	        useDataMinimum = true;
	      }
	      domain = setNumericalDomain(data, axis.min, axis.max, obj.options.stacked, forceMaxVal, useDataMinimum);
	      break;
	    case "ordinal":
	    case "ordinal-time":
	      domain = setDiscreteDomain(data);
	      break;
	  }
	
	  return domain;
	
	}
	
	function setDateDomain(data, min, max) {
	  if (min && max) {
	    var startDate = min, endDate = max;
	  } else {
	    var dateRange = d3.extent(data.data, function(d) { return d.key; });
	    var startDate = min || new Date(dateRange[0]),
	        endDate = max || new Date(dateRange[1]);
	  }
	  return [startDate, endDate];
	}
	
	function setNumericalDomain(data, min, max, stacked, forceMaxVal, useDataMinimum) {
	
	  var minVal, maxVal;
	  var mArr = [];
	
	  d3.map(data.data, function(d) {
	    for (var j = 0; j < d.series.length; j++) {
	      mArr.push(Number(d.series[j].val));
	    }
	  });
	
	  if (stacked) {
	    maxVal = d3.max(data.stackedData[data.stackedData.length - 1], function(d) {
	      return (d.y0 + d.y);
	    });
	  } else {
	    maxVal = d3.max(mArr);
	  }
	
	  minVal = d3.min(mArr);
	
	  if (min) {
	    minVal = min;
	  } else if (useDataMinimum) {
	    minVal = d3.min(mArr);
	  } else if (minVal > 0) {
	    minVal = 0;
	  }
	
	  if (max) {
	    maxVal = max;
	  } else if (maxVal < 0 && forceMaxVal) {
	    maxVal = 0;
	  }
	
	  return [minVal, maxVal];
	
	}
	
	function setDiscreteDomain(data) {
	  return data.data.map(function(d) { return d.key; });
	}
	
	function rescale(scale, axisType, axisObj) {
	
	  switch(axisObj.scale) {
	    case "linear":
	      if (!axisObj.max) { rescaleNumerical(scale, axisObj); }
	      break;
	  }
	}
	
	function rescaleNumerical(scale, axisObj) {
	
	  // rescales the "top" end of the domain
	  var ticks = scale.ticks(10).slice(),
	      tickIncr = Math.abs(ticks[ticks.length - 1]) - Math.abs(ticks[ticks.length - 2]);
	
	  var newMax = ticks[ticks.length - 1] + tickIncr;
	
	  scale.domain([scale.domain()[0], newMax]);
	
	}
	
	function niceify(scale, axisType, scaleObj) {
	
	  switch(scaleObj.type) {
	    case "time":
	      var timeDiff = __webpack_require__(4).timeDiff;
	      var context = timeDiff(scale.domain()[0], scale.domain()[1], 3);
	      niceifyTime(scale, context);
	      break;
	    case "linear":
	      niceifyNumerical(scale);
	      break;
	  }
	
	}
	
	function niceifyTime(scale, context) {
	  var getTimeInterval = __webpack_require__(4).timeInterval;
	  var timeInterval = getTimeInterval(context);
	  scale.domain(scale.domain()).nice(timeInterval);
	}
	
	function niceifyNumerical(scale) {
	  scale.domain(scale.domain()).nice();
	}
	
	module.exports = {
	  scaleManager: scaleManager,
	  ScaleObj: ScaleObj,
	  setScaleType: setScaleType,
	  setRangeType: setRangeType,
	  setRangeArgs: setRangeArgs,
	  setRange: setRange,
	  setDomain: setDomain,
	  setDateDomain: setDateDomain,
	  setNumericalDomain: setNumericalDomain,
	  setDiscreteDomain: setDiscreteDomain,
	  rescale: rescale,
	  rescaleNumerical: rescaleNumerical,
	  niceify: niceify,
	  niceifyTime: niceifyTime,
	  niceifyNumerical: niceifyNumerical
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	function MultiLineChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  // Secondary array is used to store a reference to all series except for the highlighted item
	  var secondaryArr = [];
	
	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines
	
	    if (i !== obj.seriesHighlight()) {
	
	      var line = d3.svg.line().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y(function(d) { return yScale(d.series[i].val); });
	
	      var pathRef = seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": line,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "multiline " + obj.prefix + "multiline-" + (i);
	            return output;
	          }
	        });
	
	      secondaryArr.push(pathRef);
	    }
	
	  }
	
	  // Loop through all the secondary series (all series except the highlighted one)
	  // and set the colours in the correct order
	
	  var secondaryArr = secondaryArr.reverse();
	
	  var hLine = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "multiline " + obj.prefix + "multiline-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      },
	      "d": hLine
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    line: line
	  };
	
	};
	
	module.exports = MultiLineChart;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	function SparklineChart(node, obj) {
	
	  var scaleModule = __webpack_require__(17),
	      Scale = scaleModule.scaleManager;
	
	  // reset yAxisPaddingRight since we won't have a yAxis
	  obj.dimensions.yAxisPaddingRight = 0;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  var dotRadius = 5;
	
	  xScale.range([dotRadius, xScale.range()[1] - dotRadius]);
	
	  var sparkline = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[0].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y(function(d) { return yScale(d.series[0].val); });
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() { return obj.prefix + "series_group"; });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "class": function() {
	        var output = obj.prefix + obj.options.type + " " + obj.prefix + obj.options.type + "-0 " + obj.prefix + "highlight";
	        return output;
	      },
	      "d": sparkline
	    });
	
	  seriesGroup.append("line")
	    .attr({
	      "class": obj.prefix + "zero-line",
	      "x1": xScale(obj.data.data[0].key),
	      "x2": xScale(obj.data.data[obj.data.data.length - 1].key),
	      "y1": yScale(obj.data.data[0].series[0].val),
	      "y2": yScale(obj.data.data[0].series[0].val)
	    });
	
	  // debugger;
	
	  var dotGroup = node.append("g")
	    .attr("class", function() {
	      return obj.prefix + "dot-group";
	    });
	
	  var dotScale = new Scale(obj, "xAxis").scale;
	
	  // need to handle dots near top or bottom. maybe create a dotRadius-
	  // wide bounding box within the group for the chart?
	
	  var firstLast = dotGroup.selectAll("circle")
	    .data([obj.data.data[0], obj.data.data[obj.data.data.length - 1]]);
	
	  firstLast.enter().append("circle")
	    .attr({
	      "cx": function(d, i) {
	        var symbol = (i === 0) ? 1 : -1;
	        return dotScale(d.key) + (dotRadius * symbol);
	      },
	      "cy": function(d) { return yScale(d.series[0].val) },
	      "r": dotRadius
	    });
	
	  var dateFormatter = __webpack_require__(4).dateFormatter,
	      timeDiff = __webpack_require__(4).timeDiff,
	      setTextFormat = __webpack_require__(16).setTickFormatY;
	
	  var ctx = timeDiff(dotScale.domain()[0], dotScale.domain()[dotScale.domain().length - 1], 8);
	
	  var text = firstLast.enter().append("text")
	    .style("text-anchor", function(d, i) {
	      return (i === 0) ? "start" : "end";
	    });
	
	  text.append("tspan")
	    .attr({
	      "x": function(d) { return dotScale(d.key); },
	      "y": function(d) { return yScale(d.series[0].val); },
	      "dy": "0em",
	      "class": obj.prefix + "text_date"
	    })
	    .call(dateFormatter, ctx, obj.monthsAbr);
	
	  text.append("tspan")
	    .attr({
	      "x": function(d) { return dotScale(d.key); },
	      "y": function(d, i) { return yScale(d.series[0].val); },
	      "dy": "1em",
	      "class": obj.prefix + "text_value"
	    })
	    .text(function(d) {
	      var axis = obj.yAxis,
	          formatted = setTextFormat(axis.format, d.series[0].val);
	      return ((axis.prefix || "") + formatted + (axis.suffix || ""));
	    });
	
	  var lineHeight;
	
	  text.selectAll("tspan")
	    .attr("y", function(d) {
	      var lineHeight = 26;
	      var yPos = yScale(d.series[0].val),
	          yShift = dotRadius;
	      if (yPos / yScale.range()[0] < 0.5) {
	        console.log("above");
	        return yScale(d.series[0].val) + lineHeight;
	      } else {
	        console.log("below");
	        return yScale(d.series[0].val) - lineHeight;
	      }
	
	      // if (yPos / yScale.range()[0] < 0.5) { yShift = yShift * -1; lineHeight * -1; }
	      // return yScale(d.series[0].val) + lineHeight;
	      // return yScale(d.series[0].val);
	    });
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    seriesGroup: seriesGroup,
	    dotGroup: dotGroup,
	    sparkline: sparkline
	  };
	
	};
	
	module.exports = SparklineChart;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	function AreaChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  // wha?
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  // Secondary array is used to store a reference to all series except for the highlighted item
	  var secondaryArr = [];
	
	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines
	
	    if (i !== obj.seriesHighlight()) {
	
	      var area = d3.svg.area().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y0(yScale(0))
	        .y1(function(d) { return yScale(d.series[i].val); });
	
	      var line = d3.svg.line().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y(function(d) { return yScale(d.series[i].val); });
	
	      var pathRef = seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": area,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "fill " + obj.prefix + "fill-" + (i);
	            return output;
	          }
	        });
	
	      seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": line,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "line " + obj.prefix + "line-" + (i);
	            return output;
	          }
	        });
	
	      secondaryArr.push(pathRef);
	    }
	
	  }
	
	  // Loop through all the secondary series (all series except the highlighted one)
	  // and set the colours in the correct order
	
	  var secondaryArr = secondaryArr.reverse();
	
	  var hArea = d3.svg.area().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y0(yScale(0))
	    .y1(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  var hLine = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "d": hArea,
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "fill " + obj.prefix + "fill-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      }
	    });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "d": hLine,
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "line " + obj.prefix + "line-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      }
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    hArea: hArea,
	    line: line,
	    area: area
	  };
	
	};
	
	module.exports = AreaChart;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	function StackedAreaChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  // wha?
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  node.classed(obj.prefix + "stacked", true);
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
	    .data(obj.data.stackedData)
	    .enter().append("svg:g")
	    .attr({
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function(d, i) {
	        var output = obj.prefix + "series " + obj.prefix + "series_" + (i);
	        if (i === obj.seriesHighlight()) {
	          output = obj.prefix + "series " + obj.prefix + "series_" + (i) + " " + obj.prefix + "highlight";
	        }
	        return output;
	      }
	    });
	
	  var area = d3.svg.area().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.y0 + d.y); })
	    .x(function(d) { return xScale(d.x); })
	    .y0(function(d) { return yScale(d.y0); })
	    .y1(function(d) { return yScale(d.y0 + d.y); });
	
	  var line = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.y0 + d.y); })
	    .x(function(d) { return xScale(d.x); })
	    .y(function(d) { return yScale(d.y0 + d.y); });
	
	  series.append("path")
	    .attr("class", function(d, i) {
	      var output = obj.prefix + "fill " + obj.prefix + "fill-" + (i);
	      if (i === obj.seriesHighlight()) {
	        output = obj.prefix + "fill " + obj.prefix + "fill-" + (i) + " " + obj.prefix + "highlight";
	      }
	      return output;
	    })
	    .attr("d", area);
	
	  series.append("path")
	    .attr("class", function(d, i) { return obj.prefix + "line " + obj.prefix + "line-" + (i); })
	    .attr("d", line);
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    line: line,
	    area: area
	  };
	
	};
	
	module.exports = StackedAreaChart;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	function ColumnChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  switch (obj.xAxis.scale) {
	    case "time":
	
	      var timeInterval = __webpack_require__(4).timeInterval,
	          timeElapsed = timeInterval(obj.data.data) + 1;
	      var singleColumn = obj.dimensions.tickWidth() / timeElapsed / obj.data.seriesAmount;
	
	      xAxisObj.range = [0, (obj.dimensions.tickWidth() - (singleColumn * obj.data.seriesAmount))];
	
	      axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	      break;
	    case "ordinal-time":
	
	      var singleColumn = xScale(obj.data.data[1].key) - xScale(obj.data.data[0].key);
	
	      node.select("." + obj.prefix + "axis-group." + obj.prefix + "xAxis")
	        .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	      break;
	    case "ordinal":
	      var singleColumn = xScale.rangeBand() / obj.data.seriesAmount;
	      break;
	  }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'multiple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    })
	    .attr("transform", function() {
	      var xOffset;
	      if (obj.xAxis.scale === "ordinal-time") {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2);
	      } else {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth();
	      }
	      return "translate(" + xOffset + ",0)";
	    });
	
	  for (var i = 0; i < obj.data.seriesAmount; i++) {
	
	    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);
	
	    var columnItem = series
	      .selectAll("." + obj.prefix + "column")
	      .data(obj.data.data).enter()
	      .append("g")
	      .attr({
	        "class": obj.prefix + "column " + obj.prefix + "column-" + (i),
	        "data-series": i,
	        "data-key": function(d) { return d.key; },
	        "data-legend": function() { return obj.data.keys[i + 1]; },
	        "transform": function(d) {
	          if (obj.xAxis.scale !== "ordinal-time") {
	            return "translate(" + xScale(d.key) + ",0)";
	          }
	        }
	      });
	
	    columnItem.append("rect")
	      .attr({
	        "class": function(d) {
	          return d.series[i].val < 0 ? "negative" : "positive";
	        },
	        "x": function(d) {
	          if (obj.xAxis.scale !== "ordinal-time") {
	            return i * singleColumn;
	          } else {
	            return xScale(d.key)
	          }
	        },
	        "y": function(d) {
	          if (d.series[i].val !== "__undefined__") {
	            return yScale(Math.max(0, d.series[i].val));
	          }
	        },
	        "height": function(d) {
	          if (d.series[i].val !== "__undefined__") {
	            return Math.abs(yScale(d.series[i].val) - yScale(0));
	          }
	        },
	        "width": function() {
	          if (obj.xAxis.scale !== "ordinal-time") {
	            return singleColumn;
	          } else {
	            return singleColumn / obj.data.seriesAmount;
	          }
	        }
	      });
	
	    if (obj.data.seriesAmount > 1) {
	
	      var columnOffset = obj.dimensions.bands.offset;
	
	      columnItem.selectAll("rect")
	        .attr({
	          "x": function(d) {
	            if (obj.xAxis.scale !== "ordinal-time") {
	              return ((i * singleColumn) + (singleColumn * (columnOffset / 2)));
	            } else {
	              return xScale(d.key) + (i * (singleColumn / obj.data.seriesAmount));
	            }
	          },
	          "width": function() {
	            if (obj.xAxis.scale !== "ordinal-time") {
	              return (singleColumn - (singleColumn * columnOffset));
	            } else {
	              return singleColumn / obj.data.seriesAmount;
	            }
	          }
	        });
	    }
	
	  }
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    singleColumn: singleColumn,
	    columnItem: columnItem
	  };
	
	}
	
	module.exports = ColumnChart;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	function BarChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	    scaleModule = __webpack_require__(17),
	    Scale = scaleModule.scaleManager;
	
	  // because the elements will be appended in reverse due to the
	  // bar chart operating on the y-axis, need to reverse the dataset.
	  obj.data.data.reverse();
	
	  var xAxisSettings;
	
	  if (obj.exportable && obj.exportable.x_axis) {
	    var extend = __webpack_require__(8).extend;
	    xAxisSettings = extend(obj.xAxis, obj.exportable.x_axis);
	  } else {
	    xAxisSettings = obj.xAxis;
	  }
	
	  var xScaleObj = new Scale(obj, "xAxis"),
	      xScale = xScaleObj.scale;
	
	  var xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");
	
	  var xAxisGroup = node.append("g")
	    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + "xAxis")
	    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");
	
	  var xAxisNode = xAxisGroup.append("g")
	    .attr("class", obj.prefix + "x-axis")
	    .call(xAxis);
	
	  var textLengths = [];
	
	  xAxisNode.selectAll("text")
	    .attr("y", xAxisSettings.barOffset)
	    .each(function() {
	      textLengths.push(d3.select(this).node().getBoundingClientRect().height);
	    });
	
	  var tallestText = textLengths.reduce(function(a, b) { return (a > b ? a : b) });
	
	  obj.dimensions.xAxisHeight = tallestText + xAxisSettings.barOffset;
	
	  xAxisNode.selectAll("g")
	    .filter(function(d) { return d; })
	    .classed(obj.prefix + "minor", true);
	
	  //  scales
	  var yScaleObj = new Scale(obj, "yAxis"),
	      yScale = yScaleObj.scale;
	
	  // need this for fixed-height bars
	  if (!obj.exportable || (obj.exportable && !obj.exportable.dynamicHeight)) {
	    var totalBarHeight = (obj.dimensions.barHeight * obj.data.data.length * obj.data.seriesAmount);
	    yScale.rangeRoundBands([totalBarHeight, 0], obj.dimensions.bands.padding, obj.dimensions.bands.outerPadding);
	    obj.dimensions.yAxisHeight = totalBarHeight - (totalBarHeight * obj.dimensions.bands.outerPadding * 2);
	  }
	
	  var yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left");
	
	  var yAxisGroup = node.append("g")
	    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + "yAxis")
	    .attr("transform", "translate(0,0)");
	
	  var yAxisNode = yAxisGroup.append("g")
	    .attr("class", obj.prefix + "y-axis")
	    .call(yAxis);
	
	  yAxisNode.selectAll("line").remove();
	  yAxisNode.selectAll("text").attr("x", 0);
	
	  if (obj.dimensions.width > obj.yAxis.widthThreshold) {
	    var maxLabelWidth = obj.dimensions.computedWidth() / 3.5;
	  } else {
	    var maxLabelWidth = obj.dimensions.computedWidth() / 3;
	  }
	
	  if (yAxisNode.node().getBBox().width > maxLabelWidth) {
	    var wrapText = __webpack_require__(4).wrapText;
	    yAxisNode.selectAll("text")
	      .call(wrapText, maxLabelWidth)
	      .each(function() {
	        var tspans = d3.select(this).selectAll("tspan"),
	            tspanCount = tspans[0].length,
	            textHeight = d3.select(this).node().getBBox().height;
	        if (tspanCount > 1) {
	          tspans
	            .attr({
	              "y": ((textHeight / tspanCount) / 2) - (textHeight / 2)
	            });
	        }
	      });
	  }
	
	  obj.dimensions.labelWidth = yAxisNode.node().getBBox().width;
	
	  yAxisGroup.attr("transform", "translate(" + obj.dimensions.labelWidth + ",0)");
	
	  var tickFinderX = axisModule.tickFinderY;
	
	  if (obj.xAxis.widthThreshold > obj.dimensions.width) {
	    var xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 6 };
	  } else {
	    var xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 4 };
	  }
	
	  var ticks = tickFinderX(xScale, obj.xAxis.ticks, xAxisTickSettings);
	
	  xScale.range([0, obj.dimensions.tickWidth()]);
	
	  xAxis.tickValues(ticks);
	
	  xAxisNode.call(xAxis);
	
	  xAxisNode.selectAll(".tick text")
	    .attr("y", xAxisSettings.barOffset)
	    .call(axisModule.updateTextX, xAxisNode, obj, xAxis, obj.xAxis);
	
	  if (obj.exportable && obj.exportable.dynamicHeight) {
	    // working with a dynamic bar height
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + obj.dimensions.computedHeight() + ")");
	  } else {
	    // working with a fixed bar height
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + totalBarHeight + ")");
	  }
	
	  var xAxisWidth = d3.transform(xAxisGroup.attr("transform")).translate[0] + xAxisGroup.node().getBBox().width;
	
	  if (xAxisWidth > obj.dimensions.computedWidth()) {
	
	    xScale.range([0, obj.dimensions.tickWidth() - (xAxisWidth - obj.dimensions.computedWidth())]);
	
	    xAxisNode.call(xAxis);
	
	    xAxisNode.selectAll(".tick text")
	      .attr("y", xAxisSettings.barOffset)
	      .call(axisModule.updateTextX, xAxisNode, obj, xAxis, obj.xAxis);
	
	  }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    })
	    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");
	
	  var singleBar = yScale.rangeBand() / obj.data.seriesAmount;
	
	  for (var i = 0; i < obj.data.seriesAmount; i++) {
	
	    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);
	
	    var barItem = series
	      .selectAll("." + obj.prefix + "bar")
	      .data(obj.data.data).enter()
	      .append("g")
	      .attr({
	        "class": obj.prefix + "bar " + obj.prefix + "bar-" + (i),
	        "data-series": i,
	        "data-key": function(d) { return d.key; },
	        "data-legend": function() { return obj.data.keys[i + 1]; },
	        "transform": function(d) {
	          return "translate(0," + yScale(d.key) + ")";
	        }
	      });
	
	    barItem.append("rect")
	      .attr({
	        "class": function(d) {
	          return d.series[i].val < 0 ? "negative" : "positive";
	        },
	        "x": function(d) {
	          return xScale(Math.min(0, d.series[i].val));
	        },
	        "y": function() {
	          return i * singleBar;
	        },
	        "width": function(d) {
	          return Math.abs(xScale(d.series[i].val) - xScale(0));
	        },
	        "height": function(d) { return singleBar; }
	      });
	
	    if (obj.data.seriesAmount > 1) {
	      var barOffset = obj.dimensions.bands.offset;
	      barItem.selectAll("rect")
	        .attr({
	          "y": function() {
	            return ((i * singleBar) + (singleBar * (barOffset / 2)));
	          },
	          "height": singleBar - (singleBar * barOffset)
	        });
	    }
	
	  }
	
	  xAxisNode.selectAll("g")
	    .filter(function(d) { return d; })
	    .classed(obj.prefix + "minor", true);
	
	  xAxisNode.selectAll("line")
	    .attr({
	      "y1": function() {
	        if (obj.exportable && obj.exportable.dynamicHeight) {
	          // dynamic height, so calculate where the y1 should go
	          return -(obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight);
	        } else {
	          // fixed height, so use that
	          return -(totalBarHeight);
	        }
	      },
	      "y2": 0
	  });
	
	  if (obj.exportable && obj.exportable.dynamicHeight) {
	
	    // dynamic height, only need to transform x-axis group
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	  } else {
	
	    // fixed height, so transform accordingly and modify the dimension function and parent rects
	
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + totalBarHeight + ")");
	
	    obj.dimensions.totalXAxisHeight = xAxisGroup.node().getBoundingClientRect().height;
	
	    obj.dimensions.computedHeight = function() { return this.totalXAxisHeight; };
	
	    d3.select(node.node().parentNode)
	      .attr("height", function() {
	        var margin = obj.dimensions.margin;
	        return obj.dimensions.computedHeight() + margin.top + margin.bottom;
	      });
	
	    d3.select(node.node().parentNode).select("." + obj.prefix + "bg")
	      .attr({
	        "height": obj.dimensions.computedHeight()
	      });
	
	  }
	
	  var xAxisObj = { node: xAxisGroup, axis: xAxis },
	      yAxisObj = { node: yAxisGroup, axis: yAxis };
	
	  var axisModule = __webpack_require__(16);
	
	  axisModule.addZeroLine(obj, node, xAxisObj, "xAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    singleBar: singleBar,
	    barItem: barItem
	  };
	
	}
	
	module.exports = BarChart;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	function StackedColumnChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var yScaleObj = new Scale(obj, "yAxis"),
	      xScaleObj = new Scale(obj, "xAxis"),
	      yScale = yScaleObj.scale,
	      xScale = xScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  switch (obj.xAxis.scale) {
	    case "time":
	
	      var timeInterval = __webpack_require__(4).timeInterval,
	          timeElapsed = timeInterval(obj.data.data);
	      var singleColumn = obj.dimensions.tickWidth() / timeElapsed;
	
	      xAxisObj.range = [0, (obj.dimensions.tickWidth() - singleColumn)];
	
	      axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	      break;
	    case "ordinal-time":
	
	      var singleColumn = xScale(obj.data.data[1].key) - xScale(obj.data.data[0].key);
	
	      node.select("." + obj.prefix + "axis-group." + obj.prefix + "xAxis")
	        .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	      break;
	    case "ordinal":
	      var singleColumn = xScale.rangeBand();
	      break;
	  }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    })
	    .attr("transform", function() {
	      var xOffset;
	      if (obj.xAxis.scale === "ordinal-time") {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2);
	      } else {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth();
	      }
	      return "translate(" + xOffset + ",0)";
	    })
	
	  // Add a group for each
	  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
	    .data(obj.data.stackedData)
	    .enter().append("g")
	    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i); });
	
	  // Add a rect for each data point.
	  var rect = series.selectAll("rect")
	    .data(function(d) { return d; })
	    .enter().append("rect")
	    .attr({
	      "class": obj.prefix + "column",
	      "data-key": function(d) { return d.x; },
	      "data-legend": function(d) { return d.legend; },
	      "x": function(d) { return xScale(d.x); },
	      "y": function(d) { return yScale(Math.max(0, d.y0 + d.y)); },
	      "height": function(d) { return Math.abs(yScale(d.y) - yScale(0)); },
	      "width": singleColumn
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    rect: rect
	  };
	
	}
	
	module.exports = StackedColumnChart;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	function StreamgraphChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  var seriesGroup = node.append("g")
	    .attr({
	      "class": obj.prefix + "series_group",
	      "transform": function() {
	        return "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"
	    }});
	
	  // Add a group for each cause.
	  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
	    .data(obj.data.stackedData)
	    .enter().append("g")
	    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i); });
	
	  var area = d3.svg.area().interpolate(obj.options.interpolation)
	    .x(function(d) { return xScale(d.x); })
	    .y0(function(d) { return yScale(d.y0); })
	    .y1(function(d) { return yScale(d.y0 + d.y); });
	
	  var line = d3.svg.line().interpolate(obj.options.interpolation)
	    .x(function(d) { return xScale(d.x); })
	    .y(function(d) { return yScale(d.y0 + d.y); });
	
	  series.append("path")
	    .attr("class", function(d, i) {
	      var output = obj.prefix + "stream-series " + obj.prefix + "stream-" + (i);
	      if (i === obj.seriesHighlight()) {
	        output = obj.prefix + "stream-series " + obj.prefix + "stream-" + (i) + " " + obj.prefix + "highlight";
	      }
	      return output;
	    })
	    .attr("d", area);
	
	  series.append("path")
	    .attr("class", function() { return obj.prefix + "stream-series " + obj.prefix + "line"; })
	    .attr("d", line);
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    line: line,
	    area: area
	  };
	
	};
	
	module.exports = StreamgraphChart;


/***/ },
/* 26 */
/***/ function(module, exports) {

	function qualifierComponent(node, obj) {
	
	  if (obj.options.type !== "bar") {
	
	    var yAxisNode = node.select("." + obj.prefix + "yAxis");
	
	    if (obj.editable) {
	
	      var foreignObject = yAxisNode.append("foreignObject")
	        .attr({
	          "class": obj.prefix + "fo " + obj.prefix + "qualifier",
	          "width": "100%"
	        });
	
	      var foreignObjectGroup = foreignObject.append("xhtml:div")
	        .attr("xmlns", "http://www.w3.org/1999/xhtml");
	
	      var qualifierField = foreignObjectGroup.append("div")
	        .attr({
	          "class": obj.prefix + "chart_qualifier editable-chart_qualifier",
	          "contentEditable": true,
	          "xmlns": "http://www.w3.org/1999/xhtml"
	        })
	        .text(obj.qualifier);
	
	      foreignObject
	        .attr({
	          "width": qualifierField.node().getBoundingClientRect().width + 15,
	          "height": qualifierField.node().getBoundingClientRect().height,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + ( - (qualifierField.node().getBoundingClientRect().height) / 2 ) + ")"
	        });
	
	    } else {
	
	      var qualifierBg = yAxisNode.append("text")
	        .attr("class", obj.prefix + "chart_qualifier-text-bg")
	        .text(obj.qualifier)
	        .attr({
	          "dy": "0.32em",
	          "y": "0",
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", 0)"
	        });
	
	      var qualifierText = yAxisNode.append("text")
	        .attr("class", obj.prefix + "chart_qualifier-text")
	        .text(obj.qualifier)
	        .attr({
	          "dy": "0.32em",
	          "y": "0",
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", 0)"
	        });
	
	    }
	
	  }
	
	  return {
	    qualifierBg: qualifierBg,
	    qualifierText: qualifierText
	  };
	
	}
	
	module.exports = qualifierComponent;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Tips handling module.
	 * @module charts/components/tips
	 */
	
	function bisector(data, keyVal, stacked, index) {
	  if (stacked) {
	    var arr = [];
	    var bisect = d3.bisector(function(d) { return d.x; }).left;
	    for (var i = 0; i < data.length; i++) {
	      arr.push(bisect(data[i], keyVal));
	    };
	    return arr;
	  } else {
	    var bisect = d3.bisector(function(d) { return d.key; }).left;
	    return bisect(data, keyVal);
	  }
	}
	
	function cursorPos(overlay) {
	  return {
	    x: d3.mouse(overlay.node())[0],
	    y: d3.mouse(overlay.node())[1]
	  };
	}
	
	function getTipData(obj, cursor) {
	
	  var xScaleObj = obj.rendered.plot.xScaleObj,
	      xScale = xScaleObj.scale,
	      scaleType = xScaleObj.obj.type;
	
	  var xVal;
	
	  if (scaleType === "ordinal-time" || scaleType === "ordinal") {
	
	    var ordinalBisection = d3.bisector(function(d) { return d; }).left,
	        rangePos = ordinalBisection(xScale.range(), cursor.x);
	
	    xVal = xScale.domain()[rangePos];
	
	  } else {
	    xVal = xScale.invert(cursor.x);
	  }
	
	  var tipData;
	
	  if (obj.options.stacked) {
	    var data = obj.data.stackedData;
	    var i = bisector(data, xVal, obj.options.stacked);
	
	    var arr = [],
	        refIndex;
	
	    for (var k = 0; k < data.length; k++) {
	      if (refIndex) {
	        arr.push(data[k][refIndex]);
	      } else {
	        var d0 = data[k][i[k] - 1],
	            d1 = data[k][i[k]];
	        refIndex = xVal - d0.x > d1.x - xVal ? i[k] : (i[k] - 1);
	        arr.push(data[k][refIndex]);
	      }
	    }
	
	    tipData = arr;
	
	  } else {
	    var data = obj.data.data;
	    var i = bisector(data, xVal);
	    var d0 = data[i - 1],
	        d1 = data[i];
	
	    tipData = xVal - d0.key > d1.key - xVal ? d1 : d0;
	  }
	
	  return tipData;
	
	}
	
	function showTips(tipNodes, obj) {
	
	  if (tipNodes.xTipLine) {
	    tipNodes.xTipLine.classed(obj.prefix + "active", true);
	  }
	
	  if (tipNodes.tipBox) {
	    tipNodes.tipBox.classed(obj.prefix + "active", true);
	  }
	
	  if (tipNodes.tipPathCircles) {
	    tipNodes.tipPathCircles.classed(obj.prefix + "active", true);
	  }
	
	}
	
	function hideTips(tipNodes, obj) {
	
	  if (obj.options.type === "column") {
	    if(obj.options.stacked){
	      obj.rendered.plot.series.selectAll("rect").classed(obj.prefix + "muted", false);
	    }
	    else{
	      obj.rendered.plot.columnItem.selectAll("rect").classed(obj.prefix + "muted", false);
	    }
	
	  }
	
	  if (tipNodes.xTipLine) {
	    tipNodes.xTipLine.classed(obj.prefix + "active", false);
	  }
	
	  if (tipNodes.tipBox) {
	    tipNodes.tipBox.classed(obj.prefix + "active", false);
	  }
	
	  if (tipNodes.tipPathCircles) {
	    tipNodes.tipPathCircles.classed(obj.prefix + "active", false);
	  }
	
	}
	
	function mouseIdle(tipNodes, obj) {
	  return setTimeout(function() {
	    hideTips(tipNodes, obj);
	  }, obj.tipTimeout);
	}
	
	var timeout;
	
	function tipsManager(node, obj) {
	
	  var tipNodes = appendTipGroup(node, obj);
	
	  var fns = {
	    line: LineChartTips,
	    multiline: LineChartTips,
	    area: obj.options.stacked ? StackedAreaChartTips : AreaChartTips,
	    column: obj.options.stacked ? StackedColumnChartTips : ColumnChartTips,
	    stream: StreamgraphTips
	  };
	
	  var dataReference;
	
	  if (obj.options.type === "multiline") {
	    dataReference = [obj.data.data[0].series[0]];
	  } else {
	    dataReference = obj.data.data[0].series;
	  }
	
	  var innerTipElements = appendTipElements(node, obj, tipNodes, dataReference);
	
	  switch (obj.options.type) {
	    case "line":
	    case "multiline":
	    case "area":
	    case "stream":
	
	      tipNodes.overlay = tipNodes.tipNode.append("rect")
	        .attr({
	          "class": obj.prefix + "tip_overlay",
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "width": obj.dimensions.tickWidth(),
	          "height": obj.dimensions.computedHeight()
	        });
	
	      tipNodes.overlay
	        .on("mouseover", function() { showTips(tipNodes, obj); })
	        .on("mouseout", function() { hideTips(tipNodes, obj); })
	        .on("mousemove", function() {
	          showTips(tipNodes, obj);
	          clearTimeout(timeout);
	          timeout = mouseIdle(tipNodes, obj);
	          return fns[obj.options.type](tipNodes, innerTipElements, obj);
	        });
	
	      break;
	
	    case "column":
	
	      var columnRects;
	
	      if (obj.options.stacked) {
	        columnRects = obj.rendered.plot.series.selectAll('rect')
	      } else {
	        columnRects = obj.rendered.plot.columnItem.selectAll('rect');
	      }
	
	      columnRects
	        .on("mouseover", function(d) {
	          showTips(tipNodes, obj);
	          clearTimeout(timeout);
	          timeout = mouseIdle(tipNodes, obj);
	          fns.column(tipNodes, obj, d, this);
	        })
	        .on("mouseout", function(d) {
	          hideTips(tipNodes, obj);
	        });
	
	      break;
	  }
	
	}
	
	function appendTipGroup(node, obj) {
	
	  var svgNode = d3.select(node.node().parentNode),
	      chartNode = d3.select(node.node().parentNode.parentNode);
	
	  var tipNode = svgNode.append("g")
	    .attr({
	      "transform": "translate(" + obj.dimensions.margin.left + "," + obj.dimensions.margin.top + ")",
	      "class": obj.prefix + "tip"
	    })
	    .classed(obj.prefix + "tip_stacked", function() {
	      return obj.options.stacked ? true : false;
	    });
	
	  var xTipLine = tipNode.append("g")
	    .attr("class", obj.prefix + "tip_line-x")
	    .classed(obj.prefix + "active", false);
	
	  xTipLine.append("line");
	
	  var tipBox = tipNode.append("g")
	    .attr({
	      "class": obj.prefix + "tip_box",
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"
	    });
	
	  var tipRect = tipBox.append("rect")
	    .attr({
	      "class": obj.prefix + "tip_rect",
	      "transform": "translate(0,0)",
	      "width": 1,
	      "height": 1
	    });
	
	  var tipGroup = tipBox.append("g")
	    .attr("class", obj.prefix + "tip_group");
	
	  var legendIcon = chartNode.select("." + obj.prefix + "legend_item_icon").node();
	
	  if (legendIcon) {
	    var radius = legendIcon.getBoundingClientRect().width / 2;
	  } else {
	    var radius = 0;
	  }
	
	  var tipPathCircles = tipNode.append("g")
	    .attr("class", obj.prefix + "tip_path-circle-group");
	
	  var tipTextDate = tipGroup
	    .insert("g", ":first-child")
	    .attr("class", obj.prefix + "tip_text-date-group")
	    .append("text")
	    .attr({
	      "class": obj.prefix + "tip_text-date",
	      "x": 0,
	      "y": 0,
	      "dy": "1em"
	    });
	
	  return {
	    svg: svgNode,
	    tipNode: tipNode,
	    xTipLine: xTipLine,
	    tipBox: tipBox,
	    tipRect: tipRect,
	    tipGroup: tipGroup,
	    legendIcon: legendIcon,
	    tipPathCircles: tipPathCircles,
	    radius: radius,
	    tipTextDate: tipTextDate
	  };
	
	}
	
	function appendTipElements(node, obj, tipNodes, dataRef) {
	
	  var tipTextGroupContainer = tipNodes.tipGroup
	    .append("g")
	    .attr("class", function() {
	      return obj.prefix + "tip_text-group-container";
	    });
	
	  var tipTextGroups = tipTextGroupContainer
	    .selectAll("." + obj.prefix + "tip_text-group")
	    .data(dataRef)
	    .enter()
	    .append("g")
	    .attr("class", function(d, i) {
	      return obj.prefix + "tip_text-group " + obj.prefix + "tip_text-group-" + (i);
	    });
	
	  var lineHeight;
	
	  tipTextGroups.append("text")
	    .text(function(d) { return d.val; })
	    .attr({
	      "class": function(d, i) {
	        return (obj.prefix + "tip_text " + obj.prefix + "tip_text-" + (i));
	      },
	      "data-series": function(d, i) { return d.key; },
	      "x": function() {
	        return (tipNodes.radius * 2) + (tipNodes.radius / 1.5);
	      },
	      "y": function(d, i) {
	        lineHeight = lineHeight || parseInt(d3.select(this).style("line-height"));
	        return (i + 1) * lineHeight;
	      },
	      "dy": "1em"
	    });
	
	  tipTextGroups
	    .append("circle")
	    .attr({
	      "class": function(d, i) {
	        return (obj.prefix + "tip_circle " + obj.prefix + "tip_circle-" + (i));
	      },
	      "r": function(d, i) { return tipNodes.radius; },
	      "cx": function() { return tipNodes.radius; },
	      "cy": function(d, i) {
	        return ((i + 1) * lineHeight) + (tipNodes.radius * 1.5);
	      }
	    });
	
	  tipNodes.tipPathCircles
	    .selectAll("circle")
	    .data(dataRef)
	    .enter()
	    .append("circle")
	    .attr({
	      "class": function(d, i) {
	        return (obj.prefix + "tip_path-circle " + obj.prefix + "tip_path-circle-" + (i));
	      },
	      "r": (tipNodes.radius / 2) || 2.5
	    });
	
	  return tipTextGroups;
	
	}
	
	function LineChartTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.series.length; i++) {
	    if (tipData.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff,
	        dateFormatter = __webpack_require__(4).dateFormatter,
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.series)
	      .text(function(d, i) {
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	      });
	
	    tipNodes.tipTextDate
	      .call(dateFormatter, ctx, obj.monthsAbr, tipData.key);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData.series)
	        .classed(obj.prefix + "active", function(d) { return d.val ? true : false; })
	        .attr({
	          "cx": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	          "cy": function(d) {
	            if (d.val) { return obj.rendered.plot.yScaleObj.scale(d.val); }
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function AreaChartTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.series.length; i++) {
	    if (tipData.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff,
	        dateFormatter = __webpack_require__(4).dateFormatter,
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.series)
	      .text(function(d, i) {
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	      });
	
	    tipNodes.tipTextDate
	      .call(dateFormatter, ctx, obj.monthsAbr, tipData.key);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData.series)
	        .classed(obj.prefix + "active", function(d) { return d.val ? true : false; })
	        .attr({
	          "cx": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	          "cy": function(d) {
	            if (d.val) { return obj.rendered.plot.yScaleObj.scale(d.val); }
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function StackedAreaChartTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.length; i++) {
	    if (tipData[i].y === NaN || tipData[i].y0 === NaN) {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff,
	        dateFormatter = __webpack_require__(4).dateFormatter,
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        var text;
	
	        for (var k = 0; k < tipData.length; k++) {
	          if (i === 0) {
	            if (d.raw.series[i].val !== "__undefined__") {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          } else if (k === i) {
	            var hasUndefined = 0;
	            for (var j = 0; j < i; j++) {
	              if (d.raw.series[j].val === "__undefined__") {
	                hasUndefined++;
	                break;
	              }
	            }
	            if (!hasUndefined && (d.raw.series[i].val !== "__undefined__")) {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          }
	        }
	        return text;
	      });
	
	    tipNodes.tipTextDate
	      .call(dateFormatter, ctx, obj.monthsAbr, tipData[0].x);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData)
	      .classed(obj.prefix + "active", function(d, i) {
	        var hasUndefined = 0;
	        for (var j = 0; j < i; j++) {
	          if (d.raw.series[j].val === "__undefined__") {
	            hasUndefined++;
	            break;
	          }
	        }
	        if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	          return true;
	        } else {
	          return false;
	        }
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData)
	        .classed(obj.prefix + "active", function(d, i) {
	          var hasUndefined = 0;
	          for (var j = 0; j < i; j++) {
	            if (d.raw.series[j].val === "__undefined__") {
	              hasUndefined++;
	              break;
	            }
	          }
	          if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	            return true;
	          } else {
	            return false;
	          }
	        })
	        .attr({
	          "cx": function(d) {
	            return obj.rendered.plot.xScaleObj.scale(d.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight
	          },
	          "cy": function(d) {
	            var y = d.y || 0,
	                y0 = d.y0 || 0;
	            return obj.rendered.plot.yScaleObj.scale(y + y0);
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function StreamgraphTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.length; i++) {
	    if (tipData[i].y === NaN || tipData[i].y0 === NaN) {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff,
	        dateFormatter = __webpack_require__(4).dateFormatter,
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        var text;
	
	        for (var k = 0; k < tipData.length; k++) {
	          if (i === 0) {
	            if (d.raw.series[i].val !== "__undefined__") {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          } else if (k === i) {
	            var hasUndefined = 0;
	            for (var j = 0; j < i; j++) {
	              if (d.raw.series[j].val === "__undefined__") {
	                hasUndefined++;
	                break;
	              }
	            }
	            if (!hasUndefined && (d.raw.series[i].val !== "__undefined__")) {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          }
	        }
	        return text;
	      });
	
	    tipNodes.tipTextDate
	      .call(dateFormatter, ctx, obj.monthsAbr, tipData[0].x);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData)
	      .classed(obj.prefix + "active", function(d, i) {
	        var hasUndefined = 0;
	        for (var j = 0; j < i; j++) {
	          if (d.raw.series[j].val === "__undefined__") {
	            hasUndefined++;
	            break;
	          }
	        }
	        if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	          return true;
	        } else {
	          return false;
	        }
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData)
	        .classed(obj.prefix + "active", function(d, i) {
	          var hasUndefined = 0;
	          for (var j = 0; j < i; j++) {
	            if (d.raw.series[j].val === "__undefined__") {
	              hasUndefined++;
	              break;
	            }
	          }
	          if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	            return true;
	          } else {
	            return false;
	          }
	        })
	        .attr({
	          "cx": function(d) {
	            return obj.rendered.plot.xScaleObj.scale(d.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight
	          },
	          "cy": function(d) {
	            var y = d.y || 0,
	                y0 = d.y0 || 0;
	            return obj.rendered.plot.yScaleObj.scale(y + y0);
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function ColumnChartTips(tipNodes, obj, d, thisRef) {
	
	  var columnRects = obj.rendered.plot.columnItem.selectAll('rect'),
	      isUndefined = 0;
	
	  var thisColumn = thisRef,
	      tipData = d;
	
	  for (var i = 0; i < tipData.series.length; i++) {
	    if (tipData.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	      timeDiff = __webpack_require__(4).timeDiff,
	      dateFormatter = __webpack_require__(4).dateFormatter,
	      getTranslateXY = __webpack_require__(4).getTranslateXY,
	      domain = obj.rendered.plot.xScaleObj.scale.domain(),
	      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    var cursorX = getTranslateXY(thisColumn.parentNode);
	
	    columnRects
	      .classed(obj.prefix + 'muted', function () {
	        return (this === thisColumn) ? false : true;
	      });
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.series)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	
	    });
	
	    if(obj.dateFormat !== undefined){
	      tipNodes.tipTextDate
	        .call(dateFormatter, ctx, obj.monthsAbr, tipData.key);
	    }
	    else{
	      tipNodes.tipTextDate
	        .text(tipData.key);
	    }
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	
	          var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	
	          if(x > obj.dimensions.tickWidth() / 2){
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          }
	
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	    showTips(tipNodes, obj);
	
	  }
	
	}
	
	function StackedColumnChartTips(tipNodes, obj, d, thisRef) {
	
	  var columnRects = obj.rendered.plot.series.selectAll('rect'),
	      isUndefined = 0;
	
	  var thisColumnRect = thisRef,
	      tipData = d;
	
	  for (var i = 0; i < tipData.raw.series.length; i++) {
	    if (tipData.raw.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	      timeDiff = __webpack_require__(4).timeDiff,
	      dateFormatter = __webpack_require__(4).dateFormatter,
	      domain = obj.rendered.plot.xScaleObj.scale.domain(),
	      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    var parentEl = d3.select(thisColumnRect.parentNode.parentNode);
	    var refPos = d3.select(thisColumnRect).attr("x");
	
	    var thisColumnKey = '';
	
	    /* Figure out which stack this selected rect is in then loop back through and (un)assign muted class */
	    columnRects.classed(obj.prefix + 'muted',function (d) {
	
	      if(this === thisColumnRect){
	        thisColumnKey = d.raw.key;
	      }
	
	      return (this === thisColumnRect) ? false : true;
	
	    });
	
	    columnRects.classed(obj.prefix + 'muted',function (d) {
	
	      return (d.raw.key === thisColumnKey) ? false : true;
	
	    });
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.raw.series)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	
	    });
	
	    if(obj.dateFormat !== undefined){
	      tipNodes.tipTextDate
	        .call(dateFormatter, ctx, obj.monthsAbr, tipData.key);
	    }
	    else{
	      tipNodes.tipTextDate
	        .text(function() {
	          var d = tipData.raw.key;
	          return d;
	        });
	    }
	
	    tipNodes.tipGroup
	      .append("circle")
	      .attr({
	        "class": function(d, i) {
	          return (obj.prefix + "tip_circle " + obj.prefix + "tip_circle-" + (i));
	        },
	        "r": function(d, i) { return tipNodes.radius; },
	        "cx": function() { return tipNodes.radius; },
	        "cy": function(d, i) {
	          return ( (i + 1) * parseInt(d3.select(this).style("font-size")) * 1.13 + 9);
	        }
	      });
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.raw.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	
	          if (refPos > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	
	        }
	
	      });
	
	  }
	
	}
	
	module.exports = tipsManager;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Social module.
	 * @module charts/components/social
	 */
	
	/*
	This component adds a "social" button to each chart which can be toggled to present the user with social sharing options
	 */
	
	var getThumbnail = __webpack_require__(4).getThumbnailPath;
	
	function socialComponent(node, obj) {
	
		var socialOptions = [];
	
		for (var prop in obj.social) {
			if (obj.social[prop]) {
				switch (obj.social[prop].label) {
					case "Twitter":
						obj.social[prop].url = constructTwitterURL(obj);
						obj.social[prop].popup = true;
						break;
					case "Facebook":
						obj.social[prop].url = constructFacebookURL(obj);
						obj.social[prop].popup = true;
						break;
					case "Email":
						obj.social[prop].url = constructMailURL(obj);
						obj.social[prop].popup = false;
						break;
					case "SMS":
						obj.social[prop].url = constructSMSURL(obj);
						obj.social[prop].popup = false;
						break;
					default:
						console.log('INCORRECT SOCIAL ITEM DEFINITION')
				}
				socialOptions.push(obj.social[prop]);
			}
		}
	
		var chartContainer = d3.select(node);
	
	  var chartMeta = chartContainer.select('.' + obj.prefix + 'chart_meta');
	
	  if (chartMeta.node() === null) {
	    chartMeta = chartContainer
	      .append('div')
	      .attr('class', obj.prefix + 'chart_meta');
	  }
	
		var chartSocialBtn = chartMeta
			.append('div')
			.attr('class', obj.prefix + 'chart_meta_btn')
			.html('share');
	
		var chartSocial = chartContainer
			.append('div')
			.attr('class', obj.prefix + 'chart_social');
	
		var chartSocialCloseBtn = chartSocial
			.append('div')
			.attr('class', obj.prefix + 'chart_social_close')
			.html('&#xd7;');
	
		var chartSocialOptions = chartSocial
			.append('div')
			.attr('class', obj.prefix + 'chart_social_options');
	
		chartSocialOptions
			.append('h3')
			.html('Share this chart:');
	
		chartSocialBtn.on('click', function() {
			chartSocial.classed(obj.prefix + 'active', true);
		});
	
		chartSocialCloseBtn.on('click', function() {
			chartSocial.classed(obj.prefix + 'active', false);
		});
	
		var itemAmount = socialOptions.length;
	
		for(var i = 0; i < itemAmount; i++ ) {
			chartSocialOptions
				.selectAll('.' + obj.prefix + 'social-item')
				.data(socialOptions)
				.enter()
				.append('div')
				.attr('class', obj.prefix + 'social-item').html(function(d) {
					if (!d.popup) {
						return '<a href="' + d.url + '"><img class="' + obj.prefix + 'social-icon" src="' + d.icon + '" title="' + d.label + '"/></a>';
					} else {
						return '<a class="' + obj.prefix + 'js-share" href="' + d.url + '"><img class="' + obj.prefix + 'social-icon" src="' + d.icon + '" title="' + d.label + '"/></a>';
					}
				});
		}
	
	  if (obj.image && obj.image.enable) {
	    chartSocialOptions
	      .append('div')
	      .attr('class', obj.prefix + 'image-url')
	      .attr('contentEditable', 'true')
	      .html(getThumbnail(obj));
	  }
	
		var sharePopup = document.querySelectorAll("." + obj.prefix + "js-share");
	
	  if (sharePopup) {
	    [].forEach.call(sharePopup, function(anchor) {
	      anchor.addEventListener("click", function(e) {
	        e.preventDefault();
	        windowPopup(this.href, 600, 620);
	      });
	    });
	  }
	
		return {
			meta_nav: chartMeta
		};
	
	}
	
	// social popup
	function windowPopup(url, width, height) {
	  // calculate the position of the popup so it’s centered on the screen.
	  var left = (screen.width / 2) - (width / 2),
	      top = (screen.height / 2) - (height / 2);
	  window.open(
	    url,
	    "",
	    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
	  );
	}
	
	function constructFacebookURL(obj){
	  var base = 'https://www.facebook.com/dialog/share?',
	      redirect = obj.social.facebook.redirect,
	      url = 'app_id=' + obj.social.facebook.appID + '&amp;display=popup&amp;title=' + obj.heading + '&amp;description=From%20article' + document.title + '&amp;href=' + window.location.href + '&amp;redirect_uri=' + redirect;
	  if (obj.image && obj.image.enable) {  url += '&amp;picture=' + getThumbnail(obj); }
	  return base + url;
	}
	
	function constructMailURL(obj){
	  var base = 'mailto:?';
	  var thumbnail = (obj.image && obj.image.enable) ? '%0A' + getThumbnail(obj) : "";
	  return base + 'subject=' + obj.heading + '&amp;body=' + obj.heading + thumbnail + '%0Afrom article: ' + document.title + '%0A' + window.location.href;
	}
	
	function constructSMSURL(obj){
	  var base = 'sms:',
	      url = '&body=Check%20out%20this%20chart: ' + obj.heading;
	  if (obj.image && obj.image.enable) {  url += '%20' + getThumbnail(obj); }
	  return base + url;
	}
	
	function constructTwitterURL(obj){
	  var base = 'https://twitter.com/intent/tweet?',
	      hashtag = !!(obj.social.twitter.hashtag) ? '&amp;hashtags=' + obj.social.twitter.hashtag : "",
	      via = !!(obj.social.twitter.via) ? '&amp;via=' + obj.social.twitter.via : "",
	      url = 'url=' + window.location.href  + via + '&amp;text=' + encodeURI(obj.heading) + hashtag;
	  if (obj.image && obj.image.enable) {  url += '%20' + getThumbnail(obj); }
	  return base + url;
	}
	
	module.exports = socialComponent;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Sharing Data module.
	 * @module charts/components/share-data
	 */
	
	/*
	This component adds a "data" button to each chart which can be toggled to present the charts data in a tabular form along with buttons allowing the raw data to be downloaded
	 */
	
	function shareDataComponent(node, obj) {
	
	 	var chartContainer = d3.select(node);
	
	  var chartMeta = chartContainer.select('.' + obj.prefix + 'chart_meta');
	
	  if (chartMeta.node() === null) {
	    chartMeta = chartContainer
	      .append('div')
	      .attr('class', obj.prefix + 'chart_meta');
	  }
	
		var chartDataBtn = chartMeta
			.append('div')
			.attr('class', obj.prefix + 'chart_meta_btn')
			.html('data');
	
		var chartData = chartContainer
			.append('div')
			.attr('class', obj.prefix + 'chart_data');
	
		var chartDataCloseBtn = chartData
			.append('div')
			.attr('class', obj.prefix + 'chart_data_close')
			.html('&#xd7;');
	
		var chartDataTable = chartData
			.append('div')
			.attr('class', obj.prefix + 'chart_data_inner');
	
		chartData
			.append('h2')
			.html(obj.heading);
	
		var chartDataNav = chartData
			.append('div')
			.attr('class', obj.prefix + 'chart_data_nav');
	
		var csvDLBtn = chartDataNav
			.append('a')
			.attr('class', obj.prefix + 'chart_data_btn csv')
			.html('download csv');
	
	  var csvToTable = __webpack_require__(4).csvToTable;
	
		csvToTable(chartDataTable, obj.data.csv);
	
		chartDataBtn.on('click', function() {
			chartData.classed(obj.prefix + 'active', true);
		});
	
		chartDataCloseBtn.on('click', function() {
			chartData.classed(obj.prefix + 'active', false);
		});
	
		csvDLBtn.on('click',function() {
		  var dlData = 'data:text/plain;charset=utf-8,' + encodeURIComponent(obj.data.csv);
		  d3.select(this)
		  	.attr('href', dlData)
		  	.attr('download','data_' + obj.id + '.csv');
		});
	
		return {
			meta_nav: chartMeta,
			data_panel: chartData
		};
	
	}
	
	module.exports = shareDataComponent;


/***/ },
/* 30 */
/***/ function(module, exports) {

	/**
	 * Custom code function that can be invoked to modify chart elements after chart drawing has occurred.
	 * @param  {Object} node         The main container group for the chart.
	 * @param  {Object} chartRecipe  Object that contains settings for the chart.
	 * @param  {Object} rendered     An object containing references to all rendered chart elements, including axes, scales, paths, nodes, and so forth.
	 * @return {Object}              Optional.
	 */
	function custom(node, chartRecipe, rendered) {
	
	  // With this function, you can access all elements of a chart and modify
	  // them at will. For instance: you might want to play with colour
	  // interpolation for a multi-series line chart, or modify the width and position
	  // of the x- and y-axis ticks. With this function, you can do all that!
	
	  // If you can, it's good Chart Tool practice to return references to newly
	  // created nodes and d3 objects so they be accessed later — by a dispatcher
	  // event, for instance.
	  return;
	
	}
	
	module.exports = custom;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjMxN2NhZDJkMGQ3MmIxYzc5NmIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb25maWcvY2hhcnQtc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZS5qc29uIiwid2VicGFjazovLy8uL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29uZmlnL2Vudi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdXRpbHMvZGF0YXBhcnNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy9mYWN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9oZWxwZXJzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9tYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2Zvb3Rlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcGxvdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2xpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2F4aXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NjYWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvbXVsdGlsaW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvc3BhcmtsaW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2NvbHVtbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2Jhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtY29sdW1uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3F1YWxpZmllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvdGlwcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc29jaWFsLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhLmpzIiwid2VicGFjazovLy8uL2N1c3RvbS9jdXN0b20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVMsTUFBTTtBQUNmLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUc7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QTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7Ozs7OztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNiQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBOztBQUVBOzs7Ozs7O0FDcENBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87O0FBRVA7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQXlCLFVBQVUsRUFBRTtBQUNyQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDeEZBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ2xDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ3ZEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEscUNBQW9DLG1DQUFtQyxVQUFVLEVBQUU7O0FBRW5GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUEsMENBQXlDLFFBQVE7QUFDakQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLCtCQUE4QixnQ0FBZ0MsRUFBRTtBQUNoRSx5QkFBd0Isc0JBQXNCLEVBQUU7QUFDaEQseUJBQXdCLGdDQUFnQyxFQUFFOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDJCQUEwQixvREFBb0QsRUFBRTtBQUNoRixxQkFBb0Isc0JBQXNCLEVBQUU7QUFDNUMscUJBQW9CLG9EQUFvRCxFQUFFOztBQUUxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDL0ZBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLDJCQUEwQiw4QkFBOEI7O0FBRXhEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsMEJBQXlCLFVBQVUsRUFBRTtBQUNyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUEsdUNBQXNDLG1DQUFtQzs7QUFFekU7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxJQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJCQUEwQixhQUFhLEVBQUU7O0FBRXpDOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBb0IsUUFBUTs7QUFFNUI7QUFDQSxpQ0FBZ0M7O0FBRWhDLDRFQUEyRSxVQUFVOztBQUVyRjs7QUFFQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsZ0JBQWUsT0FBTzs7QUFFdEI7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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RTs7QUFFRjtBQUNBLGtDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQSxHQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDOUVBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CLGFBQVksT0FBTztBQUNuQixhQUFZLE9BQU87QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx5QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDIzMTdjYWQyZDBkNzJiMWM3OTZiXG4gKiovIiwiLyoqXG4gKiBDaGFydCBUb29sXG4gKiBAYXV0aG9yIEplcmVteSBBZ2l1cyA8amFnaXVzQGdsb2JlYW5kbWFpbC5jb20+XG4gKiBAYXV0aG9yIFRvbSBDYXJkb3NvIDx0Y2FyZG9zb0BnbG9iZWFuZG1haWwuY29tPlxuICogQGF1dGhvciBNaWNoYWVsIFBlcmVpcmEgPG1wZXJlaXJhQGdsb2JlYW5kbWFpbC5jb20+XG4gKiBAc2VlIHtAbGlua30gZm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24uXG4gKiBAc2VlIHtAbGluayBodHRwOi8vd3d3LmdpdGh1Yi5jb20vZ2xvYmVhbmRtYWlsL2NoYXJ0LXRvb2x8Q2hhcnQgVG9vbH1cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbiBDaGFydFRvb2xJbml0KHJvb3QpIHtcblxuICBpZiAocm9vdC5kMykge1xuXG4gICAgdmFyIENoYXJ0VG9vbCA9IChmdW5jdGlvbiBDaGFydFRvb2woKSB7XG5cbiAgICAgIHZhciBjaGFydHMgPSByb290Ll9fY2hhcnR0b29sIHx8IFtdLFxuICAgICAgICAgIGRpc3BhdGNoRnVuY3Rpb25zID0gcm9vdC5fX2NoYXJ0dG9vbGRpc3BhdGNoZXIgfHwgW10sXG4gICAgICAgICAgZHJhd24gPSBbXTtcblxuICAgICAgdmFyIHNldHRpbmdzID0gcmVxdWlyZShcIi4vY29uZmlnL2NoYXJ0LXNldHRpbmdzXCIpLFxuICAgICAgICAgIHV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvdXRpbHNcIik7XG5cbiAgICAgIHZhciBkaXNwYXRjaGVyID0gZDMuZGlzcGF0Y2goXCJzdGFydFwiLCBcImZpbmlzaFwiLCBcInJlZHJhd1wiLCBcIm1vdXNlT3ZlclwiLCBcIm1vdXNlTW92ZVwiLCBcIm1vdXNlT3V0XCIsIFwiY2xpY2tcIik7XG5cbiAgICAgIGZvciAodmFyIHByb3AgaW4gZGlzcGF0Y2hGdW5jdGlvbnMpIHtcbiAgICAgICAgaWYgKGRpc3BhdGNoRnVuY3Rpb25zLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgaWYgKGQzLmtleXMoZGlzcGF0Y2hlcikuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgICAgICBkaXNwYXRjaGVyLm9uKHByb3AsIGRpc3BhdGNoRnVuY3Rpb25zW3Byb3BdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgXCJDaGFydCBUb29sIGRvZXMgbm90IG9mZmVyIGEgZGlzcGF0Y2hlciBvZiB0eXBlICdcIiArIHByb3AgKyBcIicuIEZvciBhdmFpbGFibGUgZGlzcGF0Y2hlciB0eXBlcywgcGxlYXNlIHNlZSB0aGUgQ2hhcnRUb29sLmRpc3BhdGNoKCkgbWV0aG9kLlwiIDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDbGVhcnMgcHJldmlvdXMgaXRlcmF0aW9ucyBvZiBjaGFydCBvYmplY3RzIHN0b3JlZCBpbiBvYmogb3IgdGhlIGRyYXduIGFycmF5LCB0aGVuIHB1bnRzIGNoYXJ0IGNvbnN0cnVjdGlvbiB0byB0aGUgQ2hhcnQgTWFuYWdlci5cbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gY29udGFpbmVyIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29udGFpbmVyJ3Mgc2VsZWN0b3IuXG4gICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgICAgICBUaGUgY2hhcnQgSUQgYW5kIGVtYmVkIGRhdGEuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNoYXJ0KGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgICAgICAgZGlzcGF0Y2hlci5zdGFydChvYmopO1xuXG4gICAgICAgIGRyYXduID0gdXRpbHMuY2xlYXJEcmF3bihkcmF3biwgb2JqKTtcbiAgICAgICAgb2JqID0gdXRpbHMuY2xlYXJPYmoob2JqKTtcbiAgICAgICAgY29udGFpbmVyID0gdXRpbHMuY2xlYXJDaGFydChjb250YWluZXIpO1xuXG4gICAgICAgIHZhciBDaGFydE1hbmFnZXIgPSByZXF1aXJlKFwiLi9jaGFydHMvbWFuYWdlclwiKTtcblxuICAgICAgICBvYmouZGF0YS53aWR0aCA9IHV0aWxzLmdldEJvdW5kaW5nKGNvbnRhaW5lciwgXCJ3aWR0aFwiKTtcbiAgICAgICAgb2JqLmRpc3BhdGNoID0gZGlzcGF0Y2hlcjtcblxuICAgICAgICB2YXIgY2hhcnRPYmo7XG5cbiAgICAgICAgaWYgKHV0aWxzLnN2Z1Rlc3Qocm9vdCkpIHtcbiAgICAgICAgICBjaGFydE9iaiA9IENoYXJ0TWFuYWdlcihjb250YWluZXIsIG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXRpbHMuZ2VuZXJhdGVUaHVtYihjb250YWluZXIsIG9iaiwgc2V0dGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJhd24ucHVzaCh7IGlkOiBvYmouaWQsIGNoYXJ0T2JqOiBjaGFydE9iaiB9KTtcbiAgICAgICAgb2JqLmNoYXJ0T2JqID0gY2hhcnRPYmo7XG5cbiAgICAgICAgZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHsgZGlzcGF0Y2hlci5jbGljayh0aGlzLCBjaGFydE9iaik7IH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLm1vdXNlT3Zlcih0aGlzLCBjaGFydE9iaik7IH0pXG4gICAgICAgICAgLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLm1vdXNlTW92ZSh0aGlzLCBjaGFydE9iaik7ICB9KVxuICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLm1vdXNlT3V0KHRoaXMsIGNoYXJ0T2JqKTsgfSk7XG5cbiAgICAgICAgZGlzcGF0Y2hlci5maW5pc2goY2hhcnRPYmopO1xuXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogR3JhYnMgZGF0YSBvbiBhIGNoYXJ0IGJhc2VkIG9uIGFuIElELlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gY2hhcnRzIEFycmF5IG9mIGNoYXJ0cyBvbiB0aGUgcGFnZS5cbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgVGhlIElEIGZvciB0aGUgY2hhcnQuXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgIFJldHVybnMgc3RvcmVkIGVtYmVkIG9iamVjdC5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVhZENoYXJ0KGlkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgIGlmIChjaGFydHNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hhcnRzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBMaXN0IGFsbCB0aGUgY2hhcnRzIHN0b3JlZCBpbiB0aGUgQ2hhcnQgVG9vbCBieSBjaGFydGlkLlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gY2hhcnRzIEFycmF5IG9mIGNoYXJ0cyBvbiB0aGUgcGFnZS5cbiAgICAgICAqIEByZXR1cm4ge0FycmF5fSAgICAgICBMaXN0IG9mIGNoYXJ0aWQncy5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gbGlzdENoYXJ0cyhjaGFydHMpIHtcbiAgICAgICAgdmFyIGNoYXJ0c0FyciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNoYXJ0c0Fyci5wdXNoKGNoYXJ0c1tpXS5pZCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjaGFydHNBcnI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KGlkLCBvYmopIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICcuJyArIHNldHRpbmdzLmJhc2VDbGFzcygpICsgJ1tkYXRhLWNoYXJ0aWQ9JyArIHNldHRpbmdzLnByZWZpeCArIGlkICsgJ10nO1xuICAgICAgICBjcmVhdGVDaGFydChjb250YWluZXIsIHsgaWQ6IGlkLCBkYXRhOiBvYmogfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lDaGFydChpZCkge1xuICAgICAgICB2YXIgY29udGFpbmVyLCBvYmo7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNoYXJ0c1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgIG9iaiA9IGNoYXJ0c1tpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnRhaW5lciA9ICcuJyArIHNldHRpbmdzLmJhc2VDbGFzcygpICsgJ1tkYXRhLWNoYXJ0aWQ9JyArIG9iai5pZCArICddJztcbiAgICAgICAgdXRpbHMuY2xlYXJEcmF3bihkcmF3biwgb2JqKTtcbiAgICAgICAgdXRpbHMuY2xlYXJPYmoob2JqKTtcbiAgICAgICAgdXRpbHMuY2xlYXJDaGFydChjb250YWluZXIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIGNoYXJ0cywgZHJhdyBlYWNoIGNoYXJ0IGludG8gaXRzIHJlc3BlY3RpdmUgY29udGFpbmVyLlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gY2hhcnRzIEFycmF5IG9mIGNoYXJ0cyBvbiB0aGUgcGFnZS5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gY3JlYXRlTG9vcChjaGFydHMpIHtcbiAgICAgICAgdmFyIGNoYXJ0TGlzdCA9IGxpc3RDaGFydHMoY2hhcnRzKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFydExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgb2JqID0gcmVhZENoYXJ0KGNoYXJ0TGlzdFtpXSk7XG4gICAgICAgICAgdmFyIGNvbnRhaW5lciA9ICcuJyArIHNldHRpbmdzLmJhc2VDbGFzcygpICsgJ1tkYXRhLWNoYXJ0aWQ9JyArIGNoYXJ0TGlzdFtpXSArICddJztcbiAgICAgICAgICBjcmVhdGVDaGFydChjb250YWluZXIsIG9iaik7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2hhcnQgVG9vbCBpbml0aWFsaXplciB3aGljaCBzZXRzIHVwIGRlYm91bmNpbmcgYW5kIHJ1bnMgdGhlIGNyZWF0ZUxvb3AoKS4gUnVuIG9ubHkgb25jZSwgd2hlbiB0aGUgbGlicmFyeSBpcyBmaXJzdCBsb2FkZWQuXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBjaGFydHMgQXJyYXkgb2YgY2hhcnRzIG9uIHRoZSBwYWdlLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBpbml0aWFsaXplcihjaGFydHMpIHtcbiAgICAgICAgY3JlYXRlTG9vcChjaGFydHMpO1xuICAgICAgICB2YXIgZGVib3VuY2UgPSB1dGlscy5kZWJvdW5jZShjcmVhdGVMb29wLCBjaGFydHMsIHNldHRpbmdzLmRlYm91bmNlLCByb290KTtcbiAgICAgICAgZDMuc2VsZWN0KHJvb3QpXG4gICAgICAgICAgLm9uKCdyZXNpemUuJyArIHNldHRpbmdzLnByZWZpeCArICdkZWJvdW5jZScsIGRlYm91bmNlKVxuICAgICAgICAgIC5vbigncmVzaXplLicgKyBzZXR0aW5ncy5wcmVmaXggKyAncmVkcmF3JywgZGlzcGF0Y2hlci5yZWRyYXcoY2hhcnRzKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZXIoY2hhcnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZShjb250YWluZXIsIG9iaikge1xuICAgICAgICAgIHJldHVybiBjcmVhdGVDaGFydChjb250YWluZXIsIG9iaik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChpZCkge1xuICAgICAgICAgIHJldHVybiByZWFkQ2hhcnQoaWQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxpc3Q6IGZ1bmN0aW9uIGxpc3QoKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RDaGFydHMoY2hhcnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShpZCwgb2JqKSB7XG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZUNoYXJ0KGlkLCBvYmopO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgICAgICByZXR1cm4gZGVzdHJveUNoYXJ0KGlkKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkaXNwYXRjaDogZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gICAgICAgICAgcmV0dXJuIGQzLmtleXMoZGlzcGF0Y2hlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2F0OiBmdW5jdGlvbiB3YXQoKSB7XG4gICAgICAgICAgY29uc29sZS5pbmZvKFwiQ2hhcnRUb29sIHZcIiArIHNldHRpbmdzLnZlcnNpb24gKyBcIiBpcyBhIGZyZWUsIG9wZW4tc291cmNlIGNoYXJ0IGdlbmVyYXRvciBhbmQgZnJvbnQtZW5kIGxpYnJhcnkgbWFpbnRhaW5lZCBieSBUaGUgR2xvYmUgYW5kIE1haWwuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBjaGVjayBvdXQgb3VyIEdpdEh1YiByZXBvOiB3d3cuZ2l0aHViLmNvbS9nbG9iZWFuZG1haWwvY2hhcnQtdG9vbFwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICB2ZXJzaW9uOiBzZXR0aW5ncy52ZXJzaW9uLFxuICAgICAgICBidWlsZDogc2V0dGluZ3MuYnVpbGQsXG4gICAgICAgIHNldHRpbmdzOiByZXF1aXJlKFwiLi9jb25maWcvY2hhcnQtc2V0dGluZ3NcIiksXG4gICAgICAgIGNoYXJ0czogcmVxdWlyZShcIi4vY2hhcnRzL21hbmFnZXJcIiksXG4gICAgICAgIGNvbXBvbmVudHM6IHJlcXVpcmUoXCIuL2NoYXJ0cy9jb21wb25lbnRzL2NvbXBvbmVudHNcIiksXG4gICAgICAgIGhlbHBlcnM6IHJlcXVpcmUoXCIuL2hlbHBlcnMvaGVscGVyc1wiKSxcbiAgICAgICAgdXRpbHM6IHJlcXVpcmUoXCIuL3V0aWxzL3V0aWxzXCIpLFxuICAgICAgICBsaW5lOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvbGluZVwiKSxcbiAgICAgICAgYXJlYTogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL2FyZWFcIiksXG4gICAgICAgIG11bHRpbGluZTogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL211bHRpbGluZVwiKSxcbiAgICAgICAgc3RhY2tlZEFyZWE6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9zdGFja2VkLWFyZWFcIiksXG4gICAgICAgIGNvbHVtbjogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL2NvbHVtblwiKSxcbiAgICAgICAgc3RhY2tlZENvbHVtbjogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL3N0YWNrZWQtY29sdW1uXCIpLFxuICAgICAgICBzdHJlYW1ncmFwaDogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL3N0cmVhbWdyYXBoXCIpLFxuICAgICAgICBiYXI6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9iYXJcIilcblxuICAgICAgfVxuXG4gICAgfSkoKTtcblxuICAgIGlmICghcm9vdC5NZXRlb3IpIHsgQ2hhcnRUb29sLmluaXQoKTsgfVxuXG4gIH0gZWxzZSB7XG5cbiAgICB2YXIgTWV0ZW9yID0gdGhpcy5NZXRlb3IgfHwge30sXG4gICAgICAgIGlzU2VydmVyID0gTWV0ZW9yLmlzU2VydmVyIHx8IHVuZGVmaW5lZDtcblxuICAgIGlmICghaXNTZXJ2ZXIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDaGFydCBUb29sOiBubyBEMyBsaWJyYXJ5IGRldGVjdGVkLlwiKTtcbiAgICB9XG5cblxuICB9XG5cbiAgcm9vdC5DaGFydFRvb2wgPSBDaGFydFRvb2w7XG5cbn0pKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB0aGlzKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgdmVyc2lvbiA9IHtcbiAgdmVyc2lvbjogcmVxdWlyZShcImpzb24hLi4vLi4vLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb24sXG4gIGJ1aWxkOiByZXF1aXJlKFwianNvbiEuLi8uLi8uLi9wYWNrYWdlLmpzb25cIikuYnVpbGR2ZXJcbn07XG5cbnZhciBzZXR0aW5ncyA9IHJlcXVpcmUoXCJqc29uIS4uLy4uLy4uL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBDVVNUT006IHNldHRpbmdzLkNVU1RPTSxcbiAgdmVyc2lvbjogdmVyc2lvbi52ZXJzaW9uLFxuICBidWlsZDogdmVyc2lvbi5idWlsZCxcbiAgaWQ6IFwiXCIsXG4gIGRhdGE6IFwiXCIsXG4gIGRhdGVGb3JtYXQ6IHNldHRpbmdzLmRhdGVGb3JtYXQsXG4gIHRpbWVGb3JtYXQ6IHNldHRpbmdzLnRpbWVGb3JtYXQsXG4gIGltYWdlOiBzZXR0aW5ncy5pbWFnZSxcbiAgaGVhZGluZzogXCJcIixcbiAgcXVhbGlmaWVyOiBcIlwiLFxuICBzb3VyY2U6IFwiXCIsXG4gIGRlY2s6IFwiXCIsXG4gIGluZGV4OiBcIlwiLFxuICBoYXNIb3VyczogZmFsc2UsXG4gIHNvY2lhbDogc2V0dGluZ3Muc29jaWFsLFxuICBzZXJpZXNIaWdobGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmRhdGEuc2VyaWVzQW1vdW50ICYmIHRoaXMuZGF0YS5zZXJpZXNBbW91bnQgPD0gMSkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfSxcbiAgYmFzZUNsYXNzOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMucHJlZml4ICsgXCJjaGFydFwiOyB9LFxuICBjdXN0b21DbGFzczogXCJcIixcblxuICBvcHRpb25zOiB7XG4gICAgdHlwZTogXCJsaW5lXCIsXG4gICAgaW50ZXJwb2xhdGlvbjogXCJsaW5lYXJcIixcbiAgICBzdGFja2VkOiBmYWxzZSxcbiAgICBleHBhbmRlZDogZmFsc2UsXG4gICAgaGVhZDogdHJ1ZSxcbiAgICBkZWNrOiBmYWxzZSxcbiAgICBxdWFsaWZpZXI6IHRydWUsXG4gICAgbGVnZW5kOiB0cnVlLFxuICAgIGZvb3RlcjogdHJ1ZSxcbiAgICB4X2F4aXM6IHRydWUsXG4gICAgeV9heGlzOiB0cnVlLFxuICAgIHRpcHM6IGZhbHNlLFxuICAgIGFubm90YXRpb25zOiBmYWxzZSxcbiAgICByYW5nZTogZmFsc2UsXG4gICAgc2VyaWVzOiBmYWxzZSxcbiAgICBzaGFyZV9kYXRhOiB0cnVlLFxuICAgIHNvY2lhbDogdHJ1ZVxuICB9LFxuXG4gIHJhbmdlOiB7fSxcbiAgc2VyaWVzOiB7fSxcbiAgeEF4aXM6IHNldHRpbmdzLnhBeGlzLFxuICB5QXhpczogc2V0dGluZ3MueUF4aXMsXG5cbiAgZXhwb3J0YWJsZTogZmFsc2UsIC8vIHRoaXMgY2FuIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBiYWNrZW5kIGFzIG5lZWRlZFxuICBlZGl0YWJsZTogZmFsc2UsXG5cbiAgcHJlZml4OiBzZXR0aW5ncy5wcmVmaXgsXG4gIGRlYm91bmNlOiBzZXR0aW5ncy5kZWJvdW5jZSxcbiAgdGlwVGltZW91dDogc2V0dGluZ3MudGlwVGltZW91dCxcbiAgbW9udGhzQWJyOiBzZXR0aW5ncy5tb250aHNBYnIsXG5cbiAgZGltZW5zaW9uczoge1xuICAgIHdpZHRoOiAwLFxuICAgIGNvbXB1dGVkV2lkdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHQ7XG4gICAgfSxcbiAgICBoZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJhdGlvU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMzAwLCA5MDBdKS5kb21haW4oW3RoaXMud2lkdGggKiB0aGlzLnJhdGlvTW9iaWxlLCB0aGlzLndpZHRoICogdGhpcy5yYXRpb0Rlc2t0b3BdKTtcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKHJhdGlvU2NhbGUodGhpcy53aWR0aCkpO1xuICAgIH0sXG4gICAgY29tcHV0ZWRIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICh0aGlzLmhlaWdodCgpIC0gdGhpcy5oZWFkZXJIZWlnaHQgLSB0aGlzLmZvb3RlckhlaWdodCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbSk7XG4gICAgfSxcbiAgICByYXRpb01vYmlsZTogc2V0dGluZ3MucmF0aW9Nb2JpbGUsXG4gICAgcmF0aW9EZXNrdG9wOiBzZXR0aW5ncy5yYXRpb0Rlc2t0b3AsXG4gICAgbWFyZ2luOiBzZXR0aW5ncy5tYXJnaW4sXG4gICAgdGlwUGFkZGluZzogc2V0dGluZ3MudGlwUGFkZGluZyxcbiAgICB0aXBPZmZzZXQ6IHNldHRpbmdzLnRpcE9mZnNldCxcbiAgICBoZWFkZXJIZWlnaHQ6IDAsXG4gICAgZm9vdGVySGVpZ2h0OiAwLFxuICAgIHhBeGlzSGVpZ2h0OiAwLFxuICAgIHlBeGlzSGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAodGhpcy5jb21wdXRlZEhlaWdodCgpIC0gdGhpcy54QXhpc0hlaWdodCk7XG4gICAgfSxcbiAgICB4QXhpc1dpZHRoOiAwLFxuICAgIGxhYmVsV2lkdGg6IDAsXG4gICAgeUF4aXNQYWRkaW5nUmlnaHQ6IHNldHRpbmdzLnlBeGlzLnBhZGRpbmdSaWdodCxcbiAgICB0aWNrV2lkdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICh0aGlzLmNvbXB1dGVkV2lkdGgoKSAtICh0aGlzLmxhYmVsV2lkdGggKyB0aGlzLnlBeGlzUGFkZGluZ1JpZ2h0KSk7XG4gICAgfSxcbiAgICBiYXJIZWlnaHQ6IHNldHRpbmdzLmJhckhlaWdodCxcbiAgICBiYW5kczoge1xuICAgICAgcGFkZGluZzogc2V0dGluZ3MuYmFuZHMucGFkZGluZyxcbiAgICAgIG9mZnNldDogc2V0dGluZ3MuYmFuZHMub2Zmc2V0LFxuICAgICAgb3V0ZXJQYWRkaW5nOiBzZXR0aW5ncy5iYW5kcy5vdXRlclBhZGRpbmdcbiAgICB9XG4gIH1cblxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY29uZmlnL2NoYXJ0LXNldHRpbmdzLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwibmFtZVwiOiBcImNoYXJ0LXRvb2xcIixcblx0XCJ2ZXJzaW9uXCI6IFwiMS4xLjBcIixcblx0XCJidWlsZFZlclwiOiBcIjBcIixcblx0XCJkZXNjcmlwdGlvblwiOiBcIkEgcmVzcG9uc2l2ZSBjaGFydGluZyBhcHBsaWNhdGlvblwiLFxuXHRcIm1haW5cIjogXCJndWxwZmlsZS5qc1wiLFxuXHRcImRlcGVuZGVuY2llc1wiOiB7fSxcblx0XCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiYnJvd3Nlci1zeW5jXCI6IFwiXjIuOC4wXCIsXG5cdFx0XCJndWxwXCI6IFwiXjMuOC4xMVwiLFxuXHRcdFwiZ3VscC1jbGVhblwiOiBcIl4wLjMuMVwiLFxuXHRcdFwiZ3VscC1qc29uLWVkaXRvclwiOiBcIl4yLjIuMVwiLFxuXHRcdFwiZ3VscC1taW5pZnktY3NzXCI6IFwiXjEuMi4wXCIsXG5cdFx0XCJndWxwLXJlbmFtZVwiOiBcIl4xLjIuMlwiLFxuXHRcdFwiZ3VscC1yZXBsYWNlXCI6IFwiXjAuNS4zXCIsXG5cdFx0XCJndWxwLXNhc3NcIjogXCJeMi4wLjRcIixcblx0XHRcImd1bHAtc2hlbGxcIjogXCJeMC40LjJcIixcblx0XHRcImd1bHAtc291cmNlbWFwc1wiOiBcIl4xLjUuMlwiLFxuXHRcdFwiZ3VscC11dGlsXCI6IFwiXjMuMC42XCIsXG5cdFx0XCJqc2RvY1wiOiBcIl4zLjMuMlwiLFxuXHRcdFwianNvbi1sb2FkZXJcIjogXCJeMC41LjNcIixcblx0XHRcInJ1bi1zZXF1ZW5jZVwiOiBcIl4xLjEuNFwiLFxuXHRcdFwid2VicGFja1wiOiBcIl4xLjEyLjE0XCIsXG5cdFx0XCJ3ZWJwYWNrLXN0cmVhbVwiOiBcIl4zLjEuMFwiLFxuXHRcdFwieWFyZ3NcIjogXCJeMy4xNS4wXCJcblx0fSxcblx0XCJzY3JpcHRzXCI6IHtcblx0XHRcInRlc3RcIjogXCJcIlxuXHR9LFxuXHRcImtleXdvcmRzXCI6IFtcblx0XHRcImNoYXJ0c1wiLFxuXHRcdFwiZDNcIixcblx0XHRcImQzanNcIixcblx0XHRcIm1ldGVvclwiLFxuXHRcdFwiZ3VscFwiLFxuXHRcdFwid2VicGFja1wiLFxuXHRcdFwiZGF0YSB2aXN1YWxpemF0aW9uXCIsXG5cdFx0XCJjaGFydFwiLFxuXHRcdFwibW9uZ29cIlxuXHRdLFxuXHRcInJlcG9zaXRvcnlcIjoge1xuXHRcdFwidHlwZVwiOiBcImdpdFwiLFxuXHRcdFwidXJsXCI6IFwiZ2l0QGdpdGh1Yi5jb206Z2xvYmVhbmRtYWlsL2NoYXJ0LXRvb2wuZ2l0XCJcblx0fSxcblx0XCJjb250cmlidXRvcnNcIjogW1xuXHRcdHtcblx0XHRcdFwiYXV0aG9yXCI6IFwiVG9tIENhcmRvc29cIixcblx0XHRcdFwiZW1haWxcIjogXCJ0Y2FyZG9zb0BnbG9iZWFuZG1haWwuY29tXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwiYXV0aG9yXCI6IFwiSmVyZW15IEFnaXVzXCIsXG5cdFx0XHRcImVtYWlsXCI6IFwiamFnaXVzQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJNaWNoYWVsIFBlcmVpcmFcIixcblx0XHRcdFwiZW1haWxcIjogXCJtcGVyZWlyYUBnbG9iZWFuZG1haWwuY29tXCJcblx0XHR9XG5cdF0sXG5cdFwibGljZW5zZVwiOiBcIk1JVFwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcGFja2FnZS5qc29uXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJDVVNUT01cIjogZmFsc2UsXG5cdFwicHJlZml4XCI6IFwiY3QtXCIsXG5cdFwibW9udGhzQWJyXCI6IFtcblx0XHRcIkphbi5cIixcblx0XHRcIkZlYi5cIixcblx0XHRcIk1hci5cIixcblx0XHRcIkFwci5cIixcblx0XHRcIk1heVwiLFxuXHRcdFwiSnVuZVwiLFxuXHRcdFwiSnVseVwiLFxuXHRcdFwiQXVnLlwiLFxuXHRcdFwiU2VwdC5cIixcblx0XHRcIk9jdC5cIixcblx0XHRcIk5vdi5cIixcblx0XHRcIkRlYy5cIixcblx0XHRcIkphbi5cIlxuXHRdLFxuXHRcImRlYm91bmNlXCI6IDUwMCxcblx0XCJ0aXBUaW1lb3V0XCI6IDUwMDAsXG5cdFwicmF0aW9Nb2JpbGVcIjogMS4xNSxcblx0XCJyYXRpb0Rlc2t0b3BcIjogMC42NSxcblx0XCJkYXRlRm9ybWF0XCI6IFwiJVktJW0tJWRcIixcblx0XCJ0aW1lRm9ybWF0XCI6IFwiJUg6JU1cIixcblx0XCJtYXJnaW5cIjoge1xuXHRcdFwidG9wXCI6IDEwLFxuXHRcdFwicmlnaHRcIjogMyxcblx0XHRcImJvdHRvbVwiOiAwLFxuXHRcdFwibGVmdFwiOiAwXG5cdH0sXG5cdFwidGlwT2Zmc2V0XCI6IHtcblx0XHRcInZlcnRpY2FsXCI6IDQsXG5cdFx0XCJob3Jpem9udGFsXCI6IDFcblx0fSxcblx0XCJ0aXBQYWRkaW5nXCI6IHtcblx0XHRcInRvcFwiOiA0LFxuXHRcdFwicmlnaHRcIjogOSxcblx0XHRcImJvdHRvbVwiOiA0LFxuXHRcdFwibGVmdFwiOiA5XG5cdH0sXG5cdFwieUF4aXNcIjoge1xuXHRcdFwiZGlzcGxheVwiOiB0cnVlLFxuXHRcdFwic2NhbGVcIjogXCJsaW5lYXJcIixcblx0XHRcInRpY2tzXCI6IFwiYXV0b1wiLFxuXHRcdFwib3JpZW50XCI6IFwicmlnaHRcIixcblx0XHRcImZvcm1hdFwiOiBcImNvbW1hXCIsXG5cdFx0XCJwcmVmaXhcIjogXCJcIixcblx0XHRcInN1ZmZpeFwiOiBcIlwiLFxuXHRcdFwibWluXCI6IFwiXCIsXG5cdFx0XCJtYXhcIjogXCJcIixcblx0XHRcInJlc2NhbGVcIjogZmFsc2UsXG5cdFx0XCJuaWNlXCI6IHRydWUsXG5cdFx0XCJwYWRkaW5nUmlnaHRcIjogOSxcblx0XHRcInRpY2tMb3dlckJvdW5kXCI6IDMsXG5cdFx0XCJ0aWNrVXBwZXJCb3VuZFwiOiA4LFxuXHRcdFwidGlja0dvYWxcIjogNSxcblx0XHRcIndpZHRoVGhyZXNob2xkXCI6IDQyMCxcblx0XHRcImR5XCI6IFwiXCIsXG5cdFx0XCJ0ZXh0WFwiOiAwLFxuXHRcdFwidGV4dFlcIjogXCJcIlxuXHR9LFxuXHRcInhBeGlzXCI6IHtcblx0XHRcImRpc3BsYXlcIjogdHJ1ZSxcblx0XHRcInNjYWxlXCI6IFwidGltZVwiLFxuXHRcdFwidGlja3NcIjogXCJhdXRvXCIsXG5cdFx0XCJvcmllbnRcIjogXCJib3R0b21cIixcblx0XHRcImZvcm1hdFwiOiBcImF1dG9cIixcblx0XHRcInByZWZpeFwiOiBcIlwiLFxuXHRcdFwic3VmZml4XCI6IFwiXCIsXG5cdFx0XCJtaW5cIjogXCJcIixcblx0XHRcIm1heFwiOiBcIlwiLFxuXHRcdFwicmVzY2FsZVwiOiBmYWxzZSxcblx0XHRcIm5pY2VcIjogZmFsc2UsXG5cdFx0XCJyYW5nZVBvaW50c1wiOiAxLFxuXHRcdFwidGlja1RhcmdldFwiOiA2LFxuXHRcdFwidGlja3NTbWFsbFwiOiA0LFxuXHRcdFwid2lkdGhUaHJlc2hvbGRcIjogNDIwLFxuXHRcdFwiZHlcIjogMC43LFxuXHRcdFwiYmFyT2Zmc2V0XCI6IDksXG5cdFx0XCJ1cHBlclwiOiB7XG5cdFx0XHRcInRpY2tIZWlnaHRcIjogNyxcblx0XHRcdFwidGV4dFhcIjogNixcblx0XHRcdFwidGV4dFlcIjogN1xuXHRcdH0sXG5cdFx0XCJsb3dlclwiOiB7XG5cdFx0XHRcInRpY2tIZWlnaHRcIjogMTIsXG5cdFx0XHRcInRleHRYXCI6IDYsXG5cdFx0XHRcInRleHRZXCI6IDJcblx0XHR9XG5cdH0sXG5cdFwiYmFySGVpZ2h0XCI6IDMwLFxuXHRcImJhbmRzXCI6IHtcblx0XHRcInBhZGRpbmdcIjogMC4wNixcblx0XHRcIm9mZnNldFwiOiAwLjEyLFxuXHRcdFwib3V0ZXJQYWRkaW5nXCI6IDAuMDNcblx0fSxcblx0XCJzb3VyY2VcIjoge1xuXHRcdFwicHJlZml4XCI6IFwiQ0hBUlQgVE9PTFwiLFxuXHRcdFwic3VmZml4XCI6IFwiIMK7IFNPVVJDRTpcIlxuXHR9LFxuXHRcInNvY2lhbFwiOiB7XG5cdFx0XCJmYWNlYm9va1wiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiRmFjZWJvb2tcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1zb2NpYWwtZmFjZWJvb2suc3ZnXCIsXG5cdFx0XHRcInJlZGlyZWN0XCI6IFwiXCIsXG5cdFx0XHRcImFwcElEXCI6IFwiXCJcblx0XHR9LFxuXHRcdFwidHdpdHRlclwiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiVHdpdHRlclwiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLXNvY2lhbC10d2l0dGVyLnN2Z1wiLFxuXHRcdFx0XCJ2aWFcIjogXCJcIixcblx0XHRcdFwiaGFzaHRhZ1wiOiBcIlwiXG5cdFx0fSxcblx0XHRcImVtYWlsXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJFbWFpbFwiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLW1haWwuc3ZnXCJcblx0XHR9LFxuXHRcdFwic21zXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJTTVNcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS10ZWxlcGhvbmUuc3ZnXCJcblx0XHR9XG5cdH0sXG5cdFwiaW1hZ2VcIjoge1xuXHRcdFwiZW5hYmxlXCI6IGZhbHNlLFxuXHRcdFwiYmFzZV9wYXRoXCI6IFwiXCIsXG5cdFx0XCJleHBpcmF0aW9uXCI6IDMwMDAwLFxuXHRcdFwiZmlsZW5hbWVcIjogXCJ0aHVtYm5haWxcIixcblx0XHRcImV4dGVuc2lvblwiOiBcInBuZ1wiLFxuXHRcdFwidGh1bWJuYWlsV2lkdGhcIjogNDYwXG5cdH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9jdXN0b20vY2hhcnQtdG9vbC1jb25maWcuanNvblxuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBVdGlsaXRpZXMgbW9kdWxlLiBGdW5jdGlvbnMgdGhhdCBhcmVuJ3Qgc3BlY2lmaWMgdG8gYW55IG9uZSBtb2R1bGUuXG4gKiBAbW9kdWxlIHV0aWxzL3V0aWxzXG4gKi9cblxuLyoqXG4gKiBHaXZlbiBhIGZ1bmN0aW9uIHRvIHBlcmZvcm0sIGEgdGltZW91dCBwZXJpb2QsIGEgcGFyYW1ldGVyIHRvIHBhc3MgdG8gdGhlIHBlcmZvcm1lZCBmdW5jdGlvbiwgYW5kIGEgcmVmZXJlbmNlIHRvIHRoZSB3aW5kb3csIGZpcmUgYSBzcGVjaWZpYyBmdW5jdGlvbi5cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgICAgIEZ1bmN0aW9uIHRvIHBlcmZvcm0gb24gZGVib3VuY2UuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgICAgIE9iamVjdCBwYXNzZWQgdG8gRnVuY3Rpb24gd2hpY2ggaXMgcGVyZm9ybWVkIG9uIGRlYm91bmNlLlxuICogQHBhcmFtICB7SW50ZWdlcn0gICB0aW1lb3V0IFRpbWVvdXQgcGVyaW9kIGluIG1pbGxpc2Vjb25kcy5cbiAqIEBwYXJhbSAge09iamVjdH0gICByb290ICAgIFdpbmRvdyBvYmplY3QuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gICAgICAgICAgIEZpbmFsIGRlYm91bmNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgb2JqLCB0aW1lb3V0LCByb290KSB7XG4gIHZhciB0aW1lb3V0SUQgPSAtMTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0SUQgPiAtMSkgeyByb290LmNsZWFyVGltZW91dCh0aW1lb3V0SUQpOyB9XG4gICAgdGltZW91dElEID0gcm9vdC5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBmbihvYmopXG4gICAgfSwgdGltZW91dCk7XG4gIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlIGNoYXJ0IFNWRyBhbmQgZGl2cyBpbnNpZGUgYSBjb250YWluZXIgZnJvbSB0aGUgRE9NLlxuICogQHBhcmFtICB7U3RyaW5nfSBjb250YWluZXJcbiAqL1xuZnVuY3Rpb24gY2xlYXJDaGFydChjb250YWluZXIpIHtcblxuICB2YXIgY29udCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcblxuICB3aGlsZSAoY29udCAmJiBjb250LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzdmdcIikubGVuZ3RoKSB7XG4gICAgdmFyIHN2ZyA9IGNvbnQucXVlcnlTZWxlY3RvckFsbChcInN2Z1wiKTtcbiAgICBzdmdbc3ZnLmxlbmd0aCAtIDFdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3ZnW3N2Zy5sZW5ndGggLSAxXSk7XG4gIH1cblxuICB3aGlsZSAoY29udCAmJiBjb250LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIikubGVuZ3RoKSB7XG4gICAgdmFyIGRpdiA9IGNvbnQucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKTtcbiAgICBkaXZbZGl2Lmxlbmd0aCAtIDFdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2W2Rpdi5sZW5ndGggLSAxXSk7XG4gIH1cblxuICByZXR1cm4gY29udGFpbmVyO1xufVxuXG4vKipcbiAqIENsZWFycyB0aGUgY2hhcnQgZGF0YSBvZiBpdHMgcG9zdC1yZW5kZXIgY2hhcnRPYmogb2JqZWN0LlxuICogQHBhcmFtICB7T2JqZWN0fSBvYmogT2JqZWN0IHVzZWQgdG8gY29uc3RydWN0IGNoYXJ0cy5cbiAqIEByZXR1cm4ge09iamVjdH0gICAgIFRoZSBuZXcgdmVyc2lvbiBvZiB0aGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBjbGVhck9iaihvYmopIHtcbiAgaWYgKG9iai5jaGFydE9iaikgeyBvYmouY2hhcnRPYmogPSB1bmRlZmluZWQ7IH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBDbGVhcnMgdGhlIGRyYXduIGFycmF5LlxuICogQHBhcmFtICB7QXJyYXl9IGRyYXduXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGNsZWFyRHJhd24oZHJhd24sIG9iaikge1xuICBpZiAoZHJhd24ubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IGRyYXduLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoZHJhd25baV0uaWQgPT09IG9iai5pZCkge1xuICAgICAgICBkcmF3bi5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBkcmF3bjtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGJvdW5kaW5nQ2xpZW50UmVjdCBkaW1lbnNpb25zIGdpdmVuIGEgc2VsZWN0b3IuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGNvbnRhaW5lclxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgVGhlIGJvdW5kaW5nQ2xpZW50UmVjdCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGdldEJvdW5kaW5nKHNlbGVjdG9yLCBkaW1lbnNpb24pIHtcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2RpbWVuc2lvbl07XG59XG5cbi8qKlxuICogQmFzaWMgZmFjdG9yeSBmb3IgZmlndXJpbmcgb3V0IGFtb3VudCBvZiBtaWxsaXNlY29uZHMgaW4gYSBnaXZlbiB0aW1lIHBlcmlvZC5cbiAqL1xuZnVuY3Rpb24gVGltZU9iaigpIHtcbiAgdGhpcy5zZWMgPSAxMDAwO1xuICB0aGlzLm1pbiA9IHRoaXMuc2VjICogNjA7XG4gIHRoaXMuaG91ciA9IHRoaXMubWluICogNjA7XG4gIHRoaXMuZGF5ID0gdGhpcy5ob3VyICogMjQ7XG4gIHRoaXMud2VlayA9IHRoaXMuZGF5ICogNztcbiAgdGhpcy5tb250aCA9IHRoaXMuZGF5ICogMzA7XG4gIHRoaXMueWVhciA9IHRoaXMuZGF5ICogMzY1O1xufVxuXG4vKipcbiAqIFNsaWdodGx5IGFsdGVyZWQgQm9zdG9jayBtYWdpYyB0byB3cmFwIFNWRyA8dGV4dD4gbm9kZXMgYmFzZWQgb24gYXZhaWxhYmxlIHdpZHRoXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRleHQgICAgRDMgdGV4dCBzZWxlY3Rpb24uXG4gKiBAcGFyYW0gIHtJbnRlZ2VyfSB3aWR0aFxuICovXG5mdW5jdGlvbiB3cmFwVGV4dCh0ZXh0LCB3aWR0aCkge1xuICB0ZXh0LmVhY2goZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRleHQgPSBkMy5zZWxlY3QodGhpcyksXG4gICAgICAgIHdvcmRzID0gdGV4dC50ZXh0KCkuc3BsaXQoL1xccysvKS5yZXZlcnNlKCksXG4gICAgICAgIHdvcmQsXG4gICAgICAgIGxpbmUgPSBbXSxcbiAgICAgICAgbGluZU51bWJlciA9IDAsXG4gICAgICAgIGxpbmVIZWlnaHQgPSAxLjAsIC8vIGVtc1xuICAgICAgICB4ID0gMCxcbiAgICAgICAgeSA9IHRleHQuYXR0cihcInlcIiksXG4gICAgICAgIGR5ID0gcGFyc2VGbG9hdCh0ZXh0LmF0dHIoXCJkeVwiKSksXG4gICAgICAgIHRzcGFuID0gdGV4dC50ZXh0KG51bGwpLmFwcGVuZChcInRzcGFuXCIpXG4gICAgICAgICAgLmF0dHIoXCJ4XCIsIHgpXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIHkpXG4gICAgICAgICAgLmF0dHIoXCJkeVwiLCBkeSArIFwiZW1cIik7XG5cbiAgICB3aGlsZSAod29yZCA9IHdvcmRzLnBvcCgpKSB7XG4gICAgICBsaW5lLnB1c2god29yZCk7XG4gICAgICB0c3Bhbi50ZXh0KGxpbmUuam9pbihcIiBcIikpO1xuICAgICAgaWYgKHRzcGFuLm5vZGUoKS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKSA+IHdpZHRoICYmIGxpbmUubGVuZ3RoID4gMSkge1xuICAgICAgICBsaW5lLnBvcCgpO1xuICAgICAgICB0c3Bhbi50ZXh0KGxpbmUuam9pbihcIiBcIikpO1xuICAgICAgICBsaW5lID0gW3dvcmRdO1xuICAgICAgICB0c3BhbiA9IHRleHQuYXBwZW5kKFwidHNwYW5cIilcbiAgICAgICAgICAuYXR0cihcInhcIiwgeClcbiAgICAgICAgICAuYXR0cihcInlcIiwgeSlcbiAgICAgICAgICAuYXR0cihcImR5XCIsICsrbGluZU51bWJlciAqIGxpbmVIZWlnaHQgKyBkeSArIFwiZW1cIilcbiAgICAgICAgICAudGV4dCh3b3JkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBkYXRlcyBkYXRlIGFuZCBhIHRvbGVyYW5jZSBsZXZlbCwgcmV0dXJuIGEgdGltZSBcImNvbnRleHRcIiBmb3IgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgdHdvIHZhbHVlcy5cbiAqIEBwYXJhbSAge09iamVjdH0gZDEgICAgIEJlZ2lubmluZyBkYXRlIG9iamVjdC5cbiAqIEBwYXJhbSAge09iamVjdH0gZDIgICAgIEVuZCBkYXRlIG9iamVjdC5cbiAqIEBwYXJhbSAge0ludGVnZXJ9IHRvbGVyYW5jZVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgVGhlIHJlc3VsdGluZyB0aW1lIGNvbnRleHQuXG4gKi9cbmZ1bmN0aW9uIHRpbWVEaWZmKGQxLCBkMiwgdG9sZXJhbmNlKSB7XG5cbiAgdmFyIGRpZmYgPSBkMiAtIGQxLFxuICAgICAgdGltZSA9IG5ldyBUaW1lT2JqKCk7XG5cbiAgLy8gcmV0dXJuaW5nIHRoZSBjb250ZXh0XG4gIGlmICgoZGlmZiAvIHRpbWUueWVhcikgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwieWVhcnNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUubW9udGgpID4gdG9sZXJhbmNlKSB7IHJldHVybiBcIm1vbnRoc1wiOyB9XG4gIGVsc2UgaWYgKChkaWZmIC8gdGltZS53ZWVrKSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJ3ZWVrc1wiOyB9XG4gIGVsc2UgaWYgKChkaWZmIC8gdGltZS5kYXkpID4gdG9sZXJhbmNlKSB7IHJldHVybiBcImRheXNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUuaG91cikgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwiaG91cnNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUubWluKSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJtaW51dGVzXCI7IH1cbiAgZWxzZSB7IHJldHVybiBcImRheXNcIjsgfVxuICAvLyBpZiBub25lIG9mIHRoZXNlIHdvcmsgaSBmZWVsIGJhZCBmb3IgeW91IHNvblxuICAvLyBpJ3ZlIGdvdCA5OSBwcm9ibGVtcyBidXQgYW4gaWYvZWxzZSBhaW5cInQgb25lXG5cbn1cblxuLyoqXG4gKiBHaXZlbiBhIGRhdGFzZXQsIGZpZ3VyZSBvdXQgd2hhdCB0aGUgdGltZSBjb250ZXh0IGlzIGFuZFxuICogd2hhdCB0aGUgbnVtYmVyIG9mIHRpbWUgdW5pdHMgZWxhcHNlZCBpc1xuICogQHBhcmFtICB7QXJyYXl9IGRhdGFcbiAqIEByZXR1cm4ge0ludGVnZXJ9XG4gKi9cbmZ1bmN0aW9uIHRpbWVJbnRlcnZhbChkYXRhKSB7XG5cbiAgdmFyIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgIGQxID0gZGF0YVswXS5rZXksXG4gICAgICBkMiA9IGRhdGFbZGF0YUxlbmd0aCAtIDFdLmtleTtcblxuICB2YXIgcmV0O1xuXG4gIHZhciBpbnRlcnZhbHMgPSBbXG4gICAgeyB0eXBlOiBcInllYXJzXCIsIHN0ZXA6IDEgfSxcbiAgICB7IHR5cGU6IFwibW9udGhzXCIsIHN0ZXA6IDMgfSwgLy8gcXVhcnRlcnNcbiAgICB7IHR5cGU6IFwibW9udGhzXCIsIHN0ZXA6IDEgfSxcbiAgICB7IHR5cGU6IFwiZGF5c1wiLCBzdGVwOiAxIH0sXG4gICAgeyB0eXBlOiBcImhvdXJzXCIsIHN0ZXA6IDEgfSxcbiAgICB7IHR5cGU6IFwibWludXRlc1wiLCBzdGVwOiAxIH1cbiAgXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGludGVydmFscy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpbnRlcnZhbENhbmRpZGF0ZSA9IGQzLnRpbWVbaW50ZXJ2YWxzW2ldLnR5cGVdKGQxLCBkMiwgaW50ZXJ2YWxzW2ldLnN0ZXApLmxlbmd0aDtcbiAgICBpZiAoaW50ZXJ2YWxDYW5kaWRhdGUgPj0gZGF0YUxlbmd0aCAtIDEpIHtcbiAgICAgIHZhciByZXQgPSBpbnRlcnZhbENhbmRpZGF0ZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gcmV0O1xuXG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdHJhbnNmb3JtIHBvc2l0aW9uIG9mIGFuIGVsZW1lbnQgYXMgYW4gYXJyYXlcbiAqIEBwYXJhbSAge09iamVjdH0gbm9kZVxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGdldFRyYW5zbGF0ZVhZKG5vZGUpIHtcbiAgcmV0dXJuIGQzLnRyYW5zZm9ybShkMy5zZWxlY3Qobm9kZSkuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSB0cmFuc2xhdGUgc3RhdGVtZW50IGJlY2F1c2UgaXQncyBhbm5veWluZyB0byB0eXBlIG91dFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiB0cmFuc2xhdGUoeCwgeSkge1xuICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIpXCI7XG59XG5cbi8qKlxuICogVGVzdHMgZm9yIFNWRyBzdXBwb3J0LCB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS92aWxqYW1pcy9mZWF0dXJlLmpzL1xuICogQHBhcmFtICB7T2JqZWN0fSByb290IEEgcmVmZXJlbmNlIHRvIHRoZSBicm93c2VyIHdpbmRvdyBvYmplY3QuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBzdmdUZXN0KHJvb3QpIHtcbiAgcmV0dXJuICEhcm9vdC5kb2N1bWVudCAmJiAhIXJvb3QuZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEhcm9vdC5kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKS5jcmVhdGVTVkdSZWN0O1xufVxuXG4vKipcbiAqIENvbnN0cnVjdHMgdGhlIEFXUyBVUkwgZm9yIGEgZ2l2ZW4gY2hhcnQgSUQuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRUaHVtYm5haWxQYXRoKG9iaikge1xuICB2YXIgaW1nU2V0dGluZ3MgPSBvYmouaW1hZ2U7XG5cbiAgaW1nU2V0dGluZ3MuYnVja2V0ID0gcmVxdWlyZShcIi4uL2NvbmZpZy9lbnZcIik7XG5cbiAgdmFyIGlkID0gb2JqLmlkLnJlcGxhY2Uob2JqLnByZWZpeCwgXCJcIik7XG5cbiAgcmV0dXJuIFwiaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL1wiICsgaW1nU2V0dGluZ3MuYnVja2V0ICsgXCIvXCIgKyBpbWdTZXR0aW5ncy5iYXNlX3BhdGggKyBpZCArIFwiL1wiICsgaW1nU2V0dGluZ3MuZmlsZW5hbWUgKyBcIi5cIiArIGltZ1NldHRpbmdzLmV4dGVuc2lvbjtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIGNoYXJ0IG9iamVjdCBhbmQgY29udGFpbmVyLCBnZW5lcmF0ZSBhbmQgYXBwZW5kIGEgdGh1bWJuYWlsXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlVGh1bWIoY29udGFpbmVyLCBvYmosIHNldHRpbmdzKSB7XG5cbiAgdmFyIGltZ1NldHRpbmdzID0gc2V0dGluZ3MuaW1hZ2U7XG5cbiAgdmFyIGNvbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lciksXG4gICAgICBmYWxsYmFjayA9IGNvbnQucXVlcnlTZWxlY3RvcihcIi5cIiArIHNldHRpbmdzLnByZWZpeCArIFwiYmFzZTY0aW1nXCIpO1xuXG4gIGlmIChpbWdTZXR0aW5ncyAmJiBpbWdTZXR0aW5ncy5lbmFibGUgJiYgb2JqLmRhdGEuaWQpIHtcblxuICAgIHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsIGdldFRodW1ibmFpbFBhdGgob2JqKSk7XG4gICAgaW1nLnNldEF0dHJpYnV0ZSgnYWx0Jywgb2JqLmRhdGEuaGVhZGluZyk7XG4gICAgaW1nLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBzZXR0aW5ncy5wcmVmaXggKyBcInRodW1ibmFpbFwiKTtcblxuICAgIGNvbnQuYXBwZW5kQ2hpbGQoaW1nKTtcblxuICB9IGVsc2UgaWYgKGZhbGxiYWNrKSB7XG5cbiAgICBmYWxsYmFjay5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gY3N2VG9UYWJsZSh0YXJnZXQsIGRhdGEpIHtcbiAgdmFyIHBhcnNlZENTViA9IGQzLmNzdi5wYXJzZVJvd3MoZGF0YSk7XG5cbiAgdGFyZ2V0LmFwcGVuZChcInRhYmxlXCIpLnNlbGVjdEFsbChcInRyXCIpXG4gICAgLmRhdGEocGFyc2VkQ1NWKS5lbnRlcigpXG4gICAgLmFwcGVuZChcInRyXCIpLnNlbGVjdEFsbChcInRkXCIpXG4gICAgLmRhdGEoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSkuZW50ZXIoKVxuICAgIC5hcHBlbmQoXCJ0ZFwiKVxuICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pO1xufVxuXG5mdW5jdGlvbiBkYXRlRm9ybWF0dGVyKHNlbGVjdGlvbiwgY3R4LCBtb250aHMsIGRhdGEpIHtcblxuICB2YXIgZE1vbnRoLFxuICAgICAgZERhdGUsXG4gICAgICBkWWVhcixcbiAgICAgIGRIb3VyLFxuICAgICAgZE1pbnV0ZTtcblxuICBzZWxlY3Rpb24udGV4dChmdW5jdGlvbihkKSB7XG4gICAgdmFyIGRhdGUgPSAhZGF0YSA/IGQua2V5IDogZGF0YTtcbiAgICB2YXIgZFN0cjtcbiAgICBzd2l0Y2ggKGN0eCkge1xuICAgICAgY2FzZSBcInllYXJzXCI6XG4gICAgICAgIGRTdHIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuICAgICAgICBkTW9udGggPSBtb250aHNbZGF0ZS5nZXRNb250aCgpXTtcbiAgICAgICAgZERhdGUgPSBkYXRlLmdldERhdGUoKTtcbiAgICAgICAgZFllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGRTdHIgPSBkTW9udGggKyBcIiBcIiArIGREYXRlICsgXCIsIFwiICsgZFllYXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIndlZWtzXCI6XG4gICAgICBjYXNlIFwiZGF5c1wiOlxuICAgICAgICBkTW9udGggPSBtb250aHNbZGF0ZS5nZXRNb250aCgpXTtcbiAgICAgICAgZERhdGUgPSBkYXRlLmdldERhdGUoKTtcbiAgICAgICAgZFllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGRTdHIgPSBkTW9udGggKyBcIiBcIiArIGREYXRlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJob3Vyc1wiOlxuXG4gICAgICAgIGREYXRlID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgICAgIGRIb3VyID0gZGF0ZS5nZXRIb3VycygpO1xuICAgICAgICBkTWludXRlID0gZGF0ZS5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgdmFyIGRIb3VyU3RyLFxuICAgICAgICAgIGRNaW51dGVTdHI7XG5cbiAgICAgICAgLy8gQ29udmVydCBmcm9tIDI0aCB0aW1lXG4gICAgICAgIHZhciBzdWZmaXggPSAoZEhvdXIgPj0gMTIpID8gJ3AubS4nIDogJ2EubS4nO1xuXG4gICAgICAgIGlmIChkSG91ciA9PT0gMCkge1xuICAgICAgICAgIGRIb3VyU3RyID0gMTI7XG4gICAgICAgIH0gZWxzZSBpZiAoZEhvdXIgPiAxMikge1xuICAgICAgICAgIGRIb3VyU3RyID0gZEhvdXIgLSAxMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkSG91clN0ciA9IGRIb3VyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBtaW51dGVzIGZvbGxvdyBHbG9iZSBzdHlsZVxuICAgICAgICBpZiAoZE1pbnV0ZSA9PT0gMCkge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnJztcbiAgICAgICAgfSBlbHNlIGlmIChkTWludXRlIDwgMTApIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJzowJyArIGRNaW51dGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICc6JyArIGRNaW51dGU7XG4gICAgICAgIH1cblxuICAgICAgICBkU3RyID0gZEhvdXJTdHIgKyBkTWludXRlU3RyICsgJyAnICsgc3VmZml4O1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZFN0ciA9IGRhdGU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBkU3RyO1xuXG4gIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWJvdW5jZTogZGVib3VuY2UsXG4gIGNsZWFyQ2hhcnQ6IGNsZWFyQ2hhcnQsXG4gIGNsZWFyT2JqOiBjbGVhck9iaixcbiAgY2xlYXJEcmF3bjogY2xlYXJEcmF3bixcbiAgZ2V0Qm91bmRpbmc6IGdldEJvdW5kaW5nLFxuICBUaW1lT2JqOiBUaW1lT2JqLFxuICB3cmFwVGV4dDogd3JhcFRleHQsXG4gIHRpbWVEaWZmOiB0aW1lRGlmZixcbiAgdGltZUludGVydmFsOiB0aW1lSW50ZXJ2YWwsXG4gIGdldFRyYW5zbGF0ZVhZOiBnZXRUcmFuc2xhdGVYWSxcbiAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXG4gIHN2Z1Rlc3Q6IHN2Z1Rlc3QsXG4gIGdldFRodW1ibmFpbFBhdGg6IGdldFRodW1ibmFpbFBhdGgsXG4gIGdlbmVyYXRlVGh1bWI6IGdlbmVyYXRlVGh1bWIsXG4gIGNzdlRvVGFibGU6IGNzdlRvVGFibGUsXG4gIGRhdGVGb3JtYXR0ZXI6IGRhdGVGb3JtYXR0ZXIsXG4gIGRhdGFQYXJzZTogcmVxdWlyZShcIi4vZGF0YXBhcnNlXCIpLFxuICBmYWN0b3J5OiByZXF1aXJlKFwiLi9mYWN0b3J5XCIpXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy91dGlscy91dGlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIHMzX2J1Y2tldCBpcyBkZWZpbmVkIGluIHdlYnBhY2suY29uZmlnLmpzXG5tb2R1bGUuZXhwb3J0cyA9IHMzX2J1Y2tldDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY29uZmlnL2Vudi5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogRGF0YSBwYXJzaW5nIG1vZHVsZS4gVGFrZXMgYSBDU1YgYW5kIHR1cm5zIGl0IGludG8gYW4gT2JqZWN0LCBhbmQgb3B0aW9uYWxseSBkZXRlcm1pbmVzIHRoZSBmb3JtYXR0aW5nIHRvIHVzZSB3aGVuIHBhcnNpbmcgZGF0ZXMuXG4gKiBAbW9kdWxlIHV0aWxzL2RhdGFwYXJzZVxuICogQHNlZSBtb2R1bGU6dXRpbHMvZmFjdG9yeVxuICovXG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgc2NhbGUgcmV0dXJucyBhbiBpbnB1dCBkYXRlIG9yIG5vdC5cbiAqIEBwYXJhbSAge1N0cmluZ30gc2NhbGVUeXBlICAgICAgVGhlIHR5cGUgb2Ygc2NhbGUuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGRlZmF1bHRGb3JtYXQgIEZvcm1hdCBzZXQgYnkgdGhlIGNoYXJ0IHRvb2wgc2V0dGluZ3MuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGRlY2xhcmVkRm9ybWF0IEZvcm1hdCBwYXNzZWQgYnkgdGhlIGNoYXJ0IGVtYmVkIGNvZGUsIGlmIHRoZXJlIGlzIG9uZVxuICogQHJldHVybiB7U3RyaW5nfFVuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gaW5wdXREYXRlKHNjYWxlVHlwZSwgZGVmYXVsdEZvcm1hdCwgZGVjbGFyZWRGb3JtYXQpIHtcblxuICBpZiAoc2NhbGVUeXBlID09PSBcInRpbWVcIiB8fCBzY2FsZVR5cGUgPT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICByZXR1cm4gZGVjbGFyZWRGb3JtYXQgfHwgZGVmYXVsdEZvcm1hdDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBDU1Ygc3RyaW5nIHVzaW5nIGQzLmNzdi5wYXJzZSgpIGFuZCB0dXJucyBpdCBpbnRvIGFuIGFycmF5IG9mIG9iamVjdHMuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGNzdiAgICAgICAgICAgICBDU1Ygc3RyaW5nIHRvIGJlIHBhcnNlZFxuICogQHBhcmFtICB7U3RyaW5nIGlucHV0RGF0ZUZvcm1hdCBEYXRlIGZvcm1hdCBpbiBEMyBzdHJmdGltZSBzdHlsZSwgaWYgdGhlcmUgaXMgb25lXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGluZGV4ICAgICAgICAgICBWYWx1ZSB0byBpbmRleCB0aGUgZGF0YSB0bywgaWYgdGhlcmUgaXMgb25lXG4gKiBAcmV0dXJuIHsge2NzdjogU3RyaW5nLCBkYXRhOiBBcnJheSwgc2VyaWVzQW1vdW50OiBJbnRlZ2VyLCBrZXlzOiBBcnJheX0gfSAgICAgICAgICAgICAgICAgQW4gb2JqZWN0IHdpdGggdGhlIG9yaWdpbmFsIENTViBzdHJpbmcsIHRoZSBuZXdseS1mb3JtYXR0ZWQgZGF0YSwgdGhlIG51bWJlciBvZiBzZXJpZXMgaW4gdGhlIGRhdGEgYW5kIGFuIGFycmF5IG9mIGtleXMgdXNlZC5cbiAqL1xuZnVuY3Rpb24gcGFyc2UoY3N2LCBpbnB1dERhdGVGb3JtYXQsIGluZGV4LCBzdGFja2VkLCB0eXBlKSB7XG5cbiAgdmFyIGtleXMsIHZhbDtcblxuICB2YXIgZmlyc3RWYWxzID0ge307XG5cbiAgdmFyIGRhdGEgPSBkMy5jc3YucGFyc2UoY3N2LCBmdW5jdGlvbihkLCBpKSB7XG5cbiAgICB2YXIgb2JqID0ge307XG5cbiAgICBpZiAoaSA9PT0gMCkgeyBrZXlzID0gZDMua2V5cyhkKTsgfVxuXG4gICAgaWYgKGlucHV0RGF0ZUZvcm1hdCkge1xuICAgICAgdmFyIGRhdGVGb3JtYXQgPSBkMy50aW1lLmZvcm1hdChpbnB1dERhdGVGb3JtYXQpO1xuICAgICAgb2JqLmtleSA9IGRhdGVGb3JtYXQucGFyc2UoZDMudmFsdWVzKGQpWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqLmtleSA9IGQzLnZhbHVlcyhkKVswXTtcbiAgICB9XG5cbiAgICBvYmouc2VyaWVzID0gW107XG5cbiAgICBmb3IgKHZhciBqID0gMTsgaiA8IGQzLmtleXMoZCkubGVuZ3RoOyBqKyspIHtcblxuICAgICAgdmFyIGtleSA9IGQzLmtleXMoZClbal07XG5cbiAgICAgIGlmIChkW2tleV0gPT09IDAgfHwgZFtrZXldID09PSBcIlwiKSB7XG4gICAgICAgIGRba2V5XSA9IFwiX191bmRlZmluZWRfX1wiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5kZXgpIHtcblxuICAgICAgICBpZiAoaSA9PT0gMCAmJiAhZmlyc3RWYWxzW2tleV0pIHtcbiAgICAgICAgICBmaXJzdFZhbHNba2V5XSA9IGRba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCA9PT0gXCIwXCIpIHtcbiAgICAgICAgICB2YWwgPSAoKGRba2V5XSAvIGZpcnN0VmFsc1trZXldKSAtIDEpICogMTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbCA9IChkW2tleV0gLyBmaXJzdFZhbHNba2V5XSkgKiBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBkW2tleV07XG4gICAgICB9XG5cbiAgICAgIG9iai5zZXJpZXMucHVzaCh7XG4gICAgICAgIHZhbDogdmFsLFxuICAgICAgICBrZXk6IGtleVxuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuXG4gIH0pO1xuXG4gIHZhciBzZXJpZXNBbW91bnQgPSBkYXRhWzBdLnNlcmllcy5sZW5ndGg7XG5cbiAgaWYgKHN0YWNrZWQpIHtcbiAgICBpZiAodHlwZSA9PT0gXCJzdHJlYW1cIikge1xuICAgICAgdmFyIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKCkub2Zmc2V0KFwic2lsaG91ZXR0ZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKCk7XG4gICAgfVxuICAgIHZhciBzdGFja2VkRGF0YSA9IHN0YWNrKGQzLnJhbmdlKHNlcmllc0Ftb3VudCkubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsZWdlbmQ6IGtleXNba2V5ICsgMV0sXG4gICAgICAgICAgeDogZC5rZXksXG4gICAgICAgICAgeTogTnVtYmVyKGQuc2VyaWVzW2tleV0udmFsKSxcbiAgICAgICAgICByYXc6IGRcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY3N2OiBjc3YsXG4gICAgZGF0YTogZGF0YSxcbiAgICBzZXJpZXNBbW91bnQ6IHNlcmllc0Ftb3VudCxcbiAgICBrZXlzOiBrZXlzLFxuICAgIHN0YWNrZWREYXRhOiBzdGFja2VkRGF0YSB8fCB1bmRlZmluZWRcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5wdXREYXRlOiBpbnB1dERhdGUsXG4gIHBhcnNlOiBwYXJzZVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvdXRpbHMvZGF0YXBhcnNlLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBSZWNpcGUgZmFjdG9yIGZhY3RvcnkgbW9kdWxlLlxuICogQG1vZHVsZSB1dGlscy9mYWN0b3J5XG4gKiBAc2VlIG1vZHVsZTpjaGFydHMvaW5kZXhcbiAqL1xuXG4vKipcbiAqIEdpdmVuIGEgXCJyZWNpcGVcIiBvZiBzZXR0aW5ncyBmb3IgYSBjaGFydCwgcGF0Y2ggaXQgd2l0aCBhbiBvYmplY3QgYW5kIHBhcnNlIHRoZSBkYXRhIGZvciB0aGUgY2hhcnQuXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZpbmFsIGNoYXJ0IHJlY2lwZS5cbiAqL1xuZnVuY3Rpb24gUmVjaXBlRmFjdG9yeShzZXR0aW5ncywgb2JqKSB7XG4gIHZhciBkYXRhUGFyc2UgPSByZXF1aXJlKFwiLi9kYXRhcGFyc2VcIik7XG4gIHZhciBoZWxwZXJzID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvaGVscGVyc1wiKTtcblxuICB2YXIgdCA9IGhlbHBlcnMuZXh0ZW5kKHNldHRpbmdzKTsgLy8gc2hvcnQgZm9yIHRlbXBsYXRlXG5cbiAgdmFyIGVtYmVkID0gb2JqLmRhdGE7XG4gIHZhciBjaGFydCA9IGVtYmVkLmNoYXJ0O1xuXG4gIC8vIEknbSBub3QgYSBiaWcgZmFuIG9mIGluZGVudGluZyBzdHVmZiBsaWtlIHRoaXNcbiAgLy8gKGxvb2tpbmcgYXQgeW91LCBQZXJlaXJhKSwgYnV0IEknbSBtYWtpbmcgYW4gZXhjZXB0aW9uXG4gIC8vIGluIHRoaXMgY2FzZSBiZWNhdXNlIG15IGV5ZXMgd2VyZSBibGVlZGluZy5cblxuICB0LmRpc3BhdGNoICAgICAgICAgPSBvYmouZGlzcGF0Y2g7XG5cbiAgdC52ZXJzaW9uICAgICAgICAgID0gZW1iZWQudmVyc2lvbiAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC52ZXJzaW9uO1xuICB0LmlkICAgICAgICAgICAgICAgPSBvYmouaWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmlkO1xuICB0LmhlYWRpbmcgICAgICAgICAgPSBlbWJlZC5oZWFkaW5nICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmhlYWRpbmc7XG4gIHQucXVhbGlmaWVyICAgICAgICA9IGVtYmVkLnF1YWxpZmllciAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQucXVhbGlmaWVyO1xuICB0LnNvdXJjZSAgICAgICAgICAgPSBlbWJlZC5zb3VyY2UgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LnNvdXJjZTtcbiAgdC5kZWNrICAgICAgICAgICAgID0gZW1iZWQuZGVjayAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5kZWNrXG4gIHQuY3VzdG9tQ2xhc3MgICAgICA9IGNoYXJ0LmNsYXNzICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuY3VzdG9tQ2xhc3M7XG5cbiAgdC54QXhpcyAgICAgICAgICAgID0gaGVscGVycy5leHRlbmQodC54QXhpcywgY2hhcnQueF9heGlzKSAgfHwgdC54QXhpcztcbiAgdC55QXhpcyAgICAgICAgICAgID0gaGVscGVycy5leHRlbmQodC55QXhpcywgY2hhcnQueV9heGlzKSAgfHwgdC55QXhpcztcblxuICB2YXIgbyA9IHQub3B0aW9ucyxcbiAgICAgIGNvID0gY2hhcnQub3B0aW9ucztcblxuICAvLyAgXCJvcHRpb25zXCIgYXJlYSBvZiBlbWJlZCBjb2RlXG4gIG8udHlwZSAgICAgICAgICAgICA9IGNoYXJ0Lm9wdGlvbnMudHlwZSAgICAgICAgICAgICAgICAgICAgIHx8IG8udHlwZTtcbiAgby5pbnRlcnBvbGF0aW9uICAgID0gY2hhcnQub3B0aW9ucy5pbnRlcnBvbGF0aW9uICAgICAgICAgICAgfHwgby5pbnRlcnBvbGF0aW9uO1xuXG4gIG8uc29jaWFsICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5zb2NpYWwpID09PSB0cnVlID8gY28uc29jaWFsICAgICAgICAgICA6IG8uc29jaWFsO1xuICBvLnNoYXJlX2RhdGEgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnNoYXJlX2RhdGEpID09PSB0cnVlID8gY28uc2hhcmVfZGF0YSAgOiBvLnNoYXJlX2RhdGE7XG4gIG8uc3RhY2tlZCAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5zdGFja2VkKSA9PT0gdHJ1ZSA/IGNvLnN0YWNrZWQgICAgICAgICA6IG8uc3RhY2tlZDtcbiAgby5leHBhbmRlZCAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmV4cGFuZGVkKSA9PT0gdHJ1ZSA/IGNvLmV4cGFuZGVkICAgICAgIDogby5leHBhbmRlZDtcbiAgby5oZWFkICAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmhlYWQpID09PSB0cnVlID8gY28uaGVhZCAgICAgICAgICAgICAgIDogby5oZWFkO1xuICBvLmRlY2sgICAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uZGVjaykgPT09IHRydWUgPyBjby5kZWNrICAgICAgICAgICAgICAgOiBvLmRlY2s7XG4gIG8ubGVnZW5kICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5sZWdlbmQpID09PSB0cnVlID8gY28ubGVnZW5kICAgICAgICAgICA6IG8ubGVnZW5kO1xuICBvLnF1YWxpZmllciAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ucXVhbGlmaWVyKSA9PT0gdHJ1ZSA/IGNvLnF1YWxpZmllciAgICAgOiBvLnF1YWxpZmllcjtcbiAgby5mb290ZXIgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmZvb3RlcikgPT09IHRydWUgPyBjby5mb290ZXIgICAgICAgICAgIDogby5mb290ZXI7XG4gIG8ueF9heGlzICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby54X2F4aXMpID09PSB0cnVlID8gY28ueF9heGlzICAgICAgICAgICA6IG8ueF9heGlzO1xuICBvLnlfYXhpcyAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ueV9heGlzKSA9PT0gdHJ1ZSA/IGNvLnlfYXhpcyAgICAgICAgICAgOiBvLnlfYXhpcztcbiAgby50aXBzICAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnRpcHMpID09PSB0cnVlID8gY28udGlwcyAgICAgICAgICAgICAgIDogby50aXBzO1xuICBvLmFubm90YXRpb25zID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uYW5ub3RhdGlvbnMpID09PSB0cnVlID8gY28uYW5ub3RhdGlvbnMgOiBvLmFubm90YXRpb25zO1xuICBvLnJhbmdlICAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ucmFuZ2UpID09PSB0cnVlID8gY28ucmFuZ2UgICAgICAgICAgICAgOiBvLnJhbmdlO1xuICBvLnNlcmllcyAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uc2VyaWVzKSA9PT0gdHJ1ZSA/IGNvLnNlcmllcyAgICAgICAgICAgOiBvLnNlcmllcztcbiAgby5pbmRleCAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmluZGV4ZWQpID09PSB0cnVlID8gY28uaW5kZXhlZCAgICAgICAgIDogby5pbmRleDtcblxuICAvLyAgdGhlc2UgYXJlIHNwZWNpZmljIHRvIHRoZSB0IG9iamVjdCBhbmQgZG9uJ3QgZXhpc3QgaW4gdGhlIGVtYmVkXG4gIHQuYmFzZUNsYXNzICAgICAgICA9IGVtYmVkLmJhc2VDbGFzcyAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuYmFzZUNsYXNzO1xuXG4gIHQuZGltZW5zaW9ucy53aWR0aCA9IGVtYmVkLndpZHRoICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuZGltZW5zaW9ucy53aWR0aDtcblxuICB0LnByZWZpeCAgICAgICAgICAgPSBjaGFydC5wcmVmaXggICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LnByZWZpeDtcbiAgdC5leHBvcnRhYmxlICAgICAgID0gY2hhcnQuZXhwb3J0YWJsZSAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5leHBvcnRhYmxlO1xuICB0LmVkaXRhYmxlICAgICAgICAgPSBjaGFydC5lZGl0YWJsZSAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmVkaXRhYmxlO1xuXG4gIGlmICh0LmV4cG9ydGFibGUpIHtcbiAgICB0LmRpbWVuc2lvbnMud2lkdGggPSBjaGFydC5leHBvcnRhYmxlLndpZHRoIHx8IGVtYmVkLndpZHRoIHx8IHQuZGltZW5zaW9ucy53aWR0aDtcbiAgICB0LmRpbWVuc2lvbnMuaGVpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBjaGFydC5leHBvcnRhYmxlLmhlaWdodDsgfVxuICAgIHQuZGltZW5zaW9ucy5tYXJnaW4gPSBjaGFydC5leHBvcnRhYmxlLm1hcmdpbiB8fCB0LmRpbWVuc2lvbnMubWFyZ2luO1xuICB9XG5cbiAgaWYgKGNoYXJ0Lmhhc0hvdXJzKSB7IHQuZGF0ZUZvcm1hdCArPSBcIiBcIiArIHQudGltZUZvcm1hdDsgfVxuICB0Lmhhc0hvdXJzICAgICAgICAgPSBjaGFydC5oYXNIb3VycyAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0Lmhhc0hvdXJzO1xuICB0LmRhdGVGb3JtYXQgICAgICAgPSBjaGFydC5kYXRlRm9ybWF0ICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmRhdGVGb3JtYXQ7XG5cbiAgdC5kYXRlRm9ybWF0ID0gZGF0YVBhcnNlLmlucHV0RGF0ZSh0LnhBeGlzLnNjYWxlLCB0LmRhdGVGb3JtYXQsIGNoYXJ0LmRhdGVfZm9ybWF0KTtcbiAgdC5kYXRhID0gZGF0YVBhcnNlLnBhcnNlKGNoYXJ0LmRhdGEsIHQuZGF0ZUZvcm1hdCwgby5pbmRleCwgby5zdGFja2VkLCBvLnR5cGUpIHx8IHQuZGF0YTtcblxuICByZXR1cm4gdDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlY2lwZUZhY3Rvcnk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL3V0aWxzL2ZhY3RvcnkuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIEhlbHBlcnMgdGhhdCBtYW5pcHVsYXRlIGFuZCBjaGVjayBwcmltaXRpdmVzLiBOb3RoaW5nIEQzLXNwZWNpZmljIGhlcmUuXG4gKiBAbW9kdWxlIGhlbHBlcnMvaGVscGVyc1xuICovXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIG90aGVyd2lzZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzSW50ZWdlcih4KSB7XG4gIHJldHVybiB4ICUgMSA9PT0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBmbG9hdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRmxvYXQobikge1xuICByZXR1cm4gbiA9PT0gK24gJiYgbiAhPT0gKG58MCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGEgdmFsdWUgaXMgZW1wdHkuIFdvcmtzIGZvciBPYmplY3RzLCBBcnJheXMsIFN0cmluZ3MgYW5kIEludGVnZXJzLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWwpIHtcbiAgaWYgKHZhbC5jb25zdHJ1Y3RvciA9PSBPYmplY3QpIHtcbiAgICBmb3IgKHZhciBwcm9wIGluIHZhbCkge1xuICAgICAgaWYgKHZhbC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAodmFsLmNvbnN0cnVjdG9yID09IEFycmF5KSB7XG4gICAgcmV0dXJuICF2YWwubGVuZ3RoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAhdmFsO1xuICB9XG59XG5cbi8qKlxuICogU2ltcGxlIGNoZWNrIGZvciB3aGV0aGVyIGEgdmFsdWUgaXMgdW5kZWZpbmVkIG9yIG5vdFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBmYWxzZTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0d28gYXJyYXlzLCByZXR1cm5zIG9ubHkgdW5pcXVlIHZhbHVlcyBpbiB0aG9zZSBhcnJheXMuXG4gKiBAcGFyYW0gIHtBcnJheX0gYTFcbiAqIEBwYXJhbSAge0FycmF5fSBhMlxuICogQHJldHVybiB7QXJyYXl9ICAgIEFycmF5IG9mIHVuaXF1ZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RGlmZihhMSwgYTIpIHtcbiAgdmFyIG8xID0ge30sIG8yID0ge30sIGRpZmY9IFtdLCBpLCBsZW4sIGs7XG4gIGZvciAoaSA9IDAsIGxlbiA9IGExLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7IG8xW2ExW2ldXSA9IHRydWU7IH1cbiAgZm9yIChpID0gMCwgbGVuID0gYTIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHsgbzJbYTJbaV1dID0gdHJ1ZTsgfVxuICBmb3IgKGsgaW4gbzEpIHsgaWYgKCEoayBpbiBvMikpIHsgZGlmZi5wdXNoKGspOyB9IH1cbiAgZm9yIChrIGluIG8yKSB7IGlmICghKGsgaW4gbzEpKSB7IGRpZmYucHVzaChrKTsgfSB9XG4gIHJldHVybiBkaWZmO1xufVxuXG4vKipcbiAqIE9wcG9zaXRlIG9mIGFycmF5RGlmZigpLCB0aGlzIHJldHVybnMgb25seSBjb21tb24gZWxlbWVudHMgYmV0d2VlbiBhcnJheXMuXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyMVxuICogQHBhcmFtICB7QXJyYXl9IGFycjJcbiAqIEByZXR1cm4ge0FycmF5fSAgICAgIEFycmF5IG9mIGNvbW1vbiB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U2FtZShhMSwgYTIpIHtcbiAgdmFyIHJldCA9IFtdO1xuICBmb3IgKGkgaW4gYTEpIHtcbiAgICBpZiAoYTIuaW5kZXhPZiggYTFbaV0gKSA+IC0xKXtcbiAgICAgIHJldC5wdXNoKCBhMVtpXSApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgJ2Zyb20nIG9iamVjdCB3aXRoIG1lbWJlcnMgZnJvbSAndG8nLiBJZiAndG8nIGlzIG51bGwsIGEgZGVlcCBjbG9uZSBvZiAnZnJvbScgaXMgcmV0dXJuZWRcbiAqIEBwYXJhbSAgeyp9IGZyb21cbiAqIEBwYXJhbSAgeyp9IHRvXG4gKiBAcmV0dXJuIHsqfSAgICAgIENsb25lZCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChmcm9tLCB0bykge1xuICBpZiAoZnJvbSA9PSBudWxsIHx8IHR5cGVvZiBmcm9tICE9IFwib2JqZWN0XCIpIHJldHVybiBmcm9tO1xuICBpZiAoZnJvbS5jb25zdHJ1Y3RvciAhPSBPYmplY3QgJiYgZnJvbS5jb25zdHJ1Y3RvciAhPSBBcnJheSkgcmV0dXJuIGZyb207XG4gIGlmIChmcm9tLmNvbnN0cnVjdG9yID09IERhdGUgfHwgZnJvbS5jb25zdHJ1Y3RvciA9PSBSZWdFeHAgfHwgZnJvbS5jb25zdHJ1Y3RvciA9PSBGdW5jdGlvbiB8fFxuICAgIGZyb20uY29uc3RydWN0b3IgPT0gU3RyaW5nIHx8IGZyb20uY29uc3RydWN0b3IgPT0gTnVtYmVyIHx8IGZyb20uY29uc3RydWN0b3IgPT0gQm9vbGVhbilcbiAgICByZXR1cm4gbmV3IGZyb20uY29uc3RydWN0b3IoZnJvbSk7XG5cbiAgdG8gPSB0byB8fCBuZXcgZnJvbS5jb25zdHJ1Y3RvcigpO1xuXG4gIGZvciAodmFyIG5hbWUgaW4gZnJvbSkge1xuICAgIHRvW25hbWVdID0gdHlwZW9mIHRvW25hbWVdID09IFwidW5kZWZpbmVkXCIgPyBleHRlbmQoZnJvbVtuYW1lXSwgbnVsbCkgOiB0b1tuYW1lXTtcbiAgfVxuXG4gIHJldHVybiB0bztcbn1cblxuLyoqXG4gKiBDb21wYXJlcyB0d28gb2JqZWN0cywgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHVuaXF1ZSBrZXlzLlxuICogQHBhcmFtICB7T2JqZWN0fSBvMVxuICogQHBhcmFtICB7T2JqZWN0fSBvMlxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIHVuaXF1ZUtleXMobzEsIG8yKSB7XG4gIHJldHVybiBhcnJheURpZmYoZDMua2V5cyhvMSksIGQzLmtleXMobzIpKTtcbn1cblxuLyoqXG4gKiBDb21wYXJlcyB0d28gb2JqZWN0cywgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGNvbW1vbiBrZXlzLlxuICogQHBhcmFtICB7T2JqZWN0fSBvMVxuICogQHBhcmFtICB7T2JqZWN0fSBvMlxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIHNhbWVLZXlzKG8xLCBvMikge1xuICByZXR1cm4gYXJyYXlTYW1lKGQzLmtleXMobzEpLCBkMy5rZXlzKG8yKSk7XG59XG5cbi8qKlxuICogSWYgYSBzdHJpbmcgaXMgdW5kZWZpbmVkLCByZXR1cm4gYW4gZW1wdHkgc3RyaW5nIGluc3RlYWQuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBjbGVhblN0cihzdHIpe1xuICBpZiAoc3RyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ludGVnZXI6IGlzSW50ZWdlcixcbiAgaXNGbG9hdDogaXNGbG9hdCxcbiAgaXNFbXB0eTogaXNFbXB0eSxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgYXJyYXlEaWZmOiBhcnJheURpZmYsXG4gIGFycmF5U2FtZTogYXJyYXlTYW1lLFxuICB1bmlxdWVLZXlzOiB1bmlxdWVLZXlzLFxuICBzYW1lS2V5czogc2FtZUtleXMsXG4gIGNsZWFuU3RyOiBjbGVhblN0clxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvaGVscGVycy9oZWxwZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDaGFydCBjb250cnVjdGlvbiBtYW5hZ2VyIG1vZHVsZS5cbiAqIEBtb2R1bGUgY2hhcnRzL21hbmFnZXJcbiAqL1xuXG4vKipcbiAqIE1hbmFnZXMgdGhlIHN0ZXAtYnktc3RlcCBjcmVhdGlvbiBvZiBhIGNoYXJ0LCBhbmQgcmV0dXJucyB0aGUgZnVsbCBjb25maWd1cmF0aW9uIGZvciB0aGUgY2hhcnQsIGluY2x1ZGluZyByZWZlcmVuY2VzIHRvIG5vZGVzLCBzY2FsZXMsIGF4ZXMsIGV0Yy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb250YWluZXIgU2VsZWN0b3IgZm9yIHRoZSBjb250YWluZXIgdGhlIGNoYXJ0IHdpbGwgYmUgZHJhd24gaW50by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogICAgICAgT2JqZWN0IHRoYXQgY29udGFpbnMgc2V0dGluZ3MgZm9yIHRoZSBjaGFydC5cbiAqL1xuZnVuY3Rpb24gQ2hhcnRNYW5hZ2VyKGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIFJlY2lwZSA9IHJlcXVpcmUoXCIuLi91dGlscy9mYWN0b3J5XCIpLFxuICAgICAgc2V0dGluZ3MgPSByZXF1aXJlKFwiLi4vY29uZmlnL2NoYXJ0LXNldHRpbmdzXCIpLFxuICAgICAgY29tcG9uZW50cyA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvY29tcG9uZW50c1wiKTtcblxuICB2YXIgY2hhcnRSZWNpcGUgPSBuZXcgUmVjaXBlKHNldHRpbmdzLCBvYmopO1xuXG4gIHZhciByZW5kZXJlZCA9IGNoYXJ0UmVjaXBlLnJlbmRlcmVkID0ge307XG5cbiAgLy8gY2hlY2sgdGhhdCBlYWNoIHNlY3Rpb24gaXMgbmVlZGVkXG5cbiAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuaGVhZCkge1xuICAgIHJlbmRlcmVkLmhlYWRlciA9IGNvbXBvbmVudHMuaGVhZGVyKGNvbnRhaW5lciwgY2hhcnRSZWNpcGUpO1xuICB9XG5cbiAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuZm9vdGVyKSB7XG4gICAgcmVuZGVyZWQuZm9vdGVyID0gY29tcG9uZW50cy5mb290ZXIoY29udGFpbmVyLCBjaGFydFJlY2lwZSk7XG4gIH1cblxuICB2YXIgbm9kZSA9IGNvbXBvbmVudHMuYmFzZShjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcblxuICByZW5kZXJlZC5jb250YWluZXIgPSBub2RlO1xuXG4gIHJlbmRlcmVkLnBsb3QgPSBjb21wb25lbnRzLnBsb3Qobm9kZSwgY2hhcnRSZWNpcGUpO1xuXG4gIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLnF1YWxpZmllcikge1xuICAgIHJlbmRlcmVkLnF1YWxpZmllciA9IGNvbXBvbmVudHMucXVhbGlmaWVyKG5vZGUsIGNoYXJ0UmVjaXBlKTtcbiAgfVxuXG4gIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLnRpcHMpIHtcbiAgICByZW5kZXJlZC50aXBzID0gY29tcG9uZW50cy50aXBzKG5vZGUsIGNoYXJ0UmVjaXBlKTtcbiAgfVxuXG4gIGlmICghY2hhcnRSZWNpcGUuZWRpdGFibGUgJiYgIWNoYXJ0UmVjaXBlLmV4cG9ydGFibGUpIHtcbiAgICBpZiAoY2hhcnRSZWNpcGUub3B0aW9ucy5zaGFyZV9kYXRhKSB7XG4gICAgICByZW5kZXJlZC5zaGFyZURhdGEgPSBjb21wb25lbnRzLnNoYXJlRGF0YShjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcbiAgICB9XG4gICAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuc29jaWFsKSB7XG4gICAgICByZW5kZXJlZC5zb2NpYWwgPSBjb21wb25lbnRzLnNvY2lhbChjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcbiAgICB9XG4gIH1cblxuICBpZiAoY2hhcnRSZWNpcGUuQ1VTVE9NKSB7XG4gICAgdmFyIGN1c3RvbSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jdXN0b20vY3VzdG9tLmpzXCIpO1xuICAgIHJlbmRlcmVkLmN1c3RvbSA9IGN1c3RvbShub2RlLCBjaGFydFJlY2lwZSwgcmVuZGVyZWQpO1xuICB9XG5cbiAgcmV0dXJuIGNoYXJ0UmVjaXBlO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0TWFuYWdlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL21hbmFnZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgY29tcG9uZW50cyA9IHtcbiAgYmFzZTogcmVxdWlyZShcIi4vYmFzZVwiKSxcbiAgaGVhZGVyOiByZXF1aXJlKFwiLi9oZWFkZXJcIiksXG4gIGZvb3RlcjogcmVxdWlyZShcIi4vZm9vdGVyXCIpLFxuICBwbG90OiByZXF1aXJlKFwiLi9wbG90XCIpLFxuICBxdWFsaWZpZXI6IHJlcXVpcmUoXCIuL3F1YWxpZmllclwiKSxcbiAgYXhpczogcmVxdWlyZShcIi4vYXhpc1wiKSxcbiAgc2NhbGU6IHJlcXVpcmUoXCIuL3NjYWxlXCIpLFxuICB0aXBzOiByZXF1aXJlKFwiLi90aXBzXCIpLFxuICBzb2NpYWw6IHJlcXVpcmUoXCIuL3NvY2lhbFwiKSxcbiAgc2hhcmVEYXRhOiByZXF1aXJlKFwiLi9zaGFyZS1kYXRhXCIpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvbmVudHM7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2NvbXBvbmVudHMuanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gYXBwZW5kKGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIG1hcmdpbiA9IG9iai5kaW1lbnNpb25zLm1hcmdpbjtcblxuICB2YXIgY2hhcnRCYXNlID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAuaW5zZXJ0KFwic3ZnXCIsIFwiLlwiICsgb2JqLnByZWZpeCArIFwiY2hhcnRfc291cmNlXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmouYmFzZUNsYXNzKCkgKyBcIl9zdmcgXCIgKyBvYmoucHJlZml4ICsgb2JqLmN1c3RvbUNsYXNzICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJ0eXBlX1wiICsgb2JqLm9wdGlvbnMudHlwZSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzLVwiICsgb2JqLmRhdGEuc2VyaWVzQW1vdW50LFxuICAgICAgXCJ3aWR0aFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCxcbiAgICAgIFwiaGVpZ2h0XCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSxcbiAgICAgIFwidmVyc2lvblwiOiAxLjEsXG4gICAgICBcInhtbG5zXCI6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgIH0pO1xuXG4gIC8vIGJhY2tncm91bmQgcmVjdFxuICBjaGFydEJhc2VcbiAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiYmdcIixcbiAgICAgIFwieFwiOiAwLFxuICAgICAgXCJ5XCI6IDAsXG4gICAgICBcIndpZHRoXCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSxcbiAgICAgIFwiaGVpZ2h0XCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCksXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCJcbiAgICB9KTtcblxuICB2YXIgZ3JhcGggPSBjaGFydEJhc2UuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiZ3JhcGhcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIlxuICAgIH0pO1xuXG4gIHJldHVybiBncmFwaDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGVuZDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvYmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBoZWFkZXJDb21wb25lbnQoY29udGFpbmVyLCBvYmopIHtcblxuICB2YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL2hlbHBlcnNcIik7XG5cbiAgdmFyIGhlYWRlckdyb3VwID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiY2hhcnRfdGl0bGUgXCIgKyBvYmoucHJlZml4ICsgb2JqLmN1c3RvbUNsYXNzLCB0cnVlKVxuXG4gIC8vIGhhY2sgbmVjZXNzYXJ5IHRvIGVuc3VyZSBQREYgZmllbGRzIGFyZSBzaXplZCBwcm9wZXJseVxuICBpZiAob2JqLmV4cG9ydGFibGUpIHtcbiAgICBoZWFkZXJHcm91cC5zdHlsZShcIndpZHRoXCIsIG9iai5leHBvcnRhYmxlLndpZHRoICsgXCJweFwiKTtcbiAgfVxuXG4gIGlmIChvYmouaGVhZGluZyAhPT0gXCJcIiB8fCBvYmouZWRpdGFibGUpIHtcbiAgICB2YXIgaGVhZGVyVGV4dCA9IGhlYWRlckdyb3VwXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImNoYXJ0X3RpdGxlLXRleHRcIilcbiAgICAgIC50ZXh0KG9iai5oZWFkaW5nKTtcblxuICAgIGlmIChvYmouZWRpdGFibGUpIHtcbiAgICAgIGhlYWRlclRleHRcbiAgICAgICAgLmF0dHIoXCJjb250ZW50RWRpdGFibGVcIiwgdHJ1ZSlcbiAgICAgICAgLmNsYXNzZWQoXCJlZGl0YWJsZS1jaGFydF90aXRsZVwiLCB0cnVlKTtcbiAgICB9XG5cbiAgfVxuXG4gIHZhciBxdWFsaWZpZXI7XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwiYmFyXCIpIHtcbiAgICBxdWFsaWZpZXIgPSBoZWFkZXJHcm91cFxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBzdHIgPSBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXIgXCIgKyBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXItYmFyXCI7XG4gICAgICAgICAgaWYgKG9iai5lZGl0YWJsZSkge1xuICAgICAgICAgICAgc3RyICs9IFwiIGVkaXRhYmxlLWNoYXJ0X3F1YWxpZmllclwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9LFxuICAgICAgICBcImNvbnRlbnRFZGl0YWJsZVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLmVkaXRhYmxlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnRleHQob2JqLnF1YWxpZmllcik7XG4gIH1cblxuICBpZiAob2JqLmRhdGEua2V5cy5sZW5ndGggPiAyKSB7XG5cbiAgICB2YXIgbGVnZW5kID0gaGVhZGVyR3JvdXAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJjaGFydF9sZWdlbmRcIiwgdHJ1ZSk7XG5cbiAgICB2YXIga2V5cyA9IGhlbHBlcnMuZXh0ZW5kKG9iai5kYXRhLmtleXMpO1xuXG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgZmlyc3QgaXRlbSBhcyBpdCBkb2VzbnQgcmVwcmVzZW50IGEgc2VyaWVzXG4gICAga2V5cy5zaGlmdCgpO1xuXG4gICAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwibXVsdGlsaW5lXCIpIHtcbiAgICAgIGtleXMgPSBba2V5c1swXSwga2V5c1sxXV07XG4gICAgICBsZWdlbmQuY2xhc3NlZChvYmoucHJlZml4ICsgXCJjaGFydF9sZWdlbmQtXCIgKyBvYmoub3B0aW9ucy50eXBlLCB0cnVlKTtcbiAgICB9XG5cbiAgICB2YXIgbGVnZW5kSXRlbSA9IGxlZ2VuZC5zZWxlY3RBbGwoXCJkaXYuXCIgKyBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbVwiKVxuICAgICAgLmRhdGEoa2V5cylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtIFwiICsgb2JqLnByZWZpeCArIFwibGVnZW5kX2l0ZW1fXCIgKyAoaSk7XG4gICAgICB9KTtcblxuICAgIGxlZ2VuZEl0ZW0uYXBwZW5kKFwic3BhblwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbV9pY29uXCIpO1xuXG4gICAgbGVnZW5kSXRlbS5hcHBlbmQoXCJzcGFuXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtX3RleHRcIilcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMuaGVhZGVySGVpZ2h0ID0gaGVhZGVyR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICByZXR1cm4ge1xuICAgIGhlYWRlckdyb3VwOiBoZWFkZXJHcm91cCxcbiAgICBsZWdlbmQ6IGxlZ2VuZCxcbiAgICBxdWFsaWZpZXI6IHF1YWxpZmllclxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGVhZGVyQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9oZWFkZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gZm9vdGVyQ29tcG9uZW50KGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIGZvb3Rlckdyb3VwO1xuXG4gIGlmIChvYmouc291cmNlICE9PSBcIlwiIHx8IG9iai5lZGl0YWJsZSkge1xuICAgIGZvb3Rlckdyb3VwID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImNoYXJ0X3NvdXJjZVwiLCB0cnVlKTtcblxuICAgIC8vIGhhY2sgbmVjZXNzYXJ5IHRvIGVuc3VyZSBQREYgZmllbGRzIGFyZSBzaXplZCBwcm9wZXJseVxuICAgIGlmIChvYmouZXhwb3J0YWJsZSkge1xuICAgICAgZm9vdGVyR3JvdXAuc3R5bGUoXCJ3aWR0aFwiLCBvYmouZXhwb3J0YWJsZS53aWR0aCArIFwicHhcIik7XG4gICAgfVxuXG4gICAgdmFyIGZvb3RlclRleHQgPSBmb290ZXJHcm91cC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiY2hhcnRfc291cmNlLXRleHRcIilcbiAgICAgIC50ZXh0KG9iai5zb3VyY2UpO1xuXG4gICAgaWYgKG9iai5lZGl0YWJsZSkge1xuICAgICAgZm9vdGVyVGV4dFxuICAgICAgICAuYXR0cihcImNvbnRlbnRFZGl0YWJsZVwiLCB0cnVlKVxuICAgICAgICAuY2xhc3NlZChcImVkaXRhYmxlLWNoYXJ0X3NvdXJjZVwiLCB0cnVlKTtcbiAgICB9XG5cbiAgICBvYmouZGltZW5zaW9ucy5mb290ZXJIZWlnaHQgPSBmb290ZXJHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZvb3Rlckdyb3VwOiBmb290ZXJHcm91cFxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vdGVyQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9mb290ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gcGxvdChub2RlLCBvYmopIHtcblxuICB2YXIgZHJhdyA9IHtcbiAgICBsaW5lOiByZXF1aXJlKFwiLi4vdHlwZXMvbGluZVwiKSxcbiAgICBtdWx0aWxpbmU6IHJlcXVpcmUoXCIuLi90eXBlcy9tdWx0aWxpbmVcIiksXG4gICAgc3BhcmtsaW5lOiByZXF1aXJlKFwiLi4vdHlwZXMvc3BhcmtsaW5lXCIpLFxuICAgIGFyZWE6IHJlcXVpcmUoXCIuLi90eXBlcy9hcmVhXCIpLFxuICAgIHN0YWNrZWRBcmVhOiByZXF1aXJlKFwiLi4vdHlwZXMvc3RhY2tlZC1hcmVhXCIpLFxuICAgIGNvbHVtbjogcmVxdWlyZShcIi4uL3R5cGVzL2NvbHVtblwiKSxcbiAgICBiYXI6IHJlcXVpcmUoXCIuLi90eXBlcy9iYXJcIiksXG4gICAgc3RhY2tlZENvbHVtbjogcmVxdWlyZShcIi4uL3R5cGVzL3N0YWNrZWQtY29sdW1uXCIpLFxuICAgIHN0cmVhbWdyYXBoOiByZXF1aXJlKFwiLi4vdHlwZXMvc3RyZWFtZ3JhcGhcIilcbiAgfTtcblxuICB2YXIgY2hhcnRSZWY7XG5cbiAgc3dpdGNoKG9iai5vcHRpb25zLnR5cGUpIHtcblxuICAgIGNhc2UgXCJsaW5lXCI6XG4gICAgICBjaGFydFJlZiA9IGRyYXcubGluZShub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwibXVsdGlsaW5lXCI6XG4gICAgICBjaGFydFJlZiA9IGRyYXcubXVsdGlsaW5lKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJzcGFya2xpbmVcIjpcbiAgICAgIGNoYXJ0UmVmID0gZHJhdy5zcGFya2xpbmUobm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcImFyZWFcIjpcbiAgICAgIGNoYXJ0UmVmID0gb2JqLm9wdGlvbnMuc3RhY2tlZCA/IGRyYXcuc3RhY2tlZEFyZWEobm9kZSwgb2JqKSA6IGRyYXcuYXJlYShub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiYmFyXCI6XG4gICAgICBjaGFydFJlZiA9IGRyYXcuYmFyKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJjb2x1bW5cIjpcbiAgICAgIGNoYXJ0UmVmID0gb2JqLm9wdGlvbnMuc3RhY2tlZCA/IGRyYXcuc3RhY2tlZENvbHVtbihub2RlLCBvYmopIDogZHJhdy5jb2x1bW4obm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcInN0cmVhbVwiOlxuICAgICAgY2hhcnRSZWYgPSBkcmF3LnN0cmVhbWdyYXBoKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBjaGFydFJlZiA9IGRyYXcubGluZShub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gY2hhcnRSZWY7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwbG90O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9wbG90LmpzXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIExpbmVDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPT09IDEpIHsgb2JqLnNlcmllc0hpZ2hsaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfSB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pO1xuXG4gIC8vIFNlY29uZGFyeSBhcnJheSBpcyB1c2VkIHRvIHN0b3JlIGEgcmVmZXJlbmNlIHRvIGFsbCBzZXJpZXMgZXhjZXB0IGZvciB0aGUgaGlnaGxpZ2h0ZWQgaXRlbVxuICB2YXIgc2Vjb25kYXJ5QXJyID0gW107XG5cbiAgZm9yICh2YXIgaSA9IG9iai5kYXRhLnNlcmllc0Ftb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgLy8gRG9udCB3YW50IHRvIGluY2x1ZGUgdGhlIGhpZ2hsaWdodGVkIGl0ZW0gaW4gdGhlIGxvb3BcbiAgICAvLyBiZWNhdXNlIHdlIGFsd2F5cyB3YW50IGl0IHRvIHNpdCBhYm92ZSBhbGwgdGhlIG90aGVyIGxpbmVzXG5cbiAgICBpZiAoaSAhPT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG5cbiAgICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgICAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbaV0udmFsKTsgfSlcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW2ldLnZhbCk7IH0pO1xuXG4gICAgICB2YXIgcGF0aFJlZiA9IHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogbGluZSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlY29uZGFyeUFyci5wdXNoKHBhdGhSZWYpO1xuICAgIH1cblxuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgc2Vjb25kYXJ5IHNlcmllcyAoYWxsIHNlcmllcyBleGNlcHQgdGhlIGhpZ2hsaWdodGVkIG9uZSlcbiAgLy8gYW5kIHNldCB0aGUgY29sb3VycyBpbiB0aGUgY29ycmVjdCBvcmRlclxuXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBzZWNvbmRhcnlBcnIucmV2ZXJzZSgpO1xuXG4gIHZhciBoTGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSk7XG5cbiAgc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgIC5hdHRyKHtcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAob2JqLnNlcmllc0hpZ2hsaWdodCgpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9LFxuICAgICAgXCJkXCI6IGhMaW5lXG4gICAgfSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgaExpbmU6IGhMaW5lLFxuICAgIGxpbmU6IGxpbmVcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaW5lQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9saW5lLmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIEF4aXNGYWN0b3J5KGF4aXNPYmosIHNjYWxlKSB7XG5cbiAgdmFyIGF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgLnNjYWxlKHNjYWxlKVxuICAgIC5vcmllbnQoYXhpc09iai5vcmllbnQpO1xuXG4gIHJldHVybiBheGlzO1xuXG59XG5cbmZ1bmN0aW9uIGF4aXNNYW5hZ2VyKG5vZGUsIG9iaiwgc2NhbGUsIGF4aXNUeXBlKSB7XG5cbiAgdmFyIGF4aXNPYmogPSBvYmpbYXhpc1R5cGVdO1xuICB2YXIgYXhpcyA9IG5ldyBBeGlzRmFjdG9yeShheGlzT2JqLCBzY2FsZSk7XG5cbiAgdmFyIHByZXZBeGlzID0gbm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwXCIgKyBcIi5cIiArIG9iai5wcmVmaXggKyBheGlzVHlwZSkubm9kZSgpO1xuXG4gIGlmIChwcmV2QXhpcyAhPT0gbnVsbCkgeyBkMy5zZWxlY3QocHJldkF4aXMpLnJlbW92ZSgpOyB9XG5cbiAgdmFyIGF4aXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cFwiICsgXCIgXCIgKyBvYmoucHJlZml4ICsgYXhpc1R5cGUpO1xuXG4gIGlmIChheGlzVHlwZSA9PT0gXCJ4QXhpc1wiKSB7XG4gICAgYXBwZW5kWEF4aXMoYXhpc0dyb3VwLCBvYmosIHNjYWxlLCBheGlzLCBheGlzVHlwZSk7XG4gIH0gZWxzZSBpZiAoYXhpc1R5cGUgPT09IFwieUF4aXNcIikge1xuICAgIGFwcGVuZFlBeGlzKGF4aXNHcm91cCwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1R5cGUpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBub2RlOiBheGlzR3JvdXAsXG4gICAgYXhpczogYXhpc1xuICB9O1xuXG59XG5cbmZ1bmN0aW9uIGRldGVybWluZUZvcm1hdChjb250ZXh0KSB7XG5cbiAgc3dpdGNoIChjb250ZXh0KSB7XG4gICAgY2FzZSBcInllYXJzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVZXCIpO1xuICAgIGNhc2UgXCJtb250aHNcIjogcmV0dXJuIGQzLnRpbWUuZm9ybWF0KFwiJWJcIik7XG4gICAgY2FzZSBcIndlZWtzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVXXCIpO1xuICAgIGNhc2UgXCJkYXlzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVqXCIpO1xuICAgIGNhc2UgXCJob3Vyc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlSFwiKTtcbiAgICBjYXNlIFwibWludXRlc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlTVwiKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFhBeGlzKGF4aXNHcm91cCwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc05hbWUpIHtcblxuICB2YXIgYXhpc09iaiA9IG9ialtheGlzTmFtZV0sXG4gICAgICBheGlzU2V0dGluZ3M7XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLnhfYXhpcykge1xuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9oZWxwZXJzXCIpLmV4dGVuZDtcbiAgICBheGlzU2V0dGluZ3MgPSBleHRlbmQoYXhpc09iaiwgb2JqLmV4cG9ydGFibGUueF9heGlzKTtcbiAgfSBlbHNlIHtcbiAgICBheGlzU2V0dGluZ3MgPSBheGlzT2JqO1xuICB9XG5cbiAgYXhpc0dyb3VwXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KCkgKyBcIilcIik7XG5cbiAgdmFyIGF4aXNOb2RlID0gYXhpc0dyb3VwLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcIngtYXhpc1wiKTtcblxuICBzd2l0Y2goYXhpc09iai5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgICB0aW1lQXhpcyhheGlzTm9kZSwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgICBkaXNjcmV0ZUF4aXMoYXhpc05vZGUsIHNjYWxlLCBheGlzLCBheGlzU2V0dGluZ3MsIG9iai5kaW1lbnNpb25zKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcbiAgICAgIG9yZGluYWxUaW1lQXhpcyhheGlzTm9kZSwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQgPSBheGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodDtcblxufVxuXG5mdW5jdGlvbiBhcHBlbmRZQXhpcyhheGlzR3JvdXAsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNOYW1lKSB7XG5cbiAgYXhpc0dyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKTtcblxuICB2YXIgYXhpc05vZGUgPSBheGlzR3JvdXAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwieS1heGlzXCIpO1xuXG4gIGRyYXdZQXhpcyhvYmosIGF4aXMsIGF4aXNOb2RlKTtcblxufVxuXG5mdW5jdGlvbiBkcmF3WUF4aXMob2JqLCBheGlzLCBheGlzTm9kZSkge1xuXG4gIHZhciBheGlzU2V0dGluZ3M7XG5cbiAgdmFyIGF4aXNPYmogPSBvYmpbXCJ5QXhpc1wiXTtcblxuICBpZiAob2JqLmV4cG9ydGFibGUgJiYgb2JqLmV4cG9ydGFibGUueV9heGlzKSB7XG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL2hlbHBlcnNcIikuZXh0ZW5kO1xuICAgIGF4aXNTZXR0aW5ncyA9IGV4dGVuZChheGlzT2JqLCBvYmouZXhwb3J0YWJsZS55X2F4aXMpO1xuICB9IGVsc2Uge1xuICAgIGF4aXNTZXR0aW5ncyA9IGF4aXNPYmo7XG4gIH1cblxuICBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCA9IGF4aXNTZXR0aW5ncy5wYWRkaW5nUmlnaHQ7XG5cbiAgYXhpcy5zY2FsZSgpLnJhbmdlKFtvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpLCAwXSk7XG5cbiAgYXhpcy50aWNrVmFsdWVzKHRpY2tGaW5kZXJZKGF4aXMuc2NhbGUoKSwgYXhpc09iai50aWNrcywgYXhpc1NldHRpbmdzKSk7XG5cbiAgYXhpc05vZGUuY2FsbChheGlzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJnXCIpXG4gICAgLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm1pbm9yXCIsIHRydWUpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrIHRleHRcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpXG4gICAgLmNhbGwodXBkYXRlVGV4dFksIGF4aXNOb2RlLCBvYmosIGF4aXMsIGF4aXNPYmopXG4gICAgLmNhbGwocmVwb3NpdGlvblRleHRZLCBvYmouZGltZW5zaW9ucywgYXhpc09iai50ZXh0WCk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2sgbGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieDFcIjogb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgXCJ4MlwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKClcbiAgICB9KTtcblxufVxuXG5mdW5jdGlvbiB0aW1lQXhpcyhheGlzTm9kZSwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzKSB7XG5cbiAgdmFyIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmLFxuICAgICAgZG9tYWluID0gc2NhbGUuZG9tYWluKCksXG4gICAgICBjdHggPSB0aW1lRGlmZihkb21haW5bMF0sIGRvbWFpblsxXSwgMyksXG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZGV0ZXJtaW5lRm9ybWF0KGN0eCk7XG5cbiAgYXhpcy50aWNrRm9ybWF0KGN1cnJlbnRGb3JtYXQpO1xuXG4gIHZhciB0aWNrcztcblxuICB2YXIgdGlja0dvYWw7XG4gIGlmIChheGlzU2V0dGluZ3MudGlja3MgPT09ICdhdXRvJykge1xuICAgIHRpY2tHb2FsID0gYXhpc1NldHRpbmdzLnRpY2tUYXJnZXQ7XG4gIH0gZWxzZSB7XG4gICAgdGlja0dvYWwgPSBheGlzU2V0dGluZ3MudGlja3M7XG4gIH1cblxuICBpZiAob2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgPiBheGlzU2V0dGluZ3Mud2lkdGhUaHJlc2hvbGQpIHtcbiAgICB0aWNrcyA9IHRpY2tGaW5kZXJYKGRvbWFpbiwgY3R4LCB0aWNrR29hbCk7XG4gIH0gZWxzZSB7XG4gICAgdGlja3MgPSB0aWNrRmluZGVyWChkb21haW4sIGN0eCwgYXhpc1NldHRpbmdzLnRpY2tzU21hbGwpO1xuICB9XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgIT09IFwiY29sdW1uXCIpIHtcbiAgICBheGlzLnRpY2tWYWx1ZXModGlja3MpO1xuICB9IGVsc2Uge1xuICAgIGF4aXMudGlja3MoKTtcbiAgfVxuXG4gIGF4aXNOb2RlLmNhbGwoYXhpcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieFwiOiBheGlzU2V0dGluZ3MudXBwZXIudGV4dFgsXG4gICAgICBcInlcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRleHRZLFxuICAgICAgXCJkeVwiOiBheGlzU2V0dGluZ3MuZHkgKyBcImVtXCJcbiAgICB9KVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAuY2FsbChzZXRUaWNrRm9ybWF0WCwgY3R4LCBheGlzU2V0dGluZ3MuZW1zLCBvYmoubW9udGhzQWJyKTtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSA9PT0gXCJjb2x1bW5cIikgeyBkcm9wUmVkdW5kYW50VGlja3MoYXhpc05vZGUsIGN0eCk7IH1cblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKVxuICAgIC5jYWxsKGRyb3BUaWNrcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKFwieTJcIiwgYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQpO1xuXG59XG5cbmZ1bmN0aW9uIGRpc2NyZXRlQXhpcyhheGlzTm9kZSwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncywgZGltZW5zaW9ucykge1xuXG4gIHZhciB3cmFwVGV4dCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS53cmFwVGV4dDtcblxuICBheGlzLnRpY2tQYWRkaW5nKDApO1xuXG4gIHNjYWxlLnJhbmdlRXh0ZW50KFswLCBkaW1lbnNpb25zLnRpY2tXaWR0aCgpXSk7XG5cbiAgc2NhbGUucmFuZ2VSb3VuZEJhbmRzKFswLCBkaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgZGltZW5zaW9ucy5iYW5kcy5wYWRkaW5nLCBkaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZyk7XG5cbiAgdmFyIGJhbmRTdGVwID0gc2NhbGUucmFuZ2VCYW5kKCk7XG5cbiAgYXhpc05vZGUuY2FsbChheGlzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAuYXR0cihcImR5XCIsIGF4aXNTZXR0aW5ncy5keSArIFwiZW1cIilcbiAgICAuY2FsbCh3cmFwVGV4dCwgYmFuZFN0ZXApO1xuXG4gIHZhciBmaXJzdFhQb3MgPSBkMy50cmFuc2Zvcm0oYXhpc05vZGUuc2VsZWN0KFwiLnRpY2tcIikuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdICogLTE7XG5cbiAgdmFyIHhQb3MgPSAoLSAoYmFuZFN0ZXAgLyAyKSAtIChiYW5kU3RlcCAqIGRpbWVuc2lvbnMuYmFuZHMub3V0ZXJQYWRkaW5nKSk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieDFcIjogeFBvcyxcbiAgICAgIFwieDJcIjogeFBvc1xuICAgIH0pO1xuXG4gIGF4aXNOb2RlLnNlbGVjdChcImxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICBcIngxXCI6IGZpcnN0WFBvcyxcbiAgICAgIFwieDJcIjogZmlyc3RYUG9zXG4gICAgfSk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKFwieTJcIiwgYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQpO1xuXG4gIHZhciBsYXN0VGljayA9IGF4aXNOb2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IFwidGlja1wiLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAoZGltZW5zaW9ucy50aWNrV2lkdGgoKSArIChiYW5kU3RlcCAvIDIpICsgYmFuZFN0ZXAgKiBkaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZykgKyBcIiwwKVwiXG4gICAgfSk7XG5cbiAgbGFzdFRpY2suYXBwZW5kKFwibGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieTJcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQsXG4gICAgICBcIngxXCI6IHhQb3MsXG4gICAgICBcIngyXCI6IHhQb3NcbiAgICB9KTtcblxufVxuXG5mdW5jdGlvbiBvcmRpbmFsVGltZUF4aXMoYXhpc05vZGUsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncykge1xuXG4gIHZhciB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGRvbWFpbiA9IHNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCAzKSxcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkZXRlcm1pbmVGb3JtYXQoY3R4KTtcblxuICBheGlzLnRpY2tGb3JtYXQoY3VycmVudEZvcm1hdCk7XG5cbiAgYXhpc05vZGUuY2FsbChheGlzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ4XCI6IGF4aXNTZXR0aW5ncy51cHBlci50ZXh0WCxcbiAgICAgIFwieVwiOiBheGlzU2V0dGluZ3MudXBwZXIudGV4dFksXG4gICAgICBcImR5XCI6IGF4aXNTZXR0aW5ncy5keSArIFwiZW1cIlxuICAgIH0pXG4gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJzdGFydFwiKVxuICAgIC5jYWxsKHNldFRpY2tGb3JtYXRYLCBjdHgsIGF4aXNTZXR0aW5ncy5lbXMsIG9iai5tb250aHNBYnIpO1xuXG4gIGlmIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgPiBvYmoueEF4aXMud2lkdGhUaHJlc2hvbGQpIHtcbiAgICB2YXIgb3JkaW5hbFRpY2tQYWRkaW5nID0gNztcbiAgfSBlbHNlIHtcbiAgICB2YXIgb3JkaW5hbFRpY2tQYWRkaW5nID0gNDtcbiAgfVxuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpXG4gICAgLmNhbGwob3JkaW5hbFRpbWVUaWNrcywgYXhpc05vZGUsIGN0eCwgc2NhbGUsIG9yZGluYWxUaWNrUGFkZGluZyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKFwieTJcIiwgYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQpO1xuXG59XG5cbi8vIHRleHQgZm9ybWF0dGluZyBmdW5jdGlvbnNcblxuZnVuY3Rpb24gc2V0VGlja0Zvcm1hdFgoc2VsZWN0aW9uLCBjdHgsIGVtcywgbW9udGhzQWJyKSB7XG5cbiAgdmFyIHByZXZZZWFyLFxuICAgICAgcHJldk1vbnRoLFxuICAgICAgcHJldkRhdGUsXG4gICAgICBkWWVhcixcbiAgICAgIGRNb250aCxcbiAgICAgIGREYXRlLFxuICAgICAgZEhvdXIsXG4gICAgICBkTWludXRlO1xuXG4gIHNlbGVjdGlvbi50ZXh0KGZ1bmN0aW9uKGQpIHtcblxuICAgIHZhciBub2RlID0gZDMuc2VsZWN0KHRoaXMpO1xuXG4gICAgdmFyIGRTdHI7XG5cbiAgICBzd2l0Y2ggKGN0eCkge1xuICAgICAgY2FzZSBcInllYXJzXCI6XG4gICAgICAgIGRTdHIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuXG4gICAgICAgIGRNb250aCA9IG1vbnRoc0FicltkLmdldE1vbnRoKCldO1xuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICBpZiAoZFllYXIgIT09IHByZXZZZWFyKSB7XG4gICAgICAgICAgbmV3VGV4dE5vZGUobm9kZSwgZFllYXIsIGVtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBkU3RyID0gZE1vbnRoO1xuXG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwid2Vla3NcIjpcbiAgICAgIGNhc2UgXCJkYXlzXCI6XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkTW9udGggPSBtb250aHNBYnJbZC5nZXRNb250aCgpXTtcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcblxuICAgICAgICBpZiAoZE1vbnRoICE9PSBwcmV2TW9udGgpIHtcbiAgICAgICAgICBkU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkU3RyID0gZERhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZFllYXIgIT09IHByZXZZZWFyKSB7XG4gICAgICAgICAgbmV3VGV4dE5vZGUobm9kZSwgZFllYXIsIGVtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2TW9udGggPSBkTW9udGg7XG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJob3Vyc1wiOlxuICAgICAgICBkTW9udGggPSBtb250aHNBYnJbZC5nZXRNb250aCgpXTtcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgZEhvdXIgPSBkLmdldEhvdXJzKCk7XG4gICAgICAgIGRNaW51dGUgPSBkLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICB2YXIgZEhvdXJTdHIsXG4gICAgICAgICAgICBkTWludXRlU3RyO1xuXG4gICAgICAgIC8vIENvbnZlcnQgZnJvbSAyNGggdGltZVxuICAgICAgICB2YXIgc3VmZml4ID0gKGRIb3VyID49IDEyKSA/ICdwLm0uJyA6ICdhLm0uJztcbiAgICAgICAgaWYgKGRIb3VyID09PSAwKSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSAxMjtcbiAgICAgICAgfSBlbHNlIGlmIChkSG91ciA+IDEyKSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSBkSG91ciAtIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRIb3VyU3RyID0gZEhvdXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIG1pbnV0ZXMgZm9sbG93IEdsb2JlIHN0eWxlXG4gICAgICAgIGlmIChkTWludXRlID09PSAwKSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICcnO1xuICAgICAgICB9IGVsc2UgaWYgKGRNaW51dGUgPCAxMCkge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnOjAnICsgZE1pbnV0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJzonICsgZE1pbnV0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRTdHIgPSBkSG91clN0ciArIGRNaW51dGVTdHIgKyAnICcgKyBzdWZmaXg7XG5cbiAgICAgICAgaWYgKGREYXRlICE9PSBwcmV2RGF0ZSkge1xuICAgICAgICAgIHZhciBkYXRlU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZTtcbiAgICAgICAgICBuZXdUZXh0Tm9kZShub2RlLCBkYXRlU3RyLCBlbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcblxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRTdHIgPSBkO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZFN0cjtcblxuICB9KTtcblxufVxuXG5mdW5jdGlvbiBzZXRUaWNrRm9ybWF0WShmb3JtYXQsIGQsIGxhc3RUaWNrKSB7XG4gIC8vIGNoZWNraW5nIGZvciBhIGZvcm1hdCBhbmQgZm9ybWF0dGluZyB5LWF4aXMgdmFsdWVzIGFjY29yZGluZ2x5XG5cbiAgdmFyIGlzRmxvYXQgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9oZWxwZXJzXCIpLmlzRmxvYXQ7XG5cbiAgdmFyIGN1cnJlbnRGb3JtYXQ7XG5cbiAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICBjYXNlIFwiZ2VuZXJhbFwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcImdcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic2lcIjpcbiAgICAgIHZhciBwcmVmaXggPSBkMy5mb3JtYXRQcmVmaXgobGFzdFRpY2spLFxuICAgICAgICAgIGZvcm1hdCA9IGQzLmZvcm1hdChcIi4xZlwiKTtcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBmb3JtYXQocHJlZml4LnNjYWxlKGQpKSArIHByZWZpeC5zeW1ib2w7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiY29tbWFcIjpcbiAgICAgIGlmIChpc0Zsb2F0KHBhcnNlRmxvYXQoZCkpKSB7XG4gICAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjJmXCIpKGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIixnXCIpKGQpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInJvdW5kMVwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIiwuMWZcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicm91bmQyXCI6XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLC4yZlwiKShkKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyb3VuZDNcIjpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjNmXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInJvdW5kNFwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIiwuNGZcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIixnXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gY3VycmVudEZvcm1hdDtcblxufVxuXG5mdW5jdGlvbiB1cGRhdGVUZXh0WCh0ZXh0Tm9kZXMsIGF4aXNOb2RlLCBvYmosIGF4aXMsIGF4aXNPYmopIHtcblxuICB2YXIgbGFzdFRpY2sgPSBheGlzLnRpY2tWYWx1ZXMoKVtheGlzLnRpY2tWYWx1ZXMoKS5sZW5ndGggLSAxXTtcblxuICB0ZXh0Tm9kZXNcbiAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG4gICAgICB2YXIgdmFsID0gc2V0VGlja0Zvcm1hdFkoYXhpc09iai5mb3JtYXQsIGQsIGxhc3RUaWNrKTtcbiAgICAgIGlmIChpID09PSBheGlzLnRpY2tWYWx1ZXMoKS5sZW5ndGggLSAxKSB7XG4gICAgICAgIHZhbCA9IChheGlzT2JqLnByZWZpeCB8fCBcIlwiKSArIHZhbCArIChheGlzT2JqLnN1ZmZpeCB8fCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gdXBkYXRlVGV4dFkodGV4dE5vZGVzLCBheGlzTm9kZSwgb2JqLCBheGlzLCBheGlzT2JqKSB7XG5cbiAgdmFyIGFyciA9IFtdLFxuICAgICAgbGFzdFRpY2sgPSBheGlzLnRpY2tWYWx1ZXMoKVtheGlzLnRpY2tWYWx1ZXMoKS5sZW5ndGggLSAxXTtcblxuICB0ZXh0Tm9kZXNcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpXG4gICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIHZhbCA9IHNldFRpY2tGb3JtYXRZKGF4aXNPYmouZm9ybWF0LCBkLCBsYXN0VGljayk7XG4gICAgICBpZiAoaSA9PT0gYXhpcy50aWNrVmFsdWVzKCkubGVuZ3RoIC0gMSkge1xuICAgICAgICB2YWwgPSAoYXhpc09iai5wcmVmaXggfHwgXCJcIikgKyB2YWwgKyAoYXhpc09iai5zdWZmaXggfHwgXCJcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0pXG4gICAgLnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgdmFyIHRleHRDaGFyID0gc2VsLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgIGFyci5wdXNoKHRleHRDaGFyKTtcbiAgICAgIHJldHVybiBzZWwudGV4dCgpO1xuICAgIH0pXG4gICAgLmF0dHIoe1xuICAgICAgXCJkeVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGF4aXNPYmouZHkgIT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gYXhpc09iai5keSArIFwiZW1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJkeVwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwieFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGF4aXNPYmoudGV4dFggIT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gYXhpc09iai50ZXh0WDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ4XCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoYXhpc09iai50ZXh0WSAhPT0gXCJcIikge1xuICAgICAgICAgIHJldHVybiBheGlzT2JqLnRleHRZO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcykuYXR0cihcInlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoID0gZDMubWF4KGFycik7XG5cbn1cblxuZnVuY3Rpb24gcmVwb3NpdGlvblRleHRZKHRleHQsIGRpbWVuc2lvbnMsIHRleHRYKSB7XG4gIHRleHQuYXR0cih7XG4gICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAoZGltZW5zaW9ucy5sYWJlbFdpZHRoIC0gdGV4dFgpICsgXCIsMClcIixcbiAgICBcInhcIjogMFxuICB9KTtcbn1cblxuLy8gQ2xvbmVzIGN1cnJlbnQgdGV4dCBzZWxlY3Rpb24gYW5kIGFwcGVuZHNcbi8vIGEgbmV3IHRleHQgbm9kZSBiZWxvdyB0aGUgc2VsZWN0aW9uXG5mdW5jdGlvbiBuZXdUZXh0Tm9kZShzZWxlY3Rpb24sIHRleHQsIGVtcykge1xuXG4gIHZhciBub2RlTmFtZSA9IHNlbGVjdGlvbi5wcm9wZXJ0eShcIm5vZGVOYW1lXCIpLFxuICAgICAgcGFyZW50ID0gZDMuc2VsZWN0KHNlbGVjdGlvbi5ub2RlKCkucGFyZW50Tm9kZSksXG4gICAgICBsaW5lSGVpZ2h0ID0gZW1zIHx8IDEuNiwgLy8gZW1zXG4gICAgICBkeSA9IHBhcnNlRmxvYXQoc2VsZWN0aW9uLmF0dHIoXCJkeVwiKSksXG4gICAgICB4ID0gcGFyc2VGbG9hdChzZWxlY3Rpb24uYXR0cihcInhcIikpLFxuXG4gICAgICBjbG9uZWQgPSBwYXJlbnQuYXBwZW5kKG5vZGVOYW1lKVxuICAgICAgICAuYXR0cihcImR5XCIsIGxpbmVIZWlnaHQgKyBkeSArIFwiZW1cIilcbiAgICAgICAgLmF0dHIoXCJ4XCIsIHgpXG4gICAgICAgIC50ZXh0KGZ1bmN0aW9uKCkgeyByZXR1cm4gdGV4dDsgfSk7XG5cbiAgcmV0dXJuIGNsb25lZDtcblxufVxuXG4vLyB0aWNrIGRyb3BwaW5nIGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBkcm9wVGlja3Moc2VsZWN0aW9uLCBvcHRzKSB7XG5cbiAgdmFyIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gIHZhciB0b2xlcmFuY2UgPSBvcHRzLnRvbGVyYW5jZSB8fCAwLFxuICAgICAgZnJvbSA9IG9wdHMuZnJvbSB8fCAwLFxuICAgICAgdG8gPSBvcHRzLnRvIHx8IHNlbGVjdGlvblswXS5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaiA9IGZyb207IGogPCB0bzsgaisrKSB7XG5cbiAgICB2YXIgYyA9IHNlbGVjdGlvblswXVtqXSwgLy8gY3VycmVudCBzZWxlY3Rpb25cbiAgICAgICAgbiA9IHNlbGVjdGlvblswXVtqICsgMV07IC8vIG5leHQgc2VsZWN0aW9uXG5cbiAgICBpZiAoIWMgfHwgIW4gfHwgIWMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHx8ICFuLmdldEJvdW5kaW5nQ2xpZW50UmVjdCkgeyBjb250aW51ZTsgfVxuXG4gICAgd2hpbGUgKChjLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0ICsgdG9sZXJhbmNlKSA+IG4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkge1xuXG4gICAgICBpZiAoZDMuc2VsZWN0KG4pLmRhdGEoKVswXSA9PT0gc2VsZWN0aW9uLmRhdGEoKVt0b10pIHtcbiAgICAgICAgZDMuc2VsZWN0KGMpLnJlbW92ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZDMuc2VsZWN0KG4pLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBqKys7XG5cbiAgICAgIG4gPSBzZWxlY3Rpb25bMF1baiArIDFdO1xuXG4gICAgICBpZiAoIW4pIHsgYnJlYWs7IH1cblxuICAgIH1cblxuICB9XG5cbn1cblxuZnVuY3Rpb24gZHJvcFJlZHVuZGFudFRpY2tzKHNlbGVjdGlvbiwgY3R4KSB7XG5cbiAgdmFyIHRpY2tzID0gc2VsZWN0aW9uLnNlbGVjdEFsbChcIi50aWNrXCIpO1xuXG4gIHZhciBwcmV2WWVhciwgcHJldk1vbnRoLCBwcmV2RGF0ZSwgcHJldkhvdXIsIHByZXZNaW51dGUsIGRZZWFyLCBkTW9udGgsIGREYXRlLCBkSG91ciwgZE1pbnV0ZTtcblxuICB0aWNrcy5lYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICBzd2l0Y2ggKGN0eCkge1xuICAgICAgY2FzZSBcInllYXJzXCI6XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBpZiAoZFllYXIgPT09IHByZXZZZWFyKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZE1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICBpZiAoKGRNb250aCA9PT0gcHJldk1vbnRoKSAmJiAoZFllYXIgPT09IHByZXZZZWFyKSkge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2TW9udGggPSBkTW9udGg7XG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIndlZWtzXCI6XG4gICAgICBjYXNlIFwiZGF5c1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZE1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuXG4gICAgICAgIGlmICgoZERhdGUgPT09IHByZXZEYXRlKSAmJiAoZE1vbnRoID09PSBwcmV2TW9udGgpICYmIChkWWVhciA9PT0gcHJldlllYXIpKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcbiAgICAgICAgcHJldk1vbnRoID0gZE1vbnRoO1xuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJob3Vyc1wiOlxuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICBkSG91ciA9IGQuZ2V0SG91cnMoKTtcbiAgICAgICAgZE1pbnV0ZSA9IGQuZ2V0TWludXRlcygpO1xuXG4gICAgICAgIGlmICgoZERhdGUgPT09IHByZXZEYXRlKSAmJiAoZEhvdXIgPT09IHByZXZIb3VyKSAmJiAoZE1pbnV0ZSA9PT0gcHJldk1pbnV0ZSkpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2RGF0ZSA9IGREYXRlO1xuICAgICAgICBwcmV2SG91ciA9IGRIb3VyO1xuICAgICAgICBwcmV2TWludXRlID0gZE1pbnV0ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcblxufVxuXG5mdW5jdGlvbiBkcm9wT3ZlcnNldFRpY2tzKGF4aXNOb2RlLCB0aWNrV2lkdGgpIHtcblxuICB2YXIgYXhpc0dyb3VwV2lkdGggPSBheGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoLFxuICAgICAgdGlja0FyciA9IGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpWzBdO1xuXG4gIGlmICh0aWNrQXJyLmxlbmd0aCkge1xuXG4gICAgdmFyIGZpcnN0VGlja09mZnNldCA9IGQzLnRyYW5zZm9ybShkMy5zZWxlY3QodGlja0FyclswXSlcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMF07XG5cbiAgICBpZiAoKGF4aXNHcm91cFdpZHRoICsgZmlyc3RUaWNrT2Zmc2V0KSA+PSB0aWNrV2lkdGgpIHtcbiAgICAgIHZhciBsYXN0VGljayA9IHRpY2tBcnJbdGlja0Fyci5sZW5ndGggLSAxXTtcbiAgICAgIGQzLnNlbGVjdChsYXN0VGljaykuYXR0cihcImNsYXNzXCIsIFwibGFzdC10aWNrLWhpZGVcIik7XG4gICAgICBheGlzR3JvdXBXaWR0aCA9IGF4aXNOb2RlLm5vZGUoKS5nZXRCQm94KCkud2lkdGg7XG4gICAgICB0aWNrQXJyID0gYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2tcIilbMF07XG4gICAgfVxuXG4gIH1cblxufVxuXG5mdW5jdGlvbiB0aWNrRmluZGVyWChkb21haW4sIHBlcmlvZCwgdGlja0dvYWwpIHtcblxuICAvLyBzZXQgcmFuZ2VzXG4gIHZhciBzdGFydERhdGUgPSBkb21haW5bMF0sXG4gICAgICBlbmREYXRlID0gZG9tYWluWzFdO1xuXG4gIC8vIHNldCB1cHBlciBhbmQgbG93ZXIgYm91bmRzIGZvciBudW1iZXIgb2Ygc3RlcHMgcGVyIHRpY2tcbiAgLy8gaS5lLiBpZiB5b3UgaGF2ZSBmb3VyIG1vbnRocyBhbmQgc2V0IHN0ZXBzIHRvIDEsIHlvdSdsbCBnZXQgNCB0aWNrc1xuICAvLyBhbmQgaWYgeW91IGhhdmUgc2l4IG1vbnRocyBhbmQgc2V0IHN0ZXBzIHRvIDIsIHlvdSdsbCBnZXQgMyB0aWNrc1xuICB2YXIgc3RlcExvd2VyQm91bmQgPSAxLFxuICAgICAgc3RlcFVwcGVyQm91bmQgPSAxMixcbiAgICAgIHRpY2tDYW5kaWRhdGVzID0gW10sXG4gICAgICBjbG9zZXN0QXJyO1xuXG4gIC8vIHVzaW5nIHRoZSB0aWNrIGJvdW5kcywgZ2VuZXJhdGUgbXVsdGlwbGUgYXJyYXlzLWluLW9iamVjdHMgdXNpbmdcbiAgLy8gZGlmZmVyZW50IHRpY2sgc3RlcHMuIHB1c2ggYWxsIHRob3NlIGdlbmVyYXRlZCBvYmplY3RzIHRvIHRpY2tDYW5kaWRhdGVzXG4gIGZvciAodmFyIGkgPSBzdGVwTG93ZXJCb3VuZDsgaSA8PSBzdGVwVXBwZXJCb3VuZDsgaSsrKSB7XG4gICAgdmFyIG9iaiA9IHt9O1xuICAgIG9iai5pbnRlcnZhbCA9IGk7XG4gICAgb2JqLmFyciA9IGQzLnRpbWVbcGVyaW9kXShzdGFydERhdGUsIGVuZERhdGUsIGkpLmxlbmd0aDtcbiAgICB0aWNrQ2FuZGlkYXRlcy5wdXNoKG9iaik7XG4gIH1cblxuICAvLyByZWR1Y2UgdG8gZmluZCBhIGJlc3QgY2FuZGlkYXRlIGJhc2VkIG9uIHRoZSBkZWZpbmVkIHRpY2tHb2FsXG4gIGlmICh0aWNrQ2FuZGlkYXRlcy5sZW5ndGggPiAxKSB7XG4gICAgY2xvc2VzdEFyciA9IHRpY2tDYW5kaWRhdGVzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3Vycikge1xuICAgICAgcmV0dXJuIChNYXRoLmFicyhjdXJyLmFyciAtIHRpY2tHb2FsKSA8IE1hdGguYWJzKHByZXYuYXJyIC0gdGlja0dvYWwpID8gY3VyciA6IHByZXYpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHRpY2tDYW5kaWRhdGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIGNsb3Nlc3RBcnIgPSB0aWNrQ2FuZGlkYXRlc1swXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBzaWdoLiB3ZSB0cmllZC5cbiAgICBjbG9zZXN0QXJyLmludGVydmFsID0gMTtcbiAgfVxuXG4gIHZhciB0aWNrQXJyID0gZDMudGltZVtwZXJpb2RdKHN0YXJ0RGF0ZSwgZW5kRGF0ZSwgY2xvc2VzdEFyci5pbnRlcnZhbCk7XG5cbiAgdmFyIHN0YXJ0RGlmZiA9IHRpY2tBcnJbMF0gLSBzdGFydERhdGU7XG4gIHZhciB0aWNrRGlmZiA9IHRpY2tBcnJbMV0gLSB0aWNrQXJyWzBdO1xuXG4gIC8vIGlmIGRpc3RhbmNlIGZyb20gc3RhcnREYXRlIHRvIHRpY2tBcnJbMF0gaXMgZ3JlYXRlciB0aGFuIGhhbGYgdGhlXG4gIC8vIGRpc3RhbmNlIGJldHdlZW4gdGlja0FyclsxXSBhbmQgdGlja0FyclswXSwgYWRkIHN0YXJ0RGF0ZSB0byB0aWNrQXJyXG5cbiAgaWYgKCBzdGFydERpZmYgPiAodGlja0RpZmYgLyAyKSApIHsgdGlja0Fyci51bnNoaWZ0KHN0YXJ0RGF0ZSk7IH1cblxuICByZXR1cm4gdGlja0FycjtcblxufVxuXG5mdW5jdGlvbiB0aWNrRmluZGVyWShzY2FsZSwgdGlja0NvdW50LCB0aWNrU2V0dGluZ3MpIHtcblxuICAvLyBJbiBhIG51dHNoZWxsOlxuICAvLyBDaGVja3MgaWYgYW4gZXhwbGljaXQgbnVtYmVyIG9mIHRpY2tzIGhhcyBiZWVuIGRlY2xhcmVkXG4gIC8vIElmIG5vdCwgc2V0cyBsb3dlciBhbmQgdXBwZXIgYm91bmRzIGZvciB0aGUgbnVtYmVyIG9mIHRpY2tzXG4gIC8vIEl0ZXJhdGVzIG92ZXIgdGhvc2UgYW5kIG1ha2VzIHN1cmUgdGhhdCB0aGVyZSBhcmUgdGljayBhcnJheXMgd2hlcmVcbiAgLy8gdGhlIGxhc3QgdmFsdWUgaW4gdGhlIGFycmF5IG1hdGNoZXMgdGhlIGRvbWFpbiBtYXggdmFsdWVcbiAgLy8gaWYgc28sIHRyaWVzIHRvIGZpbmQgdGhlIHRpY2sgbnVtYmVyIGNsb3Nlc3QgdG8gdGlja0dvYWwgb3V0IG9mIHRoZSB3aW5uZXJzLFxuICAvLyBhbmQgcmV0dXJucyB0aGF0IGFyciB0byB0aGUgc2NhbGUgZm9yIHVzZVxuXG4gIHZhciBtaW4gPSBzY2FsZS5kb21haW4oKVswXSxcbiAgICAgIG1heCA9IHNjYWxlLmRvbWFpbigpWzFdO1xuXG4gIGlmICh0aWNrQ291bnQgIT09IFwiYXV0b1wiKSB7XG5cbiAgICByZXR1cm4gc2NhbGUudGlja3ModGlja0NvdW50KTtcblxuICB9IGVsc2Uge1xuXG4gICAgdmFyIHRpY2tMb3dlckJvdW5kID0gdGlja1NldHRpbmdzLnRpY2tMb3dlckJvdW5kLFxuICAgICAgICB0aWNrVXBwZXJCb3VuZCA9IHRpY2tTZXR0aW5ncy50aWNrVXBwZXJCb3VuZCxcbiAgICAgICAgdGlja0dvYWwgPSB0aWNrU2V0dGluZ3MudGlja0dvYWwsXG4gICAgICAgIGFyciA9IFtdLFxuICAgICAgICB0aWNrQ2FuZGlkYXRlcyA9IFtdLFxuICAgICAgICBjbG9zZXN0QXJyO1xuXG4gICAgZm9yICh2YXIgaSA9IHRpY2tMb3dlckJvdW5kOyBpIDw9IHRpY2tVcHBlckJvdW5kOyBpKyspIHtcbiAgICAgIHZhciB0aWNrQ2FuZGlkYXRlID0gc2NhbGUudGlja3MoaSk7XG5cbiAgICAgIGlmIChtaW4gPCAwKSB7XG4gICAgICAgIGlmICgodGlja0NhbmRpZGF0ZVswXSA9PT0gbWluKSAmJiAodGlja0NhbmRpZGF0ZVt0aWNrQ2FuZGlkYXRlLmxlbmd0aCAtIDFdID09PSBtYXgpKSB7XG4gICAgICAgICAgYXJyLnB1c2godGlja0NhbmRpZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aWNrQ2FuZGlkYXRlW3RpY2tDYW5kaWRhdGUubGVuZ3RoIC0gMV0gPT09IG1heCkge1xuICAgICAgICAgIGFyci5wdXNoKHRpY2tDYW5kaWRhdGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB0aWNrQ2FuZGlkYXRlcy5wdXNoKHZhbHVlLmxlbmd0aCk7XG4gICAgfSk7XG5cbiAgICB2YXIgY2xvc2VzdEFycjtcblxuICAgIGlmICh0aWNrQ2FuZGlkYXRlcy5sZW5ndGggPiAxKSB7XG4gICAgICBjbG9zZXN0QXJyID0gdGlja0NhbmRpZGF0ZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyKSB7XG4gICAgICAgIHJldHVybiAoTWF0aC5hYnMoY3VyciAtIHRpY2tHb2FsKSA8IE1hdGguYWJzKHByZXYgLSB0aWNrR29hbCkgPyBjdXJyIDogcHJldik7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRpY2tDYW5kaWRhdGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY2xvc2VzdEFyciA9IHRpY2tDYW5kaWRhdGVzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbG9zZXN0QXJyID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NhbGUudGlja3MoY2xvc2VzdEFycik7XG5cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIG9yZGluYWxUaW1lVGlja3Moc2VsZWN0aW9uLCBheGlzTm9kZSwgY3R4LCBzY2FsZSwgdG9sZXJhbmNlKSB7XG5cbiAgZHJvcFJlZHVuZGFudFRpY2tzKGF4aXNOb2RlLCBjdHgpO1xuXG4gIC8vIGRyb3BSZWR1bmRhbnRUaWNrcyBoYXMgbW9kaWZpZWQgdGhlIHNlbGVjdGlvbiwgc28gd2UgbmVlZCB0byByZXNlbGVjdFxuICAvLyB0byBnZXQgYSBwcm9wZXIgaWRlYSBvZiB3aGF0J3Mgc3RpbGwgYXZhaWxhYmxlXG4gIHZhciBuZXdTZWxlY3Rpb24gPSBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKTtcblxuICAvLyBpZiB0aGUgY29udGV4dCBpcyBcInllYXJzXCIsIGV2ZXJ5IHRpY2sgaXMgYSBtYWpvcnRpY2sgc28gd2UgY2FuXG4gIC8vIGp1c3QgcGFzcyBvbiB0aGUgYmxvY2sgYmVsb3dcbiAgaWYgKGN0eCAhPT0gXCJ5ZWFyc1wiKSB7XG5cbiAgICAvLyBhcnJheSBmb3IgYW55IFwibWFqb3IgdGlja3NcIiwgaS5lLiB0aWNrcyB3aXRoIGEgY2hhbmdlIGluIGNvbnRleHRcbiAgICAvLyBvbmUgbGV2ZWwgdXAuIGkuZS4sIGEgXCJtb250aHNcIiBjb250ZXh0IHNldCBvZiB0aWNrcyB3aXRoIGEgY2hhbmdlIGluIHRoZSB5ZWFyLFxuICAgIC8vIG9yIFwiZGF5c1wiIGNvbnRleHQgdGlja3Mgd2l0aCBhIGNoYW5nZSBpbiBtb250aCBvciB5ZWFyXG4gICAgdmFyIG1ham9yVGlja3MgPSBbXTtcblxuICAgIHZhciBwcmV2WWVhciwgcHJldk1vbnRoLCBwcmV2RGF0ZSwgZFllYXIsIGRNb250aCwgZERhdGU7XG5cbiAgICBuZXdTZWxlY3Rpb24uZWFjaChmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgY3VyclNlbCA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgIHN3aXRjaCAoY3R4KSB7XG4gICAgICAgIGNhc2UgXCJtb250aHNcIjpcbiAgICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBpZiAoZFllYXIgIT09IHByZXZZZWFyKSB7IG1ham9yVGlja3MucHVzaChjdXJyU2VsKTsgfVxuICAgICAgICAgIHByZXZZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwid2Vla3NcIjpcbiAgICAgICAgY2FzZSBcImRheXNcIjpcbiAgICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBkTW9udGggPSBkLmdldE1vbnRoKCk7XG4gICAgICAgICAgaWYgKChkTW9udGggIT09IHByZXZNb250aCkgJiYgKGRZZWFyICE9PSBwcmV2WWVhcikpIHtcbiAgICAgICAgICAgIG1ham9yVGlja3MucHVzaChjdXJyU2VsKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRNb250aCAhPT0gcHJldk1vbnRoKSB7XG4gICAgICAgICAgICBtYWpvclRpY2tzLnB1c2goY3VyclNlbCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkWWVhciAhPT0gcHJldlllYXIpIHtcbiAgICAgICAgICAgIG1ham9yVGlja3MucHVzaChjdXJyU2VsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcHJldk1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICAgIHByZXZZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaG91cnNcIjpcbiAgICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICAgIGlmIChkRGF0ZSAhPT0gcHJldkRhdGUpIHsgbWFqb3JUaWNrcy5wdXNoKGN1cnJTZWwpOyB9XG4gICAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciB0MCwgdG47XG5cbiAgICBpZiAobWFqb3JUaWNrcy5sZW5ndGggPiAxKSB7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFqb3JUaWNrcy5sZW5ndGggKyAxOyBpKyspIHtcblxuICAgICAgICBpZiAoaSA9PT0gMCkgeyAvLyBmcm9tIHQwIHRvIG0wXG4gICAgICAgICAgdDAgPSAwO1xuICAgICAgICAgIHRuID0gbmV3U2VsZWN0aW9uLmRhdGEoKS5pbmRleE9mKG1ham9yVGlja3NbMF0uZGF0YSgpWzBdKTtcbiAgICAgICAgfSBlbHNlIGlmIChpID09PSAobWFqb3JUaWNrcy5sZW5ndGgpKSB7IC8vIGZyb20gbW4gdG8gdG5cbiAgICAgICAgICB0MCA9IG5ld1NlbGVjdGlvbi5kYXRhKCkuaW5kZXhPZihtYWpvclRpY2tzW2kgLSAxXS5kYXRhKClbMF0pO1xuICAgICAgICAgIHRuID0gbmV3U2VsZWN0aW9uLmxlbmd0aCAtIDE7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZyb20gbTAgdG8gbW5cbiAgICAgICAgICB0MCA9IG5ld1NlbGVjdGlvbi5kYXRhKCkuaW5kZXhPZihtYWpvclRpY2tzW2kgLSAxXS5kYXRhKClbMF0pO1xuICAgICAgICAgIHRuID0gbmV3U2VsZWN0aW9uLmRhdGEoKS5pbmRleE9mKG1ham9yVGlja3NbaV0uZGF0YSgpWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghISh0biAtIHQwKSkge1xuICAgICAgICAgIGRyb3BUaWNrcyhuZXdTZWxlY3Rpb24sIHtcbiAgICAgICAgICAgIGZyb206IHQwLFxuICAgICAgICAgICAgdG86IHRuLFxuICAgICAgICAgICAgdG9sZXJhbmNlOiB0b2xlcmFuY2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICBkcm9wVGlja3MobmV3U2VsZWN0aW9uLCB7IHRvbGVyYW5jZTogdG9sZXJhbmNlIH0pO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopIHtcblxuICAvLyB0aGlzIHNlY3Rpb24gaXMga2luZGEgZ3Jvc3MsIHNvcnJ5OlxuICAvLyByZXNldHMgcmFuZ2VzIGFuZCBkaW1lbnNpb25zLCByZWRyYXdzIHlBeGlzLCByZWRyYXdzIHhBeGlzXG4gIC8vIOKApnRoZW4gcmVkcmF3cyB5QXhpcyBhZ2FpbiBpZiB0aWNrIHdyYXBwaW5nIGhhcyBjaGFuZ2VkIHhBeGlzIGhlaWdodFxuXG4gIGRyYXdZQXhpcyhvYmosIHlBeGlzT2JqLmF4aXMsIHlBeGlzT2JqLm5vZGUpO1xuXG4gIHZhciBzZXRSYW5nZVR5cGUgPSByZXF1aXJlKFwiLi9zY2FsZVwiKS5zZXRSYW5nZVR5cGUsXG4gICAgICBzZXRSYW5nZUFyZ3MgPSByZXF1aXJlKFwiLi9zY2FsZVwiKS5zZXRSYW5nZUFyZ3M7XG5cbiAgdmFyIHNjYWxlT2JqID0ge1xuICAgIHJhbmdlVHlwZTogc2V0UmFuZ2VUeXBlKG9iai54QXhpcyksXG4gICAgcmFuZ2U6IHhBeGlzT2JqLnJhbmdlIHx8IFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sXG4gICAgYmFuZHM6IG9iai5kaW1lbnNpb25zLmJhbmRzLFxuICAgIHJhbmdlUG9pbnRzOiBvYmoueEF4aXMucmFuZ2VQb2ludHNcbiAgfTtcblxuICBzZXRSYW5nZUFyZ3MoeEF4aXNPYmouYXhpcy5zY2FsZSgpLCBzY2FsZU9iaik7XG5cbiAgdmFyIHByZXZYQXhpc0hlaWdodCA9IG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0O1xuXG4gIHhBeGlzT2JqID0gYXhpc01hbmFnZXIobm9kZSwgb2JqLCB4QXhpc09iai5heGlzLnNjYWxlKCksIFwieEF4aXNcIik7XG5cbiAgeEF4aXNPYmoubm9kZVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkgKyBcIilcIik7XG5cbiAgaWYgKG9iai54QXhpcy5zY2FsZSAhPT0gXCJvcmRpbmFsXCIpIHtcbiAgICBkcm9wT3ZlcnNldFRpY2tzKHhBeGlzT2JqLm5vZGUsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKTtcbiAgfVxuXG4gIGlmIChwcmV2WEF4aXNIZWlnaHQgIT09IG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KSB7XG4gICAgZHJhd1lBeGlzKG9iaiwgeUF4aXNPYmouYXhpcywgeUF4aXNPYmoubm9kZSk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBhZGRaZXJvTGluZShvYmosIG5vZGUsIEF4aXMsIGF4aXNUeXBlKSB7XG5cbiAgdmFyIHRpY2tzID0gQXhpcy5heGlzLnRpY2tWYWx1ZXMoKSxcbiAgICAgIHRpY2tNaW4gPSB0aWNrc1swXSxcbiAgICAgIHRpY2tNYXggPSB0aWNrc1t0aWNrcy5sZW5ndGggLSAxXTtcblxuICBpZiAoKHRpY2tNaW4gPD0gMCkgJiYgKDAgPD0gdGlja01heCkpIHtcblxuICAgIHZhciByZWZHcm91cCA9IEF4aXMubm9kZS5zZWxlY3RBbGwoXCIudGljazpub3QoLlwiICsgb2JqLnByZWZpeCArIFwibWlub3IpXCIpLFxuICAgICAgICByZWZMaW5lID0gcmVmR3JvdXAuc2VsZWN0KFwibGluZVwiKTtcblxuICAgIC8vIHplcm8gbGluZVxuICAgIHZhciB6ZXJvTGluZSA9IG5vZGUuYXBwZW5kKFwibGluZVwiKVxuICAgICAgLnN0eWxlKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwiY3Jpc3BFZGdlc1wiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ6ZXJvLWxpbmVcIik7XG5cbiAgICB2YXIgdHJhbnNmb3JtID0gWzAsIDBdO1xuXG4gICAgdHJhbnNmb3JtWzBdICs9IGQzLnRyYW5zZm9ybShub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBheGlzVHlwZSkuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdO1xuICAgIHRyYW5zZm9ybVsxXSArPSBkMy50cmFuc2Zvcm0obm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgYXhpc1R5cGUpLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVsxXTtcbiAgICB0cmFuc2Zvcm1bMF0gKz0gZDMudHJhbnNmb3JtKHJlZkdyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVswXTtcbiAgICB0cmFuc2Zvcm1bMV0gKz0gZDMudHJhbnNmb3JtKHJlZkdyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVsxXTtcblxuICAgIGlmIChheGlzVHlwZSA9PT0gXCJ4QXhpc1wiKSB7XG5cbiAgICAgIHplcm9MaW5lLmF0dHIoe1xuICAgICAgICBcInkxXCI6IHJlZkxpbmUuYXR0cihcInkxXCIpLFxuICAgICAgICBcInkyXCI6IHJlZkxpbmUuYXR0cihcInkyXCIpLFxuICAgICAgICBcIngxXCI6IDAsXG4gICAgICAgIFwieDJcIjogMCxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyB0cmFuc2Zvcm1bMF0gKyBcIixcIiArIHRyYW5zZm9ybVsxXSArIFwiKVwiXG4gICAgICB9KTtcblxuICAgIH0gZWxzZSBpZiAoYXhpc1R5cGUgPT09IFwieUF4aXNcIikge1xuXG4gICAgICB6ZXJvTGluZS5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiByZWZMaW5lLmF0dHIoXCJ4MVwiKSxcbiAgICAgICAgXCJ4MlwiOiByZWZMaW5lLmF0dHIoXCJ4MlwiKSxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IDAsXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgdHJhbnNmb3JtWzBdICsgXCIsXCIgKyB0cmFuc2Zvcm1bMV0gKyBcIilcIlxuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICByZWZMaW5lLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBBeGlzRmFjdG9yeTogQXhpc0ZhY3RvcnksXG4gIGF4aXNNYW5hZ2VyOiBheGlzTWFuYWdlcixcbiAgZGV0ZXJtaW5lRm9ybWF0OiBkZXRlcm1pbmVGb3JtYXQsXG4gIGFwcGVuZFhBeGlzOiBhcHBlbmRYQXhpcyxcbiAgYXBwZW5kWUF4aXM6IGFwcGVuZFlBeGlzLFxuICBkcmF3WUF4aXM6IGRyYXdZQXhpcyxcbiAgdGltZUF4aXM6IHRpbWVBeGlzLFxuICBkaXNjcmV0ZUF4aXM6IGRpc2NyZXRlQXhpcyxcbiAgb3JkaW5hbFRpbWVBeGlzOiBvcmRpbmFsVGltZUF4aXMsXG4gIHNldFRpY2tGb3JtYXRYOiBzZXRUaWNrRm9ybWF0WCxcbiAgc2V0VGlja0Zvcm1hdFk6IHNldFRpY2tGb3JtYXRZLFxuICB1cGRhdGVUZXh0WDogdXBkYXRlVGV4dFgsXG4gIHVwZGF0ZVRleHRZOiB1cGRhdGVUZXh0WSxcbiAgcmVwb3NpdGlvblRleHRZOiByZXBvc2l0aW9uVGV4dFksXG4gIG5ld1RleHROb2RlOiBuZXdUZXh0Tm9kZSxcbiAgZHJvcFRpY2tzOiBkcm9wVGlja3MsXG4gIGRyb3BPdmVyc2V0VGlja3M6IGRyb3BPdmVyc2V0VGlja3MsXG4gIGRyb3BSZWR1bmRhbnRUaWNrczogZHJvcFJlZHVuZGFudFRpY2tzLFxuICB0aWNrRmluZGVyWDogdGlja0ZpbmRlclgsXG4gIHRpY2tGaW5kZXJZOiB0aWNrRmluZGVyWSxcbiAgYXhpc0NsZWFudXA6IGF4aXNDbGVhbnVwLFxuICBhZGRaZXJvTGluZTogYWRkWmVyb0xpbmVcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2F4aXMuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gc2NhbGVNYW5hZ2VyKG9iaiwgYXhpc1R5cGUpIHtcblxuICB2YXIgYXhpcyA9IG9ialtheGlzVHlwZV0sXG4gICAgICBzY2FsZU9iaiA9IG5ldyBTY2FsZU9iaihvYmosIGF4aXMsIGF4aXNUeXBlKTtcblxuICB2YXIgc2NhbGUgPSBzZXRTY2FsZVR5cGUoc2NhbGVPYmoudHlwZSk7XG5cbiAgc2NhbGUuZG9tYWluKHNjYWxlT2JqLmRvbWFpbik7XG5cbiAgc2V0UmFuZ2VBcmdzKHNjYWxlLCBzY2FsZU9iaik7XG5cbiAgaWYgKGF4aXMubmljZSkgeyBuaWNlaWZ5KHNjYWxlLCBheGlzVHlwZSwgc2NhbGVPYmopOyB9XG4gIGlmIChheGlzLnJlc2NhbGUpIHsgcmVzY2FsZShzY2FsZSwgYXhpc1R5cGUsIGF4aXMpOyB9XG5cbiAgcmV0dXJuIHtcbiAgICBvYmo6IHNjYWxlT2JqLFxuICAgIHNjYWxlOiBzY2FsZVxuICB9O1xuXG59XG5cbmZ1bmN0aW9uIFNjYWxlT2JqKG9iaiwgYXhpcywgYXhpc1R5cGUpIHtcbiAgdGhpcy50eXBlID0gYXhpcy5zY2FsZTtcbiAgdGhpcy5kb21haW4gPSBzZXREb21haW4ob2JqLCBheGlzKTtcbiAgdGhpcy5yYW5nZVR5cGUgPSBzZXRSYW5nZVR5cGUoYXhpcyk7XG4gIHRoaXMucmFuZ2UgPSBzZXRSYW5nZShvYmosIGF4aXNUeXBlKTtcbiAgdGhpcy5iYW5kcyA9IG9iai5kaW1lbnNpb25zLmJhbmRzO1xuICB0aGlzLnJhbmdlUG9pbnRzID0gYXhpcy5yYW5nZVBvaW50cyB8fCAxLjA7XG59XG5cbmZ1bmN0aW9uIHNldFNjYWxlVHlwZSh0eXBlKSB7XG5cbiAgdmFyIHNjYWxlVHlwZTtcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMudGltZS5zY2FsZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5vcmRpbmFsKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJpZGVudGl0eVwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUuaWRlbnRpdHkoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJwb3dcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnBvdygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNxcnRcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnNxcnQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsb2dcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLmxvZygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInF1YW50aXplXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5xdWFudGl6ZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInF1YW50aWxlXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5xdWFudGlsZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRocmVzaG9sZFwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUudGhyZXNob2xkKCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBzY2FsZVR5cGU7XG5cbn1cblxuZnVuY3Rpb24gc2V0UmFuZ2VUeXBlKGF4aXMpIHtcblxuICB2YXIgdHlwZTtcblxuICBzd2l0Y2goYXhpcy5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgY2FzZSBcImxpbmVhclwiOlxuICAgICAgdHlwZSA9IFwicmFuZ2VcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgY2FzZSBcImRpc2NyZXRlXCI6XG4gICAgICB0eXBlID0gXCJyYW5nZVJvdW5kQmFuZHNcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcbiAgICAgIHR5cGUgPSBcInJhbmdlUG9pbnRzXCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdHlwZSA9IFwicmFuZ2VcIjtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHR5cGU7XG5cbn1cblxuZnVuY3Rpb24gc2V0UmFuZ2Uob2JqLCBheGlzVHlwZSkge1xuXG4gIHZhciByYW5nZTtcblxuICBpZiAoYXhpc1R5cGUgPT09IFwieEF4aXNcIikge1xuICAgIHJhbmdlID0gWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXTsgLy8gb3BlcmF0aW5nIG9uIHdpZHRoXG4gIH0gZWxzZSBpZiAoYXhpc1R5cGUgPT09IFwieUF4aXNcIikge1xuICAgIHJhbmdlID0gW29iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KCksIDBdOyAvLyBvcGVyYXRpbmcgb24gaGVpZ2h0XG4gIH1cblxuICByZXR1cm4gcmFuZ2U7XG5cbn1cblxuZnVuY3Rpb24gc2V0UmFuZ2VBcmdzKHNjYWxlLCBzY2FsZU9iaikge1xuXG4gIHN3aXRjaCAoc2NhbGVPYmoucmFuZ2VUeXBlKSB7XG4gICAgY2FzZSBcInJhbmdlXCI6XG4gICAgICByZXR1cm4gc2NhbGVbc2NhbGVPYmoucmFuZ2VUeXBlXShzY2FsZU9iai5yYW5nZSk7XG4gICAgY2FzZSBcInJhbmdlUm91bmRCYW5kc1wiOlxuICAgICAgcmV0dXJuIHNjYWxlW3NjYWxlT2JqLnJhbmdlVHlwZV0oc2NhbGVPYmoucmFuZ2UsIHNjYWxlT2JqLmJhbmRzLnBhZGRpbmcsIHNjYWxlT2JqLmJhbmRzLm91dGVyUGFkZGluZyk7XG4gICAgY2FzZSBcInJhbmdlUG9pbnRzXCI6XG4gICAgICByZXR1cm4gc2NhbGVbc2NhbGVPYmoucmFuZ2VUeXBlXShzY2FsZU9iai5yYW5nZSwgc2NhbGVPYmoucmFuZ2VQb2ludHMpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gc2V0RG9tYWluKG9iaiwgYXhpcykge1xuXG4gIHZhciBkYXRhID0gb2JqLmRhdGE7XG4gIHZhciBkb21haW47XG5cbiAgLy8gaW5jbHVkZWQgZmFsbGJhY2tzIGp1c3QgaW4gY2FzZVxuICBzd2l0Y2goYXhpcy5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgICBkb21haW4gPSBzZXREYXRlRG9tYWluKGRhdGEsIGF4aXMubWluLCBheGlzLm1heCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICB2YXIgY2hhcnRUeXBlID0gb2JqLm9wdGlvbnMudHlwZSxcbiAgICAgICAgICBmb3JjZU1heFZhbCxcbiAgICAgICAgICB1c2VEYXRhTWluaW11bTtcbiAgICAgIGlmIChjaGFydFR5cGUgPT09IFwiYXJlYVwiIHx8IGNoYXJ0VHlwZSA9PT0gXCJjb2x1bW5cIiB8fCBjaGFydFR5cGUgPT09IFwiYmFyXCIpIHtcbiAgICAgICAgZm9yY2VNYXhWYWwgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGNoYXJ0VHlwZSA9PT0gXCJzcGFya2xpbmVcIikge1xuICAgICAgICB1c2VEYXRhTWluaW11bSA9IHRydWU7XG4gICAgICB9XG4gICAgICBkb21haW4gPSBzZXROdW1lcmljYWxEb21haW4oZGF0YSwgYXhpcy5taW4sIGF4aXMubWF4LCBvYmoub3B0aW9ucy5zdGFja2VkLCBmb3JjZU1heFZhbCwgdXNlRGF0YU1pbmltdW0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG4gICAgICBkb21haW4gPSBzZXREaXNjcmV0ZURvbWFpbihkYXRhKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIGRvbWFpbjtcblxufVxuXG5mdW5jdGlvbiBzZXREYXRlRG9tYWluKGRhdGEsIG1pbiwgbWF4KSB7XG4gIGlmIChtaW4gJiYgbWF4KSB7XG4gICAgdmFyIHN0YXJ0RGF0ZSA9IG1pbiwgZW5kRGF0ZSA9IG1heDtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZGF0ZVJhbmdlID0gZDMuZXh0ZW50KGRhdGEuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0pO1xuICAgIHZhciBzdGFydERhdGUgPSBtaW4gfHwgbmV3IERhdGUoZGF0ZVJhbmdlWzBdKSxcbiAgICAgICAgZW5kRGF0ZSA9IG1heCB8fCBuZXcgRGF0ZShkYXRlUmFuZ2VbMV0pO1xuICB9XG4gIHJldHVybiBbc3RhcnREYXRlLCBlbmREYXRlXTtcbn1cblxuZnVuY3Rpb24gc2V0TnVtZXJpY2FsRG9tYWluKGRhdGEsIG1pbiwgbWF4LCBzdGFja2VkLCBmb3JjZU1heFZhbCwgdXNlRGF0YU1pbmltdW0pIHtcblxuICB2YXIgbWluVmFsLCBtYXhWYWw7XG4gIHZhciBtQXJyID0gW107XG5cbiAgZDMubWFwKGRhdGEuZGF0YSwgZnVuY3Rpb24oZCkge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgZC5zZXJpZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIG1BcnIucHVzaChOdW1iZXIoZC5zZXJpZXNbal0udmFsKSk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoc3RhY2tlZCkge1xuICAgIG1heFZhbCA9IGQzLm1heChkYXRhLnN0YWNrZWREYXRhW2RhdGEuc3RhY2tlZERhdGEubGVuZ3RoIC0gMV0sIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiAoZC55MCArIGQueSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbWF4VmFsID0gZDMubWF4KG1BcnIpO1xuICB9XG5cbiAgbWluVmFsID0gZDMubWluKG1BcnIpO1xuXG4gIGlmIChtaW4pIHtcbiAgICBtaW5WYWwgPSBtaW47XG4gIH0gZWxzZSBpZiAodXNlRGF0YU1pbmltdW0pIHtcbiAgICBtaW5WYWwgPSBkMy5taW4obUFycik7XG4gIH0gZWxzZSBpZiAobWluVmFsID4gMCkge1xuICAgIG1pblZhbCA9IDA7XG4gIH1cblxuICBpZiAobWF4KSB7XG4gICAgbWF4VmFsID0gbWF4O1xuICB9IGVsc2UgaWYgKG1heFZhbCA8IDAgJiYgZm9yY2VNYXhWYWwpIHtcbiAgICBtYXhWYWwgPSAwO1xuICB9XG5cbiAgcmV0dXJuIFttaW5WYWwsIG1heFZhbF07XG5cbn1cblxuZnVuY3Rpb24gc2V0RGlzY3JldGVEb21haW4oZGF0YSkge1xuICByZXR1cm4gZGF0YS5kYXRhLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBkLmtleTsgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc2NhbGUoc2NhbGUsIGF4aXNUeXBlLCBheGlzT2JqKSB7XG5cbiAgc3dpdGNoKGF4aXNPYmouc2NhbGUpIHtcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICBpZiAoIWF4aXNPYmoubWF4KSB7IHJlc2NhbGVOdW1lcmljYWwoc2NhbGUsIGF4aXNPYmopOyB9XG4gICAgICBicmVhaztcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNjYWxlTnVtZXJpY2FsKHNjYWxlLCBheGlzT2JqKSB7XG5cbiAgLy8gcmVzY2FsZXMgdGhlIFwidG9wXCIgZW5kIG9mIHRoZSBkb21haW5cbiAgdmFyIHRpY2tzID0gc2NhbGUudGlja3MoMTApLnNsaWNlKCksXG4gICAgICB0aWNrSW5jciA9IE1hdGguYWJzKHRpY2tzW3RpY2tzLmxlbmd0aCAtIDFdKSAtIE1hdGguYWJzKHRpY2tzW3RpY2tzLmxlbmd0aCAtIDJdKTtcblxuICB2YXIgbmV3TWF4ID0gdGlja3NbdGlja3MubGVuZ3RoIC0gMV0gKyB0aWNrSW5jcjtcblxuICBzY2FsZS5kb21haW4oW3NjYWxlLmRvbWFpbigpWzBdLCBuZXdNYXhdKTtcblxufVxuXG5mdW5jdGlvbiBuaWNlaWZ5KHNjYWxlLCBheGlzVHlwZSwgc2NhbGVPYmopIHtcblxuICBzd2l0Y2goc2NhbGVPYmoudHlwZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgICB2YXIgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmY7XG4gICAgICB2YXIgY29udGV4dCA9IHRpbWVEaWZmKHNjYWxlLmRvbWFpbigpWzBdLCBzY2FsZS5kb21haW4oKVsxXSwgMyk7XG4gICAgICBuaWNlaWZ5VGltZShzY2FsZSwgY29udGV4dCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICBuaWNlaWZ5TnVtZXJpY2FsKHNjYWxlKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gbmljZWlmeVRpbWUoc2NhbGUsIGNvbnRleHQpIHtcbiAgdmFyIGdldFRpbWVJbnRlcnZhbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lSW50ZXJ2YWw7XG4gIHZhciB0aW1lSW50ZXJ2YWwgPSBnZXRUaW1lSW50ZXJ2YWwoY29udGV4dCk7XG4gIHNjYWxlLmRvbWFpbihzY2FsZS5kb21haW4oKSkubmljZSh0aW1lSW50ZXJ2YWwpO1xufVxuXG5mdW5jdGlvbiBuaWNlaWZ5TnVtZXJpY2FsKHNjYWxlKSB7XG4gIHNjYWxlLmRvbWFpbihzY2FsZS5kb21haW4oKSkubmljZSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2NhbGVNYW5hZ2VyOiBzY2FsZU1hbmFnZXIsXG4gIFNjYWxlT2JqOiBTY2FsZU9iaixcbiAgc2V0U2NhbGVUeXBlOiBzZXRTY2FsZVR5cGUsXG4gIHNldFJhbmdlVHlwZTogc2V0UmFuZ2VUeXBlLFxuICBzZXRSYW5nZUFyZ3M6IHNldFJhbmdlQXJncyxcbiAgc2V0UmFuZ2U6IHNldFJhbmdlLFxuICBzZXREb21haW46IHNldERvbWFpbixcbiAgc2V0RGF0ZURvbWFpbjogc2V0RGF0ZURvbWFpbixcbiAgc2V0TnVtZXJpY2FsRG9tYWluOiBzZXROdW1lcmljYWxEb21haW4sXG4gIHNldERpc2NyZXRlRG9tYWluOiBzZXREaXNjcmV0ZURvbWFpbixcbiAgcmVzY2FsZTogcmVzY2FsZSxcbiAgcmVzY2FsZU51bWVyaWNhbDogcmVzY2FsZU51bWVyaWNhbCxcbiAgbmljZWlmeTogbmljZWlmeSxcbiAgbmljZWlmeVRpbWU6IG5pY2VpZnlUaW1lLFxuICBuaWNlaWZ5TnVtZXJpY2FsOiBuaWNlaWZ5TnVtZXJpY2FsXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zY2FsZS5qc1xuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBNdWx0aUxpbmVDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmICh4U2NhbGVPYmoub2JqLnR5cGUgPT09IFwib3JkaW5hbFwiKSB7XG4gICAgeFNjYWxlLnJhbmdlUm91bmRQb2ludHMoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgMS4wKTtcbiAgfVxuXG4gIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPT09IDEpIHsgb2JqLnNlcmllc0hpZ2hsaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfSB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pO1xuXG4gIC8vIFNlY29uZGFyeSBhcnJheSBpcyB1c2VkIHRvIHN0b3JlIGEgcmVmZXJlbmNlIHRvIGFsbCBzZXJpZXMgZXhjZXB0IGZvciB0aGUgaGlnaGxpZ2h0ZWQgaXRlbVxuICB2YXIgc2Vjb25kYXJ5QXJyID0gW107XG5cbiAgZm9yICh2YXIgaSA9IG9iai5kYXRhLnNlcmllc0Ftb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgLy8gRG9udCB3YW50IHRvIGluY2x1ZGUgdGhlIGhpZ2hsaWdodGVkIGl0ZW0gaW4gdGhlIGxvb3BcbiAgICAvLyBiZWNhdXNlIHdlIGFsd2F5cyB3YW50IGl0IHRvIHNpdCBhYm92ZSBhbGwgdGhlIG90aGVyIGxpbmVzXG5cbiAgICBpZiAoaSAhPT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG5cbiAgICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgICAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbaV0udmFsKTsgfSlcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW2ldLnZhbCk7IH0pO1xuXG4gICAgICB2YXIgcGF0aFJlZiA9IHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogbGluZSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibXVsdGlsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlsaW5lLVwiICsgKGkpO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBzZWNvbmRhcnlBcnIucHVzaChwYXRoUmVmKTtcbiAgICB9XG5cbiAgfVxuXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHNlY29uZGFyeSBzZXJpZXMgKGFsbCBzZXJpZXMgZXhjZXB0IHRoZSBoaWdobGlnaHRlZCBvbmUpXG4gIC8vIGFuZCBzZXQgdGhlIGNvbG91cnMgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcblxuICB2YXIgc2Vjb25kYXJ5QXJyID0gc2Vjb25kYXJ5QXJyLnJldmVyc2UoKTtcblxuICB2YXIgaExpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSlcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pO1xuXG4gIHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAuYXR0cih7XG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcIm11bHRpbGluZSBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpbGluZS1cIiArIChvYmouc2VyaWVzSGlnaGxpZ2h0KCkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH0sXG4gICAgICBcImRcIjogaExpbmVcbiAgICB9KTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBoTGluZTogaExpbmUsXG4gICAgbGluZTogbGluZVxuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpTGluZUNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvbXVsdGlsaW5lLmpzXG4gKiogbW9kdWxlIGlkID0gMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIFNwYXJrbGluZUNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gcmVzZXQgeUF4aXNQYWRkaW5nUmlnaHQgc2luY2Ugd2Ugd29uJ3QgaGF2ZSBhIHlBeGlzXG4gIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ID0gMDtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIHZhciBkb3RSYWRpdXMgPSA1O1xuXG4gIHhTY2FsZS5yYW5nZShbZG90UmFkaXVzLCB4U2NhbGUucmFuZ2UoKVsxXSAtIGRvdFJhZGl1c10pO1xuXG4gIHZhciBzcGFya2xpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzWzBdLnZhbCk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbMF0udmFsKTsgfSk7XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHsgcmV0dXJuIG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiOyB9KTtcblxuICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBvYmoub3B0aW9ucy50eXBlICsgXCIgXCIgKyBvYmoucHJlZml4ICsgb2JqLm9wdGlvbnMudHlwZSArIFwiLTAgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH0sXG4gICAgICBcImRcIjogc3BhcmtsaW5lXG4gICAgfSk7XG5cbiAgc2VyaWVzR3JvdXAuYXBwZW5kKFwibGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiemVyby1saW5lXCIsXG4gICAgICBcIngxXCI6IHhTY2FsZShvYmouZGF0YS5kYXRhWzBdLmtleSksXG4gICAgICBcIngyXCI6IHhTY2FsZShvYmouZGF0YS5kYXRhW29iai5kYXRhLmRhdGEubGVuZ3RoIC0gMV0ua2V5KSxcbiAgICAgIFwieTFcIjogeVNjYWxlKG9iai5kYXRhLmRhdGFbMF0uc2VyaWVzWzBdLnZhbCksXG4gICAgICBcInkyXCI6IHlTY2FsZShvYmouZGF0YS5kYXRhWzBdLnNlcmllc1swXS52YWwpXG4gICAgfSk7XG5cbiAgLy8gZGVidWdnZXI7XG5cbiAgdmFyIGRvdEdyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBvYmoucHJlZml4ICsgXCJkb3QtZ3JvdXBcIjtcbiAgICB9KTtcblxuICB2YXIgZG90U2NhbGUgPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLnNjYWxlO1xuXG4gIC8vIG5lZWQgdG8gaGFuZGxlIGRvdHMgbmVhciB0b3Agb3IgYm90dG9tLiBtYXliZSBjcmVhdGUgYSBkb3RSYWRpdXMtXG4gIC8vIHdpZGUgYm91bmRpbmcgYm94IHdpdGhpbiB0aGUgZ3JvdXAgZm9yIHRoZSBjaGFydD9cblxuICB2YXIgZmlyc3RMYXN0ID0gZG90R3JvdXAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgLmRhdGEoW29iai5kYXRhLmRhdGFbMF0sIG9iai5kYXRhLmRhdGFbb2JqLmRhdGEuZGF0YS5sZW5ndGggLSAxXV0pO1xuXG4gIGZpcnN0TGFzdC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY3hcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICB2YXIgc3ltYm9sID0gKGkgPT09IDApID8gMSA6IC0xO1xuICAgICAgICByZXR1cm4gZG90U2NhbGUoZC5rZXkpICsgKGRvdFJhZGl1cyAqIHN5bWJvbCk7XG4gICAgICB9LFxuICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbMF0udmFsKSB9LFxuICAgICAgXCJyXCI6IGRvdFJhZGl1c1xuICAgIH0pO1xuXG4gIHZhciBkYXRlRm9ybWF0dGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLmRhdGVGb3JtYXR0ZXIsXG4gICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIHNldFRleHRGb3JtYXQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLnNldFRpY2tGb3JtYXRZO1xuXG4gIHZhciBjdHggPSB0aW1lRGlmZihkb3RTY2FsZS5kb21haW4oKVswXSwgZG90U2NhbGUuZG9tYWluKClbZG90U2NhbGUuZG9tYWluKCkubGVuZ3RoIC0gMV0sIDgpO1xuXG4gIHZhciB0ZXh0ID0gZmlyc3RMYXN0LmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHJldHVybiAoaSA9PT0gMCkgPyBcInN0YXJ0XCIgOiBcImVuZFwiO1xuICAgIH0pO1xuXG4gIHRleHQuYXBwZW5kKFwidHNwYW5cIilcbiAgICAuYXR0cih7XG4gICAgICBcInhcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZG90U2NhbGUoZC5rZXkpOyB9LFxuICAgICAgXCJ5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1swXS52YWwpOyB9LFxuICAgICAgXCJkeVwiOiBcIjBlbVwiLFxuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0ZXh0X2RhdGVcIlxuICAgIH0pXG4gICAgLmNhbGwoZGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyKTtcblxuICB0ZXh0LmFwcGVuZChcInRzcGFuXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRvdFNjYWxlKGQua2V5KTsgfSxcbiAgICAgIFwieVwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbMF0udmFsKTsgfSxcbiAgICAgIFwiZHlcIjogXCIxZW1cIixcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGV4dF92YWx1ZVwiXG4gICAgfSlcbiAgICAudGV4dChmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgYXhpcyA9IG9iai55QXhpcyxcbiAgICAgICAgICBmb3JtYXR0ZWQgPSBzZXRUZXh0Rm9ybWF0KGF4aXMuZm9ybWF0LCBkLnNlcmllc1swXS52YWwpO1xuICAgICAgcmV0dXJuICgoYXhpcy5wcmVmaXggfHwgXCJcIikgKyBmb3JtYXR0ZWQgKyAoYXhpcy5zdWZmaXggfHwgXCJcIikpO1xuICAgIH0pO1xuXG4gIHZhciBsaW5lSGVpZ2h0O1xuXG4gIHRleHQuc2VsZWN0QWxsKFwidHNwYW5cIilcbiAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIGxpbmVIZWlnaHQgPSAyNjtcbiAgICAgIHZhciB5UG9zID0geVNjYWxlKGQuc2VyaWVzWzBdLnZhbCksXG4gICAgICAgICAgeVNoaWZ0ID0gZG90UmFkaXVzO1xuICAgICAgaWYgKHlQb3MgLyB5U2NhbGUucmFuZ2UoKVswXSA8IDAuNSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImFib3ZlXCIpO1xuICAgICAgICByZXR1cm4geVNjYWxlKGQuc2VyaWVzWzBdLnZhbCkgKyBsaW5lSGVpZ2h0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJiZWxvd1wiKTtcbiAgICAgICAgcmV0dXJuIHlTY2FsZShkLnNlcmllc1swXS52YWwpIC0gbGluZUhlaWdodDtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgKHlQb3MgLyB5U2NhbGUucmFuZ2UoKVswXSA8IDAuNSkgeyB5U2hpZnQgPSB5U2hpZnQgKiAtMTsgbGluZUhlaWdodCAqIC0xOyB9XG4gICAgICAvLyByZXR1cm4geVNjYWxlKGQuc2VyaWVzWzBdLnZhbCkgKyBsaW5lSGVpZ2h0O1xuICAgICAgLy8gcmV0dXJuIHlTY2FsZShkLnNlcmllc1swXS52YWwpO1xuICAgIH0pO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIGRvdEdyb3VwOiBkb3RHcm91cCxcbiAgICBzcGFya2xpbmU6IHNwYXJrbGluZVxuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwYXJrbGluZUNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvc3BhcmtsaW5lLmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIEFyZWFDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmICh4U2NhbGVPYmoub2JqLnR5cGUgPT09IFwib3JkaW5hbFwiKSB7XG4gICAgeFNjYWxlLnJhbmdlUm91bmRQb2ludHMoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgMS4wKTtcbiAgfVxuXG4gIC8vIHdoYT9cbiAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA9PT0gMSkgeyBvYmouc2VyaWVzSGlnaGxpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9IH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSk7XG5cbiAgLy8gU2Vjb25kYXJ5IGFycmF5IGlzIHVzZWQgdG8gc3RvcmUgYSByZWZlcmVuY2UgdG8gYWxsIHNlcmllcyBleGNlcHQgZm9yIHRoZSBoaWdobGlnaHRlZCBpdGVtXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBbXTtcblxuICBmb3IgKHZhciBpID0gb2JqLmRhdGEuc2VyaWVzQW1vdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAvLyBEb250IHdhbnQgdG8gaW5jbHVkZSB0aGUgaGlnaGxpZ2h0ZWQgaXRlbSBpbiB0aGUgbG9vcFxuICAgIC8vIGJlY2F1c2Ugd2UgYWx3YXlzIHdhbnQgaXQgdG8gc2l0IGFib3ZlIGFsbCB0aGUgb3RoZXIgbGluZXNcblxuICAgIGlmIChpICE9PSBvYmouc2VyaWVzSGlnaGxpZ2h0KCkpIHtcblxuICAgICAgdmFyIGFyZWEgPSBkMy5zdmcuYXJlYSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tpXS52YWwpOyB9KVxuICAgICAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgICAgICAueTAoeVNjYWxlKDApKVxuICAgICAgICAueTEoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW2ldLnZhbCk7IH0pO1xuXG4gICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAgICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW2ldLnZhbCk7IH0pXG4gICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tpXS52YWwpOyB9KTtcblxuICAgICAgdmFyIHBhdGhSZWYgPSBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkXCI6IGFyZWEsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImZpbGwgXCIgKyBvYmoucHJlZml4ICsgXCJmaWxsLVwiICsgKGkpO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkXCI6IGxpbmUsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJsaW5lLVwiICsgKGkpO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBzZWNvbmRhcnlBcnIucHVzaChwYXRoUmVmKTtcbiAgICB9XG5cbiAgfVxuXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHNlY29uZGFyeSBzZXJpZXMgKGFsbCBzZXJpZXMgZXhjZXB0IHRoZSBoaWdobGlnaHRlZCBvbmUpXG4gIC8vIGFuZCBzZXQgdGhlIGNvbG91cnMgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcblxuICB2YXIgc2Vjb25kYXJ5QXJyID0gc2Vjb25kYXJ5QXJyLnJldmVyc2UoKTtcblxuICB2YXIgaEFyZWEgPSBkMy5zdmcuYXJlYSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSlcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgIC55MCh5U2NhbGUoMCkpXG4gICAgLnkxKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pO1xuXG4gIHZhciBoTGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSk7XG5cbiAgc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiZFwiOiBoQXJlYSxcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwiZmlsbCBcIiArIG9iai5wcmVmaXggKyBcImZpbGwtXCIgKyAob2JqLnNlcmllc0hpZ2hsaWdodCgpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiZFwiOiBoTGluZSxcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAob2JqLnNlcmllc0hpZ2hsaWdodCgpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgaExpbmU6IGhMaW5lLFxuICAgIGhBcmVhOiBoQXJlYSxcbiAgICBsaW5lOiBsaW5lLFxuICAgIGFyZWE6IGFyZWFcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcmVhQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9hcmVhLmpzXG4gKiogbW9kdWxlIGlkID0gMjBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIFN0YWNrZWRBcmVhQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBpZiAoeFNjYWxlT2JqLm9iai50eXBlID09PSBcIm9yZGluYWxcIikge1xuICAgIHhTY2FsZS5yYW5nZVJvdW5kUG9pbnRzKFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sIDEuMCk7XG4gIH1cblxuICAvLyB3aGE/XG4gIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPT09IDEpIHsgb2JqLnNlcmllc0hpZ2hsaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfSB9XG5cbiAgbm9kZS5jbGFzc2VkKG9iai5wcmVmaXggKyBcInN0YWNrZWRcIiwgdHJ1ZSk7XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pO1xuXG4gIHZhciBzZXJpZXMgPSBzZXJpZXNHcm91cC5zZWxlY3RBbGwoXCJnLlwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzXCIpXG4gICAgLmRhdGEob2JqLmRhdGEuc3RhY2tlZERhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKFwic3ZnOmdcIilcbiAgICAuYXR0cih7XG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyAoaSk7XG4gICAgICAgIGlmIChpID09PSBvYmouc2VyaWVzSGlnaGxpZ2h0KCkpIHtcbiAgICAgICAgICBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyAoaSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgdmFyIGFyZWEgPSBkMy5zdmcuYXJlYSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQueTAgKyBkLnkpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9KVxuICAgIC55MChmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55MCk7IH0pXG4gICAgLnkxKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwICsgZC55KTsgfSk7XG5cbiAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQueTAgKyBkLnkpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9KVxuICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwICsgZC55KTsgfSk7XG5cbiAgc2VyaWVzLmFwcGVuZChcInBhdGhcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJmaWxsIFwiICsgb2JqLnByZWZpeCArIFwiZmlsbC1cIiArIChpKTtcbiAgICAgIGlmIChpID09PSBvYmouc2VyaWVzSGlnaGxpZ2h0KCkpIHtcbiAgICAgICAgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwiZmlsbCBcIiArIG9iai5wcmVmaXggKyBcImZpbGwtXCIgKyAoaSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwiZFwiLCBhcmVhKTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAoaSk7IH0pXG4gICAgLmF0dHIoXCJkXCIsIGxpbmUpO1xuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB5QXhpc09iaiwgXCJ5QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIHNlcmllczogc2VyaWVzLFxuICAgIGxpbmU6IGxpbmUsXG4gICAgYXJlYTogYXJlYVxuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrZWRBcmVhQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9zdGFja2VkLWFyZWEuanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gQ29sdW1uQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBzd2l0Y2ggKG9iai54QXhpcy5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG5cbiAgICAgIHZhciB0aW1lSW50ZXJ2YWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZUludGVydmFsLFxuICAgICAgICAgIHRpbWVFbGFwc2VkID0gdGltZUludGVydmFsKG9iai5kYXRhLmRhdGEpICsgMTtcbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIHRpbWVFbGFwc2VkIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuXG4gICAgICB4QXhpc09iai5yYW5nZSA9IFswLCAob2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoc2luZ2xlQ29sdW1uICogb2JqLmRhdGEuc2VyaWVzQW1vdW50KSldO1xuXG4gICAgICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWwtdGltZVwiOlxuXG4gICAgICB2YXIgc2luZ2xlQ29sdW1uID0geFNjYWxlKG9iai5kYXRhLmRhdGFbMV0ua2V5KSAtIHhTY2FsZShvYmouZGF0YS5kYXRhWzBdLmtleSk7XG5cbiAgICAgIG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cC5cIiArIG9iai5wcmVmaXggKyBcInhBeGlzXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAvIDIpKSArIFwiLFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkgKyBcIilcIik7XG5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgICB2YXIgc2luZ2xlQ29sdW1uID0geFNjYWxlLnJhbmdlQmFuZCgpIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bHRpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeE9mZnNldDtcbiAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgPT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAvIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeE9mZnNldCArIFwiLDApXCI7XG4gICAgfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmouZGF0YS5zZXJpZXNBbW91bnQ7IGkrKykge1xuXG4gICAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIGkpO1xuXG4gICAgdmFyIGNvbHVtbkl0ZW0gPSBzZXJpZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJjb2x1bW5cIilcbiAgICAgIC5kYXRhKG9iai5kYXRhLmRhdGEpLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiY29sdW1uIFwiICsgb2JqLnByZWZpeCArIFwiY29sdW1uLVwiICsgKGkpLFxuICAgICAgICBcImRhdGEtc2VyaWVzXCI6IGksXG4gICAgICAgIFwiZGF0YS1rZXlcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0sXG4gICAgICAgIFwiZGF0YS1sZWdlbmRcIjogZnVuY3Rpb24oKSB7IHJldHVybiBvYmouZGF0YS5rZXlzW2kgKyAxXTsgfSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHhTY2FsZShkLmtleSkgKyBcIiwwKVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBjb2x1bW5JdGVtLmFwcGVuZChcInJlY3RcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGQuc2VyaWVzW2ldLnZhbCA8IDAgPyBcIm5lZ2F0aXZlXCIgOiBcInBvc2l0aXZlXCI7XG4gICAgICAgIH0sXG4gICAgICAgIFwieFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKG9iai54QXhpcy5zY2FsZSAhPT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgICAgICAgICAgcmV0dXJuIGkgKiBzaW5nbGVDb2x1bW47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB4U2NhbGUoZC5rZXkpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInlcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGlmIChkLnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICByZXR1cm4geVNjYWxlKE1hdGgubWF4KDAsIGQuc2VyaWVzW2ldLnZhbCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJoZWlnaHRcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGlmIChkLnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoeVNjYWxlKGQuc2VyaWVzW2ldLnZhbCkgLSB5U2NhbGUoMCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3aWR0aFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gc2luZ2xlQ29sdW1uO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc2luZ2xlQ29sdW1uIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuXG4gICAgICB2YXIgY29sdW1uT2Zmc2V0ID0gb2JqLmRpbWVuc2lvbnMuYmFuZHMub2Zmc2V0O1xuXG4gICAgICBjb2x1bW5JdGVtLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwieFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoKGkgKiBzaW5nbGVDb2x1bW4pICsgKHNpbmdsZUNvbHVtbiAqIChjb2x1bW5PZmZzZXQgLyAyKSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShkLmtleSkgKyAoaSAqIChzaW5nbGVDb2x1bW4gLyBvYmouZGF0YS5zZXJpZXNBbW91bnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwid2lkdGhcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoc2luZ2xlQ29sdW1uIC0gKHNpbmdsZUNvbHVtbiAqIGNvbHVtbk9mZnNldCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZUNvbHVtbiAvIG9iai5kYXRhLnNlcmllc0Ftb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICB9XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgc2luZ2xlQ29sdW1uOiBzaW5nbGVDb2x1bW4sXG4gICAgY29sdW1uSXRlbTogY29sdW1uSXRlbVxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sdW1uQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9jb2x1bW4uanNcbiAqKiBtb2R1bGUgaWQgPSAyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gQmFyQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gYmVjYXVzZSB0aGUgZWxlbWVudHMgd2lsbCBiZSBhcHBlbmRlZCBpbiByZXZlcnNlIGR1ZSB0byB0aGVcbiAgLy8gYmFyIGNoYXJ0IG9wZXJhdGluZyBvbiB0aGUgeS1heGlzLCBuZWVkIHRvIHJldmVyc2UgdGhlIGRhdGFzZXQuXG4gIG9iai5kYXRhLmRhdGEucmV2ZXJzZSgpO1xuXG4gIHZhciB4QXhpc1NldHRpbmdzO1xuXG4gIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS54X2F4aXMpIHtcbiAgICB2YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvaGVscGVyc1wiKS5leHRlbmQ7XG4gICAgeEF4aXNTZXR0aW5ncyA9IGV4dGVuZChvYmoueEF4aXMsIG9iai5leHBvcnRhYmxlLnhfYXhpcyk7XG4gIH0gZWxzZSB7XG4gICAgeEF4aXNTZXR0aW5ncyA9IG9iai54QXhpcztcbiAgfVxuXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlO1xuXG4gIHZhciB4QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAuc2NhbGUoeFNjYWxlKVxuICAgIC5vcmllbnQoXCJib3R0b21cIik7XG5cbiAgdmFyIHhBeGlzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXBcIiArIFwiIFwiICsgb2JqLnByZWZpeCArIFwieEF4aXNcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiKTtcblxuICB2YXIgeEF4aXNOb2RlID0geEF4aXNHcm91cC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ4LWF4aXNcIilcbiAgICAuY2FsbCh4QXhpcyk7XG5cbiAgdmFyIHRleHRMZW5ndGhzID0gW107XG5cbiAgeEF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAuYXR0cihcInlcIiwgeEF4aXNTZXR0aW5ncy5iYXJPZmZzZXQpXG4gICAgLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB0ZXh0TGVuZ3Rocy5wdXNoKGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KTtcbiAgICB9KTtcblxuICB2YXIgdGFsbGVzdFRleHQgPSB0ZXh0TGVuZ3Rocy5yZWR1Y2UoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gKGEgPiBiID8gYSA6IGIpIH0pO1xuXG4gIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0ID0gdGFsbGVzdFRleHQgKyB4QXhpc1NldHRpbmdzLmJhck9mZnNldDtcblxuICB4QXhpc05vZGUuc2VsZWN0QWxsKFwiZ1wiKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSlcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtaW5vclwiLCB0cnVlKTtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIG5lZWQgdGhpcyBmb3IgZml4ZWQtaGVpZ2h0IGJhcnNcbiAgaWYgKCFvYmouZXhwb3J0YWJsZSB8fCAob2JqLmV4cG9ydGFibGUgJiYgIW9iai5leHBvcnRhYmxlLmR5bmFtaWNIZWlnaHQpKSB7XG4gICAgdmFyIHRvdGFsQmFySGVpZ2h0ID0gKG9iai5kaW1lbnNpb25zLmJhckhlaWdodCAqIG9iai5kYXRhLmRhdGEubGVuZ3RoICogb2JqLmRhdGEuc2VyaWVzQW1vdW50KTtcbiAgICB5U2NhbGUucmFuZ2VSb3VuZEJhbmRzKFt0b3RhbEJhckhlaWdodCwgMF0sIG9iai5kaW1lbnNpb25zLmJhbmRzLnBhZGRpbmcsIG9iai5kaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZyk7XG4gICAgb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQgPSB0b3RhbEJhckhlaWdodCAtICh0b3RhbEJhckhlaWdodCAqIG9iai5kaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZyAqIDIpO1xuICB9XG5cbiAgdmFyIHlBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgIC5zY2FsZSh5U2NhbGUpXG4gICAgLm9yaWVudChcImxlZnRcIik7XG5cbiAgdmFyIHlBeGlzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXBcIiArIFwiIFwiICsgb2JqLnByZWZpeCArIFwieUF4aXNcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpO1xuXG4gIHZhciB5QXhpc05vZGUgPSB5QXhpc0dyb3VwLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInktYXhpc1wiKVxuICAgIC5jYWxsKHlBeGlzKTtcblxuICB5QXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKS5yZW1vdmUoKTtcbiAgeUF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIikuYXR0cihcInhcIiwgMCk7XG5cbiAgaWYgKG9iai5kaW1lbnNpb25zLndpZHRoID4gb2JqLnlBeGlzLndpZHRoVGhyZXNob2xkKSB7XG4gICAgdmFyIG1heExhYmVsV2lkdGggPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLyAzLjU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heExhYmVsV2lkdGggPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLyAzO1xuICB9XG5cbiAgaWYgKHlBeGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoID4gbWF4TGFiZWxXaWR0aCkge1xuICAgIHZhciB3cmFwVGV4dCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS53cmFwVGV4dDtcbiAgICB5QXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgLmNhbGwod3JhcFRleHQsIG1heExhYmVsV2lkdGgpXG4gICAgICAuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRzcGFucyA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJ0c3BhblwiKSxcbiAgICAgICAgICAgIHRzcGFuQ291bnQgPSB0c3BhbnNbMF0ubGVuZ3RoLFxuICAgICAgICAgICAgdGV4dEhlaWdodCA9IGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodDtcbiAgICAgICAgaWYgKHRzcGFuQ291bnQgPiAxKSB7XG4gICAgICAgICAgdHNwYW5zXG4gICAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAgIFwieVwiOiAoKHRleHRIZWlnaHQgLyB0c3BhbkNvdW50KSAvIDIpIC0gKHRleHRIZWlnaHQgLyAyKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCA9IHlBeGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoO1xuXG4gIHlBeGlzR3JvdXAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBcIiwwKVwiKTtcblxuICB2YXIgdGlja0ZpbmRlclggPSBheGlzTW9kdWxlLnRpY2tGaW5kZXJZO1xuXG4gIGlmIChvYmoueEF4aXMud2lkdGhUaHJlc2hvbGQgPiBvYmouZGltZW5zaW9ucy53aWR0aCkge1xuICAgIHZhciB4QXhpc1RpY2tTZXR0aW5ncyA9IHsgdGlja0xvd2VyQm91bmQ6IDMsIHRpY2tVcHBlckJvdW5kOiA4LCB0aWNrR29hbDogNiB9O1xuICB9IGVsc2Uge1xuICAgIHZhciB4QXhpc1RpY2tTZXR0aW5ncyA9IHsgdGlja0xvd2VyQm91bmQ6IDMsIHRpY2tVcHBlckJvdW5kOiA4LCB0aWNrR29hbDogNCB9O1xuICB9XG5cbiAgdmFyIHRpY2tzID0gdGlja0ZpbmRlclgoeFNjYWxlLCBvYmoueEF4aXMudGlja3MsIHhBeGlzVGlja1NldHRpbmdzKTtcblxuICB4U2NhbGUucmFuZ2UoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSk7XG5cbiAgeEF4aXMudGlja1ZhbHVlcyh0aWNrcyk7XG5cbiAgeEF4aXNOb2RlLmNhbGwoeEF4aXMpO1xuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCIudGljayB0ZXh0XCIpXG4gICAgLmF0dHIoXCJ5XCIsIHhBeGlzU2V0dGluZ3MuYmFyT2Zmc2V0KVxuICAgIC5jYWxsKGF4aXNNb2R1bGUudXBkYXRlVGV4dFgsIHhBeGlzTm9kZSwgb2JqLCB4QXhpcywgb2JqLnhBeGlzKTtcblxuICBpZiAob2JqLmV4cG9ydGFibGUgJiYgb2JqLmV4cG9ydGFibGUuZHluYW1pY0hlaWdodCkge1xuICAgIC8vIHdvcmtpbmcgd2l0aCBhIGR5bmFtaWMgYmFyIGhlaWdodFxuICAgIHhBeGlzR3JvdXBcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSArIFwiKVwiKTtcbiAgfSBlbHNlIHtcbiAgICAvLyB3b3JraW5nIHdpdGggYSBmaXhlZCBiYXIgaGVpZ2h0XG4gICAgeEF4aXNHcm91cFxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyB0b3RhbEJhckhlaWdodCArIFwiKVwiKTtcbiAgfVxuXG4gIHZhciB4QXhpc1dpZHRoID0gZDMudHJhbnNmb3JtKHhBeGlzR3JvdXAuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdICsgeEF4aXNHcm91cC5ub2RlKCkuZ2V0QkJveCgpLndpZHRoO1xuXG4gIGlmICh4QXhpc1dpZHRoID4gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpKSB7XG5cbiAgICB4U2NhbGUucmFuZ2UoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHhBeGlzV2lkdGggLSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkpXSk7XG5cbiAgICB4QXhpc05vZGUuY2FsbCh4QXhpcyk7XG5cbiAgICB4QXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2sgdGV4dFwiKVxuICAgICAgLmF0dHIoXCJ5XCIsIHhBeGlzU2V0dGluZ3MuYmFyT2Zmc2V0KVxuICAgICAgLmNhbGwoYXhpc01vZHVsZS51cGRhdGVUZXh0WCwgeEF4aXNOb2RlLCBvYmosIHhBeGlzLCBvYmoueEF4aXMpO1xuXG4gIH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSlcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiKTtcblxuICB2YXIgc2luZ2xlQmFyID0geVNjYWxlLnJhbmdlQmFuZCgpIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmRhdGEuc2VyaWVzQW1vdW50OyBpKyspIHtcblxuICAgIHZhciBzZXJpZXMgPSBzZXJpZXNHcm91cC5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyBpKTtcblxuICAgIHZhciBiYXJJdGVtID0gc2VyaWVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwiYmFyXCIpXG4gICAgICAuZGF0YShvYmouZGF0YS5kYXRhKS5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcImJhciBcIiArIG9iai5wcmVmaXggKyBcImJhci1cIiArIChpKSxcbiAgICAgICAgXCJkYXRhLXNlcmllc1wiOiBpLFxuICAgICAgICBcImRhdGEta2V5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQua2V5OyB9LFxuICAgICAgICBcImRhdGEtbGVnZW5kXCI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gb2JqLmRhdGEua2V5c1tpICsgMV07IH0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoMCxcIiArIHlTY2FsZShkLmtleSkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBiYXJJdGVtLmFwcGVuZChcInJlY3RcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGQuc2VyaWVzW2ldLnZhbCA8IDAgPyBcIm5lZ2F0aXZlXCIgOiBcInBvc2l0aXZlXCI7XG4gICAgICAgIH0sXG4gICAgICAgIFwieFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIHhTY2FsZShNYXRoLm1pbigwLCBkLnNlcmllc1tpXS52YWwpKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBpICogc2luZ2xlQmFyO1xuICAgICAgICB9LFxuICAgICAgICBcIndpZHRoXCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoeFNjYWxlKGQuc2VyaWVzW2ldLnZhbCkgLSB4U2NhbGUoMCkpO1xuICAgICAgICB9LFxuICAgICAgICBcImhlaWdodFwiOiBmdW5jdGlvbihkKSB7IHJldHVybiBzaW5nbGVCYXI7IH1cbiAgICAgIH0pO1xuXG4gICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgIHZhciBiYXJPZmZzZXQgPSBvYmouZGltZW5zaW9ucy5iYW5kcy5vZmZzZXQ7XG4gICAgICBiYXJJdGVtLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwieVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAoKGkgKiBzaW5nbGVCYXIpICsgKHNpbmdsZUJhciAqIChiYXJPZmZzZXQgLyAyKSkpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoZWlnaHRcIjogc2luZ2xlQmFyIC0gKHNpbmdsZUJhciAqIGJhck9mZnNldClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gIH1cblxuICB4QXhpc05vZGUuc2VsZWN0QWxsKFwiZ1wiKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSlcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtaW5vclwiLCB0cnVlKTtcblxuICB4QXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieTFcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS5keW5hbWljSGVpZ2h0KSB7XG4gICAgICAgICAgLy8gZHluYW1pYyBoZWlnaHQsIHNvIGNhbGN1bGF0ZSB3aGVyZSB0aGUgeTEgc2hvdWxkIGdvXG4gICAgICAgICAgcmV0dXJuIC0ob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSAtIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmaXhlZCBoZWlnaHQsIHNvIHVzZSB0aGF0XG4gICAgICAgICAgcmV0dXJuIC0odG90YWxCYXJIZWlnaHQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJ5MlwiOiAwXG4gIH0pO1xuXG4gIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS5keW5hbWljSGVpZ2h0KSB7XG5cbiAgICAvLyBkeW5hbWljIGhlaWdodCwgb25seSBuZWVkIHRvIHRyYW5zZm9ybSB4LWF4aXMgZ3JvdXBcbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpIC0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpICsgXCIpXCIpO1xuXG4gIH0gZWxzZSB7XG5cbiAgICAvLyBmaXhlZCBoZWlnaHQsIHNvIHRyYW5zZm9ybSBhY2NvcmRpbmdseSBhbmQgbW9kaWZ5IHRoZSBkaW1lbnNpb24gZnVuY3Rpb24gYW5kIHBhcmVudCByZWN0c1xuXG4gICAgeEF4aXNHcm91cFxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyB0b3RhbEJhckhlaWdodCArIFwiKVwiKTtcblxuICAgIG9iai5kaW1lbnNpb25zLnRvdGFsWEF4aXNIZWlnaHQgPSB4QXhpc0dyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgICBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy50b3RhbFhBeGlzSGVpZ2h0OyB9O1xuXG4gICAgZDMuc2VsZWN0KG5vZGUubm9kZSgpLnBhcmVudE5vZGUpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1hcmdpbiA9IG9iai5kaW1lbnNpb25zLm1hcmdpbjtcbiAgICAgICAgcmV0dXJuIG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbTtcbiAgICAgIH0pO1xuXG4gICAgZDMuc2VsZWN0KG5vZGUubm9kZSgpLnBhcmVudE5vZGUpLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcImJnXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiaGVpZ2h0XCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gIH1cblxuICB2YXIgeEF4aXNPYmogPSB7IG5vZGU6IHhBeGlzR3JvdXAsIGF4aXM6IHhBeGlzIH0sXG4gICAgICB5QXhpc09iaiA9IHsgbm9kZTogeUF4aXNHcm91cCwgYXhpczogeUF4aXMgfTtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHhBeGlzT2JqLCBcInhBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgc2luZ2xlQmFyOiBzaW5nbGVCYXIsXG4gICAgYmFySXRlbTogYmFySXRlbVxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFyQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9iYXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gU3RhY2tlZENvbHVtbkNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIHN3aXRjaCAob2JqLnhBeGlzLnNjYWxlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcblxuICAgICAgdmFyIHRpbWVJbnRlcnZhbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lSW50ZXJ2YWwsXG4gICAgICAgICAgdGltZUVsYXBzZWQgPSB0aW1lSW50ZXJ2YWwob2JqLmRhdGEuZGF0YSk7XG4gICAgICB2YXIgc2luZ2xlQ29sdW1uID0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyB0aW1lRWxhcHNlZDtcblxuICAgICAgeEF4aXNPYmoucmFuZ2UgPSBbMCwgKG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gc2luZ2xlQ29sdW1uKV07XG5cbiAgICAgIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG5cbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSB4U2NhbGUob2JqLmRhdGEuZGF0YVsxXS5rZXkpIC0geFNjYWxlKG9iai5kYXRhLmRhdGFbMF0ua2V5KTtcblxuICAgICAgbm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwLlwiICsgb2JqLnByZWZpeCArIFwieEF4aXNcIilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoc2luZ2xlQ29sdW1uIC8gMikpICsgXCIsXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSAtIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KSArIFwiKVwiKTtcblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSB4U2NhbGUucmFuZ2VCYW5kKCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsaXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHhPZmZzZXQ7XG4gICAgICBpZiAob2JqLnhBeGlzLnNjYWxlID09PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgIHhPZmZzZXQgPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIChzaW5nbGVDb2x1bW4gLyAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHhPZmZzZXQgPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHhPZmZzZXQgKyBcIiwwKVwiO1xuICAgIH0pXG5cbiAgLy8gQWRkIGEgZ3JvdXAgZm9yIGVhY2hcbiAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLnNlbGVjdEFsbChcImcuXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNcIilcbiAgICAuZGF0YShvYmouZGF0YS5zdGFja2VkRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJzZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyAoaSk7IH0pO1xuXG4gIC8vIEFkZCBhIHJlY3QgZm9yIGVhY2ggZGF0YSBwb2ludC5cbiAgdmFyIHJlY3QgPSBzZXJpZXMuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgIC5kYXRhKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pXG4gICAgLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiY29sdW1uXCIsXG4gICAgICBcImRhdGEta2V5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQueDsgfSxcbiAgICAgIFwiZGF0YS1sZWdlbmRcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5sZWdlbmQ7IH0sXG4gICAgICBcInhcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0sXG4gICAgICBcInlcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKE1hdGgubWF4KDAsIGQueTAgKyBkLnkpKTsgfSxcbiAgICAgIFwiaGVpZ2h0XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIE1hdGguYWJzKHlTY2FsZShkLnkpIC0geVNjYWxlKDApKTsgfSxcbiAgICAgIFwid2lkdGhcIjogc2luZ2xlQ29sdW1uXG4gICAgfSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgcmVjdDogcmVjdFxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2tlZENvbHVtbkNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RhY2tlZC1jb2x1bW4uanNcbiAqKiBtb2R1bGUgaWQgPSAyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gU3RyZWFtZ3JhcGhDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmICh4U2NhbGVPYmoub2JqLnR5cGUgPT09IFwib3JkaW5hbFwiKSB7XG4gICAgeFNjYWxlLnJhbmdlUm91bmRQb2ludHMoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgMS4wKTtcbiAgfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCIsXG4gICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCJcbiAgICB9fSk7XG5cbiAgLy8gQWRkIGEgZ3JvdXAgZm9yIGVhY2ggY2F1c2UuXG4gIHZhciBzZXJpZXMgPSBzZXJpZXNHcm91cC5zZWxlY3RBbGwoXCJnLlwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzXCIpXG4gICAgLmRhdGEob2JqLmRhdGEuc3RhY2tlZERhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gb2JqLnByZWZpeCArIFwic2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzX1wiICsgKGkpOyB9KTtcblxuICB2YXIgYXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC54KTsgfSlcbiAgICAueTAoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTApOyB9KVxuICAgIC55MShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55MCArIGQueSk7IH0pO1xuXG4gIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9KVxuICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwICsgZC55KTsgfSk7XG5cbiAgc2VyaWVzLmFwcGVuZChcInBhdGhcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzdHJlYW0tc2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwic3RyZWFtLVwiICsgKGkpO1xuICAgICAgaWYgKGkgPT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuICAgICAgICBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzdHJlYW0tc2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwic3RyZWFtLVwiICsgKGkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSlcbiAgICAuYXR0cihcImRcIiwgYXJlYSk7XG5cbiAgc2VyaWVzLmFwcGVuZChcInBhdGhcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gb2JqLnByZWZpeCArIFwic3RyZWFtLXNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcImxpbmVcIjsgfSlcbiAgICAuYXR0cihcImRcIiwgbGluZSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgbGluZTogbGluZSxcbiAgICBhcmVhOiBhcmVhXG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RyZWFtZ3JhcGhDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0cmVhbWdyYXBoLmpzXG4gKiogbW9kdWxlIGlkID0gMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIHF1YWxpZmllckNvbXBvbmVudChub2RlLCBvYmopIHtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSAhPT0gXCJiYXJcIikge1xuXG4gICAgdmFyIHlBeGlzTm9kZSA9IG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwieUF4aXNcIik7XG5cbiAgICBpZiAob2JqLmVkaXRhYmxlKSB7XG5cbiAgICAgIHZhciBmb3JlaWduT2JqZWN0ID0geUF4aXNOb2RlLmFwcGVuZChcImZvcmVpZ25PYmplY3RcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiZm8gXCIgKyBvYmoucHJlZml4ICsgXCJxdWFsaWZpZXJcIixcbiAgICAgICAgICBcIndpZHRoXCI6IFwiMTAwJVwiXG4gICAgICAgIH0pO1xuXG4gICAgICB2YXIgZm9yZWlnbk9iamVjdEdyb3VwID0gZm9yZWlnbk9iamVjdC5hcHBlbmQoXCJ4aHRtbDpkaXZcIilcbiAgICAgICAgLmF0dHIoXCJ4bWxuc1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIik7XG5cbiAgICAgIHZhciBxdWFsaWZpZXJGaWVsZCA9IGZvcmVpZ25PYmplY3RHcm91cC5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiY2hhcnRfcXVhbGlmaWVyIGVkaXRhYmxlLWNoYXJ0X3F1YWxpZmllclwiLFxuICAgICAgICAgIFwiY29udGVudEVkaXRhYmxlXCI6IHRydWUsXG4gICAgICAgICAgXCJ4bWxuc1wiOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIlxuICAgICAgICB9KVxuICAgICAgICAudGV4dChvYmoucXVhbGlmaWVyKTtcblxuICAgICAgZm9yZWlnbk9iamVjdFxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJ3aWR0aFwiOiBxdWFsaWZpZXJGaWVsZC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyAxNSxcbiAgICAgICAgICBcImhlaWdodFwiOiBxdWFsaWZpZXJGaWVsZC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgKCAtIChxdWFsaWZpZXJGaWVsZC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KSAvIDIgKSArIFwiKVwiXG4gICAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdmFyIHF1YWxpZmllckJnID0geUF4aXNOb2RlLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXItdGV4dC1iZ1wiKVxuICAgICAgICAudGV4dChvYmoucXVhbGlmaWVyKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkeVwiOiBcIjAuMzJlbVwiLFxuICAgICAgICAgIFwieVwiOiBcIjBcIixcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwgMClcIlxuICAgICAgICB9KTtcblxuICAgICAgdmFyIHF1YWxpZmllclRleHQgPSB5QXhpc05vZGUuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImNoYXJ0X3F1YWxpZmllci10ZXh0XCIpXG4gICAgICAgIC50ZXh0KG9iai5xdWFsaWZpZXIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImR5XCI6IFwiMC4zMmVtXCIsXG4gICAgICAgICAgXCJ5XCI6IFwiMFwiLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLCAwKVwiXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHF1YWxpZmllckJnOiBxdWFsaWZpZXJCZyxcbiAgICBxdWFsaWZpZXJUZXh0OiBxdWFsaWZpZXJUZXh0XG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBxdWFsaWZpZXJDb21wb25lbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3F1YWxpZmllci5qc1xuICoqIG1vZHVsZSBpZCA9IDI2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIFRpcHMgaGFuZGxpbmcgbW9kdWxlLlxuICogQG1vZHVsZSBjaGFydHMvY29tcG9uZW50cy90aXBzXG4gKi9cblxuZnVuY3Rpb24gYmlzZWN0b3IoZGF0YSwga2V5VmFsLCBzdGFja2VkLCBpbmRleCkge1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHZhciBhcnIgPSBbXTtcbiAgICB2YXIgYmlzZWN0ID0gZDMuYmlzZWN0b3IoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC54OyB9KS5sZWZ0O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgYXJyLnB1c2goYmlzZWN0KGRhdGFbaV0sIGtleVZhbCkpO1xuICAgIH07XG4gICAgcmV0dXJuIGFycjtcbiAgfSBlbHNlIHtcbiAgICB2YXIgYmlzZWN0ID0gZDMuYmlzZWN0b3IoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0pLmxlZnQ7XG4gICAgcmV0dXJuIGJpc2VjdChkYXRhLCBrZXlWYWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGN1cnNvclBvcyhvdmVybGF5KSB7XG4gIHJldHVybiB7XG4gICAgeDogZDMubW91c2Uob3ZlcmxheS5ub2RlKCkpWzBdLFxuICAgIHk6IGQzLm1vdXNlKG92ZXJsYXkubm9kZSgpKVsxXVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRUaXBEYXRhKG9iaiwgY3Vyc29yKSB7XG5cbiAgdmFyIHhTY2FsZU9iaiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iaixcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSxcbiAgICAgIHNjYWxlVHlwZSA9IHhTY2FsZU9iai5vYmoudHlwZTtcblxuICB2YXIgeFZhbDtcblxuICBpZiAoc2NhbGVUeXBlID09PSBcIm9yZGluYWwtdGltZVwiIHx8IHNjYWxlVHlwZSA9PT0gXCJvcmRpbmFsXCIpIHtcblxuICAgIHZhciBvcmRpbmFsQmlzZWN0aW9uID0gZDMuYmlzZWN0b3IoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSkubGVmdCxcbiAgICAgICAgcmFuZ2VQb3MgPSBvcmRpbmFsQmlzZWN0aW9uKHhTY2FsZS5yYW5nZSgpLCBjdXJzb3IueCk7XG5cbiAgICB4VmFsID0geFNjYWxlLmRvbWFpbigpW3JhbmdlUG9zXTtcblxuICB9IGVsc2Uge1xuICAgIHhWYWwgPSB4U2NhbGUuaW52ZXJ0KGN1cnNvci54KTtcbiAgfVxuXG4gIHZhciB0aXBEYXRhO1xuXG4gIGlmIChvYmoub3B0aW9ucy5zdGFja2VkKSB7XG4gICAgdmFyIGRhdGEgPSBvYmouZGF0YS5zdGFja2VkRGF0YTtcbiAgICB2YXIgaSA9IGJpc2VjdG9yKGRhdGEsIHhWYWwsIG9iai5vcHRpb25zLnN0YWNrZWQpO1xuXG4gICAgdmFyIGFyciA9IFtdLFxuICAgICAgICByZWZJbmRleDtcblxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgZGF0YS5sZW5ndGg7IGsrKykge1xuICAgICAgaWYgKHJlZkluZGV4KSB7XG4gICAgICAgIGFyci5wdXNoKGRhdGFba11bcmVmSW5kZXhdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkMCA9IGRhdGFba11baVtrXSAtIDFdLFxuICAgICAgICAgICAgZDEgPSBkYXRhW2tdW2lba11dO1xuICAgICAgICByZWZJbmRleCA9IHhWYWwgLSBkMC54ID4gZDEueCAtIHhWYWwgPyBpW2tdIDogKGlba10gLSAxKTtcbiAgICAgICAgYXJyLnB1c2goZGF0YVtrXVtyZWZJbmRleF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRpcERhdGEgPSBhcnI7XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgZGF0YSA9IG9iai5kYXRhLmRhdGE7XG4gICAgdmFyIGkgPSBiaXNlY3RvcihkYXRhLCB4VmFsKTtcbiAgICB2YXIgZDAgPSBkYXRhW2kgLSAxXSxcbiAgICAgICAgZDEgPSBkYXRhW2ldO1xuXG4gICAgdGlwRGF0YSA9IHhWYWwgLSBkMC5rZXkgPiBkMS5rZXkgLSB4VmFsID8gZDEgOiBkMDtcbiAgfVxuXG4gIHJldHVybiB0aXBEYXRhO1xuXG59XG5cbmZ1bmN0aW9uIHNob3dUaXBzKHRpcE5vZGVzLCBvYmopIHtcblxuICBpZiAodGlwTm9kZXMueFRpcExpbmUpIHtcbiAgICB0aXBOb2Rlcy54VGlwTGluZS5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCB0cnVlKTtcbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy50aXBCb3gpIHtcbiAgICB0aXBOb2Rlcy50aXBCb3guY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgdHJ1ZSk7XG4gIH1cblxuICBpZiAodGlwTm9kZXMudGlwUGF0aENpcmNsZXMpIHtcbiAgICB0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlcy5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCB0cnVlKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGhpZGVUaXBzKHRpcE5vZGVzLCBvYmopIHtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSA9PT0gXCJjb2x1bW5cIikge1xuICAgIGlmKG9iai5vcHRpb25zLnN0YWNrZWQpe1xuICAgICAgb2JqLnJlbmRlcmVkLnBsb3Quc2VyaWVzLnNlbGVjdEFsbChcInJlY3RcIikuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtdXRlZFwiLCBmYWxzZSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBvYmoucmVuZGVyZWQucGxvdC5jb2x1bW5JdGVtLnNlbGVjdEFsbChcInJlY3RcIikuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtdXRlZFwiLCBmYWxzZSk7XG4gICAgfVxuXG4gIH1cblxuICBpZiAodGlwTm9kZXMueFRpcExpbmUpIHtcbiAgICB0aXBOb2Rlcy54VGlwTGluZS5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmYWxzZSk7XG4gIH1cblxuICBpZiAodGlwTm9kZXMudGlwQm94KSB7XG4gICAgdGlwTm9kZXMudGlwQm94LmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZhbHNlKTtcbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlcykge1xuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZhbHNlKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIG1vdXNlSWRsZSh0aXBOb2Rlcywgb2JqKSB7XG4gIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIGhpZGVUaXBzKHRpcE5vZGVzLCBvYmopO1xuICB9LCBvYmoudGlwVGltZW91dCk7XG59XG5cbnZhciB0aW1lb3V0O1xuXG5mdW5jdGlvbiB0aXBzTWFuYWdlcihub2RlLCBvYmopIHtcblxuICB2YXIgdGlwTm9kZXMgPSBhcHBlbmRUaXBHcm91cChub2RlLCBvYmopO1xuXG4gIHZhciBmbnMgPSB7XG4gICAgbGluZTogTGluZUNoYXJ0VGlwcyxcbiAgICBtdWx0aWxpbmU6IExpbmVDaGFydFRpcHMsXG4gICAgYXJlYTogb2JqLm9wdGlvbnMuc3RhY2tlZCA/IFN0YWNrZWRBcmVhQ2hhcnRUaXBzIDogQXJlYUNoYXJ0VGlwcyxcbiAgICBjb2x1bW46IG9iai5vcHRpb25zLnN0YWNrZWQgPyBTdGFja2VkQ29sdW1uQ2hhcnRUaXBzIDogQ29sdW1uQ2hhcnRUaXBzLFxuICAgIHN0cmVhbTogU3RyZWFtZ3JhcGhUaXBzXG4gIH07XG5cbiAgdmFyIGRhdGFSZWZlcmVuY2U7XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwibXVsdGlsaW5lXCIpIHtcbiAgICBkYXRhUmVmZXJlbmNlID0gW29iai5kYXRhLmRhdGFbMF0uc2VyaWVzWzBdXTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhUmVmZXJlbmNlID0gb2JqLmRhdGEuZGF0YVswXS5zZXJpZXM7XG4gIH1cblxuICB2YXIgaW5uZXJUaXBFbGVtZW50cyA9IGFwcGVuZFRpcEVsZW1lbnRzKG5vZGUsIG9iaiwgdGlwTm9kZXMsIGRhdGFSZWZlcmVuY2UpO1xuXG4gIHN3aXRjaCAob2JqLm9wdGlvbnMudHlwZSkge1xuICAgIGNhc2UgXCJsaW5lXCI6XG4gICAgY2FzZSBcIm11bHRpbGluZVwiOlxuICAgIGNhc2UgXCJhcmVhXCI6XG4gICAgY2FzZSBcInN0cmVhbVwiOlxuXG4gICAgICB0aXBOb2Rlcy5vdmVybGF5ID0gdGlwTm9kZXMudGlwTm9kZS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcInRpcF9vdmVybGF5XCIsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgICAgICBcIndpZHRoXCI6IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpLFxuICAgICAgICAgIFwiaGVpZ2h0XCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KClcbiAgICAgICAgfSk7XG5cbiAgICAgIHRpcE5vZGVzLm92ZXJsYXlcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKCkgeyBzaG93VGlwcyh0aXBOb2Rlcywgb2JqKTsgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7IGhpZGVUaXBzKHRpcE5vZGVzLCBvYmopOyB9KVxuICAgICAgICAub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2hvd1RpcHModGlwTm9kZXMsIG9iaik7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBtb3VzZUlkbGUodGlwTm9kZXMsIG9iaik7XG4gICAgICAgICAgcmV0dXJuIGZuc1tvYmoub3B0aW9ucy50eXBlXSh0aXBOb2RlcywgaW5uZXJUaXBFbGVtZW50cywgb2JqKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcImNvbHVtblwiOlxuXG4gICAgICB2YXIgY29sdW1uUmVjdHM7XG5cbiAgICAgIGlmIChvYmoub3B0aW9ucy5zdGFja2VkKSB7XG4gICAgICAgIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3Quc2VyaWVzLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2x1bW5SZWN0cyA9IG9iai5yZW5kZXJlZC5wbG90LmNvbHVtbkl0ZW0uc2VsZWN0QWxsKCdyZWN0Jyk7XG4gICAgICB9XG5cbiAgICAgIGNvbHVtblJlY3RzXG4gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgc2hvd1RpcHModGlwTm9kZXMsIG9iaik7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBtb3VzZUlkbGUodGlwTm9kZXMsIG9iaik7XG4gICAgICAgICAgZm5zLmNvbHVtbih0aXBOb2Rlcywgb2JqLCBkLCB0aGlzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGhpZGVUaXBzKHRpcE5vZGVzLCBvYmopO1xuICAgICAgICB9KTtcblxuICAgICAgYnJlYWs7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBhcHBlbmRUaXBHcm91cChub2RlLCBvYmopIHtcblxuICB2YXIgc3ZnTm9kZSA9IGQzLnNlbGVjdChub2RlLm5vZGUoKS5wYXJlbnROb2RlKSxcbiAgICAgIGNoYXJ0Tm9kZSA9IGQzLnNlbGVjdChub2RlLm5vZGUoKS5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuXG4gIHZhciB0aXBOb2RlID0gc3ZnTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyBvYmouZGltZW5zaW9ucy5tYXJnaW4ubGVmdCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMubWFyZ2luLnRvcCArIFwiKVwiLFxuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0aXBcIlxuICAgIH0pXG4gICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwidGlwX3N0YWNrZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gb2JqLm9wdGlvbnMuc3RhY2tlZCA/IHRydWUgOiBmYWxzZTtcbiAgICB9KTtcblxuICB2YXIgeFRpcExpbmUgPSB0aXBOb2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInRpcF9saW5lLXhcIilcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZmFsc2UpO1xuXG4gIHhUaXBMaW5lLmFwcGVuZChcImxpbmVcIik7XG5cbiAgdmFyIHRpcEJveCA9IHRpcE5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwX2JveFwiLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIlxuICAgIH0pO1xuXG4gIHZhciB0aXBSZWN0ID0gdGlwQm94LmFwcGVuZChcInJlY3RcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcInRpcF9yZWN0XCIsXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZSgwLDApXCIsXG4gICAgICBcIndpZHRoXCI6IDEsXG4gICAgICBcImhlaWdodFwiOiAxXG4gICAgfSk7XG5cbiAgdmFyIHRpcEdyb3VwID0gdGlwQm94LmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInRpcF9ncm91cFwiKTtcblxuICB2YXIgbGVnZW5kSWNvbiA9IGNoYXJ0Tm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbV9pY29uXCIpLm5vZGUoKTtcblxuICBpZiAobGVnZW5kSWNvbikge1xuICAgIHZhciByYWRpdXMgPSBsZWdlbmRJY29uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC8gMjtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcmFkaXVzID0gMDtcbiAgfVxuXG4gIHZhciB0aXBQYXRoQ2lyY2xlcyA9IHRpcE5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlLWdyb3VwXCIpO1xuXG4gIHZhciB0aXBUZXh0RGF0ZSA9IHRpcEdyb3VwXG4gICAgLmluc2VydChcImdcIiwgXCI6Zmlyc3QtY2hpbGRcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWRhdGUtZ3JvdXBcIilcbiAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwX3RleHQtZGF0ZVwiLFxuICAgICAgXCJ4XCI6IDAsXG4gICAgICBcInlcIjogMCxcbiAgICAgIFwiZHlcIjogXCIxZW1cIlxuICAgIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3ZnOiBzdmdOb2RlLFxuICAgIHRpcE5vZGU6IHRpcE5vZGUsXG4gICAgeFRpcExpbmU6IHhUaXBMaW5lLFxuICAgIHRpcEJveDogdGlwQm94LFxuICAgIHRpcFJlY3Q6IHRpcFJlY3QsXG4gICAgdGlwR3JvdXA6IHRpcEdyb3VwLFxuICAgIGxlZ2VuZEljb246IGxlZ2VuZEljb24sXG4gICAgdGlwUGF0aENpcmNsZXM6IHRpcFBhdGhDaXJjbGVzLFxuICAgIHJhZGl1czogcmFkaXVzLFxuICAgIHRpcFRleHREYXRlOiB0aXBUZXh0RGF0ZVxuICB9O1xuXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFRpcEVsZW1lbnRzKG5vZGUsIG9iaiwgdGlwTm9kZXMsIGRhdGFSZWYpIHtcblxuICB2YXIgdGlwVGV4dEdyb3VwQ29udGFpbmVyID0gdGlwTm9kZXMudGlwR3JvdXBcbiAgICAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAtY29udGFpbmVyXCI7XG4gICAgfSk7XG5cbiAgdmFyIHRpcFRleHRHcm91cHMgPSB0aXBUZXh0R3JvdXBDb250YWluZXJcbiAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAuZGF0YShkYXRhUmVmKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHJldHVybiBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCBcIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwLVwiICsgKGkpO1xuICAgIH0pO1xuXG4gIHZhciBsaW5lSGVpZ2h0O1xuXG4gIHRpcFRleHRHcm91cHMuYXBwZW5kKFwidGV4dFwiKVxuICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudmFsOyB9KVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gKG9iai5wcmVmaXggKyBcInRpcF90ZXh0IFwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtXCIgKyAoaSkpO1xuICAgICAgfSxcbiAgICAgIFwiZGF0YS1zZXJpZXNcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gZC5rZXk7IH0sXG4gICAgICBcInhcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAodGlwTm9kZXMucmFkaXVzICogMikgKyAodGlwTm9kZXMucmFkaXVzIC8gMS41KTtcbiAgICAgIH0sXG4gICAgICBcInlcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICBsaW5lSGVpZ2h0ID0gbGluZUhlaWdodCB8fCBwYXJzZUludChkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJsaW5lLWhlaWdodFwiKSk7XG4gICAgICAgIHJldHVybiAoaSArIDEpICogbGluZUhlaWdodDtcbiAgICAgIH0sXG4gICAgICBcImR5XCI6IFwiMWVtXCJcbiAgICB9KTtcblxuICB0aXBUZXh0R3JvdXBzXG4gICAgLmFwcGVuZChcImNpcmNsZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gKG9iai5wcmVmaXggKyBcInRpcF9jaXJjbGUgXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfY2lyY2xlLVwiICsgKGkpKTtcbiAgICAgIH0sXG4gICAgICBcInJcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gdGlwTm9kZXMucmFkaXVzOyB9LFxuICAgICAgXCJjeFwiOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRpcE5vZGVzLnJhZGl1czsgfSxcbiAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gKChpICsgMSkgKiBsaW5lSGVpZ2h0KSArICh0aXBOb2Rlcy5yYWRpdXMgKiAxLjUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgIC5kYXRhKGRhdGFSZWYpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAob2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlIFwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlLVwiICsgKGkpKTtcbiAgICAgIH0sXG4gICAgICBcInJcIjogKHRpcE5vZGVzLnJhZGl1cyAvIDIpIHx8IDIuNVxuICAgIH0pO1xuXG4gIHJldHVybiB0aXBUZXh0R3JvdXBzO1xuXG59XG5cbmZ1bmN0aW9uIExpbmVDaGFydFRpcHModGlwTm9kZXMsIGlubmVyVGlwRWxzLCBvYmopIHtcblxuICB2YXIgY3Vyc29yID0gY3Vyc29yUG9zKHRpcE5vZGVzLm92ZXJsYXkpLFxuICAgICAgdGlwRGF0YSA9IGdldFRpcERhdGEob2JqLCBjdXJzb3IpO1xuXG4gIHZhciBpc1VuZGVmaW5lZCA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXBEYXRhLnNlcmllcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhLnNlcmllc1tpXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICBpc1VuZGVmaW5lZCsrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFpc1VuZGVmaW5lZCkge1xuXG4gICAgdmFyIHlGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi9heGlzXCIpLnNldFRpY2tGb3JtYXRZLFxuICAgICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgICAgZGF0ZUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS5kYXRlRm9ybWF0dGVyLFxuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoZC52YWwpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJuL2FcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgLmNhbGwoZGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3A7XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7IH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAoZC52YWwpIHsgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZShkLnZhbCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieTFcIjogMCxcbiAgICAgICAgXCJ5MlwiOiBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gQXJlYUNoYXJ0VGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmLFxuICAgICAgICBkYXRlRm9ybWF0dGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLmRhdGVGb3JtYXR0ZXIsXG4gICAgICAgIGRvbWFpbiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZS5kb21haW4oKSxcbiAgICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIHRleHRcIilcbiAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICBpZiAoIW9iai55QXhpcy5wcmVmaXgpIHsgb2JqLnlBeGlzLnByZWZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKCFvYmoueUF4aXMuc3VmZml4KSB7IG9iai55QXhpcy5zdWZmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmIChkLnZhbCkge1xuICAgICAgICAgIHJldHVybiBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIm4vYVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAuY2FsbChkYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGEua2V5KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGQudmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHkgPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcDtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGVcIilcbiAgICAgICAgLmRhdGEodGlwRGF0YS5zZXJpZXMpXG4gICAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTsgfSlcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY3hcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGlmIChkLnZhbCkgeyByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueVNjYWxlT2JqLnNjYWxlKGQudmFsKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBSZWN0XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwid2lkdGhcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5yaWdodCxcbiAgICAgICAgXCJoZWlnaHRcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5ib3R0b21cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMueFRpcExpbmUuc2VsZWN0KFwibGluZVwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIngxXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieDJcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCAtIGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIH1cblxufVxuXG5mdW5jdGlvbiBTdGFja2VkQXJlYUNoYXJ0VGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGlwRGF0YVtpXS55ID09PSBOYU4gfHwgdGlwRGF0YVtpXS55MCA9PT0gTmFOKSB7XG4gICAgICBpc1VuZGVmaW5lZCsrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFpc1VuZGVmaW5lZCkge1xuXG4gICAgdmFyIHlGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi9heGlzXCIpLnNldFRpY2tGb3JtYXRZLFxuICAgICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgICAgZGF0ZUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS5kYXRlRm9ybWF0dGVyLFxuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cblxuICAgICAgICB2YXIgdGV4dDtcblxuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRpcERhdGEubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIHRleHQgPSBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnJhdy5zZXJpZXNbaV0udmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dCA9IFwibi9hXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoayA9PT0gaSkge1xuICAgICAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYXNVbmRlZmluZWQgJiYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSkge1xuICAgICAgICAgICAgICB0ZXh0ID0gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC5yYXcuc2VyaWVzW2ldLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHQgPSBcIm4vYVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAuY2FsbChkYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGFbMF0ueCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIgJiYgIWhhc1VuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHkgPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcDtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGVcIilcbiAgICAgICAgLmRhdGEodGlwRGF0YSlcbiAgICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiICYmICFoYXNVbmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjeFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKGQueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHRcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgdmFyIHkgPSBkLnkgfHwgMCxcbiAgICAgICAgICAgICAgICB5MCA9IGQueTAgfHwgMDtcbiAgICAgICAgICAgIHJldHVybiBvYmoucmVuZGVyZWQucGxvdC55U2NhbGVPYmouc2NhbGUoeSArIHkwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ4MlwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIFN0cmVhbWdyYXBoVGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGlwRGF0YVtpXS55ID09PSBOYU4gfHwgdGlwRGF0YVtpXS55MCA9PT0gTmFOKSB7XG4gICAgICBpc1VuZGVmaW5lZCsrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFpc1VuZGVmaW5lZCkge1xuXG4gICAgdmFyIHlGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi9heGlzXCIpLnNldFRpY2tGb3JtYXRZLFxuICAgICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgICAgZGF0ZUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS5kYXRlRm9ybWF0dGVyLFxuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cblxuICAgICAgICB2YXIgdGV4dDtcblxuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRpcERhdGEubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIHRleHQgPSBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnJhdy5zZXJpZXNbaV0udmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dCA9IFwibi9hXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoayA9PT0gaSkge1xuICAgICAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYXNVbmRlZmluZWQgJiYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSkge1xuICAgICAgICAgICAgICB0ZXh0ID0gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC5yYXcuc2VyaWVzW2ldLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHQgPSBcIm4vYVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAuY2FsbChkYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGFbMF0ueCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIgJiYgIWhhc1VuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHkgPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcDtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGVcIilcbiAgICAgICAgLmRhdGEodGlwRGF0YSlcbiAgICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiICYmICFoYXNVbmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjeFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKGQueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHRcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgdmFyIHkgPSBkLnkgfHwgMCxcbiAgICAgICAgICAgICAgICB5MCA9IGQueTAgfHwgMDtcbiAgICAgICAgICAgIHJldHVybiBvYmoucmVuZGVyZWQucGxvdC55U2NhbGVPYmouc2NhbGUoeSArIHkwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ4MlwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIENvbHVtbkNoYXJ0VGlwcyh0aXBOb2Rlcywgb2JqLCBkLCB0aGlzUmVmKSB7XG5cbiAgdmFyIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3QuY29sdW1uSXRlbS5zZWxlY3RBbGwoJ3JlY3QnKSxcbiAgICAgIGlzVW5kZWZpbmVkID0gMDtcblxuICB2YXIgdGhpc0NvbHVtbiA9IHRoaXNSZWYsXG4gICAgICB0aXBEYXRhID0gZDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGRhdGVGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikuZGF0ZUZvcm1hdHRlcixcbiAgICAgIGdldFRyYW5zbGF0ZVhZID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLmdldFRyYW5zbGF0ZVhZLFxuICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHZhciBjdXJzb3JYID0gZ2V0VHJhbnNsYXRlWFkodGhpc0NvbHVtbi5wYXJlbnROb2RlKTtcblxuICAgIGNvbHVtblJlY3RzXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgJ211dGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMgPT09IHRoaXNDb2x1bW4pID8gZmFsc2UgOiB0cnVlO1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcblxuICAgICAgICBpZiAoIW9iai55QXhpcy5wcmVmaXgpIHsgb2JqLnlBeGlzLnByZWZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKCFvYmoueUF4aXMuc3VmZml4KSB7IG9iai55QXhpcy5zdWZmaXggPSBcIlwiOyB9XG5cbiAgICAgICAgaWYgKGQudmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQudmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwibi9hXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgaWYob2JqLmRhdGVGb3JtYXQgIT09IHVuZGVmaW5lZCl7XG4gICAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgICAuY2FsbChkYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGEua2V5KTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAgIC50ZXh0KHRpcERhdGEua2V5KTtcbiAgICB9XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuXG4gICAgICAgICAgaWYoeCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMil7XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgc2hvd1RpcHModGlwTm9kZXMsIG9iaik7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIFN0YWNrZWRDb2x1bW5DaGFydFRpcHModGlwTm9kZXMsIG9iaiwgZCwgdGhpc1JlZikge1xuXG4gIHZhciBjb2x1bW5SZWN0cyA9IG9iai5yZW5kZXJlZC5wbG90LnNlcmllcy5zZWxlY3RBbGwoJ3JlY3QnKSxcbiAgICAgIGlzVW5kZWZpbmVkID0gMDtcblxuICB2YXIgdGhpc0NvbHVtblJlY3QgPSB0aGlzUmVmLFxuICAgICAgdGlwRGF0YSA9IGQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXBEYXRhLnJhdy5zZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGlwRGF0YS5yYXcuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGRhdGVGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikuZGF0ZUZvcm1hdHRlcixcbiAgICAgIGRvbWFpbiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZS5kb21haW4oKSxcbiAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB2YXIgcGFyZW50RWwgPSBkMy5zZWxlY3QodGhpc0NvbHVtblJlY3QucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICB2YXIgcmVmUG9zID0gZDMuc2VsZWN0KHRoaXNDb2x1bW5SZWN0KS5hdHRyKFwieFwiKTtcblxuICAgIHZhciB0aGlzQ29sdW1uS2V5ID0gJyc7XG5cbiAgICAvKiBGaWd1cmUgb3V0IHdoaWNoIHN0YWNrIHRoaXMgc2VsZWN0ZWQgcmVjdCBpcyBpbiB0aGVuIGxvb3AgYmFjayB0aHJvdWdoIGFuZCAodW4pYXNzaWduIG11dGVkIGNsYXNzICovXG4gICAgY29sdW1uUmVjdHMuY2xhc3NlZChvYmoucHJlZml4ICsgJ211dGVkJyxmdW5jdGlvbiAoZCkge1xuXG4gICAgICBpZih0aGlzID09PSB0aGlzQ29sdW1uUmVjdCl7XG4gICAgICAgIHRoaXNDb2x1bW5LZXkgPSBkLnJhdy5rZXk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAodGhpcyA9PT0gdGhpc0NvbHVtblJlY3QpID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgfSk7XG5cbiAgICBjb2x1bW5SZWN0cy5jbGFzc2VkKG9iai5wcmVmaXggKyAnbXV0ZWQnLGZ1bmN0aW9uIChkKSB7XG5cbiAgICAgIHJldHVybiAoZC5yYXcua2V5ID09PSB0aGlzQ29sdW1uS2V5KSA/IGZhbHNlIDogdHJ1ZTtcblxuICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAgdGV4dFwiKVxuICAgICAgLmRhdGEodGlwRGF0YS5yYXcuc2VyaWVzKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cblxuICAgICAgICBpZiAoZC52YWwpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJuL2FcIjtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBpZihvYmouZGF0ZUZvcm1hdCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAgIC5jYWxsKGRhdGVGb3JtYXR0ZXIsIGN0eCwgb2JqLm1vbnRoc0FiciwgdGlwRGF0YS5rZXkpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgICAgLnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGQgPSB0aXBEYXRhLnJhdy5rZXk7XG4gICAgICAgICAgcmV0dXJuIGQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIHJldHVybiAob2JqLnByZWZpeCArIFwidGlwX2NpcmNsZSBcIiArIG9iai5wcmVmaXggKyBcInRpcF9jaXJjbGUtXCIgKyAoaSkpO1xuICAgICAgICB9LFxuICAgICAgICBcInJcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gdGlwTm9kZXMucmFkaXVzOyB9LFxuICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGlwTm9kZXMucmFkaXVzOyB9LFxuICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICByZXR1cm4gKCAoaSArIDEpICogcGFyc2VJbnQoZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwiZm9udC1zaXplXCIpKSAqIDEuMTMgKyA5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnJhdy5zZXJpZXMpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFJlY3RcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ3aWR0aFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnJpZ2h0LFxuICAgICAgICBcImhlaWdodFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3AgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmJvdHRvbVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBCb3hcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICBpZiAocmVmUG9zID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCAtIGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG5cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aXBzTWFuYWdlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvdGlwcy5qc1xuICoqIG1vZHVsZSBpZCA9IDI3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIFNvY2lhbCBtb2R1bGUuXG4gKiBAbW9kdWxlIGNoYXJ0cy9jb21wb25lbnRzL3NvY2lhbFxuICovXG5cbi8qXG5UaGlzIGNvbXBvbmVudCBhZGRzIGEgXCJzb2NpYWxcIiBidXR0b24gdG8gZWFjaCBjaGFydCB3aGljaCBjYW4gYmUgdG9nZ2xlZCB0byBwcmVzZW50IHRoZSB1c2VyIHdpdGggc29jaWFsIHNoYXJpbmcgb3B0aW9uc1xuICovXG5cbnZhciBnZXRUaHVtYm5haWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikuZ2V0VGh1bWJuYWlsUGF0aDtcblxuZnVuY3Rpb24gc29jaWFsQ29tcG9uZW50KG5vZGUsIG9iaikge1xuXG5cdHZhciBzb2NpYWxPcHRpb25zID0gW107XG5cblx0Zm9yICh2YXIgcHJvcCBpbiBvYmouc29jaWFsKSB7XG5cdFx0aWYgKG9iai5zb2NpYWxbcHJvcF0pIHtcblx0XHRcdHN3aXRjaCAob2JqLnNvY2lhbFtwcm9wXS5sYWJlbCkge1xuXHRcdFx0XHRjYXNlIFwiVHdpdHRlclwiOlxuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0udXJsID0gY29uc3RydWN0VHdpdHRlclVSTChvYmopO1xuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0ucG9wdXAgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiRmFjZWJvb2tcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdEZhY2Vib29rVVJMKG9iaik7XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS5wb3B1cCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJFbWFpbFwiOlxuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0udXJsID0gY29uc3RydWN0TWFpbFVSTChvYmopO1xuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0ucG9wdXAgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIlNNU1wiOlxuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0udXJsID0gY29uc3RydWN0U01TVVJMKG9iaik7XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS5wb3B1cCA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdJTkNPUlJFQ1QgU09DSUFMIElURU0gREVGSU5JVElPTicpXG5cdFx0XHR9XG5cdFx0XHRzb2NpYWxPcHRpb25zLnB1c2gob2JqLnNvY2lhbFtwcm9wXSk7XG5cdFx0fVxuXHR9XG5cblx0dmFyIGNoYXJ0Q29udGFpbmVyID0gZDMuc2VsZWN0KG5vZGUpO1xuXG4gIHZhciBjaGFydE1ldGEgPSBjaGFydENvbnRhaW5lci5zZWxlY3QoJy4nICsgb2JqLnByZWZpeCArICdjaGFydF9tZXRhJyk7XG5cbiAgaWYgKGNoYXJ0TWV0YS5ub2RlKCkgPT09IG51bGwpIHtcbiAgICBjaGFydE1ldGEgPSBjaGFydENvbnRhaW5lclxuICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YScpO1xuICB9XG5cblx0dmFyIGNoYXJ0U29jaWFsQnRuID0gY2hhcnRNZXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGFfYnRuJylcblx0XHQuaHRtbCgnc2hhcmUnKTtcblxuXHR2YXIgY2hhcnRTb2NpYWwgPSBjaGFydENvbnRhaW5lclxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9zb2NpYWwnKTtcblxuXHR2YXIgY2hhcnRTb2NpYWxDbG9zZUJ0biA9IGNoYXJ0U29jaWFsXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X3NvY2lhbF9jbG9zZScpXG5cdFx0Lmh0bWwoJyYjeGQ3OycpO1xuXG5cdHZhciBjaGFydFNvY2lhbE9wdGlvbnMgPSBjaGFydFNvY2lhbFxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9zb2NpYWxfb3B0aW9ucycpO1xuXG5cdGNoYXJ0U29jaWFsT3B0aW9uc1xuXHRcdC5hcHBlbmQoJ2gzJylcblx0XHQuaHRtbCgnU2hhcmUgdGhpcyBjaGFydDonKTtcblxuXHRjaGFydFNvY2lhbEJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjaGFydFNvY2lhbC5jbGFzc2VkKG9iai5wcmVmaXggKyAnYWN0aXZlJywgdHJ1ZSk7XG5cdH0pO1xuXG5cdGNoYXJ0U29jaWFsQ2xvc2VCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Y2hhcnRTb2NpYWwuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIGZhbHNlKTtcblx0fSk7XG5cblx0dmFyIGl0ZW1BbW91bnQgPSBzb2NpYWxPcHRpb25zLmxlbmd0aDtcblxuXHRmb3IodmFyIGkgPSAwOyBpIDwgaXRlbUFtb3VudDsgaSsrICkge1xuXHRcdGNoYXJ0U29jaWFsT3B0aW9uc1xuXHRcdFx0LnNlbGVjdEFsbCgnLicgKyBvYmoucHJlZml4ICsgJ3NvY2lhbC1pdGVtJylcblx0XHRcdC5kYXRhKHNvY2lhbE9wdGlvbnMpXG5cdFx0XHQuZW50ZXIoKVxuXHRcdFx0LmFwcGVuZCgnZGl2Jylcblx0XHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnc29jaWFsLWl0ZW0nKS5odG1sKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0aWYgKCFkLnBvcHVwKSB7XG5cdFx0XHRcdFx0cmV0dXJuICc8YSBocmVmPVwiJyArIGQudXJsICsgJ1wiPjxpbWcgY2xhc3M9XCInICsgb2JqLnByZWZpeCArICdzb2NpYWwtaWNvblwiIHNyYz1cIicgKyBkLmljb24gKyAnXCIgdGl0bGU9XCInICsgZC5sYWJlbCArICdcIi8+PC9hPic7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuICc8YSBjbGFzcz1cIicgKyBvYmoucHJlZml4ICsgJ2pzLXNoYXJlXCIgaHJlZj1cIicgKyBkLnVybCArICdcIj48aW1nIGNsYXNzPVwiJyArIG9iai5wcmVmaXggKyAnc29jaWFsLWljb25cIiBzcmM9XCInICsgZC5pY29uICsgJ1wiIHRpdGxlPVwiJyArIGQubGFiZWwgKyAnXCIvPjwvYT4nO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fVxuXG4gIGlmIChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkge1xuICAgIGNoYXJ0U29jaWFsT3B0aW9uc1xuICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnaW1hZ2UtdXJsJylcbiAgICAgIC5hdHRyKCdjb250ZW50RWRpdGFibGUnLCAndHJ1ZScpXG4gICAgICAuaHRtbChnZXRUaHVtYm5haWwob2JqKSk7XG4gIH1cblxuXHR2YXIgc2hhcmVQb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJqcy1zaGFyZVwiKTtcblxuICBpZiAoc2hhcmVQb3B1cCkge1xuICAgIFtdLmZvckVhY2guY2FsbChzaGFyZVBvcHVwLCBmdW5jdGlvbihhbmNob3IpIHtcbiAgICAgIGFuY2hvci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHdpbmRvd1BvcHVwKHRoaXMuaHJlZiwgNjAwLCA2MjApO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuXHRyZXR1cm4ge1xuXHRcdG1ldGFfbmF2OiBjaGFydE1ldGFcblx0fTtcblxufVxuXG4vLyBzb2NpYWwgcG9wdXBcbmZ1bmN0aW9uIHdpbmRvd1BvcHVwKHVybCwgd2lkdGgsIGhlaWdodCkge1xuICAvLyBjYWxjdWxhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb3B1cCBzbyBpdOKAmXMgY2VudGVyZWQgb24gdGhlIHNjcmVlbi5cbiAgdmFyIGxlZnQgPSAoc2NyZWVuLndpZHRoIC8gMikgLSAod2lkdGggLyAyKSxcbiAgICAgIHRvcCA9IChzY3JlZW4uaGVpZ2h0IC8gMikgLSAoaGVpZ2h0IC8gMik7XG4gIHdpbmRvdy5vcGVuKFxuICAgIHVybCxcbiAgICBcIlwiLFxuICAgIFwibWVudWJhcj1ubyx0b29sYmFyPW5vLHJlc2l6YWJsZT15ZXMsc2Nyb2xsYmFycz15ZXMsd2lkdGg9XCIgKyB3aWR0aCArIFwiLGhlaWdodD1cIiArIGhlaWdodCArIFwiLHRvcD1cIiArIHRvcCArIFwiLGxlZnQ9XCIgKyBsZWZ0XG4gICk7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdEZhY2Vib29rVVJMKG9iail7XG4gIHZhciBiYXNlID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9kaWFsb2cvc2hhcmU/JyxcbiAgICAgIHJlZGlyZWN0ID0gb2JqLnNvY2lhbC5mYWNlYm9vay5yZWRpcmVjdCxcbiAgICAgIHVybCA9ICdhcHBfaWQ9JyArIG9iai5zb2NpYWwuZmFjZWJvb2suYXBwSUQgKyAnJmFtcDtkaXNwbGF5PXBvcHVwJmFtcDt0aXRsZT0nICsgb2JqLmhlYWRpbmcgKyAnJmFtcDtkZXNjcmlwdGlvbj1Gcm9tJTIwYXJ0aWNsZScgKyBkb2N1bWVudC50aXRsZSArICcmYW1wO2hyZWY9JyArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgJyZhbXA7cmVkaXJlY3RfdXJpPScgKyByZWRpcmVjdDtcbiAgaWYgKG9iai5pbWFnZSAmJiBvYmouaW1hZ2UuZW5hYmxlKSB7ICB1cmwgKz0gJyZhbXA7cGljdHVyZT0nICsgZ2V0VGh1bWJuYWlsKG9iaik7IH1cbiAgcmV0dXJuIGJhc2UgKyB1cmw7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdE1haWxVUkwob2JqKXtcbiAgdmFyIGJhc2UgPSAnbWFpbHRvOj8nO1xuICB2YXIgdGh1bWJuYWlsID0gKG9iai5pbWFnZSAmJiBvYmouaW1hZ2UuZW5hYmxlKSA/ICclMEEnICsgZ2V0VGh1bWJuYWlsKG9iaikgOiBcIlwiO1xuICByZXR1cm4gYmFzZSArICdzdWJqZWN0PScgKyBvYmouaGVhZGluZyArICcmYW1wO2JvZHk9JyArIG9iai5oZWFkaW5nICsgdGh1bWJuYWlsICsgJyUwQWZyb20gYXJ0aWNsZTogJyArIGRvY3VtZW50LnRpdGxlICsgJyUwQScgKyB3aW5kb3cubG9jYXRpb24uaHJlZjtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0U01TVVJMKG9iail7XG4gIHZhciBiYXNlID0gJ3NtczonLFxuICAgICAgdXJsID0gJyZib2R5PUNoZWNrJTIwb3V0JTIwdGhpcyUyMGNoYXJ0OiAnICsgb2JqLmhlYWRpbmc7XG4gIGlmIChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkgeyAgdXJsICs9ICclMjAnICsgZ2V0VGh1bWJuYWlsKG9iaik7IH1cbiAgcmV0dXJuIGJhc2UgKyB1cmw7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFR3aXR0ZXJVUkwob2JqKXtcbiAgdmFyIGJhc2UgPSAnaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/JyxcbiAgICAgIGhhc2h0YWcgPSAhIShvYmouc29jaWFsLnR3aXR0ZXIuaGFzaHRhZykgPyAnJmFtcDtoYXNodGFncz0nICsgb2JqLnNvY2lhbC50d2l0dGVyLmhhc2h0YWcgOiBcIlwiLFxuICAgICAgdmlhID0gISEob2JqLnNvY2lhbC50d2l0dGVyLnZpYSkgPyAnJmFtcDt2aWE9JyArIG9iai5zb2NpYWwudHdpdHRlci52aWEgOiBcIlwiLFxuICAgICAgdXJsID0gJ3VybD0nICsgd2luZG93LmxvY2F0aW9uLmhyZWYgICsgdmlhICsgJyZhbXA7dGV4dD0nICsgZW5jb2RlVVJJKG9iai5oZWFkaW5nKSArIGhhc2h0YWc7XG4gIGlmIChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkgeyAgdXJsICs9ICclMjAnICsgZ2V0VGh1bWJuYWlsKG9iaik7IH1cbiAgcmV0dXJuIGJhc2UgKyB1cmw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc29jaWFsQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zb2NpYWwuanNcbiAqKiBtb2R1bGUgaWQgPSAyOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBTaGFyaW5nIERhdGEgbW9kdWxlLlxuICogQG1vZHVsZSBjaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhXG4gKi9cblxuLypcblRoaXMgY29tcG9uZW50IGFkZHMgYSBcImRhdGFcIiBidXR0b24gdG8gZWFjaCBjaGFydCB3aGljaCBjYW4gYmUgdG9nZ2xlZCB0byBwcmVzZW50IHRoZSBjaGFydHMgZGF0YSBpbiBhIHRhYnVsYXIgZm9ybSBhbG9uZyB3aXRoIGJ1dHRvbnMgYWxsb3dpbmcgdGhlIHJhdyBkYXRhIHRvIGJlIGRvd25sb2FkZWRcbiAqL1xuXG5mdW5jdGlvbiBzaGFyZURhdGFDb21wb25lbnQobm9kZSwgb2JqKSB7XG5cbiBcdHZhciBjaGFydENvbnRhaW5lciA9IGQzLnNlbGVjdChub2RlKTtcblxuICB2YXIgY2hhcnRNZXRhID0gY2hhcnRDb250YWluZXIuc2VsZWN0KCcuJyArIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YScpO1xuXG4gIGlmIChjaGFydE1ldGEubm9kZSgpID09PSBudWxsKSB7XG4gICAgY2hhcnRNZXRhID0gY2hhcnRDb250YWluZXJcbiAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGEnKTtcbiAgfVxuXG5cdHZhciBjaGFydERhdGFCdG4gPSBjaGFydE1ldGFcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YV9idG4nKVxuXHRcdC5odG1sKCdkYXRhJyk7XG5cblx0dmFyIGNoYXJ0RGF0YSA9IGNoYXJ0Q29udGFpbmVyXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X2RhdGEnKTtcblxuXHR2YXIgY2hhcnREYXRhQ2xvc2VCdG4gPSBjaGFydERhdGFcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfZGF0YV9jbG9zZScpXG5cdFx0Lmh0bWwoJyYjeGQ3OycpO1xuXG5cdHZhciBjaGFydERhdGFUYWJsZSA9IGNoYXJ0RGF0YVxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhX2lubmVyJyk7XG5cblx0Y2hhcnREYXRhXG5cdFx0LmFwcGVuZCgnaDInKVxuXHRcdC5odG1sKG9iai5oZWFkaW5nKTtcblxuXHR2YXIgY2hhcnREYXRhTmF2ID0gY2hhcnREYXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X2RhdGFfbmF2Jyk7XG5cblx0dmFyIGNzdkRMQnRuID0gY2hhcnREYXRhTmF2XG5cdFx0LmFwcGVuZCgnYScpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhX2J0biBjc3YnKVxuXHRcdC5odG1sKCdkb3dubG9hZCBjc3YnKTtcblxuICB2YXIgY3N2VG9UYWJsZSA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS5jc3ZUb1RhYmxlO1xuXG5cdGNzdlRvVGFibGUoY2hhcnREYXRhVGFibGUsIG9iai5kYXRhLmNzdik7XG5cblx0Y2hhcnREYXRhQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNoYXJ0RGF0YS5jbGFzc2VkKG9iai5wcmVmaXggKyAnYWN0aXZlJywgdHJ1ZSk7XG5cdH0pO1xuXG5cdGNoYXJ0RGF0YUNsb3NlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNoYXJ0RGF0YS5jbGFzc2VkKG9iai5wcmVmaXggKyAnYWN0aXZlJywgZmFsc2UpO1xuXHR9KTtcblxuXHRjc3ZETEJ0bi5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuXHQgIHZhciBkbERhdGEgPSAnZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudChvYmouZGF0YS5jc3YpO1xuXHQgIGQzLnNlbGVjdCh0aGlzKVxuXHQgIFx0LmF0dHIoJ2hyZWYnLCBkbERhdGEpXG5cdCAgXHQuYXR0cignZG93bmxvYWQnLCdkYXRhXycgKyBvYmouaWQgKyAnLmNzdicpO1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdG1ldGFfbmF2OiBjaGFydE1ldGEsXG5cdFx0ZGF0YV9wYW5lbDogY2hhcnREYXRhXG5cdH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaGFyZURhdGFDb21wb25lbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NoYXJlLWRhdGEuanNcbiAqKiBtb2R1bGUgaWQgPSAyOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDdXN0b20gY29kZSBmdW5jdGlvbiB0aGF0IGNhbiBiZSBpbnZva2VkIHRvIG1vZGlmeSBjaGFydCBlbGVtZW50cyBhZnRlciBjaGFydCBkcmF3aW5nIGhhcyBvY2N1cnJlZC5cbiAqIEBwYXJhbSAge09iamVjdH0gbm9kZSAgICAgICAgIFRoZSBtYWluIGNvbnRhaW5lciBncm91cCBmb3IgdGhlIGNoYXJ0LlxuICogQHBhcmFtICB7T2JqZWN0fSBjaGFydFJlY2lwZSAgT2JqZWN0IHRoYXQgY29udGFpbnMgc2V0dGluZ3MgZm9yIHRoZSBjaGFydC5cbiAqIEBwYXJhbSAge09iamVjdH0gcmVuZGVyZWQgICAgIEFuIG9iamVjdCBjb250YWluaW5nIHJlZmVyZW5jZXMgdG8gYWxsIHJlbmRlcmVkIGNoYXJ0IGVsZW1lbnRzLCBpbmNsdWRpbmcgYXhlcywgc2NhbGVzLCBwYXRocywgbm9kZXMsIGFuZCBzbyBmb3J0aC5cbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgIE9wdGlvbmFsLlxuICovXG5mdW5jdGlvbiBjdXN0b20obm9kZSwgY2hhcnRSZWNpcGUsIHJlbmRlcmVkKSB7XG5cbiAgLy8gV2l0aCB0aGlzIGZ1bmN0aW9uLCB5b3UgY2FuIGFjY2VzcyBhbGwgZWxlbWVudHMgb2YgYSBjaGFydCBhbmQgbW9kaWZ5XG4gIC8vIHRoZW0gYXQgd2lsbC4gRm9yIGluc3RhbmNlOiB5b3UgbWlnaHQgd2FudCB0byBwbGF5IHdpdGggY29sb3VyXG4gIC8vIGludGVycG9sYXRpb24gZm9yIGEgbXVsdGktc2VyaWVzIGxpbmUgY2hhcnQsIG9yIG1vZGlmeSB0aGUgd2lkdGggYW5kIHBvc2l0aW9uXG4gIC8vIG9mIHRoZSB4LSBhbmQgeS1heGlzIHRpY2tzLiBXaXRoIHRoaXMgZnVuY3Rpb24sIHlvdSBjYW4gZG8gYWxsIHRoYXQhXG5cbiAgLy8gSWYgeW91IGNhbiwgaXQncyBnb29kIENoYXJ0IFRvb2wgcHJhY3RpY2UgdG8gcmV0dXJuIHJlZmVyZW5jZXMgdG8gbmV3bHlcbiAgLy8gY3JlYXRlZCBub2RlcyBhbmQgZDMgb2JqZWN0cyBzbyB0aGV5IGJlIGFjY2Vzc2VkIGxhdGVyIOKAlCBieSBhIGRpc3BhdGNoZXJcbiAgLy8gZXZlbnQsIGZvciBpbnN0YW5jZS5cbiAgcmV0dXJuO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3VzdG9tO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9jdXN0b20vY3VzdG9tLmpzXG4gKiogbW9kdWxlIGlkID0gMzBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=