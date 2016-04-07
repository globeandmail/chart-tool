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
	    axisSettings = obj.exportable.x_axis;
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
	    axisSettings = obj.exportable.y_axis;
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
	    var ordinalTickPadding = 3;
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
	
	  var ticks = scale.domain();
	
	  // array for any "major ticks", i.e. ticks with a change in context
	  // one level up. i.e., a "months" context set of ticks with a change in the year,
	  // or "days" context ticks with a change in month or year
	  var majorTicks = [];
	
	  var prevYear, prevMonth, prevDate, dYear, dMonth, dDate;
	
	  newSelection.each(function(d) {
	    var currSel = d3.select(this);
	    switch (ctx) {
	      case "years":
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
	        tn = ticks.indexOf(majorTicks[0]);
	      } else if (i === (majorTicks.length)) { // from mn to tn
	        t0 = ticks.indexOf(majorTicks[i - 1]);
	        tn = ticks.length - 1;
	      } else { // from m0 to mn
	        t0 = ticks.indexOf(majorTicks[i - 1]);
	        tn = ticks.indexOf(majorTicks[i]);
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	function BarChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	    scaleModule = __webpack_require__(17),
	    Scale = scaleModule.scaleManager;
	
	  // because the elements will be appended in reverse due to the
	  // bar chart operating on the y-axis, need to reverse the dataset.
	  obj.data.data.reverse();
	
	  var xAxisOffset = 9;
	
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
	    .attr("y", xAxisOffset)
	    .each(function() {
	      textLengths.push(d3.select(this).node().getBoundingClientRect().height);
	    });
	
	  var tallestText = textLengths.reduce(function(a, b) { return (a > b ? a : b) });
	
	  obj.dimensions.xAxisHeight = tallestText + xAxisOffset;
	
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
	
	  if (obj.exportable && obj.exportable.x_axis) {
	    xAxisSettings = obj.exportable.x_axis;
	  } else {
	    xAxisSettings = obj.xAxis;
	  }
	
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
	    .attr("y", xAxisOffset)
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
	      .attr("y", xAxisOffset)
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
	
	function mouseIdle(tipNodes, obj, timeout) {
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
	          timeout = mouseIdle(tipNodes, obj, timeout);
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
	          timeout = mouseIdle(tipNodes, obj, timeout);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmZkY2E3MDI1MzdiZDViYTY3NTUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb25maWcvY2hhcnQtc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZS5qc29uIiwid2VicGFjazovLy8uL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29uZmlnL2Vudi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdXRpbHMvZGF0YXBhcnNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy9mYWN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9oZWxwZXJzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9tYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2Zvb3Rlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcGxvdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2xpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2F4aXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NjYWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvbXVsdGlsaW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2NvbHVtbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2Jhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtY29sdW1uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3F1YWxpZmllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvdGlwcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc29jaWFsLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhLmpzIiwid2VicGFjazovLy8uL2N1c3RvbS9jdXN0b20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVMsTUFBTTtBQUNmLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0IsT0FBTztB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QUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFD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QTs7Ozs7OztBQ3BDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUF5QixVQUFVLEVBQUU7QUFDckM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ3hGQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7QUNsQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7Ozs7Ozs7QUNsREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFDQUFvQyxtQ0FBbUMsVUFBVSxFQUFFOztBQUVuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBLDBDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwrQkFBOEIsZ0NBQWdDLEVBQUU7QUFDaEUseUJBQXdCLHNCQUFzQixFQUFFO0FBQ2hELHlCQUF3QixnQ0FBZ0MsRUFBRTs7QUFFMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwyQkFBMEIsb0RBQW9ELEVBQUU7QUFDaEYscUJBQW9CLHNCQUFzQixFQUFFO0FBQzVDLHFCQUFvQixvREFBb0QsRUFBRTs7QUFFMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQSxNQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQy9GQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSwyQkFBMEIsOEJBQThCOztBQUV4RDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsMEJBQXlCLFVBQVUsRUFBRTtBQUNyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUEsdUNBQXNDLG1DQUFtQzs7QUFFekU7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxJQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJCQUEwQixhQUFhLEVBQUU7O0FBRXpDOztBQUVBOztB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O0FBQ0E7QUFDQSxRQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxRQUFPOztBQUVQOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsSUFBRzs7QUFFSDs7O0FBR0E7O0FBRUE7O0FBRUE7Ozs7Ozs7QUNsbkNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZTs7QUFFZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFFOztBQUVGO0FBQ0E7QUFDQSxHQUFFOztBQUVGOztBQUVBLGdCQUFlLGdCQUFnQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkRBQTBELGtCQUFrQiw4QkFBOEIscURBQXFELHNDQUFzQztBQUNyTSx1Q0FBc0MsZUFBZSw4QkFBOEI7QUFDbkY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBaUQ7QUFDakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXNDLG1DQUFtQztBQUN6RTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3REFBdUQ7QUFDdkQsZ0RBQStDO0FBQy9DLDBEQUF5RDtBQUN6RCx1Q0FBc0MsbUNBQW1DO0FBQ3pFO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlOztBQUVmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFFOztBQUVGO0FBQ0E7QUFDQSxHQUFFOztBQUVGO0FBQ0Esa0NBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLEdBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7QUM5RUE7QUFDQTtBQUNBLGFBQVksT0FBTztBQUNuQixhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CLGFBQVksT0FBTztBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHlCIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgYmZkY2E3MDI1MzdiZDViYTY3NTVcbiAqKi8iLCIvKipcbiAqIENoYXJ0IFRvb2xcbiAqIEBhdXRob3IgSmVyZW15IEFnaXVzIDxqYWdpdXNAZ2xvYmVhbmRtYWlsLmNvbT5cbiAqIEBhdXRob3IgVG9tIENhcmRvc28gPHRjYXJkb3NvQGdsb2JlYW5kbWFpbC5jb20+XG4gKiBAYXV0aG9yIE1pY2hhZWwgUGVyZWlyYSA8bXBlcmVpcmFAZ2xvYmVhbmRtYWlsLmNvbT5cbiAqIEBzZWUge0BsaW5rfSBmb3IgZnVydGhlciBpbmZvcm1hdGlvbi5cbiAqIEBzZWUge0BsaW5rIGh0dHA6Ly93d3cuZ2l0aHViLmNvbS9nbG9iZWFuZG1haWwvY2hhcnQtdG9vbHxDaGFydCBUb29sfVxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuKGZ1bmN0aW9uIENoYXJ0VG9vbEluaXQocm9vdCkge1xuXG4gIGlmIChyb290LmQzKSB7XG5cbiAgICB2YXIgQ2hhcnRUb29sID0gKGZ1bmN0aW9uIENoYXJ0VG9vbCgpIHtcblxuICAgICAgdmFyIGNoYXJ0cyA9IHJvb3QuX19jaGFydHRvb2wgfHwgW10sXG4gICAgICAgICAgZGlzcGF0Y2hGdW5jdGlvbnMgPSByb290Ll9fY2hhcnR0b29sZGlzcGF0Y2hlciB8fCBbXSxcbiAgICAgICAgICBkcmF3biA9IFtdO1xuXG4gICAgICB2YXIgc2V0dGluZ3MgPSByZXF1aXJlKFwiLi9jb25maWcvY2hhcnQtc2V0dGluZ3NcIiksXG4gICAgICAgICAgdXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy91dGlsc1wiKTtcblxuICAgICAgdmFyIGRpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcInN0YXJ0XCIsIFwiZmluaXNoXCIsIFwicmVkcmF3XCIsIFwibW91c2VPdmVyXCIsIFwibW91c2VNb3ZlXCIsIFwibW91c2VPdXRcIiwgXCJjbGlja1wiKTtcblxuICAgICAgZm9yICh2YXIgcHJvcCBpbiBkaXNwYXRjaEZ1bmN0aW9ucykge1xuICAgICAgICBpZiAoZGlzcGF0Y2hGdW5jdGlvbnMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBpZiAoZDMua2V5cyhkaXNwYXRjaGVyKS5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoZXIub24ocHJvcCwgZGlzcGF0Y2hGdW5jdGlvbnNbcHJvcF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNoYXJ0IFRvb2wgZG9lcyBub3Qgb2ZmZXIgYSBkaXNwYXRjaGVyIG9mIHR5cGUgJ1wiICsgcHJvcCArIFwiJy4gRm9yIGF2YWlsYWJsZSBkaXNwYXRjaGVyIHR5cGVzLCBwbGVhc2Ugc2VlIHRoZSBDaGFydFRvb2wuZGlzcGF0Y2goKSBtZXRob2QuXCIgO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENsZWFycyBwcmV2aW91cyBpdGVyYXRpb25zIG9mIGNoYXJ0IG9iamVjdHMgc3RvcmVkIGluIG9iaiBvciB0aGUgZHJhd24gYXJyYXksIHRoZW4gcHVudHMgY2hhcnQgY29uc3RydWN0aW9uIHRvIHRoZSBDaGFydCBNYW5hZ2VyLlxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBjb250YWluZXIgQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb250YWluZXIncyBzZWxlY3Rvci5cbiAgICAgICAqIEBwYXJhbSAge09iamVjdH0gb2JqICAgICAgIFRoZSBjaGFydCBJRCBhbmQgZW1iZWQgZGF0YS5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gY3JlYXRlQ2hhcnQoY29udGFpbmVyLCBvYmopIHtcblxuICAgICAgICBkaXNwYXRjaGVyLnN0YXJ0KG9iaik7XG5cbiAgICAgICAgZHJhd24gPSB1dGlscy5jbGVhckRyYXduKGRyYXduLCBvYmopO1xuICAgICAgICBvYmogPSB1dGlscy5jbGVhck9iaihvYmopO1xuICAgICAgICBjb250YWluZXIgPSB1dGlscy5jbGVhckNoYXJ0KGNvbnRhaW5lcik7XG5cbiAgICAgICAgdmFyIENoYXJ0TWFuYWdlciA9IHJlcXVpcmUoXCIuL2NoYXJ0cy9tYW5hZ2VyXCIpO1xuXG4gICAgICAgIG9iai5kYXRhLndpZHRoID0gdXRpbHMuZ2V0Qm91bmRpbmcoY29udGFpbmVyLCBcIndpZHRoXCIpO1xuICAgICAgICBvYmouZGlzcGF0Y2ggPSBkaXNwYXRjaGVyO1xuXG4gICAgICAgIHZhciBjaGFydE9iajtcblxuICAgICAgICBpZiAodXRpbHMuc3ZnVGVzdChyb290KSkge1xuICAgICAgICAgIGNoYXJ0T2JqID0gQ2hhcnRNYW5hZ2VyKGNvbnRhaW5lciwgb2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1dGlscy5nZW5lcmF0ZVRodW1iKGNvbnRhaW5lciwgb2JqLCBzZXR0aW5ncyk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3bi5wdXNoKHsgaWQ6IG9iai5pZCwgY2hhcnRPYmo6IGNoYXJ0T2JqIH0pO1xuICAgICAgICBvYmouY2hhcnRPYmogPSBjaGFydE9iajtcblxuICAgICAgICBkMy5zZWxlY3QoY29udGFpbmVyKVxuICAgICAgICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLmNsaWNrKHRoaXMsIGNoYXJ0T2JqKTsgfSlcbiAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKSB7IGRpc3BhdGNoZXIubW91c2VPdmVyKHRoaXMsIGNoYXJ0T2JqKTsgfSlcbiAgICAgICAgICAub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oKSB7IGRpc3BhdGNoZXIubW91c2VNb3ZlKHRoaXMsIGNoYXJ0T2JqKTsgIH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7IGRpc3BhdGNoZXIubW91c2VPdXQodGhpcywgY2hhcnRPYmopOyB9KTtcblxuICAgICAgICBkaXNwYXRjaGVyLmZpbmlzaChjaGFydE9iaik7XG5cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBHcmFicyBkYXRhIG9uIGEgY2hhcnQgYmFzZWQgb24gYW4gSUQuXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBjaGFydHMgQXJyYXkgb2YgY2hhcnRzIG9uIHRoZSBwYWdlLlxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBpZCBUaGUgSUQgZm9yIHRoZSBjaGFydC5cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgUmV0dXJucyBzdG9yZWQgZW1iZWQgb2JqZWN0LlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiByZWFkQ2hhcnQoaWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgaWYgKGNoYXJ0c1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGFydHNbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIExpc3QgYWxsIHRoZSBjaGFydHMgc3RvcmVkIGluIHRoZSBDaGFydCBUb29sIGJ5IGNoYXJ0aWQuXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBjaGFydHMgQXJyYXkgb2YgY2hhcnRzIG9uIHRoZSBwYWdlLlxuICAgICAgICogQHJldHVybiB7QXJyYXl9ICAgICAgIExpc3Qgb2YgY2hhcnRpZCdzLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBsaXN0Q2hhcnRzKGNoYXJ0cykge1xuICAgICAgICB2YXIgY2hhcnRzQXJyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2hhcnRzQXJyLnB1c2goY2hhcnRzW2ldLmlkKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNoYXJ0c0FycjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdXBkYXRlQ2hhcnQoaWQsIG9iaikge1xuICAgICAgICB2YXIgY29udGFpbmVyID0gJy4nICsgc2V0dGluZ3MuYmFzZUNsYXNzKCkgKyAnW2RhdGEtY2hhcnRpZD0nICsgc2V0dGluZ3MucHJlZml4ICsgaWQgKyAnXSc7XG4gICAgICAgIGNyZWF0ZUNoYXJ0KGNvbnRhaW5lciwgeyBpZDogaWQsIGRhdGE6IG9iaiB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVzdHJveUNoYXJ0KGlkKSB7XG4gICAgICAgIHZhciBjb250YWluZXIsIG9iajtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoY2hhcnRzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgb2JqID0gY2hhcnRzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29udGFpbmVyID0gJy4nICsgc2V0dGluZ3MuYmFzZUNsYXNzKCkgKyAnW2RhdGEtY2hhcnRpZD0nICsgb2JqLmlkICsgJ10nO1xuICAgICAgICB1dGlscy5jbGVhckRyYXduKGRyYXduLCBvYmopO1xuICAgICAgICB1dGlscy5jbGVhck9iaihvYmopO1xuICAgICAgICB1dGlscy5jbGVhckNoYXJ0KGNvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgY2hhcnRzLCBkcmF3IGVhY2ggY2hhcnQgaW50byBpdHMgcmVzcGVjdGl2ZSBjb250YWluZXIuXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBjaGFydHMgQXJyYXkgb2YgY2hhcnRzIG9uIHRoZSBwYWdlLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBjcmVhdGVMb29wKGNoYXJ0cykge1xuICAgICAgICB2YXIgY2hhcnRMaXN0ID0gbGlzdENoYXJ0cyhjaGFydHMpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJ0TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBvYmogPSByZWFkQ2hhcnQoY2hhcnRMaXN0W2ldKTtcbiAgICAgICAgICB2YXIgY29udGFpbmVyID0gJy4nICsgc2V0dGluZ3MuYmFzZUNsYXNzKCkgKyAnW2RhdGEtY2hhcnRpZD0nICsgY2hhcnRMaXN0W2ldICsgJ10nO1xuICAgICAgICAgIGNyZWF0ZUNoYXJ0KGNvbnRhaW5lciwgb2JqKTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDaGFydCBUb29sIGluaXRpYWxpemVyIHdoaWNoIHNldHMgdXAgZGVib3VuY2luZyBhbmQgcnVucyB0aGUgY3JlYXRlTG9vcCgpLiBSdW4gb25seSBvbmNlLCB3aGVuIHRoZSBsaWJyYXJ5IGlzIGZpcnN0IGxvYWRlZC5cbiAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGNoYXJ0cyBBcnJheSBvZiBjaGFydHMgb24gdGhlIHBhZ2UuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemVyKGNoYXJ0cykge1xuICAgICAgICBjcmVhdGVMb29wKGNoYXJ0cyk7XG4gICAgICAgIHZhciBkZWJvdW5jZSA9IHV0aWxzLmRlYm91bmNlKGNyZWF0ZUxvb3AsIGNoYXJ0cywgc2V0dGluZ3MuZGVib3VuY2UsIHJvb3QpO1xuICAgICAgICBkMy5zZWxlY3Qocm9vdClcbiAgICAgICAgICAub24oJ3Jlc2l6ZS4nICsgc2V0dGluZ3MucHJlZml4ICsgJ2RlYm91bmNlJywgZGVib3VuY2UpXG4gICAgICAgICAgLm9uKCdyZXNpemUuJyArIHNldHRpbmdzLnByZWZpeCArICdyZWRyYXcnLCBkaXNwYXRjaGVyLnJlZHJhdyhjaGFydHMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgIHJldHVybiBpbml0aWFsaXplcihjaGFydHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gY3JlYXRlKGNvbnRhaW5lciwgb2JqKSB7XG4gICAgICAgICAgcmV0dXJuIGNyZWF0ZUNoYXJ0KGNvbnRhaW5lciwgb2JqKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKGlkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlYWRDaGFydChpZCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbGlzdDogZnVuY3Rpb24gbGlzdCgpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdENoYXJ0cyhjaGFydHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGlkLCBvYmopIHtcbiAgICAgICAgICByZXR1cm4gdXBkYXRlQ2hhcnQoaWQsIG9iaik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveShpZCkge1xuICAgICAgICAgIHJldHVybiBkZXN0cm95Q2hhcnQoaWQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiBkaXNwYXRjaCgpIHtcbiAgICAgICAgICByZXR1cm4gZDMua2V5cyhkaXNwYXRjaGVyKTtcbiAgICAgICAgfSxcblxuICAgICAgICB3YXQ6IGZ1bmN0aW9uIHdhdCgpIHtcbiAgICAgICAgICBjb25zb2xlLmluZm8oXCJDaGFydFRvb2wgdlwiICsgc2V0dGluZ3MudmVyc2lvbiArIFwiIGlzIGEgZnJlZSwgb3Blbi1zb3VyY2UgY2hhcnQgZ2VuZXJhdG9yIGFuZCBmcm9udC1lbmQgbGlicmFyeSBtYWludGFpbmVkIGJ5IFRoZSBHbG9iZSBhbmQgTWFpbC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIGNoZWNrIG91dCBvdXIgR2l0SHViIHJlcG86IHd3dy5naXRodWIuY29tL2dsb2JlYW5kbWFpbC9jaGFydC10b29sXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZlcnNpb246IHNldHRpbmdzLnZlcnNpb24sXG4gICAgICAgIGJ1aWxkOiBzZXR0aW5ncy5idWlsZCxcbiAgICAgICAgc2V0dGluZ3M6IHJlcXVpcmUoXCIuL2NvbmZpZy9jaGFydC1zZXR0aW5nc1wiKSxcbiAgICAgICAgY2hhcnRzOiByZXF1aXJlKFwiLi9jaGFydHMvbWFuYWdlclwiKSxcbiAgICAgICAgY29tcG9uZW50czogcmVxdWlyZShcIi4vY2hhcnRzL2NvbXBvbmVudHMvY29tcG9uZW50c1wiKSxcbiAgICAgICAgaGVscGVyczogcmVxdWlyZShcIi4vaGVscGVycy9oZWxwZXJzXCIpLFxuICAgICAgICB1dGlsczogcmVxdWlyZShcIi4vdXRpbHMvdXRpbHNcIiksXG4gICAgICAgIGxpbmU6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9saW5lXCIpLFxuICAgICAgICBhcmVhOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvYXJlYVwiKSxcbiAgICAgICAgbXVsdGlsaW5lOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvbXVsdGlsaW5lXCIpLFxuICAgICAgICBzdGFja2VkQXJlYTogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYVwiKSxcbiAgICAgICAgY29sdW1uOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvY29sdW1uXCIpLFxuICAgICAgICBzdGFja2VkQ29sdW1uOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvc3RhY2tlZC1jb2x1bW5cIiksXG4gICAgICAgIHN0cmVhbWdyYXBoOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGhcIiksXG4gICAgICAgIGJhcjogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL2JhclwiKVxuXG4gICAgICB9XG5cbiAgICB9KSgpO1xuXG4gICAgaWYgKCFyb290Lk1ldGVvcikgeyBDaGFydFRvb2wuaW5pdCgpOyB9XG5cbiAgfSBlbHNlIHtcblxuICAgIHZhciBNZXRlb3IgPSB0aGlzLk1ldGVvciB8fCB7fSxcbiAgICAgICAgaXNTZXJ2ZXIgPSBNZXRlb3IuaXNTZXJ2ZXIgfHwgdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFpc1NlcnZlcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkNoYXJ0IFRvb2w6IG5vIEQzIGxpYnJhcnkgZGV0ZWN0ZWQuXCIpO1xuICAgIH1cblxuXG4gIH1cblxuICByb290LkNoYXJ0VG9vbCA9IENoYXJ0VG9vbDtcblxufSkodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHRoaXMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciB2ZXJzaW9uID0ge1xuICB2ZXJzaW9uOiByZXF1aXJlKFwianNvbiEuLi8uLi8uLi9wYWNrYWdlLmpzb25cIikudmVyc2lvbixcbiAgYnVpbGQ6IHJlcXVpcmUoXCJqc29uIS4uLy4uLy4uL3BhY2thZ2UuanNvblwiKS5idWlsZHZlclxufTtcblxudmFyIHNldHRpbmdzID0gcmVxdWlyZShcImpzb24hLi4vLi4vLi4vY3VzdG9tL2NoYXJ0LXRvb2wtY29uZmlnLmpzb25cIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIENVU1RPTTogc2V0dGluZ3MuQ1VTVE9NLFxuICB2ZXJzaW9uOiB2ZXJzaW9uLnZlcnNpb24sXG4gIGJ1aWxkOiB2ZXJzaW9uLmJ1aWxkLFxuICBpZDogXCJcIixcbiAgZGF0YTogXCJcIixcbiAgZGF0ZUZvcm1hdDogc2V0dGluZ3MuZGF0ZUZvcm1hdCxcbiAgdGltZUZvcm1hdDogc2V0dGluZ3MudGltZUZvcm1hdCxcbiAgaW1hZ2U6IHNldHRpbmdzLmltYWdlLFxuICBoZWFkaW5nOiBcIlwiLFxuICBxdWFsaWZpZXI6IFwiXCIsXG4gIHNvdXJjZTogXCJcIixcbiAgZGVjazogXCJcIixcbiAgaW5kZXg6IFwiXCIsXG4gIGhhc0hvdXJzOiBmYWxzZSxcbiAgc29jaWFsOiBzZXR0aW5ncy5zb2NpYWwsXG4gIHNlcmllc0hpZ2hsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZGF0YS5zZXJpZXNBbW91bnQgJiYgdGhpcy5kYXRhLnNlcmllc0Ftb3VudCA8PSAxKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9LFxuICBiYXNlQ2xhc3M6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5wcmVmaXggKyBcImNoYXJ0XCI7IH0sXG4gIGN1c3RvbUNsYXNzOiBcIlwiLFxuXG4gIG9wdGlvbnM6IHtcbiAgICB0eXBlOiBcImxpbmVcIixcbiAgICBpbnRlcnBvbGF0aW9uOiBcImxpbmVhclwiLFxuICAgIHN0YWNrZWQ6IGZhbHNlLFxuICAgIGV4cGFuZGVkOiBmYWxzZSxcbiAgICBoZWFkOiB0cnVlLFxuICAgIGRlY2s6IGZhbHNlLFxuICAgIHF1YWxpZmllcjogdHJ1ZSxcbiAgICBsZWdlbmQ6IHRydWUsXG4gICAgZm9vdGVyOiB0cnVlLFxuICAgIHhfYXhpczogdHJ1ZSxcbiAgICB5X2F4aXM6IHRydWUsXG4gICAgdGlwczogZmFsc2UsXG4gICAgYW5ub3RhdGlvbnM6IGZhbHNlLFxuICAgIHJhbmdlOiBmYWxzZSxcbiAgICBzZXJpZXM6IGZhbHNlLFxuICAgIHNoYXJlX2RhdGE6IHRydWUsXG4gICAgc29jaWFsOiB0cnVlXG4gIH0sXG5cbiAgcmFuZ2U6IHt9LFxuICBzZXJpZXM6IHt9LFxuICB4QXhpczogc2V0dGluZ3MueEF4aXMsXG4gIHlBeGlzOiBzZXR0aW5ncy55QXhpcyxcblxuICBleHBvcnRhYmxlOiBmYWxzZSwgLy8gdGhpcyBjYW4gYmUgb3ZlcndyaXR0ZW4gYnkgdGhlIGJhY2tlbmQgYXMgbmVlZGVkXG4gIGVkaXRhYmxlOiBmYWxzZSxcblxuICBwcmVmaXg6IHNldHRpbmdzLnByZWZpeCxcbiAgZGVib3VuY2U6IHNldHRpbmdzLmRlYm91bmNlLFxuICB0aXBUaW1lb3V0OiBzZXR0aW5ncy50aXBUaW1lb3V0LFxuICBtb250aHNBYnI6IHNldHRpbmdzLm1vbnRoc0FicixcblxuICBkaW1lbnNpb25zOiB7XG4gICAgd2lkdGg6IDAsXG4gICAgY29tcHV0ZWRXaWR0aDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodDtcbiAgICB9LFxuICAgIGhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmF0aW9TY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFszMDAsIDkwMF0pLmRvbWFpbihbdGhpcy53aWR0aCAqIHRoaXMucmF0aW9Nb2JpbGUsIHRoaXMud2lkdGggKiB0aGlzLnJhdGlvRGVza3RvcF0pO1xuICAgICAgcmV0dXJuIE1hdGgucm91bmQocmF0aW9TY2FsZSh0aGlzLndpZHRoKSk7XG4gICAgfSxcbiAgICBjb21wdXRlZEhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKHRoaXMuaGVpZ2h0KCkgLSB0aGlzLmhlYWRlckhlaWdodCAtIHRoaXMuZm9vdGVySGVpZ2h0IC0gdGhpcy5tYXJnaW4udG9wIC0gdGhpcy5tYXJnaW4uYm90dG9tKTtcbiAgICB9LFxuICAgIHJhdGlvTW9iaWxlOiBzZXR0aW5ncy5yYXRpb01vYmlsZSxcbiAgICByYXRpb0Rlc2t0b3A6IHNldHRpbmdzLnJhdGlvRGVza3RvcCxcbiAgICBtYXJnaW46IHNldHRpbmdzLm1hcmdpbixcbiAgICB0aXBQYWRkaW5nOiBzZXR0aW5ncy50aXBQYWRkaW5nLFxuICAgIHRpcE9mZnNldDogc2V0dGluZ3MudGlwT2Zmc2V0LFxuICAgIGhlYWRlckhlaWdodDogMCxcbiAgICBmb290ZXJIZWlnaHQ6IDAsXG4gICAgeEF4aXNIZWlnaHQ6IDAsXG4gICAgeUF4aXNIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICh0aGlzLmNvbXB1dGVkSGVpZ2h0KCkgLSB0aGlzLnhBeGlzSGVpZ2h0KTtcbiAgICB9LFxuICAgIHhBeGlzV2lkdGg6IDAsXG4gICAgbGFiZWxXaWR0aDogMCxcbiAgICB5QXhpc1BhZGRpbmdSaWdodDogc2V0dGluZ3MueUF4aXMucGFkZGluZ1JpZ2h0LFxuICAgIHRpY2tXaWR0aDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKHRoaXMuY29tcHV0ZWRXaWR0aCgpIC0gKHRoaXMubGFiZWxXaWR0aCArIHRoaXMueUF4aXNQYWRkaW5nUmlnaHQpKTtcbiAgICB9LFxuICAgIGJhckhlaWdodDogc2V0dGluZ3MuYmFySGVpZ2h0LFxuICAgIGJhbmRzOiB7XG4gICAgICBwYWRkaW5nOiBzZXR0aW5ncy5iYW5kcy5wYWRkaW5nLFxuICAgICAgb2Zmc2V0OiBzZXR0aW5ncy5iYW5kcy5vZmZzZXQsXG4gICAgICBvdXRlclBhZGRpbmc6IHNldHRpbmdzLmJhbmRzLm91dGVyUGFkZGluZ1xuICAgIH1cbiAgfVxuXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jb25maWcvY2hhcnQtc2V0dGluZ3MuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJuYW1lXCI6IFwiY2hhcnQtdG9vbFwiLFxuXHRcInZlcnNpb25cIjogXCIxLjEuMFwiLFxuXHRcImJ1aWxkVmVyXCI6IFwiMFwiLFxuXHRcImRlc2NyaXB0aW9uXCI6IFwiQSByZXNwb25zaXZlIGNoYXJ0aW5nIGFwcGxpY2F0aW9uXCIsXG5cdFwibWFpblwiOiBcImd1bHBmaWxlLmpzXCIsXG5cdFwiZGVwZW5kZW5jaWVzXCI6IHt9LFxuXHRcImRldkRlcGVuZGVuY2llc1wiOiB7XG5cdFx0XCJicm93c2VyLXN5bmNcIjogXCJeMi44LjBcIixcblx0XHRcImd1bHBcIjogXCJeMy44LjExXCIsXG5cdFx0XCJndWxwLWNsZWFuXCI6IFwiXjAuMy4xXCIsXG5cdFx0XCJndWxwLWpzb24tZWRpdG9yXCI6IFwiXjIuMi4xXCIsXG5cdFx0XCJndWxwLW1pbmlmeS1jc3NcIjogXCJeMS4yLjBcIixcblx0XHRcImd1bHAtcmVuYW1lXCI6IFwiXjEuMi4yXCIsXG5cdFx0XCJndWxwLXJlcGxhY2VcIjogXCJeMC41LjNcIixcblx0XHRcImd1bHAtc2Fzc1wiOiBcIl4yLjAuNFwiLFxuXHRcdFwiZ3VscC1zaGVsbFwiOiBcIl4wLjQuMlwiLFxuXHRcdFwiZ3VscC1zb3VyY2VtYXBzXCI6IFwiXjEuNS4yXCIsXG5cdFx0XCJndWxwLXV0aWxcIjogXCJeMy4wLjZcIixcblx0XHRcImpzZG9jXCI6IFwiXjMuMy4yXCIsXG5cdFx0XCJqc29uLWxvYWRlclwiOiBcIl4wLjUuM1wiLFxuXHRcdFwicnVuLXNlcXVlbmNlXCI6IFwiXjEuMS40XCIsXG5cdFx0XCJ3ZWJwYWNrXCI6IFwiXjEuMTIuMTRcIixcblx0XHRcIndlYnBhY2stc3RyZWFtXCI6IFwiXjMuMS4wXCIsXG5cdFx0XCJ5YXJnc1wiOiBcIl4zLjE1LjBcIlxuXHR9LFxuXHRcInNjcmlwdHNcIjoge1xuXHRcdFwidGVzdFwiOiBcIlwiXG5cdH0sXG5cdFwia2V5d29yZHNcIjogW1xuXHRcdFwiY2hhcnRzXCIsXG5cdFx0XCJkM1wiLFxuXHRcdFwiZDNqc1wiLFxuXHRcdFwibWV0ZW9yXCIsXG5cdFx0XCJndWxwXCIsXG5cdFx0XCJ3ZWJwYWNrXCIsXG5cdFx0XCJkYXRhIHZpc3VhbGl6YXRpb25cIixcblx0XHRcImNoYXJ0XCIsXG5cdFx0XCJtb25nb1wiXG5cdF0sXG5cdFwicmVwb3NpdG9yeVwiOiB7XG5cdFx0XCJ0eXBlXCI6IFwiZ2l0XCIsXG5cdFx0XCJ1cmxcIjogXCJnaXRAZ2l0aHViLmNvbTpnbG9iZWFuZG1haWwvY2hhcnQtdG9vbC5naXRcIlxuXHR9LFxuXHRcImNvbnRyaWJ1dG9yc1wiOiBbXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJUb20gQ2FyZG9zb1wiLFxuXHRcdFx0XCJlbWFpbFwiOiBcInRjYXJkb3NvQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJKZXJlbXkgQWdpdXNcIixcblx0XHRcdFwiZW1haWxcIjogXCJqYWdpdXNAZ2xvYmVhbmRtYWlsLmNvbVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcImF1dGhvclwiOiBcIk1pY2hhZWwgUGVyZWlyYVwiLFxuXHRcdFx0XCJlbWFpbFwiOiBcIm1wZXJlaXJhQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH1cblx0XSxcblx0XCJsaWNlbnNlXCI6IFwiTUlUXCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9wYWNrYWdlLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIkNVU1RPTVwiOiBmYWxzZSxcblx0XCJwcmVmaXhcIjogXCJjdC1cIixcblx0XCJtb250aHNBYnJcIjogW1xuXHRcdFwiSmFuLlwiLFxuXHRcdFwiRmViLlwiLFxuXHRcdFwiTWFyLlwiLFxuXHRcdFwiQXByLlwiLFxuXHRcdFwiTWF5XCIsXG5cdFx0XCJKdW5lXCIsXG5cdFx0XCJKdWx5XCIsXG5cdFx0XCJBdWcuXCIsXG5cdFx0XCJTZXB0LlwiLFxuXHRcdFwiT2N0LlwiLFxuXHRcdFwiTm92LlwiLFxuXHRcdFwiRGVjLlwiLFxuXHRcdFwiSmFuLlwiXG5cdF0sXG5cdFwiZGVib3VuY2VcIjogNTAwLFxuXHRcInRpcFRpbWVvdXRcIjogNTAwMCxcblx0XCJyYXRpb01vYmlsZVwiOiAxLjE1LFxuXHRcInJhdGlvRGVza3RvcFwiOiAwLjY1LFxuXHRcImRhdGVGb3JtYXRcIjogXCIlWS0lbS0lZFwiLFxuXHRcInRpbWVGb3JtYXRcIjogXCIlSDolTVwiLFxuXHRcIm1hcmdpblwiOiB7XG5cdFx0XCJ0b3BcIjogMTAsXG5cdFx0XCJyaWdodFwiOiAzLFxuXHRcdFwiYm90dG9tXCI6IDAsXG5cdFx0XCJsZWZ0XCI6IDBcblx0fSxcblx0XCJ0aXBPZmZzZXRcIjoge1xuXHRcdFwidmVydGljYWxcIjogNCxcblx0XHRcImhvcml6b250YWxcIjogMVxuXHR9LFxuXHRcInRpcFBhZGRpbmdcIjoge1xuXHRcdFwidG9wXCI6IDQsXG5cdFx0XCJyaWdodFwiOiA5LFxuXHRcdFwiYm90dG9tXCI6IDQsXG5cdFx0XCJsZWZ0XCI6IDlcblx0fSxcblx0XCJ5QXhpc1wiOiB7XG5cdFx0XCJkaXNwbGF5XCI6IHRydWUsXG5cdFx0XCJzY2FsZVwiOiBcImxpbmVhclwiLFxuXHRcdFwidGlja3NcIjogXCJhdXRvXCIsXG5cdFx0XCJvcmllbnRcIjogXCJyaWdodFwiLFxuXHRcdFwiZm9ybWF0XCI6IFwiY29tbWFcIixcblx0XHRcInByZWZpeFwiOiBcIlwiLFxuXHRcdFwic3VmZml4XCI6IFwiXCIsXG5cdFx0XCJtaW5cIjogXCJcIixcblx0XHRcIm1heFwiOiBcIlwiLFxuXHRcdFwicmVzY2FsZVwiOiBmYWxzZSxcblx0XHRcIm5pY2VcIjogdHJ1ZSxcblx0XHRcInBhZGRpbmdSaWdodFwiOiA5LFxuXHRcdFwidGlja0xvd2VyQm91bmRcIjogMyxcblx0XHRcInRpY2tVcHBlckJvdW5kXCI6IDgsXG5cdFx0XCJ0aWNrR29hbFwiOiA1LFxuXHRcdFwid2lkdGhUaHJlc2hvbGRcIjogNDIwLFxuXHRcdFwiZHlcIjogXCJcIixcblx0XHRcInRleHRYXCI6IDAsXG5cdFx0XCJ0ZXh0WVwiOiBcIlwiXG5cdH0sXG5cdFwieEF4aXNcIjoge1xuXHRcdFwiZGlzcGxheVwiOiB0cnVlLFxuXHRcdFwic2NhbGVcIjogXCJ0aW1lXCIsXG5cdFx0XCJ0aWNrc1wiOiBcImF1dG9cIixcblx0XHRcIm9yaWVudFwiOiBcImJvdHRvbVwiLFxuXHRcdFwiZm9ybWF0XCI6IFwiYXV0b1wiLFxuXHRcdFwicHJlZml4XCI6IFwiXCIsXG5cdFx0XCJzdWZmaXhcIjogXCJcIixcblx0XHRcIm1pblwiOiBcIlwiLFxuXHRcdFwibWF4XCI6IFwiXCIsXG5cdFx0XCJyZXNjYWxlXCI6IGZhbHNlLFxuXHRcdFwibmljZVwiOiBmYWxzZSxcblx0XHRcInJhbmdlUG9pbnRzXCI6IDEsXG5cdFx0XCJ0aWNrVGFyZ2V0XCI6IDYsXG5cdFx0XCJ0aWNrc1NtYWxsXCI6IDQsXG5cdFx0XCJ3aWR0aFRocmVzaG9sZFwiOiA0MjAsXG5cdFx0XCJkeVwiOiAwLjcsXG5cdFx0XCJ1cHBlclwiOiB7XG5cdFx0XHRcInRpY2tIZWlnaHRcIjogNyxcblx0XHRcdFwidGV4dFhcIjogNixcblx0XHRcdFwidGV4dFlcIjogN1xuXHRcdH0sXG5cdFx0XCJsb3dlclwiOiB7XG5cdFx0XHRcInRpY2tIZWlnaHRcIjogMTIsXG5cdFx0XHRcInRleHRYXCI6IDYsXG5cdFx0XHRcInRleHRZXCI6IDJcblx0XHR9XG5cdH0sXG5cdFwiYmFySGVpZ2h0XCI6IDMwLFxuXHRcImJhbmRzXCI6IHtcblx0XHRcInBhZGRpbmdcIjogMC4wNixcblx0XHRcIm9mZnNldFwiOiAwLjEyLFxuXHRcdFwib3V0ZXJQYWRkaW5nXCI6IDAuMDNcblx0fSxcblx0XCJzb3VyY2VcIjoge1xuXHRcdFwicHJlZml4XCI6IFwiQ0hBUlQgVE9PTFwiLFxuXHRcdFwic3VmZml4XCI6IFwiIMK7IFNPVVJDRTpcIlxuXHR9LFxuXHRcInNvY2lhbFwiOiB7XG5cdFx0XCJmYWNlYm9va1wiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiRmFjZWJvb2tcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1zb2NpYWwtZmFjZWJvb2suc3ZnXCIsXG5cdFx0XHRcInJlZGlyZWN0XCI6IFwiXCIsXG5cdFx0XHRcImFwcElEXCI6IFwiXCJcblx0XHR9LFxuXHRcdFwidHdpdHRlclwiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiVHdpdHRlclwiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLXNvY2lhbC10d2l0dGVyLnN2Z1wiLFxuXHRcdFx0XCJ2aWFcIjogXCJcIixcblx0XHRcdFwiaGFzaHRhZ1wiOiBcIlwiXG5cdFx0fSxcblx0XHRcImVtYWlsXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJFbWFpbFwiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLW1haWwuc3ZnXCJcblx0XHR9LFxuXHRcdFwic21zXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJTTVNcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS10ZWxlcGhvbmUuc3ZnXCJcblx0XHR9XG5cdH0sXG5cdFwiaW1hZ2VcIjoge1xuXHRcdFwiZW5hYmxlXCI6IGZhbHNlLFxuXHRcdFwiYmFzZV9wYXRoXCI6IFwiXCIsXG5cdFx0XCJleHBpcmF0aW9uXCI6IDMwMDAwLFxuXHRcdFwiZmlsZW5hbWVcIjogXCJ0aHVtYm5haWxcIixcblx0XHRcImV4dGVuc2lvblwiOiBcInBuZ1wiLFxuXHRcdFwidGh1bWJuYWlsV2lkdGhcIjogNDYwXG5cdH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9jdXN0b20vY2hhcnQtdG9vbC1jb25maWcuanNvblxuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBVdGlsaXRpZXMgbW9kdWxlLiBGdW5jdGlvbnMgdGhhdCBhcmVuJ3Qgc3BlY2lmaWMgdG8gYW55IG9uZSBtb2R1bGUuXG4gKiBAbW9kdWxlIHV0aWxzL3V0aWxzXG4gKi9cblxuLyoqXG4gKiBHaXZlbiBhIGZ1bmN0aW9uIHRvIHBlcmZvcm0sIGEgdGltZW91dCBwZXJpb2QsIGEgcGFyYW1ldGVyIHRvIHBhc3MgdG8gdGhlIHBlcmZvcm1lZCBmdW5jdGlvbiwgYW5kIGEgcmVmZXJlbmNlIHRvIHRoZSB3aW5kb3csIGZpcmUgYSBzcGVjaWZpYyBmdW5jdGlvbi5cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgICAgIEZ1bmN0aW9uIHRvIHBlcmZvcm0gb24gZGVib3VuY2UuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgICAgIE9iamVjdCBwYXNzZWQgdG8gRnVuY3Rpb24gd2hpY2ggaXMgcGVyZm9ybWVkIG9uIGRlYm91bmNlLlxuICogQHBhcmFtICB7SW50ZWdlcn0gICB0aW1lb3V0IFRpbWVvdXQgcGVyaW9kIGluIG1pbGxpc2Vjb25kcy5cbiAqIEBwYXJhbSAge09iamVjdH0gICByb290ICAgIFdpbmRvdyBvYmplY3QuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gICAgICAgICAgIEZpbmFsIGRlYm91bmNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgb2JqLCB0aW1lb3V0LCByb290KSB7XG4gIHZhciB0aW1lb3V0SUQgPSAtMTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0SUQgPiAtMSkgeyByb290LmNsZWFyVGltZW91dCh0aW1lb3V0SUQpOyB9XG4gICAgdGltZW91dElEID0gcm9vdC5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBmbihvYmopXG4gICAgfSwgdGltZW91dCk7XG4gIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlIGNoYXJ0IFNWRyBhbmQgZGl2cyBpbnNpZGUgYSBjb250YWluZXIgZnJvbSB0aGUgRE9NLlxuICogQHBhcmFtICB7U3RyaW5nfSBjb250YWluZXJcbiAqL1xuZnVuY3Rpb24gY2xlYXJDaGFydChjb250YWluZXIpIHtcblxuICB2YXIgY29udCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcblxuICB3aGlsZSAoY29udCAmJiBjb250LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzdmdcIikubGVuZ3RoKSB7XG4gICAgdmFyIHN2ZyA9IGNvbnQucXVlcnlTZWxlY3RvckFsbChcInN2Z1wiKTtcbiAgICBzdmdbc3ZnLmxlbmd0aCAtIDFdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3ZnW3N2Zy5sZW5ndGggLSAxXSk7XG4gIH1cblxuICB3aGlsZSAoY29udCAmJiBjb250LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIikubGVuZ3RoKSB7XG4gICAgdmFyIGRpdiA9IGNvbnQucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKTtcbiAgICBkaXZbZGl2Lmxlbmd0aCAtIDFdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2W2Rpdi5sZW5ndGggLSAxXSk7XG4gIH1cblxuICByZXR1cm4gY29udGFpbmVyO1xufVxuXG4vKipcbiAqIENsZWFycyB0aGUgY2hhcnQgZGF0YSBvZiBpdHMgcG9zdC1yZW5kZXIgY2hhcnRPYmogb2JqZWN0LlxuICogQHBhcmFtICB7T2JqZWN0fSBvYmogT2JqZWN0IHVzZWQgdG8gY29uc3RydWN0IGNoYXJ0cy5cbiAqIEByZXR1cm4ge09iamVjdH0gICAgIFRoZSBuZXcgdmVyc2lvbiBvZiB0aGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBjbGVhck9iaihvYmopIHtcbiAgaWYgKG9iai5jaGFydE9iaikgeyBvYmouY2hhcnRPYmogPSB1bmRlZmluZWQ7IH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBDbGVhcnMgdGhlIGRyYXduIGFycmF5LlxuICogQHBhcmFtICB7QXJyYXl9IGRyYXduXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGNsZWFyRHJhd24oZHJhd24sIG9iaikge1xuICBpZiAoZHJhd24ubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IGRyYXduLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoZHJhd25baV0uaWQgPT09IG9iai5pZCkge1xuICAgICAgICBkcmF3bi5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBkcmF3bjtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGJvdW5kaW5nQ2xpZW50UmVjdCBkaW1lbnNpb25zIGdpdmVuIGEgc2VsZWN0b3IuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGNvbnRhaW5lclxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgVGhlIGJvdW5kaW5nQ2xpZW50UmVjdCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGdldEJvdW5kaW5nKHNlbGVjdG9yLCBkaW1lbnNpb24pIHtcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2RpbWVuc2lvbl07XG59XG5cbi8qKlxuICogQmFzaWMgZmFjdG9yeSBmb3IgZmlndXJpbmcgb3V0IGFtb3VudCBvZiBtaWxsaXNlY29uZHMgaW4gYSBnaXZlbiB0aW1lIHBlcmlvZC5cbiAqL1xuZnVuY3Rpb24gVGltZU9iaigpIHtcbiAgdGhpcy5zZWMgPSAxMDAwO1xuICB0aGlzLm1pbiA9IHRoaXMuc2VjICogNjA7XG4gIHRoaXMuaG91ciA9IHRoaXMubWluICogNjA7XG4gIHRoaXMuZGF5ID0gdGhpcy5ob3VyICogMjQ7XG4gIHRoaXMud2VlayA9IHRoaXMuZGF5ICogNztcbiAgdGhpcy5tb250aCA9IHRoaXMuZGF5ICogMzA7XG4gIHRoaXMueWVhciA9IHRoaXMuZGF5ICogMzY1O1xufVxuXG4vKipcbiAqIFNsaWdodGx5IGFsdGVyZWQgQm9zdG9jayBtYWdpYyB0byB3cmFwIFNWRyA8dGV4dD4gbm9kZXMgYmFzZWQgb24gYXZhaWxhYmxlIHdpZHRoXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRleHQgICAgRDMgdGV4dCBzZWxlY3Rpb24uXG4gKiBAcGFyYW0gIHtJbnRlZ2VyfSB3aWR0aFxuICovXG5mdW5jdGlvbiB3cmFwVGV4dCh0ZXh0LCB3aWR0aCkge1xuICB0ZXh0LmVhY2goZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRleHQgPSBkMy5zZWxlY3QodGhpcyksXG4gICAgICAgIHdvcmRzID0gdGV4dC50ZXh0KCkuc3BsaXQoL1xccysvKS5yZXZlcnNlKCksXG4gICAgICAgIHdvcmQsXG4gICAgICAgIGxpbmUgPSBbXSxcbiAgICAgICAgbGluZU51bWJlciA9IDAsXG4gICAgICAgIGxpbmVIZWlnaHQgPSAxLjAsIC8vIGVtc1xuICAgICAgICB4ID0gMCxcbiAgICAgICAgeSA9IHRleHQuYXR0cihcInlcIiksXG4gICAgICAgIGR5ID0gcGFyc2VGbG9hdCh0ZXh0LmF0dHIoXCJkeVwiKSksXG4gICAgICAgIHRzcGFuID0gdGV4dC50ZXh0KG51bGwpLmFwcGVuZChcInRzcGFuXCIpXG4gICAgICAgICAgLmF0dHIoXCJ4XCIsIHgpXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIHkpXG4gICAgICAgICAgLmF0dHIoXCJkeVwiLCBkeSArIFwiZW1cIik7XG5cbiAgICB3aGlsZSAod29yZCA9IHdvcmRzLnBvcCgpKSB7XG4gICAgICBsaW5lLnB1c2god29yZCk7XG4gICAgICB0c3Bhbi50ZXh0KGxpbmUuam9pbihcIiBcIikpO1xuICAgICAgaWYgKHRzcGFuLm5vZGUoKS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKSA+IHdpZHRoICYmIGxpbmUubGVuZ3RoID4gMSkge1xuICAgICAgICBsaW5lLnBvcCgpO1xuICAgICAgICB0c3Bhbi50ZXh0KGxpbmUuam9pbihcIiBcIikpO1xuICAgICAgICBsaW5lID0gW3dvcmRdO1xuICAgICAgICB0c3BhbiA9IHRleHQuYXBwZW5kKFwidHNwYW5cIilcbiAgICAgICAgICAuYXR0cihcInhcIiwgeClcbiAgICAgICAgICAuYXR0cihcInlcIiwgeSlcbiAgICAgICAgICAuYXR0cihcImR5XCIsICsrbGluZU51bWJlciAqIGxpbmVIZWlnaHQgKyBkeSArIFwiZW1cIilcbiAgICAgICAgICAudGV4dCh3b3JkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBkYXRlcyBkYXRlIGFuZCBhIHRvbGVyYW5jZSBsZXZlbCwgcmV0dXJuIGEgdGltZSBcImNvbnRleHRcIiBmb3IgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgdHdvIHZhbHVlcy5cbiAqIEBwYXJhbSAge09iamVjdH0gZDEgICAgIEJlZ2lubmluZyBkYXRlIG9iamVjdC5cbiAqIEBwYXJhbSAge09iamVjdH0gZDIgICAgIEVuZCBkYXRlIG9iamVjdC5cbiAqIEBwYXJhbSAge0ludGVnZXJ9IHRvbGVyYW5jZVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgVGhlIHJlc3VsdGluZyB0aW1lIGNvbnRleHQuXG4gKi9cbmZ1bmN0aW9uIHRpbWVEaWZmKGQxLCBkMiwgdG9sZXJhbmNlKSB7XG5cbiAgdmFyIGRpZmYgPSBkMiAtIGQxLFxuICAgICAgdGltZSA9IG5ldyBUaW1lT2JqKCk7XG5cbiAgLy8gcmV0dXJuaW5nIHRoZSBjb250ZXh0XG4gIGlmICgoZGlmZiAvIHRpbWUueWVhcikgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwieWVhcnNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUubW9udGgpID4gdG9sZXJhbmNlKSB7IHJldHVybiBcIm1vbnRoc1wiOyB9XG4gIGVsc2UgaWYgKChkaWZmIC8gdGltZS53ZWVrKSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJ3ZWVrc1wiOyB9XG4gIGVsc2UgaWYgKChkaWZmIC8gdGltZS5kYXkpID4gdG9sZXJhbmNlKSB7IHJldHVybiBcImRheXNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUuaG91cikgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwiaG91cnNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUubWluKSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJtaW51dGVzXCI7IH1cbiAgZWxzZSB7IHJldHVybiBcImRheXNcIjsgfVxuICAvLyBpZiBub25lIG9mIHRoZXNlIHdvcmsgaSBmZWVsIGJhZCBmb3IgeW91IHNvblxuICAvLyBpJ3ZlIGdvdCA5OSBwcm9ibGVtcyBidXQgYW4gaWYvZWxzZSBhaW5cInQgb25lXG5cbn1cblxuLyoqXG4gKiBHaXZlbiBhIGRhdGFzZXQsIGZpZ3VyZSBvdXQgd2hhdCB0aGUgdGltZSBjb250ZXh0IGlzIGFuZFxuICogd2hhdCB0aGUgbnVtYmVyIG9mIHRpbWUgdW5pdHMgZWxhcHNlZCBpc1xuICogQHBhcmFtICB7QXJyYXl9IGRhdGFcbiAqIEByZXR1cm4ge0ludGVnZXJ9XG4gKi9cbmZ1bmN0aW9uIHRpbWVJbnRlcnZhbChkYXRhKSB7XG5cbiAgdmFyIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgIGQxID0gZGF0YVswXS5rZXksXG4gICAgICBkMiA9IGRhdGFbZGF0YUxlbmd0aCAtIDFdLmtleTtcblxuICB2YXIgcmV0O1xuXG4gIHZhciBpbnRlcnZhbHMgPSBbXG4gICAgeyB0eXBlOiBcInllYXJzXCIsIHN0ZXA6IDEgfSxcbiAgICB7IHR5cGU6IFwibW9udGhzXCIsIHN0ZXA6IDMgfSwgLy8gcXVhcnRlcnNcbiAgICB7IHR5cGU6IFwibW9udGhzXCIsIHN0ZXA6IDEgfSxcbiAgICB7IHR5cGU6IFwiZGF5c1wiLCBzdGVwOiAxIH0sXG4gICAgeyB0eXBlOiBcImhvdXJzXCIsIHN0ZXA6IDEgfSxcbiAgICB7IHR5cGU6IFwibWludXRlc1wiLCBzdGVwOiAxIH1cbiAgXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGludGVydmFscy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpbnRlcnZhbENhbmRpZGF0ZSA9IGQzLnRpbWVbaW50ZXJ2YWxzW2ldLnR5cGVdKGQxLCBkMiwgaW50ZXJ2YWxzW2ldLnN0ZXApLmxlbmd0aDtcbiAgICBpZiAoaW50ZXJ2YWxDYW5kaWRhdGUgPj0gZGF0YUxlbmd0aCAtIDEpIHtcbiAgICAgIHZhciByZXQgPSBpbnRlcnZhbENhbmRpZGF0ZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gcmV0O1xuXG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdHJhbnNmb3JtIHBvc2l0aW9uIG9mIGFuIGVsZW1lbnQgYXMgYW4gYXJyYXlcbiAqIEBwYXJhbSAge09iamVjdH0gbm9kZVxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGdldFRyYW5zbGF0ZVhZKG5vZGUpIHtcbiAgcmV0dXJuIGQzLnRyYW5zZm9ybShkMy5zZWxlY3Qobm9kZSkuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSB0cmFuc2xhdGUgc3RhdGVtZW50IGJlY2F1c2UgaXQncyBhbm5veWluZyB0byB0eXBlIG91dFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiB0cmFuc2xhdGUoeCwgeSkge1xuICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIpXCI7XG59XG5cbi8qKlxuICogVGVzdHMgZm9yIFNWRyBzdXBwb3J0LCB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS92aWxqYW1pcy9mZWF0dXJlLmpzL1xuICogQHBhcmFtICB7T2JqZWN0fSByb290IEEgcmVmZXJlbmNlIHRvIHRoZSBicm93c2VyIHdpbmRvdyBvYmplY3QuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBzdmdUZXN0KHJvb3QpIHtcbiAgcmV0dXJuICEhcm9vdC5kb2N1bWVudCAmJiAhIXJvb3QuZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEhcm9vdC5kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKS5jcmVhdGVTVkdSZWN0O1xufVxuXG4vKipcbiAqIENvbnN0cnVjdHMgdGhlIEFXUyBVUkwgZm9yIGEgZ2l2ZW4gY2hhcnQgSUQuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRUaHVtYm5haWxQYXRoKG9iaikge1xuICB2YXIgaW1nU2V0dGluZ3MgPSBvYmouaW1hZ2U7XG5cbiAgaW1nU2V0dGluZ3MuYnVja2V0ID0gcmVxdWlyZShcIi4uL2NvbmZpZy9lbnZcIik7XG5cbiAgdmFyIGlkID0gb2JqLmlkLnJlcGxhY2Uob2JqLnByZWZpeCwgXCJcIik7XG5cbiAgcmV0dXJuIFwiaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL1wiICsgaW1nU2V0dGluZ3MuYnVja2V0ICsgXCIvXCIgKyBpbWdTZXR0aW5ncy5iYXNlX3BhdGggKyBpZCArIFwiL1wiICsgaW1nU2V0dGluZ3MuZmlsZW5hbWUgKyBcIi5cIiArIGltZ1NldHRpbmdzLmV4dGVuc2lvbjtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIGNoYXJ0IG9iamVjdCBhbmQgY29udGFpbmVyLCBnZW5lcmF0ZSBhbmQgYXBwZW5kIGEgdGh1bWJuYWlsXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlVGh1bWIoY29udGFpbmVyLCBvYmosIHNldHRpbmdzKSB7XG5cbiAgdmFyIGltZ1NldHRpbmdzID0gc2V0dGluZ3MuaW1hZ2U7XG5cbiAgdmFyIGNvbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lciksXG4gICAgICBmYWxsYmFjayA9IGNvbnQucXVlcnlTZWxlY3RvcihcIi5cIiArIHNldHRpbmdzLnByZWZpeCArIFwiYmFzZTY0aW1nXCIpO1xuXG4gIGlmIChpbWdTZXR0aW5ncyAmJiBpbWdTZXR0aW5ncy5lbmFibGUgJiYgb2JqLmRhdGEuaWQpIHtcblxuICAgIHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsIGdldFRodW1ibmFpbFBhdGgob2JqKSk7XG4gICAgaW1nLnNldEF0dHJpYnV0ZSgnYWx0Jywgb2JqLmRhdGEuaGVhZGluZyk7XG4gICAgaW1nLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBzZXR0aW5ncy5wcmVmaXggKyBcInRodW1ibmFpbFwiKTtcblxuICAgIGNvbnQuYXBwZW5kQ2hpbGQoaW1nKTtcblxuICB9IGVsc2UgaWYgKGZhbGxiYWNrKSB7XG5cbiAgICBmYWxsYmFjay5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gY3N2VG9UYWJsZSh0YXJnZXQsIGRhdGEpIHtcbiAgdmFyIHBhcnNlZENTViA9IGQzLmNzdi5wYXJzZVJvd3MoZGF0YSk7XG5cbiAgdGFyZ2V0LmFwcGVuZChcInRhYmxlXCIpLnNlbGVjdEFsbChcInRyXCIpXG4gICAgLmRhdGEocGFyc2VkQ1NWKS5lbnRlcigpXG4gICAgLmFwcGVuZChcInRyXCIpLnNlbGVjdEFsbChcInRkXCIpXG4gICAgLmRhdGEoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSkuZW50ZXIoKVxuICAgIC5hcHBlbmQoXCJ0ZFwiKVxuICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVib3VuY2U6IGRlYm91bmNlLFxuICBjbGVhckNoYXJ0OiBjbGVhckNoYXJ0LFxuICBjbGVhck9iajogY2xlYXJPYmosXG4gIGNsZWFyRHJhd246IGNsZWFyRHJhd24sXG4gIGdldEJvdW5kaW5nOiBnZXRCb3VuZGluZyxcbiAgVGltZU9iajogVGltZU9iaixcbiAgd3JhcFRleHQ6IHdyYXBUZXh0LFxuICB0aW1lRGlmZjogdGltZURpZmYsXG4gIHRpbWVJbnRlcnZhbDogdGltZUludGVydmFsLFxuICBnZXRUcmFuc2xhdGVYWTogZ2V0VHJhbnNsYXRlWFksXG4gIHRyYW5zbGF0ZTogdHJhbnNsYXRlLFxuICBzdmdUZXN0OiBzdmdUZXN0LFxuICBnZXRUaHVtYm5haWxQYXRoOiBnZXRUaHVtYm5haWxQYXRoLFxuICBnZW5lcmF0ZVRodW1iOiBnZW5lcmF0ZVRodW1iLFxuICBjc3ZUb1RhYmxlOiBjc3ZUb1RhYmxlLFxuICBkYXRhUGFyc2U6IHJlcXVpcmUoXCIuL2RhdGFwYXJzZVwiKSxcbiAgZmFjdG9yeTogcmVxdWlyZShcIi4vZmFjdG9yeVwiKVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvdXRpbHMvdXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBzM19idWNrZXQgaXMgZGVmaW5lZCBpbiB3ZWJwYWNrLmNvbmZpZy5qc1xubW9kdWxlLmV4cG9ydHMgPSBzM19idWNrZXQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NvbmZpZy9lbnYuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIERhdGEgcGFyc2luZyBtb2R1bGUuIFRha2VzIGEgQ1NWIGFuZCB0dXJucyBpdCBpbnRvIGFuIE9iamVjdCwgYW5kIG9wdGlvbmFsbHkgZGV0ZXJtaW5lcyB0aGUgZm9ybWF0dGluZyB0byB1c2Ugd2hlbiBwYXJzaW5nIGRhdGVzLlxuICogQG1vZHVsZSB1dGlscy9kYXRhcGFyc2VcbiAqIEBzZWUgbW9kdWxlOnV0aWxzL2ZhY3RvcnlcbiAqL1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHNjYWxlIHJldHVybnMgYW4gaW5wdXQgZGF0ZSBvciBub3QuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHNjYWxlVHlwZSAgICAgIFRoZSB0eXBlIG9mIHNjYWxlLlxuICogQHBhcmFtICB7U3RyaW5nfSBkZWZhdWx0Rm9ybWF0ICBGb3JtYXQgc2V0IGJ5IHRoZSBjaGFydCB0b29sIHNldHRpbmdzLlxuICogQHBhcmFtICB7U3RyaW5nfSBkZWNsYXJlZEZvcm1hdCBGb3JtYXQgcGFzc2VkIGJ5IHRoZSBjaGFydCBlbWJlZCBjb2RlLCBpZiB0aGVyZSBpcyBvbmVcbiAqIEByZXR1cm4ge1N0cmluZ3xVbmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIGlucHV0RGF0ZShzY2FsZVR5cGUsIGRlZmF1bHRGb3JtYXQsIGRlY2xhcmVkRm9ybWF0KSB7XG5cbiAgaWYgKHNjYWxlVHlwZSA9PT0gXCJ0aW1lXCIgfHwgc2NhbGVUeXBlID09PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgcmV0dXJuIGRlY2xhcmVkRm9ybWF0IHx8IGRlZmF1bHRGb3JtYXQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG59XG5cbi8qKlxuICogUGFyc2VzIGEgQ1NWIHN0cmluZyB1c2luZyBkMy5jc3YucGFyc2UoKSBhbmQgdHVybnMgaXQgaW50byBhbiBhcnJheSBvZiBvYmplY3RzLlxuICogQHBhcmFtICB7U3RyaW5nfSBjc3YgICAgICAgICAgICAgQ1NWIHN0cmluZyB0byBiZSBwYXJzZWRcbiAqIEBwYXJhbSAge1N0cmluZyBpbnB1dERhdGVGb3JtYXQgRGF0ZSBmb3JtYXQgaW4gRDMgc3RyZnRpbWUgc3R5bGUsIGlmIHRoZXJlIGlzIG9uZVxuICogQHBhcmFtICB7U3RyaW5nfSBpbmRleCAgICAgICAgICAgVmFsdWUgdG8gaW5kZXggdGhlIGRhdGEgdG8sIGlmIHRoZXJlIGlzIG9uZVxuICogQHJldHVybiB7IHtjc3Y6IFN0cmluZywgZGF0YTogQXJyYXksIHNlcmllc0Ftb3VudDogSW50ZWdlciwga2V5czogQXJyYXl9IH0gICAgICAgICAgICAgICAgIEFuIG9iamVjdCB3aXRoIHRoZSBvcmlnaW5hbCBDU1Ygc3RyaW5nLCB0aGUgbmV3bHktZm9ybWF0dGVkIGRhdGEsIHRoZSBudW1iZXIgb2Ygc2VyaWVzIGluIHRoZSBkYXRhIGFuZCBhbiBhcnJheSBvZiBrZXlzIHVzZWQuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlKGNzdiwgaW5wdXREYXRlRm9ybWF0LCBpbmRleCwgc3RhY2tlZCwgdHlwZSkge1xuXG4gIHZhciBrZXlzLCB2YWw7XG5cbiAgdmFyIGZpcnN0VmFscyA9IHt9O1xuXG4gIHZhciBkYXRhID0gZDMuY3N2LnBhcnNlKGNzdiwgZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgdmFyIG9iaiA9IHt9O1xuXG4gICAgaWYgKGkgPT09IDApIHsga2V5cyA9IGQzLmtleXMoZCk7IH1cblxuICAgIGlmIChpbnB1dERhdGVGb3JtYXQpIHtcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZDMudGltZS5mb3JtYXQoaW5wdXREYXRlRm9ybWF0KTtcbiAgICAgIG9iai5rZXkgPSBkYXRlRm9ybWF0LnBhcnNlKGQzLnZhbHVlcyhkKVswXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iai5rZXkgPSBkMy52YWx1ZXMoZClbMF07XG4gICAgfVxuXG4gICAgb2JqLnNlcmllcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaiA9IDE7IGogPCBkMy5rZXlzKGQpLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgIHZhciBrZXkgPSBkMy5rZXlzKGQpW2pdO1xuXG4gICAgICBpZiAoZFtrZXldID09PSAwIHx8IGRba2V5XSA9PT0gXCJcIikge1xuICAgICAgICBkW2tleV0gPSBcIl9fdW5kZWZpbmVkX19cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGluZGV4KSB7XG5cbiAgICAgICAgaWYgKGkgPT09IDAgJiYgIWZpcnN0VmFsc1trZXldKSB7XG4gICAgICAgICAgZmlyc3RWYWxzW2tleV0gPSBkW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5kZXggPT09IFwiMFwiKSB7XG4gICAgICAgICAgdmFsID0gKChkW2tleV0gLyBmaXJzdFZhbHNba2V5XSkgLSAxKSAqIDEwMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWwgPSAoZFtrZXldIC8gZmlyc3RWYWxzW2tleV0pICogaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gZFtrZXldO1xuICAgICAgfVxuXG4gICAgICBvYmouc2VyaWVzLnB1c2goe1xuICAgICAgICB2YWw6IHZhbCxcbiAgICAgICAga2V5OiBrZXlcbiAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcblxuICB9KTtcblxuICB2YXIgc2VyaWVzQW1vdW50ID0gZGF0YVswXS5zZXJpZXMubGVuZ3RoO1xuXG4gIGlmIChzdGFja2VkKSB7XG4gICAgaWYgKHR5cGUgPT09IFwic3RyZWFtXCIpIHtcbiAgICAgIHZhciBzdGFjayA9IGQzLmxheW91dC5zdGFjaygpLm9mZnNldChcInNpbGhvdWV0dGVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFjayA9IGQzLmxheW91dC5zdGFjaygpO1xuICAgIH1cbiAgICB2YXIgc3RhY2tlZERhdGEgPSBzdGFjayhkMy5yYW5nZShzZXJpZXNBbW91bnQpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBkYXRhLm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGVnZW5kOiBrZXlzW2tleSArIDFdLFxuICAgICAgICAgIHg6IGQua2V5LFxuICAgICAgICAgIHk6IE51bWJlcihkLnNlcmllc1trZXldLnZhbCksXG4gICAgICAgICAgcmF3OiBkXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9KSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNzdjogY3N2LFxuICAgIGRhdGE6IGRhdGEsXG4gICAgc2VyaWVzQW1vdW50OiBzZXJpZXNBbW91bnQsXG4gICAga2V5czoga2V5cyxcbiAgICBzdGFja2VkRGF0YTogc3RhY2tlZERhdGEgfHwgdW5kZWZpbmVkXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlucHV0RGF0ZTogaW5wdXREYXRlLFxuICBwYXJzZTogcGFyc2Vcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL3V0aWxzL2RhdGFwYXJzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogUmVjaXBlIGZhY3RvciBmYWN0b3J5IG1vZHVsZS5cbiAqIEBtb2R1bGUgdXRpbHMvZmFjdG9yeVxuICogQHNlZSBtb2R1bGU6Y2hhcnRzL2luZGV4XG4gKi9cblxuLyoqXG4gKiBHaXZlbiBhIFwicmVjaXBlXCIgb2Ygc2V0dGluZ3MgZm9yIGEgY2hhcnQsIHBhdGNoIGl0IHdpdGggYW4gb2JqZWN0IGFuZCBwYXJzZSB0aGUgZGF0YSBmb3IgdGhlIGNoYXJ0LlxuICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBmaW5hbCBjaGFydCByZWNpcGUuXG4gKi9cbmZ1bmN0aW9uIFJlY2lwZUZhY3Rvcnkoc2V0dGluZ3MsIG9iaikge1xuICB2YXIgZGF0YVBhcnNlID0gcmVxdWlyZShcIi4vZGF0YXBhcnNlXCIpO1xuICB2YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL2hlbHBlcnNcIik7XG5cbiAgdmFyIHQgPSBoZWxwZXJzLmV4dGVuZChzZXR0aW5ncyk7IC8vIHNob3J0IGZvciB0ZW1wbGF0ZVxuXG4gIHZhciBlbWJlZCA9IG9iai5kYXRhO1xuICB2YXIgY2hhcnQgPSBlbWJlZC5jaGFydDtcblxuICAvLyBJJ20gbm90IGEgYmlnIGZhbiBvZiBpbmRlbnRpbmcgc3R1ZmYgbGlrZSB0aGlzXG4gIC8vIChsb29raW5nIGF0IHlvdSwgUGVyZWlyYSksIGJ1dCBJJ20gbWFraW5nIGFuIGV4Y2VwdGlvblxuICAvLyBpbiB0aGlzIGNhc2UgYmVjYXVzZSBteSBleWVzIHdlcmUgYmxlZWRpbmcuXG5cbiAgdC5kaXNwYXRjaCAgICAgICAgID0gb2JqLmRpc3BhdGNoO1xuXG4gIHQudmVyc2lvbiAgICAgICAgICA9IGVtYmVkLnZlcnNpb24gICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQudmVyc2lvbjtcbiAgdC5pZCAgICAgICAgICAgICAgID0gb2JqLmlkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5pZDtcbiAgdC5oZWFkaW5nICAgICAgICAgID0gZW1iZWQuaGVhZGluZyAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5oZWFkaW5nO1xuICB0LnF1YWxpZmllciAgICAgICAgPSBlbWJlZC5xdWFsaWZpZXIgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LnF1YWxpZmllcjtcbiAgdC5zb3VyY2UgICAgICAgICAgID0gZW1iZWQuc291cmNlICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5zb3VyY2U7XG4gIHQuZGVjayAgICAgICAgICAgICA9IGVtYmVkLmRlY2sgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuZGVja1xuICB0LmN1c3RvbUNsYXNzICAgICAgPSBjaGFydC5jbGFzcyAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmN1c3RvbUNsYXNzO1xuXG4gIHQueEF4aXMgICAgICAgICAgICA9IGhlbHBlcnMuZXh0ZW5kKHQueEF4aXMsIGNoYXJ0LnhfYXhpcykgIHx8IHQueEF4aXM7XG4gIHQueUF4aXMgICAgICAgICAgICA9IGhlbHBlcnMuZXh0ZW5kKHQueUF4aXMsIGNoYXJ0LnlfYXhpcykgIHx8IHQueUF4aXM7XG5cbiAgdmFyIG8gPSB0Lm9wdGlvbnMsXG4gICAgICBjbyA9IGNoYXJ0Lm9wdGlvbnM7XG5cbiAgLy8gIFwib3B0aW9uc1wiIGFyZWEgb2YgZW1iZWQgY29kZVxuICBvLnR5cGUgICAgICAgICAgICAgPSBjaGFydC5vcHRpb25zLnR5cGUgICAgICAgICAgICAgICAgICAgICB8fCBvLnR5cGU7XG4gIG8uaW50ZXJwb2xhdGlvbiAgICA9IGNoYXJ0Lm9wdGlvbnMuaW50ZXJwb2xhdGlvbiAgICAgICAgICAgIHx8IG8uaW50ZXJwb2xhdGlvbjtcblxuICBvLnNvY2lhbCAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uc29jaWFsKSA9PT0gdHJ1ZSA/IGNvLnNvY2lhbCAgICAgICAgICAgOiBvLnNvY2lhbDtcbiAgby5zaGFyZV9kYXRhICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5zaGFyZV9kYXRhKSA9PT0gdHJ1ZSA/IGNvLnNoYXJlX2RhdGEgIDogby5zaGFyZV9kYXRhO1xuICBvLnN0YWNrZWQgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uc3RhY2tlZCkgPT09IHRydWUgPyBjby5zdGFja2VkICAgICAgICAgOiBvLnN0YWNrZWQ7XG4gIG8uZXhwYW5kZWQgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5leHBhbmRlZCkgPT09IHRydWUgPyBjby5leHBhbmRlZCAgICAgICA6IG8uZXhwYW5kZWQ7XG4gIG8uaGVhZCAgICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5oZWFkKSA9PT0gdHJ1ZSA/IGNvLmhlYWQgICAgICAgICAgICAgICA6IG8uaGVhZDtcbiAgby5kZWNrICAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmRlY2spID09PSB0cnVlID8gY28uZGVjayAgICAgICAgICAgICAgIDogby5kZWNrO1xuICBvLmxlZ2VuZCAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ubGVnZW5kKSA9PT0gdHJ1ZSA/IGNvLmxlZ2VuZCAgICAgICAgICAgOiBvLmxlZ2VuZDtcbiAgby5xdWFsaWZpZXIgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnF1YWxpZmllcikgPT09IHRydWUgPyBjby5xdWFsaWZpZXIgICAgIDogby5xdWFsaWZpZXI7XG4gIG8uZm9vdGVyICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5mb290ZXIpID09PSB0cnVlID8gY28uZm9vdGVyICAgICAgICAgICA6IG8uZm9vdGVyO1xuICBvLnhfYXhpcyAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ueF9heGlzKSA9PT0gdHJ1ZSA/IGNvLnhfYXhpcyAgICAgICAgICAgOiBvLnhfYXhpcztcbiAgby55X2F4aXMgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnlfYXhpcykgPT09IHRydWUgPyBjby55X2F4aXMgICAgICAgICAgIDogby55X2F4aXM7XG4gIG8udGlwcyAgICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby50aXBzKSA9PT0gdHJ1ZSA/IGNvLnRpcHMgICAgICAgICAgICAgICA6IG8udGlwcztcbiAgby5hbm5vdGF0aW9ucyA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmFubm90YXRpb25zKSA9PT0gdHJ1ZSA/IGNvLmFubm90YXRpb25zIDogby5hbm5vdGF0aW9ucztcbiAgby5yYW5nZSAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnJhbmdlKSA9PT0gdHJ1ZSA/IGNvLnJhbmdlICAgICAgICAgICAgIDogby5yYW5nZTtcbiAgby5zZXJpZXMgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnNlcmllcykgPT09IHRydWUgPyBjby5zZXJpZXMgICAgICAgICAgIDogby5zZXJpZXM7XG4gIG8uaW5kZXggICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5pbmRleGVkKSA9PT0gdHJ1ZSA/IGNvLmluZGV4ZWQgICAgICAgICA6IG8uaW5kZXg7XG5cbiAgLy8gIHRoZXNlIGFyZSBzcGVjaWZpYyB0byB0aGUgdCBvYmplY3QgYW5kIGRvbid0IGV4aXN0IGluIHRoZSBlbWJlZFxuICB0LmJhc2VDbGFzcyAgICAgICAgPSBlbWJlZC5iYXNlQ2xhc3MgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmJhc2VDbGFzcztcblxuICB0LmRpbWVuc2lvbnMud2lkdGggPSBlbWJlZC53aWR0aCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmRpbWVuc2lvbnMud2lkdGg7XG5cbiAgdC5wcmVmaXggICAgICAgICAgID0gY2hhcnQucHJlZml4ICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5wcmVmaXg7XG4gIHQuZXhwb3J0YWJsZSAgICAgICA9IGNoYXJ0LmV4cG9ydGFibGUgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuZXhwb3J0YWJsZTtcbiAgdC5lZGl0YWJsZSAgICAgICAgID0gY2hhcnQuZWRpdGFibGUgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5lZGl0YWJsZTtcblxuICBpZiAodC5leHBvcnRhYmxlKSB7XG4gICAgdC5kaW1lbnNpb25zLndpZHRoID0gY2hhcnQuZXhwb3J0YWJsZS53aWR0aCB8fCBlbWJlZC53aWR0aCB8fCB0LmRpbWVuc2lvbnMud2lkdGg7XG4gICAgdC5kaW1lbnNpb25zLmhlaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY2hhcnQuZXhwb3J0YWJsZS5oZWlnaHQ7IH1cbiAgICB0LmRpbWVuc2lvbnMubWFyZ2luID0gY2hhcnQuZXhwb3J0YWJsZS5tYXJnaW4gfHwgdC5kaW1lbnNpb25zLm1hcmdpbjtcbiAgfVxuXG4gIGlmIChjaGFydC5oYXNIb3VycykgeyB0LmRhdGVGb3JtYXQgKz0gXCIgXCIgKyB0LnRpbWVGb3JtYXQ7IH1cbiAgdC5oYXNIb3VycyAgICAgICAgID0gY2hhcnQuaGFzSG91cnMgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5oYXNIb3VycztcbiAgdC5kYXRlRm9ybWF0ICAgICAgID0gY2hhcnQuZGF0ZUZvcm1hdCAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5kYXRlRm9ybWF0O1xuXG4gIHQuZGF0ZUZvcm1hdCA9IGRhdGFQYXJzZS5pbnB1dERhdGUodC54QXhpcy5zY2FsZSwgdC5kYXRlRm9ybWF0LCBjaGFydC5kYXRlX2Zvcm1hdCk7XG4gIHQuZGF0YSA9IGRhdGFQYXJzZS5wYXJzZShjaGFydC5kYXRhLCB0LmRhdGVGb3JtYXQsIG8uaW5kZXgsIG8uc3RhY2tlZCwgby50eXBlKSB8fCB0LmRhdGE7XG5cbiAgcmV0dXJuIHQ7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZWNpcGVGYWN0b3J5O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy91dGlscy9mYWN0b3J5LmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBIZWxwZXJzIHRoYXQgbWFuaXB1bGF0ZSBhbmQgY2hlY2sgcHJpbWl0aXZlcy4gTm90aGluZyBEMy1zcGVjaWZpYyBoZXJlLlxuICogQG1vZHVsZSBoZWxwZXJzL2hlbHBlcnNcbiAqL1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhbiBpbnRlZ2VyLCBmYWxzZSBvdGhlcndpc2UuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0ludGVnZXIoeCkge1xuICByZXR1cm4geCAlIDEgPT09IDA7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgZmxvYXQuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0Zsb2F0KG4pIHtcbiAgcmV0dXJuIG4gPT09ICtuICYmIG4gIT09IChufDApO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBhIHZhbHVlIGlzIGVtcHR5LiBXb3JrcyBmb3IgT2JqZWN0cywgQXJyYXlzLCBTdHJpbmdzIGFuZCBJbnRlZ2Vycy5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRW1wdHkodmFsKSB7XG4gIGlmICh2YWwuY29uc3RydWN0b3IgPT0gT2JqZWN0KSB7XG4gICAgZm9yICh2YXIgcHJvcCBpbiB2YWwpIHtcbiAgICAgIGlmICh2YWwuaGFzT3duUHJvcGVydHkocHJvcCkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKHZhbC5jb25zdHJ1Y3RvciA9PSBBcnJheSkge1xuICAgIHJldHVybiAhdmFsLmxlbmd0aDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gIXZhbDtcbiAgfVxufVxuXG4vKipcbiAqIFNpbXBsZSBjaGVjayBmb3Igd2hldGhlciBhIHZhbHVlIGlzIHVuZGVmaW5lZCBvciBub3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgPyB0cnVlIDogZmFsc2U7XG59XG5cbi8qKlxuICogR2l2ZW4gdHdvIGFycmF5cywgcmV0dXJucyBvbmx5IHVuaXF1ZSB2YWx1ZXMgaW4gdGhvc2UgYXJyYXlzLlxuICogQHBhcmFtICB7QXJyYXl9IGExXG4gKiBAcGFyYW0gIHtBcnJheX0gYTJcbiAqIEByZXR1cm4ge0FycmF5fSAgICBBcnJheSBvZiB1bmlxdWUgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBhcnJheURpZmYoYTEsIGEyKSB7XG4gIHZhciBvMSA9IHt9LCBvMiA9IHt9LCBkaWZmPSBbXSwgaSwgbGVuLCBrO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBhMS5sZW5ndGg7IGkgPCBsZW47IGkrKykgeyBvMVthMVtpXV0gPSB0cnVlOyB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGEyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7IG8yW2EyW2ldXSA9IHRydWU7IH1cbiAgZm9yIChrIGluIG8xKSB7IGlmICghKGsgaW4gbzIpKSB7IGRpZmYucHVzaChrKTsgfSB9XG4gIGZvciAoayBpbiBvMikgeyBpZiAoIShrIGluIG8xKSkgeyBkaWZmLnB1c2goayk7IH0gfVxuICByZXR1cm4gZGlmZjtcbn1cblxuLyoqXG4gKiBPcHBvc2l0ZSBvZiBhcnJheURpZmYoKSwgdGhpcyByZXR1cm5zIG9ubHkgY29tbW9uIGVsZW1lbnRzIGJldHdlZW4gYXJyYXlzLlxuICogQHBhcmFtICB7QXJyYXl9IGFycjFcbiAqIEBwYXJhbSAge0FycmF5fSBhcnIyXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgICBBcnJheSBvZiBjb21tb24gdmFsdWVzLlxuICovXG5mdW5jdGlvbiBhcnJheVNhbWUoYTEsIGEyKSB7XG4gIHZhciByZXQgPSBbXTtcbiAgZm9yIChpIGluIGExKSB7XG4gICAgaWYgKGEyLmluZGV4T2YoIGExW2ldICkgPiAtMSl7XG4gICAgICByZXQucHVzaCggYTFbaV0gKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzICdmcm9tJyBvYmplY3Qgd2l0aCBtZW1iZXJzIGZyb20gJ3RvJy4gSWYgJ3RvJyBpcyBudWxsLCBhIGRlZXAgY2xvbmUgb2YgJ2Zyb20nIGlzIHJldHVybmVkXG4gKiBAcGFyYW0gIHsqfSBmcm9tXG4gKiBAcGFyYW0gIHsqfSB0b1xuICogQHJldHVybiB7Kn0gICAgICBDbG9uZWQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBleHRlbmQoZnJvbSwgdG8pIHtcbiAgaWYgKGZyb20gPT0gbnVsbCB8fCB0eXBlb2YgZnJvbSAhPSBcIm9iamVjdFwiKSByZXR1cm4gZnJvbTtcbiAgaWYgKGZyb20uY29uc3RydWN0b3IgIT0gT2JqZWN0ICYmIGZyb20uY29uc3RydWN0b3IgIT0gQXJyYXkpIHJldHVybiBmcm9tO1xuICBpZiAoZnJvbS5jb25zdHJ1Y3RvciA9PSBEYXRlIHx8IGZyb20uY29uc3RydWN0b3IgPT0gUmVnRXhwIHx8IGZyb20uY29uc3RydWN0b3IgPT0gRnVuY3Rpb24gfHxcbiAgICBmcm9tLmNvbnN0cnVjdG9yID09IFN0cmluZyB8fCBmcm9tLmNvbnN0cnVjdG9yID09IE51bWJlciB8fCBmcm9tLmNvbnN0cnVjdG9yID09IEJvb2xlYW4pXG4gICAgcmV0dXJuIG5ldyBmcm9tLmNvbnN0cnVjdG9yKGZyb20pO1xuXG4gIHRvID0gdG8gfHwgbmV3IGZyb20uY29uc3RydWN0b3IoKTtcblxuICBmb3IgKHZhciBuYW1lIGluIGZyb20pIHtcbiAgICB0b1tuYW1lXSA9IHR5cGVvZiB0b1tuYW1lXSA9PSBcInVuZGVmaW5lZFwiID8gZXh0ZW5kKGZyb21bbmFtZV0sIG51bGwpIDogdG9bbmFtZV07XG4gIH1cblxuICByZXR1cm4gdG87XG59XG5cbi8qKlxuICogQ29tcGFyZXMgdHdvIG9iamVjdHMsIHJldHVybmluZyBhbiBhcnJheSBvZiB1bmlxdWUga2V5cy5cbiAqIEBwYXJhbSAge09iamVjdH0gbzFcbiAqIEBwYXJhbSAge09iamVjdH0gbzJcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiB1bmlxdWVLZXlzKG8xLCBvMikge1xuICByZXR1cm4gYXJyYXlEaWZmKGQzLmtleXMobzEpLCBkMy5rZXlzKG8yKSk7XG59XG5cbi8qKlxuICogQ29tcGFyZXMgdHdvIG9iamVjdHMsIHJldHVybmluZyBhbiBhcnJheSBvZiBjb21tb24ga2V5cy5cbiAqIEBwYXJhbSAge09iamVjdH0gbzFcbiAqIEBwYXJhbSAge09iamVjdH0gbzJcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBzYW1lS2V5cyhvMSwgbzIpIHtcbiAgcmV0dXJuIGFycmF5U2FtZShkMy5rZXlzKG8xKSwgZDMua2V5cyhvMikpO1xufVxuXG4vKipcbiAqIElmIGEgc3RyaW5nIGlzIHVuZGVmaW5lZCwgcmV0dXJuIGFuIGVtcHR5IHN0cmluZyBpbnN0ZWFkLlxuICogQHBhcmFtICB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gY2xlYW5TdHIoc3RyKXtcbiAgaWYgKHN0ciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNJbnRlZ2VyOiBpc0ludGVnZXIsXG4gIGlzRmxvYXQ6IGlzRmxvYXQsXG4gIGlzRW1wdHk6IGlzRW1wdHksXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIGFycmF5RGlmZjogYXJyYXlEaWZmLFxuICBhcnJheVNhbWU6IGFycmF5U2FtZSxcbiAgdW5pcXVlS2V5czogdW5pcXVlS2V5cyxcbiAgc2FtZUtleXM6IHNhbWVLZXlzLFxuICBjbGVhblN0cjogY2xlYW5TdHJcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2hlbHBlcnMvaGVscGVycy5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ2hhcnQgY29udHJ1Y3Rpb24gbWFuYWdlciBtb2R1bGUuXG4gKiBAbW9kdWxlIGNoYXJ0cy9tYW5hZ2VyXG4gKi9cblxuLyoqXG4gKiBNYW5hZ2VzIHRoZSBzdGVwLWJ5LXN0ZXAgY3JlYXRpb24gb2YgYSBjaGFydCwgYW5kIHJldHVybnMgdGhlIGZ1bGwgY29uZmlndXJhdGlvbiBmb3IgdGhlIGNoYXJ0LCBpbmNsdWRpbmcgcmVmZXJlbmNlcyB0byBub2Rlcywgc2NhbGVzLCBheGVzLCBldGMuXG4gKiBAcGFyYW0ge1N0cmluZ30gY29udGFpbmVyIFNlbGVjdG9yIGZvciB0aGUgY29udGFpbmVyIHRoZSBjaGFydCB3aWxsIGJlIGRyYXduIGludG8uXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqICAgICAgIE9iamVjdCB0aGF0IGNvbnRhaW5zIHNldHRpbmdzIGZvciB0aGUgY2hhcnQuXG4gKi9cbmZ1bmN0aW9uIENoYXJ0TWFuYWdlcihjb250YWluZXIsIG9iaikge1xuXG4gIHZhciBSZWNpcGUgPSByZXF1aXJlKFwiLi4vdXRpbHMvZmFjdG9yeVwiKSxcbiAgICAgIHNldHRpbmdzID0gcmVxdWlyZShcIi4uL2NvbmZpZy9jaGFydC1zZXR0aW5nc1wiKSxcbiAgICAgIGNvbXBvbmVudHMgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2NvbXBvbmVudHNcIik7XG5cbiAgdmFyIGNoYXJ0UmVjaXBlID0gbmV3IFJlY2lwZShzZXR0aW5ncywgb2JqKTtcblxuICB2YXIgcmVuZGVyZWQgPSBjaGFydFJlY2lwZS5yZW5kZXJlZCA9IHt9O1xuXG4gIC8vIGNoZWNrIHRoYXQgZWFjaCBzZWN0aW9uIGlzIG5lZWRlZFxuXG4gIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLmhlYWQpIHtcbiAgICByZW5kZXJlZC5oZWFkZXIgPSBjb21wb25lbnRzLmhlYWRlcihjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcbiAgfVxuXG4gIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLmZvb3Rlcikge1xuICAgIHJlbmRlcmVkLmZvb3RlciA9IGNvbXBvbmVudHMuZm9vdGVyKGNvbnRhaW5lciwgY2hhcnRSZWNpcGUpO1xuICB9XG5cbiAgdmFyIG5vZGUgPSBjb21wb25lbnRzLmJhc2UoY29udGFpbmVyLCBjaGFydFJlY2lwZSk7XG5cbiAgcmVuZGVyZWQuY29udGFpbmVyID0gbm9kZTtcblxuICByZW5kZXJlZC5wbG90ID0gY29tcG9uZW50cy5wbG90KG5vZGUsIGNoYXJ0UmVjaXBlKTtcblxuICBpZiAoY2hhcnRSZWNpcGUub3B0aW9ucy5xdWFsaWZpZXIpIHtcbiAgICByZW5kZXJlZC5xdWFsaWZpZXIgPSBjb21wb25lbnRzLnF1YWxpZmllcihub2RlLCBjaGFydFJlY2lwZSk7XG4gIH1cblxuICBpZiAoY2hhcnRSZWNpcGUub3B0aW9ucy50aXBzKSB7XG4gICAgcmVuZGVyZWQudGlwcyA9IGNvbXBvbmVudHMudGlwcyhub2RlLCBjaGFydFJlY2lwZSk7XG4gIH1cblxuICBpZiAoIWNoYXJ0UmVjaXBlLmVkaXRhYmxlICYmICFjaGFydFJlY2lwZS5leHBvcnRhYmxlKSB7XG4gICAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuc2hhcmVfZGF0YSkge1xuICAgICAgcmVuZGVyZWQuc2hhcmVEYXRhID0gY29tcG9uZW50cy5zaGFyZURhdGEoY29udGFpbmVyLCBjaGFydFJlY2lwZSk7XG4gICAgfVxuICAgIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLnNvY2lhbCkge1xuICAgICAgcmVuZGVyZWQuc29jaWFsID0gY29tcG9uZW50cy5zb2NpYWwoY29udGFpbmVyLCBjaGFydFJlY2lwZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNoYXJ0UmVjaXBlLkNVU1RPTSkge1xuICAgIHZhciBjdXN0b20gPSByZXF1aXJlKFwiLi4vLi4vLi4vY3VzdG9tL2N1c3RvbS5qc1wiKTtcbiAgICByZW5kZXJlZC5jdXN0b20gPSBjdXN0b20obm9kZSwgY2hhcnRSZWNpcGUsIHJlbmRlcmVkKTtcbiAgfVxuXG4gIHJldHVybiBjaGFydFJlY2lwZTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGFydE1hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9tYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGNvbXBvbmVudHMgPSB7XG4gIGJhc2U6IHJlcXVpcmUoXCIuL2Jhc2VcIiksXG4gIGhlYWRlcjogcmVxdWlyZShcIi4vaGVhZGVyXCIpLFxuICBmb290ZXI6IHJlcXVpcmUoXCIuL2Zvb3RlclwiKSxcbiAgcGxvdDogcmVxdWlyZShcIi4vcGxvdFwiKSxcbiAgcXVhbGlmaWVyOiByZXF1aXJlKFwiLi9xdWFsaWZpZXJcIiksXG4gIGF4aXM6IHJlcXVpcmUoXCIuL2F4aXNcIiksXG4gIHNjYWxlOiByZXF1aXJlKFwiLi9zY2FsZVwiKSxcbiAgdGlwczogcmVxdWlyZShcIi4vdGlwc1wiKSxcbiAgc29jaWFsOiByZXF1aXJlKFwiLi9zb2NpYWxcIiksXG4gIHNoYXJlRGF0YTogcmVxdWlyZShcIi4vc2hhcmUtZGF0YVwiKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnRzO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9jb21wb25lbnRzLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIGFwcGVuZChjb250YWluZXIsIG9iaikge1xuXG4gIHZhciBtYXJnaW4gPSBvYmouZGltZW5zaW9ucy5tYXJnaW47XG5cbiAgdmFyIGNoYXJ0QmFzZSA9IGQzLnNlbGVjdChjb250YWluZXIpXG4gICAgLmluc2VydChcInN2Z1wiLCBcIi5cIiArIG9iai5wcmVmaXggKyBcImNoYXJ0X3NvdXJjZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLmJhc2VDbGFzcygpICsgXCJfc3ZnIFwiICsgb2JqLnByZWZpeCArIG9iai5jdXN0b21DbGFzcyArIFwiIFwiICsgb2JqLnByZWZpeCArIFwidHlwZV9cIiArIG9iai5vcHRpb25zLnR5cGUgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcInNlcmllcy1cIiArIG9iai5kYXRhLnNlcmllc0Ftb3VudCxcbiAgICAgIFwid2lkdGhcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQsXG4gICAgICBcImhlaWdodFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20sXG4gICAgICBcInZlcnNpb25cIjogMS4xLFxuICAgICAgXCJ4bWxuc1wiOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICB9KTtcblxuICAvLyBiYWNrZ3JvdW5kIHJlY3RcbiAgY2hhcnRCYXNlXG4gICAgLmFwcGVuZChcInJlY3RcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcImJnXCIsXG4gICAgICBcInhcIjogMCxcbiAgICAgIFwieVwiOiAwLFxuICAgICAgXCJ3aWR0aFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCksXG4gICAgICBcImhlaWdodFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyBtYXJnaW4ubGVmdCArIFwiLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiXG4gICAgfSk7XG5cbiAgdmFyIGdyYXBoID0gY2hhcnRCYXNlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcImdyYXBoXCIsXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCJcbiAgICB9KTtcblxuICByZXR1cm4gZ3JhcGg7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBlbmQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2Jhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gaGVhZGVyQ29tcG9uZW50KGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIGhlbHBlcnMgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9oZWxwZXJzXCIpO1xuXG4gIHZhciBoZWFkZXJHcm91cCA9IGQzLnNlbGVjdChjb250YWluZXIpXG4gICAgLmFwcGVuZChcImRpdlwiKVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImNoYXJ0X3RpdGxlIFwiICsgb2JqLnByZWZpeCArIG9iai5jdXN0b21DbGFzcywgdHJ1ZSlcblxuICAvLyBoYWNrIG5lY2Vzc2FyeSB0byBlbnN1cmUgUERGIGZpZWxkcyBhcmUgc2l6ZWQgcHJvcGVybHlcbiAgaWYgKG9iai5leHBvcnRhYmxlKSB7XG4gICAgaGVhZGVyR3JvdXAuc3R5bGUoXCJ3aWR0aFwiLCBvYmouZXhwb3J0YWJsZS53aWR0aCArIFwicHhcIik7XG4gIH1cblxuICBpZiAob2JqLmhlYWRpbmcgIT09IFwiXCIgfHwgb2JqLmVkaXRhYmxlKSB7XG4gICAgdmFyIGhlYWRlclRleHQgPSBoZWFkZXJHcm91cFxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJjaGFydF90aXRsZS10ZXh0XCIpXG4gICAgICAudGV4dChvYmouaGVhZGluZyk7XG5cbiAgICBpZiAob2JqLmVkaXRhYmxlKSB7XG4gICAgICBoZWFkZXJUZXh0XG4gICAgICAgIC5hdHRyKFwiY29udGVudEVkaXRhYmxlXCIsIHRydWUpXG4gICAgICAgIC5jbGFzc2VkKFwiZWRpdGFibGUtY2hhcnRfdGl0bGVcIiwgdHJ1ZSk7XG4gICAgfVxuXG4gIH1cblxuICB2YXIgcXVhbGlmaWVyO1xuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlID09PSBcImJhclwiKSB7XG4gICAgcXVhbGlmaWVyID0gaGVhZGVyR3JvdXBcbiAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgc3RyID0gb2JqLnByZWZpeCArIFwiY2hhcnRfcXVhbGlmaWVyIFwiICsgb2JqLnByZWZpeCArIFwiY2hhcnRfcXVhbGlmaWVyLWJhclwiO1xuICAgICAgICAgIGlmIChvYmouZWRpdGFibGUpIHtcbiAgICAgICAgICAgIHN0ciArPSBcIiBlZGl0YWJsZS1jaGFydF9xdWFsaWZpZXJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZW50RWRpdGFibGVcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIG9iai5lZGl0YWJsZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC50ZXh0KG9iai5xdWFsaWZpZXIpO1xuICB9XG5cbiAgaWYgKG9iai5kYXRhLmtleXMubGVuZ3RoID4gMikge1xuXG4gICAgdmFyIGxlZ2VuZCA9IGhlYWRlckdyb3VwLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiY2hhcnRfbGVnZW5kXCIsIHRydWUpO1xuXG4gICAgdmFyIGtleXMgPSBoZWxwZXJzLmV4dGVuZChvYmouZGF0YS5rZXlzKTtcblxuICAgIC8vIGdldCByaWQgb2YgdGhlIGZpcnN0IGl0ZW0gYXMgaXQgZG9lc250IHJlcHJlc2VudCBhIHNlcmllc1xuICAgIGtleXMuc2hpZnQoKTtcblxuICAgIGlmIChvYmoub3B0aW9ucy50eXBlID09PSBcIm11bHRpbGluZVwiKSB7XG4gICAgICBrZXlzID0gW2tleXNbMF0sIGtleXNbMV1dO1xuICAgICAgbGVnZW5kLmNsYXNzZWQob2JqLnByZWZpeCArIFwiY2hhcnRfbGVnZW5kLVwiICsgb2JqLm9wdGlvbnMudHlwZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgdmFyIGxlZ2VuZEl0ZW0gPSBsZWdlbmQuc2VsZWN0QWxsKFwiZGl2LlwiICsgb2JqLnByZWZpeCArIFwibGVnZW5kX2l0ZW1cIilcbiAgICAgIC5kYXRhKGtleXMpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbSBcIiArIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtX1wiICsgKGkpO1xuICAgICAgfSk7XG5cbiAgICBsZWdlbmRJdGVtLmFwcGVuZChcInNwYW5cIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwibGVnZW5kX2l0ZW1faWNvblwiKTtcblxuICAgIGxlZ2VuZEl0ZW0uYXBwZW5kKFwic3BhblwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbV90ZXh0XCIpXG4gICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcbiAgfVxuXG4gIG9iai5kaW1lbnNpb25zLmhlYWRlckhlaWdodCA9IGhlYWRlckdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgcmV0dXJuIHtcbiAgICBoZWFkZXJHcm91cDogaGVhZGVyR3JvdXAsXG4gICAgbGVnZW5kOiBsZWdlbmQsXG4gICAgcXVhbGlmaWVyOiBxdWFsaWZpZXJcbiAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhlYWRlckNvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvaGVhZGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIGZvb3RlckNvbXBvbmVudChjb250YWluZXIsIG9iaikge1xuXG4gIHZhciBmb290ZXJHcm91cDtcblxuICBpZiAob2JqLnNvdXJjZSAhPT0gXCJcIiB8fCBvYmouZWRpdGFibGUpIHtcbiAgICBmb290ZXJHcm91cCA9IGQzLnNlbGVjdChjb250YWluZXIpXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJjaGFydF9zb3VyY2VcIiwgdHJ1ZSk7XG5cbiAgICAvLyBoYWNrIG5lY2Vzc2FyeSB0byBlbnN1cmUgUERGIGZpZWxkcyBhcmUgc2l6ZWQgcHJvcGVybHlcbiAgICBpZiAob2JqLmV4cG9ydGFibGUpIHtcbiAgICAgIGZvb3Rlckdyb3VwLnN0eWxlKFwid2lkdGhcIiwgb2JqLmV4cG9ydGFibGUud2lkdGggKyBcInB4XCIpO1xuICAgIH1cblxuICAgIHZhciBmb290ZXJUZXh0ID0gZm9vdGVyR3JvdXAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImNoYXJ0X3NvdXJjZS10ZXh0XCIpXG4gICAgICAudGV4dChvYmouc291cmNlKTtcblxuICAgIGlmIChvYmouZWRpdGFibGUpIHtcbiAgICAgIGZvb3RlclRleHRcbiAgICAgICAgLmF0dHIoXCJjb250ZW50RWRpdGFibGVcIiwgdHJ1ZSlcbiAgICAgICAgLmNsYXNzZWQoXCJlZGl0YWJsZS1jaGFydF9zb3VyY2VcIiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgb2JqLmRpbWVuc2lvbnMuZm9vdGVySGVpZ2h0ID0gZm9vdGVyR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmb290ZXJHcm91cDogZm9vdGVyR3JvdXBcbiAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvb3RlckNvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvZm9vdGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIHBsb3Qobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGRyYXcgPSB7XG4gICAgbGluZTogcmVxdWlyZShcIi4uL3R5cGVzL2xpbmVcIiksXG4gICAgbXVsdGlsaW5lOiByZXF1aXJlKFwiLi4vdHlwZXMvbXVsdGlsaW5lXCIpLFxuICAgIGFyZWE6IHJlcXVpcmUoXCIuLi90eXBlcy9hcmVhXCIpLFxuICAgIHN0YWNrZWRBcmVhOiByZXF1aXJlKFwiLi4vdHlwZXMvc3RhY2tlZC1hcmVhXCIpLFxuICAgIGNvbHVtbjogcmVxdWlyZShcIi4uL3R5cGVzL2NvbHVtblwiKSxcbiAgICBiYXI6IHJlcXVpcmUoXCIuLi90eXBlcy9iYXJcIiksXG4gICAgc3RhY2tlZENvbHVtbjogcmVxdWlyZShcIi4uL3R5cGVzL3N0YWNrZWQtY29sdW1uXCIpLFxuICAgIHN0cmVhbWdyYXBoOiByZXF1aXJlKFwiLi4vdHlwZXMvc3RyZWFtZ3JhcGhcIilcbiAgfTtcblxuICB2YXIgY2hhcnRSZWY7XG5cbiAgc3dpdGNoKG9iai5vcHRpb25zLnR5cGUpIHtcblxuICAgIGNhc2UgXCJsaW5lXCI6XG4gICAgICBjaGFydFJlZiA9IGRyYXcubGluZShub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwibXVsdGlsaW5lXCI6XG4gICAgICBjaGFydFJlZiA9IGRyYXcubXVsdGlsaW5lKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJhcmVhXCI6XG4gICAgICBjaGFydFJlZiA9IG9iai5vcHRpb25zLnN0YWNrZWQgPyBkcmF3LnN0YWNrZWRBcmVhKG5vZGUsIG9iaikgOiBkcmF3LmFyZWEobm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcImJhclwiOlxuICAgICAgY2hhcnRSZWYgPSBkcmF3LmJhcihub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiY29sdW1uXCI6XG4gICAgICBjaGFydFJlZiA9IG9iai5vcHRpb25zLnN0YWNrZWQgPyBkcmF3LnN0YWNrZWRDb2x1bW4obm9kZSwgb2JqKSA6IGRyYXcuY29sdW1uKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJzdHJlYW1cIjpcbiAgICAgIGNoYXJ0UmVmID0gZHJhdy5zdHJlYW1ncmFwaChub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgY2hhcnRSZWYgPSBkcmF3LmxpbmUobm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIGNoYXJ0UmVmO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGxvdDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcGxvdC5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBMaW5lQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID09PSAxKSB7IG9iai5zZXJpZXNIaWdobGlnaHQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH0gfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsaXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KTtcblxuICAvLyBTZWNvbmRhcnkgYXJyYXkgaXMgdXNlZCB0byBzdG9yZSBhIHJlZmVyZW5jZSB0byBhbGwgc2VyaWVzIGV4Y2VwdCBmb3IgdGhlIGhpZ2hsaWdodGVkIGl0ZW1cbiAgdmFyIHNlY29uZGFyeUFyciA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSBvYmouZGF0YS5zZXJpZXNBbW91bnQgLSAxOyBpID49IDA7IGktLSkge1xuICAgIC8vIERvbnQgd2FudCB0byBpbmNsdWRlIHRoZSBoaWdobGlnaHRlZCBpdGVtIGluIHRoZSBsb29wXG4gICAgLy8gYmVjYXVzZSB3ZSBhbHdheXMgd2FudCBpdCB0byBzaXQgYWJvdmUgYWxsIHRoZSBvdGhlciBsaW5lc1xuXG4gICAgaWYgKGkgIT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuXG4gICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAgICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW2ldLnZhbCk7IH0pXG4gICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tpXS52YWwpOyB9KTtcblxuICAgICAgdmFyIHBhdGhSZWYgPSBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkXCI6IGxpbmUsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJsaW5lLVwiICsgKGkpO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBzZWNvbmRhcnlBcnIucHVzaChwYXRoUmVmKTtcbiAgICB9XG5cbiAgfVxuXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHNlY29uZGFyeSBzZXJpZXMgKGFsbCBzZXJpZXMgZXhjZXB0IHRoZSBoaWdobGlnaHRlZCBvbmUpXG4gIC8vIGFuZCBzZXQgdGhlIGNvbG91cnMgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcblxuICB2YXIgc2Vjb25kYXJ5QXJyID0gc2Vjb25kYXJ5QXJyLnJldmVyc2UoKTtcblxuICB2YXIgaExpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSlcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pO1xuXG4gIHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAuYXR0cih7XG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJsaW5lLVwiICsgKG9iai5zZXJpZXNIaWdobGlnaHQoKSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfSxcbiAgICAgIFwiZFwiOiBoTGluZVxuICAgIH0pO1xuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB5QXhpc09iaiwgXCJ5QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIGhMaW5lOiBoTGluZSxcbiAgICBsaW5lOiBsaW5lXG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGluZUNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvbGluZS5qc1xuICoqIG1vZHVsZSBpZCA9IDE1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBBeGlzRmFjdG9yeShheGlzT2JqLCBzY2FsZSkge1xuXG4gIHZhciBheGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgIC5zY2FsZShzY2FsZSlcbiAgICAub3JpZW50KGF4aXNPYmoub3JpZW50KTtcblxuICByZXR1cm4gYXhpcztcblxufVxuXG5mdW5jdGlvbiBheGlzTWFuYWdlcihub2RlLCBvYmosIHNjYWxlLCBheGlzVHlwZSkge1xuXG4gIHZhciBheGlzT2JqID0gb2JqW2F4aXNUeXBlXTtcbiAgdmFyIGF4aXMgPSBuZXcgQXhpc0ZhY3RvcnkoYXhpc09iaiwgc2NhbGUpO1xuXG4gIHZhciBwcmV2QXhpcyA9IG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cFwiICsgXCIuXCIgKyBvYmoucHJlZml4ICsgYXhpc1R5cGUpLm5vZGUoKTtcblxuICBpZiAocHJldkF4aXMgIT09IG51bGwpIHsgZDMuc2VsZWN0KHByZXZBeGlzKS5yZW1vdmUoKTsgfVxuXG4gIHZhciBheGlzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXBcIiArIFwiIFwiICsgb2JqLnByZWZpeCArIGF4aXNUeXBlKTtcblxuICBpZiAoYXhpc1R5cGUgPT09IFwieEF4aXNcIikge1xuICAgIGFwcGVuZFhBeGlzKGF4aXNHcm91cCwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1R5cGUpO1xuICB9IGVsc2UgaWYgKGF4aXNUeXBlID09PSBcInlBeGlzXCIpIHtcbiAgICBhcHBlbmRZQXhpcyhheGlzR3JvdXAsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNUeXBlKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbm9kZTogYXhpc0dyb3VwLFxuICAgIGF4aXM6IGF4aXNcbiAgfTtcblxufVxuXG5mdW5jdGlvbiBkZXRlcm1pbmVGb3JtYXQoY29udGV4dCkge1xuXG4gIHN3aXRjaCAoY29udGV4dCkge1xuICAgIGNhc2UgXCJ5ZWFyc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlWVwiKTtcbiAgICBjYXNlIFwibW9udGhzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiViXCIpO1xuICAgIGNhc2UgXCJ3ZWVrc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlV1wiKTtcbiAgICBjYXNlIFwiZGF5c1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlalwiKTtcbiAgICBjYXNlIFwiaG91cnNcIjogcmV0dXJuIGQzLnRpbWUuZm9ybWF0KFwiJUhcIik7XG4gICAgY2FzZSBcIm1pbnV0ZXNcIjogcmV0dXJuIGQzLnRpbWUuZm9ybWF0KFwiJU1cIik7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBhcHBlbmRYQXhpcyhheGlzR3JvdXAsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNOYW1lKSB7XG5cbiAgdmFyIGF4aXNPYmogPSBvYmpbYXhpc05hbWVdLFxuICAgICAgYXhpc1NldHRpbmdzO1xuXG4gIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS54X2F4aXMpIHtcbiAgICBheGlzU2V0dGluZ3MgPSBvYmouZXhwb3J0YWJsZS54X2F4aXM7XG4gIH0gZWxzZSB7XG4gICAgYXhpc1NldHRpbmdzID0gYXhpc09iajtcbiAgfVxuXG4gIGF4aXNHcm91cFxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpICsgXCIpXCIpO1xuXG4gIHZhciBheGlzTm9kZSA9IGF4aXNHcm91cC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ4LWF4aXNcIik7XG5cbiAgc3dpdGNoKGF4aXNPYmouc2NhbGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuICAgICAgdGltZUF4aXMoYXhpc05vZGUsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgICAgZGlzY3JldGVBeGlzKGF4aXNOb2RlLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzLCBvYmouZGltZW5zaW9ucyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG4gICAgICBvcmRpbmFsVGltZUF4aXMoYXhpc05vZGUsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncyk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0ID0gYXhpc05vZGUubm9kZSgpLmdldEJCb3goKS5oZWlnaHQ7XG5cbn1cblxuZnVuY3Rpb24gYXBwZW5kWUF4aXMoYXhpc0dyb3VwLCBvYmosIHNjYWxlLCBheGlzLCBheGlzTmFtZSkge1xuXG4gIGF4aXNHcm91cC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMClcIik7XG5cbiAgdmFyIGF4aXNOb2RlID0gYXhpc0dyb3VwLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInktYXhpc1wiKTtcblxuICBkcmF3WUF4aXMob2JqLCBheGlzLCBheGlzTm9kZSk7XG5cbn1cblxuZnVuY3Rpb24gZHJhd1lBeGlzKG9iaiwgYXhpcywgYXhpc05vZGUpIHtcblxuICB2YXIgYXhpc1NldHRpbmdzO1xuXG4gIHZhciBheGlzT2JqID0gb2JqW1wieUF4aXNcIl07XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLnlfYXhpcykge1xuICAgIGF4aXNTZXR0aW5ncyA9IG9iai5leHBvcnRhYmxlLnlfYXhpcztcbiAgfSBlbHNlIHtcbiAgICBheGlzU2V0dGluZ3MgPSBheGlzT2JqO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgPSBheGlzU2V0dGluZ3MucGFkZGluZ1JpZ2h0O1xuXG4gIGF4aXMuc2NhbGUoKS5yYW5nZShbb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKSwgMF0pO1xuXG4gIGF4aXMudGlja1ZhbHVlcyh0aWNrRmluZGVyWShheGlzLnNjYWxlKCksIGF4aXNPYmoudGlja3MsIGF4aXNTZXR0aW5ncykpO1xuXG4gIGF4aXNOb2RlLmNhbGwoYXhpcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwiZ1wiKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSlcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtaW5vclwiLCB0cnVlKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGljayB0ZXh0XCIpXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKVxuICAgIC5jYWxsKHVwZGF0ZVRleHRZLCBheGlzTm9kZSwgb2JqLCBheGlzLCBheGlzT2JqKVxuICAgIC5jYWxsKHJlcG9zaXRpb25UZXh0WSwgb2JqLmRpbWVuc2lvbnMsIGF4aXNPYmoudGV4dFgpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrIGxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICBcIngxXCI6IG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgIFwieDJcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpXG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gdGltZUF4aXMoYXhpc05vZGUsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncykge1xuXG4gIHZhciB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGRvbWFpbiA9IHNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bMV0sIDMpLFxuICAgICAgY3VycmVudEZvcm1hdCA9IGRldGVybWluZUZvcm1hdChjdHgpO1xuXG4gIGF4aXMudGlja0Zvcm1hdChjdXJyZW50Rm9ybWF0KTtcblxuICB2YXIgdGlja3M7XG5cbiAgdmFyIHRpY2tHb2FsO1xuICBpZiAoYXhpc1NldHRpbmdzLnRpY2tzID09PSAnYXV0bycpIHtcbiAgICB0aWNrR29hbCA9IGF4aXNTZXR0aW5ncy50aWNrVGFyZ2V0O1xuICB9IGVsc2Uge1xuICAgIHRpY2tHb2FsID0gYXhpc1NldHRpbmdzLnRpY2tzO1xuICB9XG5cbiAgaWYgKG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpID4gYXhpc1NldHRpbmdzLndpZHRoVGhyZXNob2xkKSB7XG4gICAgdGlja3MgPSB0aWNrRmluZGVyWChkb21haW4sIGN0eCwgdGlja0dvYWwpO1xuICB9IGVsc2Uge1xuICAgIHRpY2tzID0gdGlja0ZpbmRlclgoZG9tYWluLCBjdHgsIGF4aXNTZXR0aW5ncy50aWNrc1NtYWxsKTtcbiAgfVxuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlICE9PSBcImNvbHVtblwiKSB7XG4gICAgYXhpcy50aWNrVmFsdWVzKHRpY2tzKTtcbiAgfSBlbHNlIHtcbiAgICBheGlzLnRpY2tzKCk7XG4gIH1cblxuICBheGlzTm9kZS5jYWxsKGF4aXMpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAuYXR0cih7XG4gICAgICBcInhcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRleHRYLFxuICAgICAgXCJ5XCI6IGF4aXNTZXR0aW5ncy51cHBlci50ZXh0WSxcbiAgICAgIFwiZHlcIjogYXhpc1NldHRpbmdzLmR5ICsgXCJlbVwiXG4gICAgfSlcbiAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXG4gICAgLmNhbGwoc2V0VGlja0Zvcm1hdFgsIGN0eCwgYXhpc1NldHRpbmdzLmVtcywgb2JqLm1vbnRoc0Ficik7XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwiY29sdW1uXCIpIHsgZHJvcFJlZHVuZGFudFRpY2tzKGF4aXNOb2RlLCBjdHgpOyB9XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2tcIilcbiAgICAuY2FsbChkcm9wVGlja3MpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIilcbiAgICAuYXR0cihcInkyXCIsIGF4aXNTZXR0aW5ncy51cHBlci50aWNrSGVpZ2h0KTtcblxufVxuXG5mdW5jdGlvbiBkaXNjcmV0ZUF4aXMoYXhpc05vZGUsIHNjYWxlLCBheGlzLCBheGlzU2V0dGluZ3MsIGRpbWVuc2lvbnMpIHtcblxuICB2YXIgd3JhcFRleHQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikud3JhcFRleHQ7XG5cbiAgYXhpcy50aWNrUGFkZGluZygwKTtcblxuICBzY2FsZS5yYW5nZUV4dGVudChbMCwgZGltZW5zaW9ucy50aWNrV2lkdGgoKV0pO1xuXG4gIHNjYWxlLnJhbmdlUm91bmRCYW5kcyhbMCwgZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sIGRpbWVuc2lvbnMuYmFuZHMucGFkZGluZywgZGltZW5zaW9ucy5iYW5kcy5vdXRlclBhZGRpbmcpO1xuXG4gIHZhciBiYW5kU3RlcCA9IHNjYWxlLnJhbmdlQmFuZCgpO1xuXG4gIGF4aXNOb2RlLmNhbGwoYXhpcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgLmF0dHIoXCJkeVwiLCBheGlzU2V0dGluZ3MuZHkgKyBcImVtXCIpXG4gICAgLmNhbGwod3JhcFRleHQsIGJhbmRTdGVwKTtcblxuICB2YXIgZmlyc3RYUG9zID0gZDMudHJhbnNmb3JtKGF4aXNOb2RlLnNlbGVjdChcIi50aWNrXCIpLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVswXSAqIC0xO1xuXG4gIHZhciB4UG9zID0gKC0gKGJhbmRTdGVwIC8gMikgLSAoYmFuZFN0ZXAgKiBkaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZykpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICBcIngxXCI6IHhQb3MsXG4gICAgICBcIngyXCI6IHhQb3NcbiAgICB9KTtcblxuICBheGlzTm9kZS5zZWxlY3QoXCJsaW5lXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ4MVwiOiBmaXJzdFhQb3MsXG4gICAgICBcIngyXCI6IGZpcnN0WFBvc1xuICAgIH0pO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIilcbiAgICAuYXR0cihcInkyXCIsIGF4aXNTZXR0aW5ncy51cHBlci50aWNrSGVpZ2h0KTtcblxuICB2YXIgbGFzdFRpY2sgPSBheGlzTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBcInRpY2tcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKGRpbWVuc2lvbnMudGlja1dpZHRoKCkgKyAoYmFuZFN0ZXAgLyAyKSArIGJhbmRTdGVwICogZGltZW5zaW9ucy5iYW5kcy5vdXRlclBhZGRpbmcpICsgXCIsMClcIlxuICAgIH0pO1xuXG4gIGxhc3RUaWNrLmFwcGVuZChcImxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICBcInkyXCI6IGF4aXNTZXR0aW5ncy51cHBlci50aWNrSGVpZ2h0LFxuICAgICAgXCJ4MVwiOiB4UG9zLFxuICAgICAgXCJ4MlwiOiB4UG9zXG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gb3JkaW5hbFRpbWVBeGlzKGF4aXNOb2RlLCBvYmosIHNjYWxlLCBheGlzLCBheGlzU2V0dGluZ3MpIHtcblxuICB2YXIgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmYsXG4gICAgICBkb21haW4gPSBzY2FsZS5kb21haW4oKSxcbiAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgMyksXG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZGV0ZXJtaW5lRm9ybWF0KGN0eCk7XG5cbiAgYXhpcy50aWNrRm9ybWF0KGN1cnJlbnRGb3JtYXQpO1xuXG4gIGF4aXNOb2RlLmNhbGwoYXhpcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieFwiOiBheGlzU2V0dGluZ3MudXBwZXIudGV4dFgsXG4gICAgICBcInlcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRleHRZLFxuICAgICAgXCJkeVwiOiBheGlzU2V0dGluZ3MuZHkgKyBcImVtXCJcbiAgICB9KVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAuY2FsbChzZXRUaWNrRm9ybWF0WCwgY3R4LCBheGlzU2V0dGluZ3MuZW1zLCBvYmoubW9udGhzQWJyKTtcblxuICBpZiAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpID4gb2JqLnhBeGlzLndpZHRoVGhyZXNob2xkKSB7XG4gICAgdmFyIG9yZGluYWxUaWNrUGFkZGluZyA9IDM7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG9yZGluYWxUaWNrUGFkZGluZyA9IDQ7XG4gIH1cblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKVxuICAgIC5jYWxsKG9yZGluYWxUaW1lVGlja3MsIGF4aXNOb2RlLCBjdHgsIHNjYWxlLCBvcmRpbmFsVGlja1BhZGRpbmcpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIilcbiAgICAuYXR0cihcInkyXCIsIGF4aXNTZXR0aW5ncy51cHBlci50aWNrSGVpZ2h0KTtcblxufVxuXG4vLyB0ZXh0IGZvcm1hdHRpbmcgZnVuY3Rpb25zXG5cbmZ1bmN0aW9uIHNldFRpY2tGb3JtYXRYKHNlbGVjdGlvbiwgY3R4LCBlbXMsIG1vbnRoc0Ficikge1xuXG4gIHZhciBwcmV2WWVhcixcbiAgICAgIHByZXZNb250aCxcbiAgICAgIHByZXZEYXRlLFxuICAgICAgZFllYXIsXG4gICAgICBkTW9udGgsXG4gICAgICBkRGF0ZSxcbiAgICAgIGRIb3VyLFxuICAgICAgZE1pbnV0ZTtcblxuICBzZWxlY3Rpb24udGV4dChmdW5jdGlvbihkKSB7XG5cbiAgICB2YXIgbm9kZSA9IGQzLnNlbGVjdCh0aGlzKTtcblxuICAgIHZhciBkU3RyO1xuXG4gICAgc3dpdGNoIChjdHgpIHtcbiAgICAgIGNhc2UgXCJ5ZWFyc1wiOlxuICAgICAgICBkU3RyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJtb250aHNcIjpcblxuICAgICAgICBkTW9udGggPSBtb250aHNBYnJbZC5nZXRNb250aCgpXTtcbiAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG5cbiAgICAgICAgaWYgKGRZZWFyICE9PSBwcmV2WWVhcikge1xuICAgICAgICAgIG5ld1RleHROb2RlKG5vZGUsIGRZZWFyLCBlbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZFN0ciA9IGRNb250aDtcblxuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIndlZWtzXCI6XG4gICAgICBjYXNlIFwiZGF5c1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZE1vbnRoID0gbW9udGhzQWJyW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG5cbiAgICAgICAgaWYgKGRNb250aCAhPT0gcHJldk1vbnRoKSB7XG4gICAgICAgICAgZFN0ciA9IGRNb250aCArIFwiIFwiICsgZERhdGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZFN0ciA9IGREYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRZZWFyICE9PSBwcmV2WWVhcikge1xuICAgICAgICAgIG5ld1RleHROb2RlKG5vZGUsIGRZZWFyLCBlbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldk1vbnRoID0gZE1vbnRoO1xuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwiaG91cnNcIjpcbiAgICAgICAgZE1vbnRoID0gbW9udGhzQWJyW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIGRIb3VyID0gZC5nZXRIb3VycygpO1xuICAgICAgICBkTWludXRlID0gZC5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgdmFyIGRIb3VyU3RyLFxuICAgICAgICAgICAgZE1pbnV0ZVN0cjtcblxuICAgICAgICAvLyBDb252ZXJ0IGZyb20gMjRoIHRpbWVcbiAgICAgICAgdmFyIHN1ZmZpeCA9IChkSG91ciA+PSAxMikgPyAncC5tLicgOiAnYS5tLic7XG4gICAgICAgIGlmIChkSG91ciA9PT0gMCkge1xuICAgICAgICAgIGRIb3VyU3RyID0gMTI7XG4gICAgICAgIH0gZWxzZSBpZiAoZEhvdXIgPiAxMikge1xuICAgICAgICAgIGRIb3VyU3RyID0gZEhvdXIgLSAxMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkSG91clN0ciA9IGRIb3VyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBtaW51dGVzIGZvbGxvdyBHbG9iZSBzdHlsZVxuICAgICAgICBpZiAoZE1pbnV0ZSA9PT0gMCkge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnJztcbiAgICAgICAgfSBlbHNlIGlmIChkTWludXRlIDwgMTApIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJzowJyArIGRNaW51dGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICc6JyArIGRNaW51dGU7XG4gICAgICAgIH1cblxuICAgICAgICBkU3RyID0gZEhvdXJTdHIgKyBkTWludXRlU3RyICsgJyAnICsgc3VmZml4O1xuXG4gICAgICAgIGlmIChkRGF0ZSAhPT0gcHJldkRhdGUpIHtcbiAgICAgICAgICB2YXIgZGF0ZVN0ciA9IGRNb250aCArIFwiIFwiICsgZERhdGU7XG4gICAgICAgICAgbmV3VGV4dE5vZGUobm9kZSwgZGF0ZVN0ciwgZW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZEYXRlID0gZERhdGU7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBkU3RyID0gZDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRTdHI7XG5cbiAgfSk7XG5cbn1cblxuZnVuY3Rpb24gc2V0VGlja0Zvcm1hdFkoZm9ybWF0LCBkLCBsYXN0VGljaykge1xuICAvLyBjaGVja2luZyBmb3IgYSBmb3JtYXQgYW5kIGZvcm1hdHRpbmcgeS1heGlzIHZhbHVlcyBhY2NvcmRpbmdseVxuXG4gIHZhciBpc0Zsb2F0ID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvaGVscGVyc1wiKS5pc0Zsb2F0O1xuXG4gIHZhciBjdXJyZW50Rm9ybWF0O1xuXG4gIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgY2FzZSBcImdlbmVyYWxcIjpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCJnXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNpXCI6XG4gICAgICB2YXIgcHJlZml4ID0gZDMuZm9ybWF0UHJlZml4KGxhc3RUaWNrKSxcbiAgICAgICAgICBmb3JtYXQgPSBkMy5mb3JtYXQoXCIuMWZcIik7XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZm9ybWF0KHByZWZpeC5zY2FsZShkKSkgKyBwcmVmaXguc3ltYm9sO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImNvbW1hXCI6XG4gICAgICBpZiAoaXNGbG9hdChwYXJzZUZsb2F0KGQpKSkge1xuICAgICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLC4yZlwiKShkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsZ1wiKShkKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyb3VuZDFcIjpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjFmXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInJvdW5kMlwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIiwuMmZcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicm91bmQzXCI6XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLC4zZlwiKShkKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyb3VuZDRcIjpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjRmXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsZ1wiKShkKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRGb3JtYXQ7XG5cbn1cblxuZnVuY3Rpb24gdXBkYXRlVGV4dFgodGV4dE5vZGVzLCBheGlzTm9kZSwgb2JqLCBheGlzLCBheGlzT2JqKSB7XG5cbiAgdmFyIGxhc3RUaWNrID0gYXhpcy50aWNrVmFsdWVzKClbYXhpcy50aWNrVmFsdWVzKCkubGVuZ3RoIC0gMV07XG5cbiAgdGV4dE5vZGVzXG4gICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIHZhbCA9IHNldFRpY2tGb3JtYXRZKGF4aXNPYmouZm9ybWF0LCBkLCBsYXN0VGljayk7XG4gICAgICBpZiAoaSA9PT0gYXhpcy50aWNrVmFsdWVzKCkubGVuZ3RoIC0gMSkge1xuICAgICAgICB2YWwgPSAoYXhpc09iai5wcmVmaXggfHwgXCJcIikgKyB2YWwgKyAoYXhpc09iai5zdWZmaXggfHwgXCJcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRleHRZKHRleHROb2RlcywgYXhpc05vZGUsIG9iaiwgYXhpcywgYXhpc09iaikge1xuXG4gIHZhciBhcnIgPSBbXSxcbiAgICAgIGxhc3RUaWNrID0gYXhpcy50aWNrVmFsdWVzKClbYXhpcy50aWNrVmFsdWVzKCkubGVuZ3RoIC0gMV07XG5cbiAgdGV4dE5vZGVzXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKVxuICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHZhciB2YWwgPSBzZXRUaWNrRm9ybWF0WShheGlzT2JqLmZvcm1hdCwgZCwgbGFzdFRpY2spO1xuICAgICAgaWYgKGkgPT09IGF4aXMudGlja1ZhbHVlcygpLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgdmFsID0gKGF4aXNPYmoucHJlZml4IHx8IFwiXCIpICsgdmFsICsgKGF4aXNPYmouc3VmZml4IHx8IFwiXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9KVxuICAgIC50ZXh0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbCA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgIHZhciB0ZXh0Q2hhciA9IHNlbC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICBhcnIucHVzaCh0ZXh0Q2hhcik7XG4gICAgICByZXR1cm4gc2VsLnRleHQoKTtcbiAgICB9KVxuICAgIC5hdHRyKHtcbiAgICAgIFwiZHlcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChheGlzT2JqLmR5ICE9PSBcIlwiKSB7XG4gICAgICAgICAgcmV0dXJuIGF4aXNPYmouZHkgKyBcImVtXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwiZHlcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcInhcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChheGlzT2JqLnRleHRYICE9PSBcIlwiKSB7XG4gICAgICAgICAgcmV0dXJuIGF4aXNPYmoudGV4dFg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwieFwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwieVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGF4aXNPYmoudGV4dFkgIT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gYXhpc09iai50ZXh0WTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ5XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCA9IGQzLm1heChhcnIpO1xuXG59XG5cbmZ1bmN0aW9uIHJlcG9zaXRpb25UZXh0WSh0ZXh0LCBkaW1lbnNpb25zLCB0ZXh0WCkge1xuICB0ZXh0LmF0dHIoe1xuICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKGRpbWVuc2lvbnMubGFiZWxXaWR0aCAtIHRleHRYKSArIFwiLDApXCIsXG4gICAgXCJ4XCI6IDBcbiAgfSk7XG59XG5cbi8vIENsb25lcyBjdXJyZW50IHRleHQgc2VsZWN0aW9uIGFuZCBhcHBlbmRzXG4vLyBhIG5ldyB0ZXh0IG5vZGUgYmVsb3cgdGhlIHNlbGVjdGlvblxuZnVuY3Rpb24gbmV3VGV4dE5vZGUoc2VsZWN0aW9uLCB0ZXh0LCBlbXMpIHtcblxuICB2YXIgbm9kZU5hbWUgPSBzZWxlY3Rpb24ucHJvcGVydHkoXCJub2RlTmFtZVwiKSxcbiAgICAgIHBhcmVudCA9IGQzLnNlbGVjdChzZWxlY3Rpb24ubm9kZSgpLnBhcmVudE5vZGUpLFxuICAgICAgbGluZUhlaWdodCA9IGVtcyB8fCAxLjYsIC8vIGVtc1xuICAgICAgZHkgPSBwYXJzZUZsb2F0KHNlbGVjdGlvbi5hdHRyKFwiZHlcIikpLFxuICAgICAgeCA9IHBhcnNlRmxvYXQoc2VsZWN0aW9uLmF0dHIoXCJ4XCIpKSxcblxuICAgICAgY2xvbmVkID0gcGFyZW50LmFwcGVuZChub2RlTmFtZSlcbiAgICAgICAgLmF0dHIoXCJkeVwiLCBsaW5lSGVpZ2h0ICsgZHkgKyBcImVtXCIpXG4gICAgICAgIC5hdHRyKFwieFwiLCB4KVxuICAgICAgICAudGV4dChmdW5jdGlvbigpIHsgcmV0dXJuIHRleHQ7IH0pO1xuXG4gIHJldHVybiBjbG9uZWQ7XG5cbn1cblxuLy8gdGljayBkcm9wcGluZyBmdW5jdGlvbnNcblxuZnVuY3Rpb24gZHJvcFRpY2tzKHNlbGVjdGlvbiwgb3B0cykge1xuXG4gIHZhciBvcHRzID0gb3B0cyB8fCB7fTtcblxuICB2YXIgdG9sZXJhbmNlID0gb3B0cy50b2xlcmFuY2UgfHwgMCxcbiAgICAgIGZyb20gPSBvcHRzLmZyb20gfHwgMCxcbiAgICAgIHRvID0gb3B0cy50byB8fCBzZWxlY3Rpb25bMF0ubGVuZ3RoO1xuXG4gIGZvciAodmFyIGogPSBmcm9tOyBqIDwgdG87IGorKykge1xuXG4gICAgdmFyIGMgPSBzZWxlY3Rpb25bMF1bal0sIC8vIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgICAgIG4gPSBzZWxlY3Rpb25bMF1baiArIDFdOyAvLyBuZXh0IHNlbGVjdGlvblxuXG4gICAgaWYgKCFjIHx8ICFuIHx8ICFjLmdldEJvdW5kaW5nQ2xpZW50UmVjdCB8fCAhbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHsgY29udGludWU7IH1cblxuICAgIHdoaWxlICgoYy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodCArIHRvbGVyYW5jZSkgPiBuLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpIHtcblxuICAgICAgaWYgKGQzLnNlbGVjdChuKS5kYXRhKClbMF0gPT09IHNlbGVjdGlvbi5kYXRhKClbdG9dKSB7XG4gICAgICAgIGQzLnNlbGVjdChjKS5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGQzLnNlbGVjdChuKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaisrO1xuXG4gICAgICBuID0gc2VsZWN0aW9uWzBdW2ogKyAxXTtcblxuICAgICAgaWYgKCFuKSB7IGJyZWFrOyB9XG5cbiAgICB9XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGRyb3BSZWR1bmRhbnRUaWNrcyhzZWxlY3Rpb24sIGN0eCkge1xuXG4gIHZhciB0aWNrcyA9IHNlbGVjdGlvbi5zZWxlY3RBbGwoXCIudGlja1wiKTtcblxuICB2YXIgcHJldlllYXIsIHByZXZNb250aCwgcHJldkRhdGUsIHByZXZIb3VyLCBwcmV2TWludXRlLCBkWWVhciwgZE1vbnRoLCBkRGF0ZSwgZEhvdXIsIGRNaW51dGU7XG5cbiAgdGlja3MuZWFjaChmdW5jdGlvbihkKSB7XG4gICAgc3dpdGNoIChjdHgpIHtcbiAgICAgIGNhc2UgXCJ5ZWFyc1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgaWYgKGRZZWFyID09PSBwcmV2WWVhcikge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJtb250aHNcIjpcbiAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGRNb250aCA9IGQuZ2V0TW9udGgoKTtcbiAgICAgICAgaWYgKChkTW9udGggPT09IHByZXZNb250aCkgJiYgKGRZZWFyID09PSBwcmV2WWVhcikpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJldk1vbnRoID0gZE1vbnRoO1xuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ3ZWVrc1wiOlxuICAgICAgY2FzZSBcImRheXNcIjpcbiAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGRNb250aCA9IGQuZ2V0TW9udGgoKTtcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcblxuICAgICAgICBpZiAoKGREYXRlID09PSBwcmV2RGF0ZSkgJiYgKGRNb250aCA9PT0gcHJldk1vbnRoKSAmJiAoZFllYXIgPT09IHByZXZZZWFyKSkge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZEYXRlID0gZERhdGU7XG4gICAgICAgIHByZXZNb250aCA9IGRNb250aDtcbiAgICAgICAgcHJldlllYXIgPSBkWWVhcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaG91cnNcIjpcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgZEhvdXIgPSBkLmdldEhvdXJzKCk7XG4gICAgICAgIGRNaW51dGUgPSBkLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICBpZiAoKGREYXRlID09PSBwcmV2RGF0ZSkgJiYgKGRIb3VyID09PSBwcmV2SG91cikgJiYgKGRNaW51dGUgPT09IHByZXZNaW51dGUpKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcbiAgICAgICAgcHJldkhvdXIgPSBkSG91cjtcbiAgICAgICAgcHJldk1pbnV0ZSA9IGRNaW51dGU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG5cbn1cblxuZnVuY3Rpb24gZHJvcE92ZXJzZXRUaWNrcyhheGlzTm9kZSwgdGlja1dpZHRoKSB7XG5cbiAgdmFyIGF4aXNHcm91cFdpZHRoID0gYXhpc05vZGUubm9kZSgpLmdldEJCb3goKS53aWR0aCxcbiAgICAgIHRpY2tBcnIgPSBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKVswXTtcblxuICBpZiAodGlja0Fyci5sZW5ndGgpIHtcblxuICAgIHZhciBmaXJzdFRpY2tPZmZzZXQgPSBkMy50cmFuc2Zvcm0oZDMuc2VsZWN0KHRpY2tBcnJbMF0pXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdO1xuXG4gICAgaWYgKChheGlzR3JvdXBXaWR0aCArIGZpcnN0VGlja09mZnNldCkgPj0gdGlja1dpZHRoKSB7XG4gICAgICB2YXIgbGFzdFRpY2sgPSB0aWNrQXJyW3RpY2tBcnIubGVuZ3RoIC0gMV07XG4gICAgICBkMy5zZWxlY3QobGFzdFRpY2spLmF0dHIoXCJjbGFzc1wiLCBcImxhc3QtdGljay1oaWRlXCIpO1xuICAgICAgYXhpc0dyb3VwV2lkdGggPSBheGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoO1xuICAgICAgdGlja0FyciA9IGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpWzBdO1xuICAgIH1cblxuICB9XG5cbn1cblxuZnVuY3Rpb24gdGlja0ZpbmRlclgoZG9tYWluLCBwZXJpb2QsIHRpY2tHb2FsKSB7XG5cbiAgLy8gc2V0IHJhbmdlc1xuICB2YXIgc3RhcnREYXRlID0gZG9tYWluWzBdLFxuICAgICAgZW5kRGF0ZSA9IGRvbWFpblsxXTtcblxuICAvLyBzZXQgdXBwZXIgYW5kIGxvd2VyIGJvdW5kcyBmb3IgbnVtYmVyIG9mIHN0ZXBzIHBlciB0aWNrXG4gIC8vIGkuZS4gaWYgeW91IGhhdmUgZm91ciBtb250aHMgYW5kIHNldCBzdGVwcyB0byAxLCB5b3UnbGwgZ2V0IDQgdGlja3NcbiAgLy8gYW5kIGlmIHlvdSBoYXZlIHNpeCBtb250aHMgYW5kIHNldCBzdGVwcyB0byAyLCB5b3UnbGwgZ2V0IDMgdGlja3NcbiAgdmFyIHN0ZXBMb3dlckJvdW5kID0gMSxcbiAgICAgIHN0ZXBVcHBlckJvdW5kID0gMTIsXG4gICAgICB0aWNrQ2FuZGlkYXRlcyA9IFtdLFxuICAgICAgY2xvc2VzdEFycjtcblxuICAvLyB1c2luZyB0aGUgdGljayBib3VuZHMsIGdlbmVyYXRlIG11bHRpcGxlIGFycmF5cy1pbi1vYmplY3RzIHVzaW5nXG4gIC8vIGRpZmZlcmVudCB0aWNrIHN0ZXBzLiBwdXNoIGFsbCB0aG9zZSBnZW5lcmF0ZWQgb2JqZWN0cyB0byB0aWNrQ2FuZGlkYXRlc1xuICBmb3IgKHZhciBpID0gc3RlcExvd2VyQm91bmQ7IGkgPD0gc3RlcFVwcGVyQm91bmQ7IGkrKykge1xuICAgIHZhciBvYmogPSB7fTtcbiAgICBvYmouaW50ZXJ2YWwgPSBpO1xuICAgIG9iai5hcnIgPSBkMy50aW1lW3BlcmlvZF0oc3RhcnREYXRlLCBlbmREYXRlLCBpKS5sZW5ndGg7XG4gICAgdGlja0NhbmRpZGF0ZXMucHVzaChvYmopO1xuICB9XG5cbiAgLy8gcmVkdWNlIHRvIGZpbmQgYSBiZXN0IGNhbmRpZGF0ZSBiYXNlZCBvbiB0aGUgZGVmaW5lZCB0aWNrR29hbFxuICBpZiAodGlja0NhbmRpZGF0ZXMubGVuZ3RoID4gMSkge1xuICAgIGNsb3Nlc3RBcnIgPSB0aWNrQ2FuZGlkYXRlcy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnIpIHtcbiAgICAgIHJldHVybiAoTWF0aC5hYnMoY3Vyci5hcnIgLSB0aWNrR29hbCkgPCBNYXRoLmFicyhwcmV2LmFyciAtIHRpY2tHb2FsKSA/IGN1cnIgOiBwcmV2KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0aWNrQ2FuZGlkYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICBjbG9zZXN0QXJyID0gdGlja0NhbmRpZGF0ZXNbMF07XG4gIH0gZWxzZSB7XG4gICAgLy8gc2lnaC4gd2UgdHJpZWQuXG4gICAgY2xvc2VzdEFyci5pbnRlcnZhbCA9IDE7XG4gIH1cblxuICB2YXIgdGlja0FyciA9IGQzLnRpbWVbcGVyaW9kXShzdGFydERhdGUsIGVuZERhdGUsIGNsb3Nlc3RBcnIuaW50ZXJ2YWwpO1xuXG4gIHZhciBzdGFydERpZmYgPSB0aWNrQXJyWzBdIC0gc3RhcnREYXRlO1xuICB2YXIgdGlja0RpZmYgPSB0aWNrQXJyWzFdIC0gdGlja0FyclswXTtcblxuICAvLyBpZiBkaXN0YW5jZSBmcm9tIHN0YXJ0RGF0ZSB0byB0aWNrQXJyWzBdIGlzIGdyZWF0ZXIgdGhhbiBoYWxmIHRoZVxuICAvLyBkaXN0YW5jZSBiZXR3ZWVuIHRpY2tBcnJbMV0gYW5kIHRpY2tBcnJbMF0sIGFkZCBzdGFydERhdGUgdG8gdGlja0FyclxuXG4gIGlmICggc3RhcnREaWZmID4gKHRpY2tEaWZmIC8gMikgKSB7IHRpY2tBcnIudW5zaGlmdChzdGFydERhdGUpOyB9XG5cbiAgcmV0dXJuIHRpY2tBcnI7XG5cbn1cblxuZnVuY3Rpb24gdGlja0ZpbmRlclkoc2NhbGUsIHRpY2tDb3VudCwgdGlja1NldHRpbmdzKSB7XG5cbiAgLy8gSW4gYSBudXRzaGVsbDpcbiAgLy8gQ2hlY2tzIGlmIGFuIGV4cGxpY2l0IG51bWJlciBvZiB0aWNrcyBoYXMgYmVlbiBkZWNsYXJlZFxuICAvLyBJZiBub3QsIHNldHMgbG93ZXIgYW5kIHVwcGVyIGJvdW5kcyBmb3IgdGhlIG51bWJlciBvZiB0aWNrc1xuICAvLyBJdGVyYXRlcyBvdmVyIHRob3NlIGFuZCBtYWtlcyBzdXJlIHRoYXQgdGhlcmUgYXJlIHRpY2sgYXJyYXlzIHdoZXJlXG4gIC8vIHRoZSBsYXN0IHZhbHVlIGluIHRoZSBhcnJheSBtYXRjaGVzIHRoZSBkb21haW4gbWF4IHZhbHVlXG4gIC8vIGlmIHNvLCB0cmllcyB0byBmaW5kIHRoZSB0aWNrIG51bWJlciBjbG9zZXN0IHRvIHRpY2tHb2FsIG91dCBvZiB0aGUgd2lubmVycyxcbiAgLy8gYW5kIHJldHVybnMgdGhhdCBhcnIgdG8gdGhlIHNjYWxlIGZvciB1c2VcblxuICB2YXIgbWluID0gc2NhbGUuZG9tYWluKClbMF0sXG4gICAgICBtYXggPSBzY2FsZS5kb21haW4oKVsxXTtcblxuICBpZiAodGlja0NvdW50ICE9PSBcImF1dG9cIikge1xuXG4gICAgcmV0dXJuIHNjYWxlLnRpY2tzKHRpY2tDb3VudCk7XG5cbiAgfSBlbHNlIHtcblxuICAgIHZhciB0aWNrTG93ZXJCb3VuZCA9IHRpY2tTZXR0aW5ncy50aWNrTG93ZXJCb3VuZCxcbiAgICAgICAgdGlja1VwcGVyQm91bmQgPSB0aWNrU2V0dGluZ3MudGlja1VwcGVyQm91bmQsXG4gICAgICAgIHRpY2tHb2FsID0gdGlja1NldHRpbmdzLnRpY2tHb2FsLFxuICAgICAgICBhcnIgPSBbXSxcbiAgICAgICAgdGlja0NhbmRpZGF0ZXMgPSBbXSxcbiAgICAgICAgY2xvc2VzdEFycjtcblxuICAgIGZvciAodmFyIGkgPSB0aWNrTG93ZXJCb3VuZDsgaSA8PSB0aWNrVXBwZXJCb3VuZDsgaSsrKSB7XG4gICAgICB2YXIgdGlja0NhbmRpZGF0ZSA9IHNjYWxlLnRpY2tzKGkpO1xuXG4gICAgICBpZiAobWluIDwgMCkge1xuICAgICAgICBpZiAoKHRpY2tDYW5kaWRhdGVbMF0gPT09IG1pbikgJiYgKHRpY2tDYW5kaWRhdGVbdGlja0NhbmRpZGF0ZS5sZW5ndGggLSAxXSA9PT0gbWF4KSkge1xuICAgICAgICAgIGFyci5wdXNoKHRpY2tDYW5kaWRhdGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGlja0NhbmRpZGF0ZVt0aWNrQ2FuZGlkYXRlLmxlbmd0aCAtIDFdID09PSBtYXgpIHtcbiAgICAgICAgICBhcnIucHVzaCh0aWNrQ2FuZGlkYXRlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdGlja0NhbmRpZGF0ZXMucHVzaCh2YWx1ZS5sZW5ndGgpO1xuICAgIH0pO1xuXG4gICAgdmFyIGNsb3Nlc3RBcnI7XG5cbiAgICBpZiAodGlja0NhbmRpZGF0ZXMubGVuZ3RoID4gMSkge1xuICAgICAgY2xvc2VzdEFyciA9IHRpY2tDYW5kaWRhdGVzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3Vycikge1xuICAgICAgICByZXR1cm4gKE1hdGguYWJzKGN1cnIgLSB0aWNrR29hbCkgPCBNYXRoLmFicyhwcmV2IC0gdGlja0dvYWwpID8gY3VyciA6IHByZXYpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aWNrQ2FuZGlkYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNsb3Nlc3RBcnIgPSB0aWNrQ2FuZGlkYXRlc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xvc2VzdEFyciA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjYWxlLnRpY2tzKGNsb3Nlc3RBcnIpO1xuXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBvcmRpbmFsVGltZVRpY2tzKHNlbGVjdGlvbiwgYXhpc05vZGUsIGN0eCwgc2NhbGUsIHRvbGVyYW5jZSkge1xuXG4gIGRyb3BSZWR1bmRhbnRUaWNrcyhheGlzTm9kZSwgY3R4KTtcblxuICAvLyBkcm9wUmVkdW5kYW50VGlja3MgaGFzIG1vZGlmaWVkIHRoZSBzZWxlY3Rpb24sIHNvIHdlIG5lZWQgdG8gcmVzZWxlY3RcbiAgLy8gdG8gZ2V0IGEgcHJvcGVyIGlkZWEgb2Ygd2hhdCdzIHN0aWxsIGF2YWlsYWJsZVxuICB2YXIgbmV3U2VsZWN0aW9uID0gYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2tcIik7XG5cbiAgdmFyIHRpY2tzID0gc2NhbGUuZG9tYWluKCk7XG5cbiAgLy8gYXJyYXkgZm9yIGFueSBcIm1ham9yIHRpY2tzXCIsIGkuZS4gdGlja3Mgd2l0aCBhIGNoYW5nZSBpbiBjb250ZXh0XG4gIC8vIG9uZSBsZXZlbCB1cC4gaS5lLiwgYSBcIm1vbnRoc1wiIGNvbnRleHQgc2V0IG9mIHRpY2tzIHdpdGggYSBjaGFuZ2UgaW4gdGhlIHllYXIsXG4gIC8vIG9yIFwiZGF5c1wiIGNvbnRleHQgdGlja3Mgd2l0aCBhIGNoYW5nZSBpbiBtb250aCBvciB5ZWFyXG4gIHZhciBtYWpvclRpY2tzID0gW107XG5cbiAgdmFyIHByZXZZZWFyLCBwcmV2TW9udGgsIHByZXZEYXRlLCBkWWVhciwgZE1vbnRoLCBkRGF0ZTtcblxuICBuZXdTZWxlY3Rpb24uZWFjaChmdW5jdGlvbihkKSB7XG4gICAgdmFyIGN1cnJTZWwgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgc3dpdGNoIChjdHgpIHtcbiAgICAgIGNhc2UgXCJ5ZWFyc1wiOlxuICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgaWYgKGRZZWFyICE9PSBwcmV2WWVhcikgeyBtYWpvclRpY2tzLnB1c2goY3VyclNlbCk7IH1cbiAgICAgICAgcHJldlllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIndlZWtzXCI6XG4gICAgICBjYXNlIFwiZGF5c1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZE1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICBpZiAoKGRNb250aCAhPT0gcHJldk1vbnRoKSAmJiAoZFllYXIgIT09IHByZXZZZWFyKSkge1xuICAgICAgICAgIG1ham9yVGlja3MucHVzaChjdXJyU2VsKTtcbiAgICAgICAgfSBlbHNlIGlmIChkTW9udGggIT09IHByZXZNb250aCkge1xuICAgICAgICAgIG1ham9yVGlja3MucHVzaChjdXJyU2VsKTtcbiAgICAgICAgfSBlbHNlIGlmIChkWWVhciAhPT0gcHJldlllYXIpIHtcbiAgICAgICAgICBtYWpvclRpY2tzLnB1c2goY3VyclNlbCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJldk1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICBwcmV2WWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaG91cnNcIjpcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgaWYgKGREYXRlICE9PSBwcmV2RGF0ZSkgeyBtYWpvclRpY2tzLnB1c2goY3VyclNlbCk7IH1cbiAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcblxuICB2YXIgdDAsIHRuO1xuXG4gIGlmIChtYWpvclRpY2tzLmxlbmd0aCA+IDEpIHtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFqb3JUaWNrcy5sZW5ndGggKyAxOyBpKyspIHtcblxuICAgICAgaWYgKGkgPT09IDApIHsgLy8gZnJvbSB0MCB0byBtMFxuICAgICAgICB0MCA9IDA7XG4gICAgICAgIHRuID0gdGlja3MuaW5kZXhPZihtYWpvclRpY2tzWzBdKTtcbiAgICAgIH0gZWxzZSBpZiAoaSA9PT0gKG1ham9yVGlja3MubGVuZ3RoKSkgeyAvLyBmcm9tIG1uIHRvIHRuXG4gICAgICAgIHQwID0gdGlja3MuaW5kZXhPZihtYWpvclRpY2tzW2kgLSAxXSk7XG4gICAgICAgIHRuID0gdGlja3MubGVuZ3RoIC0gMTtcbiAgICAgIH0gZWxzZSB7IC8vIGZyb20gbTAgdG8gbW5cbiAgICAgICAgdDAgPSB0aWNrcy5pbmRleE9mKG1ham9yVGlja3NbaSAtIDFdKTtcbiAgICAgICAgdG4gPSB0aWNrcy5pbmRleE9mKG1ham9yVGlja3NbaV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoISEodG4gLSB0MCkpIHtcbiAgICAgICAgZHJvcFRpY2tzKG5ld1NlbGVjdGlvbiwge1xuICAgICAgICAgIGZyb206IHQwLFxuICAgICAgICAgIHRvOiB0bixcbiAgICAgICAgICB0b2xlcmFuY2U6IHRvbGVyYW5jZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH1cblxuICB9XG5cbn1cblxuZnVuY3Rpb24gYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopIHtcblxuICAvLyB0aGlzIHNlY3Rpb24gaXMga2luZGEgZ3Jvc3MsIHNvcnJ5OlxuICAvLyByZXNldHMgcmFuZ2VzIGFuZCBkaW1lbnNpb25zLCByZWRyYXdzIHlBeGlzLCByZWRyYXdzIHhBeGlzXG4gIC8vIOKApnRoZW4gcmVkcmF3cyB5QXhpcyBhZ2FpbiBpZiB0aWNrIHdyYXBwaW5nIGhhcyBjaGFuZ2VkIHhBeGlzIGhlaWdodFxuXG4gIGRyYXdZQXhpcyhvYmosIHlBeGlzT2JqLmF4aXMsIHlBeGlzT2JqLm5vZGUpO1xuXG4gIHZhciBzZXRSYW5nZVR5cGUgPSByZXF1aXJlKFwiLi9zY2FsZVwiKS5zZXRSYW5nZVR5cGUsXG4gICAgICBzZXRSYW5nZUFyZ3MgPSByZXF1aXJlKFwiLi9zY2FsZVwiKS5zZXRSYW5nZUFyZ3M7XG5cbiAgdmFyIHNjYWxlT2JqID0ge1xuICAgIHJhbmdlVHlwZTogc2V0UmFuZ2VUeXBlKG9iai54QXhpcyksXG4gICAgcmFuZ2U6IHhBeGlzT2JqLnJhbmdlIHx8IFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sXG4gICAgYmFuZHM6IG9iai5kaW1lbnNpb25zLmJhbmRzLFxuICAgIHJhbmdlUG9pbnRzOiBvYmoueEF4aXMucmFuZ2VQb2ludHNcbiAgfTtcblxuICBzZXRSYW5nZUFyZ3MoeEF4aXNPYmouYXhpcy5zY2FsZSgpLCBzY2FsZU9iaik7XG5cbiAgdmFyIHByZXZYQXhpc0hlaWdodCA9IG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0O1xuXG4gIHhBeGlzT2JqID0gYXhpc01hbmFnZXIobm9kZSwgb2JqLCB4QXhpc09iai5heGlzLnNjYWxlKCksIFwieEF4aXNcIik7XG5cbiAgeEF4aXNPYmoubm9kZVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkgKyBcIilcIik7XG5cbiAgaWYgKG9iai54QXhpcy5zY2FsZSAhPT0gXCJvcmRpbmFsXCIpIHtcbiAgICBkcm9wT3ZlcnNldFRpY2tzKHhBeGlzT2JqLm5vZGUsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKTtcbiAgfVxuXG4gIGlmIChwcmV2WEF4aXNIZWlnaHQgIT09IG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KSB7XG4gICAgZHJhd1lBeGlzKG9iaiwgeUF4aXNPYmouYXhpcywgeUF4aXNPYmoubm9kZSk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBhZGRaZXJvTGluZShvYmosIG5vZGUsIEF4aXMsIGF4aXNUeXBlKSB7XG5cbiAgdmFyIHRpY2tzID0gQXhpcy5heGlzLnRpY2tWYWx1ZXMoKSxcbiAgICAgIHRpY2tNaW4gPSB0aWNrc1swXSxcbiAgICAgIHRpY2tNYXggPSB0aWNrc1t0aWNrcy5sZW5ndGggLSAxXTtcblxuICBpZiAoKHRpY2tNaW4gPD0gMCkgJiYgKDAgPD0gdGlja01heCkpIHtcblxuICAgIHZhciByZWZHcm91cCA9IEF4aXMubm9kZS5zZWxlY3RBbGwoXCIudGljazpub3QoLlwiICsgb2JqLnByZWZpeCArIFwibWlub3IpXCIpLFxuICAgICAgICByZWZMaW5lID0gcmVmR3JvdXAuc2VsZWN0KFwibGluZVwiKTtcblxuICAgIC8vIHplcm8gbGluZVxuICAgIHZhciB6ZXJvTGluZSA9IG5vZGUuYXBwZW5kKFwibGluZVwiKVxuICAgICAgLnN0eWxlKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwiY3Jpc3BFZGdlc1wiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ6ZXJvLWxpbmVcIik7XG5cbiAgICB2YXIgdHJhbnNmb3JtID0gWzAsIDBdO1xuXG4gICAgdHJhbnNmb3JtWzBdICs9IGQzLnRyYW5zZm9ybShub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBheGlzVHlwZSkuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdO1xuICAgIHRyYW5zZm9ybVsxXSArPSBkMy50cmFuc2Zvcm0obm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgYXhpc1R5cGUpLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVsxXTtcbiAgICB0cmFuc2Zvcm1bMF0gKz0gZDMudHJhbnNmb3JtKHJlZkdyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVswXTtcbiAgICB0cmFuc2Zvcm1bMV0gKz0gZDMudHJhbnNmb3JtKHJlZkdyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVsxXTtcblxuICAgIGlmIChheGlzVHlwZSA9PT0gXCJ4QXhpc1wiKSB7XG5cbiAgICAgIHplcm9MaW5lLmF0dHIoe1xuICAgICAgICBcInkxXCI6IHJlZkxpbmUuYXR0cihcInkxXCIpLFxuICAgICAgICBcInkyXCI6IHJlZkxpbmUuYXR0cihcInkyXCIpLFxuICAgICAgICBcIngxXCI6IDAsXG4gICAgICAgIFwieDJcIjogMCxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyB0cmFuc2Zvcm1bMF0gKyBcIixcIiArIHRyYW5zZm9ybVsxXSArIFwiKVwiXG4gICAgICB9KTtcblxuICAgIH0gZWxzZSBpZiAoYXhpc1R5cGUgPT09IFwieUF4aXNcIikge1xuXG4gICAgICB6ZXJvTGluZS5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiByZWZMaW5lLmF0dHIoXCJ4MVwiKSxcbiAgICAgICAgXCJ4MlwiOiByZWZMaW5lLmF0dHIoXCJ4MlwiKSxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IDAsXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgdHJhbnNmb3JtWzBdICsgXCIsXCIgKyB0cmFuc2Zvcm1bMV0gKyBcIilcIlxuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICByZWZMaW5lLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBBeGlzRmFjdG9yeTogQXhpc0ZhY3RvcnksXG4gIGF4aXNNYW5hZ2VyOiBheGlzTWFuYWdlcixcbiAgZGV0ZXJtaW5lRm9ybWF0OiBkZXRlcm1pbmVGb3JtYXQsXG4gIGFwcGVuZFhBeGlzOiBhcHBlbmRYQXhpcyxcbiAgYXBwZW5kWUF4aXM6IGFwcGVuZFlBeGlzLFxuICBkcmF3WUF4aXM6IGRyYXdZQXhpcyxcbiAgdGltZUF4aXM6IHRpbWVBeGlzLFxuICBkaXNjcmV0ZUF4aXM6IGRpc2NyZXRlQXhpcyxcbiAgb3JkaW5hbFRpbWVBeGlzOiBvcmRpbmFsVGltZUF4aXMsXG4gIHNldFRpY2tGb3JtYXRYOiBzZXRUaWNrRm9ybWF0WCxcbiAgc2V0VGlja0Zvcm1hdFk6IHNldFRpY2tGb3JtYXRZLFxuICB1cGRhdGVUZXh0WDogdXBkYXRlVGV4dFgsXG4gIHVwZGF0ZVRleHRZOiB1cGRhdGVUZXh0WSxcbiAgcmVwb3NpdGlvblRleHRZOiByZXBvc2l0aW9uVGV4dFksXG4gIG5ld1RleHROb2RlOiBuZXdUZXh0Tm9kZSxcbiAgZHJvcFRpY2tzOiBkcm9wVGlja3MsXG4gIGRyb3BPdmVyc2V0VGlja3M6IGRyb3BPdmVyc2V0VGlja3MsXG4gIGRyb3BSZWR1bmRhbnRUaWNrczogZHJvcFJlZHVuZGFudFRpY2tzLFxuICB0aWNrRmluZGVyWDogdGlja0ZpbmRlclgsXG4gIHRpY2tGaW5kZXJZOiB0aWNrRmluZGVyWSxcbiAgYXhpc0NsZWFudXA6IGF4aXNDbGVhbnVwLFxuICBhZGRaZXJvTGluZTogYWRkWmVyb0xpbmVcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2F4aXMuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gc2NhbGVNYW5hZ2VyKG9iaiwgYXhpc1R5cGUpIHtcblxuICB2YXIgYXhpcyA9IG9ialtheGlzVHlwZV0sXG4gICAgICBzY2FsZU9iaiA9IG5ldyBTY2FsZU9iaihvYmosIGF4aXMsIGF4aXNUeXBlKTtcblxuICB2YXIgc2NhbGUgPSBzZXRTY2FsZVR5cGUoc2NhbGVPYmoudHlwZSk7XG5cbiAgc2NhbGUuZG9tYWluKHNjYWxlT2JqLmRvbWFpbik7XG5cbiAgc2V0UmFuZ2VBcmdzKHNjYWxlLCBzY2FsZU9iaik7XG5cbiAgaWYgKGF4aXMubmljZSkgeyBuaWNlaWZ5KHNjYWxlLCBheGlzVHlwZSwgc2NhbGVPYmopOyB9XG4gIGlmIChheGlzLnJlc2NhbGUpIHsgcmVzY2FsZShzY2FsZSwgYXhpc1R5cGUsIGF4aXMpOyB9XG5cbiAgcmV0dXJuIHtcbiAgICBvYmo6IHNjYWxlT2JqLFxuICAgIHNjYWxlOiBzY2FsZVxuICB9O1xuXG59XG5cbmZ1bmN0aW9uIFNjYWxlT2JqKG9iaiwgYXhpcywgYXhpc1R5cGUpIHtcbiAgdGhpcy50eXBlID0gYXhpcy5zY2FsZTtcbiAgdGhpcy5kb21haW4gPSBzZXREb21haW4ob2JqLCBheGlzKTtcbiAgdGhpcy5yYW5nZVR5cGUgPSBzZXRSYW5nZVR5cGUoYXhpcyk7XG4gIHRoaXMucmFuZ2UgPSBzZXRSYW5nZShvYmosIGF4aXNUeXBlKTtcbiAgdGhpcy5iYW5kcyA9IG9iai5kaW1lbnNpb25zLmJhbmRzO1xuICB0aGlzLnJhbmdlUG9pbnRzID0gYXhpcy5yYW5nZVBvaW50cyB8fCAxLjA7XG59XG5cbmZ1bmN0aW9uIHNldFNjYWxlVHlwZSh0eXBlKSB7XG5cbiAgdmFyIHNjYWxlVHlwZTtcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMudGltZS5zY2FsZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5vcmRpbmFsKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJpZGVudGl0eVwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUuaWRlbnRpdHkoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJwb3dcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnBvdygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNxcnRcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnNxcnQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsb2dcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLmxvZygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInF1YW50aXplXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5xdWFudGl6ZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInF1YW50aWxlXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5xdWFudGlsZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRocmVzaG9sZFwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUudGhyZXNob2xkKCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBzY2FsZVR5cGU7XG5cbn1cblxuZnVuY3Rpb24gc2V0UmFuZ2VUeXBlKGF4aXMpIHtcblxuICB2YXIgdHlwZTtcblxuICBzd2l0Y2goYXhpcy5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgY2FzZSBcImxpbmVhclwiOlxuICAgICAgdHlwZSA9IFwicmFuZ2VcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgY2FzZSBcImRpc2NyZXRlXCI6XG4gICAgICB0eXBlID0gXCJyYW5nZVJvdW5kQmFuZHNcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcbiAgICAgIHR5cGUgPSBcInJhbmdlUG9pbnRzXCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdHlwZSA9IFwicmFuZ2VcIjtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHR5cGU7XG5cbn1cblxuZnVuY3Rpb24gc2V0UmFuZ2Uob2JqLCBheGlzVHlwZSkge1xuXG4gIHZhciByYW5nZTtcblxuICBpZiAoYXhpc1R5cGUgPT09IFwieEF4aXNcIikge1xuICAgIHJhbmdlID0gWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXTsgLy8gb3BlcmF0aW5nIG9uIHdpZHRoXG4gIH0gZWxzZSBpZiAoYXhpc1R5cGUgPT09IFwieUF4aXNcIikge1xuICAgIHJhbmdlID0gW29iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KCksIDBdOyAvLyBvcGVyYXRpbmcgb24gaGVpZ2h0XG4gIH1cblxuICByZXR1cm4gcmFuZ2U7XG5cbn1cblxuZnVuY3Rpb24gc2V0UmFuZ2VBcmdzKHNjYWxlLCBzY2FsZU9iaikge1xuXG4gIHN3aXRjaCAoc2NhbGVPYmoucmFuZ2VUeXBlKSB7XG4gICAgY2FzZSBcInJhbmdlXCI6XG4gICAgICByZXR1cm4gc2NhbGVbc2NhbGVPYmoucmFuZ2VUeXBlXShzY2FsZU9iai5yYW5nZSk7XG4gICAgY2FzZSBcInJhbmdlUm91bmRCYW5kc1wiOlxuICAgICAgcmV0dXJuIHNjYWxlW3NjYWxlT2JqLnJhbmdlVHlwZV0oc2NhbGVPYmoucmFuZ2UsIHNjYWxlT2JqLmJhbmRzLnBhZGRpbmcsIHNjYWxlT2JqLmJhbmRzLm91dGVyUGFkZGluZyk7XG4gICAgY2FzZSBcInJhbmdlUG9pbnRzXCI6XG4gICAgICByZXR1cm4gc2NhbGVbc2NhbGVPYmoucmFuZ2VUeXBlXShzY2FsZU9iai5yYW5nZSwgc2NhbGVPYmoucmFuZ2VQb2ludHMpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gc2V0RG9tYWluKG9iaiwgYXhpcykge1xuXG4gIHZhciBkYXRhID0gb2JqLmRhdGE7XG4gIHZhciBkb21haW47XG5cbiAgLy8gaW5jbHVkZWQgZmFsbGJhY2tzIGp1c3QgaW4gY2FzZVxuICBzd2l0Y2goYXhpcy5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgICBkb21haW4gPSBzZXREYXRlRG9tYWluKGRhdGEsIGF4aXMubWluLCBheGlzLm1heCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICB2YXIgY2hhcnRUeXBlID0gb2JqLm9wdGlvbnMudHlwZSxcbiAgICAgICAgICBmb3JjZU1heFZhbDtcbiAgICAgIGlmIChjaGFydFR5cGUgPT09IFwiYXJlYVwiIHx8IGNoYXJ0VHlwZSA9PT0gXCJjb2x1bW5cIiB8fCBjaGFydFR5cGUgPT09IFwiYmFyXCIpIHtcbiAgICAgICAgZm9yY2VNYXhWYWwgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZG9tYWluID0gc2V0TnVtZXJpY2FsRG9tYWluKGRhdGEsIGF4aXMubWluLCBheGlzLm1heCwgb2JqLm9wdGlvbnMuc3RhY2tlZCwgZm9yY2VNYXhWYWwpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG4gICAgICBkb21haW4gPSBzZXREaXNjcmV0ZURvbWFpbihkYXRhKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIGRvbWFpbjtcblxufVxuXG5mdW5jdGlvbiBzZXREYXRlRG9tYWluKGRhdGEsIG1pbiwgbWF4KSB7XG4gIGlmIChtaW4gJiYgbWF4KSB7XG4gICAgdmFyIHN0YXJ0RGF0ZSA9IG1pbiwgZW5kRGF0ZSA9IG1heDtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZGF0ZVJhbmdlID0gZDMuZXh0ZW50KGRhdGEuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0pO1xuICAgIHZhciBzdGFydERhdGUgPSBtaW4gfHwgbmV3IERhdGUoZGF0ZVJhbmdlWzBdKSxcbiAgICAgICAgZW5kRGF0ZSA9IG1heCB8fCBuZXcgRGF0ZShkYXRlUmFuZ2VbMV0pO1xuICB9XG4gIHJldHVybiBbc3RhcnREYXRlLCBlbmREYXRlXTtcbn1cblxuZnVuY3Rpb24gc2V0TnVtZXJpY2FsRG9tYWluKGRhdGEsIG1pbiwgbWF4LCBzdGFja2VkLCBmb3JjZU1heFZhbCkge1xuXG4gIHZhciBtaW5WYWwsIG1heFZhbDtcbiAgdmFyIG1BcnIgPSBbXTtcblxuICBkMy5tYXAoZGF0YS5kYXRhLCBmdW5jdGlvbihkKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBkLnNlcmllcy5sZW5ndGg7IGorKykge1xuICAgICAgbUFyci5wdXNoKE51bWJlcihkLnNlcmllc1tqXS52YWwpKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChzdGFja2VkKSB7XG4gICAgbWF4VmFsID0gZDMubWF4KGRhdGEuc3RhY2tlZERhdGFbZGF0YS5zdGFja2VkRGF0YS5sZW5ndGggLSAxXSwgZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIChkLnkwICsgZC55KTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBtYXhWYWwgPSBkMy5tYXgobUFycik7XG4gIH1cblxuICBtaW5WYWwgPSBkMy5taW4obUFycik7XG5cbiAgaWYgKG1pbikge1xuICAgIG1pblZhbCA9IG1pbjtcbiAgfSBlbHNlIGlmIChtaW5WYWwgPiAwKSB7XG4gICAgbWluVmFsID0gMDtcbiAgfVxuXG4gIGlmIChtYXgpIHtcbiAgICBtYXhWYWwgPSBtYXg7XG4gIH0gZWxzZSBpZiAobWF4VmFsIDwgMCAmJiBmb3JjZU1heFZhbCkge1xuICAgIG1heFZhbCA9IDA7XG4gIH1cblxuICByZXR1cm4gW21pblZhbCwgbWF4VmFsXTtcblxufVxuXG5mdW5jdGlvbiBzZXREaXNjcmV0ZURvbWFpbihkYXRhKSB7XG4gIHJldHVybiBkYXRhLmRhdGEubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQua2V5OyB9KTtcbn1cblxuZnVuY3Rpb24gcmVzY2FsZShzY2FsZSwgYXhpc1R5cGUsIGF4aXNPYmopIHtcblxuICBzd2l0Y2goYXhpc09iai5zY2FsZSkge1xuICAgIGNhc2UgXCJsaW5lYXJcIjpcbiAgICAgIGlmICghYXhpc09iai5tYXgpIHsgcmVzY2FsZU51bWVyaWNhbChzY2FsZSwgYXhpc09iaik7IH1cbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc2NhbGVOdW1lcmljYWwoc2NhbGUsIGF4aXNPYmopIHtcblxuICAvLyByZXNjYWxlcyB0aGUgXCJ0b3BcIiBlbmQgb2YgdGhlIGRvbWFpblxuICB2YXIgdGlja3MgPSBzY2FsZS50aWNrcygxMCkuc2xpY2UoKSxcbiAgICAgIHRpY2tJbmNyID0gTWF0aC5hYnModGlja3NbdGlja3MubGVuZ3RoIC0gMV0pIC0gTWF0aC5hYnModGlja3NbdGlja3MubGVuZ3RoIC0gMl0pO1xuXG4gIHZhciBuZXdNYXggPSB0aWNrc1t0aWNrcy5sZW5ndGggLSAxXSArIHRpY2tJbmNyO1xuXG4gIHNjYWxlLmRvbWFpbihbc2NhbGUuZG9tYWluKClbMF0sIG5ld01heF0pO1xuXG59XG5cbmZ1bmN0aW9uIG5pY2VpZnkoc2NhbGUsIGF4aXNUeXBlLCBzY2FsZU9iaikge1xuXG4gIHN3aXRjaChzY2FsZU9iai50eXBlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcbiAgICAgIHZhciB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZjtcbiAgICAgIHZhciBjb250ZXh0ID0gdGltZURpZmYoc2NhbGUuZG9tYWluKClbMF0sIHNjYWxlLmRvbWFpbigpWzFdLCAzKTtcbiAgICAgIG5pY2VpZnlUaW1lKHNjYWxlLCBjb250ZXh0KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsaW5lYXJcIjpcbiAgICAgIG5pY2VpZnlOdW1lcmljYWwoc2NhbGUpO1xuICAgICAgYnJlYWs7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBuaWNlaWZ5VGltZShzY2FsZSwgY29udGV4dCkge1xuICB2YXIgZ2V0VGltZUludGVydmFsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVJbnRlcnZhbDtcbiAgdmFyIHRpbWVJbnRlcnZhbCA9IGdldFRpbWVJbnRlcnZhbChjb250ZXh0KTtcbiAgc2NhbGUuZG9tYWluKHNjYWxlLmRvbWFpbigpKS5uaWNlKHRpbWVJbnRlcnZhbCk7XG59XG5cbmZ1bmN0aW9uIG5pY2VpZnlOdW1lcmljYWwoc2NhbGUpIHtcbiAgc2NhbGUuZG9tYWluKHNjYWxlLmRvbWFpbigpKS5uaWNlKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzY2FsZU1hbmFnZXI6IHNjYWxlTWFuYWdlcixcbiAgU2NhbGVPYmo6IFNjYWxlT2JqLFxuICBzZXRTY2FsZVR5cGU6IHNldFNjYWxlVHlwZSxcbiAgc2V0UmFuZ2VUeXBlOiBzZXRSYW5nZVR5cGUsXG4gIHNldFJhbmdlQXJnczogc2V0UmFuZ2VBcmdzLFxuICBzZXRSYW5nZTogc2V0UmFuZ2UsXG4gIHNldERvbWFpbjogc2V0RG9tYWluLFxuICBzZXREYXRlRG9tYWluOiBzZXREYXRlRG9tYWluLFxuICBzZXROdW1lcmljYWxEb21haW46IHNldE51bWVyaWNhbERvbWFpbixcbiAgc2V0RGlzY3JldGVEb21haW46IHNldERpc2NyZXRlRG9tYWluLFxuICByZXNjYWxlOiByZXNjYWxlLFxuICByZXNjYWxlTnVtZXJpY2FsOiByZXNjYWxlTnVtZXJpY2FsLFxuICBuaWNlaWZ5OiBuaWNlaWZ5LFxuICBuaWNlaWZ5VGltZTogbmljZWlmeVRpbWUsXG4gIG5pY2VpZnlOdW1lcmljYWw6IG5pY2VpZnlOdW1lcmljYWxcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NjYWxlLmpzXG4gKiogbW9kdWxlIGlkID0gMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIE11bHRpTGluZUNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLCB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgaWYgKHhTY2FsZU9iai5vYmoudHlwZSA9PT0gXCJvcmRpbmFsXCIpIHtcbiAgICB4U2NhbGUucmFuZ2VSb3VuZFBvaW50cyhbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldLCAxLjApO1xuICB9XG5cbiAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA9PT0gMSkgeyBvYmouc2VyaWVzSGlnaGxpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9IH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSk7XG5cbiAgLy8gU2Vjb25kYXJ5IGFycmF5IGlzIHVzZWQgdG8gc3RvcmUgYSByZWZlcmVuY2UgdG8gYWxsIHNlcmllcyBleGNlcHQgZm9yIHRoZSBoaWdobGlnaHRlZCBpdGVtXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBbXTtcblxuICBmb3IgKHZhciBpID0gb2JqLmRhdGEuc2VyaWVzQW1vdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAvLyBEb250IHdhbnQgdG8gaW5jbHVkZSB0aGUgaGlnaGxpZ2h0ZWQgaXRlbSBpbiB0aGUgbG9vcFxuICAgIC8vIGJlY2F1c2Ugd2UgYWx3YXlzIHdhbnQgaXQgdG8gc2l0IGFib3ZlIGFsbCB0aGUgb3RoZXIgbGluZXNcblxuICAgIGlmIChpICE9PSBvYmouc2VyaWVzSGlnaGxpZ2h0KCkpIHtcblxuICAgICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tpXS52YWwpOyB9KVxuICAgICAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgICAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbaV0udmFsKTsgfSk7XG5cbiAgICAgIHZhciBwYXRoUmVmID0gc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiZFwiOiBsaW5lLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJtdWx0aWxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aWxpbmUtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlY29uZGFyeUFyci5wdXNoKHBhdGhSZWYpO1xuICAgIH1cblxuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgc2Vjb25kYXJ5IHNlcmllcyAoYWxsIHNlcmllcyBleGNlcHQgdGhlIGhpZ2hsaWdodGVkIG9uZSlcbiAgLy8gYW5kIHNldCB0aGUgY29sb3VycyBpbiB0aGUgY29ycmVjdCBvcmRlclxuXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBzZWNvbmRhcnlBcnIucmV2ZXJzZSgpO1xuXG4gIHZhciBoTGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSk7XG5cbiAgc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgIC5hdHRyKHtcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibXVsdGlsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlsaW5lLVwiICsgKG9iai5zZXJpZXNIaWdobGlnaHQoKSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfSxcbiAgICAgIFwiZFwiOiBoTGluZVxuICAgIH0pO1xuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB5QXhpc09iaiwgXCJ5QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIGhMaW5lOiBoTGluZSxcbiAgICBsaW5lOiBsaW5lXG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTXVsdGlMaW5lQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9tdWx0aWxpbmUuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gQXJlYUNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLCB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgaWYgKHhTY2FsZU9iai5vYmoudHlwZSA9PT0gXCJvcmRpbmFsXCIpIHtcbiAgICB4U2NhbGUucmFuZ2VSb3VuZFBvaW50cyhbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldLCAxLjApO1xuICB9XG5cbiAgLy8gd2hhP1xuICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID09PSAxKSB7IG9iai5zZXJpZXNIaWdobGlnaHQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH0gfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsaXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KTtcblxuICAvLyBTZWNvbmRhcnkgYXJyYXkgaXMgdXNlZCB0byBzdG9yZSBhIHJlZmVyZW5jZSB0byBhbGwgc2VyaWVzIGV4Y2VwdCBmb3IgdGhlIGhpZ2hsaWdodGVkIGl0ZW1cbiAgdmFyIHNlY29uZGFyeUFyciA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSBvYmouZGF0YS5zZXJpZXNBbW91bnQgLSAxOyBpID49IDA7IGktLSkge1xuICAgIC8vIERvbnQgd2FudCB0byBpbmNsdWRlIHRoZSBoaWdobGlnaHRlZCBpdGVtIGluIHRoZSBsb29wXG4gICAgLy8gYmVjYXVzZSB3ZSBhbHdheXMgd2FudCBpdCB0byBzaXQgYWJvdmUgYWxsIHRoZSBvdGhlciBsaW5lc1xuXG4gICAgaWYgKGkgIT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuXG4gICAgICB2YXIgYXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAgICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW2ldLnZhbCk7IH0pXG4gICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgICAgIC55MCh5U2NhbGUoMCkpXG4gICAgICAgIC55MShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbaV0udmFsKTsgfSk7XG5cbiAgICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgICAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbaV0udmFsKTsgfSlcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW2ldLnZhbCk7IH0pO1xuXG4gICAgICB2YXIgcGF0aFJlZiA9IHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogYXJlYSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwiZmlsbCBcIiArIG9iai5wcmVmaXggKyBcImZpbGwtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogbGluZSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlY29uZGFyeUFyci5wdXNoKHBhdGhSZWYpO1xuICAgIH1cblxuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgc2Vjb25kYXJ5IHNlcmllcyAoYWxsIHNlcmllcyBleGNlcHQgdGhlIGhpZ2hsaWdodGVkIG9uZSlcbiAgLy8gYW5kIHNldCB0aGUgY29sb3VycyBpbiB0aGUgY29ycmVjdCBvcmRlclxuXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBzZWNvbmRhcnlBcnIucmV2ZXJzZSgpO1xuXG4gIHZhciBoQXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgLnkwKHlTY2FsZSgwKSlcbiAgICAueTEoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSk7XG5cbiAgdmFyIGhMaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KTtcblxuICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgLmF0dHIoe1xuICAgICAgXCJkXCI6IGhBcmVhLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJmaWxsIFwiICsgb2JqLnByZWZpeCArIFwiZmlsbC1cIiArIChvYmouc2VyaWVzSGlnaGxpZ2h0KCkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cbiAgICB9KTtcblxuICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgLmF0dHIoe1xuICAgICAgXCJkXCI6IGhMaW5lLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibGluZS1cIiArIChvYmouc2VyaWVzSGlnaGxpZ2h0KCkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cbiAgICB9KTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBoTGluZTogaExpbmUsXG4gICAgaEFyZWE6IGhBcmVhLFxuICAgIGxpbmU6IGxpbmUsXG4gICAgYXJlYTogYXJlYVxuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFyZWFDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL2FyZWEuanNcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gU3RhY2tlZEFyZWFDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmICh4U2NhbGVPYmoub2JqLnR5cGUgPT09IFwib3JkaW5hbFwiKSB7XG4gICAgeFNjYWxlLnJhbmdlUm91bmRQb2ludHMoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgMS4wKTtcbiAgfVxuXG4gIC8vIHdoYT9cbiAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA9PT0gMSkgeyBvYmouc2VyaWVzSGlnaGxpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9IH1cblxuICBub2RlLmNsYXNzZWQob2JqLnByZWZpeCArIFwic3RhY2tlZFwiLCB0cnVlKTtcblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSk7XG5cbiAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLnNlbGVjdEFsbChcImcuXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNcIilcbiAgICAuZGF0YShvYmouZGF0YS5zdGFja2VkRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJzdmc6Z1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIChpKTtcbiAgICAgICAgaWYgKGkgPT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuICAgICAgICAgIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIChpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cbiAgICB9KTtcblxuICB2YXIgYXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC55MCArIGQueSk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0pXG4gICAgLnkwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwKTsgfSlcbiAgICAueTEoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTAgKyBkLnkpOyB9KTtcblxuICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC55MCArIGQueSk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTAgKyBkLnkpOyB9KTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImZpbGwgXCIgKyBvYmoucHJlZml4ICsgXCJmaWxsLVwiICsgKGkpO1xuICAgICAgaWYgKGkgPT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuICAgICAgICBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJmaWxsIFwiICsgb2JqLnByZWZpeCArIFwiZmlsbC1cIiArIChpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJkXCIsIGFyZWEpO1xuXG4gIHNlcmllcy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibGluZS1cIiArIChpKTsgfSlcbiAgICAuYXR0cihcImRcIiwgbGluZSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgbGluZTogbGluZSxcbiAgICBhcmVhOiBhcmVhXG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2tlZEFyZWFDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYS5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBDb2x1bW5DaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIHN3aXRjaCAob2JqLnhBeGlzLnNjYWxlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcblxuICAgICAgdmFyIHRpbWVJbnRlcnZhbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lSW50ZXJ2YWwsXG4gICAgICAgICAgdGltZUVsYXBzZWQgPSB0aW1lSW50ZXJ2YWwob2JqLmRhdGEuZGF0YSkgKyAxO1xuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gdGltZUVsYXBzZWQgLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG5cbiAgICAgIHhBeGlzT2JqLnJhbmdlID0gWzAsIChvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIChzaW5nbGVDb2x1bW4gKiBvYmouZGF0YS5zZXJpZXNBbW91bnQpKV07XG5cbiAgICAgIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG5cbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSB4U2NhbGUob2JqLmRhdGEuZGF0YVsxXS5rZXkpIC0geFNjYWxlKG9iai5kYXRhLmRhdGFbMF0ua2V5KTtcblxuICAgICAgbm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwLlwiICsgb2JqLnByZWZpeCArIFwieEF4aXNcIilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoc2luZ2xlQ29sdW1uIC8gMikpICsgXCIsXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSAtIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KSArIFwiKVwiKTtcblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSB4U2NhbGUucmFuZ2VCYW5kKCkgLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsdGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSlcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB4T2Zmc2V0O1xuICAgICAgaWYgKG9iai54QXhpcy5zY2FsZSA9PT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgICAgICB4T2Zmc2V0ID0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoc2luZ2xlQ29sdW1uIC8gMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4T2Zmc2V0ID0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4T2Zmc2V0ICsgXCIsMClcIjtcbiAgICB9KTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG9iai5kYXRhLnNlcmllc0Ftb3VudDsgaSsrKSB7XG5cbiAgICB2YXIgc2VyaWVzID0gc2VyaWVzR3JvdXAuYXBwZW5kKFwiZ1wiKS5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwic2VyaWVzX1wiICsgaSk7XG5cbiAgICB2YXIgY29sdW1uSXRlbSA9IHNlcmllc1xuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcImNvbHVtblwiKVxuICAgICAgLmRhdGEob2JqLmRhdGEuZGF0YSkuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJjb2x1bW4gXCIgKyBvYmoucHJlZml4ICsgXCJjb2x1bW4tXCIgKyAoaSksXG4gICAgICAgIFwiZGF0YS1zZXJpZXNcIjogaSxcbiAgICAgICAgXCJkYXRhLWtleVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiBkLmtleTsgfSxcbiAgICAgICAgXCJkYXRhLWxlZ2VuZFwiOiBmdW5jdGlvbigpIHsgcmV0dXJuIG9iai5kYXRhLmtleXNbaSArIDFdOyB9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKG9iai54QXhpcy5zY2FsZSAhPT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeFNjYWxlKGQua2V5KSArIFwiLDApXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGNvbHVtbkl0ZW0uYXBwZW5kKFwicmVjdFwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gZC5zZXJpZXNbaV0udmFsIDwgMCA/IFwibmVnYXRpdmVcIiA6IFwicG9zaXRpdmVcIjtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gaSAqIHNpbmdsZUNvbHVtbjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShkLmtleSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwieVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKGQuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB5U2NhbGUoTWF0aC5tYXgoMCwgZC5zZXJpZXNbaV0udmFsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhlaWdodFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKGQuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyh5U2NhbGUoZC5zZXJpZXNbaV0udmFsKSAtIHlTY2FsZSgwKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndpZHRoXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBzaW5nbGVDb2x1bW47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzaW5nbGVDb2x1bW4gLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG5cbiAgICAgIHZhciBjb2x1bW5PZmZzZXQgPSBvYmouZGltZW5zaW9ucy5iYW5kcy5vZmZzZXQ7XG5cbiAgICAgIGNvbHVtbkl0ZW0uc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICgoaSAqIHNpbmdsZUNvbHVtbikgKyAoc2luZ2xlQ29sdW1uICogKGNvbHVtbk9mZnNldCAvIDIpKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geFNjYWxlKGQua2V5KSArIChpICogKHNpbmdsZUNvbHVtbiAvIG9iai5kYXRhLnNlcmllc0Ftb3VudCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ3aWR0aFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChzaW5nbGVDb2x1bW4gLSAoc2luZ2xlQ29sdW1uICogY29sdW1uT2Zmc2V0KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlQ29sdW1uIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gIH1cblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICBzaW5nbGVDb2x1bW46IHNpbmdsZUNvbHVtbixcbiAgICBjb2x1bW5JdGVtOiBjb2x1bW5JdGVtXG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2x1bW5DaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL2NvbHVtbi5qc1xuICoqIG1vZHVsZSBpZCA9IDIxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBCYXJDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyBiZWNhdXNlIHRoZSBlbGVtZW50cyB3aWxsIGJlIGFwcGVuZGVkIGluIHJldmVyc2UgZHVlIHRvIHRoZVxuICAvLyBiYXIgY2hhcnQgb3BlcmF0aW5nIG9uIHRoZSB5LWF4aXMsIG5lZWQgdG8gcmV2ZXJzZSB0aGUgZGF0YXNldC5cbiAgb2JqLmRhdGEuZGF0YS5yZXZlcnNlKCk7XG5cbiAgdmFyIHhBeGlzT2Zmc2V0ID0gOTtcblxuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZTtcblxuICB2YXIgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgLnNjYWxlKHhTY2FsZSlcbiAgICAub3JpZW50KFwiYm90dG9tXCIpO1xuXG4gIHZhciB4QXhpc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwXCIgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcInhBeGlzXCIpXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIik7XG5cbiAgdmFyIHhBeGlzTm9kZSA9IHhBeGlzR3JvdXAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwieC1heGlzXCIpXG4gICAgLmNhbGwoeEF4aXMpO1xuXG4gIHZhciB0ZXh0TGVuZ3RocyA9IFtdO1xuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoXCJ5XCIsIHhBeGlzT2Zmc2V0KVxuICAgIC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdGV4dExlbmd0aHMucHVzaChkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCk7XG4gICAgfSk7XG5cbiAgdmFyIHRhbGxlc3RUZXh0ID0gdGV4dExlbmd0aHMucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIChhID4gYiA/IGEgOiBiKSB9KTtcblxuICBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCA9IHRhbGxlc3RUZXh0ICsgeEF4aXNPZmZzZXQ7XG5cbiAgeEF4aXNOb2RlLnNlbGVjdEFsbChcImdcIilcbiAgICAuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pXG4gICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwibWlub3JcIiwgdHJ1ZSk7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBuZWVkIHRoaXMgZm9yIGZpeGVkLWhlaWdodCBiYXJzXG4gIGlmICghb2JqLmV4cG9ydGFibGUgfHwgKG9iai5leHBvcnRhYmxlICYmICFvYmouZXhwb3J0YWJsZS5keW5hbWljSGVpZ2h0KSkge1xuICAgIHZhciB0b3RhbEJhckhlaWdodCA9IChvYmouZGltZW5zaW9ucy5iYXJIZWlnaHQgKiBvYmouZGF0YS5kYXRhLmxlbmd0aCAqIG9iai5kYXRhLnNlcmllc0Ftb3VudCk7XG4gICAgeVNjYWxlLnJhbmdlUm91bmRCYW5kcyhbdG90YWxCYXJIZWlnaHQsIDBdLCBvYmouZGltZW5zaW9ucy5iYW5kcy5wYWRkaW5nLCBvYmouZGltZW5zaW9ucy5iYW5kcy5vdXRlclBhZGRpbmcpO1xuICAgIG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0ID0gdG90YWxCYXJIZWlnaHQgLSAodG90YWxCYXJIZWlnaHQgKiBvYmouZGltZW5zaW9ucy5iYW5kcy5vdXRlclBhZGRpbmcgKiAyKTtcbiAgfVxuXG4gIHZhciB5QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAuc2NhbGUoeVNjYWxlKVxuICAgIC5vcmllbnQoXCJsZWZ0XCIpO1xuXG4gIHZhciB5QXhpc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwXCIgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcInlBeGlzXCIpXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKTtcblxuICB2YXIgeUF4aXNOb2RlID0geUF4aXNHcm91cC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ5LWF4aXNcIilcbiAgICAuY2FsbCh5QXhpcyk7XG5cbiAgeUF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIikucmVtb3ZlKCk7XG4gIHlBeGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpLmF0dHIoXCJ4XCIsIDApO1xuXG4gIGlmIChvYmouZGltZW5zaW9ucy53aWR0aCA+IG9iai55QXhpcy53aWR0aFRocmVzaG9sZCkge1xuICAgIHZhciBtYXhMYWJlbFdpZHRoID0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC8gMy41O1xuICB9IGVsc2Uge1xuICAgIHZhciBtYXhMYWJlbFdpZHRoID0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC8gMztcbiAgfVxuXG4gIGlmICh5QXhpc05vZGUubm9kZSgpLmdldEJCb3goKS53aWR0aCA+IG1heExhYmVsV2lkdGgpIHtcbiAgICB2YXIgd3JhcFRleHQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikud3JhcFRleHQ7XG4gICAgeUF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgIC5jYWxsKHdyYXBUZXh0LCBtYXhMYWJlbFdpZHRoKVxuICAgICAgLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0c3BhbnMgPSBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKFwidHNwYW5cIiksXG4gICAgICAgICAgICB0c3BhbkNvdW50ID0gdHNwYW5zWzBdLmxlbmd0aCxcbiAgICAgICAgICAgIHRleHRIZWlnaHQgPSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJCb3goKS5oZWlnaHQ7XG4gICAgICAgIGlmICh0c3BhbkNvdW50ID4gMSkge1xuICAgICAgICAgIHRzcGFuc1xuICAgICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgICBcInlcIjogKCh0ZXh0SGVpZ2h0IC8gdHNwYW5Db3VudCkgLyAyKSAtICh0ZXh0SGVpZ2h0IC8gMilcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggPSB5QXhpc05vZGUubm9kZSgpLmdldEJCb3goKS53aWR0aDtcblxuICB5QXhpc0dyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgXCIsMClcIik7XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLnhfYXhpcykge1xuICAgIHhBeGlzU2V0dGluZ3MgPSBvYmouZXhwb3J0YWJsZS54X2F4aXM7XG4gIH0gZWxzZSB7XG4gICAgeEF4aXNTZXR0aW5ncyA9IG9iai54QXhpcztcbiAgfVxuXG4gIHZhciB0aWNrRmluZGVyWCA9IGF4aXNNb2R1bGUudGlja0ZpbmRlclk7XG5cbiAgaWYgKG9iai54QXhpcy53aWR0aFRocmVzaG9sZCA+IG9iai5kaW1lbnNpb25zLndpZHRoKSB7XG4gICAgdmFyIHhBeGlzVGlja1NldHRpbmdzID0geyB0aWNrTG93ZXJCb3VuZDogMywgdGlja1VwcGVyQm91bmQ6IDgsIHRpY2tHb2FsOiA2IH07XG4gIH0gZWxzZSB7XG4gICAgdmFyIHhBeGlzVGlja1NldHRpbmdzID0geyB0aWNrTG93ZXJCb3VuZDogMywgdGlja1VwcGVyQm91bmQ6IDgsIHRpY2tHb2FsOiA0IH07XG4gIH1cblxuICB2YXIgdGlja3MgPSB0aWNrRmluZGVyWCh4U2NhbGUsIG9iai54QXhpcy50aWNrcywgeEF4aXNUaWNrU2V0dGluZ3MpO1xuXG4gIHhTY2FsZS5yYW5nZShbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldKTtcblxuICB4QXhpcy50aWNrVmFsdWVzKHRpY2tzKTtcblxuICB4QXhpc05vZGUuY2FsbCh4QXhpcyk7XG5cbiAgeEF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrIHRleHRcIilcbiAgICAuYXR0cihcInlcIiwgeEF4aXNPZmZzZXQpXG4gICAgLmNhbGwoYXhpc01vZHVsZS51cGRhdGVUZXh0WCwgeEF4aXNOb2RlLCBvYmosIHhBeGlzLCBvYmoueEF4aXMpO1xuXG4gIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS5keW5hbWljSGVpZ2h0KSB7XG4gICAgLy8gd29ya2luZyB3aXRoIGEgZHluYW1pYyBiYXIgaGVpZ2h0XG4gICAgeEF4aXNHcm91cFxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpICsgXCIpXCIpO1xuICB9IGVsc2Uge1xuICAgIC8vIHdvcmtpbmcgd2l0aCBhIGZpeGVkIGJhciBoZWlnaHRcbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArIHRvdGFsQmFySGVpZ2h0ICsgXCIpXCIpO1xuICB9XG5cbiAgdmFyIHhBeGlzV2lkdGggPSBkMy50cmFuc2Zvcm0oeEF4aXNHcm91cC5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMF0gKyB4QXhpc0dyb3VwLm5vZGUoKS5nZXRCQm94KCkud2lkdGg7XG5cbiAgaWYgKHhBeGlzV2lkdGggPiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkpIHtcblxuICAgIHhTY2FsZS5yYW5nZShbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoeEF4aXNXaWR0aCAtIG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSldKTtcblxuICAgIHhBeGlzTm9kZS5jYWxsKHhBeGlzKTtcblxuICAgIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCIudGljayB0ZXh0XCIpXG4gICAgICAuYXR0cihcInlcIiwgeEF4aXNPZmZzZXQpXG4gICAgICAuY2FsbChheGlzTW9kdWxlLnVwZGF0ZVRleHRYLCB4QXhpc05vZGUsIG9iaiwgeEF4aXMsIG9iai54QXhpcyk7XG5cbiAgfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIpO1xuXG4gIHZhciBzaW5nbGVCYXIgPSB5U2NhbGUucmFuZ2VCYW5kKCkgLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmouZGF0YS5zZXJpZXNBbW91bnQ7IGkrKykge1xuXG4gICAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIGkpO1xuXG4gICAgdmFyIGJhckl0ZW0gPSBzZXJpZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJiYXJcIilcbiAgICAgIC5kYXRhKG9iai5kYXRhLmRhdGEpLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiYmFyIFwiICsgb2JqLnByZWZpeCArIFwiYmFyLVwiICsgKGkpLFxuICAgICAgICBcImRhdGEtc2VyaWVzXCI6IGksXG4gICAgICAgIFwiZGF0YS1rZXlcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0sXG4gICAgICAgIFwiZGF0YS1sZWdlbmRcIjogZnVuY3Rpb24oKSB7IHJldHVybiBvYmouZGF0YS5rZXlzW2kgKyAxXTsgfSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZSgwLFwiICsgeVNjYWxlKGQua2V5KSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGJhckl0ZW0uYXBwZW5kKFwicmVjdFwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gZC5zZXJpZXNbaV0udmFsIDwgMCA/IFwibmVnYXRpdmVcIiA6IFwicG9zaXRpdmVcIjtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4geFNjYWxlKE1hdGgubWluKDAsIGQuc2VyaWVzW2ldLnZhbCkpO1xuICAgICAgICB9LFxuICAgICAgICBcInlcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGkgKiBzaW5nbGVCYXI7XG4gICAgICAgIH0sXG4gICAgICAgIFwid2lkdGhcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBNYXRoLmFicyh4U2NhbGUoZC5zZXJpZXNbaV0udmFsKSAtIHhTY2FsZSgwKSk7XG4gICAgICAgIH0sXG4gICAgICAgIFwiaGVpZ2h0XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHNpbmdsZUJhcjsgfVxuICAgICAgfSk7XG5cbiAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgdmFyIGJhck9mZnNldCA9IG9iai5kaW1lbnNpb25zLmJhbmRzLm9mZnNldDtcbiAgICAgIGJhckl0ZW0uc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICgoaSAqIHNpbmdsZUJhcikgKyAoc2luZ2xlQmFyICogKGJhck9mZnNldCAvIDIpKSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImhlaWdodFwiOiBzaW5nbGVCYXIgLSAoc2luZ2xlQmFyICogYmFyT2Zmc2V0KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCJnXCIpXG4gICAgLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm1pbm9yXCIsIHRydWUpO1xuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCJsaW5lXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ5MVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLmR5bmFtaWNIZWlnaHQpIHtcbiAgICAgICAgICAvLyBkeW5hbWljIGhlaWdodCwgc28gY2FsY3VsYXRlIHdoZXJlIHRoZSB5MSBzaG91bGQgZ29cbiAgICAgICAgICByZXR1cm4gLShvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpIC0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGZpeGVkIGhlaWdodCwgc28gdXNlIHRoYXRcbiAgICAgICAgICByZXR1cm4gLSh0b3RhbEJhckhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcInkyXCI6IDBcbiAgfSk7XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLmR5bmFtaWNIZWlnaHQpIHtcblxuICAgIC8vIGR5bmFtaWMgaGVpZ2h0LCBvbmx5IG5lZWQgdG8gdHJhbnNmb3JtIHgtYXhpcyBncm91cFxuICAgIHhBeGlzR3JvdXBcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkgKyBcIilcIik7XG5cbiAgfSBlbHNlIHtcblxuICAgIC8vIGZpeGVkIGhlaWdodCwgc28gdHJhbnNmb3JtIGFjY29yZGluZ2x5IGFuZCBtb2RpZnkgdGhlIGRpbWVuc2lvbiBmdW5jdGlvbiBhbmQgcGFyZW50IHJlY3RzXG5cbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArIHRvdGFsQmFySGVpZ2h0ICsgXCIpXCIpO1xuXG4gICAgb2JqLmRpbWVuc2lvbnMudG90YWxYQXhpc0hlaWdodCA9IHhBeGlzR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnRvdGFsWEF4aXNIZWlnaHQ7IH07XG5cbiAgICBkMy5zZWxlY3Qobm9kZS5ub2RlKCkucGFyZW50Tm9kZSlcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFyZ2luID0gb2JqLmRpbWVuc2lvbnMubWFyZ2luO1xuICAgICAgICByZXR1cm4gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tO1xuICAgICAgfSk7XG5cbiAgICBkMy5zZWxlY3Qobm9kZS5ub2RlKCkucGFyZW50Tm9kZSkuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwiYmdcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJoZWlnaHRcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKVxuICAgICAgfSk7XG5cbiAgfVxuXG4gIHZhciB4QXhpc09iaiA9IHsgbm9kZTogeEF4aXNHcm91cCwgYXhpczogeEF4aXMgfSxcbiAgICAgIHlBeGlzT2JqID0geyBub2RlOiB5QXhpc0dyb3VwLCBheGlzOiB5QXhpcyB9O1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeEF4aXNPYmosIFwieEF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICBzaW5nbGVCYXI6IHNpbmdsZUJhcixcbiAgICBiYXJJdGVtOiBiYXJJdGVtXG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXJDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL2Jhci5qc1xuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBTdGFja2VkQ29sdW1uQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGUsXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgc3dpdGNoIChvYmoueEF4aXMuc2NhbGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuXG4gICAgICB2YXIgdGltZUludGVydmFsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVJbnRlcnZhbCxcbiAgICAgICAgICB0aW1lRWxhcHNlZCA9IHRpbWVJbnRlcnZhbChvYmouZGF0YS5kYXRhKTtcbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIHRpbWVFbGFwc2VkO1xuXG4gICAgICB4QXhpc09iai5yYW5nZSA9IFswLCAob2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSBzaW5nbGVDb2x1bW4pXTtcblxuICAgICAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcblxuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IHhTY2FsZShvYmouZGF0YS5kYXRhWzFdLmtleSkgLSB4U2NhbGUob2JqLmRhdGEuZGF0YVswXS5rZXkpO1xuXG4gICAgICBub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXAuXCIgKyBvYmoucHJlZml4ICsgXCJ4QXhpc1wiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIChzaW5nbGVDb2x1bW4gLyAyKSkgKyBcIixcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpIC0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpICsgXCIpXCIpO1xuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IHhTY2FsZS5yYW5nZUJhbmQoKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeE9mZnNldDtcbiAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgPT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAvIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeE9mZnNldCArIFwiLDApXCI7XG4gICAgfSlcblxuICAvLyBBZGQgYSBncm91cCBmb3IgZWFjaFxuICB2YXIgc2VyaWVzID0gc2VyaWVzR3JvdXAuc2VsZWN0QWxsKFwiZy5cIiArIG9iai5wcmVmaXggKyBcInNlcmllc1wiKVxuICAgIC5kYXRhKG9iai5kYXRhLnN0YWNrZWREYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIG9iai5wcmVmaXggKyBcInNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIChpKTsgfSk7XG5cbiAgLy8gQWRkIGEgcmVjdCBmb3IgZWFjaCBkYXRhIHBvaW50LlxuICB2YXIgcmVjdCA9IHNlcmllcy5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgLmRhdGEoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJjb2x1bW5cIixcbiAgICAgIFwiZGF0YS1rZXlcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZC54OyB9LFxuICAgICAgXCJkYXRhLWxlZ2VuZFwiOiBmdW5jdGlvbihkKSB7IHJldHVybiBkLmxlZ2VuZDsgfSxcbiAgICAgIFwieFwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC54KTsgfSxcbiAgICAgIFwieVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoTWF0aC5tYXgoMCwgZC55MCArIGQueSkpOyB9LFxuICAgICAgXCJoZWlnaHRcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gTWF0aC5hYnMoeVNjYWxlKGQueSkgLSB5U2NhbGUoMCkpOyB9LFxuICAgICAgXCJ3aWR0aFwiOiBzaW5nbGVDb2x1bW5cbiAgICB9KTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICByZWN0OiByZWN0XG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGFja2VkQ29sdW1uQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9zdGFja2VkLWNvbHVtbi5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBTdHJlYW1ncmFwaENoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLCB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgaWYgKHhTY2FsZU9iai5vYmoudHlwZSA9PT0gXCJvcmRpbmFsXCIpIHtcbiAgICB4U2NhbGUucmFuZ2VSb3VuZFBvaW50cyhbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldLCAxLjApO1xuICB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIlxuICAgIH19KTtcblxuICAvLyBBZGQgYSBncm91cCBmb3IgZWFjaCBjYXVzZS5cbiAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLnNlbGVjdEFsbChcImcuXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNcIilcbiAgICAuZGF0YShvYmouZGF0YS5zdGFja2VkRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJzZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyAoaSk7IH0pO1xuXG4gIHZhciBhcmVhID0gZDMuc3ZnLmFyZWEoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9KVxuICAgIC55MChmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55MCk7IH0pXG4gICAgLnkxKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwICsgZC55KTsgfSk7XG5cbiAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTAgKyBkLnkpOyB9KTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInN0cmVhbS1zZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzdHJlYW0tXCIgKyAoaSk7XG4gICAgICBpZiAoaSA9PT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG4gICAgICAgIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInN0cmVhbS1zZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzdHJlYW0tXCIgKyAoaSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwiZFwiLCBhcmVhKTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJzdHJlYW0tc2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwibGluZVwiOyB9KVxuICAgIC5hdHRyKFwiZFwiLCBsaW5lKTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICBsaW5lOiBsaW5lLFxuICAgIGFyZWE6IGFyZWFcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW1ncmFwaENoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGguanNcbiAqKiBtb2R1bGUgaWQgPSAyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gcXVhbGlmaWVyQ29tcG9uZW50KG5vZGUsIG9iaikge1xuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlICE9PSBcImJhclwiKSB7XG5cbiAgICB2YXIgeUF4aXNOb2RlID0gbm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ5QXhpc1wiKTtcblxuICAgIGlmIChvYmouZWRpdGFibGUpIHtcblxuICAgICAgdmFyIGZvcmVpZ25PYmplY3QgPSB5QXhpc05vZGUuYXBwZW5kKFwiZm9yZWlnbk9iamVjdFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJmbyBcIiArIG9iai5wcmVmaXggKyBcInF1YWxpZmllclwiLFxuICAgICAgICAgIFwid2lkdGhcIjogXCIxMDAlXCJcbiAgICAgICAgfSk7XG5cbiAgICAgIHZhciBmb3JlaWduT2JqZWN0R3JvdXAgPSBmb3JlaWduT2JqZWN0LmFwcGVuZChcInhodG1sOmRpdlwiKVxuICAgICAgICAuYXR0cihcInhtbG5zXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiKTtcblxuICAgICAgdmFyIHF1YWxpZmllckZpZWxkID0gZm9yZWlnbk9iamVjdEdyb3VwLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXIgZWRpdGFibGUtY2hhcnRfcXVhbGlmaWVyXCIsXG4gICAgICAgICAgXCJjb250ZW50RWRpdGFibGVcIjogdHJ1ZSxcbiAgICAgICAgICBcInhtbG5zXCI6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiXG4gICAgICAgIH0pXG4gICAgICAgIC50ZXh0KG9iai5xdWFsaWZpZXIpO1xuXG4gICAgICBmb3JlaWduT2JqZWN0XG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcIndpZHRoXCI6IHF1YWxpZmllckZpZWxkLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIDE1LFxuICAgICAgICAgIFwiaGVpZ2h0XCI6IHF1YWxpZmllckZpZWxkLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyAoIC0gKHF1YWxpZmllckZpZWxkLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpIC8gMiApICsgXCIpXCJcbiAgICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB2YXIgcXVhbGlmaWVyQmcgPSB5QXhpc05vZGUuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImNoYXJ0X3F1YWxpZmllci10ZXh0LWJnXCIpXG4gICAgICAgIC50ZXh0KG9iai5xdWFsaWZpZXIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImR5XCI6IFwiMC4zMmVtXCIsXG4gICAgICAgICAgXCJ5XCI6IFwiMFwiLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLCAwKVwiXG4gICAgICAgIH0pO1xuXG4gICAgICB2YXIgcXVhbGlmaWVyVGV4dCA9IHlBeGlzTm9kZS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiY2hhcnRfcXVhbGlmaWVyLXRleHRcIilcbiAgICAgICAgLnRleHQob2JqLnF1YWxpZmllcilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiZHlcIjogXCIwLjMyZW1cIixcbiAgICAgICAgICBcInlcIjogXCIwXCIsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsIDApXCJcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcXVhbGlmaWVyQmc6IHF1YWxpZmllckJnLFxuICAgIHF1YWxpZmllclRleHQ6IHF1YWxpZmllclRleHRcbiAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHF1YWxpZmllckNvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcXVhbGlmaWVyLmpzXG4gKiogbW9kdWxlIGlkID0gMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogVGlwcyBoYW5kbGluZyBtb2R1bGUuXG4gKiBAbW9kdWxlIGNoYXJ0cy9jb21wb25lbnRzL3RpcHNcbiAqL1xuXG5mdW5jdGlvbiBiaXNlY3RvcihkYXRhLCBrZXlWYWwsIHN0YWNrZWQsIGluZGV4KSB7XG4gIGlmIChzdGFja2VkKSB7XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIHZhciBiaXNlY3QgPSBkMy5iaXNlY3RvcihmdW5jdGlvbihkKSB7IHJldHVybiBkLng7IH0pLmxlZnQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnIucHVzaChiaXNlY3QoZGF0YVtpXSwga2V5VmFsKSk7XG4gICAgfTtcbiAgICByZXR1cm4gYXJyO1xuICB9IGVsc2Uge1xuICAgIHZhciBiaXNlY3QgPSBkMy5iaXNlY3RvcihmdW5jdGlvbihkKSB7IHJldHVybiBkLmtleTsgfSkubGVmdDtcbiAgICByZXR1cm4gYmlzZWN0KGRhdGEsIGtleVZhbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3Vyc29yUG9zKG92ZXJsYXkpIHtcbiAgcmV0dXJuIHtcbiAgICB4OiBkMy5tb3VzZShvdmVybGF5Lm5vZGUoKSlbMF0sXG4gICAgeTogZDMubW91c2Uob3ZlcmxheS5ub2RlKCkpWzFdXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFRpcERhdGEob2JqLCBjdXJzb3IpIHtcblxuICB2YXIgeFNjYWxlT2JqID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLFxuICAgICAgc2NhbGVUeXBlID0geFNjYWxlT2JqLm9iai50eXBlO1xuXG4gIHZhciB4VmFsO1xuXG4gIGlmIChzY2FsZVR5cGUgPT09IFwib3JkaW5hbC10aW1lXCIgfHwgc2NhbGVUeXBlID09PSBcIm9yZGluYWxcIikge1xuXG4gICAgdmFyIG9yZGluYWxCaXNlY3Rpb24gPSBkMy5iaXNlY3RvcihmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KS5sZWZ0LFxuICAgICAgICByYW5nZVBvcyA9IG9yZGluYWxCaXNlY3Rpb24oeFNjYWxlLnJhbmdlKCksIGN1cnNvci54KTtcblxuICAgIHhWYWwgPSB4U2NhbGUuZG9tYWluKClbcmFuZ2VQb3NdO1xuXG4gIH0gZWxzZSB7XG4gICAgeFZhbCA9IHhTY2FsZS5pbnZlcnQoY3Vyc29yLngpO1xuICB9XG5cbiAgdmFyIHRpcERhdGE7XG5cbiAgaWYgKG9iai5vcHRpb25zLnN0YWNrZWQpIHtcbiAgICB2YXIgZGF0YSA9IG9iai5kYXRhLnN0YWNrZWREYXRhO1xuICAgIHZhciBpID0gYmlzZWN0b3IoZGF0YSwgeFZhbCwgb2JqLm9wdGlvbnMuc3RhY2tlZCk7XG5cbiAgICB2YXIgYXJyID0gW10sXG4gICAgICAgIHJlZkluZGV4O1xuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBkYXRhLmxlbmd0aDsgaysrKSB7XG4gICAgICBpZiAocmVmSW5kZXgpIHtcbiAgICAgICAgYXJyLnB1c2goZGF0YVtrXVtyZWZJbmRleF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGQwID0gZGF0YVtrXVtpW2tdIC0gMV0sXG4gICAgICAgICAgICBkMSA9IGRhdGFba11baVtrXV07XG4gICAgICAgIHJlZkluZGV4ID0geFZhbCAtIGQwLnggPiBkMS54IC0geFZhbCA/IGlba10gOiAoaVtrXSAtIDEpO1xuICAgICAgICBhcnIucHVzaChkYXRhW2tdW3JlZkluZGV4XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGlwRGF0YSA9IGFycjtcblxuICB9IGVsc2Uge1xuICAgIHZhciBkYXRhID0gb2JqLmRhdGEuZGF0YTtcbiAgICB2YXIgaSA9IGJpc2VjdG9yKGRhdGEsIHhWYWwpO1xuICAgIHZhciBkMCA9IGRhdGFbaSAtIDFdLFxuICAgICAgICBkMSA9IGRhdGFbaV07XG5cbiAgICB0aXBEYXRhID0geFZhbCAtIGQwLmtleSA+IGQxLmtleSAtIHhWYWwgPyBkMSA6IGQwO1xuICB9XG5cbiAgcmV0dXJuIHRpcERhdGE7XG5cbn1cblxuZnVuY3Rpb24gc2hvd1RpcHModGlwTm9kZXMsIG9iaikge1xuXG4gIGlmICh0aXBOb2Rlcy54VGlwTGluZSkge1xuICAgIHRpcE5vZGVzLnhUaXBMaW5lLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIHRydWUpO1xuICB9XG5cbiAgaWYgKHRpcE5vZGVzLnRpcEJveCkge1xuICAgIHRpcE5vZGVzLnRpcEJveC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCB0cnVlKTtcbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlcykge1xuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIHRydWUpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gaGlkZVRpcHModGlwTm9kZXMsIG9iaikge1xuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlID09PSBcImNvbHVtblwiKSB7XG4gICAgaWYob2JqLm9wdGlvbnMuc3RhY2tlZCl7XG4gICAgICBvYmoucmVuZGVyZWQucGxvdC5zZXJpZXMuc2VsZWN0QWxsKFwicmVjdFwiKS5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm11dGVkXCIsIGZhbHNlKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIG9iai5yZW5kZXJlZC5wbG90LmNvbHVtbkl0ZW0uc2VsZWN0QWxsKFwicmVjdFwiKS5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm11dGVkXCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy54VGlwTGluZSkge1xuICAgIHRpcE5vZGVzLnhUaXBMaW5lLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZhbHNlKTtcbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy50aXBCb3gpIHtcbiAgICB0aXBOb2Rlcy50aXBCb3guY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZmFsc2UpO1xuICB9XG5cbiAgaWYgKHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzKSB7XG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXMuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZmFsc2UpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gbW91c2VJZGxlKHRpcE5vZGVzLCBvYmosIHRpbWVvdXQpIHtcbiAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgaGlkZVRpcHModGlwTm9kZXMsIG9iaik7XG4gIH0sIG9iai50aXBUaW1lb3V0KTtcbn1cblxudmFyIHRpbWVvdXQ7XG5cbmZ1bmN0aW9uIHRpcHNNYW5hZ2VyKG5vZGUsIG9iaikge1xuXG4gIHZhciB0aXBOb2RlcyA9IGFwcGVuZFRpcEdyb3VwKG5vZGUsIG9iaik7XG5cbiAgdmFyIGZucyA9IHtcbiAgICBsaW5lOiBMaW5lQ2hhcnRUaXBzLFxuICAgIG11bHRpbGluZTogTGluZUNoYXJ0VGlwcyxcbiAgICBhcmVhOiBvYmoub3B0aW9ucy5zdGFja2VkID8gU3RhY2tlZEFyZWFDaGFydFRpcHMgOiBBcmVhQ2hhcnRUaXBzLFxuICAgIGNvbHVtbjogb2JqLm9wdGlvbnMuc3RhY2tlZCA/IFN0YWNrZWRDb2x1bW5DaGFydFRpcHMgOiBDb2x1bW5DaGFydFRpcHMsXG4gICAgc3RyZWFtOiBTdHJlYW1ncmFwaFRpcHNcbiAgfTtcblxuICB2YXIgZGF0YVJlZmVyZW5jZTtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSA9PT0gXCJtdWx0aWxpbmVcIikge1xuICAgIGRhdGFSZWZlcmVuY2UgPSBbb2JqLmRhdGEuZGF0YVswXS5zZXJpZXNbMF1dO1xuICB9IGVsc2Uge1xuICAgIGRhdGFSZWZlcmVuY2UgPSBvYmouZGF0YS5kYXRhWzBdLnNlcmllcztcbiAgfVxuXG4gIHZhciBpbm5lclRpcEVsZW1lbnRzID0gYXBwZW5kVGlwRWxlbWVudHMobm9kZSwgb2JqLCB0aXBOb2RlcywgZGF0YVJlZmVyZW5jZSk7XG5cbiAgc3dpdGNoIChvYmoub3B0aW9ucy50eXBlKSB7XG4gICAgY2FzZSBcImxpbmVcIjpcbiAgICBjYXNlIFwibXVsdGlsaW5lXCI6XG4gICAgY2FzZSBcImFyZWFcIjpcbiAgICBjYXNlIFwic3RyZWFtXCI6XG5cbiAgICAgIHRpcE5vZGVzLm92ZXJsYXkgPSB0aXBOb2Rlcy50aXBOb2RlLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwX292ZXJsYXlcIixcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwid2lkdGhcIjogb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCksXG4gICAgICAgICAgXCJoZWlnaHRcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKVxuICAgICAgICB9KTtcblxuICAgICAgdGlwTm9kZXMub3ZlcmxheVxuICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKSB7IHNob3dUaXBzKHRpcE5vZGVzLCBvYmopOyB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHsgaGlkZVRpcHModGlwTm9kZXMsIG9iaik7IH0pXG4gICAgICAgIC5vbihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzaG93VGlwcyh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG1vdXNlSWRsZSh0aXBOb2Rlcywgb2JqLCB0aW1lb3V0KTtcbiAgICAgICAgICByZXR1cm4gZm5zW29iai5vcHRpb25zLnR5cGVdKHRpcE5vZGVzLCBpbm5lclRpcEVsZW1lbnRzLCBvYmopO1xuICAgICAgICB9KTtcblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiY29sdW1uXCI6XG5cbiAgICAgIHZhciBjb2x1bW5SZWN0cztcblxuICAgICAgaWYgKG9iai5vcHRpb25zLnN0YWNrZWQpIHtcbiAgICAgICAgY29sdW1uUmVjdHMgPSBvYmoucmVuZGVyZWQucGxvdC5zZXJpZXMuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3QuY29sdW1uSXRlbS5zZWxlY3RBbGwoJ3JlY3QnKTtcbiAgICAgIH1cblxuICAgICAgY29sdW1uUmVjdHNcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBzaG93VGlwcyh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG1vdXNlSWRsZSh0aXBOb2Rlcywgb2JqLCB0aW1lb3V0KTtcbiAgICAgICAgICBmbnMuY29sdW1uKHRpcE5vZGVzLCBvYmosIGQsIHRoaXMpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaGlkZVRpcHModGlwTm9kZXMsIG9iaik7XG4gICAgICAgIH0pO1xuXG4gICAgICBicmVhaztcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFRpcEdyb3VwKG5vZGUsIG9iaikge1xuXG4gIHZhciBzdmdOb2RlID0gZDMuc2VsZWN0KG5vZGUubm9kZSgpLnBhcmVudE5vZGUpLFxuICAgICAgY2hhcnROb2RlID0gZDMuc2VsZWN0KG5vZGUubm9kZSgpLnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG5cbiAgdmFyIHRpcE5vZGUgPSBzdmdOb2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIG9iai5kaW1lbnNpb25zLm1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy5tYXJnaW4udG9wICsgXCIpXCIsXG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcInRpcFwiXG4gICAgfSlcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJ0aXBfc3RhY2tlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBvYmoub3B0aW9ucy5zdGFja2VkID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH0pO1xuXG4gIHZhciB4VGlwTGluZSA9IHRpcE5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX2xpbmUteFwiKVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmYWxzZSk7XG5cbiAgeFRpcExpbmUuYXBwZW5kKFwibGluZVwiKTtcblxuICB2YXIgdGlwQm94ID0gdGlwTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0aXBfYm94XCIsXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiXG4gICAgfSk7XG5cbiAgdmFyIHRpcFJlY3QgPSB0aXBCb3guYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwX3JlY3RcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKDAsMClcIixcbiAgICAgIFwid2lkdGhcIjogMSxcbiAgICAgIFwiaGVpZ2h0XCI6IDFcbiAgICB9KTtcblxuICB2YXIgdGlwR3JvdXAgPSB0aXBCb3guYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX2dyb3VwXCIpO1xuXG4gIHZhciBsZWdlbmRJY29uID0gY2hhcnROb2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtX2ljb25cIikubm9kZSgpO1xuXG4gIGlmIChsZWdlbmRJY29uKSB7XG4gICAgdmFyIHJhZGl1cyA9IGxlZ2VuZEljb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLyAyO1xuICB9IGVsc2Uge1xuICAgIHZhciByYWRpdXMgPSAwO1xuICB9XG5cbiAgdmFyIHRpcFBhdGhDaXJjbGVzID0gdGlwTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGUtZ3JvdXBcIik7XG5cbiAgdmFyIHRpcFRleHREYXRlID0gdGlwR3JvdXBcbiAgICAuaW5zZXJ0KFwiZ1wiLCBcIjpmaXJzdC1jaGlsZFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZGF0ZS1ncm91cFwiKVxuICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1kYXRlXCIsXG4gICAgICBcInhcIjogMCxcbiAgICAgIFwieVwiOiAwLFxuICAgICAgXCJkeVwiOiBcIjFlbVwiXG4gICAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdmc6IHN2Z05vZGUsXG4gICAgdGlwTm9kZTogdGlwTm9kZSxcbiAgICB4VGlwTGluZTogeFRpcExpbmUsXG4gICAgdGlwQm94OiB0aXBCb3gsXG4gICAgdGlwUmVjdDogdGlwUmVjdCxcbiAgICB0aXBHcm91cDogdGlwR3JvdXAsXG4gICAgbGVnZW5kSWNvbjogbGVnZW5kSWNvbixcbiAgICB0aXBQYXRoQ2lyY2xlczogdGlwUGF0aENpcmNsZXMsXG4gICAgcmFkaXVzOiByYWRpdXMsXG4gICAgdGlwVGV4dERhdGU6IHRpcFRleHREYXRlXG4gIH07XG5cbn1cblxuZnVuY3Rpb24gYXBwZW5kVGlwRWxlbWVudHMobm9kZSwgb2JqLCB0aXBOb2RlcywgZGF0YVJlZikge1xuXG4gIHZhciB0aXBUZXh0R3JvdXBDb250YWluZXIgPSB0aXBOb2Rlcy50aXBHcm91cFxuICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cC1jb250YWluZXJcIjtcbiAgICB9KTtcblxuICB2YXIgdGlwVGV4dEdyb3VwcyA9IHRpcFRleHRHcm91cENvbnRhaW5lclxuICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cFwiKVxuICAgIC5kYXRhKGRhdGFSZWYpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgcmV0dXJuIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIFwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAtXCIgKyAoaSk7XG4gICAgfSk7XG5cbiAgdmFyIGxpbmVIZWlnaHQ7XG5cbiAgdGlwVGV4dEdyb3Vwcy5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWw7IH0pXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAob2JqLnByZWZpeCArIFwidGlwX3RleHQgXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1cIiArIChpKSk7XG4gICAgICB9LFxuICAgICAgXCJkYXRhLXNlcmllc1wiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBkLmtleTsgfSxcbiAgICAgIFwieFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICh0aXBOb2Rlcy5yYWRpdXMgKiAyKSArICh0aXBOb2Rlcy5yYWRpdXMgLyAxLjUpO1xuICAgICAgfSxcbiAgICAgIFwieVwiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIGxpbmVIZWlnaHQgPSBsaW5lSGVpZ2h0IHx8IHBhcnNlSW50KGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImxpbmUtaGVpZ2h0XCIpKTtcbiAgICAgICAgcmV0dXJuIChpICsgMSkgKiBsaW5lSGVpZ2h0O1xuICAgICAgfSxcbiAgICAgIFwiZHlcIjogXCIxZW1cIlxuICAgIH0pO1xuXG4gIHRpcFRleHRHcm91cHNcbiAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAob2JqLnByZWZpeCArIFwidGlwX2NpcmNsZSBcIiArIG9iai5wcmVmaXggKyBcInRpcF9jaXJjbGUtXCIgKyAoaSkpO1xuICAgICAgfSxcbiAgICAgIFwiclwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiB0aXBOb2Rlcy5yYWRpdXM7IH0sXG4gICAgICBcImN4XCI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGlwTm9kZXMucmFkaXVzOyB9LFxuICAgICAgXCJjeVwiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAoKGkgKyAxKSAqIGxpbmVIZWlnaHQpICsgKHRpcE5vZGVzLnJhZGl1cyAqIDEuNSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgLmRhdGEoZGF0YVJlZilcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGUgXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGUtXCIgKyAoaSkpO1xuICAgICAgfSxcbiAgICAgIFwiclwiOiAodGlwTm9kZXMucmFkaXVzIC8gMikgfHwgMi41XG4gICAgfSk7XG5cbiAgcmV0dXJuIHRpcFRleHRHcm91cHM7XG5cbn1cblxuZnVuY3Rpb24gTGluZUNoYXJ0VGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoZC52YWwpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJuL2FcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3A7XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7IH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAoZC52YWwpIHsgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZShkLnZhbCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieTFcIjogMCxcbiAgICAgICAgXCJ5MlwiOiBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gQXJlYUNoYXJ0VGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoZC52YWwpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJuL2FcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3A7XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7IH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAoZC52YWwpIHsgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZShkLnZhbCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieTFcIjogMCxcbiAgICAgICAgXCJ5MlwiOiBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gU3RhY2tlZEFyZWFDaGFydFRpcHModGlwTm9kZXMsIGlubmVyVGlwRWxzLCBvYmopIHtcblxuICB2YXIgY3Vyc29yID0gY3Vyc29yUG9zKHRpcE5vZGVzLm92ZXJsYXkpLFxuICAgICAgdGlwRGF0YSA9IGdldFRpcERhdGEob2JqLCBjdXJzb3IpO1xuXG4gIHZhciBpc1VuZGVmaW5lZCA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXBEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGFbaV0ueSA9PT0gTmFOIHx8IHRpcERhdGFbaV0ueTAgPT09IE5hTikge1xuICAgICAgaXNVbmRlZmluZWQrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNVbmRlZmluZWQpIHtcblxuICAgIHZhciB5Rm9ybWF0dGVyID0gcmVxdWlyZShcIi4vYXhpc1wiKS5zZXRUaWNrRm9ybWF0WSxcbiAgICAgICAgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmY7XG4gICAgICAgIGRvbWFpbiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZS5kb21haW4oKSxcbiAgICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIHRleHRcIilcbiAgICAgIC5kYXRhKHRpcERhdGEpXG4gICAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG5cbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuXG4gICAgICAgIHZhciB0ZXh0O1xuXG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGlwRGF0YS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgdGV4dCA9IG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQucmF3LnNlcmllc1tpXS52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0ZXh0ID0gXCJuL2FcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChrID09PSBpKSB7XG4gICAgICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbal0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWhhc1VuZGVmaW5lZCAmJiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpKSB7XG4gICAgICAgICAgICAgIHRleHQgPSBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnJhdy5zZXJpZXNbaV0udmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dCA9IFwibi9hXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgIC5jYWxsKHRpcERhdGVGb3JtYXR0ZXIsIGN0eCwgb2JqLm1vbnRoc0FiciwgdGlwRGF0YVswXS54KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkLnJhdy5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIiAmJiAhaGFzVW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgeSA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wO1xuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlc1xuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF9wYXRoLWNpcmNsZVwiKVxuICAgICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIHZhciBoYXNVbmRlZmluZWQgPSAwO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgaGFzVW5kZWZpbmVkKys7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIgJiYgIWhhc1VuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUoZC54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICB2YXIgeSA9IGQueSB8fCAwLFxuICAgICAgICAgICAgICAgIHkwID0gZC55MCB8fCAwO1xuICAgICAgICAgICAgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZSh5ICsgeTApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBSZWN0XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwid2lkdGhcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5yaWdodCxcbiAgICAgICAgXCJoZWlnaHRcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5ib3R0b21cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMueFRpcExpbmUuc2VsZWN0KFwibGluZVwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIngxXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcInkxXCI6IDAsXG4gICAgICAgIFwieTJcIjogb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBCb3hcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCAtIGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gU3RyZWFtZ3JhcGhUaXBzKHRpcE5vZGVzLCBpbm5lclRpcEVscywgb2JqKSB7XG5cbiAgdmFyIGN1cnNvciA9IGN1cnNvclBvcyh0aXBOb2Rlcy5vdmVybGF5KSxcbiAgICAgIHRpcERhdGEgPSBnZXRUaXBEYXRhKG9iaiwgY3Vyc29yKTtcblxuICB2YXIgaXNVbmRlZmluZWQgPSAwO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGlwRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhW2ldLnkgPT09IE5hTiB8fCB0aXBEYXRhW2ldLnkwID09PSBOYU4pIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cblxuICAgICAgICB2YXIgdGV4dDtcblxuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRpcERhdGEubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIHRleHQgPSBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnJhdy5zZXJpZXNbaV0udmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dCA9IFwibi9hXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoayA9PT0gaSkge1xuICAgICAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYXNVbmRlZmluZWQgJiYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSkge1xuICAgICAgICAgICAgICB0ZXh0ID0gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC5yYXcuc2VyaWVzW2ldLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHQgPSBcIm4vYVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAuY2FsbCh0aXBEYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGFbMF0ueCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIgJiYgIWhhc1VuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHkgPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcDtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGVcIilcbiAgICAgICAgLmRhdGEodGlwRGF0YSlcbiAgICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiICYmICFoYXNVbmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjeFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKGQueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHRcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgdmFyIHkgPSBkLnkgfHwgMCxcbiAgICAgICAgICAgICAgICB5MCA9IGQueTAgfHwgMDtcbiAgICAgICAgICAgIHJldHVybiBvYmoucmVuZGVyZWQucGxvdC55U2NhbGVPYmouc2NhbGUoeSArIHkwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ4MlwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIENvbHVtbkNoYXJ0VGlwcyh0aXBOb2Rlcywgb2JqLCBkLCB0aGlzUmVmKSB7XG5cbiAgdmFyIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3QuY29sdW1uSXRlbS5zZWxlY3RBbGwoJ3JlY3QnKSxcbiAgICAgIGlzVW5kZWZpbmVkID0gMDtcblxuICB2YXIgdGhpc0NvbHVtbiA9IHRoaXNSZWYsXG4gICAgICB0aXBEYXRhID0gZDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGdldFRyYW5zbGF0ZVhZID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLmdldFRyYW5zbGF0ZVhZLFxuICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHZhciBjdXJzb3JYID0gZ2V0VHJhbnNsYXRlWFkodGhpc0NvbHVtbi5wYXJlbnROb2RlKTtcblxuICAgIGNvbHVtblJlY3RzXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgJ211dGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMgPT09IHRoaXNDb2x1bW4pID8gZmFsc2UgOiB0cnVlO1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcblxuICAgICAgICBpZiAoIW9iai55QXhpcy5wcmVmaXgpIHsgb2JqLnlBeGlzLnByZWZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKCFvYmoueUF4aXMuc3VmZml4KSB7IG9iai55QXhpcy5zdWZmaXggPSBcIlwiOyB9XG5cbiAgICAgICAgaWYgKGQudmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQudmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwibi9hXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgaWYob2JqLmRhdGVGb3JtYXQgIT09IHVuZGVmaW5lZCl7XG4gICAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgICAuY2FsbCh0aXBEYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGEua2V5KTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAgIC50ZXh0KHRpcERhdGEua2V5KTtcbiAgICB9XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuXG4gICAgICAgICAgaWYoeCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMil7XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgc2hvd1RpcHModGlwTm9kZXMsIG9iaik7XG5cbiAgfVxuXG59XG5cblxuZnVuY3Rpb24gU3RhY2tlZENvbHVtbkNoYXJ0VGlwcyh0aXBOb2Rlcywgb2JqLCBkLCB0aGlzUmVmKSB7XG5cbiAgdmFyIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3Quc2VyaWVzLnNlbGVjdEFsbCgncmVjdCcpLFxuICAgICAgaXNVbmRlZmluZWQgPSAwO1xuXG4gIHZhciB0aGlzQ29sdW1uUmVjdCA9IHRoaXNSZWYsXG4gICAgICB0aXBEYXRhID0gZDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEucmF3LnNlcmllcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhLnJhdy5zZXJpZXNbaV0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgaXNVbmRlZmluZWQrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNVbmRlZmluZWQpIHtcblxuICAgIHZhciB5Rm9ybWF0dGVyID0gcmVxdWlyZShcIi4vYXhpc1wiKS5zZXRUaWNrRm9ybWF0WSxcbiAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmLFxuICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHZhciBwYXJlbnRFbCA9IGQzLnNlbGVjdCh0aGlzQ29sdW1uUmVjdC5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgIHZhciByZWZQb3MgPSBkMy5zZWxlY3QodGhpc0NvbHVtblJlY3QpLmF0dHIoXCJ4XCIpO1xuXG4gICAgdmFyIHRoaXNDb2x1bW5LZXkgPSAnJztcblxuICAgIC8qIEZpZ3VyZSBvdXQgd2hpY2ggc3RhY2sgdGhpcyBzZWxlY3RlZCByZWN0IGlzIGluIHRoZW4gbG9vcCBiYWNrIHRocm91Z2ggYW5kICh1bilhc3NpZ24gbXV0ZWQgY2xhc3MgKi9cbiAgICBjb2x1bW5SZWN0cy5jbGFzc2VkKG9iai5wcmVmaXggKyAnbXV0ZWQnLGZ1bmN0aW9uIChkKSB7XG5cbiAgICAgIGlmKHRoaXMgPT09IHRoaXNDb2x1bW5SZWN0KXtcbiAgICAgICAgdGhpc0NvbHVtbktleSA9IGQucmF3LmtleTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICh0aGlzID09PSB0aGlzQ29sdW1uUmVjdCkgPyBmYWxzZSA6IHRydWU7XG5cbiAgICB9KTtcblxuICAgIGNvbHVtblJlY3RzLmNsYXNzZWQob2JqLnByZWZpeCArICdtdXRlZCcsZnVuY3Rpb24gKGQpIHtcblxuICAgICAgcmV0dXJuIChkLnJhdy5rZXkgPT09IHRoaXNDb2x1bW5LZXkpID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnJhdy5zZXJpZXMpXG4gICAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG5cbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuXG4gICAgICAgIGlmIChkLnZhbCkge1xuICAgICAgICAgIHJldHVybiBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIm4vYVwiO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGlmKG9iai5kYXRlRm9ybWF0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgICAudGV4dChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZCA9IHRpcERhdGEucmF3LmtleTtcbiAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIChvYmoucHJlZml4ICsgXCJ0aXBfY2lyY2xlIFwiICsgb2JqLnByZWZpeCArIFwidGlwX2NpcmNsZS1cIiArIChpKSk7XG4gICAgICAgIH0sXG4gICAgICAgIFwiclwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiB0aXBOb2Rlcy5yYWRpdXM7IH0sXG4gICAgICAgIFwiY3hcIjogZnVuY3Rpb24oKSB7IHJldHVybiB0aXBOb2Rlcy5yYWRpdXM7IH0sXG4gICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIHJldHVybiAoIChpICsgMSkgKiBwYXJzZUludChkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJmb250LXNpemVcIikpICogMS4xMyArIDkpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEucmF3LnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGlmIChyZWZQb3MgPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0IC0gZDMuc2VsZWN0KHRoaXMpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcblxuICAgICAgICB9XG5cbiAgICAgIH0pO1xuXG4gIH1cblxufVxuXG5mdW5jdGlvbiB0aXBEYXRlRm9ybWF0dGVyKHNlbGVjdGlvbiwgY3R4LCBtb250aHMsIGRhdGEpIHtcblxuICB2YXIgZE1vbnRoLFxuICAgICAgZERhdGUsXG4gICAgICBkWWVhcixcbiAgICAgIGRIb3VyLFxuICAgICAgZE1pbnV0ZTtcblxuICBzZWxlY3Rpb24udGV4dChmdW5jdGlvbigpIHtcbiAgICB2YXIgZCA9IGRhdGE7XG4gICAgdmFyIGRTdHI7XG4gICAgc3dpdGNoIChjdHgpIHtcbiAgICAgIGNhc2UgXCJ5ZWFyc1wiOlxuICAgICAgICBkU3RyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJtb250aHNcIjpcbiAgICAgICAgZE1vbnRoID0gbW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZSArIFwiLCBcIiArIGRZZWFyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ3ZWVrc1wiOlxuICAgICAgY2FzZSBcImRheXNcIjpcbiAgICAgICAgZE1vbnRoID0gbW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaG91cnNcIjpcblxuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICBkSG91ciA9IGQuZ2V0SG91cnMoKTtcbiAgICAgICAgZE1pbnV0ZSA9IGQuZ2V0TWludXRlcygpO1xuXG4gICAgICAgIHZhciBkSG91clN0cixcbiAgICAgICAgICBkTWludXRlU3RyO1xuXG4gICAgICAgIC8vIENvbnZlcnQgZnJvbSAyNGggdGltZVxuICAgICAgICB2YXIgc3VmZml4ID0gKGRIb3VyID49IDEyKSA/ICdwLm0uJyA6ICdhLm0uJztcblxuICAgICAgICBpZiAoZEhvdXIgPT09IDApIHtcbiAgICAgICAgICBkSG91clN0ciA9IDEyO1xuICAgICAgICB9IGVsc2UgaWYgKGRIb3VyID4gMTIpIHtcbiAgICAgICAgICBkSG91clN0ciA9IGRIb3VyIC0gMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSBkSG91cjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2UgbWludXRlcyBmb2xsb3cgR2xvYmUgc3R5bGVcbiAgICAgICAgaWYgKGRNaW51dGUgPT09IDApIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJyc7XG4gICAgICAgIH0gZWxzZSBpZiAoZE1pbnV0ZSA8IDEwKSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICc6MCcgKyBkTWludXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnOicgKyBkTWludXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZFN0ciA9IGRIb3VyU3RyICsgZE1pbnV0ZVN0ciArICcgJyArIHN1ZmZpeDtcblxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRTdHIgPSBkO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZFN0cjtcblxuICB9KTtcblxufVxuXG5cbi8vIFtmdW5jdGlvbiBCYXJDaGFydFRpcHModGlwTm9kZXMsIG9iaikge1xuXG4vLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gdGlwc01hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3RpcHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBTb2NpYWwgbW9kdWxlLlxuICogQG1vZHVsZSBjaGFydHMvY29tcG9uZW50cy9zb2NpYWxcbiAqL1xuXG4vKlxuVGhpcyBjb21wb25lbnQgYWRkcyBhIFwic29jaWFsXCIgYnV0dG9uIHRvIGVhY2ggY2hhcnQgd2hpY2ggY2FuIGJlIHRvZ2dsZWQgdG8gcHJlc2VudCB0aGUgdXNlciB3aXRoIHNvY2lhbCBzaGFyaW5nIG9wdGlvbnNcbiAqL1xuXG52YXIgZ2V0VGh1bWJuYWlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLmdldFRodW1ibmFpbFBhdGg7XG5cbmZ1bmN0aW9uIHNvY2lhbENvbXBvbmVudChub2RlLCBvYmopIHtcblxuXHR2YXIgc29jaWFsT3B0aW9ucyA9IFtdO1xuXG5cdGZvciAodmFyIHByb3AgaW4gb2JqLnNvY2lhbCkge1xuXHRcdGlmIChvYmouc29jaWFsW3Byb3BdKSB7XG5cdFx0XHRzd2l0Y2ggKG9iai5zb2NpYWxbcHJvcF0ubGFiZWwpIHtcblx0XHRcdFx0Y2FzZSBcIlR3aXR0ZXJcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdFR3aXR0ZXJVUkwob2JqKTtcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnBvcHVwID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIkZhY2Vib29rXCI6XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS51cmwgPSBjb25zdHJ1Y3RGYWNlYm9va1VSTChvYmopO1xuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0ucG9wdXAgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiRW1haWxcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdE1haWxVUkwob2JqKTtcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnBvcHVwID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJTTVNcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdFNNU1VSTChvYmopO1xuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0ucG9wdXAgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnSU5DT1JSRUNUIFNPQ0lBTCBJVEVNIERFRklOSVRJT04nKVxuXHRcdFx0fVxuXHRcdFx0c29jaWFsT3B0aW9ucy5wdXNoKG9iai5zb2NpYWxbcHJvcF0pO1xuXHRcdH1cblx0fVxuXG5cdHZhciBjaGFydENvbnRhaW5lciA9IGQzLnNlbGVjdChub2RlKTtcblxuICB2YXIgY2hhcnRNZXRhID0gY2hhcnRDb250YWluZXIuc2VsZWN0KCcuJyArIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YScpO1xuXG4gIGlmIChjaGFydE1ldGEubm9kZSgpID09PSBudWxsKSB7XG4gICAgY2hhcnRNZXRhID0gY2hhcnRDb250YWluZXJcbiAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGEnKTtcbiAgfVxuXG5cdHZhciBjaGFydFNvY2lhbEJ0biA9IGNoYXJ0TWV0YVxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9tZXRhX2J0bicpXG5cdFx0Lmh0bWwoJ3NoYXJlJyk7XG5cblx0dmFyIGNoYXJ0U29jaWFsID0gY2hhcnRDb250YWluZXJcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfc29jaWFsJyk7XG5cblx0dmFyIGNoYXJ0U29jaWFsQ2xvc2VCdG4gPSBjaGFydFNvY2lhbFxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9zb2NpYWxfY2xvc2UnKVxuXHRcdC5odG1sKCcmI3hkNzsnKTtcblxuXHR2YXIgY2hhcnRTb2NpYWxPcHRpb25zID0gY2hhcnRTb2NpYWxcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfc29jaWFsX29wdGlvbnMnKTtcblxuXHRjaGFydFNvY2lhbE9wdGlvbnNcblx0XHQuYXBwZW5kKCdoMycpXG5cdFx0Lmh0bWwoJ1NoYXJlIHRoaXMgY2hhcnQ6Jyk7XG5cblx0Y2hhcnRTb2NpYWxCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Y2hhcnRTb2NpYWwuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIHRydWUpO1xuXHR9KTtcblxuXHRjaGFydFNvY2lhbENsb3NlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNoYXJ0U29jaWFsLmNsYXNzZWQob2JqLnByZWZpeCArICdhY3RpdmUnLCBmYWxzZSk7XG5cdH0pO1xuXG5cdHZhciBpdGVtQW1vdW50ID0gc29jaWFsT3B0aW9ucy5sZW5ndGg7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IGl0ZW1BbW91bnQ7IGkrKyApIHtcblx0XHRjaGFydFNvY2lhbE9wdGlvbnNcblx0XHRcdC5zZWxlY3RBbGwoJy4nICsgb2JqLnByZWZpeCArICdzb2NpYWwtaXRlbScpXG5cdFx0XHQuZGF0YShzb2NpYWxPcHRpb25zKVxuXHRcdFx0LmVudGVyKClcblx0XHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ3NvY2lhbC1pdGVtJykuaHRtbChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdGlmICghZC5wb3B1cCkge1xuXHRcdFx0XHRcdHJldHVybiAnPGEgaHJlZj1cIicgKyBkLnVybCArICdcIj48aW1nIGNsYXNzPVwiJyArIG9iai5wcmVmaXggKyAnc29jaWFsLWljb25cIiBzcmM9XCInICsgZC5pY29uICsgJ1wiIHRpdGxlPVwiJyArIGQubGFiZWwgKyAnXCIvPjwvYT4nO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiAnPGEgY2xhc3M9XCInICsgb2JqLnByZWZpeCArICdqcy1zaGFyZVwiIGhyZWY9XCInICsgZC51cmwgKyAnXCI+PGltZyBjbGFzcz1cIicgKyBvYmoucHJlZml4ICsgJ3NvY2lhbC1pY29uXCIgc3JjPVwiJyArIGQuaWNvbiArICdcIiB0aXRsZT1cIicgKyBkLmxhYmVsICsgJ1wiLz48L2E+Jztcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdH1cblxuICBpZiAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpIHtcbiAgICBjaGFydFNvY2lhbE9wdGlvbnNcbiAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2ltYWdlLXVybCcpXG4gICAgICAuYXR0cignY29udGVudEVkaXRhYmxlJywgJ3RydWUnKVxuICAgICAgLmh0bWwoZ2V0VGh1bWJuYWlsKG9iaikpO1xuICB9XG5cblx0dmFyIHNoYXJlUG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwianMtc2hhcmVcIik7XG5cbiAgaWYgKHNoYXJlUG9wdXApIHtcbiAgICBbXS5mb3JFYWNoLmNhbGwoc2hhcmVQb3B1cCwgZnVuY3Rpb24oYW5jaG9yKSB7XG4gICAgICBhbmNob3IuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB3aW5kb3dQb3B1cCh0aGlzLmhyZWYsIDYwMCwgNjIwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cblx0cmV0dXJuIHtcblx0XHRtZXRhX25hdjogY2hhcnRNZXRhXG5cdH07XG5cbn1cblxuLy8gc29jaWFsIHBvcHVwXG5mdW5jdGlvbiB3aW5kb3dQb3B1cCh1cmwsIHdpZHRoLCBoZWlnaHQpIHtcbiAgLy8gY2FsY3VsYXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9wdXAgc28gaXTigJlzIGNlbnRlcmVkIG9uIHRoZSBzY3JlZW4uXG4gIHZhciBsZWZ0ID0gKHNjcmVlbi53aWR0aCAvIDIpIC0gKHdpZHRoIC8gMiksXG4gICAgICB0b3AgPSAoc2NyZWVuLmhlaWdodCAvIDIpIC0gKGhlaWdodCAvIDIpO1xuICB3aW5kb3cub3BlbihcbiAgICB1cmwsXG4gICAgXCJcIixcbiAgICBcIm1lbnViYXI9bm8sdG9vbGJhcj1ubyxyZXNpemFibGU9eWVzLHNjcm9sbGJhcnM9eWVzLHdpZHRoPVwiICsgd2lkdGggKyBcIixoZWlnaHQ9XCIgKyBoZWlnaHQgKyBcIix0b3A9XCIgKyB0b3AgKyBcIixsZWZ0PVwiICsgbGVmdFxuICApO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RGYWNlYm9va1VSTChvYmope1xuICB2YXIgYmFzZSA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vZGlhbG9nL3NoYXJlPycsXG4gICAgICByZWRpcmVjdCA9IG9iai5zb2NpYWwuZmFjZWJvb2sucmVkaXJlY3QsXG4gICAgICB1cmwgPSAnYXBwX2lkPScgKyBvYmouc29jaWFsLmZhY2Vib29rLmFwcElEICsgJyZhbXA7ZGlzcGxheT1wb3B1cCZhbXA7dGl0bGU9JyArIG9iai5oZWFkaW5nICsgJyZhbXA7ZGVzY3JpcHRpb249RnJvbSUyMGFydGljbGUnICsgZG9jdW1lbnQudGl0bGUgKyAnJmFtcDtocmVmPScgKyB3aW5kb3cubG9jYXRpb24uaHJlZiArICcmYW1wO3JlZGlyZWN0X3VyaT0nICsgcmVkaXJlY3Q7XG4gIGlmIChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkgeyAgdXJsICs9ICcmYW1wO3BpY3R1cmU9JyArIGdldFRodW1ibmFpbChvYmopOyB9XG4gIHJldHVybiBiYXNlICsgdXJsO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RNYWlsVVJMKG9iail7XG4gIHZhciBiYXNlID0gJ21haWx0bzo/JztcbiAgdmFyIHRodW1ibmFpbCA9IChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkgPyAnJTBBJyArIGdldFRodW1ibmFpbChvYmopIDogXCJcIjtcbiAgcmV0dXJuIGJhc2UgKyAnc3ViamVjdD0nICsgb2JqLmhlYWRpbmcgKyAnJmFtcDtib2R5PScgKyBvYmouaGVhZGluZyArIHRodW1ibmFpbCArICclMEFmcm9tIGFydGljbGU6ICcgKyBkb2N1bWVudC50aXRsZSArICclMEEnICsgd2luZG93LmxvY2F0aW9uLmhyZWY7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFNNU1VSTChvYmope1xuICB2YXIgYmFzZSA9ICdzbXM6JyxcbiAgICAgIHVybCA9ICcmYm9keT1DaGVjayUyMG91dCUyMHRoaXMlMjBjaGFydDogJyArIG9iai5oZWFkaW5nO1xuICBpZiAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpIHsgIHVybCArPSAnJTIwJyArIGdldFRodW1ibmFpbChvYmopOyB9XG4gIHJldHVybiBiYXNlICsgdXJsO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RUd2l0dGVyVVJMKG9iail7XG4gIHZhciBiYXNlID0gJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0PycsXG4gICAgICBoYXNodGFnID0gISEob2JqLnNvY2lhbC50d2l0dGVyLmhhc2h0YWcpID8gJyZhbXA7aGFzaHRhZ3M9JyArIG9iai5zb2NpYWwudHdpdHRlci5oYXNodGFnIDogXCJcIixcbiAgICAgIHZpYSA9ICEhKG9iai5zb2NpYWwudHdpdHRlci52aWEpID8gJyZhbXA7dmlhPScgKyBvYmouc29jaWFsLnR3aXR0ZXIudmlhIDogXCJcIixcbiAgICAgIHVybCA9ICd1cmw9JyArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICArIHZpYSArICcmYW1wO3RleHQ9JyArIGVuY29kZVVSSShvYmouaGVhZGluZykgKyBoYXNodGFnO1xuICBpZiAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpIHsgIHVybCArPSAnJTIwJyArIGdldFRodW1ibmFpbChvYmopOyB9XG4gIHJldHVybiBiYXNlICsgdXJsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNvY2lhbENvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc29jaWFsLmpzXG4gKiogbW9kdWxlIGlkID0gMjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogU2hhcmluZyBEYXRhIG1vZHVsZS5cbiAqIEBtb2R1bGUgY2hhcnRzL2NvbXBvbmVudHMvc2hhcmUtZGF0YVxuICovXG5cbi8qXG5UaGlzIGNvbXBvbmVudCBhZGRzIGEgXCJkYXRhXCIgYnV0dG9uIHRvIGVhY2ggY2hhcnQgd2hpY2ggY2FuIGJlIHRvZ2dsZWQgdG8gcHJlc2VudCB0aGUgY2hhcnRzIGRhdGEgaW4gYSB0YWJ1bGFyIGZvcm0gYWxvbmcgd2l0aCBidXR0b25zIGFsbG93aW5nIHRoZSByYXcgZGF0YSB0byBiZSBkb3dubG9hZGVkXG4gKi9cblxuZnVuY3Rpb24gc2hhcmVEYXRhQ29tcG9uZW50KG5vZGUsIG9iaikge1xuXG4gXHR2YXIgY2hhcnRDb250YWluZXIgPSBkMy5zZWxlY3Qobm9kZSk7XG5cbiAgdmFyIGNoYXJ0TWV0YSA9IGNoYXJ0Q29udGFpbmVyLnNlbGVjdCgnLicgKyBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGEnKTtcblxuICBpZiAoY2hhcnRNZXRhLm5vZGUoKSA9PT0gbnVsbCkge1xuICAgIGNoYXJ0TWV0YSA9IGNoYXJ0Q29udGFpbmVyXG4gICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9tZXRhJyk7XG4gIH1cblxuXHR2YXIgY2hhcnREYXRhQnRuID0gY2hhcnRNZXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGFfYnRuJylcblx0XHQuaHRtbCgnZGF0YScpO1xuXG5cdHZhciBjaGFydERhdGEgPSBjaGFydENvbnRhaW5lclxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhJyk7XG5cblx0dmFyIGNoYXJ0RGF0YUNsb3NlQnRuID0gY2hhcnREYXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X2RhdGFfY2xvc2UnKVxuXHRcdC5odG1sKCcmI3hkNzsnKTtcblxuXHR2YXIgY2hhcnREYXRhVGFibGUgPSBjaGFydERhdGFcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfZGF0YV9pbm5lcicpO1xuXG5cdGNoYXJ0RGF0YVxuXHRcdC5hcHBlbmQoJ2gyJylcblx0XHQuaHRtbChvYmouaGVhZGluZyk7XG5cblx0dmFyIGNoYXJ0RGF0YU5hdiA9IGNoYXJ0RGF0YVxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhX25hdicpO1xuXG5cdHZhciBjc3ZETEJ0biA9IGNoYXJ0RGF0YU5hdlxuXHRcdC5hcHBlbmQoJ2EnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfZGF0YV9idG4gY3N2Jylcblx0XHQuaHRtbCgnZG93bmxvYWQgY3N2Jyk7XG5cbiAgdmFyIGNzdlRvVGFibGUgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikuY3N2VG9UYWJsZTtcblxuXHRjc3ZUb1RhYmxlKGNoYXJ0RGF0YVRhYmxlLCBvYmouZGF0YS5jc3YpO1xuXG5cdGNoYXJ0RGF0YUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjaGFydERhdGEuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIHRydWUpO1xuXHR9KTtcblxuXHRjaGFydERhdGFDbG9zZUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjaGFydERhdGEuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIGZhbHNlKTtcblx0fSk7XG5cblx0Y3N2RExCdG4ub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcblx0ICB2YXIgZGxEYXRhID0gJ2RhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQob2JqLmRhdGEuY3N2KTtcblx0ICBkMy5zZWxlY3QodGhpcylcblx0ICBcdC5hdHRyKCdocmVmJywgZGxEYXRhKVxuXHQgIFx0LmF0dHIoJ2Rvd25sb2FkJywnZGF0YV8nICsgb2JqLmlkICsgJy5jc3YnKTtcblx0fSk7XG5cblx0cmV0dXJuIHtcblx0XHRtZXRhX25hdjogY2hhcnRNZXRhLFxuXHRcdGRhdGFfcGFuZWw6IGNoYXJ0RGF0YVxuXHR9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hhcmVEYXRhQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhLmpzXG4gKiogbW9kdWxlIGlkID0gMjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ3VzdG9tIGNvZGUgZnVuY3Rpb24gdGhhdCBjYW4gYmUgaW52b2tlZCB0byBtb2RpZnkgY2hhcnQgZWxlbWVudHMgYWZ0ZXIgY2hhcnQgZHJhd2luZyBoYXMgb2NjdXJyZWQuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG5vZGUgICAgICAgICBUaGUgbWFpbiBjb250YWluZXIgZ3JvdXAgZm9yIHRoZSBjaGFydC5cbiAqIEBwYXJhbSAge09iamVjdH0gY2hhcnRSZWNpcGUgIE9iamVjdCB0aGF0IGNvbnRhaW5zIHNldHRpbmdzIGZvciB0aGUgY2hhcnQuXG4gKiBAcGFyYW0gIHtPYmplY3R9IHJlbmRlcmVkICAgICBBbiBvYmplY3QgY29udGFpbmluZyByZWZlcmVuY2VzIHRvIGFsbCByZW5kZXJlZCBjaGFydCBlbGVtZW50cywgaW5jbHVkaW5nIGF4ZXMsIHNjYWxlcywgcGF0aHMsIG5vZGVzLCBhbmQgc28gZm9ydGguXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICBPcHRpb25hbC5cbiAqL1xuZnVuY3Rpb24gY3VzdG9tKG5vZGUsIGNoYXJ0UmVjaXBlLCByZW5kZXJlZCkge1xuXG4gIC8vIFdpdGggdGhpcyBmdW5jdGlvbiwgeW91IGNhbiBhY2Nlc3MgYWxsIGVsZW1lbnRzIG9mIGEgY2hhcnQgYW5kIG1vZGlmeVxuICAvLyB0aGVtIGF0IHdpbGwuIEZvciBpbnN0YW5jZTogeW91IG1pZ2h0IHdhbnQgdG8gcGxheSB3aXRoIGNvbG91clxuICAvLyBpbnRlcnBvbGF0aW9uIGZvciBhIG11bHRpLXNlcmllcyBsaW5lIGNoYXJ0LCBvciBtb2RpZnkgdGhlIHdpZHRoIGFuZCBwb3NpdGlvblxuICAvLyBvZiB0aGUgeC0gYW5kIHktYXhpcyB0aWNrcy4gV2l0aCB0aGlzIGZ1bmN0aW9uLCB5b3UgY2FuIGRvIGFsbCB0aGF0IVxuXG4gIC8vIElmIHlvdSBjYW4sIGl0J3MgZ29vZCBDaGFydCBUb29sIHByYWN0aWNlIHRvIHJldHVybiByZWZlcmVuY2VzIHRvIG5ld2x5XG4gIC8vIGNyZWF0ZWQgbm9kZXMgYW5kIGQzIG9iamVjdHMgc28gdGhleSBiZSBhY2Nlc3NlZCBsYXRlciDigJQgYnkgYSBkaXNwYXRjaGVyXG4gIC8vIGV2ZW50LCBmb3IgaW5zdGFuY2UuXG4gIHJldHVybjtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGN1c3RvbTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vY3VzdG9tL2N1c3RvbS5qc1xuICoqIG1vZHVsZSBpZCA9IDI5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9