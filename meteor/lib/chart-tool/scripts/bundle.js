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
	        area: __webpack_require__(19),
	        multiline: __webpack_require__(18),
	        stackedArea: __webpack_require__(20),
	        column: __webpack_require__(21),
	        stackedColumn: __webpack_require__(23),
	        streamgraph: __webpack_require__(24),
	        bar: __webpack_require__(22)
	
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
		"version": "1.1.1",
		"buildVer": "0",
		"description": "A responsive charting application",
		"main": "gulpfile.js",
		"dependencies": {},
		"devDependencies": {
			"browser-sync": "^2.15.0",
			"gulp": "^3.8.11",
			"gulp-clean": "^0.3.1",
			"gulp-json-editor": "^2.2.1",
			"gulp-minify-css": "^1.2.0",
			"gulp-rename": "^1.2.2",
			"gulp-replace": "^0.5.3",
			"gulp-sass": "^2.3.2",
			"gulp-shell": "^0.5.2",
			"gulp-sourcemaps": "^1.5.2",
			"gulp-util": "^3.0.6",
			"jsdoc": "^3.3.2",
			"json-loader": "^0.5.3",
			"run-sequence": "^1.2.2",
			"webpack": "^1.13.2",
			"webpack-stream": "^3.1.0",
			"yargs": "^5.0.0"
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
	
	  var val;
	
	  var firstVals = {};
	
	  var headers = d3.csv.parseRows(csv.match(/^.*$/m)[0])[0];
	
	  var data = d3.csv.parse(csv, function(d, i) {
	
	    var obj = {};
	
	    if (inputDateFormat) {
	      var dateFormat = d3.time.format(inputDateFormat);
	      obj.key = dateFormat.parse(d[headers[0]]);
	    } else {
	      obj.key = d[headers[0]];
	    }
	
	    obj.series = [];
	
	    for (var j = 1; j < headers.length; j++) {
	
	      var key = headers[j];
	
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
	          legend: headers[key + 1],
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
	    keys: headers,
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
	    var custom = __webpack_require__(29);
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
	  qualifier: __webpack_require__(25),
	  axis: __webpack_require__(16),
	  scale: __webpack_require__(17),
	  tips: __webpack_require__(26),
	  social: __webpack_require__(27),
	  shareData: __webpack_require__(28)
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
	    area: __webpack_require__(19),
	    stackedArea: __webpack_require__(20),
	    column: __webpack_require__(21),
	    bar: __webpack_require__(22),
	    stackedColumn: __webpack_require__(23),
	    streamgraph: __webpack_require__(24)
	  };
	
	  var chartRef;
	
	  switch(obj.options.type) {
	
	    case "line":
	      chartRef = draw.line(node, obj);
	      break;
	
	    case "multiline":
	      chartRef = draw.multiline(node, obj);
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
	
	    var lastTick = tickArr[tickArr.length - 1];
	    d3.select(lastTick).classed("last-tick-hide", false);
	
	    if ((axisGroupWidth + firstTickOffset) >= tickWidth) {
	      d3.select(lastTick).classed("last-tick-hide", true);
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
	
	    } else {
	      dropTicks(newSelection, { tolerance: tolerance });
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
	          forceMaxVal;
	      if (chartType === "area" || chartType === "column" || chartType === "bar") {
	        forceMaxVal = true;
	      }
	      domain = setNumericalDomain(data, axis.min, axis.max, obj.options.stacked, forceMaxVal);
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
	
	function setNumericalDomain(data, min, max, stacked, forceMaxVal) {
	
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
	        // If more than one series append a 'multiple' class so we can target
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
/* 20 */
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
/* 21 */
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
	
	      xAxisObj.node = node.select("." + obj.prefix + "axis-group." + obj.prefix + "xAxis");
	
	      xAxisObj.node
	        .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	      axisModule.dropOversetTicks(xAxisObj.node, obj.dimensions.tickWidth());
	
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
	          return d.series[i].val < 0 ? obj.prefix + "negative" : obj.prefix + "positive";
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
/* 22 */
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
/* 23 */
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
	    });
	
	  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
	    .data(obj.data.stackedData)
	    .enter().append("g")
	    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i); });
	
	  var columnItem = series
	    .append('g')
	    .attr({
	      "class": function(d, i) { return obj.prefix + "column " + obj.prefix + "column-" + (i) },
	      "data-key": function(d, i, j) { return d[j].x; },
	      "data-legend": function(d, i, j) { return d[j].legend; },
	    });
	
	  var rect = columnItem.selectAll("rect")
	    .data(function(d) { return d; })
	    .enter().append("rect")
	    .attr({
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
/* 24 */
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
/* 25 */
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
/* 26 */
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
	        timeDiff = __webpack_require__(4).timeDiff;
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
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
	
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
	        timeDiff = __webpack_require__(4).timeDiff;
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
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
	
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
	        timeDiff = __webpack_require__(4).timeDiff;
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
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData[0].x);
	
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
	        timeDiff = __webpack_require__(4).timeDiff;
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
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData[0].x);
	
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
	        .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
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
	        .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
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
	
	function tipDateFormatter(selection, ctx, months, data) {
	
	  var dMonth,
	      dDate,
	      dYear,
	      dHour,
	      dMinute;
	
	  selection.text(function() {
	    var d = data;
	    var dStr;
	    switch (ctx) {
	      case "years":
	        dStr = d.getFullYear();
	        break;
	      case "months":
	        dMonth = months[d.getMonth()];
	        dDate = d.getDate();
	        dYear = d.getFullYear();
	        dStr = dMonth + " " + dDate + ", " + dYear;
	        break;
	      case "weeks":
	      case "days":
	        dMonth = months[d.getMonth()];
	        dDate = d.getDate();
	        dYear = d.getFullYear();
	        dStr = dMonth + " " + dDate;
	        break;
	      case "hours":
	
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
	
	        break;
	      default:
	        dStr = d;
	        break;
	    }
	
	    return dStr;
	
	  });
	
	}
	
	
	// [function BarChartTips(tipNodes, obj) {
	
	// }
	
	module.exports = tipsManager;


/***/ },
/* 27 */
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
/* 28 */
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
/* 29 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmM1M2ZjYTY0NTAwYjJmMWU3MTQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb25maWcvY2hhcnQtc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZS5qc29uIiwid2VicGFjazovLy8uL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29uZmlnL2Vudi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdXRpbHMvZGF0YXBhcnNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy9mYWN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9oZWxwZXJzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9tYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2Zvb3Rlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcGxvdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2xpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2F4aXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NjYWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvbXVsdGlsaW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2NvbHVtbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2Jhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtY29sdW1uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3F1YWxpZmllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvdGlwcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc29jaWFsLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhLmpzIiwid2VicGFjazovLy8uL2N1c3RvbS9jdXN0b20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVMsTUFBTTtBQUNmLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0IsT0FBTztB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QUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFD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cENBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87O0FBRVA7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQXlCLFVBQVUsRUFBRTtBQUNyQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDeEZBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ2xDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ2xEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEscUNBQW9DLG1DQUFtQyxVQUFVLEVBQUU7O0FBRW5GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUEsMENBQXlDLFFBQVE7QUFDakQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLCtCQUE4QixnQ0FBZ0MsRUFBRTtBQUNoRSx5QkFBd0Isc0JBQXNCLEVBQUU7QUFDaEQseUJBQXdCLGdDQUFnQyxFQUFFOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDJCQUEwQixvREFBb0QsRUFBRTtBQUNoRixxQkFBb0Isc0JBQXNCLEVBQUU7QUFDNUMscUJBQW9CLG9EQUFvRCxFQUFFOztBQUUxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDL0ZBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLDJCQUEwQiw4QkFBOEI7O0FBRXhEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsMEJBQXlCLFVBQVUsRUFBRTtBQUNyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUEsdUNBQXNDLG1DQUFtQzs7QUFFekU7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxJQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJCQUEwQixhQUFhLEVBQUU7O0FBRXpDOztBQUVBOztB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RUE7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDs7QUFFQTtBQUNBLHdCQUF1QixjQUFjLEVBQUU7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQLHNDQUFxQyxjQUFjLEVBQUU7QUFDckQ7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1AsNEJBQTJCLHdCQUF3QixFQUFFO0FBQ3JELHlCQUF3Qix3QkFBd0IsRUFBRTtBQUNsRDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQSxNQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsa0JBQWlC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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsOEJBQTZCLHdCQUF3QixFQUFFO0FBQ3ZELDJCQUEwQix3QkFBd0IsRUFBRTtBQUNwRDtBQUNBO0FBQ0E7QUFDQSxRQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxRQUFPOztBQUVQOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsSUFBRzs7QUFFSDs7O0FBR0E7O0FBRUE7O0FBRUE7Ozs7Ozs7QUNsbkNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZTs7QUFFZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFFOztBQUVGO0FBQ0E7QUFDQSxHQUFFOztBQUVGOztBQUVBLGdCQUFlLGdCQUFnQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkRBQTBELGtCQUFrQiw4QkFBOEIscURBQXFELHNDQUFzQztBQUNyTSx1Q0FBc0MsZUFBZSw4QkFBOEI7QUFDbkY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBaUQ7QUFDakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXNDLG1DQUFtQztBQUN6RTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3REFBdUQ7QUFDdkQsZ0RBQStDO0FBQy9DLDBEQUF5RDtBQUN6RCx1Q0FBc0MsbUNBQW1DO0FBQ3pFO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlOztBQUVmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFFOztBQUVGO0FBQ0E7QUFDQSxHQUFFOztBQUVGO0FBQ0Esa0NBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLEdBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7QUM5RUE7QUFDQTtBQUNBLGFBQVksT0FBTztBQUNuQixhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CLGFBQVksT0FBTztBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHlCIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMmM1M2ZjYTY0NTAwYjJmMWU3MTRcbiAqKi8iLCIvKipcbiAqIENoYXJ0IFRvb2xcbiAqIEBhdXRob3IgSmVyZW15IEFnaXVzIDxqYWdpdXNAZ2xvYmVhbmRtYWlsLmNvbT5cbiAqIEBhdXRob3IgVG9tIENhcmRvc28gPHRjYXJkb3NvQGdsb2JlYW5kbWFpbC5jb20+XG4gKiBAYXV0aG9yIE1pY2hhZWwgUGVyZWlyYSA8bXBlcmVpcmFAZ2xvYmVhbmRtYWlsLmNvbT5cbiAqIEBzZWUge0BsaW5rfSBmb3IgZnVydGhlciBpbmZvcm1hdGlvbi5cbiAqIEBzZWUge0BsaW5rIGh0dHA6Ly93d3cuZ2l0aHViLmNvbS9nbG9iZWFuZG1haWwvY2hhcnQtdG9vbHxDaGFydCBUb29sfVxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuKGZ1bmN0aW9uIENoYXJ0VG9vbEluaXQocm9vdCkge1xuXG4gIGlmIChyb290LmQzKSB7XG5cbiAgICB2YXIgQ2hhcnRUb29sID0gKGZ1bmN0aW9uIENoYXJ0VG9vbCgpIHtcblxuICAgICAgdmFyIGNoYXJ0cyA9IHJvb3QuX19jaGFydHRvb2wgfHwgW10sXG4gICAgICAgICAgZGlzcGF0Y2hGdW5jdGlvbnMgPSByb290Ll9fY2hhcnR0b29sZGlzcGF0Y2hlciB8fCBbXSxcbiAgICAgICAgICBkcmF3biA9IFtdO1xuXG4gICAgICB2YXIgc2V0dGluZ3MgPSByZXF1aXJlKFwiLi9jb25maWcvY2hhcnQtc2V0dGluZ3NcIiksXG4gICAgICAgICAgdXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy91dGlsc1wiKTtcblxuICAgICAgdmFyIGRpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcInN0YXJ0XCIsIFwiZmluaXNoXCIsIFwicmVkcmF3XCIsIFwibW91c2VPdmVyXCIsIFwibW91c2VNb3ZlXCIsIFwibW91c2VPdXRcIiwgXCJjbGlja1wiKTtcblxuICAgICAgZm9yICh2YXIgcHJvcCBpbiBkaXNwYXRjaEZ1bmN0aW9ucykge1xuICAgICAgICBpZiAoZGlzcGF0Y2hGdW5jdGlvbnMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBpZiAoZDMua2V5cyhkaXNwYXRjaGVyKS5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoZXIub24ocHJvcCwgZGlzcGF0Y2hGdW5jdGlvbnNbcHJvcF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNoYXJ0IFRvb2wgZG9lcyBub3Qgb2ZmZXIgYSBkaXNwYXRjaGVyIG9mIHR5cGUgJ1wiICsgcHJvcCArIFwiJy4gRm9yIGF2YWlsYWJsZSBkaXNwYXRjaGVyIHR5cGVzLCBwbGVhc2Ugc2VlIHRoZSBDaGFydFRvb2wuZGlzcGF0Y2goKSBtZXRob2QuXCIgO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENsZWFycyBwcmV2aW91cyBpdGVyYXRpb25zIG9mIGNoYXJ0IG9iamVjdHMgc3RvcmVkIGluIG9iaiBvciB0aGUgZHJhd24gYXJyYXksIHRoZW4gcHVudHMgY2hhcnQgY29uc3RydWN0aW9uIHRvIHRoZSBDaGFydCBNYW5hZ2VyLlxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBjb250YWluZXIgQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb250YWluZXIncyBzZWxlY3Rvci5cbiAgICAgICAqIEBwYXJhbSAge09iamVjdH0gb2JqICAgICAgIFRoZSBjaGFydCBJRCBhbmQgZW1iZWQgZGF0YS5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gY3JlYXRlQ2hhcnQoY29udGFpbmVyLCBvYmopIHtcblxuICAgICAgICBkaXNwYXRjaGVyLnN0YXJ0KG9iaik7XG5cbiAgICAgICAgZHJhd24gPSB1dGlscy5jbGVhckRyYXduKGRyYXduLCBvYmopO1xuICAgICAgICBvYmogPSB1dGlscy5jbGVhck9iaihvYmopO1xuICAgICAgICBjb250YWluZXIgPSB1dGlscy5jbGVhckNoYXJ0KGNvbnRhaW5lcik7XG5cbiAgICAgICAgdmFyIENoYXJ0TWFuYWdlciA9IHJlcXVpcmUoXCIuL2NoYXJ0cy9tYW5hZ2VyXCIpO1xuXG4gICAgICAgIG9iai5kYXRhLndpZHRoID0gdXRpbHMuZ2V0Qm91bmRpbmcoY29udGFpbmVyLCBcIndpZHRoXCIpO1xuICAgICAgICBvYmouZGlzcGF0Y2ggPSBkaXNwYXRjaGVyO1xuXG4gICAgICAgIHZhciBjaGFydE9iajtcblxuICAgICAgICBpZiAodXRpbHMuc3ZnVGVzdChyb290KSkge1xuICAgICAgICAgIGNoYXJ0T2JqID0gQ2hhcnRNYW5hZ2VyKGNvbnRhaW5lciwgb2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1dGlscy5nZW5lcmF0ZVRodW1iKGNvbnRhaW5lciwgb2JqLCBzZXR0aW5ncyk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3bi5wdXNoKHsgaWQ6IG9iai5pZCwgY2hhcnRPYmo6IGNoYXJ0T2JqIH0pO1xuICAgICAgICBvYmouY2hhcnRPYmogPSBjaGFydE9iajtcblxuICAgICAgICBkMy5zZWxlY3QoY29udGFpbmVyKVxuICAgICAgICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLmNsaWNrKHRoaXMsIGNoYXJ0T2JqKTsgfSlcbiAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKSB7IGRpc3BhdGNoZXIubW91c2VPdmVyKHRoaXMsIGNoYXJ0T2JqKTsgfSlcbiAgICAgICAgICAub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oKSB7IGRpc3BhdGNoZXIubW91c2VNb3ZlKHRoaXMsIGNoYXJ0T2JqKTsgIH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7IGRpc3BhdGNoZXIubW91c2VPdXQodGhpcywgY2hhcnRPYmopOyB9KTtcblxuICAgICAgICBkaXNwYXRjaGVyLmZpbmlzaChjaGFydE9iaik7XG5cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBHcmFicyBkYXRhIG9uIGEgY2hhcnQgYmFzZWQgb24gYW4gSUQuXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBjaGFydHMgQXJyYXkgb2YgY2hhcnRzIG9uIHRoZSBwYWdlLlxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBpZCBUaGUgSUQgZm9yIHRoZSBjaGFydC5cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgUmV0dXJucyBzdG9yZWQgZW1iZWQgb2JqZWN0LlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiByZWFkQ2hhcnQoaWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgaWYgKGNoYXJ0c1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGFydHNbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIExpc3QgYWxsIHRoZSBjaGFydHMgc3RvcmVkIGluIHRoZSBDaGFydCBUb29sIGJ5IGNoYXJ0aWQuXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBjaGFydHMgQXJyYXkgb2YgY2hhcnRzIG9uIHRoZSBwYWdlLlxuICAgICAgICogQHJldHVybiB7QXJyYXl9ICAgICAgIExpc3Qgb2YgY2hhcnRpZCdzLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBsaXN0Q2hhcnRzKGNoYXJ0cykge1xuICAgICAgICB2YXIgY2hhcnRzQXJyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2hhcnRzQXJyLnB1c2goY2hhcnRzW2ldLmlkKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNoYXJ0c0FycjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoaWQsIG9iaikge1xuICAgICAgICB2YXIgY29udGFpbmVyID0gJy4nICsgc2V0dGluZ3MuYmFzZUNsYXNzKCkgKyAnW2RhdGEtY2hhcnRpZD0nICsgc2V0dGluZ3MucHJlZml4ICsgaWQgKyAnXSc7XG4gICAgICAgIGNyZWF0ZUNoYXJ0KGNvbnRhaW5lciwgeyBpZDogaWQsIGRhdGE6IG9iaiB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVzdHJveUNoYXJ0KGlkKSB7XG4gICAgICAgIHZhciBjb250YWluZXIsIG9iajtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoY2hhcnRzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgb2JqID0gY2hhcnRzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29udGFpbmVyID0gJy4nICsgc2V0dGluZ3MuYmFzZUNsYXNzKCkgKyAnW2RhdGEtY2hhcnRpZD0nICsgb2JqLmlkICsgJ10nO1xuICAgICAgICB1dGlscy5jbGVhckRyYXduKGRyYXduLCBvYmopO1xuICAgICAgICB1dGlscy5jbGVhck9iaihvYmopO1xuICAgICAgICB1dGlscy5jbGVhckNoYXJ0KGNvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgY2hhcnRzLCBkcmF3IGVhY2ggY2hhcnQgaW50byBpdHMgcmVzcGVjdGl2ZSBjb250YWluZXIuXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBjaGFydHMgQXJyYXkgb2YgY2hhcnRzIG9uIHRoZSBwYWdlLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBjcmVhdGVMb29wKGNoYXJ0cykge1xuICAgICAgICB2YXIgY2hhcnRMaXN0ID0gbGlzdENoYXJ0cyhjaGFydHMpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJ0TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBvYmogPSByZWFkQ2hhcnQoY2hhcnRMaXN0W2ldKTtcbiAgICAgICAgICB2YXIgY29udGFpbmVyID0gJy4nICsgc2V0dGluZ3MuYmFzZUNsYXNzKCkgKyAnW2RhdGEtY2hhcnRpZD0nICsgY2hhcnRMaXN0W2ldICsgJ10nO1xuICAgICAgICAgIGNyZWF0ZUNoYXJ0KGNvbnRhaW5lciwgb2JqKTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDaGFydCBUb29sIGluaXRpYWxpemVyIHdoaWNoIHNldHMgdXAgZGVib3VuY2luZyBhbmQgcnVucyB0aGUgY3JlYXRlTG9vcCgpLiBSdW4gb25seSBvbmNlLCB3aGVuIHRoZSBsaWJyYXJ5IGlzIGZpcnN0IGxvYWRlZC5cbiAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGNoYXJ0cyBBcnJheSBvZiBjaGFydHMgb24gdGhlIHBhZ2UuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemVyKGNoYXJ0cykge1xuICAgICAgICBjcmVhdGVMb29wKGNoYXJ0cyk7XG4gICAgICAgIHZhciBkZWJvdW5jZSA9IHV0aWxzLmRlYm91bmNlKGNyZWF0ZUxvb3AsIGNoYXJ0cywgc2V0dGluZ3MuZGVib3VuY2UsIHJvb3QpO1xuICAgICAgICBkMy5zZWxlY3Qocm9vdClcbiAgICAgICAgICAub24oJ3Jlc2l6ZS4nICsgc2V0dGluZ3MucHJlZml4ICsgJ2RlYm91bmNlJywgZGVib3VuY2UpXG4gICAgICAgICAgLm9uKCdyZXNpemUuJyArIHNldHRpbmdzLnByZWZpeCArICdyZWRyYXcnLCBkaXNwYXRjaGVyLnJlZHJhdyhjaGFydHMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgIHJldHVybiBpbml0aWFsaXplcihjaGFydHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gY3JlYXRlKGNvbnRhaW5lciwgb2JqKSB7XG4gICAgICAgICAgcmV0dXJuIGNyZWF0ZUNoYXJ0KGNvbnRhaW5lciwgb2JqKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKGlkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlYWRDaGFydChpZCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbGlzdDogZnVuY3Rpb24gbGlzdCgpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdENoYXJ0cyhjaGFydHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGlkLCBvYmopIHtcbiAgICAgICAgICByZXR1cm4gdXBkYXRlQ2hhcnQoaWQsIG9iaik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveShpZCkge1xuICAgICAgICAgIHJldHVybiBkZXN0cm95Q2hhcnQoaWQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiBkaXNwYXRjaCgpIHtcbiAgICAgICAgICByZXR1cm4gZDMua2V5cyhkaXNwYXRjaGVyKTtcbiAgICAgICAgfSxcblxuICAgICAgICB3YXQ6IGZ1bmN0aW9uIHdhdCgpIHtcbiAgICAgICAgICBjb25zb2xlLmluZm8oXCJDaGFydFRvb2wgdlwiICsgc2V0dGluZ3MudmVyc2lvbiArIFwiIGlzIGEgZnJlZSwgb3Blbi1zb3VyY2UgY2hhcnQgZ2VuZXJhdG9yIGFuZCBmcm9udC1lbmQgbGlicmFyeSBtYWludGFpbmVkIGJ5IFRoZSBHbG9iZSBhbmQgTWFpbC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIGNoZWNrIG91dCBvdXIgR2l0SHViIHJlcG86IHd3dy5naXRodWIuY29tL2dsb2JlYW5kbWFpbC9jaGFydC10b29sXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZlcnNpb246IHNldHRpbmdzLnZlcnNpb24sXG4gICAgICAgIGJ1aWxkOiBzZXR0aW5ncy5idWlsZCxcbiAgICAgICAgc2V0dGluZ3M6IHJlcXVpcmUoXCIuL2NvbmZpZy9jaGFydC1zZXR0aW5nc1wiKSxcbiAgICAgICAgY2hhcnRzOiByZXF1aXJlKFwiLi9jaGFydHMvbWFuYWdlclwiKSxcbiAgICAgICAgY29tcG9uZW50czogcmVxdWlyZShcIi4vY2hhcnRzL2NvbXBvbmVudHMvY29tcG9uZW50c1wiKSxcbiAgICAgICAgaGVscGVyczogcmVxdWlyZShcIi4vaGVscGVycy9oZWxwZXJzXCIpLFxuICAgICAgICB1dGlsczogcmVxdWlyZShcIi4vdXRpbHMvdXRpbHNcIiksXG4gICAgICAgIGxpbmU6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9saW5lXCIpLFxuICAgICAgICBhcmVhOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvYXJlYVwiKSxcbiAgICAgICAgbXVsdGlsaW5lOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvbXVsdGlsaW5lXCIpLFxuICAgICAgICBzdGFja2VkQXJlYTogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYVwiKSxcbiAgICAgICAgY29sdW1uOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvY29sdW1uXCIpLFxuICAgICAgICBzdGFja2VkQ29sdW1uOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvc3RhY2tlZC1jb2x1bW5cIiksXG4gICAgICAgIHN0cmVhbWdyYXBoOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGhcIiksXG4gICAgICAgIGJhcjogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL2JhclwiKVxuXG4gICAgICB9XG5cbiAgICB9KSgpO1xuXG4gICAgaWYgKCFyb290Lk1ldGVvcikgeyBDaGFydFRvb2wuaW5pdCgpOyB9XG5cbiAgfSBlbHNlIHtcblxuICAgIHZhciBNZXRlb3IgPSB0aGlzLk1ldGVvciB8fCB7fSxcbiAgICAgICAgaXNTZXJ2ZXIgPSBNZXRlb3IuaXNTZXJ2ZXIgfHwgdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFpc1NlcnZlcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkNoYXJ0IFRvb2w6IG5vIEQzIGxpYnJhcnkgZGV0ZWN0ZWQuXCIpO1xuICAgIH1cblxuXG4gIH1cblxuICByb290LkNoYXJ0VG9vbCA9IENoYXJ0VG9vbDtcblxufSkodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHRoaXMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciB2ZXJzaW9uID0ge1xuICB2ZXJzaW9uOiByZXF1aXJlKFwianNvbiEuLi8uLi8uLi9wYWNrYWdlLmpzb25cIikudmVyc2lvbixcbiAgYnVpbGQ6IHJlcXVpcmUoXCJqc29uIS4uLy4uLy4uL3BhY2thZ2UuanNvblwiKS5idWlsZHZlclxufTtcblxudmFyIHNldHRpbmdzID0gcmVxdWlyZShcImpzb24hLi4vLi4vLi4vY3VzdG9tL2NoYXJ0LXRvb2wtY29uZmlnLmpzb25cIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIENVU1RPTTogc2V0dGluZ3MuQ1VTVE9NLFxuICB2ZXJzaW9uOiB2ZXJzaW9uLnZlcnNpb24sXG4gIGJ1aWxkOiB2ZXJzaW9uLmJ1aWxkLFxuICBpZDogXCJcIixcbiAgZGF0YTogXCJcIixcbiAgZGF0ZUZvcm1hdDogc2V0dGluZ3MuZGF0ZUZvcm1hdCxcbiAgdGltZUZvcm1hdDogc2V0dGluZ3MudGltZUZvcm1hdCxcbiAgaW1hZ2U6IHNldHRpbmdzLmltYWdlLFxuICBoZWFkaW5nOiBcIlwiLFxuICBxdWFsaWZpZXI6IFwiXCIsXG4gIHNvdXJjZTogXCJcIixcbiAgZGVjazogXCJcIixcbiAgaW5kZXg6IFwiXCIsXG4gIGhhc0hvdXJzOiBmYWxzZSxcbiAgc29jaWFsOiBzZXR0aW5ncy5zb2NpYWwsXG4gIHNlcmllc0hpZ2hsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZGF0YS5zZXJpZXNBbW91bnQgJiYgdGhpcy5kYXRhLnNlcmllc0Ftb3VudCA8PSAxKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9LFxuICBiYXNlQ2xhc3M6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5wcmVmaXggKyBcImNoYXJ0XCI7IH0sXG4gIGN1c3RvbUNsYXNzOiBcIlwiLFxuXG4gIG9wdGlvbnM6IHtcbiAgICB0eXBlOiBcImxpbmVcIixcbiAgICBpbnRlcnBvbGF0aW9uOiBcImxpbmVhclwiLFxuICAgIHN0YWNrZWQ6IGZhbHNlLFxuICAgIGV4cGFuZGVkOiBmYWxzZSxcbiAgICBoZWFkOiB0cnVlLFxuICAgIGRlY2s6IGZhbHNlLFxuICAgIHF1YWxpZmllcjogdHJ1ZSxcbiAgICBsZWdlbmQ6IHRydWUsXG4gICAgZm9vdGVyOiB0cnVlLFxuICAgIHhfYXhpczogdHJ1ZSxcbiAgICB5X2F4aXM6IHRydWUsXG4gICAgdGlwczogZmFsc2UsXG4gICAgYW5ub3RhdGlvbnM6IGZhbHNlLFxuICAgIHJhbmdlOiBmYWxzZSxcbiAgICBzZXJpZXM6IGZhbHNlLFxuICAgIHNoYXJlX2RhdGE6IHRydWUsXG4gICAgc29jaWFsOiB0cnVlXG4gIH0sXG5cbiAgcmFuZ2U6IHt9LFxuICBzZXJpZXM6IHt9LFxuICB4QXhpczogc2V0dGluZ3MueEF4aXMsXG4gIHlBeGlzOiBzZXR0aW5ncy55QXhpcyxcblxuICBleHBvcnRhYmxlOiBmYWxzZSwgLy8gdGhpcyBjYW4gYmUgb3ZlcndyaXR0ZW4gYnkgdGhlIGJhY2tlbmQgYXMgbmVlZGVkXG4gIGVkaXRhYmxlOiBmYWxzZSxcblxuICBwcmVmaXg6IHNldHRpbmdzLnByZWZpeCxcbiAgZGVib3VuY2U6IHNldHRpbmdzLmRlYm91bmNlLFxuICB0aXBUaW1lb3V0OiBzZXR0aW5ncy50aXBUaW1lb3V0LFxuICBtb250aHNBYnI6IHNldHRpbmdzLm1vbnRoc0FicixcblxuICBkaW1lbnNpb25zOiB7XG4gICAgd2lkdGg6IDAsXG4gICAgY29tcHV0ZWRXaWR0aDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodDtcbiAgICB9LFxuICAgIGhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmF0aW9TY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFszMDAsIDkwMF0pLmRvbWFpbihbdGhpcy53aWR0aCAqIHRoaXMucmF0aW9Nb2JpbGUsIHRoaXMud2lkdGggKiB0aGlzLnJhdGlvRGVza3RvcF0pO1xuICAgICAgcmV0dXJuIE1hdGgucm91bmQocmF0aW9TY2FsZSh0aGlzLndpZHRoKSk7XG4gICAgfSxcbiAgICBjb21wdXRlZEhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKHRoaXMuaGVpZ2h0KCkgLSB0aGlzLmhlYWRlckhlaWdodCAtIHRoaXMuZm9vdGVySGVpZ2h0IC0gdGhpcy5tYXJnaW4udG9wIC0gdGhpcy5tYXJnaW4uYm90dG9tKTtcbiAgICB9LFxuICAgIHJhdGlvTW9iaWxlOiBzZXR0aW5ncy5yYXRpb01vYmlsZSxcbiAgICByYXRpb0Rlc2t0b3A6IHNldHRpbmdzLnJhdGlvRGVza3RvcCxcbiAgICBtYXJnaW46IHNldHRpbmdzLm1hcmdpbixcbiAgICB0aXBQYWRkaW5nOiBzZXR0aW5ncy50aXBQYWRkaW5nLFxuICAgIHRpcE9mZnNldDogc2V0dGluZ3MudGlwT2Zmc2V0LFxuICAgIGhlYWRlckhlaWdodDogMCxcbiAgICBmb290ZXJIZWlnaHQ6IDAsXG4gICAgeEF4aXNIZWlnaHQ6IDAsXG4gICAgeUF4aXNIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICh0aGlzLmNvbXB1dGVkSGVpZ2h0KCkgLSB0aGlzLnhBeGlzSGVpZ2h0KTtcbiAgICB9LFxuICAgIHhBeGlzV2lkdGg6IDAsXG4gICAgbGFiZWxXaWR0aDogMCxcbiAgICB5QXhpc1BhZGRpbmdSaWdodDogc2V0dGluZ3MueUF4aXMucGFkZGluZ1JpZ2h0LFxuICAgIHRpY2tXaWR0aDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKHRoaXMuY29tcHV0ZWRXaWR0aCgpIC0gKHRoaXMubGFiZWxXaWR0aCArIHRoaXMueUF4aXNQYWRkaW5nUmlnaHQpKTtcbiAgICB9LFxuICAgIGJhckhlaWdodDogc2V0dGluZ3MuYmFySGVpZ2h0LFxuICAgIGJhbmRzOiB7XG4gICAgICBwYWRkaW5nOiBzZXR0aW5ncy5iYW5kcy5wYWRkaW5nLFxuICAgICAgb2Zmc2V0OiBzZXR0aW5ncy5iYW5kcy5vZmZzZXQsXG4gICAgICBvdXRlclBhZGRpbmc6IHNldHRpbmdzLmJhbmRzLm91dGVyUGFkZGluZ1xuICAgIH1cbiAgfVxuXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jb25maWcvY2hhcnQtc2V0dGluZ3MuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJuYW1lXCI6IFwiY2hhcnQtdG9vbFwiLFxuXHRcInZlcnNpb25cIjogXCIxLjEuMVwiLFxuXHRcImJ1aWxkVmVyXCI6IFwiMFwiLFxuXHRcImRlc2NyaXB0aW9uXCI6IFwiQSByZXNwb25zaXZlIGNoYXJ0aW5nIGFwcGxpY2F0aW9uXCIsXG5cdFwibWFpblwiOiBcImd1bHBmaWxlLmpzXCIsXG5cdFwiZGVwZW5kZW5jaWVzXCI6IHt9LFxuXHRcImRldkRlcGVuZGVuY2llc1wiOiB7XG5cdFx0XCJicm93c2VyLXN5bmNcIjogXCJeMi4xNS4wXCIsXG5cdFx0XCJndWxwXCI6IFwiXjMuOC4xMVwiLFxuXHRcdFwiZ3VscC1jbGVhblwiOiBcIl4wLjMuMVwiLFxuXHRcdFwiZ3VscC1qc29uLWVkaXRvclwiOiBcIl4yLjIuMVwiLFxuXHRcdFwiZ3VscC1taW5pZnktY3NzXCI6IFwiXjEuMi4wXCIsXG5cdFx0XCJndWxwLXJlbmFtZVwiOiBcIl4xLjIuMlwiLFxuXHRcdFwiZ3VscC1yZXBsYWNlXCI6IFwiXjAuNS4zXCIsXG5cdFx0XCJndWxwLXNhc3NcIjogXCJeMi4zLjJcIixcblx0XHRcImd1bHAtc2hlbGxcIjogXCJeMC41LjJcIixcblx0XHRcImd1bHAtc291cmNlbWFwc1wiOiBcIl4xLjUuMlwiLFxuXHRcdFwiZ3VscC11dGlsXCI6IFwiXjMuMC42XCIsXG5cdFx0XCJqc2RvY1wiOiBcIl4zLjMuMlwiLFxuXHRcdFwianNvbi1sb2FkZXJcIjogXCJeMC41LjNcIixcblx0XHRcInJ1bi1zZXF1ZW5jZVwiOiBcIl4xLjIuMlwiLFxuXHRcdFwid2VicGFja1wiOiBcIl4xLjEzLjJcIixcblx0XHRcIndlYnBhY2stc3RyZWFtXCI6IFwiXjMuMS4wXCIsXG5cdFx0XCJ5YXJnc1wiOiBcIl41LjAuMFwiXG5cdH0sXG5cdFwic2NyaXB0c1wiOiB7XG5cdFx0XCJ0ZXN0XCI6IFwiXCJcblx0fSxcblx0XCJrZXl3b3Jkc1wiOiBbXG5cdFx0XCJjaGFydHNcIixcblx0XHRcImQzXCIsXG5cdFx0XCJkM2pzXCIsXG5cdFx0XCJtZXRlb3JcIixcblx0XHRcImd1bHBcIixcblx0XHRcIndlYnBhY2tcIixcblx0XHRcImRhdGEgdmlzdWFsaXphdGlvblwiLFxuXHRcdFwiY2hhcnRcIixcblx0XHRcIm1vbmdvXCJcblx0XSxcblx0XCJyZXBvc2l0b3J5XCI6IHtcblx0XHRcInR5cGVcIjogXCJnaXRcIixcblx0XHRcInVybFwiOiBcImdpdEBnaXRodWIuY29tOmdsb2JlYW5kbWFpbC9jaGFydC10b29sLmdpdFwiXG5cdH0sXG5cdFwiY29udHJpYnV0b3JzXCI6IFtcblx0XHR7XG5cdFx0XHRcImF1dGhvclwiOiBcIlRvbSBDYXJkb3NvXCIsXG5cdFx0XHRcImVtYWlsXCI6IFwidGNhcmRvc29AZ2xvYmVhbmRtYWlsLmNvbVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcImF1dGhvclwiOiBcIkplcmVteSBBZ2l1c1wiLFxuXHRcdFx0XCJlbWFpbFwiOiBcImphZ2l1c0BnbG9iZWFuZG1haWwuY29tXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwiYXV0aG9yXCI6IFwiTWljaGFlbCBQZXJlaXJhXCIsXG5cdFx0XHRcImVtYWlsXCI6IFwibXBlcmVpcmFAZ2xvYmVhbmRtYWlsLmNvbVwiXG5cdFx0fVxuXHRdLFxuXHRcImxpY2Vuc2VcIjogXCJNSVRcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3BhY2thZ2UuanNvblxuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiQ1VTVE9NXCI6IGZhbHNlLFxuXHRcInByZWZpeFwiOiBcImN0LVwiLFxuXHRcIm1vbnRoc0FiclwiOiBbXG5cdFx0XCJKYW4uXCIsXG5cdFx0XCJGZWIuXCIsXG5cdFx0XCJNYXIuXCIsXG5cdFx0XCJBcHIuXCIsXG5cdFx0XCJNYXlcIixcblx0XHRcIkp1bmVcIixcblx0XHRcIkp1bHlcIixcblx0XHRcIkF1Zy5cIixcblx0XHRcIlNlcHQuXCIsXG5cdFx0XCJPY3QuXCIsXG5cdFx0XCJOb3YuXCIsXG5cdFx0XCJEZWMuXCIsXG5cdFx0XCJKYW4uXCJcblx0XSxcblx0XCJkZWJvdW5jZVwiOiA1MDAsXG5cdFwidGlwVGltZW91dFwiOiA1MDAwLFxuXHRcInJhdGlvTW9iaWxlXCI6IDEuMTUsXG5cdFwicmF0aW9EZXNrdG9wXCI6IDAuNjUsXG5cdFwiZGF0ZUZvcm1hdFwiOiBcIiVZLSVtLSVkXCIsXG5cdFwidGltZUZvcm1hdFwiOiBcIiVIOiVNXCIsXG5cdFwibWFyZ2luXCI6IHtcblx0XHRcInRvcFwiOiAxMCxcblx0XHRcInJpZ2h0XCI6IDMsXG5cdFx0XCJib3R0b21cIjogMCxcblx0XHRcImxlZnRcIjogMFxuXHR9LFxuXHRcInRpcE9mZnNldFwiOiB7XG5cdFx0XCJ2ZXJ0aWNhbFwiOiA0LFxuXHRcdFwiaG9yaXpvbnRhbFwiOiAxXG5cdH0sXG5cdFwidGlwUGFkZGluZ1wiOiB7XG5cdFx0XCJ0b3BcIjogNCxcblx0XHRcInJpZ2h0XCI6IDksXG5cdFx0XCJib3R0b21cIjogNCxcblx0XHRcImxlZnRcIjogOVxuXHR9LFxuXHRcInlBeGlzXCI6IHtcblx0XHRcImRpc3BsYXlcIjogdHJ1ZSxcblx0XHRcInNjYWxlXCI6IFwibGluZWFyXCIsXG5cdFx0XCJ0aWNrc1wiOiBcImF1dG9cIixcblx0XHRcIm9yaWVudFwiOiBcInJpZ2h0XCIsXG5cdFx0XCJmb3JtYXRcIjogXCJjb21tYVwiLFxuXHRcdFwicHJlZml4XCI6IFwiXCIsXG5cdFx0XCJzdWZmaXhcIjogXCJcIixcblx0XHRcIm1pblwiOiBcIlwiLFxuXHRcdFwibWF4XCI6IFwiXCIsXG5cdFx0XCJyZXNjYWxlXCI6IGZhbHNlLFxuXHRcdFwibmljZVwiOiB0cnVlLFxuXHRcdFwicGFkZGluZ1JpZ2h0XCI6IDksXG5cdFx0XCJ0aWNrTG93ZXJCb3VuZFwiOiAzLFxuXHRcdFwidGlja1VwcGVyQm91bmRcIjogOCxcblx0XHRcInRpY2tHb2FsXCI6IDUsXG5cdFx0XCJ3aWR0aFRocmVzaG9sZFwiOiA0MjAsXG5cdFx0XCJkeVwiOiBcIlwiLFxuXHRcdFwidGV4dFhcIjogMCxcblx0XHRcInRleHRZXCI6IFwiXCJcblx0fSxcblx0XCJ4QXhpc1wiOiB7XG5cdFx0XCJkaXNwbGF5XCI6IHRydWUsXG5cdFx0XCJzY2FsZVwiOiBcInRpbWVcIixcblx0XHRcInRpY2tzXCI6IFwiYXV0b1wiLFxuXHRcdFwib3JpZW50XCI6IFwiYm90dG9tXCIsXG5cdFx0XCJmb3JtYXRcIjogXCJhdXRvXCIsXG5cdFx0XCJwcmVmaXhcIjogXCJcIixcblx0XHRcInN1ZmZpeFwiOiBcIlwiLFxuXHRcdFwibWluXCI6IFwiXCIsXG5cdFx0XCJtYXhcIjogXCJcIixcblx0XHRcInJlc2NhbGVcIjogZmFsc2UsXG5cdFx0XCJuaWNlXCI6IGZhbHNlLFxuXHRcdFwicmFuZ2VQb2ludHNcIjogMSxcblx0XHRcInRpY2tUYXJnZXRcIjogNixcblx0XHRcInRpY2tzU21hbGxcIjogNCxcblx0XHRcIndpZHRoVGhyZXNob2xkXCI6IDQyMCxcblx0XHRcImR5XCI6IDAuNyxcblx0XHRcImJhck9mZnNldFwiOiA5LFxuXHRcdFwidXBwZXJcIjoge1xuXHRcdFx0XCJ0aWNrSGVpZ2h0XCI6IDcsXG5cdFx0XHRcInRleHRYXCI6IDYsXG5cdFx0XHRcInRleHRZXCI6IDdcblx0XHR9LFxuXHRcdFwibG93ZXJcIjoge1xuXHRcdFx0XCJ0aWNrSGVpZ2h0XCI6IDEyLFxuXHRcdFx0XCJ0ZXh0WFwiOiA2LFxuXHRcdFx0XCJ0ZXh0WVwiOiAyXG5cdFx0fVxuXHR9LFxuXHRcImJhckhlaWdodFwiOiAzMCxcblx0XCJiYW5kc1wiOiB7XG5cdFx0XCJwYWRkaW5nXCI6IDAuMDYsXG5cdFx0XCJvZmZzZXRcIjogMC4xMixcblx0XHRcIm91dGVyUGFkZGluZ1wiOiAwLjAzXG5cdH0sXG5cdFwic291cmNlXCI6IHtcblx0XHRcInByZWZpeFwiOiBcIkNIQVJUIFRPT0xcIixcblx0XHRcInN1ZmZpeFwiOiBcIiDCuyBTT1VSQ0U6XCJcblx0fSxcblx0XCJzb2NpYWxcIjoge1xuXHRcdFwiZmFjZWJvb2tcIjoge1xuXHRcdFx0XCJsYWJlbFwiOiBcIkZhY2Vib29rXCIsXG5cdFx0XHRcImljb25cIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb3VuZGljb25zLzMuMC4wL3N2Z3MvZmktc29jaWFsLWZhY2Vib29rLnN2Z1wiLFxuXHRcdFx0XCJyZWRpcmVjdFwiOiBcIlwiLFxuXHRcdFx0XCJhcHBJRFwiOiBcIlwiXG5cdFx0fSxcblx0XHRcInR3aXR0ZXJcIjoge1xuXHRcdFx0XCJsYWJlbFwiOiBcIlR3aXR0ZXJcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1zb2NpYWwtdHdpdHRlci5zdmdcIixcblx0XHRcdFwidmlhXCI6IFwiXCIsXG5cdFx0XHRcImhhc2h0YWdcIjogXCJcIlxuXHRcdH0sXG5cdFx0XCJlbWFpbFwiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiRW1haWxcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1tYWlsLnN2Z1wiXG5cdFx0fSxcblx0XHRcInNtc1wiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiU01TXCIsXG5cdFx0XHRcImljb25cIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb3VuZGljb25zLzMuMC4wL3N2Z3MvZmktdGVsZXBob25lLnN2Z1wiXG5cdFx0fVxuXHR9LFxuXHRcImltYWdlXCI6IHtcblx0XHRcImVuYWJsZVwiOiBmYWxzZSxcblx0XHRcImJhc2VfcGF0aFwiOiBcIlwiLFxuXHRcdFwiZXhwaXJhdGlvblwiOiAzMDAwMCxcblx0XHRcImZpbGVuYW1lXCI6IFwidGh1bWJuYWlsXCIsXG5cdFx0XCJleHRlbnNpb25cIjogXCJwbmdcIixcblx0XHRcInRodW1ibmFpbFdpZHRoXCI6IDQ2MFxuXHR9XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vY3VzdG9tL2NoYXJ0LXRvb2wtY29uZmlnLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsIi8qKlxuICogVXRpbGl0aWVzIG1vZHVsZS4gRnVuY3Rpb25zIHRoYXQgYXJlbid0IHNwZWNpZmljIHRvIGFueSBvbmUgbW9kdWxlLlxuICogQG1vZHVsZSB1dGlscy91dGlsc1xuICovXG5cbi8qKlxuICogR2l2ZW4gYSBmdW5jdGlvbiB0byBwZXJmb3JtLCBhIHRpbWVvdXQgcGVyaW9kLCBhIHBhcmFtZXRlciB0byBwYXNzIHRvIHRoZSBwZXJmb3JtZWQgZnVuY3Rpb24sIGFuZCBhIHJlZmVyZW5jZSB0byB0aGUgd2luZG93LCBmaXJlIGEgc3BlY2lmaWMgZnVuY3Rpb24uXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICAgICBGdW5jdGlvbiB0byBwZXJmb3JtIG9uIGRlYm91bmNlLlxuICogQHBhcmFtICB7T2JqZWN0fSBvYmogICAgICBPYmplY3QgcGFzc2VkIHRvIEZ1bmN0aW9uIHdoaWNoIGlzIHBlcmZvcm1lZCBvbiBkZWJvdW5jZS5cbiAqIEBwYXJhbSAge0ludGVnZXJ9ICAgdGltZW91dCBUaW1lb3V0IHBlcmlvZCBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgcm9vdCAgICBXaW5kb3cgb2JqZWN0LlxuICogQHJldHVybiB7RnVuY3Rpb259ICAgICAgICAgICBGaW5hbCBkZWJvdW5jZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZm4sIG9iaiwgdGltZW91dCwgcm9vdCkge1xuICB2YXIgdGltZW91dElEID0gLTE7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGltZW91dElEID4gLTEpIHsgcm9vdC5jbGVhclRpbWVvdXQodGltZW91dElEKTsgfVxuICAgIHRpbWVvdXRJRCA9IHJvb3Quc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgZm4ob2JqKVxuICAgIH0sIHRpbWVvdXQpO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbW92ZSBjaGFydCBTVkcgYW5kIGRpdnMgaW5zaWRlIGEgY29udGFpbmVyIGZyb20gdGhlIERPTS5cbiAqIEBwYXJhbSAge1N0cmluZ30gY29udGFpbmVyXG4gKi9cbmZ1bmN0aW9uIGNsZWFyQ2hhcnQoY29udGFpbmVyKSB7XG5cbiAgdmFyIGNvbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XG5cbiAgd2hpbGUgKGNvbnQgJiYgY29udC5xdWVyeVNlbGVjdG9yQWxsKFwic3ZnXCIpLmxlbmd0aCkge1xuICAgIHZhciBzdmcgPSBjb250LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzdmdcIik7XG4gICAgc3ZnW3N2Zy5sZW5ndGggLSAxXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN2Z1tzdmcubGVuZ3RoIC0gMV0pO1xuICB9XG5cbiAgd2hpbGUgKGNvbnQgJiYgY29udC5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLmxlbmd0aCkge1xuICAgIHZhciBkaXYgPSBjb250LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIik7XG4gICAgZGl2W2Rpdi5sZW5ndGggLSAxXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdltkaXYubGVuZ3RoIC0gMV0pO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuLyoqXG4gKiBDbGVhcnMgdGhlIGNoYXJ0IGRhdGEgb2YgaXRzIHBvc3QtcmVuZGVyIGNoYXJ0T2JqIG9iamVjdC5cbiAqIEBwYXJhbSAge09iamVjdH0gb2JqIE9iamVjdCB1c2VkIHRvIGNvbnN0cnVjdCBjaGFydHMuXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICBUaGUgbmV3IHZlcnNpb24gb2YgdGhlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xlYXJPYmoob2JqKSB7XG4gIGlmIChvYmouY2hhcnRPYmopIHsgb2JqLmNoYXJ0T2JqID0gdW5kZWZpbmVkOyB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogQ2xlYXJzIHRoZSBkcmF3biBhcnJheS5cbiAqIEBwYXJhbSAge0FycmF5fSBkcmF3blxuICogQHBhcmFtICB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBjbGVhckRyYXduKGRyYXduLCBvYmopIHtcbiAgaWYgKGRyYXduLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSBkcmF3bi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKGRyYXduW2ldLmlkID09PSBvYmouaWQpIHtcbiAgICAgICAgZHJhd24uc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gZHJhd247XG59XG5cbi8qKlxuICogR2V0IHRoZSBib3VuZGluZ0NsaWVudFJlY3QgZGltZW5zaW9ucyBnaXZlbiBhIHNlbGVjdG9yLlxuICogQHBhcmFtICB7U3RyaW5nfSBjb250YWluZXJcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgIFRoZSBib3VuZGluZ0NsaWVudFJlY3Qgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBnZXRCb3VuZGluZyhzZWxlY3RvciwgZGltZW5zaW9uKSB7XG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVtkaW1lbnNpb25dO1xufVxuXG4vKipcbiAqIEJhc2ljIGZhY3RvcnkgZm9yIGZpZ3VyaW5nIG91dCBhbW91bnQgb2YgbWlsbGlzZWNvbmRzIGluIGEgZ2l2ZW4gdGltZSBwZXJpb2QuXG4gKi9cbmZ1bmN0aW9uIFRpbWVPYmooKSB7XG4gIHRoaXMuc2VjID0gMTAwMDtcbiAgdGhpcy5taW4gPSB0aGlzLnNlYyAqIDYwO1xuICB0aGlzLmhvdXIgPSB0aGlzLm1pbiAqIDYwO1xuICB0aGlzLmRheSA9IHRoaXMuaG91ciAqIDI0O1xuICB0aGlzLndlZWsgPSB0aGlzLmRheSAqIDc7XG4gIHRoaXMubW9udGggPSB0aGlzLmRheSAqIDMwO1xuICB0aGlzLnllYXIgPSB0aGlzLmRheSAqIDM2NTtcbn1cblxuLyoqXG4gKiBTbGlnaHRseSBhbHRlcmVkIEJvc3RvY2sgbWFnaWMgdG8gd3JhcCBTVkcgPHRleHQ+IG5vZGVzIGJhc2VkIG9uIGF2YWlsYWJsZSB3aWR0aFxuICogQHBhcmFtICB7T2JqZWN0fSB0ZXh0ICAgIEQzIHRleHQgc2VsZWN0aW9uLlxuICogQHBhcmFtICB7SW50ZWdlcn0gd2lkdGhcbiAqL1xuZnVuY3Rpb24gd3JhcFRleHQodGV4dCwgd2lkdGgpIHtcbiAgdGV4dC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciB0ZXh0ID0gZDMuc2VsZWN0KHRoaXMpLFxuICAgICAgICB3b3JkcyA9IHRleHQudGV4dCgpLnNwbGl0KC9cXHMrLykucmV2ZXJzZSgpLFxuICAgICAgICB3b3JkLFxuICAgICAgICBsaW5lID0gW10sXG4gICAgICAgIGxpbmVOdW1iZXIgPSAwLFxuICAgICAgICBsaW5lSGVpZ2h0ID0gMS4wLCAvLyBlbXNcbiAgICAgICAgeCA9IDAsXG4gICAgICAgIHkgPSB0ZXh0LmF0dHIoXCJ5XCIpLFxuICAgICAgICBkeSA9IHBhcnNlRmxvYXQodGV4dC5hdHRyKFwiZHlcIikpLFxuICAgICAgICB0c3BhbiA9IHRleHQudGV4dChudWxsKS5hcHBlbmQoXCJ0c3BhblwiKVxuICAgICAgICAgIC5hdHRyKFwieFwiLCB4KVxuICAgICAgICAgIC5hdHRyKFwieVwiLCB5KVxuICAgICAgICAgIC5hdHRyKFwiZHlcIiwgZHkgKyBcImVtXCIpO1xuXG4gICAgd2hpbGUgKHdvcmQgPSB3b3Jkcy5wb3AoKSkge1xuICAgICAgbGluZS5wdXNoKHdvcmQpO1xuICAgICAgdHNwYW4udGV4dChsaW5lLmpvaW4oXCIgXCIpKTtcbiAgICAgIGlmICh0c3Bhbi5ub2RlKCkuZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCkgPiB3aWR0aCAmJiBsaW5lLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbGluZS5wb3AoKTtcbiAgICAgICAgdHNwYW4udGV4dChsaW5lLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbGluZSA9IFt3b3JkXTtcbiAgICAgICAgdHNwYW4gPSB0ZXh0LmFwcGVuZChcInRzcGFuXCIpXG4gICAgICAgICAgLmF0dHIoXCJ4XCIsIHgpXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIHkpXG4gICAgICAgICAgLmF0dHIoXCJkeVwiLCArK2xpbmVOdW1iZXIgKiBsaW5lSGVpZ2h0ICsgZHkgKyBcImVtXCIpXG4gICAgICAgICAgLnRleHQod29yZCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0d28gZGF0ZXMgZGF0ZSBhbmQgYSB0b2xlcmFuY2UgbGV2ZWwsIHJldHVybiBhIHRpbWUgXCJjb250ZXh0XCIgZm9yIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHR3byB2YWx1ZXMuXG4gKiBAcGFyYW0gIHtPYmplY3R9IGQxICAgICBCZWdpbm5pbmcgZGF0ZSBvYmplY3QuXG4gKiBAcGFyYW0gIHtPYmplY3R9IGQyICAgICBFbmQgZGF0ZSBvYmplY3QuXG4gKiBAcGFyYW0gIHtJbnRlZ2VyfSB0b2xlcmFuY2VcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgIFRoZSByZXN1bHRpbmcgdGltZSBjb250ZXh0LlxuICovXG5mdW5jdGlvbiB0aW1lRGlmZihkMSwgZDIsIHRvbGVyYW5jZSkge1xuXG4gIHZhciBkaWZmID0gZDIgLSBkMSxcbiAgICAgIHRpbWUgPSBuZXcgVGltZU9iaigpO1xuXG4gIC8vIHJldHVybmluZyB0aGUgY29udGV4dFxuICBpZiAoKGRpZmYgLyB0aW1lLnllYXIpID4gdG9sZXJhbmNlKSB7IHJldHVybiBcInllYXJzXCI7IH1cbiAgZWxzZSBpZiAoKGRpZmYgLyB0aW1lLm1vbnRoKSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJtb250aHNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUud2VlaykgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwid2Vla3NcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUuZGF5KSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJkYXlzXCI7IH1cbiAgZWxzZSBpZiAoKGRpZmYgLyB0aW1lLmhvdXIpID4gdG9sZXJhbmNlKSB7IHJldHVybiBcImhvdXJzXCI7IH1cbiAgZWxzZSBpZiAoKGRpZmYgLyB0aW1lLm1pbikgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwibWludXRlc1wiOyB9XG4gIGVsc2UgeyByZXR1cm4gXCJkYXlzXCI7IH1cbiAgLy8gaWYgbm9uZSBvZiB0aGVzZSB3b3JrIGkgZmVlbCBiYWQgZm9yIHlvdSBzb25cbiAgLy8gaSd2ZSBnb3QgOTkgcHJvYmxlbXMgYnV0IGFuIGlmL2Vsc2UgYWluXCJ0IG9uZVxuXG59XG5cbi8qKlxuICogR2l2ZW4gYSBkYXRhc2V0LCBmaWd1cmUgb3V0IHdoYXQgdGhlIHRpbWUgY29udGV4dCBpcyBhbmRcbiAqIHdoYXQgdGhlIG51bWJlciBvZiB0aW1lIHVuaXRzIGVsYXBzZWQgaXNcbiAqIEBwYXJhbSAge0FycmF5fSBkYXRhXG4gKiBAcmV0dXJuIHtJbnRlZ2VyfVxuICovXG5mdW5jdGlvbiB0aW1lSW50ZXJ2YWwoZGF0YSkge1xuXG4gIHZhciBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICBkMSA9IGRhdGFbMF0ua2V5LFxuICAgICAgZDIgPSBkYXRhW2RhdGFMZW5ndGggLSAxXS5rZXk7XG5cbiAgdmFyIHJldDtcblxuICB2YXIgaW50ZXJ2YWxzID0gW1xuICAgIHsgdHlwZTogXCJ5ZWFyc1wiLCBzdGVwOiAxIH0sXG4gICAgeyB0eXBlOiBcIm1vbnRoc1wiLCBzdGVwOiAzIH0sIC8vIHF1YXJ0ZXJzXG4gICAgeyB0eXBlOiBcIm1vbnRoc1wiLCBzdGVwOiAxIH0sXG4gICAgeyB0eXBlOiBcImRheXNcIiwgc3RlcDogMSB9LFxuICAgIHsgdHlwZTogXCJob3Vyc1wiLCBzdGVwOiAxIH0sXG4gICAgeyB0eXBlOiBcIm1pbnV0ZXNcIiwgc3RlcDogMSB9XG4gIF07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcnZhbHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaW50ZXJ2YWxDYW5kaWRhdGUgPSBkMy50aW1lW2ludGVydmFsc1tpXS50eXBlXShkMSwgZDIsIGludGVydmFsc1tpXS5zdGVwKS5sZW5ndGg7XG4gICAgaWYgKGludGVydmFsQ2FuZGlkYXRlID49IGRhdGFMZW5ndGggLSAxKSB7XG4gICAgICB2YXIgcmV0ID0gaW50ZXJ2YWxDYW5kaWRhdGU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHJldDtcblxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHRyYW5zZm9ybSBwb3NpdGlvbiBvZiBhbiBlbGVtZW50IGFzIGFuIGFycmF5XG4gKiBAcGFyYW0gIHtPYmplY3R9IG5vZGVcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBnZXRUcmFuc2xhdGVYWShub2RlKSB7XG4gIHJldHVybiBkMy50cmFuc2Zvcm0oZDMuc2VsZWN0KG5vZGUpLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdHJhbnNsYXRlIHN0YXRlbWVudCBiZWNhdXNlIGl0J3MgYW5ub3lpbmcgdG8gdHlwZSBvdXRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdHJhbnNsYXRlKHgsIHkpIHtcbiAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiKVwiO1xufVxuXG4vKipcbiAqIFRlc3RzIGZvciBTVkcgc3VwcG9ydCwgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vdmlsamFtaXMvZmVhdHVyZS5qcy9cbiAqIEBwYXJhbSAge09iamVjdH0gcm9vdCBBIHJlZmVyZW5jZSB0byB0aGUgYnJvd3NlciB3aW5kb3cgb2JqZWN0LlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gc3ZnVGVzdChyb290KSB7XG4gIHJldHVybiAhIXJvb3QuZG9jdW1lbnQgJiYgISFyb290LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhIXJvb3QuZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIikuY3JlYXRlU1ZHUmVjdDtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIHRoZSBBV1MgVVJMIGZvciBhIGdpdmVuIGNoYXJ0IElELlxuICogQHBhcmFtICB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0VGh1bWJuYWlsUGF0aChvYmopIHtcbiAgdmFyIGltZ1NldHRpbmdzID0gb2JqLmltYWdlO1xuXG4gIGltZ1NldHRpbmdzLmJ1Y2tldCA9IHJlcXVpcmUoXCIuLi9jb25maWcvZW52XCIpO1xuXG4gIHZhciBpZCA9IG9iai5pZC5yZXBsYWNlKG9iai5wcmVmaXgsIFwiXCIpO1xuXG4gIHJldHVybiBcImh0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9cIiArIGltZ1NldHRpbmdzLmJ1Y2tldCArIFwiL1wiICsgaW1nU2V0dGluZ3MuYmFzZV9wYXRoICsgaWQgKyBcIi9cIiArIGltZ1NldHRpbmdzLmZpbGVuYW1lICsgXCIuXCIgKyBpbWdTZXR0aW5ncy5leHRlbnNpb247XG59XG5cbi8qKlxuICogR2l2ZW4gYSBjaGFydCBvYmplY3QgYW5kIGNvbnRhaW5lciwgZ2VuZXJhdGUgYW5kIGFwcGVuZCBhIHRodW1ibmFpbFxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZVRodW1iKGNvbnRhaW5lciwgb2JqLCBzZXR0aW5ncykge1xuXG4gIHZhciBpbWdTZXR0aW5ncyA9IHNldHRpbmdzLmltYWdlO1xuXG4gIHZhciBjb250ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpLFxuICAgICAgZmFsbGJhY2sgPSBjb250LnF1ZXJ5U2VsZWN0b3IoXCIuXCIgKyBzZXR0aW5ncy5wcmVmaXggKyBcImJhc2U2NGltZ1wiKTtcblxuICBpZiAoaW1nU2V0dGluZ3MgJiYgaW1nU2V0dGluZ3MuZW5hYmxlICYmIG9iai5kYXRhLmlkKSB7XG5cbiAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCBnZXRUaHVtYm5haWxQYXRoKG9iaikpO1xuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsIG9iai5kYXRhLmhlYWRpbmcpO1xuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgc2V0dGluZ3MucHJlZml4ICsgXCJ0aHVtYm5haWxcIik7XG5cbiAgICBjb250LmFwcGVuZENoaWxkKGltZyk7XG5cbiAgfSBlbHNlIGlmIChmYWxsYmFjaykge1xuXG4gICAgZmFsbGJhY2suc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGNzdlRvVGFibGUodGFyZ2V0LCBkYXRhKSB7XG4gIHZhciBwYXJzZWRDU1YgPSBkMy5jc3YucGFyc2VSb3dzKGRhdGEpO1xuXG4gIHRhcmdldC5hcHBlbmQoXCJ0YWJsZVwiKS5zZWxlY3RBbGwoXCJ0clwiKVxuICAgIC5kYXRhKHBhcnNlZENTVikuZW50ZXIoKVxuICAgIC5hcHBlbmQoXCJ0clwiKS5zZWxlY3RBbGwoXCJ0ZFwiKVxuICAgIC5kYXRhKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pLmVudGVyKClcbiAgICAuYXBwZW5kKFwidGRcIilcbiAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlYm91bmNlOiBkZWJvdW5jZSxcbiAgY2xlYXJDaGFydDogY2xlYXJDaGFydCxcbiAgY2xlYXJPYmo6IGNsZWFyT2JqLFxuICBjbGVhckRyYXduOiBjbGVhckRyYXduLFxuICBnZXRCb3VuZGluZzogZ2V0Qm91bmRpbmcsXG4gIFRpbWVPYmo6IFRpbWVPYmosXG4gIHdyYXBUZXh0OiB3cmFwVGV4dCxcbiAgdGltZURpZmY6IHRpbWVEaWZmLFxuICB0aW1lSW50ZXJ2YWw6IHRpbWVJbnRlcnZhbCxcbiAgZ2V0VHJhbnNsYXRlWFk6IGdldFRyYW5zbGF0ZVhZLFxuICB0cmFuc2xhdGU6IHRyYW5zbGF0ZSxcbiAgc3ZnVGVzdDogc3ZnVGVzdCxcbiAgZ2V0VGh1bWJuYWlsUGF0aDogZ2V0VGh1bWJuYWlsUGF0aCxcbiAgZ2VuZXJhdGVUaHVtYjogZ2VuZXJhdGVUaHVtYixcbiAgY3N2VG9UYWJsZTogY3N2VG9UYWJsZSxcbiAgZGF0YVBhcnNlOiByZXF1aXJlKFwiLi9kYXRhcGFyc2VcIiksXG4gIGZhY3Rvcnk6IHJlcXVpcmUoXCIuL2ZhY3RvcnlcIilcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL3V0aWxzL3V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gczNfYnVja2V0IGlzIGRlZmluZWQgaW4gd2VicGFjay5jb25maWcuanNcbm1vZHVsZS5leHBvcnRzID0gczNfYnVja2V0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jb25maWcvZW52LmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBEYXRhIHBhcnNpbmcgbW9kdWxlLiBUYWtlcyBhIENTViBhbmQgdHVybnMgaXQgaW50byBhbiBPYmplY3QsIGFuZCBvcHRpb25hbGx5IGRldGVybWluZXMgdGhlIGZvcm1hdHRpbmcgdG8gdXNlIHdoZW4gcGFyc2luZyBkYXRlcy5cbiAqIEBtb2R1bGUgdXRpbHMvZGF0YXBhcnNlXG4gKiBAc2VlIG1vZHVsZTp1dGlscy9mYWN0b3J5XG4gKi9cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBzY2FsZSByZXR1cm5zIGFuIGlucHV0IGRhdGUgb3Igbm90LlxuICogQHBhcmFtICB7U3RyaW5nfSBzY2FsZVR5cGUgICAgICBUaGUgdHlwZSBvZiBzY2FsZS5cbiAqIEBwYXJhbSAge1N0cmluZ30gZGVmYXVsdEZvcm1hdCAgRm9ybWF0IHNldCBieSB0aGUgY2hhcnQgdG9vbCBzZXR0aW5ncy5cbiAqIEBwYXJhbSAge1N0cmluZ30gZGVjbGFyZWRGb3JtYXQgRm9ybWF0IHBhc3NlZCBieSB0aGUgY2hhcnQgZW1iZWQgY29kZSwgaWYgdGhlcmUgaXMgb25lXG4gKiBAcmV0dXJuIHtTdHJpbmd8VW5kZWZpbmVkfVxuICovXG5mdW5jdGlvbiBpbnB1dERhdGUoc2NhbGVUeXBlLCBkZWZhdWx0Rm9ybWF0LCBkZWNsYXJlZEZvcm1hdCkge1xuXG4gIGlmIChzY2FsZVR5cGUgPT09IFwidGltZVwiIHx8IHNjYWxlVHlwZSA9PT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgIHJldHVybiBkZWNsYXJlZEZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxufVxuXG4vKipcbiAqIFBhcnNlcyBhIENTViBzdHJpbmcgdXNpbmcgZDMuY3N2LnBhcnNlKCkgYW5kIHR1cm5zIGl0IGludG8gYW4gYXJyYXkgb2Ygb2JqZWN0cy5cbiAqIEBwYXJhbSAge1N0cmluZ30gY3N2ICAgICAgICAgICAgIENTViBzdHJpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcGFyYW0gIHtTdHJpbmcgaW5wdXREYXRlRm9ybWF0IERhdGUgZm9ybWF0IGluIEQzIHN0cmZ0aW1lIHN0eWxlLCBpZiB0aGVyZSBpcyBvbmVcbiAqIEBwYXJhbSAge1N0cmluZ30gaW5kZXggICAgICAgICAgIFZhbHVlIHRvIGluZGV4IHRoZSBkYXRhIHRvLCBpZiB0aGVyZSBpcyBvbmVcbiAqIEByZXR1cm4geyB7Y3N2OiBTdHJpbmcsIGRhdGE6IEFycmF5LCBzZXJpZXNBbW91bnQ6IEludGVnZXIsIGtleXM6IEFycmF5fSB9ICAgICAgICAgICAgICAgICBBbiBvYmplY3Qgd2l0aCB0aGUgb3JpZ2luYWwgQ1NWIHN0cmluZywgdGhlIG5ld2x5LWZvcm1hdHRlZCBkYXRhLCB0aGUgbnVtYmVyIG9mIHNlcmllcyBpbiB0aGUgZGF0YSBhbmQgYW4gYXJyYXkgb2Yga2V5cyB1c2VkLlxuICovXG5mdW5jdGlvbiBwYXJzZShjc3YsIGlucHV0RGF0ZUZvcm1hdCwgaW5kZXgsIHN0YWNrZWQsIHR5cGUpIHtcblxuICB2YXIgdmFsO1xuXG4gIHZhciBmaXJzdFZhbHMgPSB7fTtcblxuICB2YXIgaGVhZGVycyA9IGQzLmNzdi5wYXJzZVJvd3MoY3N2Lm1hdGNoKC9eLiokL20pWzBdKVswXTtcblxuICB2YXIgZGF0YSA9IGQzLmNzdi5wYXJzZShjc3YsIGZ1bmN0aW9uKGQsIGkpIHtcblxuICAgIHZhciBvYmogPSB7fTtcblxuICAgIGlmIChpbnB1dERhdGVGb3JtYXQpIHtcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZDMudGltZS5mb3JtYXQoaW5wdXREYXRlRm9ybWF0KTtcbiAgICAgIG9iai5rZXkgPSBkYXRlRm9ybWF0LnBhcnNlKGRbaGVhZGVyc1swXV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmoua2V5ID0gZFtoZWFkZXJzWzBdXTtcbiAgICB9XG5cbiAgICBvYmouc2VyaWVzID0gW107XG5cbiAgICBmb3IgKHZhciBqID0gMTsgaiA8IGhlYWRlcnMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgdmFyIGtleSA9IGhlYWRlcnNbal07XG5cbiAgICAgIGlmIChkW2tleV0gPT09IDAgfHwgZFtrZXldID09PSBcIlwiKSB7XG4gICAgICAgIGRba2V5XSA9IFwiX191bmRlZmluZWRfX1wiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5kZXgpIHtcblxuICAgICAgICBpZiAoaSA9PT0gMCAmJiAhZmlyc3RWYWxzW2tleV0pIHtcbiAgICAgICAgICBmaXJzdFZhbHNba2V5XSA9IGRba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCA9PT0gXCIwXCIpIHtcbiAgICAgICAgICB2YWwgPSAoKGRba2V5XSAvIGZpcnN0VmFsc1trZXldKSAtIDEpICogMTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbCA9IChkW2tleV0gLyBmaXJzdFZhbHNba2V5XSkgKiBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBkW2tleV07XG4gICAgICB9XG5cbiAgICAgIG9iai5zZXJpZXMucHVzaCh7XG4gICAgICAgIHZhbDogdmFsLFxuICAgICAgICBrZXk6IGtleVxuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuXG4gIH0pO1xuXG4gIHZhciBzZXJpZXNBbW91bnQgPSBkYXRhWzBdLnNlcmllcy5sZW5ndGg7XG5cbiAgaWYgKHN0YWNrZWQpIHtcbiAgICBpZiAodHlwZSA9PT0gXCJzdHJlYW1cIikge1xuICAgICAgdmFyIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKCkub2Zmc2V0KFwic2lsaG91ZXR0ZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKCk7XG4gICAgfVxuICAgIHZhciBzdGFja2VkRGF0YSA9IHN0YWNrKGQzLnJhbmdlKHNlcmllc0Ftb3VudCkubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsZWdlbmQ6IGhlYWRlcnNba2V5ICsgMV0sXG4gICAgICAgICAgeDogZC5rZXksXG4gICAgICAgICAgeTogTnVtYmVyKGQuc2VyaWVzW2tleV0udmFsKSxcbiAgICAgICAgICByYXc6IGRcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY3N2OiBjc3YsXG4gICAgZGF0YTogZGF0YSxcbiAgICBzZXJpZXNBbW91bnQ6IHNlcmllc0Ftb3VudCxcbiAgICBrZXlzOiBoZWFkZXJzLFxuICAgIHN0YWNrZWREYXRhOiBzdGFja2VkRGF0YSB8fCB1bmRlZmluZWRcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5wdXREYXRlOiBpbnB1dERhdGUsXG4gIHBhcnNlOiBwYXJzZVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvdXRpbHMvZGF0YXBhcnNlLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBSZWNpcGUgZmFjdG9yIGZhY3RvcnkgbW9kdWxlLlxuICogQG1vZHVsZSB1dGlscy9mYWN0b3J5XG4gKiBAc2VlIG1vZHVsZTpjaGFydHMvaW5kZXhcbiAqL1xuXG4vKipcbiAqIEdpdmVuIGEgXCJyZWNpcGVcIiBvZiBzZXR0aW5ncyBmb3IgYSBjaGFydCwgcGF0Y2ggaXQgd2l0aCBhbiBvYmplY3QgYW5kIHBhcnNlIHRoZSBkYXRhIGZvciB0aGUgY2hhcnQuXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZpbmFsIGNoYXJ0IHJlY2lwZS5cbiAqL1xuZnVuY3Rpb24gUmVjaXBlRmFjdG9yeShzZXR0aW5ncywgb2JqKSB7XG4gIHZhciBkYXRhUGFyc2UgPSByZXF1aXJlKFwiLi9kYXRhcGFyc2VcIik7XG4gIHZhciBoZWxwZXJzID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvaGVscGVyc1wiKTtcblxuICB2YXIgdCA9IGhlbHBlcnMuZXh0ZW5kKHNldHRpbmdzKTsgLy8gc2hvcnQgZm9yIHRlbXBsYXRlXG5cbiAgdmFyIGVtYmVkID0gb2JqLmRhdGE7XG4gIHZhciBjaGFydCA9IGVtYmVkLmNoYXJ0O1xuXG4gIC8vIEknbSBub3QgYSBiaWcgZmFuIG9mIGluZGVudGluZyBzdHVmZiBsaWtlIHRoaXNcbiAgLy8gKGxvb2tpbmcgYXQgeW91LCBQZXJlaXJhKSwgYnV0IEknbSBtYWtpbmcgYW4gZXhjZXB0aW9uXG4gIC8vIGluIHRoaXMgY2FzZSBiZWNhdXNlIG15IGV5ZXMgd2VyZSBibGVlZGluZy5cblxuICB0LmRpc3BhdGNoICAgICAgICAgPSBvYmouZGlzcGF0Y2g7XG5cbiAgdC52ZXJzaW9uICAgICAgICAgID0gZW1iZWQudmVyc2lvbiAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC52ZXJzaW9uO1xuICB0LmlkICAgICAgICAgICAgICAgPSBvYmouaWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmlkO1xuICB0LmhlYWRpbmcgICAgICAgICAgPSBlbWJlZC5oZWFkaW5nICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmhlYWRpbmc7XG4gIHQucXVhbGlmaWVyICAgICAgICA9IGVtYmVkLnF1YWxpZmllciAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQucXVhbGlmaWVyO1xuICB0LnNvdXJjZSAgICAgICAgICAgPSBlbWJlZC5zb3VyY2UgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LnNvdXJjZTtcbiAgdC5kZWNrICAgICAgICAgICAgID0gZW1iZWQuZGVjayAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5kZWNrXG4gIHQuY3VzdG9tQ2xhc3MgICAgICA9IGNoYXJ0LmNsYXNzICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuY3VzdG9tQ2xhc3M7XG5cbiAgdC54QXhpcyAgICAgICAgICAgID0gaGVscGVycy5leHRlbmQodC54QXhpcywgY2hhcnQueF9heGlzKSAgfHwgdC54QXhpcztcbiAgdC55QXhpcyAgICAgICAgICAgID0gaGVscGVycy5leHRlbmQodC55QXhpcywgY2hhcnQueV9heGlzKSAgfHwgdC55QXhpcztcblxuICB2YXIgbyA9IHQub3B0aW9ucyxcbiAgICAgIGNvID0gY2hhcnQub3B0aW9ucztcblxuICAvLyAgXCJvcHRpb25zXCIgYXJlYSBvZiBlbWJlZCBjb2RlXG4gIG8udHlwZSAgICAgICAgICAgICA9IGNoYXJ0Lm9wdGlvbnMudHlwZSAgICAgICAgICAgICAgICAgICAgIHx8IG8udHlwZTtcbiAgby5pbnRlcnBvbGF0aW9uICAgID0gY2hhcnQub3B0aW9ucy5pbnRlcnBvbGF0aW9uICAgICAgICAgICAgfHwgby5pbnRlcnBvbGF0aW9uO1xuXG4gIG8uc29jaWFsICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5zb2NpYWwpID09PSB0cnVlID8gY28uc29jaWFsICAgICAgICAgICA6IG8uc29jaWFsO1xuICBvLnNoYXJlX2RhdGEgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnNoYXJlX2RhdGEpID09PSB0cnVlID8gY28uc2hhcmVfZGF0YSAgOiBvLnNoYXJlX2RhdGE7XG4gIG8uc3RhY2tlZCAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5zdGFja2VkKSA9PT0gdHJ1ZSA/IGNvLnN0YWNrZWQgICAgICAgICA6IG8uc3RhY2tlZDtcbiAgby5leHBhbmRlZCAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmV4cGFuZGVkKSA9PT0gdHJ1ZSA/IGNvLmV4cGFuZGVkICAgICAgIDogby5leHBhbmRlZDtcbiAgby5oZWFkICAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmhlYWQpID09PSB0cnVlID8gY28uaGVhZCAgICAgICAgICAgICAgIDogby5oZWFkO1xuICBvLmRlY2sgICAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uZGVjaykgPT09IHRydWUgPyBjby5kZWNrICAgICAgICAgICAgICAgOiBvLmRlY2s7XG4gIG8ubGVnZW5kICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5sZWdlbmQpID09PSB0cnVlID8gY28ubGVnZW5kICAgICAgICAgICA6IG8ubGVnZW5kO1xuICBvLnF1YWxpZmllciAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ucXVhbGlmaWVyKSA9PT0gdHJ1ZSA/IGNvLnF1YWxpZmllciAgICAgOiBvLnF1YWxpZmllcjtcbiAgby5mb290ZXIgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmZvb3RlcikgPT09IHRydWUgPyBjby5mb290ZXIgICAgICAgICAgIDogby5mb290ZXI7XG4gIG8ueF9heGlzICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby54X2F4aXMpID09PSB0cnVlID8gY28ueF9heGlzICAgICAgICAgICA6IG8ueF9heGlzO1xuICBvLnlfYXhpcyAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ueV9heGlzKSA9PT0gdHJ1ZSA/IGNvLnlfYXhpcyAgICAgICAgICAgOiBvLnlfYXhpcztcbiAgby50aXBzICAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnRpcHMpID09PSB0cnVlID8gY28udGlwcyAgICAgICAgICAgICAgIDogby50aXBzO1xuICBvLmFubm90YXRpb25zID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uYW5ub3RhdGlvbnMpID09PSB0cnVlID8gY28uYW5ub3RhdGlvbnMgOiBvLmFubm90YXRpb25zO1xuICBvLnJhbmdlICAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ucmFuZ2UpID09PSB0cnVlID8gY28ucmFuZ2UgICAgICAgICAgICAgOiBvLnJhbmdlO1xuICBvLnNlcmllcyAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uc2VyaWVzKSA9PT0gdHJ1ZSA/IGNvLnNlcmllcyAgICAgICAgICAgOiBvLnNlcmllcztcbiAgby5pbmRleCAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmluZGV4ZWQpID09PSB0cnVlID8gY28uaW5kZXhlZCAgICAgICAgIDogby5pbmRleDtcblxuICAvLyAgdGhlc2UgYXJlIHNwZWNpZmljIHRvIHRoZSB0IG9iamVjdCBhbmQgZG9uJ3QgZXhpc3QgaW4gdGhlIGVtYmVkXG4gIHQuYmFzZUNsYXNzICAgICAgICA9IGVtYmVkLmJhc2VDbGFzcyAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuYmFzZUNsYXNzO1xuXG4gIHQuZGltZW5zaW9ucy53aWR0aCA9IGVtYmVkLndpZHRoICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuZGltZW5zaW9ucy53aWR0aDtcblxuICB0LnByZWZpeCAgICAgICAgICAgPSBjaGFydC5wcmVmaXggICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LnByZWZpeDtcbiAgdC5leHBvcnRhYmxlICAgICAgID0gY2hhcnQuZXhwb3J0YWJsZSAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5leHBvcnRhYmxlO1xuICB0LmVkaXRhYmxlICAgICAgICAgPSBjaGFydC5lZGl0YWJsZSAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmVkaXRhYmxlO1xuXG4gIGlmICh0LmV4cG9ydGFibGUpIHtcbiAgICB0LmRpbWVuc2lvbnMud2lkdGggPSBjaGFydC5leHBvcnRhYmxlLndpZHRoIHx8IGVtYmVkLndpZHRoIHx8IHQuZGltZW5zaW9ucy53aWR0aDtcbiAgICB0LmRpbWVuc2lvbnMuaGVpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBjaGFydC5leHBvcnRhYmxlLmhlaWdodDsgfVxuICAgIHQuZGltZW5zaW9ucy5tYXJnaW4gPSBjaGFydC5leHBvcnRhYmxlLm1hcmdpbiB8fCB0LmRpbWVuc2lvbnMubWFyZ2luO1xuICB9XG5cbiAgaWYgKGNoYXJ0Lmhhc0hvdXJzKSB7IHQuZGF0ZUZvcm1hdCArPSBcIiBcIiArIHQudGltZUZvcm1hdDsgfVxuICB0Lmhhc0hvdXJzICAgICAgICAgPSBjaGFydC5oYXNIb3VycyAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0Lmhhc0hvdXJzO1xuICB0LmRhdGVGb3JtYXQgICAgICAgPSBjaGFydC5kYXRlRm9ybWF0ICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmRhdGVGb3JtYXQ7XG5cbiAgdC5kYXRlRm9ybWF0ID0gZGF0YVBhcnNlLmlucHV0RGF0ZSh0LnhBeGlzLnNjYWxlLCB0LmRhdGVGb3JtYXQsIGNoYXJ0LmRhdGVfZm9ybWF0KTtcbiAgdC5kYXRhID0gZGF0YVBhcnNlLnBhcnNlKGNoYXJ0LmRhdGEsIHQuZGF0ZUZvcm1hdCwgby5pbmRleCwgby5zdGFja2VkLCBvLnR5cGUpIHx8IHQuZGF0YTtcblxuICByZXR1cm4gdDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlY2lwZUZhY3Rvcnk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL3V0aWxzL2ZhY3RvcnkuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIEhlbHBlcnMgdGhhdCBtYW5pcHVsYXRlIGFuZCBjaGVjayBwcmltaXRpdmVzLiBOb3RoaW5nIEQzLXNwZWNpZmljIGhlcmUuXG4gKiBAbW9kdWxlIGhlbHBlcnMvaGVscGVyc1xuICovXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIG90aGVyd2lzZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzSW50ZWdlcih4KSB7XG4gIHJldHVybiB4ICUgMSA9PT0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBmbG9hdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRmxvYXQobikge1xuICByZXR1cm4gbiA9PT0gK24gJiYgbiAhPT0gKG58MCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGEgdmFsdWUgaXMgZW1wdHkuIFdvcmtzIGZvciBPYmplY3RzLCBBcnJheXMsIFN0cmluZ3MgYW5kIEludGVnZXJzLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWwpIHtcbiAgaWYgKHZhbC5jb25zdHJ1Y3RvciA9PSBPYmplY3QpIHtcbiAgICBmb3IgKHZhciBwcm9wIGluIHZhbCkge1xuICAgICAgaWYgKHZhbC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAodmFsLmNvbnN0cnVjdG9yID09IEFycmF5KSB7XG4gICAgcmV0dXJuICF2YWwubGVuZ3RoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAhdmFsO1xuICB9XG59XG5cbi8qKlxuICogU2ltcGxlIGNoZWNrIGZvciB3aGV0aGVyIGEgdmFsdWUgaXMgdW5kZWZpbmVkIG9yIG5vdFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBmYWxzZTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0d28gYXJyYXlzLCByZXR1cm5zIG9ubHkgdW5pcXVlIHZhbHVlcyBpbiB0aG9zZSBhcnJheXMuXG4gKiBAcGFyYW0gIHtBcnJheX0gYTFcbiAqIEBwYXJhbSAge0FycmF5fSBhMlxuICogQHJldHVybiB7QXJyYXl9ICAgIEFycmF5IG9mIHVuaXF1ZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RGlmZihhMSwgYTIpIHtcbiAgdmFyIG8xID0ge30sIG8yID0ge30sIGRpZmY9IFtdLCBpLCBsZW4sIGs7XG4gIGZvciAoaSA9IDAsIGxlbiA9IGExLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7IG8xW2ExW2ldXSA9IHRydWU7IH1cbiAgZm9yIChpID0gMCwgbGVuID0gYTIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHsgbzJbYTJbaV1dID0gdHJ1ZTsgfVxuICBmb3IgKGsgaW4gbzEpIHsgaWYgKCEoayBpbiBvMikpIHsgZGlmZi5wdXNoKGspOyB9IH1cbiAgZm9yIChrIGluIG8yKSB7IGlmICghKGsgaW4gbzEpKSB7IGRpZmYucHVzaChrKTsgfSB9XG4gIHJldHVybiBkaWZmO1xufVxuXG4vKipcbiAqIE9wcG9zaXRlIG9mIGFycmF5RGlmZigpLCB0aGlzIHJldHVybnMgb25seSBjb21tb24gZWxlbWVudHMgYmV0d2VlbiBhcnJheXMuXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyMVxuICogQHBhcmFtICB7QXJyYXl9IGFycjJcbiAqIEByZXR1cm4ge0FycmF5fSAgICAgIEFycmF5IG9mIGNvbW1vbiB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U2FtZShhMSwgYTIpIHtcbiAgdmFyIHJldCA9IFtdO1xuICBmb3IgKGkgaW4gYTEpIHtcbiAgICBpZiAoYTIuaW5kZXhPZiggYTFbaV0gKSA+IC0xKXtcbiAgICAgIHJldC5wdXNoKCBhMVtpXSApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgJ2Zyb20nIG9iamVjdCB3aXRoIG1lbWJlcnMgZnJvbSAndG8nLiBJZiAndG8nIGlzIG51bGwsIGEgZGVlcCBjbG9uZSBvZiAnZnJvbScgaXMgcmV0dXJuZWRcbiAqIEBwYXJhbSAgeyp9IGZyb21cbiAqIEBwYXJhbSAgeyp9IHRvXG4gKiBAcmV0dXJuIHsqfSAgICAgIENsb25lZCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChmcm9tLCB0bykge1xuICBpZiAoZnJvbSA9PSBudWxsIHx8IHR5cGVvZiBmcm9tICE9IFwib2JqZWN0XCIpIHJldHVybiBmcm9tO1xuICBpZiAoZnJvbS5jb25zdHJ1Y3RvciAhPSBPYmplY3QgJiYgZnJvbS5jb25zdHJ1Y3RvciAhPSBBcnJheSkgcmV0dXJuIGZyb207XG4gIGlmIChmcm9tLmNvbnN0cnVjdG9yID09IERhdGUgfHwgZnJvbS5jb25zdHJ1Y3RvciA9PSBSZWdFeHAgfHwgZnJvbS5jb25zdHJ1Y3RvciA9PSBGdW5jdGlvbiB8fFxuICAgIGZyb20uY29uc3RydWN0b3IgPT0gU3RyaW5nIHx8IGZyb20uY29uc3RydWN0b3IgPT0gTnVtYmVyIHx8IGZyb20uY29uc3RydWN0b3IgPT0gQm9vbGVhbilcbiAgICByZXR1cm4gbmV3IGZyb20uY29uc3RydWN0b3IoZnJvbSk7XG5cbiAgdG8gPSB0byB8fCBuZXcgZnJvbS5jb25zdHJ1Y3RvcigpO1xuXG4gIGZvciAodmFyIG5hbWUgaW4gZnJvbSkge1xuICAgIHRvW25hbWVdID0gdHlwZW9mIHRvW25hbWVdID09IFwidW5kZWZpbmVkXCIgPyBleHRlbmQoZnJvbVtuYW1lXSwgbnVsbCkgOiB0b1tuYW1lXTtcbiAgfVxuXG4gIHJldHVybiB0bztcbn1cblxuLyoqXG4gKiBDb21wYXJlcyB0d28gb2JqZWN0cywgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHVuaXF1ZSBrZXlzLlxuICogQHBhcmFtICB7T2JqZWN0fSBvMVxuICogQHBhcmFtICB7T2JqZWN0fSBvMlxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIHVuaXF1ZUtleXMobzEsIG8yKSB7XG4gIHJldHVybiBhcnJheURpZmYoZDMua2V5cyhvMSksIGQzLmtleXMobzIpKTtcbn1cblxuLyoqXG4gKiBDb21wYXJlcyB0d28gb2JqZWN0cywgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGNvbW1vbiBrZXlzLlxuICogQHBhcmFtICB7T2JqZWN0fSBvMVxuICogQHBhcmFtICB7T2JqZWN0fSBvMlxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIHNhbWVLZXlzKG8xLCBvMikge1xuICByZXR1cm4gYXJyYXlTYW1lKGQzLmtleXMobzEpLCBkMy5rZXlzKG8yKSk7XG59XG5cbi8qKlxuICogSWYgYSBzdHJpbmcgaXMgdW5kZWZpbmVkLCByZXR1cm4gYW4gZW1wdHkgc3RyaW5nIGluc3RlYWQuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBjbGVhblN0cihzdHIpe1xuICBpZiAoc3RyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ludGVnZXI6IGlzSW50ZWdlcixcbiAgaXNGbG9hdDogaXNGbG9hdCxcbiAgaXNFbXB0eTogaXNFbXB0eSxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgYXJyYXlEaWZmOiBhcnJheURpZmYsXG4gIGFycmF5U2FtZTogYXJyYXlTYW1lLFxuICB1bmlxdWVLZXlzOiB1bmlxdWVLZXlzLFxuICBzYW1lS2V5czogc2FtZUtleXMsXG4gIGNsZWFuU3RyOiBjbGVhblN0clxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvaGVscGVycy9oZWxwZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDaGFydCBjb250cnVjdGlvbiBtYW5hZ2VyIG1vZHVsZS5cbiAqIEBtb2R1bGUgY2hhcnRzL21hbmFnZXJcbiAqL1xuXG4vKipcbiAqIE1hbmFnZXMgdGhlIHN0ZXAtYnktc3RlcCBjcmVhdGlvbiBvZiBhIGNoYXJ0LCBhbmQgcmV0dXJucyB0aGUgZnVsbCBjb25maWd1cmF0aW9uIGZvciB0aGUgY2hhcnQsIGluY2x1ZGluZyByZWZlcmVuY2VzIHRvIG5vZGVzLCBzY2FsZXMsIGF4ZXMsIGV0Yy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb250YWluZXIgU2VsZWN0b3IgZm9yIHRoZSBjb250YWluZXIgdGhlIGNoYXJ0IHdpbGwgYmUgZHJhd24gaW50by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogICAgICAgT2JqZWN0IHRoYXQgY29udGFpbnMgc2V0dGluZ3MgZm9yIHRoZSBjaGFydC5cbiAqL1xuZnVuY3Rpb24gQ2hhcnRNYW5hZ2VyKGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIFJlY2lwZSA9IHJlcXVpcmUoXCIuLi91dGlscy9mYWN0b3J5XCIpLFxuICAgICAgc2V0dGluZ3MgPSByZXF1aXJlKFwiLi4vY29uZmlnL2NoYXJ0LXNldHRpbmdzXCIpLFxuICAgICAgY29tcG9uZW50cyA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvY29tcG9uZW50c1wiKTtcblxuICB2YXIgY2hhcnRSZWNpcGUgPSBuZXcgUmVjaXBlKHNldHRpbmdzLCBvYmopO1xuXG4gIHZhciByZW5kZXJlZCA9IGNoYXJ0UmVjaXBlLnJlbmRlcmVkID0ge307XG5cbiAgLy8gY2hlY2sgdGhhdCBlYWNoIHNlY3Rpb24gaXMgbmVlZGVkXG5cbiAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuaGVhZCkge1xuICAgIHJlbmRlcmVkLmhlYWRlciA9IGNvbXBvbmVudHMuaGVhZGVyKGNvbnRhaW5lciwgY2hhcnRSZWNpcGUpO1xuICB9XG5cbiAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuZm9vdGVyKSB7XG4gICAgcmVuZGVyZWQuZm9vdGVyID0gY29tcG9uZW50cy5mb290ZXIoY29udGFpbmVyLCBjaGFydFJlY2lwZSk7XG4gIH1cblxuICB2YXIgbm9kZSA9IGNvbXBvbmVudHMuYmFzZShjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcblxuICByZW5kZXJlZC5jb250YWluZXIgPSBub2RlO1xuXG4gIHJlbmRlcmVkLnBsb3QgPSBjb21wb25lbnRzLnBsb3Qobm9kZSwgY2hhcnRSZWNpcGUpO1xuXG4gIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLnF1YWxpZmllcikge1xuICAgIHJlbmRlcmVkLnF1YWxpZmllciA9IGNvbXBvbmVudHMucXVhbGlmaWVyKG5vZGUsIGNoYXJ0UmVjaXBlKTtcbiAgfVxuXG4gIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLnRpcHMpIHtcbiAgICByZW5kZXJlZC50aXBzID0gY29tcG9uZW50cy50aXBzKG5vZGUsIGNoYXJ0UmVjaXBlKTtcbiAgfVxuXG4gIGlmICghY2hhcnRSZWNpcGUuZWRpdGFibGUgJiYgIWNoYXJ0UmVjaXBlLmV4cG9ydGFibGUpIHtcbiAgICBpZiAoY2hhcnRSZWNpcGUub3B0aW9ucy5zaGFyZV9kYXRhKSB7XG4gICAgICByZW5kZXJlZC5zaGFyZURhdGEgPSBjb21wb25lbnRzLnNoYXJlRGF0YShjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcbiAgICB9XG4gICAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuc29jaWFsKSB7XG4gICAgICByZW5kZXJlZC5zb2NpYWwgPSBjb21wb25lbnRzLnNvY2lhbChjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcbiAgICB9XG4gIH1cblxuICBpZiAoY2hhcnRSZWNpcGUuQ1VTVE9NKSB7XG4gICAgdmFyIGN1c3RvbSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jdXN0b20vY3VzdG9tLmpzXCIpO1xuICAgIHJlbmRlcmVkLmN1c3RvbSA9IGN1c3RvbShub2RlLCBjaGFydFJlY2lwZSwgcmVuZGVyZWQpO1xuICB9XG5cbiAgcmV0dXJuIGNoYXJ0UmVjaXBlO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0TWFuYWdlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL21hbmFnZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgY29tcG9uZW50cyA9IHtcbiAgYmFzZTogcmVxdWlyZShcIi4vYmFzZVwiKSxcbiAgaGVhZGVyOiByZXF1aXJlKFwiLi9oZWFkZXJcIiksXG4gIGZvb3RlcjogcmVxdWlyZShcIi4vZm9vdGVyXCIpLFxuICBwbG90OiByZXF1aXJlKFwiLi9wbG90XCIpLFxuICBxdWFsaWZpZXI6IHJlcXVpcmUoXCIuL3F1YWxpZmllclwiKSxcbiAgYXhpczogcmVxdWlyZShcIi4vYXhpc1wiKSxcbiAgc2NhbGU6IHJlcXVpcmUoXCIuL3NjYWxlXCIpLFxuICB0aXBzOiByZXF1aXJlKFwiLi90aXBzXCIpLFxuICBzb2NpYWw6IHJlcXVpcmUoXCIuL3NvY2lhbFwiKSxcbiAgc2hhcmVEYXRhOiByZXF1aXJlKFwiLi9zaGFyZS1kYXRhXCIpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvbmVudHM7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2NvbXBvbmVudHMuanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gYXBwZW5kKGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIG1hcmdpbiA9IG9iai5kaW1lbnNpb25zLm1hcmdpbjtcblxuICB2YXIgY2hhcnRCYXNlID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAuaW5zZXJ0KFwic3ZnXCIsIFwiLlwiICsgb2JqLnByZWZpeCArIFwiY2hhcnRfc291cmNlXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmouYmFzZUNsYXNzKCkgKyBcIl9zdmcgXCIgKyBvYmoucHJlZml4ICsgb2JqLmN1c3RvbUNsYXNzICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJ0eXBlX1wiICsgb2JqLm9wdGlvbnMudHlwZSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzLVwiICsgb2JqLmRhdGEuc2VyaWVzQW1vdW50LFxuICAgICAgXCJ3aWR0aFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCxcbiAgICAgIFwiaGVpZ2h0XCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSxcbiAgICAgIFwidmVyc2lvblwiOiAxLjEsXG4gICAgICBcInhtbG5zXCI6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgIH0pO1xuXG4gIC8vIGJhY2tncm91bmQgcmVjdFxuICBjaGFydEJhc2VcbiAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiYmdcIixcbiAgICAgIFwieFwiOiAwLFxuICAgICAgXCJ5XCI6IDAsXG4gICAgICBcIndpZHRoXCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSxcbiAgICAgIFwiaGVpZ2h0XCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCksXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCJcbiAgICB9KTtcblxuICB2YXIgZ3JhcGggPSBjaGFydEJhc2UuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiZ3JhcGhcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIlxuICAgIH0pO1xuXG4gIHJldHVybiBncmFwaDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGVuZDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvYmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBoZWFkZXJDb21wb25lbnQoY29udGFpbmVyLCBvYmopIHtcblxuICB2YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL2hlbHBlcnNcIik7XG5cbiAgdmFyIGhlYWRlckdyb3VwID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiY2hhcnRfdGl0bGUgXCIgKyBvYmoucHJlZml4ICsgb2JqLmN1c3RvbUNsYXNzLCB0cnVlKVxuXG4gIC8vIGhhY2sgbmVjZXNzYXJ5IHRvIGVuc3VyZSBQREYgZmllbGRzIGFyZSBzaXplZCBwcm9wZXJseVxuICBpZiAob2JqLmV4cG9ydGFibGUpIHtcbiAgICBoZWFkZXJHcm91cC5zdHlsZShcIndpZHRoXCIsIG9iai5leHBvcnRhYmxlLndpZHRoICsgXCJweFwiKTtcbiAgfVxuXG4gIGlmIChvYmouaGVhZGluZyAhPT0gXCJcIiB8fCBvYmouZWRpdGFibGUpIHtcbiAgICB2YXIgaGVhZGVyVGV4dCA9IGhlYWRlckdyb3VwXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImNoYXJ0X3RpdGxlLXRleHRcIilcbiAgICAgIC50ZXh0KG9iai5oZWFkaW5nKTtcblxuICAgIGlmIChvYmouZWRpdGFibGUpIHtcbiAgICAgIGhlYWRlclRleHRcbiAgICAgICAgLmF0dHIoXCJjb250ZW50RWRpdGFibGVcIiwgdHJ1ZSlcbiAgICAgICAgLmNsYXNzZWQoXCJlZGl0YWJsZS1jaGFydF90aXRsZVwiLCB0cnVlKTtcbiAgICB9XG5cbiAgfVxuXG4gIHZhciBxdWFsaWZpZXI7XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwiYmFyXCIpIHtcbiAgICBxdWFsaWZpZXIgPSBoZWFkZXJHcm91cFxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBzdHIgPSBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXIgXCIgKyBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXItYmFyXCI7XG4gICAgICAgICAgaWYgKG9iai5lZGl0YWJsZSkge1xuICAgICAgICAgICAgc3RyICs9IFwiIGVkaXRhYmxlLWNoYXJ0X3F1YWxpZmllclwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9LFxuICAgICAgICBcImNvbnRlbnRFZGl0YWJsZVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLmVkaXRhYmxlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnRleHQob2JqLnF1YWxpZmllcik7XG4gIH1cblxuICBpZiAob2JqLmRhdGEua2V5cy5sZW5ndGggPiAyKSB7XG5cbiAgICB2YXIgbGVnZW5kID0gaGVhZGVyR3JvdXAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJjaGFydF9sZWdlbmRcIiwgdHJ1ZSk7XG5cbiAgICB2YXIga2V5cyA9IGhlbHBlcnMuZXh0ZW5kKG9iai5kYXRhLmtleXMpO1xuXG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgZmlyc3QgaXRlbSBhcyBpdCBkb2VzbnQgcmVwcmVzZW50IGEgc2VyaWVzXG4gICAga2V5cy5zaGlmdCgpO1xuXG4gICAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwibXVsdGlsaW5lXCIpIHtcbiAgICAgIGtleXMgPSBba2V5c1swXSwga2V5c1sxXV07XG4gICAgICBsZWdlbmQuY2xhc3NlZChvYmoucHJlZml4ICsgXCJjaGFydF9sZWdlbmQtXCIgKyBvYmoub3B0aW9ucy50eXBlLCB0cnVlKTtcbiAgICB9XG5cbiAgICB2YXIgbGVnZW5kSXRlbSA9IGxlZ2VuZC5zZWxlY3RBbGwoXCJkaXYuXCIgKyBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbVwiKVxuICAgICAgLmRhdGEoa2V5cylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtIFwiICsgb2JqLnByZWZpeCArIFwibGVnZW5kX2l0ZW1fXCIgKyAoaSk7XG4gICAgICB9KTtcblxuICAgIGxlZ2VuZEl0ZW0uYXBwZW5kKFwic3BhblwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbV9pY29uXCIpO1xuXG4gICAgbGVnZW5kSXRlbS5hcHBlbmQoXCJzcGFuXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtX3RleHRcIilcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMuaGVhZGVySGVpZ2h0ID0gaGVhZGVyR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICByZXR1cm4ge1xuICAgIGhlYWRlckdyb3VwOiBoZWFkZXJHcm91cCxcbiAgICBsZWdlbmQ6IGxlZ2VuZCxcbiAgICBxdWFsaWZpZXI6IHF1YWxpZmllclxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGVhZGVyQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9oZWFkZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gZm9vdGVyQ29tcG9uZW50KGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIGZvb3Rlckdyb3VwO1xuXG4gIGlmIChvYmouc291cmNlICE9PSBcIlwiIHx8IG9iai5lZGl0YWJsZSkge1xuICAgIGZvb3Rlckdyb3VwID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImNoYXJ0X3NvdXJjZVwiLCB0cnVlKTtcblxuICAgIC8vIGhhY2sgbmVjZXNzYXJ5IHRvIGVuc3VyZSBQREYgZmllbGRzIGFyZSBzaXplZCBwcm9wZXJseVxuICAgIGlmIChvYmouZXhwb3J0YWJsZSkge1xuICAgICAgZm9vdGVyR3JvdXAuc3R5bGUoXCJ3aWR0aFwiLCBvYmouZXhwb3J0YWJsZS53aWR0aCArIFwicHhcIik7XG4gICAgfVxuXG4gICAgdmFyIGZvb3RlclRleHQgPSBmb290ZXJHcm91cC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiY2hhcnRfc291cmNlLXRleHRcIilcbiAgICAgIC50ZXh0KG9iai5zb3VyY2UpO1xuXG4gICAgaWYgKG9iai5lZGl0YWJsZSkge1xuICAgICAgZm9vdGVyVGV4dFxuICAgICAgICAuYXR0cihcImNvbnRlbnRFZGl0YWJsZVwiLCB0cnVlKVxuICAgICAgICAuY2xhc3NlZChcImVkaXRhYmxlLWNoYXJ0X3NvdXJjZVwiLCB0cnVlKTtcbiAgICB9XG5cbiAgICBvYmouZGltZW5zaW9ucy5mb290ZXJIZWlnaHQgPSBmb290ZXJHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZvb3Rlckdyb3VwOiBmb290ZXJHcm91cFxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vdGVyQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9mb290ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gcGxvdChub2RlLCBvYmopIHtcblxuICB2YXIgZHJhdyA9IHtcbiAgICBsaW5lOiByZXF1aXJlKFwiLi4vdHlwZXMvbGluZVwiKSxcbiAgICBtdWx0aWxpbmU6IHJlcXVpcmUoXCIuLi90eXBlcy9tdWx0aWxpbmVcIiksXG4gICAgYXJlYTogcmVxdWlyZShcIi4uL3R5cGVzL2FyZWFcIiksXG4gICAgc3RhY2tlZEFyZWE6IHJlcXVpcmUoXCIuLi90eXBlcy9zdGFja2VkLWFyZWFcIiksXG4gICAgY29sdW1uOiByZXF1aXJlKFwiLi4vdHlwZXMvY29sdW1uXCIpLFxuICAgIGJhcjogcmVxdWlyZShcIi4uL3R5cGVzL2JhclwiKSxcbiAgICBzdGFja2VkQ29sdW1uOiByZXF1aXJlKFwiLi4vdHlwZXMvc3RhY2tlZC1jb2x1bW5cIiksXG4gICAgc3RyZWFtZ3JhcGg6IHJlcXVpcmUoXCIuLi90eXBlcy9zdHJlYW1ncmFwaFwiKVxuICB9O1xuXG4gIHZhciBjaGFydFJlZjtcblxuICBzd2l0Y2gob2JqLm9wdGlvbnMudHlwZSkge1xuXG4gICAgY2FzZSBcImxpbmVcIjpcbiAgICAgIGNoYXJ0UmVmID0gZHJhdy5saW5lKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJtdWx0aWxpbmVcIjpcbiAgICAgIGNoYXJ0UmVmID0gZHJhdy5tdWx0aWxpbmUobm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcImFyZWFcIjpcbiAgICAgIGNoYXJ0UmVmID0gb2JqLm9wdGlvbnMuc3RhY2tlZCA/IGRyYXcuc3RhY2tlZEFyZWEobm9kZSwgb2JqKSA6IGRyYXcuYXJlYShub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiYmFyXCI6XG4gICAgICBjaGFydFJlZiA9IGRyYXcuYmFyKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJjb2x1bW5cIjpcbiAgICAgIGNoYXJ0UmVmID0gb2JqLm9wdGlvbnMuc3RhY2tlZCA/IGRyYXcuc3RhY2tlZENvbHVtbihub2RlLCBvYmopIDogZHJhdy5jb2x1bW4obm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcInN0cmVhbVwiOlxuICAgICAgY2hhcnRSZWYgPSBkcmF3LnN0cmVhbWdyYXBoKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBjaGFydFJlZiA9IGRyYXcubGluZShub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gY2hhcnRSZWY7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwbG90O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9wbG90LmpzXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIExpbmVDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPT09IDEpIHsgb2JqLnNlcmllc0hpZ2hsaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfSB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pO1xuXG4gIC8vIFNlY29uZGFyeSBhcnJheSBpcyB1c2VkIHRvIHN0b3JlIGEgcmVmZXJlbmNlIHRvIGFsbCBzZXJpZXMgZXhjZXB0IGZvciB0aGUgaGlnaGxpZ2h0ZWQgaXRlbVxuICB2YXIgc2Vjb25kYXJ5QXJyID0gW107XG5cbiAgZm9yICh2YXIgaSA9IG9iai5kYXRhLnNlcmllc0Ftb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgLy8gRG9udCB3YW50IHRvIGluY2x1ZGUgdGhlIGhpZ2hsaWdodGVkIGl0ZW0gaW4gdGhlIGxvb3BcbiAgICAvLyBiZWNhdXNlIHdlIGFsd2F5cyB3YW50IGl0IHRvIHNpdCBhYm92ZSBhbGwgdGhlIG90aGVyIGxpbmVzXG5cbiAgICBpZiAoaSAhPT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG5cbiAgICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgICAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbaV0udmFsKTsgfSlcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW2ldLnZhbCk7IH0pO1xuXG4gICAgICB2YXIgcGF0aFJlZiA9IHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogbGluZSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlY29uZGFyeUFyci5wdXNoKHBhdGhSZWYpO1xuICAgIH1cblxuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgc2Vjb25kYXJ5IHNlcmllcyAoYWxsIHNlcmllcyBleGNlcHQgdGhlIGhpZ2hsaWdodGVkIG9uZSlcbiAgLy8gYW5kIHNldCB0aGUgY29sb3VycyBpbiB0aGUgY29ycmVjdCBvcmRlclxuXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBzZWNvbmRhcnlBcnIucmV2ZXJzZSgpO1xuXG4gIHZhciBoTGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSk7XG5cbiAgc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgIC5hdHRyKHtcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAob2JqLnNlcmllc0hpZ2hsaWdodCgpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9LFxuICAgICAgXCJkXCI6IGhMaW5lXG4gICAgfSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgaExpbmU6IGhMaW5lLFxuICAgIGxpbmU6IGxpbmVcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaW5lQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9saW5lLmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIEF4aXNGYWN0b3J5KGF4aXNPYmosIHNjYWxlKSB7XG5cbiAgdmFyIGF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgLnNjYWxlKHNjYWxlKVxuICAgIC5vcmllbnQoYXhpc09iai5vcmllbnQpO1xuXG4gIHJldHVybiBheGlzO1xuXG59XG5cbmZ1bmN0aW9uIGF4aXNNYW5hZ2VyKG5vZGUsIG9iaiwgc2NhbGUsIGF4aXNUeXBlKSB7XG5cbiAgdmFyIGF4aXNPYmogPSBvYmpbYXhpc1R5cGVdO1xuICB2YXIgYXhpcyA9IG5ldyBBeGlzRmFjdG9yeShheGlzT2JqLCBzY2FsZSk7XG5cbiAgdmFyIHByZXZBeGlzID0gbm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwXCIgKyBcIi5cIiArIG9iai5wcmVmaXggKyBheGlzVHlwZSkubm9kZSgpO1xuXG4gIGlmIChwcmV2QXhpcyAhPT0gbnVsbCkgeyBkMy5zZWxlY3QocHJldkF4aXMpLnJlbW92ZSgpOyB9XG5cbiAgdmFyIGF4aXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cFwiICsgXCIgXCIgKyBvYmoucHJlZml4ICsgYXhpc1R5cGUpO1xuXG4gIGlmIChheGlzVHlwZSA9PT0gXCJ4QXhpc1wiKSB7XG4gICAgYXBwZW5kWEF4aXMoYXhpc0dyb3VwLCBvYmosIHNjYWxlLCBheGlzLCBheGlzVHlwZSk7XG4gIH0gZWxzZSBpZiAoYXhpc1R5cGUgPT09IFwieUF4aXNcIikge1xuICAgIGFwcGVuZFlBeGlzKGF4aXNHcm91cCwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1R5cGUpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBub2RlOiBheGlzR3JvdXAsXG4gICAgYXhpczogYXhpc1xuICB9O1xuXG59XG5cbmZ1bmN0aW9uIGRldGVybWluZUZvcm1hdChjb250ZXh0KSB7XG5cbiAgc3dpdGNoIChjb250ZXh0KSB7XG4gICAgY2FzZSBcInllYXJzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVZXCIpO1xuICAgIGNhc2UgXCJtb250aHNcIjogcmV0dXJuIGQzLnRpbWUuZm9ybWF0KFwiJWJcIik7XG4gICAgY2FzZSBcIndlZWtzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVXXCIpO1xuICAgIGNhc2UgXCJkYXlzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVqXCIpO1xuICAgIGNhc2UgXCJob3Vyc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlSFwiKTtcbiAgICBjYXNlIFwibWludXRlc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlTVwiKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFhBeGlzKGF4aXNHcm91cCwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc05hbWUpIHtcblxuICB2YXIgYXhpc09iaiA9IG9ialtheGlzTmFtZV0sXG4gICAgICBheGlzU2V0dGluZ3M7XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLnhfYXhpcykge1xuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9oZWxwZXJzXCIpLmV4dGVuZDtcbiAgICBheGlzU2V0dGluZ3MgPSBleHRlbmQoYXhpc09iaiwgb2JqLmV4cG9ydGFibGUueF9heGlzKTtcbiAgfSBlbHNlIHtcbiAgICBheGlzU2V0dGluZ3MgPSBheGlzT2JqO1xuICB9XG5cbiAgYXhpc0dyb3VwXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KCkgKyBcIilcIik7XG5cbiAgdmFyIGF4aXNOb2RlID0gYXhpc0dyb3VwLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcIngtYXhpc1wiKTtcblxuICBzd2l0Y2goYXhpc09iai5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgICB0aW1lQXhpcyhheGlzTm9kZSwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgICBkaXNjcmV0ZUF4aXMoYXhpc05vZGUsIHNjYWxlLCBheGlzLCBheGlzU2V0dGluZ3MsIG9iai5kaW1lbnNpb25zKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcbiAgICAgIG9yZGluYWxUaW1lQXhpcyhheGlzTm9kZSwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQgPSBheGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodDtcblxufVxuXG5mdW5jdGlvbiBhcHBlbmRZQXhpcyhheGlzR3JvdXAsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNOYW1lKSB7XG5cbiAgYXhpc0dyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKTtcblxuICB2YXIgYXhpc05vZGUgPSBheGlzR3JvdXAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwieS1heGlzXCIpO1xuXG4gIGRyYXdZQXhpcyhvYmosIGF4aXMsIGF4aXNOb2RlKTtcblxufVxuXG5mdW5jdGlvbiBkcmF3WUF4aXMob2JqLCBheGlzLCBheGlzTm9kZSkge1xuXG4gIHZhciBheGlzU2V0dGluZ3M7XG5cbiAgdmFyIGF4aXNPYmogPSBvYmpbXCJ5QXhpc1wiXTtcblxuICBpZiAob2JqLmV4cG9ydGFibGUgJiYgb2JqLmV4cG9ydGFibGUueV9heGlzKSB7XG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL2hlbHBlcnNcIikuZXh0ZW5kO1xuICAgIGF4aXNTZXR0aW5ncyA9IGV4dGVuZChheGlzT2JqLCBvYmouZXhwb3J0YWJsZS55X2F4aXMpO1xuICB9IGVsc2Uge1xuICAgIGF4aXNTZXR0aW5ncyA9IGF4aXNPYmo7XG4gIH1cblxuICBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCA9IGF4aXNTZXR0aW5ncy5wYWRkaW5nUmlnaHQ7XG5cbiAgYXhpcy5zY2FsZSgpLnJhbmdlKFtvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpLCAwXSk7XG5cbiAgYXhpcy50aWNrVmFsdWVzKHRpY2tGaW5kZXJZKGF4aXMuc2NhbGUoKSwgYXhpc09iai50aWNrcywgYXhpc1NldHRpbmdzKSk7XG5cbiAgYXhpc05vZGUuY2FsbChheGlzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJnXCIpXG4gICAgLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm1pbm9yXCIsIHRydWUpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrIHRleHRcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpXG4gICAgLmNhbGwodXBkYXRlVGV4dFksIGF4aXNOb2RlLCBvYmosIGF4aXMsIGF4aXNPYmopXG4gICAgLmNhbGwocmVwb3NpdGlvblRleHRZLCBvYmouZGltZW5zaW9ucywgYXhpc09iai50ZXh0WCk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2sgbGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieDFcIjogb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgXCJ4MlwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKClcbiAgICB9KTtcblxufVxuXG5mdW5jdGlvbiB0aW1lQXhpcyhheGlzTm9kZSwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzKSB7XG5cbiAgdmFyIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmLFxuICAgICAgZG9tYWluID0gc2NhbGUuZG9tYWluKCksXG4gICAgICBjdHggPSB0aW1lRGlmZihkb21haW5bMF0sIGRvbWFpblsxXSwgMyksXG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZGV0ZXJtaW5lRm9ybWF0KGN0eCk7XG5cbiAgYXhpcy50aWNrRm9ybWF0KGN1cnJlbnRGb3JtYXQpO1xuXG4gIHZhciB0aWNrcztcblxuICB2YXIgdGlja0dvYWw7XG4gIGlmIChheGlzU2V0dGluZ3MudGlja3MgPT09ICdhdXRvJykge1xuICAgIHRpY2tHb2FsID0gYXhpc1NldHRpbmdzLnRpY2tUYXJnZXQ7XG4gIH0gZWxzZSB7XG4gICAgdGlja0dvYWwgPSBheGlzU2V0dGluZ3MudGlja3M7XG4gIH1cblxuICBpZiAob2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgPiBheGlzU2V0dGluZ3Mud2lkdGhUaHJlc2hvbGQpIHtcbiAgICB0aWNrcyA9IHRpY2tGaW5kZXJYKGRvbWFpbiwgY3R4LCB0aWNrR29hbCk7XG4gIH0gZWxzZSB7XG4gICAgdGlja3MgPSB0aWNrRmluZGVyWChkb21haW4sIGN0eCwgYXhpc1NldHRpbmdzLnRpY2tzU21hbGwpO1xuICB9XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgIT09IFwiY29sdW1uXCIpIHtcbiAgICBheGlzLnRpY2tWYWx1ZXModGlja3MpO1xuICB9IGVsc2Uge1xuICAgIGF4aXMudGlja3MoKTtcbiAgfVxuXG4gIGF4aXNOb2RlLmNhbGwoYXhpcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieFwiOiBheGlzU2V0dGluZ3MudXBwZXIudGV4dFgsXG4gICAgICBcInlcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRleHRZLFxuICAgICAgXCJkeVwiOiBheGlzU2V0dGluZ3MuZHkgKyBcImVtXCJcbiAgICB9KVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAuY2FsbChzZXRUaWNrRm9ybWF0WCwgY3R4LCBheGlzU2V0dGluZ3MuZW1zLCBvYmoubW9udGhzQWJyKTtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSA9PT0gXCJjb2x1bW5cIikgeyBkcm9wUmVkdW5kYW50VGlja3MoYXhpc05vZGUsIGN0eCk7IH1cblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKVxuICAgIC5jYWxsKGRyb3BUaWNrcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKFwieTJcIiwgYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQpO1xuXG59XG5cbmZ1bmN0aW9uIGRpc2NyZXRlQXhpcyhheGlzTm9kZSwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncywgZGltZW5zaW9ucykge1xuXG4gIHZhciB3cmFwVGV4dCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS53cmFwVGV4dDtcblxuICBheGlzLnRpY2tQYWRkaW5nKDApO1xuXG4gIHNjYWxlLnJhbmdlRXh0ZW50KFswLCBkaW1lbnNpb25zLnRpY2tXaWR0aCgpXSk7XG5cbiAgc2NhbGUucmFuZ2VSb3VuZEJhbmRzKFswLCBkaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgZGltZW5zaW9ucy5iYW5kcy5wYWRkaW5nLCBkaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZyk7XG5cbiAgdmFyIGJhbmRTdGVwID0gc2NhbGUucmFuZ2VCYW5kKCk7XG5cbiAgYXhpc05vZGUuY2FsbChheGlzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAuYXR0cihcImR5XCIsIGF4aXNTZXR0aW5ncy5keSArIFwiZW1cIilcbiAgICAuY2FsbCh3cmFwVGV4dCwgYmFuZFN0ZXApO1xuXG4gIHZhciBmaXJzdFhQb3MgPSBkMy50cmFuc2Zvcm0oYXhpc05vZGUuc2VsZWN0KFwiLnRpY2tcIikuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdICogLTE7XG5cbiAgdmFyIHhQb3MgPSAoLSAoYmFuZFN0ZXAgLyAyKSAtIChiYW5kU3RlcCAqIGRpbWVuc2lvbnMuYmFuZHMub3V0ZXJQYWRkaW5nKSk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieDFcIjogeFBvcyxcbiAgICAgIFwieDJcIjogeFBvc1xuICAgIH0pO1xuXG4gIGF4aXNOb2RlLnNlbGVjdChcImxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICBcIngxXCI6IGZpcnN0WFBvcyxcbiAgICAgIFwieDJcIjogZmlyc3RYUG9zXG4gICAgfSk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKFwieTJcIiwgYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQpO1xuXG4gIHZhciBsYXN0VGljayA9IGF4aXNOb2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IFwidGlja1wiLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAoZGltZW5zaW9ucy50aWNrV2lkdGgoKSArIChiYW5kU3RlcCAvIDIpICsgYmFuZFN0ZXAgKiBkaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZykgKyBcIiwwKVwiXG4gICAgfSk7XG5cbiAgbGFzdFRpY2suYXBwZW5kKFwibGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieTJcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQsXG4gICAgICBcIngxXCI6IHhQb3MsXG4gICAgICBcIngyXCI6IHhQb3NcbiAgICB9KTtcblxufVxuXG5mdW5jdGlvbiBvcmRpbmFsVGltZUF4aXMoYXhpc05vZGUsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncykge1xuXG4gIHZhciB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGRvbWFpbiA9IHNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCAzKSxcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkZXRlcm1pbmVGb3JtYXQoY3R4KTtcblxuICBheGlzLnRpY2tGb3JtYXQoY3VycmVudEZvcm1hdCk7XG5cbiAgYXhpc05vZGUuY2FsbChheGlzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ4XCI6IGF4aXNTZXR0aW5ncy51cHBlci50ZXh0WCxcbiAgICAgIFwieVwiOiBheGlzU2V0dGluZ3MudXBwZXIudGV4dFksXG4gICAgICBcImR5XCI6IGF4aXNTZXR0aW5ncy5keSArIFwiZW1cIlxuICAgIH0pXG4gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJzdGFydFwiKVxuICAgIC5jYWxsKHNldFRpY2tGb3JtYXRYLCBjdHgsIGF4aXNTZXR0aW5ncy5lbXMsIG9iai5tb250aHNBYnIpO1xuXG4gIGlmIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgPiBvYmoueEF4aXMud2lkdGhUaHJlc2hvbGQpIHtcbiAgICB2YXIgb3JkaW5hbFRpY2tQYWRkaW5nID0gNztcbiAgfSBlbHNlIHtcbiAgICB2YXIgb3JkaW5hbFRpY2tQYWRkaW5nID0gNDtcbiAgfVxuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpXG4gICAgLmNhbGwob3JkaW5hbFRpbWVUaWNrcywgYXhpc05vZGUsIGN0eCwgc2NhbGUsIG9yZGluYWxUaWNrUGFkZGluZyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKFwieTJcIiwgYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQpO1xuXG59XG5cbi8vIHRleHQgZm9ybWF0dGluZyBmdW5jdGlvbnNcblxuZnVuY3Rpb24gc2V0VGlja0Zvcm1hdFgoc2VsZWN0aW9uLCBjdHgsIGVtcywgbW9udGhzQWJyKSB7XG5cbiAgdmFyIHByZXZZZWFyLFxuICAgICAgcHJldk1vbnRoLFxuICAgICAgcHJldkRhdGUsXG4gICAgICBkWWVhcixcbiAgICAgIGRNb250aCxcbiAgICAgIGREYXRlLFxuICAgICAgZEhvdXIsXG4gICAgICBkTWludXRlO1xuXG4gIHNlbGVjdGlvbi50ZXh0KGZ1bmN0aW9uKGQpIHtcblxuICAgIHZhciBub2RlID0gZDMuc2VsZWN0KHRoaXMpO1xuXG4gICAgdmFyIGRTdHI7XG5cbiAgICBzd2l0Y2ggKGN0eCkge1xuICAgICAgY2FzZSBcInllYXJzXCI6XG4gICAgICAgIGRTdHIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuXG4gICAgICAgIGRNb250aCA9IG1vbnRoc0FicltkLmdldE1vbnRoKCldO1xuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICBpZiAoZFllYXIgIT09IHByZXZZZWFyKSB7XG4gICAgICAgICAgbmV3VGV4dE5vZGUobm9kZSwgZFllYXIsIGVtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBkU3RyID0gZE1vbnRoO1xuXG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwid2Vla3NcIjpcbiAgICAgIGNhc2UgXCJkYXlzXCI6XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkTW9udGggPSBtb250aHNBYnJbZC5nZXRNb250aCgpXTtcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcblxuICAgICAgICBpZiAoZE1vbnRoICE9PSBwcmV2TW9udGgpIHtcbiAgICAgICAgICBkU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkU3RyID0gZERhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZFllYXIgIT09IHByZXZZZWFyKSB7XG4gICAgICAgICAgbmV3VGV4dE5vZGUobm9kZSwgZFllYXIsIGVtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2TW9udGggPSBkTW9udGg7XG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJob3Vyc1wiOlxuICAgICAgICBkTW9udGggPSBtb250aHNBYnJbZC5nZXRNb250aCgpXTtcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgZEhvdXIgPSBkLmdldEhvdXJzKCk7XG4gICAgICAgIGRNaW51dGUgPSBkLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICB2YXIgZEhvdXJTdHIsXG4gICAgICAgICAgICBkTWludXRlU3RyO1xuXG4gICAgICAgIC8vIENvbnZlcnQgZnJvbSAyNGggdGltZVxuICAgICAgICB2YXIgc3VmZml4ID0gKGRIb3VyID49IDEyKSA/ICdwLm0uJyA6ICdhLm0uJztcbiAgICAgICAgaWYgKGRIb3VyID09PSAwKSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSAxMjtcbiAgICAgICAgfSBlbHNlIGlmIChkSG91ciA+IDEyKSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSBkSG91ciAtIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRIb3VyU3RyID0gZEhvdXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIG1pbnV0ZXMgZm9sbG93IEdsb2JlIHN0eWxlXG4gICAgICAgIGlmIChkTWludXRlID09PSAwKSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICcnO1xuICAgICAgICB9IGVsc2UgaWYgKGRNaW51dGUgPCAxMCkge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnOjAnICsgZE1pbnV0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJzonICsgZE1pbnV0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRTdHIgPSBkSG91clN0ciArIGRNaW51dGVTdHIgKyAnICcgKyBzdWZmaXg7XG5cbiAgICAgICAgaWYgKGREYXRlICE9PSBwcmV2RGF0ZSkge1xuICAgICAgICAgIHZhciBkYXRlU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZTtcbiAgICAgICAgICBuZXdUZXh0Tm9kZShub2RlLCBkYXRlU3RyLCBlbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcblxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRTdHIgPSBkO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZFN0cjtcblxuICB9KTtcblxufVxuXG5mdW5jdGlvbiBzZXRUaWNrRm9ybWF0WShmb3JtYXQsIGQsIGxhc3RUaWNrKSB7XG4gIC8vIGNoZWNraW5nIGZvciBhIGZvcm1hdCBhbmQgZm9ybWF0dGluZyB5LWF4aXMgdmFsdWVzIGFjY29yZGluZ2x5XG5cbiAgdmFyIGlzRmxvYXQgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9oZWxwZXJzXCIpLmlzRmxvYXQ7XG5cbiAgdmFyIGN1cnJlbnRGb3JtYXQ7XG5cbiAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICBjYXNlIFwiZ2VuZXJhbFwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcImdcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic2lcIjpcbiAgICAgIHZhciBwcmVmaXggPSBkMy5mb3JtYXRQcmVmaXgobGFzdFRpY2spLFxuICAgICAgICAgIGZvcm1hdCA9IGQzLmZvcm1hdChcIi4xZlwiKTtcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBmb3JtYXQocHJlZml4LnNjYWxlKGQpKSArIHByZWZpeC5zeW1ib2w7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiY29tbWFcIjpcbiAgICAgIGlmIChpc0Zsb2F0KHBhcnNlRmxvYXQoZCkpKSB7XG4gICAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjJmXCIpKGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIixnXCIpKGQpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInJvdW5kMVwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIiwuMWZcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicm91bmQyXCI6XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLC4yZlwiKShkKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyb3VuZDNcIjpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjNmXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInJvdW5kNFwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIiwuNGZcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIixnXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gY3VycmVudEZvcm1hdDtcblxufVxuXG5mdW5jdGlvbiB1cGRhdGVUZXh0WCh0ZXh0Tm9kZXMsIGF4aXNOb2RlLCBvYmosIGF4aXMsIGF4aXNPYmopIHtcblxuICB2YXIgbGFzdFRpY2sgPSBheGlzLnRpY2tWYWx1ZXMoKVtheGlzLnRpY2tWYWx1ZXMoKS5sZW5ndGggLSAxXTtcblxuICB0ZXh0Tm9kZXNcbiAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG4gICAgICB2YXIgdmFsID0gc2V0VGlja0Zvcm1hdFkoYXhpc09iai5mb3JtYXQsIGQsIGxhc3RUaWNrKTtcbiAgICAgIGlmIChpID09PSBheGlzLnRpY2tWYWx1ZXMoKS5sZW5ndGggLSAxKSB7XG4gICAgICAgIHZhbCA9IChheGlzT2JqLnByZWZpeCB8fCBcIlwiKSArIHZhbCArIChheGlzT2JqLnN1ZmZpeCB8fCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gdXBkYXRlVGV4dFkodGV4dE5vZGVzLCBheGlzTm9kZSwgb2JqLCBheGlzLCBheGlzT2JqKSB7XG5cbiAgdmFyIGFyciA9IFtdLFxuICAgICAgbGFzdFRpY2sgPSBheGlzLnRpY2tWYWx1ZXMoKVtheGlzLnRpY2tWYWx1ZXMoKS5sZW5ndGggLSAxXTtcblxuICB0ZXh0Tm9kZXNcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpXG4gICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIHZhbCA9IHNldFRpY2tGb3JtYXRZKGF4aXNPYmouZm9ybWF0LCBkLCBsYXN0VGljayk7XG4gICAgICBpZiAoaSA9PT0gYXhpcy50aWNrVmFsdWVzKCkubGVuZ3RoIC0gMSkge1xuICAgICAgICB2YWwgPSAoYXhpc09iai5wcmVmaXggfHwgXCJcIikgKyB2YWwgKyAoYXhpc09iai5zdWZmaXggfHwgXCJcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0pXG4gICAgLnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgdmFyIHRleHRDaGFyID0gc2VsLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgIGFyci5wdXNoKHRleHRDaGFyKTtcbiAgICAgIHJldHVybiBzZWwudGV4dCgpO1xuICAgIH0pXG4gICAgLmF0dHIoe1xuICAgICAgXCJkeVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGF4aXNPYmouZHkgIT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gYXhpc09iai5keSArIFwiZW1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJkeVwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwieFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGF4aXNPYmoudGV4dFggIT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gYXhpc09iai50ZXh0WDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ4XCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoYXhpc09iai50ZXh0WSAhPT0gXCJcIikge1xuICAgICAgICAgIHJldHVybiBheGlzT2JqLnRleHRZO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcykuYXR0cihcInlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoID0gZDMubWF4KGFycik7XG5cbn1cblxuZnVuY3Rpb24gcmVwb3NpdGlvblRleHRZKHRleHQsIGRpbWVuc2lvbnMsIHRleHRYKSB7XG4gIHRleHQuYXR0cih7XG4gICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAoZGltZW5zaW9ucy5sYWJlbFdpZHRoIC0gdGV4dFgpICsgXCIsMClcIixcbiAgICBcInhcIjogMFxuICB9KTtcbn1cblxuLy8gQ2xvbmVzIGN1cnJlbnQgdGV4dCBzZWxlY3Rpb24gYW5kIGFwcGVuZHNcbi8vIGEgbmV3IHRleHQgbm9kZSBiZWxvdyB0aGUgc2VsZWN0aW9uXG5mdW5jdGlvbiBuZXdUZXh0Tm9kZShzZWxlY3Rpb24sIHRleHQsIGVtcykge1xuXG4gIHZhciBub2RlTmFtZSA9IHNlbGVjdGlvbi5wcm9wZXJ0eShcIm5vZGVOYW1lXCIpLFxuICAgICAgcGFyZW50ID0gZDMuc2VsZWN0KHNlbGVjdGlvbi5ub2RlKCkucGFyZW50Tm9kZSksXG4gICAgICBsaW5lSGVpZ2h0ID0gZW1zIHx8IDEuNiwgLy8gZW1zXG4gICAgICBkeSA9IHBhcnNlRmxvYXQoc2VsZWN0aW9uLmF0dHIoXCJkeVwiKSksXG4gICAgICB4ID0gcGFyc2VGbG9hdChzZWxlY3Rpb24uYXR0cihcInhcIikpLFxuXG4gICAgICBjbG9uZWQgPSBwYXJlbnQuYXBwZW5kKG5vZGVOYW1lKVxuICAgICAgICAuYXR0cihcImR5XCIsIGxpbmVIZWlnaHQgKyBkeSArIFwiZW1cIilcbiAgICAgICAgLmF0dHIoXCJ4XCIsIHgpXG4gICAgICAgIC50ZXh0KGZ1bmN0aW9uKCkgeyByZXR1cm4gdGV4dDsgfSk7XG5cbiAgcmV0dXJuIGNsb25lZDtcblxufVxuXG4vLyB0aWNrIGRyb3BwaW5nIGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBkcm9wVGlja3Moc2VsZWN0aW9uLCBvcHRzKSB7XG5cbiAgdmFyIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gIHZhciB0b2xlcmFuY2UgPSBvcHRzLnRvbGVyYW5jZSB8fCAwLFxuICAgICAgZnJvbSA9IG9wdHMuZnJvbSB8fCAwLFxuICAgICAgdG8gPSBvcHRzLnRvIHx8IHNlbGVjdGlvblswXS5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaiA9IGZyb207IGogPCB0bzsgaisrKSB7XG5cbiAgICB2YXIgYyA9IHNlbGVjdGlvblswXVtqXSwgLy8gY3VycmVudCBzZWxlY3Rpb25cbiAgICAgICAgbiA9IHNlbGVjdGlvblswXVtqICsgMV07IC8vIG5leHQgc2VsZWN0aW9uXG5cbiAgICBpZiAoIWMgfHwgIW4gfHwgIWMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHx8ICFuLmdldEJvdW5kaW5nQ2xpZW50UmVjdCkgeyBjb250aW51ZTsgfVxuXG4gICAgd2hpbGUgKChjLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0ICsgdG9sZXJhbmNlKSA+IG4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkge1xuXG4gICAgICBpZiAoZDMuc2VsZWN0KG4pLmRhdGEoKVswXSA9PT0gc2VsZWN0aW9uLmRhdGEoKVt0b10pIHtcbiAgICAgICAgZDMuc2VsZWN0KGMpLnJlbW92ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZDMuc2VsZWN0KG4pLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBqKys7XG5cbiAgICAgIG4gPSBzZWxlY3Rpb25bMF1baiArIDFdO1xuXG4gICAgICBpZiAoIW4pIHsgYnJlYWs7IH1cblxuICAgIH1cblxuICB9XG5cbn1cblxuZnVuY3Rpb24gZHJvcFJlZHVuZGFudFRpY2tzKHNlbGVjdGlvbiwgY3R4KSB7XG5cbiAgdmFyIHRpY2tzID0gc2VsZWN0aW9uLnNlbGVjdEFsbChcIi50aWNrXCIpO1xuXG4gIHZhciBwcmV2WWVhciwgcHJldk1vbnRoLCBwcmV2RGF0ZSwgcHJldkhvdXIsIHByZXZNaW51dGUsIGRZZWFyLCBkTW9udGgsIGREYXRlLCBkSG91ciwgZE1pbnV0ZTtcblxuICB0aWNrcy5lYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICBzd2l0Y2ggKGN0eCkge1xuICAgICAgY2FzZSBcInllYXJzXCI6XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBpZiAoZFllYXIgPT09IHByZXZZZWFyKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZE1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICBpZiAoKGRNb250aCA9PT0gcHJldk1vbnRoKSAmJiAoZFllYXIgPT09IHByZXZZZWFyKSkge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2TW9udGggPSBkTW9udGg7XG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIndlZWtzXCI6XG4gICAgICBjYXNlIFwiZGF5c1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZE1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuXG4gICAgICAgIGlmICgoZERhdGUgPT09IHByZXZEYXRlKSAmJiAoZE1vbnRoID09PSBwcmV2TW9udGgpICYmIChkWWVhciA9PT0gcHJldlllYXIpKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcbiAgICAgICAgcHJldk1vbnRoID0gZE1vbnRoO1xuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJob3Vyc1wiOlxuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICBkSG91ciA9IGQuZ2V0SG91cnMoKTtcbiAgICAgICAgZE1pbnV0ZSA9IGQuZ2V0TWludXRlcygpO1xuXG4gICAgICAgIGlmICgoZERhdGUgPT09IHByZXZEYXRlKSAmJiAoZEhvdXIgPT09IHByZXZIb3VyKSAmJiAoZE1pbnV0ZSA9PT0gcHJldk1pbnV0ZSkpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2RGF0ZSA9IGREYXRlO1xuICAgICAgICBwcmV2SG91ciA9IGRIb3VyO1xuICAgICAgICBwcmV2TWludXRlID0gZE1pbnV0ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcblxufVxuXG5mdW5jdGlvbiBkcm9wT3ZlcnNldFRpY2tzKGF4aXNOb2RlLCB0aWNrV2lkdGgpIHtcblxuICB2YXIgYXhpc0dyb3VwV2lkdGggPSBheGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoLFxuICAgICAgdGlja0FyciA9IGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpWzBdO1xuXG4gIGlmICh0aWNrQXJyLmxlbmd0aCkge1xuXG4gICAgdmFyIGZpcnN0VGlja09mZnNldCA9IGQzLnRyYW5zZm9ybShkMy5zZWxlY3QodGlja0FyclswXSlcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMF07XG5cbiAgICB2YXIgbGFzdFRpY2sgPSB0aWNrQXJyW3RpY2tBcnIubGVuZ3RoIC0gMV07XG4gICAgZDMuc2VsZWN0KGxhc3RUaWNrKS5jbGFzc2VkKFwibGFzdC10aWNrLWhpZGVcIiwgZmFsc2UpO1xuXG4gICAgaWYgKChheGlzR3JvdXBXaWR0aCArIGZpcnN0VGlja09mZnNldCkgPj0gdGlja1dpZHRoKSB7XG4gICAgICBkMy5zZWxlY3QobGFzdFRpY2spLmNsYXNzZWQoXCJsYXN0LXRpY2staGlkZVwiLCB0cnVlKTtcbiAgICAgIGF4aXNHcm91cFdpZHRoID0gYXhpc05vZGUubm9kZSgpLmdldEJCb3goKS53aWR0aDtcbiAgICAgIHRpY2tBcnIgPSBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKVswXTtcbiAgICB9XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHRpY2tGaW5kZXJYKGRvbWFpbiwgcGVyaW9kLCB0aWNrR29hbCkge1xuXG4gIC8vIHNldCByYW5nZXNcbiAgdmFyIHN0YXJ0RGF0ZSA9IGRvbWFpblswXSxcbiAgICAgIGVuZERhdGUgPSBkb21haW5bMV07XG5cbiAgLy8gc2V0IHVwcGVyIGFuZCBsb3dlciBib3VuZHMgZm9yIG51bWJlciBvZiBzdGVwcyBwZXIgdGlja1xuICAvLyBpLmUuIGlmIHlvdSBoYXZlIGZvdXIgbW9udGhzIGFuZCBzZXQgc3RlcHMgdG8gMSwgeW91J2xsIGdldCA0IHRpY2tzXG4gIC8vIGFuZCBpZiB5b3UgaGF2ZSBzaXggbW9udGhzIGFuZCBzZXQgc3RlcHMgdG8gMiwgeW91J2xsIGdldCAzIHRpY2tzXG4gIHZhciBzdGVwTG93ZXJCb3VuZCA9IDEsXG4gICAgICBzdGVwVXBwZXJCb3VuZCA9IDEyLFxuICAgICAgdGlja0NhbmRpZGF0ZXMgPSBbXSxcbiAgICAgIGNsb3Nlc3RBcnI7XG5cbiAgLy8gdXNpbmcgdGhlIHRpY2sgYm91bmRzLCBnZW5lcmF0ZSBtdWx0aXBsZSBhcnJheXMtaW4tb2JqZWN0cyB1c2luZ1xuICAvLyBkaWZmZXJlbnQgdGljayBzdGVwcy4gcHVzaCBhbGwgdGhvc2UgZ2VuZXJhdGVkIG9iamVjdHMgdG8gdGlja0NhbmRpZGF0ZXNcbiAgZm9yICh2YXIgaSA9IHN0ZXBMb3dlckJvdW5kOyBpIDw9IHN0ZXBVcHBlckJvdW5kOyBpKyspIHtcbiAgICB2YXIgb2JqID0ge307XG4gICAgb2JqLmludGVydmFsID0gaTtcbiAgICBvYmouYXJyID0gZDMudGltZVtwZXJpb2RdKHN0YXJ0RGF0ZSwgZW5kRGF0ZSwgaSkubGVuZ3RoO1xuICAgIHRpY2tDYW5kaWRhdGVzLnB1c2gob2JqKTtcbiAgfVxuXG4gIC8vIHJlZHVjZSB0byBmaW5kIGEgYmVzdCBjYW5kaWRhdGUgYmFzZWQgb24gdGhlIGRlZmluZWQgdGlja0dvYWxcbiAgaWYgKHRpY2tDYW5kaWRhdGVzLmxlbmd0aCA+IDEpIHtcbiAgICBjbG9zZXN0QXJyID0gdGlja0NhbmRpZGF0ZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyKSB7XG4gICAgICByZXR1cm4gKE1hdGguYWJzKGN1cnIuYXJyIC0gdGlja0dvYWwpIDwgTWF0aC5hYnMocHJldi5hcnIgLSB0aWNrR29hbCkgPyBjdXJyIDogcHJldik7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodGlja0NhbmRpZGF0ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgY2xvc2VzdEFyciA9IHRpY2tDYW5kaWRhdGVzWzBdO1xuICB9IGVsc2Uge1xuICAgIC8vIHNpZ2guIHdlIHRyaWVkLlxuICAgIGNsb3Nlc3RBcnIuaW50ZXJ2YWwgPSAxO1xuICB9XG5cbiAgdmFyIHRpY2tBcnIgPSBkMy50aW1lW3BlcmlvZF0oc3RhcnREYXRlLCBlbmREYXRlLCBjbG9zZXN0QXJyLmludGVydmFsKTtcblxuICB2YXIgc3RhcnREaWZmID0gdGlja0FyclswXSAtIHN0YXJ0RGF0ZTtcbiAgdmFyIHRpY2tEaWZmID0gdGlja0FyclsxXSAtIHRpY2tBcnJbMF07XG5cbiAgLy8gaWYgZGlzdGFuY2UgZnJvbSBzdGFydERhdGUgdG8gdGlja0FyclswXSBpcyBncmVhdGVyIHRoYW4gaGFsZiB0aGVcbiAgLy8gZGlzdGFuY2UgYmV0d2VlbiB0aWNrQXJyWzFdIGFuZCB0aWNrQXJyWzBdLCBhZGQgc3RhcnREYXRlIHRvIHRpY2tBcnJcblxuICBpZiAoIHN0YXJ0RGlmZiA+ICh0aWNrRGlmZiAvIDIpICkgeyB0aWNrQXJyLnVuc2hpZnQoc3RhcnREYXRlKTsgfVxuXG4gIHJldHVybiB0aWNrQXJyO1xuXG59XG5cbmZ1bmN0aW9uIHRpY2tGaW5kZXJZKHNjYWxlLCB0aWNrQ291bnQsIHRpY2tTZXR0aW5ncykge1xuXG4gIC8vIEluIGEgbnV0c2hlbGw6XG4gIC8vIENoZWNrcyBpZiBhbiBleHBsaWNpdCBudW1iZXIgb2YgdGlja3MgaGFzIGJlZW4gZGVjbGFyZWRcbiAgLy8gSWYgbm90LCBzZXRzIGxvd2VyIGFuZCB1cHBlciBib3VuZHMgZm9yIHRoZSBudW1iZXIgb2YgdGlja3NcbiAgLy8gSXRlcmF0ZXMgb3ZlciB0aG9zZSBhbmQgbWFrZXMgc3VyZSB0aGF0IHRoZXJlIGFyZSB0aWNrIGFycmF5cyB3aGVyZVxuICAvLyB0aGUgbGFzdCB2YWx1ZSBpbiB0aGUgYXJyYXkgbWF0Y2hlcyB0aGUgZG9tYWluIG1heCB2YWx1ZVxuICAvLyBpZiBzbywgdHJpZXMgdG8gZmluZCB0aGUgdGljayBudW1iZXIgY2xvc2VzdCB0byB0aWNrR29hbCBvdXQgb2YgdGhlIHdpbm5lcnMsXG4gIC8vIGFuZCByZXR1cm5zIHRoYXQgYXJyIHRvIHRoZSBzY2FsZSBmb3IgdXNlXG5cbiAgdmFyIG1pbiA9IHNjYWxlLmRvbWFpbigpWzBdLFxuICAgICAgbWF4ID0gc2NhbGUuZG9tYWluKClbMV07XG5cbiAgaWYgKHRpY2tDb3VudCAhPT0gXCJhdXRvXCIpIHtcblxuICAgIHJldHVybiBzY2FsZS50aWNrcyh0aWNrQ291bnQpO1xuXG4gIH0gZWxzZSB7XG5cbiAgICB2YXIgdGlja0xvd2VyQm91bmQgPSB0aWNrU2V0dGluZ3MudGlja0xvd2VyQm91bmQsXG4gICAgICAgIHRpY2tVcHBlckJvdW5kID0gdGlja1NldHRpbmdzLnRpY2tVcHBlckJvdW5kLFxuICAgICAgICB0aWNrR29hbCA9IHRpY2tTZXR0aW5ncy50aWNrR29hbCxcbiAgICAgICAgYXJyID0gW10sXG4gICAgICAgIHRpY2tDYW5kaWRhdGVzID0gW10sXG4gICAgICAgIGNsb3Nlc3RBcnI7XG5cbiAgICBmb3IgKHZhciBpID0gdGlja0xvd2VyQm91bmQ7IGkgPD0gdGlja1VwcGVyQm91bmQ7IGkrKykge1xuICAgICAgdmFyIHRpY2tDYW5kaWRhdGUgPSBzY2FsZS50aWNrcyhpKTtcblxuICAgICAgaWYgKG1pbiA8IDApIHtcbiAgICAgICAgaWYgKCh0aWNrQ2FuZGlkYXRlWzBdID09PSBtaW4pICYmICh0aWNrQ2FuZGlkYXRlW3RpY2tDYW5kaWRhdGUubGVuZ3RoIC0gMV0gPT09IG1heCkpIHtcbiAgICAgICAgICBhcnIucHVzaCh0aWNrQ2FuZGlkYXRlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRpY2tDYW5kaWRhdGVbdGlja0NhbmRpZGF0ZS5sZW5ndGggLSAxXSA9PT0gbWF4KSB7XG4gICAgICAgICAgYXJyLnB1c2godGlja0NhbmRpZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHRpY2tDYW5kaWRhdGVzLnB1c2godmFsdWUubGVuZ3RoKTtcbiAgICB9KTtcblxuICAgIHZhciBjbG9zZXN0QXJyO1xuXG4gICAgaWYgKHRpY2tDYW5kaWRhdGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNsb3Nlc3RBcnIgPSB0aWNrQ2FuZGlkYXRlcy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnIpIHtcbiAgICAgICAgcmV0dXJuIChNYXRoLmFicyhjdXJyIC0gdGlja0dvYWwpIDwgTWF0aC5hYnMocHJldiAtIHRpY2tHb2FsKSA/IGN1cnIgOiBwcmV2KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGlja0NhbmRpZGF0ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBjbG9zZXN0QXJyID0gdGlja0NhbmRpZGF0ZXNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3Nlc3RBcnIgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBzY2FsZS50aWNrcyhjbG9zZXN0QXJyKTtcblxuICB9XG59XG5cblxuZnVuY3Rpb24gb3JkaW5hbFRpbWVUaWNrcyhzZWxlY3Rpb24sIGF4aXNOb2RlLCBjdHgsIHNjYWxlLCB0b2xlcmFuY2UpIHtcblxuICBkcm9wUmVkdW5kYW50VGlja3MoYXhpc05vZGUsIGN0eCk7XG5cbiAgLy8gZHJvcFJlZHVuZGFudFRpY2tzIGhhcyBtb2RpZmllZCB0aGUgc2VsZWN0aW9uLCBzbyB3ZSBuZWVkIHRvIHJlc2VsZWN0XG4gIC8vIHRvIGdldCBhIHByb3BlciBpZGVhIG9mIHdoYXQncyBzdGlsbCBhdmFpbGFibGVcbiAgdmFyIG5ld1NlbGVjdGlvbiA9IGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpO1xuXG4gIC8vIGlmIHRoZSBjb250ZXh0IGlzIFwieWVhcnNcIiwgZXZlcnkgdGljayBpcyBhIG1ham9ydGljayBzbyB3ZSBjYW5cbiAgLy8ganVzdCBwYXNzIG9uIHRoZSBibG9jayBiZWxvd1xuICBpZiAoY3R4ICE9PSBcInllYXJzXCIpIHtcblxuICAgIC8vIGFycmF5IGZvciBhbnkgXCJtYWpvciB0aWNrc1wiLCBpLmUuIHRpY2tzIHdpdGggYSBjaGFuZ2UgaW4gY29udGV4dFxuICAgIC8vIG9uZSBsZXZlbCB1cC4gaS5lLiwgYSBcIm1vbnRoc1wiIGNvbnRleHQgc2V0IG9mIHRpY2tzIHdpdGggYSBjaGFuZ2UgaW4gdGhlIHllYXIsXG4gICAgLy8gb3IgXCJkYXlzXCIgY29udGV4dCB0aWNrcyB3aXRoIGEgY2hhbmdlIGluIG1vbnRoIG9yIHllYXJcbiAgICB2YXIgbWFqb3JUaWNrcyA9IFtdO1xuXG4gICAgdmFyIHByZXZZZWFyLCBwcmV2TW9udGgsIHByZXZEYXRlLCBkWWVhciwgZE1vbnRoLCBkRGF0ZTtcblxuICAgIG5ld1NlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBjdXJyU2VsID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgc3dpdGNoIChjdHgpIHtcbiAgICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuICAgICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIGlmIChkWWVhciAhPT0gcHJldlllYXIpIHsgbWFqb3JUaWNrcy5wdXNoKGN1cnJTZWwpOyB9XG4gICAgICAgICAgcHJldlllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ3ZWVrc1wiOlxuICAgICAgICBjYXNlIFwiZGF5c1wiOlxuICAgICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIGRNb250aCA9IGQuZ2V0TW9udGgoKTtcbiAgICAgICAgICBpZiAoKGRNb250aCAhPT0gcHJldk1vbnRoKSAmJiAoZFllYXIgIT09IHByZXZZZWFyKSkge1xuICAgICAgICAgICAgbWFqb3JUaWNrcy5wdXNoKGN1cnJTZWwpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZE1vbnRoICE9PSBwcmV2TW9udGgpIHtcbiAgICAgICAgICAgIG1ham9yVGlja3MucHVzaChjdXJyU2VsKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRZZWFyICE9PSBwcmV2WWVhcikge1xuICAgICAgICAgICAgbWFqb3JUaWNrcy5wdXNoKGN1cnJTZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwcmV2TW9udGggPSBkLmdldE1vbnRoKCk7XG4gICAgICAgICAgcHJldlllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJob3Vyc1wiOlxuICAgICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgICAgaWYgKGREYXRlICE9PSBwcmV2RGF0ZSkgeyBtYWpvclRpY2tzLnB1c2goY3VyclNlbCk7IH1cbiAgICAgICAgICBwcmV2RGF0ZSA9IGREYXRlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHQwLCB0bjtcblxuICAgIGlmIChtYWpvclRpY2tzLmxlbmd0aCA+IDEpIHtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYWpvclRpY2tzLmxlbmd0aCArIDE7IGkrKykge1xuXG4gICAgICAgIGlmIChpID09PSAwKSB7IC8vIGZyb20gdDAgdG8gbTBcbiAgICAgICAgICB0MCA9IDA7XG4gICAgICAgICAgdG4gPSBuZXdTZWxlY3Rpb24uZGF0YSgpLmluZGV4T2YobWFqb3JUaWNrc1swXS5kYXRhKClbMF0pO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPT09IChtYWpvclRpY2tzLmxlbmd0aCkpIHsgLy8gZnJvbSBtbiB0byB0blxuICAgICAgICAgIHQwID0gbmV3U2VsZWN0aW9uLmRhdGEoKS5pbmRleE9mKG1ham9yVGlja3NbaSAtIDFdLmRhdGEoKVswXSk7XG4gICAgICAgICAgdG4gPSBuZXdTZWxlY3Rpb24ubGVuZ3RoIC0gMTtcbiAgICAgICAgfSBlbHNlIHsgLy8gZnJvbSBtMCB0byBtblxuICAgICAgICAgIHQwID0gbmV3U2VsZWN0aW9uLmRhdGEoKS5pbmRleE9mKG1ham9yVGlja3NbaSAtIDFdLmRhdGEoKVswXSk7XG4gICAgICAgICAgdG4gPSBuZXdTZWxlY3Rpb24uZGF0YSgpLmluZGV4T2YobWFqb3JUaWNrc1tpXS5kYXRhKClbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEhKHRuIC0gdDApKSB7XG4gICAgICAgICAgZHJvcFRpY2tzKG5ld1NlbGVjdGlvbiwge1xuICAgICAgICAgICAgZnJvbTogdDAsXG4gICAgICAgICAgICB0bzogdG4sXG4gICAgICAgICAgICB0b2xlcmFuY2U6IHRvbGVyYW5jZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICBkcm9wVGlja3MobmV3U2VsZWN0aW9uLCB7IHRvbGVyYW5jZTogdG9sZXJhbmNlIH0pO1xuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIGRyb3BUaWNrcyhuZXdTZWxlY3Rpb24sIHsgdG9sZXJhbmNlOiB0b2xlcmFuY2UgfSk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBheGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaikge1xuXG4gIC8vIHRoaXMgc2VjdGlvbiBpcyBraW5kYSBncm9zcywgc29ycnk6XG4gIC8vIHJlc2V0cyByYW5nZXMgYW5kIGRpbWVuc2lvbnMsIHJlZHJhd3MgeUF4aXMsIHJlZHJhd3MgeEF4aXNcbiAgLy8g4oCmdGhlbiByZWRyYXdzIHlBeGlzIGFnYWluIGlmIHRpY2sgd3JhcHBpbmcgaGFzIGNoYW5nZWQgeEF4aXMgaGVpZ2h0XG5cbiAgZHJhd1lBeGlzKG9iaiwgeUF4aXNPYmouYXhpcywgeUF4aXNPYmoubm9kZSk7XG5cbiAgdmFyIHNldFJhbmdlVHlwZSA9IHJlcXVpcmUoXCIuL3NjYWxlXCIpLnNldFJhbmdlVHlwZSxcbiAgICAgIHNldFJhbmdlQXJncyA9IHJlcXVpcmUoXCIuL3NjYWxlXCIpLnNldFJhbmdlQXJncztcblxuICB2YXIgc2NhbGVPYmogPSB7XG4gICAgcmFuZ2VUeXBlOiBzZXRSYW5nZVR5cGUob2JqLnhBeGlzKSxcbiAgICByYW5nZTogeEF4aXNPYmoucmFuZ2UgfHwgWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSxcbiAgICBiYW5kczogb2JqLmRpbWVuc2lvbnMuYmFuZHMsXG4gICAgcmFuZ2VQb2ludHM6IG9iai54QXhpcy5yYW5nZVBvaW50c1xuICB9O1xuXG4gIHNldFJhbmdlQXJncyh4QXhpc09iai5heGlzLnNjYWxlKCksIHNjYWxlT2JqKTtcblxuICB2YXIgcHJldlhBeGlzSGVpZ2h0ID0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQ7XG5cbiAgeEF4aXNPYmogPSBheGlzTWFuYWdlcihub2RlLCBvYmosIHhBeGlzT2JqLmF4aXMuc2NhbGUoKSwgXCJ4QXhpc1wiKTtcblxuICB4QXhpc09iai5ub2RlXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSAtIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KSArIFwiKVwiKTtcblxuICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWxcIikge1xuICAgIGRyb3BPdmVyc2V0VGlja3MoeEF4aXNPYmoubm9kZSwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpO1xuICB9XG5cbiAgaWYgKHByZXZYQXhpc0hlaWdodCAhPT0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpIHtcbiAgICBkcmF3WUF4aXMob2JqLCB5QXhpc09iai5heGlzLCB5QXhpc09iai5ub2RlKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFkZFplcm9MaW5lKG9iaiwgbm9kZSwgQXhpcywgYXhpc1R5cGUpIHtcblxuICB2YXIgdGlja3MgPSBBeGlzLmF4aXMudGlja1ZhbHVlcygpLFxuICAgICAgdGlja01pbiA9IHRpY2tzWzBdLFxuICAgICAgdGlja01heCA9IHRpY2tzW3RpY2tzLmxlbmd0aCAtIDFdO1xuXG4gIGlmICgodGlja01pbiA8PSAwKSAmJiAoMCA8PSB0aWNrTWF4KSkge1xuXG4gICAgdmFyIHJlZkdyb3VwID0gQXhpcy5ub2RlLnNlbGVjdEFsbChcIi50aWNrOm5vdCguXCIgKyBvYmoucHJlZml4ICsgXCJtaW5vcilcIiksXG4gICAgICAgIHJlZkxpbmUgPSByZWZHcm91cC5zZWxlY3QoXCJsaW5lXCIpO1xuXG4gICAgLy8gemVybyBsaW5lXG4gICAgdmFyIHplcm9MaW5lID0gbm9kZS5hcHBlbmQoXCJsaW5lXCIpXG4gICAgICAuc3R5bGUoXCJzaGFwZS1yZW5kZXJpbmdcIiwgXCJjcmlzcEVkZ2VzXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInplcm8tbGluZVwiKTtcblxuICAgIHZhciB0cmFuc2Zvcm0gPSBbMCwgMF07XG5cbiAgICB0cmFuc2Zvcm1bMF0gKz0gZDMudHJhbnNmb3JtKG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIGF4aXNUeXBlKS5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMF07XG4gICAgdHJhbnNmb3JtWzFdICs9IGQzLnRyYW5zZm9ybShub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBheGlzVHlwZSkuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzFdO1xuICAgIHRyYW5zZm9ybVswXSArPSBkMy50cmFuc2Zvcm0ocmVmR3JvdXAuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdO1xuICAgIHRyYW5zZm9ybVsxXSArPSBkMy50cmFuc2Zvcm0ocmVmR3JvdXAuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzFdO1xuXG4gICAgaWYgKGF4aXNUeXBlID09PSBcInhBeGlzXCIpIHtcblxuICAgICAgemVyb0xpbmUuYXR0cih7XG4gICAgICAgIFwieTFcIjogcmVmTGluZS5hdHRyKFwieTFcIiksXG4gICAgICAgIFwieTJcIjogcmVmTGluZS5hdHRyKFwieTJcIiksXG4gICAgICAgIFwieDFcIjogMCxcbiAgICAgICAgXCJ4MlwiOiAwLFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIHRyYW5zZm9ybVswXSArIFwiLFwiICsgdHJhbnNmb3JtWzFdICsgXCIpXCJcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIGlmIChheGlzVHlwZSA9PT0gXCJ5QXhpc1wiKSB7XG5cbiAgICAgIHplcm9MaW5lLmF0dHIoe1xuICAgICAgICBcIngxXCI6IHJlZkxpbmUuYXR0cihcIngxXCIpLFxuICAgICAgICBcIngyXCI6IHJlZkxpbmUuYXR0cihcIngyXCIpLFxuICAgICAgICBcInkxXCI6IDAsXG4gICAgICAgIFwieTJcIjogMCxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyB0cmFuc2Zvcm1bMF0gKyBcIixcIiArIHRyYW5zZm9ybVsxXSArIFwiKVwiXG4gICAgICB9KTtcblxuICAgIH1cblxuICAgIHJlZkxpbmUuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEF4aXNGYWN0b3J5OiBBeGlzRmFjdG9yeSxcbiAgYXhpc01hbmFnZXI6IGF4aXNNYW5hZ2VyLFxuICBkZXRlcm1pbmVGb3JtYXQ6IGRldGVybWluZUZvcm1hdCxcbiAgYXBwZW5kWEF4aXM6IGFwcGVuZFhBeGlzLFxuICBhcHBlbmRZQXhpczogYXBwZW5kWUF4aXMsXG4gIGRyYXdZQXhpczogZHJhd1lBeGlzLFxuICB0aW1lQXhpczogdGltZUF4aXMsXG4gIGRpc2NyZXRlQXhpczogZGlzY3JldGVBeGlzLFxuICBvcmRpbmFsVGltZUF4aXM6IG9yZGluYWxUaW1lQXhpcyxcbiAgc2V0VGlja0Zvcm1hdFg6IHNldFRpY2tGb3JtYXRYLFxuICBzZXRUaWNrRm9ybWF0WTogc2V0VGlja0Zvcm1hdFksXG4gIHVwZGF0ZVRleHRYOiB1cGRhdGVUZXh0WCxcbiAgdXBkYXRlVGV4dFk6IHVwZGF0ZVRleHRZLFxuICByZXBvc2l0aW9uVGV4dFk6IHJlcG9zaXRpb25UZXh0WSxcbiAgbmV3VGV4dE5vZGU6IG5ld1RleHROb2RlLFxuICBkcm9wVGlja3M6IGRyb3BUaWNrcyxcbiAgZHJvcE92ZXJzZXRUaWNrczogZHJvcE92ZXJzZXRUaWNrcyxcbiAgZHJvcFJlZHVuZGFudFRpY2tzOiBkcm9wUmVkdW5kYW50VGlja3MsXG4gIHRpY2tGaW5kZXJYOiB0aWNrRmluZGVyWCxcbiAgdGlja0ZpbmRlclk6IHRpY2tGaW5kZXJZLFxuICBheGlzQ2xlYW51cDogYXhpc0NsZWFudXAsXG4gIGFkZFplcm9MaW5lOiBhZGRaZXJvTGluZVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvYXhpcy5qc1xuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBzY2FsZU1hbmFnZXIob2JqLCBheGlzVHlwZSkge1xuXG4gIHZhciBheGlzID0gb2JqW2F4aXNUeXBlXSxcbiAgICAgIHNjYWxlT2JqID0gbmV3IFNjYWxlT2JqKG9iaiwgYXhpcywgYXhpc1R5cGUpO1xuXG4gIHZhciBzY2FsZSA9IHNldFNjYWxlVHlwZShzY2FsZU9iai50eXBlKTtcblxuICBzY2FsZS5kb21haW4oc2NhbGVPYmouZG9tYWluKTtcblxuICBzZXRSYW5nZUFyZ3Moc2NhbGUsIHNjYWxlT2JqKTtcblxuICBpZiAoYXhpcy5uaWNlKSB7IG5pY2VpZnkoc2NhbGUsIGF4aXNUeXBlLCBzY2FsZU9iaik7IH1cbiAgaWYgKGF4aXMucmVzY2FsZSkgeyByZXNjYWxlKHNjYWxlLCBheGlzVHlwZSwgYXhpcyk7IH1cblxuICByZXR1cm4ge1xuICAgIG9iajogc2NhbGVPYmosXG4gICAgc2NhbGU6IHNjYWxlXG4gIH07XG5cbn1cblxuZnVuY3Rpb24gU2NhbGVPYmoob2JqLCBheGlzLCBheGlzVHlwZSkge1xuICB0aGlzLnR5cGUgPSBheGlzLnNjYWxlO1xuICB0aGlzLmRvbWFpbiA9IHNldERvbWFpbihvYmosIGF4aXMpO1xuICB0aGlzLnJhbmdlVHlwZSA9IHNldFJhbmdlVHlwZShheGlzKTtcbiAgdGhpcy5yYW5nZSA9IHNldFJhbmdlKG9iaiwgYXhpc1R5cGUpO1xuICB0aGlzLmJhbmRzID0gb2JqLmRpbWVuc2lvbnMuYmFuZHM7XG4gIHRoaXMucmFuZ2VQb2ludHMgPSBheGlzLnJhbmdlUG9pbnRzIHx8IDEuMDtcbn1cblxuZnVuY3Rpb24gc2V0U2NhbGVUeXBlKHR5cGUpIHtcblxuICB2YXIgc2NhbGVUeXBlO1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy50aW1lLnNjYWxlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLm9yZGluYWwoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsaW5lYXJcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLmxpbmVhcigpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImlkZW50aXR5XCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5pZGVudGl0eSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInBvd1wiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUucG93KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic3FydFwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUuc3FydCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxvZ1wiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUubG9nKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicXVhbnRpemVcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnF1YW50aXplKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicXVhbnRpbGVcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnF1YW50aWxlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhyZXNob2xkXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS50aHJlc2hvbGQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHNjYWxlVHlwZTtcblxufVxuXG5mdW5jdGlvbiBzZXRSYW5nZVR5cGUoYXhpcykge1xuXG4gIHZhciB0eXBlO1xuXG4gIHN3aXRjaChheGlzLnNjYWxlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICB0eXBlID0gXCJyYW5nZVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICBjYXNlIFwiZGlzY3JldGVcIjpcbiAgICAgIHR5cGUgPSBcInJhbmdlUm91bmRCYW5kc1wiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWwtdGltZVwiOlxuICAgICAgdHlwZSA9IFwicmFuZ2VQb2ludHNcIjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0eXBlID0gXCJyYW5nZVwiO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gdHlwZTtcblxufVxuXG5mdW5jdGlvbiBzZXRSYW5nZShvYmosIGF4aXNUeXBlKSB7XG5cbiAgdmFyIHJhbmdlO1xuXG4gIGlmIChheGlzVHlwZSA9PT0gXCJ4QXhpc1wiKSB7XG4gICAgcmFuZ2UgPSBbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldOyAvLyBvcGVyYXRpbmcgb24gd2lkdGhcbiAgfSBlbHNlIGlmIChheGlzVHlwZSA9PT0gXCJ5QXhpc1wiKSB7XG4gICAgcmFuZ2UgPSBbb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKSwgMF07IC8vIG9wZXJhdGluZyBvbiBoZWlnaHRcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcblxufVxuXG5mdW5jdGlvbiBzZXRSYW5nZUFyZ3Moc2NhbGUsIHNjYWxlT2JqKSB7XG5cbiAgc3dpdGNoIChzY2FsZU9iai5yYW5nZVR5cGUpIHtcbiAgICBjYXNlIFwicmFuZ2VcIjpcbiAgICAgIHJldHVybiBzY2FsZVtzY2FsZU9iai5yYW5nZVR5cGVdKHNjYWxlT2JqLnJhbmdlKTtcbiAgICBjYXNlIFwicmFuZ2VSb3VuZEJhbmRzXCI6XG4gICAgICByZXR1cm4gc2NhbGVbc2NhbGVPYmoucmFuZ2VUeXBlXShzY2FsZU9iai5yYW5nZSwgc2NhbGVPYmouYmFuZHMucGFkZGluZywgc2NhbGVPYmouYmFuZHMub3V0ZXJQYWRkaW5nKTtcbiAgICBjYXNlIFwicmFuZ2VQb2ludHNcIjpcbiAgICAgIHJldHVybiBzY2FsZVtzY2FsZU9iai5yYW5nZVR5cGVdKHNjYWxlT2JqLnJhbmdlLCBzY2FsZU9iai5yYW5nZVBvaW50cyk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBzZXREb21haW4ob2JqLCBheGlzKSB7XG5cbiAgdmFyIGRhdGEgPSBvYmouZGF0YTtcbiAgdmFyIGRvbWFpbjtcblxuICAvLyBpbmNsdWRlZCBmYWxsYmFja3MganVzdCBpbiBjYXNlXG4gIHN3aXRjaChheGlzLnNjYWxlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcbiAgICAgIGRvbWFpbiA9IHNldERhdGVEb21haW4oZGF0YSwgYXhpcy5taW4sIGF4aXMubWF4KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsaW5lYXJcIjpcbiAgICAgIHZhciBjaGFydFR5cGUgPSBvYmoub3B0aW9ucy50eXBlLFxuICAgICAgICAgIGZvcmNlTWF4VmFsO1xuICAgICAgaWYgKGNoYXJ0VHlwZSA9PT0gXCJhcmVhXCIgfHwgY2hhcnRUeXBlID09PSBcImNvbHVtblwiIHx8IGNoYXJ0VHlwZSA9PT0gXCJiYXJcIikge1xuICAgICAgICBmb3JjZU1heFZhbCA9IHRydWU7XG4gICAgICB9XG4gICAgICBkb21haW4gPSBzZXROdW1lcmljYWxEb21haW4oZGF0YSwgYXhpcy5taW4sIGF4aXMubWF4LCBvYmoub3B0aW9ucy5zdGFja2VkLCBmb3JjZU1heFZhbCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcbiAgICAgIGRvbWFpbiA9IHNldERpc2NyZXRlRG9tYWluKGRhdGEpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gZG9tYWluO1xuXG59XG5cbmZ1bmN0aW9uIHNldERhdGVEb21haW4oZGF0YSwgbWluLCBtYXgpIHtcbiAgaWYgKG1pbiAmJiBtYXgpIHtcbiAgICB2YXIgc3RhcnREYXRlID0gbWluLCBlbmREYXRlID0gbWF4O1xuICB9IGVsc2Uge1xuICAgIHZhciBkYXRlUmFuZ2UgPSBkMy5leHRlbnQoZGF0YS5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmtleTsgfSk7XG4gICAgdmFyIHN0YXJ0RGF0ZSA9IG1pbiB8fCBuZXcgRGF0ZShkYXRlUmFuZ2VbMF0pLFxuICAgICAgICBlbmREYXRlID0gbWF4IHx8IG5ldyBEYXRlKGRhdGVSYW5nZVsxXSk7XG4gIH1cbiAgcmV0dXJuIFtzdGFydERhdGUsIGVuZERhdGVdO1xufVxuXG5mdW5jdGlvbiBzZXROdW1lcmljYWxEb21haW4oZGF0YSwgbWluLCBtYXgsIHN0YWNrZWQsIGZvcmNlTWF4VmFsKSB7XG5cbiAgdmFyIG1pblZhbCwgbWF4VmFsO1xuICB2YXIgbUFyciA9IFtdO1xuXG4gIGQzLm1hcChkYXRhLmRhdGEsIGZ1bmN0aW9uKGQpIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGQuc2VyaWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBtQXJyLnB1c2goTnVtYmVyKGQuc2VyaWVzW2pdLnZhbCkpO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHN0YWNrZWQpIHtcbiAgICBtYXhWYWwgPSBkMy5tYXgoZGF0YS5zdGFja2VkRGF0YVtkYXRhLnN0YWNrZWREYXRhLmxlbmd0aCAtIDFdLCBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gKGQueTAgKyBkLnkpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG1heFZhbCA9IGQzLm1heChtQXJyKTtcbiAgfVxuXG4gIG1pblZhbCA9IGQzLm1pbihtQXJyKTtcblxuICBpZiAobWluKSB7XG4gICAgbWluVmFsID0gbWluO1xuICB9IGVsc2UgaWYgKG1pblZhbCA+IDApIHtcbiAgICBtaW5WYWwgPSAwO1xuICB9XG5cbiAgaWYgKG1heCkge1xuICAgIG1heFZhbCA9IG1heDtcbiAgfSBlbHNlIGlmIChtYXhWYWwgPCAwICYmIGZvcmNlTWF4VmFsKSB7XG4gICAgbWF4VmFsID0gMDtcbiAgfVxuXG4gIHJldHVybiBbbWluVmFsLCBtYXhWYWxdO1xuXG59XG5cbmZ1bmN0aW9uIHNldERpc2NyZXRlRG9tYWluKGRhdGEpIHtcbiAgcmV0dXJuIGRhdGEuZGF0YS5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0pO1xufVxuXG5mdW5jdGlvbiByZXNjYWxlKHNjYWxlLCBheGlzVHlwZSwgYXhpc09iaikge1xuXG4gIHN3aXRjaChheGlzT2JqLnNjYWxlKSB7XG4gICAgY2FzZSBcImxpbmVhclwiOlxuICAgICAgaWYgKCFheGlzT2JqLm1heCkgeyByZXNjYWxlTnVtZXJpY2FsKHNjYWxlLCBheGlzT2JqKTsgfVxuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzY2FsZU51bWVyaWNhbChzY2FsZSwgYXhpc09iaikge1xuXG4gIC8vIHJlc2NhbGVzIHRoZSBcInRvcFwiIGVuZCBvZiB0aGUgZG9tYWluXG4gIHZhciB0aWNrcyA9IHNjYWxlLnRpY2tzKDEwKS5zbGljZSgpLFxuICAgICAgdGlja0luY3IgPSBNYXRoLmFicyh0aWNrc1t0aWNrcy5sZW5ndGggLSAxXSkgLSBNYXRoLmFicyh0aWNrc1t0aWNrcy5sZW5ndGggLSAyXSk7XG5cbiAgdmFyIG5ld01heCA9IHRpY2tzW3RpY2tzLmxlbmd0aCAtIDFdICsgdGlja0luY3I7XG5cbiAgc2NhbGUuZG9tYWluKFtzY2FsZS5kb21haW4oKVswXSwgbmV3TWF4XSk7XG5cbn1cblxuZnVuY3Rpb24gbmljZWlmeShzY2FsZSwgYXhpc1R5cGUsIHNjYWxlT2JqKSB7XG5cbiAgc3dpdGNoKHNjYWxlT2JqLnR5cGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuICAgICAgdmFyIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgdmFyIGNvbnRleHQgPSB0aW1lRGlmZihzY2FsZS5kb21haW4oKVswXSwgc2NhbGUuZG9tYWluKClbMV0sIDMpO1xuICAgICAgbmljZWlmeVRpbWUoc2NhbGUsIGNvbnRleHQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxpbmVhclwiOlxuICAgICAgbmljZWlmeU51bWVyaWNhbChzY2FsZSk7XG4gICAgICBicmVhaztcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIG5pY2VpZnlUaW1lKHNjYWxlLCBjb250ZXh0KSB7XG4gIHZhciBnZXRUaW1lSW50ZXJ2YWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZUludGVydmFsO1xuICB2YXIgdGltZUludGVydmFsID0gZ2V0VGltZUludGVydmFsKGNvbnRleHQpO1xuICBzY2FsZS5kb21haW4oc2NhbGUuZG9tYWluKCkpLm5pY2UodGltZUludGVydmFsKTtcbn1cblxuZnVuY3Rpb24gbmljZWlmeU51bWVyaWNhbChzY2FsZSkge1xuICBzY2FsZS5kb21haW4oc2NhbGUuZG9tYWluKCkpLm5pY2UoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNjYWxlTWFuYWdlcjogc2NhbGVNYW5hZ2VyLFxuICBTY2FsZU9iajogU2NhbGVPYmosXG4gIHNldFNjYWxlVHlwZTogc2V0U2NhbGVUeXBlLFxuICBzZXRSYW5nZVR5cGU6IHNldFJhbmdlVHlwZSxcbiAgc2V0UmFuZ2VBcmdzOiBzZXRSYW5nZUFyZ3MsXG4gIHNldFJhbmdlOiBzZXRSYW5nZSxcbiAgc2V0RG9tYWluOiBzZXREb21haW4sXG4gIHNldERhdGVEb21haW46IHNldERhdGVEb21haW4sXG4gIHNldE51bWVyaWNhbERvbWFpbjogc2V0TnVtZXJpY2FsRG9tYWluLFxuICBzZXREaXNjcmV0ZURvbWFpbjogc2V0RGlzY3JldGVEb21haW4sXG4gIHJlc2NhbGU6IHJlc2NhbGUsXG4gIHJlc2NhbGVOdW1lcmljYWw6IHJlc2NhbGVOdW1lcmljYWwsXG4gIG5pY2VpZnk6IG5pY2VpZnksXG4gIG5pY2VpZnlUaW1lOiBuaWNlaWZ5VGltZSxcbiAgbmljZWlmeU51bWVyaWNhbDogbmljZWlmeU51bWVyaWNhbFxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc2NhbGUuanNcbiAqKiBtb2R1bGUgaWQgPSAxN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gTXVsdGlMaW5lQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBpZiAoeFNjYWxlT2JqLm9iai50eXBlID09PSBcIm9yZGluYWxcIikge1xuICAgIHhTY2FsZS5yYW5nZVJvdW5kUG9pbnRzKFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sIDEuMCk7XG4gIH1cblxuICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID09PSAxKSB7IG9iai5zZXJpZXNIaWdobGlnaHQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH0gfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsaXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KTtcblxuICAvLyBTZWNvbmRhcnkgYXJyYXkgaXMgdXNlZCB0byBzdG9yZSBhIHJlZmVyZW5jZSB0byBhbGwgc2VyaWVzIGV4Y2VwdCBmb3IgdGhlIGhpZ2hsaWdodGVkIGl0ZW1cbiAgdmFyIHNlY29uZGFyeUFyciA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSBvYmouZGF0YS5zZXJpZXNBbW91bnQgLSAxOyBpID49IDA7IGktLSkge1xuICAgIC8vIERvbnQgd2FudCB0byBpbmNsdWRlIHRoZSBoaWdobGlnaHRlZCBpdGVtIGluIHRoZSBsb29wXG4gICAgLy8gYmVjYXVzZSB3ZSBhbHdheXMgd2FudCBpdCB0byBzaXQgYWJvdmUgYWxsIHRoZSBvdGhlciBsaW5lc1xuXG4gICAgaWYgKGkgIT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuXG4gICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAgICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW2ldLnZhbCk7IH0pXG4gICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tpXS52YWwpOyB9KTtcblxuICAgICAgdmFyIHBhdGhSZWYgPSBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkXCI6IGxpbmUsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcIm11bHRpbGluZSBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpbGluZS1cIiArIChpKTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgc2Vjb25kYXJ5QXJyLnB1c2gocGF0aFJlZik7XG4gICAgfVxuXG4gIH1cblxuICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBzZWNvbmRhcnkgc2VyaWVzIChhbGwgc2VyaWVzIGV4Y2VwdCB0aGUgaGlnaGxpZ2h0ZWQgb25lKVxuICAvLyBhbmQgc2V0IHRoZSBjb2xvdXJzIGluIHRoZSBjb3JyZWN0IG9yZGVyXG5cbiAgdmFyIHNlY29uZGFyeUFyciA9IHNlY29uZGFyeUFyci5yZXZlcnNlKCk7XG5cbiAgdmFyIGhMaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KTtcblxuICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJtdWx0aWxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aWxpbmUtXCIgKyAob2JqLnNlcmllc0hpZ2hsaWdodCgpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9LFxuICAgICAgXCJkXCI6IGhMaW5lXG4gICAgfSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgaExpbmU6IGhMaW5lLFxuICAgIGxpbmU6IGxpbmVcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNdWx0aUxpbmVDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL211bHRpbGluZS5qc1xuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBBcmVhQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBpZiAoeFNjYWxlT2JqLm9iai50eXBlID09PSBcIm9yZGluYWxcIikge1xuICAgIHhTY2FsZS5yYW5nZVJvdW5kUG9pbnRzKFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sIDEuMCk7XG4gIH1cblxuICAvLyB3aGE/XG4gIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPT09IDEpIHsgb2JqLnNlcmllc0hpZ2hsaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfSB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWx0aXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KTtcblxuICAvLyBTZWNvbmRhcnkgYXJyYXkgaXMgdXNlZCB0byBzdG9yZSBhIHJlZmVyZW5jZSB0byBhbGwgc2VyaWVzIGV4Y2VwdCBmb3IgdGhlIGhpZ2hsaWdodGVkIGl0ZW1cbiAgdmFyIHNlY29uZGFyeUFyciA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSBvYmouZGF0YS5zZXJpZXNBbW91bnQgLSAxOyBpID49IDA7IGktLSkge1xuICAgIC8vIERvbnQgd2FudCB0byBpbmNsdWRlIHRoZSBoaWdobGlnaHRlZCBpdGVtIGluIHRoZSBsb29wXG4gICAgLy8gYmVjYXVzZSB3ZSBhbHdheXMgd2FudCBpdCB0byBzaXQgYWJvdmUgYWxsIHRoZSBvdGhlciBsaW5lc1xuXG4gICAgaWYgKGkgIT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuXG4gICAgICB2YXIgYXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAgICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW2ldLnZhbCk7IH0pXG4gICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgICAgIC55MCh5U2NhbGUoMCkpXG4gICAgICAgIC55MShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbaV0udmFsKTsgfSk7XG5cbiAgICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgICAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbaV0udmFsKTsgfSlcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW2ldLnZhbCk7IH0pO1xuXG4gICAgICB2YXIgcGF0aFJlZiA9IHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogYXJlYSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwiZmlsbCBcIiArIG9iai5wcmVmaXggKyBcImZpbGwtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogbGluZSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlY29uZGFyeUFyci5wdXNoKHBhdGhSZWYpO1xuICAgIH1cblxuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgc2Vjb25kYXJ5IHNlcmllcyAoYWxsIHNlcmllcyBleGNlcHQgdGhlIGhpZ2hsaWdodGVkIG9uZSlcbiAgLy8gYW5kIHNldCB0aGUgY29sb3VycyBpbiB0aGUgY29ycmVjdCBvcmRlclxuXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBzZWNvbmRhcnlBcnIucmV2ZXJzZSgpO1xuXG4gIHZhciBoQXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgLnkwKHlTY2FsZSgwKSlcbiAgICAueTEoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSk7XG5cbiAgdmFyIGhMaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KTtcblxuICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgLmF0dHIoe1xuICAgICAgXCJkXCI6IGhBcmVhLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJmaWxsIFwiICsgb2JqLnByZWZpeCArIFwiZmlsbC1cIiArIChvYmouc2VyaWVzSGlnaGxpZ2h0KCkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cbiAgICB9KTtcblxuICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgLmF0dHIoe1xuICAgICAgXCJkXCI6IGhMaW5lLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibGluZS1cIiArIChvYmouc2VyaWVzSGlnaGxpZ2h0KCkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cbiAgICB9KTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBoTGluZTogaExpbmUsXG4gICAgaEFyZWE6IGhBcmVhLFxuICAgIGxpbmU6IGxpbmUsXG4gICAgYXJlYTogYXJlYVxuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFyZWFDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL2FyZWEuanNcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gU3RhY2tlZEFyZWFDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmICh4U2NhbGVPYmoub2JqLnR5cGUgPT09IFwib3JkaW5hbFwiKSB7XG4gICAgeFNjYWxlLnJhbmdlUm91bmRQb2ludHMoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgMS4wKTtcbiAgfVxuXG4gIC8vIHdoYT9cbiAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA9PT0gMSkgeyBvYmouc2VyaWVzSGlnaGxpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9IH1cblxuICBub2RlLmNsYXNzZWQob2JqLnByZWZpeCArIFwic3RhY2tlZFwiLCB0cnVlKTtcblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSk7XG5cbiAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLnNlbGVjdEFsbChcImcuXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNcIilcbiAgICAuZGF0YShvYmouZGF0YS5zdGFja2VkRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJzdmc6Z1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIChpKTtcbiAgICAgICAgaWYgKGkgPT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuICAgICAgICAgIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIChpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cbiAgICB9KTtcblxuICB2YXIgYXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC55MCArIGQueSk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0pXG4gICAgLnkwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwKTsgfSlcbiAgICAueTEoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTAgKyBkLnkpOyB9KTtcblxuICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC55MCArIGQueSk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTAgKyBkLnkpOyB9KTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImZpbGwgXCIgKyBvYmoucHJlZml4ICsgXCJmaWxsLVwiICsgKGkpO1xuICAgICAgaWYgKGkgPT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuICAgICAgICBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJmaWxsIFwiICsgb2JqLnByZWZpeCArIFwiZmlsbC1cIiArIChpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJkXCIsIGFyZWEpO1xuXG4gIHNlcmllcy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibGluZS1cIiArIChpKTsgfSlcbiAgICAuYXR0cihcImRcIiwgbGluZSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgbGluZTogbGluZSxcbiAgICBhcmVhOiBhcmVhXG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2tlZEFyZWFDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYS5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBDb2x1bW5DaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIHN3aXRjaCAob2JqLnhBeGlzLnNjYWxlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcblxuICAgICAgdmFyIHRpbWVJbnRlcnZhbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lSW50ZXJ2YWwsXG4gICAgICAgICAgdGltZUVsYXBzZWQgPSB0aW1lSW50ZXJ2YWwob2JqLmRhdGEuZGF0YSkgKyAxO1xuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gdGltZUVsYXBzZWQgLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG5cbiAgICAgIHhBeGlzT2JqLnJhbmdlID0gWzAsIChvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIChzaW5nbGVDb2x1bW4gKiBvYmouZGF0YS5zZXJpZXNBbW91bnQpKV07XG5cbiAgICAgIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG5cbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSB4U2NhbGUob2JqLmRhdGEuZGF0YVsxXS5rZXkpIC0geFNjYWxlKG9iai5kYXRhLmRhdGFbMF0ua2V5KTtcblxuICAgICAgeEF4aXNPYmoubm9kZSA9IG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cC5cIiArIG9iai5wcmVmaXggKyBcInhBeGlzXCIpO1xuXG4gICAgICB4QXhpc09iai5ub2RlXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAvIDIpKSArIFwiLFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkgKyBcIilcIik7XG5cbiAgICAgIGF4aXNNb2R1bGUuZHJvcE92ZXJzZXRUaWNrcyh4QXhpc09iai5ub2RlLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSk7XG5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgICB2YXIgc2luZ2xlQ29sdW1uID0geFNjYWxlLnJhbmdlQmFuZCgpIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bHRpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeE9mZnNldDtcbiAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgPT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAvIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeE9mZnNldCArIFwiLDApXCI7XG4gICAgfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmouZGF0YS5zZXJpZXNBbW91bnQ7IGkrKykge1xuXG4gICAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIGkpO1xuXG4gICAgdmFyIGNvbHVtbkl0ZW0gPSBzZXJpZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJjb2x1bW5cIilcbiAgICAgIC5kYXRhKG9iai5kYXRhLmRhdGEpLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiY29sdW1uIFwiICsgb2JqLnByZWZpeCArIFwiY29sdW1uLVwiICsgKGkpLFxuICAgICAgICBcImRhdGEtc2VyaWVzXCI6IGksXG4gICAgICAgIFwiZGF0YS1rZXlcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0sXG4gICAgICAgIFwiZGF0YS1sZWdlbmRcIjogZnVuY3Rpb24oKSB7IHJldHVybiBvYmouZGF0YS5rZXlzW2kgKyAxXTsgfSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHhTY2FsZShkLmtleSkgKyBcIiwwKVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBjb2x1bW5JdGVtLmFwcGVuZChcInJlY3RcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGQuc2VyaWVzW2ldLnZhbCA8IDAgPyBvYmoucHJlZml4ICsgXCJuZWdhdGl2ZVwiIDogb2JqLnByZWZpeCArIFwicG9zaXRpdmVcIjtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gaSAqIHNpbmdsZUNvbHVtbjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShkLmtleSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwieVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKGQuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB5U2NhbGUoTWF0aC5tYXgoMCwgZC5zZXJpZXNbaV0udmFsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhlaWdodFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKGQuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyh5U2NhbGUoZC5zZXJpZXNbaV0udmFsKSAtIHlTY2FsZSgwKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndpZHRoXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBzaW5nbGVDb2x1bW47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzaW5nbGVDb2x1bW4gLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG5cbiAgICAgIHZhciBjb2x1bW5PZmZzZXQgPSBvYmouZGltZW5zaW9ucy5iYW5kcy5vZmZzZXQ7XG5cbiAgICAgIGNvbHVtbkl0ZW0uc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICgoaSAqIHNpbmdsZUNvbHVtbikgKyAoc2luZ2xlQ29sdW1uICogKGNvbHVtbk9mZnNldCAvIDIpKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geFNjYWxlKGQua2V5KSArIChpICogKHNpbmdsZUNvbHVtbiAvIG9iai5kYXRhLnNlcmllc0Ftb3VudCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ3aWR0aFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChzaW5nbGVDb2x1bW4gLSAoc2luZ2xlQ29sdW1uICogY29sdW1uT2Zmc2V0KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlQ29sdW1uIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gIH1cblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICBzaW5nbGVDb2x1bW46IHNpbmdsZUNvbHVtbixcbiAgICBjb2x1bW5JdGVtOiBjb2x1bW5JdGVtXG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2x1bW5DaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL2NvbHVtbi5qc1xuICoqIG1vZHVsZSBpZCA9IDIxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBCYXJDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyBiZWNhdXNlIHRoZSBlbGVtZW50cyB3aWxsIGJlIGFwcGVuZGVkIGluIHJldmVyc2UgZHVlIHRvIHRoZVxuICAvLyBiYXIgY2hhcnQgb3BlcmF0aW5nIG9uIHRoZSB5LWF4aXMsIG5lZWQgdG8gcmV2ZXJzZSB0aGUgZGF0YXNldC5cbiAgb2JqLmRhdGEuZGF0YS5yZXZlcnNlKCk7XG5cbiAgdmFyIHhBeGlzU2V0dGluZ3M7XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLnhfYXhpcykge1xuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9oZWxwZXJzXCIpLmV4dGVuZDtcbiAgICB4QXhpc1NldHRpbmdzID0gZXh0ZW5kKG9iai54QXhpcywgb2JqLmV4cG9ydGFibGUueF9heGlzKTtcbiAgfSBlbHNlIHtcbiAgICB4QXhpc1NldHRpbmdzID0gb2JqLnhBeGlzO1xuICB9XG5cbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGU7XG5cbiAgdmFyIHhBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgIC5zY2FsZSh4U2NhbGUpXG4gICAgLm9yaWVudChcImJvdHRvbVwiKTtcblxuICB2YXIgeEF4aXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cFwiICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJ4QXhpc1wiKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIpO1xuXG4gIHZhciB4QXhpc05vZGUgPSB4QXhpc0dyb3VwLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcIngtYXhpc1wiKVxuICAgIC5jYWxsKHhBeGlzKTtcblxuICB2YXIgdGV4dExlbmd0aHMgPSBbXTtcblxuICB4QXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgIC5hdHRyKFwieVwiLCB4QXhpc1NldHRpbmdzLmJhck9mZnNldClcbiAgICAuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHRleHRMZW5ndGhzLnB1c2goZDMuc2VsZWN0KHRoaXMpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpO1xuICAgIH0pO1xuXG4gIHZhciB0YWxsZXN0VGV4dCA9IHRleHRMZW5ndGhzLnJlZHVjZShmdW5jdGlvbihhLCBiKSB7IHJldHVybiAoYSA+IGIgPyBhIDogYikgfSk7XG5cbiAgb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQgPSB0YWxsZXN0VGV4dCArIHhBeGlzU2V0dGluZ3MuYmFyT2Zmc2V0O1xuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCJnXCIpXG4gICAgLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm1pbm9yXCIsIHRydWUpO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gbmVlZCB0aGlzIGZvciBmaXhlZC1oZWlnaHQgYmFyc1xuICBpZiAoIW9iai5leHBvcnRhYmxlIHx8IChvYmouZXhwb3J0YWJsZSAmJiAhb2JqLmV4cG9ydGFibGUuZHluYW1pY0hlaWdodCkpIHtcbiAgICB2YXIgdG90YWxCYXJIZWlnaHQgPSAob2JqLmRpbWVuc2lvbnMuYmFySGVpZ2h0ICogb2JqLmRhdGEuZGF0YS5sZW5ndGggKiBvYmouZGF0YS5zZXJpZXNBbW91bnQpO1xuICAgIHlTY2FsZS5yYW5nZVJvdW5kQmFuZHMoW3RvdGFsQmFySGVpZ2h0LCAwXSwgb2JqLmRpbWVuc2lvbnMuYmFuZHMucGFkZGluZywgb2JqLmRpbWVuc2lvbnMuYmFuZHMub3V0ZXJQYWRkaW5nKTtcbiAgICBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCA9IHRvdGFsQmFySGVpZ2h0IC0gKHRvdGFsQmFySGVpZ2h0ICogb2JqLmRpbWVuc2lvbnMuYmFuZHMub3V0ZXJQYWRkaW5nICogMik7XG4gIH1cblxuICB2YXIgeUF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgLnNjYWxlKHlTY2FsZSlcbiAgICAub3JpZW50KFwibGVmdFwiKTtcblxuICB2YXIgeUF4aXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cFwiICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJ5QXhpc1wiKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMClcIik7XG5cbiAgdmFyIHlBeGlzTm9kZSA9IHlBeGlzR3JvdXAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwieS1heGlzXCIpXG4gICAgLmNhbGwoeUF4aXMpO1xuXG4gIHlBeGlzTm9kZS5zZWxlY3RBbGwoXCJsaW5lXCIpLnJlbW92ZSgpO1xuICB5QXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKS5hdHRyKFwieFwiLCAwKTtcblxuICBpZiAob2JqLmRpbWVuc2lvbnMud2lkdGggPiBvYmoueUF4aXMud2lkdGhUaHJlc2hvbGQpIHtcbiAgICB2YXIgbWF4TGFiZWxXaWR0aCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAvIDMuNTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWF4TGFiZWxXaWR0aCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAvIDM7XG4gIH1cblxuICBpZiAoeUF4aXNOb2RlLm5vZGUoKS5nZXRCQm94KCkud2lkdGggPiBtYXhMYWJlbFdpZHRoKSB7XG4gICAgdmFyIHdyYXBUZXh0ID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLndyYXBUZXh0O1xuICAgIHlBeGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAuY2FsbCh3cmFwVGV4dCwgbWF4TGFiZWxXaWR0aClcbiAgICAgIC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdHNwYW5zID0gZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbChcInRzcGFuXCIpLFxuICAgICAgICAgICAgdHNwYW5Db3VudCA9IHRzcGFuc1swXS5sZW5ndGgsXG4gICAgICAgICAgICB0ZXh0SGVpZ2h0ID0gZDMuc2VsZWN0KHRoaXMpLm5vZGUoKS5nZXRCQm94KCkuaGVpZ2h0O1xuICAgICAgICBpZiAodHNwYW5Db3VudCA+IDEpIHtcbiAgICAgICAgICB0c3BhbnNcbiAgICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgICAgXCJ5XCI6ICgodGV4dEhlaWdodCAvIHRzcGFuQ291bnQpIC8gMikgLSAodGV4dEhlaWdodCAvIDIpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoID0geUF4aXNOb2RlLm5vZGUoKS5nZXRCQm94KCkud2lkdGg7XG5cbiAgeUF4aXNHcm91cC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIFwiLDApXCIpO1xuXG4gIHZhciB0aWNrRmluZGVyWCA9IGF4aXNNb2R1bGUudGlja0ZpbmRlclk7XG5cbiAgaWYgKG9iai54QXhpcy53aWR0aFRocmVzaG9sZCA+IG9iai5kaW1lbnNpb25zLndpZHRoKSB7XG4gICAgdmFyIHhBeGlzVGlja1NldHRpbmdzID0geyB0aWNrTG93ZXJCb3VuZDogMywgdGlja1VwcGVyQm91bmQ6IDgsIHRpY2tHb2FsOiA2IH07XG4gIH0gZWxzZSB7XG4gICAgdmFyIHhBeGlzVGlja1NldHRpbmdzID0geyB0aWNrTG93ZXJCb3VuZDogMywgdGlja1VwcGVyQm91bmQ6IDgsIHRpY2tHb2FsOiA0IH07XG4gIH1cblxuICB2YXIgdGlja3MgPSB0aWNrRmluZGVyWCh4U2NhbGUsIG9iai54QXhpcy50aWNrcywgeEF4aXNUaWNrU2V0dGluZ3MpO1xuXG4gIHhTY2FsZS5yYW5nZShbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldKTtcblxuICB4QXhpcy50aWNrVmFsdWVzKHRpY2tzKTtcblxuICB4QXhpc05vZGUuY2FsbCh4QXhpcyk7XG5cbiAgeEF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrIHRleHRcIilcbiAgICAuYXR0cihcInlcIiwgeEF4aXNTZXR0aW5ncy5iYXJPZmZzZXQpXG4gICAgLmNhbGwoYXhpc01vZHVsZS51cGRhdGVUZXh0WCwgeEF4aXNOb2RlLCBvYmosIHhBeGlzLCBvYmoueEF4aXMpO1xuXG4gIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS5keW5hbWljSGVpZ2h0KSB7XG4gICAgLy8gd29ya2luZyB3aXRoIGEgZHluYW1pYyBiYXIgaGVpZ2h0XG4gICAgeEF4aXNHcm91cFxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpICsgXCIpXCIpO1xuICB9IGVsc2Uge1xuICAgIC8vIHdvcmtpbmcgd2l0aCBhIGZpeGVkIGJhciBoZWlnaHRcbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArIHRvdGFsQmFySGVpZ2h0ICsgXCIpXCIpO1xuICB9XG5cbiAgdmFyIHhBeGlzV2lkdGggPSBkMy50cmFuc2Zvcm0oeEF4aXNHcm91cC5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMF0gKyB4QXhpc0dyb3VwLm5vZGUoKS5nZXRCQm94KCkud2lkdGg7XG5cbiAgaWYgKHhBeGlzV2lkdGggPiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkpIHtcblxuICAgIHhTY2FsZS5yYW5nZShbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoeEF4aXNXaWR0aCAtIG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSldKTtcblxuICAgIHhBeGlzTm9kZS5jYWxsKHhBeGlzKTtcblxuICAgIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCIudGljayB0ZXh0XCIpXG4gICAgICAuYXR0cihcInlcIiwgeEF4aXNTZXR0aW5ncy5iYXJPZmZzZXQpXG4gICAgICAuY2FsbChheGlzTW9kdWxlLnVwZGF0ZVRleHRYLCB4QXhpc05vZGUsIG9iaiwgeEF4aXMsIG9iai54QXhpcyk7XG5cbiAgfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIpO1xuXG4gIHZhciBzaW5nbGVCYXIgPSB5U2NhbGUucmFuZ2VCYW5kKCkgLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmouZGF0YS5zZXJpZXNBbW91bnQ7IGkrKykge1xuXG4gICAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIGkpO1xuXG4gICAgdmFyIGJhckl0ZW0gPSBzZXJpZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJiYXJcIilcbiAgICAgIC5kYXRhKG9iai5kYXRhLmRhdGEpLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiYmFyIFwiICsgb2JqLnByZWZpeCArIFwiYmFyLVwiICsgKGkpLFxuICAgICAgICBcImRhdGEtc2VyaWVzXCI6IGksXG4gICAgICAgIFwiZGF0YS1rZXlcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0sXG4gICAgICAgIFwiZGF0YS1sZWdlbmRcIjogZnVuY3Rpb24oKSB7IHJldHVybiBvYmouZGF0YS5rZXlzW2kgKyAxXTsgfSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZSgwLFwiICsgeVNjYWxlKGQua2V5KSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGJhckl0ZW0uYXBwZW5kKFwicmVjdFwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gZC5zZXJpZXNbaV0udmFsIDwgMCA/IFwibmVnYXRpdmVcIiA6IFwicG9zaXRpdmVcIjtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4geFNjYWxlKE1hdGgubWluKDAsIGQuc2VyaWVzW2ldLnZhbCkpO1xuICAgICAgICB9LFxuICAgICAgICBcInlcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGkgKiBzaW5nbGVCYXI7XG4gICAgICAgIH0sXG4gICAgICAgIFwid2lkdGhcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBNYXRoLmFicyh4U2NhbGUoZC5zZXJpZXNbaV0udmFsKSAtIHhTY2FsZSgwKSk7XG4gICAgICAgIH0sXG4gICAgICAgIFwiaGVpZ2h0XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHNpbmdsZUJhcjsgfVxuICAgICAgfSk7XG5cbiAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgdmFyIGJhck9mZnNldCA9IG9iai5kaW1lbnNpb25zLmJhbmRzLm9mZnNldDtcbiAgICAgIGJhckl0ZW0uc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICgoaSAqIHNpbmdsZUJhcikgKyAoc2luZ2xlQmFyICogKGJhck9mZnNldCAvIDIpKSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImhlaWdodFwiOiBzaW5nbGVCYXIgLSAoc2luZ2xlQmFyICogYmFyT2Zmc2V0KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCJnXCIpXG4gICAgLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm1pbm9yXCIsIHRydWUpO1xuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCJsaW5lXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ5MVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLmR5bmFtaWNIZWlnaHQpIHtcbiAgICAgICAgICAvLyBkeW5hbWljIGhlaWdodCwgc28gY2FsY3VsYXRlIHdoZXJlIHRoZSB5MSBzaG91bGQgZ29cbiAgICAgICAgICByZXR1cm4gLShvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpIC0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGZpeGVkIGhlaWdodCwgc28gdXNlIHRoYXRcbiAgICAgICAgICByZXR1cm4gLSh0b3RhbEJhckhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcInkyXCI6IDBcbiAgfSk7XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLmR5bmFtaWNIZWlnaHQpIHtcblxuICAgIC8vIGR5bmFtaWMgaGVpZ2h0LCBvbmx5IG5lZWQgdG8gdHJhbnNmb3JtIHgtYXhpcyBncm91cFxuICAgIHhBeGlzR3JvdXBcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkgKyBcIilcIik7XG5cbiAgfSBlbHNlIHtcblxuICAgIC8vIGZpeGVkIGhlaWdodCwgc28gdHJhbnNmb3JtIGFjY29yZGluZ2x5IGFuZCBtb2RpZnkgdGhlIGRpbWVuc2lvbiBmdW5jdGlvbiBhbmQgcGFyZW50IHJlY3RzXG5cbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArIHRvdGFsQmFySGVpZ2h0ICsgXCIpXCIpO1xuXG4gICAgb2JqLmRpbWVuc2lvbnMudG90YWxYQXhpc0hlaWdodCA9IHhBeGlzR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnRvdGFsWEF4aXNIZWlnaHQ7IH07XG5cbiAgICBkMy5zZWxlY3Qobm9kZS5ub2RlKCkucGFyZW50Tm9kZSlcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFyZ2luID0gb2JqLmRpbWVuc2lvbnMubWFyZ2luO1xuICAgICAgICByZXR1cm4gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tO1xuICAgICAgfSk7XG5cbiAgICBkMy5zZWxlY3Qobm9kZS5ub2RlKCkucGFyZW50Tm9kZSkuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwiYmdcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJoZWlnaHRcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKVxuICAgICAgfSk7XG5cbiAgfVxuXG4gIHZhciB4QXhpc09iaiA9IHsgbm9kZTogeEF4aXNHcm91cCwgYXhpczogeEF4aXMgfSxcbiAgICAgIHlBeGlzT2JqID0geyBub2RlOiB5QXhpc0dyb3VwLCBheGlzOiB5QXhpcyB9O1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeEF4aXNPYmosIFwieEF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICBzaW5nbGVCYXI6IHNpbmdsZUJhcixcbiAgICBiYXJJdGVtOiBiYXJJdGVtXG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXJDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL2Jhci5qc1xuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBTdGFja2VkQ29sdW1uQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGUsXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgc3dpdGNoIChvYmoueEF4aXMuc2NhbGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuXG4gICAgICB2YXIgdGltZUludGVydmFsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVJbnRlcnZhbCxcbiAgICAgICAgICB0aW1lRWxhcHNlZCA9IHRpbWVJbnRlcnZhbChvYmouZGF0YS5kYXRhKTtcbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIHRpbWVFbGFwc2VkO1xuXG4gICAgICB4QXhpc09iai5yYW5nZSA9IFswLCAob2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSBzaW5nbGVDb2x1bW4pXTtcblxuICAgICAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcblxuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IHhTY2FsZShvYmouZGF0YS5kYXRhWzFdLmtleSkgLSB4U2NhbGUob2JqLmRhdGEuZGF0YVswXS5rZXkpO1xuXG4gICAgICBub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXAuXCIgKyBvYmoucHJlZml4ICsgXCJ4QXhpc1wiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIChzaW5nbGVDb2x1bW4gLyAyKSkgKyBcIixcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpIC0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpICsgXCIpXCIpO1xuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IHhTY2FsZS5yYW5nZUJhbmQoKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeE9mZnNldDtcbiAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgPT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAvIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeE9mZnNldCArIFwiLDApXCI7XG4gICAgfSk7XG5cbiAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLnNlbGVjdEFsbChcImcuXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNcIilcbiAgICAuZGF0YShvYmouZGF0YS5zdGFja2VkRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJzZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyAoaSk7IH0pO1xuXG4gIHZhciBjb2x1bW5JdGVtID0gc2VyaWVzXG4gICAgLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJjb2x1bW4gXCIgKyBvYmoucHJlZml4ICsgXCJjb2x1bW4tXCIgKyAoaSkgfSxcbiAgICAgIFwiZGF0YS1rZXlcIjogZnVuY3Rpb24oZCwgaSwgaikgeyByZXR1cm4gZFtqXS54OyB9LFxuICAgICAgXCJkYXRhLWxlZ2VuZFwiOiBmdW5jdGlvbihkLCBpLCBqKSB7IHJldHVybiBkW2pdLmxlZ2VuZDsgfSxcbiAgICB9KTtcblxuICB2YXIgcmVjdCA9IGNvbHVtbkl0ZW0uc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgIC5kYXRhKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pXG4gICAgLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieFwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC54KTsgfSxcbiAgICAgIFwieVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoTWF0aC5tYXgoMCwgZC55MCArIGQueSkpOyB9LFxuICAgICAgXCJoZWlnaHRcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gTWF0aC5hYnMoeVNjYWxlKGQueSkgLSB5U2NhbGUoMCkpOyB9LFxuICAgICAgXCJ3aWR0aFwiOiBzaW5nbGVDb2x1bW5cbiAgICB9KTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICByZWN0OiByZWN0XG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGFja2VkQ29sdW1uQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9zdGFja2VkLWNvbHVtbi5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBTdHJlYW1ncmFwaENoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLCB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgaWYgKHhTY2FsZU9iai5vYmoudHlwZSA9PT0gXCJvcmRpbmFsXCIpIHtcbiAgICB4U2NhbGUucmFuZ2VSb3VuZFBvaW50cyhbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldLCAxLjApO1xuICB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIlxuICAgIH19KTtcblxuICAvLyBBZGQgYSBncm91cCBmb3IgZWFjaCBjYXVzZS5cbiAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLnNlbGVjdEFsbChcImcuXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNcIilcbiAgICAuZGF0YShvYmouZGF0YS5zdGFja2VkRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJzZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyAoaSk7IH0pO1xuXG4gIHZhciBhcmVhID0gZDMuc3ZnLmFyZWEoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9KVxuICAgIC55MChmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55MCk7IH0pXG4gICAgLnkxKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwICsgZC55KTsgfSk7XG5cbiAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTAgKyBkLnkpOyB9KTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInN0cmVhbS1zZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzdHJlYW0tXCIgKyAoaSk7XG4gICAgICBpZiAoaSA9PT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG4gICAgICAgIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInN0cmVhbS1zZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzdHJlYW0tXCIgKyAoaSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwiZFwiLCBhcmVhKTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJzdHJlYW0tc2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwibGluZVwiOyB9KVxuICAgIC5hdHRyKFwiZFwiLCBsaW5lKTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICBsaW5lOiBsaW5lLFxuICAgIGFyZWE6IGFyZWFcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW1ncmFwaENoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGguanNcbiAqKiBtb2R1bGUgaWQgPSAyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gcXVhbGlmaWVyQ29tcG9uZW50KG5vZGUsIG9iaikge1xuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlICE9PSBcImJhclwiKSB7XG5cbiAgICB2YXIgeUF4aXNOb2RlID0gbm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ5QXhpc1wiKTtcblxuICAgIGlmIChvYmouZWRpdGFibGUpIHtcblxuICAgICAgdmFyIGZvcmVpZ25PYmplY3QgPSB5QXhpc05vZGUuYXBwZW5kKFwiZm9yZWlnbk9iamVjdFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJmbyBcIiArIG9iai5wcmVmaXggKyBcInF1YWxpZmllclwiLFxuICAgICAgICAgIFwid2lkdGhcIjogXCIxMDAlXCJcbiAgICAgICAgfSk7XG5cbiAgICAgIHZhciBmb3JlaWduT2JqZWN0R3JvdXAgPSBmb3JlaWduT2JqZWN0LmFwcGVuZChcInhodG1sOmRpdlwiKVxuICAgICAgICAuYXR0cihcInhtbG5zXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiKTtcblxuICAgICAgdmFyIHF1YWxpZmllckZpZWxkID0gZm9yZWlnbk9iamVjdEdyb3VwLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXIgZWRpdGFibGUtY2hhcnRfcXVhbGlmaWVyXCIsXG4gICAgICAgICAgXCJjb250ZW50RWRpdGFibGVcIjogdHJ1ZSxcbiAgICAgICAgICBcInhtbG5zXCI6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiXG4gICAgICAgIH0pXG4gICAgICAgIC50ZXh0KG9iai5xdWFsaWZpZXIpO1xuXG4gICAgICBmb3JlaWduT2JqZWN0XG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcIndpZHRoXCI6IHF1YWxpZmllckZpZWxkLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIDE1LFxuICAgICAgICAgIFwiaGVpZ2h0XCI6IHF1YWxpZmllckZpZWxkLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyAoIC0gKHF1YWxpZmllckZpZWxkLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpIC8gMiApICsgXCIpXCJcbiAgICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB2YXIgcXVhbGlmaWVyQmcgPSB5QXhpc05vZGUuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImNoYXJ0X3F1YWxpZmllci10ZXh0LWJnXCIpXG4gICAgICAgIC50ZXh0KG9iai5xdWFsaWZpZXIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImR5XCI6IFwiMC4zMmVtXCIsXG4gICAgICAgICAgXCJ5XCI6IFwiMFwiLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLCAwKVwiXG4gICAgICAgIH0pO1xuXG4gICAgICB2YXIgcXVhbGlmaWVyVGV4dCA9IHlBeGlzTm9kZS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiY2hhcnRfcXVhbGlmaWVyLXRleHRcIilcbiAgICAgICAgLnRleHQob2JqLnF1YWxpZmllcilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiZHlcIjogXCIwLjMyZW1cIixcbiAgICAgICAgICBcInlcIjogXCIwXCIsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsIDApXCJcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcXVhbGlmaWVyQmc6IHF1YWxpZmllckJnLFxuICAgIHF1YWxpZmllclRleHQ6IHF1YWxpZmllclRleHRcbiAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHF1YWxpZmllckNvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcXVhbGlmaWVyLmpzXG4gKiogbW9kdWxlIGlkID0gMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogVGlwcyBoYW5kbGluZyBtb2R1bGUuXG4gKiBAbW9kdWxlIGNoYXJ0cy9jb21wb25lbnRzL3RpcHNcbiAqL1xuXG5mdW5jdGlvbiBiaXNlY3RvcihkYXRhLCBrZXlWYWwsIHN0YWNrZWQsIGluZGV4KSB7XG4gIGlmIChzdGFja2VkKSB7XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIHZhciBiaXNlY3QgPSBkMy5iaXNlY3RvcihmdW5jdGlvbihkKSB7IHJldHVybiBkLng7IH0pLmxlZnQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnIucHVzaChiaXNlY3QoZGF0YVtpXSwga2V5VmFsKSk7XG4gICAgfTtcbiAgICByZXR1cm4gYXJyO1xuICB9IGVsc2Uge1xuICAgIHZhciBiaXNlY3QgPSBkMy5iaXNlY3RvcihmdW5jdGlvbihkKSB7IHJldHVybiBkLmtleTsgfSkubGVmdDtcbiAgICByZXR1cm4gYmlzZWN0KGRhdGEsIGtleVZhbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3Vyc29yUG9zKG92ZXJsYXkpIHtcbiAgcmV0dXJuIHtcbiAgICB4OiBkMy5tb3VzZShvdmVybGF5Lm5vZGUoKSlbMF0sXG4gICAgeTogZDMubW91c2Uob3ZlcmxheS5ub2RlKCkpWzFdXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFRpcERhdGEob2JqLCBjdXJzb3IpIHtcblxuICB2YXIgeFNjYWxlT2JqID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLFxuICAgICAgc2NhbGVUeXBlID0geFNjYWxlT2JqLm9iai50eXBlO1xuXG4gIHZhciB4VmFsO1xuXG4gIGlmIChzY2FsZVR5cGUgPT09IFwib3JkaW5hbC10aW1lXCIgfHwgc2NhbGVUeXBlID09PSBcIm9yZGluYWxcIikge1xuXG4gICAgdmFyIG9yZGluYWxCaXNlY3Rpb24gPSBkMy5iaXNlY3RvcihmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KS5sZWZ0LFxuICAgICAgICByYW5nZVBvcyA9IG9yZGluYWxCaXNlY3Rpb24oeFNjYWxlLnJhbmdlKCksIGN1cnNvci54KTtcblxuICAgIHhWYWwgPSB4U2NhbGUuZG9tYWluKClbcmFuZ2VQb3NdO1xuXG4gIH0gZWxzZSB7XG4gICAgeFZhbCA9IHhTY2FsZS5pbnZlcnQoY3Vyc29yLngpO1xuICB9XG5cbiAgdmFyIHRpcERhdGE7XG5cbiAgaWYgKG9iai5vcHRpb25zLnN0YWNrZWQpIHtcbiAgICB2YXIgZGF0YSA9IG9iai5kYXRhLnN0YWNrZWREYXRhO1xuICAgIHZhciBpID0gYmlzZWN0b3IoZGF0YSwgeFZhbCwgb2JqLm9wdGlvbnMuc3RhY2tlZCk7XG5cbiAgICB2YXIgYXJyID0gW10sXG4gICAgICAgIHJlZkluZGV4O1xuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBkYXRhLmxlbmd0aDsgaysrKSB7XG4gICAgICBpZiAocmVmSW5kZXgpIHtcbiAgICAgICAgYXJyLnB1c2goZGF0YVtrXVtyZWZJbmRleF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGQwID0gZGF0YVtrXVtpW2tdIC0gMV0sXG4gICAgICAgICAgICBkMSA9IGRhdGFba11baVtrXV07XG4gICAgICAgIHJlZkluZGV4ID0geFZhbCAtIGQwLnggPiBkMS54IC0geFZhbCA/IGlba10gOiAoaVtrXSAtIDEpO1xuICAgICAgICBhcnIucHVzaChkYXRhW2tdW3JlZkluZGV4XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGlwRGF0YSA9IGFycjtcblxuICB9IGVsc2Uge1xuICAgIHZhciBkYXRhID0gb2JqLmRhdGEuZGF0YTtcbiAgICB2YXIgaSA9IGJpc2VjdG9yKGRhdGEsIHhWYWwpO1xuICAgIHZhciBkMCA9IGRhdGFbaSAtIDFdLFxuICAgICAgICBkMSA9IGRhdGFbaV07XG5cbiAgICB0aXBEYXRhID0geFZhbCAtIGQwLmtleSA+IGQxLmtleSAtIHhWYWwgPyBkMSA6IGQwO1xuICB9XG5cbiAgcmV0dXJuIHRpcERhdGE7XG5cbn1cblxuZnVuY3Rpb24gc2hvd1RpcHModGlwTm9kZXMsIG9iaikge1xuXG4gIGlmICh0aXBOb2Rlcy54VGlwTGluZSkge1xuICAgIHRpcE5vZGVzLnhUaXBMaW5lLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIHRydWUpO1xuICB9XG5cbiAgaWYgKHRpcE5vZGVzLnRpcEJveCkge1xuICAgIHRpcE5vZGVzLnRpcEJveC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCB0cnVlKTtcbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlcykge1xuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIHRydWUpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gaGlkZVRpcHModGlwTm9kZXMsIG9iaikge1xuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlID09PSBcImNvbHVtblwiKSB7XG4gICAgaWYob2JqLm9wdGlvbnMuc3RhY2tlZCl7XG4gICAgICBvYmoucmVuZGVyZWQucGxvdC5zZXJpZXMuc2VsZWN0QWxsKFwicmVjdFwiKS5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm11dGVkXCIsIGZhbHNlKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIG9iai5yZW5kZXJlZC5wbG90LmNvbHVtbkl0ZW0uc2VsZWN0QWxsKFwicmVjdFwiKS5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm11dGVkXCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy54VGlwTGluZSkge1xuICAgIHRpcE5vZGVzLnhUaXBMaW5lLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZhbHNlKTtcbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy50aXBCb3gpIHtcbiAgICB0aXBOb2Rlcy50aXBCb3guY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZmFsc2UpO1xuICB9XG5cbiAgaWYgKHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzKSB7XG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXMuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZmFsc2UpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gbW91c2VJZGxlKHRpcE5vZGVzLCBvYmopIHtcbiAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgaGlkZVRpcHModGlwTm9kZXMsIG9iaik7XG4gIH0sIG9iai50aXBUaW1lb3V0KTtcbn1cblxudmFyIHRpbWVvdXQ7XG5cbmZ1bmN0aW9uIHRpcHNNYW5hZ2VyKG5vZGUsIG9iaikge1xuXG4gIHZhciB0aXBOb2RlcyA9IGFwcGVuZFRpcEdyb3VwKG5vZGUsIG9iaik7XG5cbiAgdmFyIGZucyA9IHtcbiAgICBsaW5lOiBMaW5lQ2hhcnRUaXBzLFxuICAgIG11bHRpbGluZTogTGluZUNoYXJ0VGlwcyxcbiAgICBhcmVhOiBvYmoub3B0aW9ucy5zdGFja2VkID8gU3RhY2tlZEFyZWFDaGFydFRpcHMgOiBBcmVhQ2hhcnRUaXBzLFxuICAgIGNvbHVtbjogb2JqLm9wdGlvbnMuc3RhY2tlZCA/IFN0YWNrZWRDb2x1bW5DaGFydFRpcHMgOiBDb2x1bW5DaGFydFRpcHMsXG4gICAgc3RyZWFtOiBTdHJlYW1ncmFwaFRpcHNcbiAgfTtcblxuICB2YXIgZGF0YVJlZmVyZW5jZTtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSA9PT0gXCJtdWx0aWxpbmVcIikge1xuICAgIGRhdGFSZWZlcmVuY2UgPSBbb2JqLmRhdGEuZGF0YVswXS5zZXJpZXNbMF1dO1xuICB9IGVsc2Uge1xuICAgIGRhdGFSZWZlcmVuY2UgPSBvYmouZGF0YS5kYXRhWzBdLnNlcmllcztcbiAgfVxuXG4gIHZhciBpbm5lclRpcEVsZW1lbnRzID0gYXBwZW5kVGlwRWxlbWVudHMobm9kZSwgb2JqLCB0aXBOb2RlcywgZGF0YVJlZmVyZW5jZSk7XG5cbiAgc3dpdGNoIChvYmoub3B0aW9ucy50eXBlKSB7XG4gICAgY2FzZSBcImxpbmVcIjpcbiAgICBjYXNlIFwibXVsdGlsaW5lXCI6XG4gICAgY2FzZSBcImFyZWFcIjpcbiAgICBjYXNlIFwic3RyZWFtXCI6XG5cbiAgICAgIHRpcE5vZGVzLm92ZXJsYXkgPSB0aXBOb2Rlcy50aXBOb2RlLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwX292ZXJsYXlcIixcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwid2lkdGhcIjogb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCksXG4gICAgICAgICAgXCJoZWlnaHRcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKVxuICAgICAgICB9KTtcblxuICAgICAgdGlwTm9kZXMub3ZlcmxheVxuICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKSB7IHNob3dUaXBzKHRpcE5vZGVzLCBvYmopOyB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHsgaGlkZVRpcHModGlwTm9kZXMsIG9iaik7IH0pXG4gICAgICAgIC5vbihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzaG93VGlwcyh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG1vdXNlSWRsZSh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgICByZXR1cm4gZm5zW29iai5vcHRpb25zLnR5cGVdKHRpcE5vZGVzLCBpbm5lclRpcEVsZW1lbnRzLCBvYmopO1xuICAgICAgICB9KTtcblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiY29sdW1uXCI6XG5cbiAgICAgIHZhciBjb2x1bW5SZWN0cztcblxuICAgICAgaWYgKG9iai5vcHRpb25zLnN0YWNrZWQpIHtcbiAgICAgICAgY29sdW1uUmVjdHMgPSBvYmoucmVuZGVyZWQucGxvdC5zZXJpZXMuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3QuY29sdW1uSXRlbS5zZWxlY3RBbGwoJ3JlY3QnKTtcbiAgICAgIH1cblxuICAgICAgY29sdW1uUmVjdHNcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBzaG93VGlwcyh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG1vdXNlSWRsZSh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgICBmbnMuY29sdW1uKHRpcE5vZGVzLCBvYmosIGQsIHRoaXMpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaGlkZVRpcHModGlwTm9kZXMsIG9iaik7XG4gICAgICAgIH0pO1xuXG4gICAgICBicmVhaztcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFRpcEdyb3VwKG5vZGUsIG9iaikge1xuXG4gIHZhciBzdmdOb2RlID0gZDMuc2VsZWN0KG5vZGUubm9kZSgpLnBhcmVudE5vZGUpLFxuICAgICAgY2hhcnROb2RlID0gZDMuc2VsZWN0KG5vZGUubm9kZSgpLnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG5cbiAgdmFyIHRpcE5vZGUgPSBzdmdOb2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIG9iai5kaW1lbnNpb25zLm1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy5tYXJnaW4udG9wICsgXCIpXCIsXG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcInRpcFwiXG4gICAgfSlcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJ0aXBfc3RhY2tlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBvYmoub3B0aW9ucy5zdGFja2VkID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH0pO1xuXG4gIHZhciB4VGlwTGluZSA9IHRpcE5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX2xpbmUteFwiKVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmYWxzZSk7XG5cbiAgeFRpcExpbmUuYXBwZW5kKFwibGluZVwiKTtcblxuICB2YXIgdGlwQm94ID0gdGlwTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0aXBfYm94XCIsXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiXG4gICAgfSk7XG5cbiAgdmFyIHRpcFJlY3QgPSB0aXBCb3guYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwX3JlY3RcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKDAsMClcIixcbiAgICAgIFwid2lkdGhcIjogMSxcbiAgICAgIFwiaGVpZ2h0XCI6IDFcbiAgICB9KTtcblxuICB2YXIgdGlwR3JvdXAgPSB0aXBCb3guYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX2dyb3VwXCIpO1xuXG4gIHZhciBsZWdlbmRJY29uID0gY2hhcnROb2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtX2ljb25cIikubm9kZSgpO1xuXG4gIGlmIChsZWdlbmRJY29uKSB7XG4gICAgdmFyIHJhZGl1cyA9IGxlZ2VuZEljb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLyAyO1xuICB9IGVsc2Uge1xuICAgIHZhciByYWRpdXMgPSAwO1xuICB9XG5cbiAgdmFyIHRpcFBhdGhDaXJjbGVzID0gdGlwTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGUtZ3JvdXBcIik7XG5cbiAgdmFyIHRpcFRleHREYXRlID0gdGlwR3JvdXBcbiAgICAuaW5zZXJ0KFwiZ1wiLCBcIjpmaXJzdC1jaGlsZFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZGF0ZS1ncm91cFwiKVxuICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1kYXRlXCIsXG4gICAgICBcInhcIjogMCxcbiAgICAgIFwieVwiOiAwLFxuICAgICAgXCJkeVwiOiBcIjFlbVwiXG4gICAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdmc6IHN2Z05vZGUsXG4gICAgdGlwTm9kZTogdGlwTm9kZSxcbiAgICB4VGlwTGluZTogeFRpcExpbmUsXG4gICAgdGlwQm94OiB0aXBCb3gsXG4gICAgdGlwUmVjdDogdGlwUmVjdCxcbiAgICB0aXBHcm91cDogdGlwR3JvdXAsXG4gICAgbGVnZW5kSWNvbjogbGVnZW5kSWNvbixcbiAgICB0aXBQYXRoQ2lyY2xlczogdGlwUGF0aENpcmNsZXMsXG4gICAgcmFkaXVzOiByYWRpdXMsXG4gICAgdGlwVGV4dERhdGU6IHRpcFRleHREYXRlXG4gIH07XG5cbn1cblxuZnVuY3Rpb24gYXBwZW5kVGlwRWxlbWVudHMobm9kZSwgb2JqLCB0aXBOb2RlcywgZGF0YVJlZikge1xuXG4gIHZhciB0aXBUZXh0R3JvdXBDb250YWluZXIgPSB0aXBOb2Rlcy50aXBHcm91cFxuICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cC1jb250YWluZXJcIjtcbiAgICB9KTtcblxuICB2YXIgdGlwVGV4dEdyb3VwcyA9IHRpcFRleHRHcm91cENvbnRhaW5lclxuICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cFwiKVxuICAgIC5kYXRhKGRhdGFSZWYpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgcmV0dXJuIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIFwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAtXCIgKyAoaSk7XG4gICAgfSk7XG5cbiAgdmFyIGxpbmVIZWlnaHQ7XG5cbiAgdGlwVGV4dEdyb3Vwcy5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWw7IH0pXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAob2JqLnByZWZpeCArIFwidGlwX3RleHQgXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1cIiArIChpKSk7XG4gICAgICB9LFxuICAgICAgXCJkYXRhLXNlcmllc1wiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBkLmtleTsgfSxcbiAgICAgIFwieFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICh0aXBOb2Rlcy5yYWRpdXMgKiAyKSArICh0aXBOb2Rlcy5yYWRpdXMgLyAxLjUpO1xuICAgICAgfSxcbiAgICAgIFwieVwiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIGxpbmVIZWlnaHQgPSBsaW5lSGVpZ2h0IHx8IHBhcnNlSW50KGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImxpbmUtaGVpZ2h0XCIpKTtcbiAgICAgICAgcmV0dXJuIChpICsgMSkgKiBsaW5lSGVpZ2h0O1xuICAgICAgfSxcbiAgICAgIFwiZHlcIjogXCIxZW1cIlxuICAgIH0pO1xuXG4gIHRpcFRleHRHcm91cHNcbiAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAob2JqLnByZWZpeCArIFwidGlwX2NpcmNsZSBcIiArIG9iai5wcmVmaXggKyBcInRpcF9jaXJjbGUtXCIgKyAoaSkpO1xuICAgICAgfSxcbiAgICAgIFwiclwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiB0aXBOb2Rlcy5yYWRpdXM7IH0sXG4gICAgICBcImN4XCI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGlwTm9kZXMucmFkaXVzOyB9LFxuICAgICAgXCJjeVwiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAoKGkgKyAxKSAqIGxpbmVIZWlnaHQpICsgKHRpcE5vZGVzLnJhZGl1cyAqIDEuNSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgLmRhdGEoZGF0YVJlZilcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGUgXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGUtXCIgKyAoaSkpO1xuICAgICAgfSxcbiAgICAgIFwiclwiOiAodGlwTm9kZXMucmFkaXVzIC8gMikgfHwgMi41XG4gICAgfSk7XG5cbiAgcmV0dXJuIHRpcFRleHRHcm91cHM7XG5cbn1cblxuZnVuY3Rpb24gTGluZUNoYXJ0VGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoZC52YWwpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJuL2FcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3A7XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7IH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAoZC52YWwpIHsgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZShkLnZhbCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieTFcIjogMCxcbiAgICAgICAgXCJ5MlwiOiBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gQXJlYUNoYXJ0VGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoZC52YWwpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJuL2FcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3A7XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7IH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAoZC52YWwpIHsgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZShkLnZhbCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieTFcIjogMCxcbiAgICAgICAgXCJ5MlwiOiBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gU3RhY2tlZEFyZWFDaGFydFRpcHModGlwTm9kZXMsIGlubmVyVGlwRWxzLCBvYmopIHtcblxuICB2YXIgY3Vyc29yID0gY3Vyc29yUG9zKHRpcE5vZGVzLm92ZXJsYXkpLFxuICAgICAgdGlwRGF0YSA9IGdldFRpcERhdGEob2JqLCBjdXJzb3IpO1xuXG4gIHZhciBpc1VuZGVmaW5lZCA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXBEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGFbaV0ueSA9PT0gTmFOIHx8IHRpcERhdGFbaV0ueTAgPT09IE5hTikge1xuICAgICAgaXNVbmRlZmluZWQrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNVbmRlZmluZWQpIHtcblxuICAgIHZhciB5Rm9ybWF0dGVyID0gcmVxdWlyZShcIi4vYXhpc1wiKS5zZXRUaWNrRm9ybWF0WSxcbiAgICAgICAgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmY7XG4gICAgICAgIGRvbWFpbiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZS5kb21haW4oKSxcbiAgICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIHRleHRcIilcbiAgICAgIC5kYXRhKHRpcERhdGEpXG4gICAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG5cbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuXG4gICAgICAgIHZhciB0ZXh0O1xuXG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGlwRGF0YS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgdGV4dCA9IG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQucmF3LnNlcmllc1tpXS52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0ZXh0ID0gXCJuL2FcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChrID09PSBpKSB7XG4gICAgICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbal0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWhhc1VuZGVmaW5lZCAmJiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpKSB7XG4gICAgICAgICAgICAgIHRleHQgPSBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnJhdy5zZXJpZXNbaV0udmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dCA9IFwibi9hXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgIC5jYWxsKHRpcERhdGVGb3JtYXR0ZXIsIGN0eCwgb2JqLm1vbnRoc0FiciwgdGlwRGF0YVswXS54KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkLnJhdy5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIiAmJiAhaGFzVW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgeSA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wO1xuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlc1xuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF9wYXRoLWNpcmNsZVwiKVxuICAgICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIHZhciBoYXNVbmRlZmluZWQgPSAwO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgaGFzVW5kZWZpbmVkKys7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIgJiYgIWhhc1VuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUoZC54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICB2YXIgeSA9IGQueSB8fCAwLFxuICAgICAgICAgICAgICAgIHkwID0gZC55MCB8fCAwO1xuICAgICAgICAgICAgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZSh5ICsgeTApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBSZWN0XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwid2lkdGhcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5yaWdodCxcbiAgICAgICAgXCJoZWlnaHRcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5ib3R0b21cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMueFRpcExpbmUuc2VsZWN0KFwibGluZVwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIngxXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcInkxXCI6IDAsXG4gICAgICAgIFwieTJcIjogb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBCb3hcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCAtIGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gU3RyZWFtZ3JhcGhUaXBzKHRpcE5vZGVzLCBpbm5lclRpcEVscywgb2JqKSB7XG5cbiAgdmFyIGN1cnNvciA9IGN1cnNvclBvcyh0aXBOb2Rlcy5vdmVybGF5KSxcbiAgICAgIHRpcERhdGEgPSBnZXRUaXBEYXRhKG9iaiwgY3Vyc29yKTtcblxuICB2YXIgaXNVbmRlZmluZWQgPSAwO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGlwRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhW2ldLnkgPT09IE5hTiB8fCB0aXBEYXRhW2ldLnkwID09PSBOYU4pIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cblxuICAgICAgICB2YXIgdGV4dDtcblxuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRpcERhdGEubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIHRleHQgPSBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnJhdy5zZXJpZXNbaV0udmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dCA9IFwibi9hXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoayA9PT0gaSkge1xuICAgICAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYXNVbmRlZmluZWQgJiYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSkge1xuICAgICAgICAgICAgICB0ZXh0ID0gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC5yYXcuc2VyaWVzW2ldLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHQgPSBcIm4vYVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAuY2FsbCh0aXBEYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGFbMF0ueCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIgJiYgIWhhc1VuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHkgPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcDtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGVcIilcbiAgICAgICAgLmRhdGEodGlwRGF0YSlcbiAgICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiICYmICFoYXNVbmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjeFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKGQueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHRcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgdmFyIHkgPSBkLnkgfHwgMCxcbiAgICAgICAgICAgICAgICB5MCA9IGQueTAgfHwgMDtcbiAgICAgICAgICAgIHJldHVybiBvYmoucmVuZGVyZWQucGxvdC55U2NhbGVPYmouc2NhbGUoeSArIHkwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ4MlwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIENvbHVtbkNoYXJ0VGlwcyh0aXBOb2Rlcywgb2JqLCBkLCB0aGlzUmVmKSB7XG5cbiAgdmFyIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3QuY29sdW1uSXRlbS5zZWxlY3RBbGwoJ3JlY3QnKSxcbiAgICAgIGlzVW5kZWZpbmVkID0gMDtcblxuICB2YXIgdGhpc0NvbHVtbiA9IHRoaXNSZWYsXG4gICAgICB0aXBEYXRhID0gZDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGdldFRyYW5zbGF0ZVhZID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLmdldFRyYW5zbGF0ZVhZLFxuICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHZhciBjdXJzb3JYID0gZ2V0VHJhbnNsYXRlWFkodGhpc0NvbHVtbi5wYXJlbnROb2RlKTtcblxuICAgIGNvbHVtblJlY3RzXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgJ211dGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMgPT09IHRoaXNDb2x1bW4pID8gZmFsc2UgOiB0cnVlO1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcblxuICAgICAgICBpZiAoIW9iai55QXhpcy5wcmVmaXgpIHsgb2JqLnlBeGlzLnByZWZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKCFvYmoueUF4aXMuc3VmZml4KSB7IG9iai55QXhpcy5zdWZmaXggPSBcIlwiOyB9XG5cbiAgICAgICAgaWYgKGQudmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQudmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwibi9hXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgaWYob2JqLmRhdGVGb3JtYXQgIT09IHVuZGVmaW5lZCl7XG4gICAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgICAuY2FsbCh0aXBEYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGEua2V5KTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAgIC50ZXh0KHRpcERhdGEua2V5KTtcbiAgICB9XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuXG4gICAgICAgICAgaWYoeCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMil7XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgc2hvd1RpcHModGlwTm9kZXMsIG9iaik7XG5cbiAgfVxuXG59XG5cblxuZnVuY3Rpb24gU3RhY2tlZENvbHVtbkNoYXJ0VGlwcyh0aXBOb2Rlcywgb2JqLCBkLCB0aGlzUmVmKSB7XG5cbiAgdmFyIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3Quc2VyaWVzLnNlbGVjdEFsbCgncmVjdCcpLFxuICAgICAgaXNVbmRlZmluZWQgPSAwO1xuXG4gIHZhciB0aGlzQ29sdW1uUmVjdCA9IHRoaXNSZWYsXG4gICAgICB0aXBEYXRhID0gZDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEucmF3LnNlcmllcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhLnJhdy5zZXJpZXNbaV0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgaXNVbmRlZmluZWQrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNVbmRlZmluZWQpIHtcblxuICAgIHZhciB5Rm9ybWF0dGVyID0gcmVxdWlyZShcIi4vYXhpc1wiKS5zZXRUaWNrRm9ybWF0WSxcbiAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmLFxuICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHZhciBwYXJlbnRFbCA9IGQzLnNlbGVjdCh0aGlzQ29sdW1uUmVjdC5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgIHZhciByZWZQb3MgPSBkMy5zZWxlY3QodGhpc0NvbHVtblJlY3QpLmF0dHIoXCJ4XCIpO1xuXG4gICAgdmFyIHRoaXNDb2x1bW5LZXkgPSAnJztcblxuICAgIC8qIEZpZ3VyZSBvdXQgd2hpY2ggc3RhY2sgdGhpcyBzZWxlY3RlZCByZWN0IGlzIGluIHRoZW4gbG9vcCBiYWNrIHRocm91Z2ggYW5kICh1bilhc3NpZ24gbXV0ZWQgY2xhc3MgKi9cbiAgICBjb2x1bW5SZWN0cy5jbGFzc2VkKG9iai5wcmVmaXggKyAnbXV0ZWQnLGZ1bmN0aW9uIChkKSB7XG5cbiAgICAgIGlmKHRoaXMgPT09IHRoaXNDb2x1bW5SZWN0KXtcbiAgICAgICAgdGhpc0NvbHVtbktleSA9IGQucmF3LmtleTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICh0aGlzID09PSB0aGlzQ29sdW1uUmVjdCkgPyBmYWxzZSA6IHRydWU7XG5cbiAgICB9KTtcblxuICAgIGNvbHVtblJlY3RzLmNsYXNzZWQob2JqLnByZWZpeCArICdtdXRlZCcsZnVuY3Rpb24gKGQpIHtcblxuICAgICAgcmV0dXJuIChkLnJhdy5rZXkgPT09IHRoaXNDb2x1bW5LZXkpID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnJhdy5zZXJpZXMpXG4gICAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG5cbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuXG4gICAgICAgIGlmIChkLnZhbCkge1xuICAgICAgICAgIHJldHVybiBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIm4vYVwiO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGlmKG9iai5kYXRlRm9ybWF0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgICAudGV4dChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZCA9IHRpcERhdGEucmF3LmtleTtcbiAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIChvYmoucHJlZml4ICsgXCJ0aXBfY2lyY2xlIFwiICsgb2JqLnByZWZpeCArIFwidGlwX2NpcmNsZS1cIiArIChpKSk7XG4gICAgICAgIH0sXG4gICAgICAgIFwiclwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiB0aXBOb2Rlcy5yYWRpdXM7IH0sXG4gICAgICAgIFwiY3hcIjogZnVuY3Rpb24oKSB7IHJldHVybiB0aXBOb2Rlcy5yYWRpdXM7IH0sXG4gICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIHJldHVybiAoIChpICsgMSkgKiBwYXJzZUludChkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJmb250LXNpemVcIikpICogMS4xMyArIDkpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEucmF3LnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGlmIChyZWZQb3MgPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0IC0gZDMuc2VsZWN0KHRoaXMpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcblxuICAgICAgICB9XG5cbiAgICAgIH0pO1xuXG4gIH1cblxufVxuXG5mdW5jdGlvbiB0aXBEYXRlRm9ybWF0dGVyKHNlbGVjdGlvbiwgY3R4LCBtb250aHMsIGRhdGEpIHtcblxuICB2YXIgZE1vbnRoLFxuICAgICAgZERhdGUsXG4gICAgICBkWWVhcixcbiAgICAgIGRIb3VyLFxuICAgICAgZE1pbnV0ZTtcblxuICBzZWxlY3Rpb24udGV4dChmdW5jdGlvbigpIHtcbiAgICB2YXIgZCA9IGRhdGE7XG4gICAgdmFyIGRTdHI7XG4gICAgc3dpdGNoIChjdHgpIHtcbiAgICAgIGNhc2UgXCJ5ZWFyc1wiOlxuICAgICAgICBkU3RyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJtb250aHNcIjpcbiAgICAgICAgZE1vbnRoID0gbW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZSArIFwiLCBcIiArIGRZZWFyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ3ZWVrc1wiOlxuICAgICAgY2FzZSBcImRheXNcIjpcbiAgICAgICAgZE1vbnRoID0gbW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaG91cnNcIjpcblxuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICBkSG91ciA9IGQuZ2V0SG91cnMoKTtcbiAgICAgICAgZE1pbnV0ZSA9IGQuZ2V0TWludXRlcygpO1xuXG4gICAgICAgIHZhciBkSG91clN0cixcbiAgICAgICAgICBkTWludXRlU3RyO1xuXG4gICAgICAgIC8vIENvbnZlcnQgZnJvbSAyNGggdGltZVxuICAgICAgICB2YXIgc3VmZml4ID0gKGRIb3VyID49IDEyKSA/ICdwLm0uJyA6ICdhLm0uJztcblxuICAgICAgICBpZiAoZEhvdXIgPT09IDApIHtcbiAgICAgICAgICBkSG91clN0ciA9IDEyO1xuICAgICAgICB9IGVsc2UgaWYgKGRIb3VyID4gMTIpIHtcbiAgICAgICAgICBkSG91clN0ciA9IGRIb3VyIC0gMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSBkSG91cjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2UgbWludXRlcyBmb2xsb3cgR2xvYmUgc3R5bGVcbiAgICAgICAgaWYgKGRNaW51dGUgPT09IDApIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJyc7XG4gICAgICAgIH0gZWxzZSBpZiAoZE1pbnV0ZSA8IDEwKSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICc6MCcgKyBkTWludXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnOicgKyBkTWludXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZFN0ciA9IGRIb3VyU3RyICsgZE1pbnV0ZVN0ciArICcgJyArIHN1ZmZpeDtcblxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRTdHIgPSBkO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZFN0cjtcblxuICB9KTtcblxufVxuXG5cbi8vIFtmdW5jdGlvbiBCYXJDaGFydFRpcHModGlwTm9kZXMsIG9iaikge1xuXG4vLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gdGlwc01hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3RpcHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBTb2NpYWwgbW9kdWxlLlxuICogQG1vZHVsZSBjaGFydHMvY29tcG9uZW50cy9zb2NpYWxcbiAqL1xuXG4vKlxuVGhpcyBjb21wb25lbnQgYWRkcyBhIFwic29jaWFsXCIgYnV0dG9uIHRvIGVhY2ggY2hhcnQgd2hpY2ggY2FuIGJlIHRvZ2dsZWQgdG8gcHJlc2VudCB0aGUgdXNlciB3aXRoIHNvY2lhbCBzaGFyaW5nIG9wdGlvbnNcbiAqL1xuXG52YXIgZ2V0VGh1bWJuYWlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLmdldFRodW1ibmFpbFBhdGg7XG5cbmZ1bmN0aW9uIHNvY2lhbENvbXBvbmVudChub2RlLCBvYmopIHtcblxuXHR2YXIgc29jaWFsT3B0aW9ucyA9IFtdO1xuXG5cdGZvciAodmFyIHByb3AgaW4gb2JqLnNvY2lhbCkge1xuXHRcdGlmIChvYmouc29jaWFsW3Byb3BdKSB7XG5cdFx0XHRzd2l0Y2ggKG9iai5zb2NpYWxbcHJvcF0ubGFiZWwpIHtcblx0XHRcdFx0Y2FzZSBcIlR3aXR0ZXJcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdFR3aXR0ZXJVUkwob2JqKTtcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnBvcHVwID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIkZhY2Vib29rXCI6XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS51cmwgPSBjb25zdHJ1Y3RGYWNlYm9va1VSTChvYmopO1xuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0ucG9wdXAgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiRW1haWxcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdE1haWxVUkwob2JqKTtcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnBvcHVwID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJTTVNcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdFNNU1VSTChvYmopO1xuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0ucG9wdXAgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnSU5DT1JSRUNUIFNPQ0lBTCBJVEVNIERFRklOSVRJT04nKVxuXHRcdFx0fVxuXHRcdFx0c29jaWFsT3B0aW9ucy5wdXNoKG9iai5zb2NpYWxbcHJvcF0pO1xuXHRcdH1cblx0fVxuXG5cdHZhciBjaGFydENvbnRhaW5lciA9IGQzLnNlbGVjdChub2RlKTtcblxuICB2YXIgY2hhcnRNZXRhID0gY2hhcnRDb250YWluZXIuc2VsZWN0KCcuJyArIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YScpO1xuXG4gIGlmIChjaGFydE1ldGEubm9kZSgpID09PSBudWxsKSB7XG4gICAgY2hhcnRNZXRhID0gY2hhcnRDb250YWluZXJcbiAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGEnKTtcbiAgfVxuXG5cdHZhciBjaGFydFNvY2lhbEJ0biA9IGNoYXJ0TWV0YVxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9tZXRhX2J0bicpXG5cdFx0Lmh0bWwoJ3NoYXJlJyk7XG5cblx0dmFyIGNoYXJ0U29jaWFsID0gY2hhcnRDb250YWluZXJcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfc29jaWFsJyk7XG5cblx0dmFyIGNoYXJ0U29jaWFsQ2xvc2VCdG4gPSBjaGFydFNvY2lhbFxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9zb2NpYWxfY2xvc2UnKVxuXHRcdC5odG1sKCcmI3hkNzsnKTtcblxuXHR2YXIgY2hhcnRTb2NpYWxPcHRpb25zID0gY2hhcnRTb2NpYWxcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfc29jaWFsX29wdGlvbnMnKTtcblxuXHRjaGFydFNvY2lhbE9wdGlvbnNcblx0XHQuYXBwZW5kKCdoMycpXG5cdFx0Lmh0bWwoJ1NoYXJlIHRoaXMgY2hhcnQ6Jyk7XG5cblx0Y2hhcnRTb2NpYWxCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Y2hhcnRTb2NpYWwuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIHRydWUpO1xuXHR9KTtcblxuXHRjaGFydFNvY2lhbENsb3NlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNoYXJ0U29jaWFsLmNsYXNzZWQob2JqLnByZWZpeCArICdhY3RpdmUnLCBmYWxzZSk7XG5cdH0pO1xuXG5cdHZhciBpdGVtQW1vdW50ID0gc29jaWFsT3B0aW9ucy5sZW5ndGg7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IGl0ZW1BbW91bnQ7IGkrKyApIHtcblx0XHRjaGFydFNvY2lhbE9wdGlvbnNcblx0XHRcdC5zZWxlY3RBbGwoJy4nICsgb2JqLnByZWZpeCArICdzb2NpYWwtaXRlbScpXG5cdFx0XHQuZGF0YShzb2NpYWxPcHRpb25zKVxuXHRcdFx0LmVudGVyKClcblx0XHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ3NvY2lhbC1pdGVtJykuaHRtbChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdGlmICghZC5wb3B1cCkge1xuXHRcdFx0XHRcdHJldHVybiAnPGEgaHJlZj1cIicgKyBkLnVybCArICdcIj48aW1nIGNsYXNzPVwiJyArIG9iai5wcmVmaXggKyAnc29jaWFsLWljb25cIiBzcmM9XCInICsgZC5pY29uICsgJ1wiIHRpdGxlPVwiJyArIGQubGFiZWwgKyAnXCIvPjwvYT4nO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiAnPGEgY2xhc3M9XCInICsgb2JqLnByZWZpeCArICdqcy1zaGFyZVwiIGhyZWY9XCInICsgZC51cmwgKyAnXCI+PGltZyBjbGFzcz1cIicgKyBvYmoucHJlZml4ICsgJ3NvY2lhbC1pY29uXCIgc3JjPVwiJyArIGQuaWNvbiArICdcIiB0aXRsZT1cIicgKyBkLmxhYmVsICsgJ1wiLz48L2E+Jztcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdH1cblxuICBpZiAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpIHtcbiAgICBjaGFydFNvY2lhbE9wdGlvbnNcbiAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2ltYWdlLXVybCcpXG4gICAgICAuYXR0cignY29udGVudEVkaXRhYmxlJywgJ3RydWUnKVxuICAgICAgLmh0bWwoZ2V0VGh1bWJuYWlsKG9iaikpO1xuICB9XG5cblx0dmFyIHNoYXJlUG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwianMtc2hhcmVcIik7XG5cbiAgaWYgKHNoYXJlUG9wdXApIHtcbiAgICBbXS5mb3JFYWNoLmNhbGwoc2hhcmVQb3B1cCwgZnVuY3Rpb24oYW5jaG9yKSB7XG4gICAgICBhbmNob3IuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB3aW5kb3dQb3B1cCh0aGlzLmhyZWYsIDYwMCwgNjIwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cblx0cmV0dXJuIHtcblx0XHRtZXRhX25hdjogY2hhcnRNZXRhXG5cdH07XG5cbn1cblxuLy8gc29jaWFsIHBvcHVwXG5mdW5jdGlvbiB3aW5kb3dQb3B1cCh1cmwsIHdpZHRoLCBoZWlnaHQpIHtcbiAgLy8gY2FsY3VsYXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9wdXAgc28gaXTigJlzIGNlbnRlcmVkIG9uIHRoZSBzY3JlZW4uXG4gIHZhciBsZWZ0ID0gKHNjcmVlbi53aWR0aCAvIDIpIC0gKHdpZHRoIC8gMiksXG4gICAgICB0b3AgPSAoc2NyZWVuLmhlaWdodCAvIDIpIC0gKGhlaWdodCAvIDIpO1xuICB3aW5kb3cub3BlbihcbiAgICB1cmwsXG4gICAgXCJcIixcbiAgICBcIm1lbnViYXI9bm8sdG9vbGJhcj1ubyxyZXNpemFibGU9eWVzLHNjcm9sbGJhcnM9eWVzLHdpZHRoPVwiICsgd2lkdGggKyBcIixoZWlnaHQ9XCIgKyBoZWlnaHQgKyBcIix0b3A9XCIgKyB0b3AgKyBcIixsZWZ0PVwiICsgbGVmdFxuICApO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RGYWNlYm9va1VSTChvYmope1xuICB2YXIgYmFzZSA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vZGlhbG9nL3NoYXJlPycsXG4gICAgICByZWRpcmVjdCA9IG9iai5zb2NpYWwuZmFjZWJvb2sucmVkaXJlY3QsXG4gICAgICB1cmwgPSAnYXBwX2lkPScgKyBvYmouc29jaWFsLmZhY2Vib29rLmFwcElEICsgJyZhbXA7ZGlzcGxheT1wb3B1cCZhbXA7dGl0bGU9JyArIG9iai5oZWFkaW5nICsgJyZhbXA7ZGVzY3JpcHRpb249RnJvbSUyMGFydGljbGUnICsgZG9jdW1lbnQudGl0bGUgKyAnJmFtcDtocmVmPScgKyB3aW5kb3cubG9jYXRpb24uaHJlZiArICcmYW1wO3JlZGlyZWN0X3VyaT0nICsgcmVkaXJlY3Q7XG4gIGlmIChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkgeyAgdXJsICs9ICcmYW1wO3BpY3R1cmU9JyArIGdldFRodW1ibmFpbChvYmopOyB9XG4gIHJldHVybiBiYXNlICsgdXJsO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RNYWlsVVJMKG9iail7XG4gIHZhciBiYXNlID0gJ21haWx0bzo/JztcbiAgdmFyIHRodW1ibmFpbCA9IChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkgPyAnJTBBJyArIGdldFRodW1ibmFpbChvYmopIDogXCJcIjtcbiAgcmV0dXJuIGJhc2UgKyAnc3ViamVjdD0nICsgb2JqLmhlYWRpbmcgKyAnJmFtcDtib2R5PScgKyBvYmouaGVhZGluZyArIHRodW1ibmFpbCArICclMEFmcm9tIGFydGljbGU6ICcgKyBkb2N1bWVudC50aXRsZSArICclMEEnICsgd2luZG93LmxvY2F0aW9uLmhyZWY7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFNNU1VSTChvYmope1xuICB2YXIgYmFzZSA9ICdzbXM6JyxcbiAgICAgIHVybCA9ICcmYm9keT1DaGVjayUyMG91dCUyMHRoaXMlMjBjaGFydDogJyArIG9iai5oZWFkaW5nO1xuICBpZiAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpIHsgIHVybCArPSAnJTIwJyArIGdldFRodW1ibmFpbChvYmopOyB9XG4gIHJldHVybiBiYXNlICsgdXJsO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RUd2l0dGVyVVJMKG9iail7XG4gIHZhciBiYXNlID0gJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0PycsXG4gICAgICBoYXNodGFnID0gISEob2JqLnNvY2lhbC50d2l0dGVyLmhhc2h0YWcpID8gJyZhbXA7aGFzaHRhZ3M9JyArIG9iai5zb2NpYWwudHdpdHRlci5oYXNodGFnIDogXCJcIixcbiAgICAgIHZpYSA9ICEhKG9iai5zb2NpYWwudHdpdHRlci52aWEpID8gJyZhbXA7dmlhPScgKyBvYmouc29jaWFsLnR3aXR0ZXIudmlhIDogXCJcIixcbiAgICAgIHVybCA9ICd1cmw9JyArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICArIHZpYSArICcmYW1wO3RleHQ9JyArIGVuY29kZVVSSShvYmouaGVhZGluZykgKyBoYXNodGFnO1xuICBpZiAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpIHsgIHVybCArPSAnJTIwJyArIGdldFRodW1ibmFpbChvYmopOyB9XG4gIHJldHVybiBiYXNlICsgdXJsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNvY2lhbENvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc29jaWFsLmpzXG4gKiogbW9kdWxlIGlkID0gMjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogU2hhcmluZyBEYXRhIG1vZHVsZS5cbiAqIEBtb2R1bGUgY2hhcnRzL2NvbXBvbmVudHMvc2hhcmUtZGF0YVxuICovXG5cbi8qXG5UaGlzIGNvbXBvbmVudCBhZGRzIGEgXCJkYXRhXCIgYnV0dG9uIHRvIGVhY2ggY2hhcnQgd2hpY2ggY2FuIGJlIHRvZ2dsZWQgdG8gcHJlc2VudCB0aGUgY2hhcnRzIGRhdGEgaW4gYSB0YWJ1bGFyIGZvcm0gYWxvbmcgd2l0aCBidXR0b25zIGFsbG93aW5nIHRoZSByYXcgZGF0YSB0byBiZSBkb3dubG9hZGVkXG4gKi9cblxuZnVuY3Rpb24gc2hhcmVEYXRhQ29tcG9uZW50KG5vZGUsIG9iaikge1xuXG4gXHR2YXIgY2hhcnRDb250YWluZXIgPSBkMy5zZWxlY3Qobm9kZSk7XG5cbiAgdmFyIGNoYXJ0TWV0YSA9IGNoYXJ0Q29udGFpbmVyLnNlbGVjdCgnLicgKyBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGEnKTtcblxuICBpZiAoY2hhcnRNZXRhLm5vZGUoKSA9PT0gbnVsbCkge1xuICAgIGNoYXJ0TWV0YSA9IGNoYXJ0Q29udGFpbmVyXG4gICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9tZXRhJyk7XG4gIH1cblxuXHR2YXIgY2hhcnREYXRhQnRuID0gY2hhcnRNZXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGFfYnRuJylcblx0XHQuaHRtbCgnZGF0YScpO1xuXG5cdHZhciBjaGFydERhdGEgPSBjaGFydENvbnRhaW5lclxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhJyk7XG5cblx0dmFyIGNoYXJ0RGF0YUNsb3NlQnRuID0gY2hhcnREYXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X2RhdGFfY2xvc2UnKVxuXHRcdC5odG1sKCcmI3hkNzsnKTtcblxuXHR2YXIgY2hhcnREYXRhVGFibGUgPSBjaGFydERhdGFcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfZGF0YV9pbm5lcicpO1xuXG5cdGNoYXJ0RGF0YVxuXHRcdC5hcHBlbmQoJ2gyJylcblx0XHQuaHRtbChvYmouaGVhZGluZyk7XG5cblx0dmFyIGNoYXJ0RGF0YU5hdiA9IGNoYXJ0RGF0YVxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhX25hdicpO1xuXG5cdHZhciBjc3ZETEJ0biA9IGNoYXJ0RGF0YU5hdlxuXHRcdC5hcHBlbmQoJ2EnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfZGF0YV9idG4gY3N2Jylcblx0XHQuaHRtbCgnZG93bmxvYWQgY3N2Jyk7XG5cbiAgdmFyIGNzdlRvVGFibGUgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikuY3N2VG9UYWJsZTtcblxuXHRjc3ZUb1RhYmxlKGNoYXJ0RGF0YVRhYmxlLCBvYmouZGF0YS5jc3YpO1xuXG5cdGNoYXJ0RGF0YUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjaGFydERhdGEuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIHRydWUpO1xuXHR9KTtcblxuXHRjaGFydERhdGFDbG9zZUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjaGFydERhdGEuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIGZhbHNlKTtcblx0fSk7XG5cblx0Y3N2RExCdG4ub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcblx0ICB2YXIgZGxEYXRhID0gJ2RhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQob2JqLmRhdGEuY3N2KTtcblx0ICBkMy5zZWxlY3QodGhpcylcblx0ICBcdC5hdHRyKCdocmVmJywgZGxEYXRhKVxuXHQgIFx0LmF0dHIoJ2Rvd25sb2FkJywnZGF0YV8nICsgb2JqLmlkICsgJy5jc3YnKTtcblx0fSk7XG5cblx0cmV0dXJuIHtcblx0XHRtZXRhX25hdjogY2hhcnRNZXRhLFxuXHRcdGRhdGFfcGFuZWw6IGNoYXJ0RGF0YVxuXHR9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hhcmVEYXRhQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhLmpzXG4gKiogbW9kdWxlIGlkID0gMjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ3VzdG9tIGNvZGUgZnVuY3Rpb24gdGhhdCBjYW4gYmUgaW52b2tlZCB0byBtb2RpZnkgY2hhcnQgZWxlbWVudHMgYWZ0ZXIgY2hhcnQgZHJhd2luZyBoYXMgb2NjdXJyZWQuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG5vZGUgICAgICAgICBUaGUgbWFpbiBjb250YWluZXIgZ3JvdXAgZm9yIHRoZSBjaGFydC5cbiAqIEBwYXJhbSAge09iamVjdH0gY2hhcnRSZWNpcGUgIE9iamVjdCB0aGF0IGNvbnRhaW5zIHNldHRpbmdzIGZvciB0aGUgY2hhcnQuXG4gKiBAcGFyYW0gIHtPYmplY3R9IHJlbmRlcmVkICAgICBBbiBvYmplY3QgY29udGFpbmluZyByZWZlcmVuY2VzIHRvIGFsbCByZW5kZXJlZCBjaGFydCBlbGVtZW50cywgaW5jbHVkaW5nIGF4ZXMsIHNjYWxlcywgcGF0aHMsIG5vZGVzLCBhbmQgc28gZm9ydGguXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICBPcHRpb25hbC5cbiAqL1xuZnVuY3Rpb24gY3VzdG9tKG5vZGUsIGNoYXJ0UmVjaXBlLCByZW5kZXJlZCkge1xuXG4gIC8vIFdpdGggdGhpcyBmdW5jdGlvbiwgeW91IGNhbiBhY2Nlc3MgYWxsIGVsZW1lbnRzIG9mIGEgY2hhcnQgYW5kIG1vZGlmeVxuICAvLyB0aGVtIGF0IHdpbGwuIEZvciBpbnN0YW5jZTogeW91IG1pZ2h0IHdhbnQgdG8gcGxheSB3aXRoIGNvbG91clxuICAvLyBpbnRlcnBvbGF0aW9uIGZvciBhIG11bHRpLXNlcmllcyBsaW5lIGNoYXJ0LCBvciBtb2RpZnkgdGhlIHdpZHRoIGFuZCBwb3NpdGlvblxuICAvLyBvZiB0aGUgeC0gYW5kIHktYXhpcyB0aWNrcy4gV2l0aCB0aGlzIGZ1bmN0aW9uLCB5b3UgY2FuIGRvIGFsbCB0aGF0IVxuXG4gIC8vIElmIHlvdSBjYW4sIGl0J3MgZ29vZCBDaGFydCBUb29sIHByYWN0aWNlIHRvIHJldHVybiByZWZlcmVuY2VzIHRvIG5ld2x5XG4gIC8vIGNyZWF0ZWQgbm9kZXMgYW5kIGQzIG9iamVjdHMgc28gdGhleSBiZSBhY2Nlc3NlZCBsYXRlciDigJQgYnkgYSBkaXNwYXRjaGVyXG4gIC8vIGV2ZW50LCBmb3IgaW5zdGFuY2UuXG4gIHJldHVybjtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGN1c3RvbTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vY3VzdG9tL2N1c3RvbS5qc1xuICoqIG1vZHVsZSBpZCA9IDI5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9