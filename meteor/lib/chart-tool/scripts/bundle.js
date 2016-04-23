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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjE0NzQyYTYyOTRkYjdmNzlhODkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb25maWcvY2hhcnQtc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZS5qc29uIiwid2VicGFjazovLy8uL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29uZmlnL2Vudi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdXRpbHMvZGF0YXBhcnNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy9mYWN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9oZWxwZXJzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9tYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2Zvb3Rlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcGxvdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2xpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2F4aXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NjYWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvbXVsdGlsaW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2NvbHVtbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2Jhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtY29sdW1uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3F1YWxpZmllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvdGlwcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc29jaWFsLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhLmpzIiwid2VicGFjazovLy8uL2N1c3RvbS9jdXN0b20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVMsTUFBTTtBQUNmLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0IsT0FBTztBQUN6QixtQkFBa0IsT0FBTztBQUN6QjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQSxxQkFBb0IsaUNBQWlDO0FBQ3JEOztBQUVBO0FBQ0Esb0NBQW1DLGtDQUFrQyxFQUFFO0FBQ3ZFLHdDQUF1QyxzQ0FBc0MsRUFBRTtBQUMvRSx3Q0FBdUMsc0NBQXNDLEdBQUc7QUFDaEYsdUNBQXNDLHFDQUFxQyxFQUFFOztBQUU3RTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWlCLE1BQU07QUFDdkIsbUJBQWtCLE9BQU87QUFDekIsbUJBQWtCLE9BQU87QUFDekI7QUFDQTtBQUNBLHdCQUF1QixtQkFBbUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWlCLE1BQU07QUFDdkIsbUJBQWtCLE1BQU07QUFDeEI7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUNBQWdDLG9CQUFvQjtBQUNwRDs7QUFFQTtBQUNBO0FBQ0Esd0JBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFpQixNQUFNO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBLHdCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWlCLE1BQU07QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsTUFBSzs7QUFFTCx3QkFBdUIsa0JBQWtCOztBQUV6QyxJQUFHOztBQUVILG1DQUFrQztBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBOztBQUVBLEVBQUM7Ozs7Ozs7QUN0TkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHO0FBQ0gsMEJBQXlCLDhCQUE4QixFQUFFO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUgsWUFBVztBQUNYLGFBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFD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QTs7Ozs7OztBQ3BDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUF5QixVQUFVLEVBQUU7QUFDckM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ3hGQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7QUNsQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7Ozs7Ozs7QUNsREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFDQUFvQyxtQ0FBbUMsVUFBVSxFQUFFOztBQUVuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBLDBDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwrQkFBOEIsZ0NBQWdDLEVBQUU7QUFDaEUseUJBQXdCLHNCQUFzQixFQUFFO0FBQ2hELHlCQUF3QixnQ0FBZ0MsRUFBRTs7QUFFMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwyQkFBMEIsb0RBQW9ELEVBQUU7QUFDaEYscUJBQW9CLHNCQUFzQixFQUFFO0FBQzVDLHFCQUFvQixvREFBb0QsRUFBRTs7QUFFMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQSxNQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQy9GQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSwyQkFBMEIsOEJBQThCOztBQUV4RDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLDBCQUF5QixVQUFVLEVBQUU7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBLHVDQUFzQyxtQ0FBbUM7O0FBRXpFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsSUFBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMEIsYUFBYSxFQUFFOztBQUV6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QTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDOUVBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CLGFBQVksT0FBTztBQUNuQixhQUFZLE9BQU87QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx5QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGYxNDc0MmE2Mjk0ZGI3Zjc5YTg5XG4gKiovIiwiLyoqXG4gKiBDaGFydCBUb29sXG4gKiBAYXV0aG9yIEplcmVteSBBZ2l1cyA8amFnaXVzQGdsb2JlYW5kbWFpbC5jb20+XG4gKiBAYXV0aG9yIFRvbSBDYXJkb3NvIDx0Y2FyZG9zb0BnbG9iZWFuZG1haWwuY29tPlxuICogQGF1dGhvciBNaWNoYWVsIFBlcmVpcmEgPG1wZXJlaXJhQGdsb2JlYW5kbWFpbC5jb20+XG4gKiBAc2VlIHtAbGlua30gZm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24uXG4gKiBAc2VlIHtAbGluayBodHRwOi8vd3d3LmdpdGh1Yi5jb20vZ2xvYmVhbmRtYWlsL2NoYXJ0LXRvb2x8Q2hhcnQgVG9vbH1cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbiBDaGFydFRvb2xJbml0KHJvb3QpIHtcblxuICBpZiAocm9vdC5kMykge1xuXG4gICAgdmFyIENoYXJ0VG9vbCA9IChmdW5jdGlvbiBDaGFydFRvb2woKSB7XG5cbiAgICAgIHZhciBjaGFydHMgPSByb290Ll9fY2hhcnR0b29sIHx8IFtdLFxuICAgICAgICAgIGRpc3BhdGNoRnVuY3Rpb25zID0gcm9vdC5fX2NoYXJ0dG9vbGRpc3BhdGNoZXIgfHwgW10sXG4gICAgICAgICAgZHJhd24gPSBbXTtcblxuICAgICAgdmFyIHNldHRpbmdzID0gcmVxdWlyZShcIi4vY29uZmlnL2NoYXJ0LXNldHRpbmdzXCIpLFxuICAgICAgICAgIHV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvdXRpbHNcIik7XG5cbiAgICAgIHZhciBkaXNwYXRjaGVyID0gZDMuZGlzcGF0Y2goXCJzdGFydFwiLCBcImZpbmlzaFwiLCBcInJlZHJhd1wiLCBcIm1vdXNlT3ZlclwiLCBcIm1vdXNlTW92ZVwiLCBcIm1vdXNlT3V0XCIsIFwiY2xpY2tcIik7XG5cbiAgICAgIGZvciAodmFyIHByb3AgaW4gZGlzcGF0Y2hGdW5jdGlvbnMpIHtcbiAgICAgICAgaWYgKGRpc3BhdGNoRnVuY3Rpb25zLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgaWYgKGQzLmtleXMoZGlzcGF0Y2hlcikuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgICAgICBkaXNwYXRjaGVyLm9uKHByb3AsIGRpc3BhdGNoRnVuY3Rpb25zW3Byb3BdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgXCJDaGFydCBUb29sIGRvZXMgbm90IG9mZmVyIGEgZGlzcGF0Y2hlciBvZiB0eXBlICdcIiArIHByb3AgKyBcIicuIEZvciBhdmFpbGFibGUgZGlzcGF0Y2hlciB0eXBlcywgcGxlYXNlIHNlZSB0aGUgQ2hhcnRUb29sLmRpc3BhdGNoKCkgbWV0aG9kLlwiIDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDbGVhcnMgcHJldmlvdXMgaXRlcmF0aW9ucyBvZiBjaGFydCBvYmplY3RzIHN0b3JlZCBpbiBvYmogb3IgdGhlIGRyYXduIGFycmF5LCB0aGVuIHB1bnRzIGNoYXJ0IGNvbnN0cnVjdGlvbiB0byB0aGUgQ2hhcnQgTWFuYWdlci5cbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gY29udGFpbmVyIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29udGFpbmVyJ3Mgc2VsZWN0b3IuXG4gICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgICAgICBUaGUgY2hhcnQgSUQgYW5kIGVtYmVkIGRhdGEuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNoYXJ0KGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgICAgICAgZGlzcGF0Y2hlci5zdGFydChvYmopO1xuXG4gICAgICAgIGRyYXduID0gdXRpbHMuY2xlYXJEcmF3bihkcmF3biwgb2JqKTtcbiAgICAgICAgb2JqID0gdXRpbHMuY2xlYXJPYmoob2JqKTtcbiAgICAgICAgY29udGFpbmVyID0gdXRpbHMuY2xlYXJDaGFydChjb250YWluZXIpO1xuXG4gICAgICAgIHZhciBDaGFydE1hbmFnZXIgPSByZXF1aXJlKFwiLi9jaGFydHMvbWFuYWdlclwiKTtcblxuICAgICAgICBvYmouZGF0YS53aWR0aCA9IHV0aWxzLmdldEJvdW5kaW5nKGNvbnRhaW5lciwgXCJ3aWR0aFwiKTtcbiAgICAgICAgb2JqLmRpc3BhdGNoID0gZGlzcGF0Y2hlcjtcblxuICAgICAgICB2YXIgY2hhcnRPYmo7XG5cbiAgICAgICAgaWYgKHV0aWxzLnN2Z1Rlc3Qocm9vdCkpIHtcbiAgICAgICAgICBjaGFydE9iaiA9IENoYXJ0TWFuYWdlcihjb250YWluZXIsIG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXRpbHMuZ2VuZXJhdGVUaHVtYihjb250YWluZXIsIG9iaiwgc2V0dGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJhd24ucHVzaCh7IGlkOiBvYmouaWQsIGNoYXJ0T2JqOiBjaGFydE9iaiB9KTtcbiAgICAgICAgb2JqLmNoYXJ0T2JqID0gY2hhcnRPYmo7XG5cbiAgICAgICAgZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHsgZGlzcGF0Y2hlci5jbGljayh0aGlzLCBjaGFydE9iaik7IH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLm1vdXNlT3Zlcih0aGlzLCBjaGFydE9iaik7IH0pXG4gICAgICAgICAgLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLm1vdXNlTW92ZSh0aGlzLCBjaGFydE9iaik7ICB9KVxuICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLm1vdXNlT3V0KHRoaXMsIGNoYXJ0T2JqKTsgfSk7XG5cbiAgICAgICAgZGlzcGF0Y2hlci5maW5pc2goY2hhcnRPYmopO1xuXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogR3JhYnMgZGF0YSBvbiBhIGNoYXJ0IGJhc2VkIG9uIGFuIElELlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gY2hhcnRzIEFycmF5IG9mIGNoYXJ0cyBvbiB0aGUgcGFnZS5cbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgVGhlIElEIGZvciB0aGUgY2hhcnQuXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgIFJldHVybnMgc3RvcmVkIGVtYmVkIG9iamVjdC5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVhZENoYXJ0KGlkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgIGlmIChjaGFydHNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hhcnRzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBMaXN0IGFsbCB0aGUgY2hhcnRzIHN0b3JlZCBpbiB0aGUgQ2hhcnQgVG9vbCBieSBjaGFydGlkLlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gY2hhcnRzIEFycmF5IG9mIGNoYXJ0cyBvbiB0aGUgcGFnZS5cbiAgICAgICAqIEByZXR1cm4ge0FycmF5fSAgICAgICBMaXN0IG9mIGNoYXJ0aWQncy5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gbGlzdENoYXJ0cyhjaGFydHMpIHtcbiAgICAgICAgdmFyIGNoYXJ0c0FyciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNoYXJ0c0Fyci5wdXNoKGNoYXJ0c1tpXS5pZCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjaGFydHNBcnI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KGlkLCBvYmopIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICcuJyArIHNldHRpbmdzLmJhc2VDbGFzcygpICsgJ1tkYXRhLWNoYXJ0aWQ9JyArIHNldHRpbmdzLnByZWZpeCArIGlkICsgJ10nO1xuICAgICAgICBjcmVhdGVDaGFydChjb250YWluZXIsIHsgaWQ6IGlkLCBkYXRhOiBvYmogfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lDaGFydChpZCkge1xuICAgICAgICB2YXIgY29udGFpbmVyLCBvYmo7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNoYXJ0c1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgIG9iaiA9IGNoYXJ0c1tpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnRhaW5lciA9ICcuJyArIHNldHRpbmdzLmJhc2VDbGFzcygpICsgJ1tkYXRhLWNoYXJ0aWQ9JyArIG9iai5pZCArICddJztcbiAgICAgICAgdXRpbHMuY2xlYXJEcmF3bihkcmF3biwgb2JqKTtcbiAgICAgICAgdXRpbHMuY2xlYXJPYmoob2JqKTtcbiAgICAgICAgdXRpbHMuY2xlYXJDaGFydChjb250YWluZXIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIGNoYXJ0cywgZHJhdyBlYWNoIGNoYXJ0IGludG8gaXRzIHJlc3BlY3RpdmUgY29udGFpbmVyLlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gY2hhcnRzIEFycmF5IG9mIGNoYXJ0cyBvbiB0aGUgcGFnZS5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gY3JlYXRlTG9vcChjaGFydHMpIHtcbiAgICAgICAgdmFyIGNoYXJ0TGlzdCA9IGxpc3RDaGFydHMoY2hhcnRzKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFydExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgb2JqID0gcmVhZENoYXJ0KGNoYXJ0TGlzdFtpXSk7XG4gICAgICAgICAgdmFyIGNvbnRhaW5lciA9ICcuJyArIHNldHRpbmdzLmJhc2VDbGFzcygpICsgJ1tkYXRhLWNoYXJ0aWQ9JyArIGNoYXJ0TGlzdFtpXSArICddJztcbiAgICAgICAgICBjcmVhdGVDaGFydChjb250YWluZXIsIG9iaik7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2hhcnQgVG9vbCBpbml0aWFsaXplciB3aGljaCBzZXRzIHVwIGRlYm91bmNpbmcgYW5kIHJ1bnMgdGhlIGNyZWF0ZUxvb3AoKS4gUnVuIG9ubHkgb25jZSwgd2hlbiB0aGUgbGlicmFyeSBpcyBmaXJzdCBsb2FkZWQuXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBjaGFydHMgQXJyYXkgb2YgY2hhcnRzIG9uIHRoZSBwYWdlLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBpbml0aWFsaXplcihjaGFydHMpIHtcbiAgICAgICAgY3JlYXRlTG9vcChjaGFydHMpO1xuICAgICAgICB2YXIgZGVib3VuY2UgPSB1dGlscy5kZWJvdW5jZShjcmVhdGVMb29wLCBjaGFydHMsIHNldHRpbmdzLmRlYm91bmNlLCByb290KTtcbiAgICAgICAgZDMuc2VsZWN0KHJvb3QpXG4gICAgICAgICAgLm9uKCdyZXNpemUuJyArIHNldHRpbmdzLnByZWZpeCArICdkZWJvdW5jZScsIGRlYm91bmNlKVxuICAgICAgICAgIC5vbigncmVzaXplLicgKyBzZXR0aW5ncy5wcmVmaXggKyAncmVkcmF3JywgZGlzcGF0Y2hlci5yZWRyYXcoY2hhcnRzKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZXIoY2hhcnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZShjb250YWluZXIsIG9iaikge1xuICAgICAgICAgIHJldHVybiBjcmVhdGVDaGFydChjb250YWluZXIsIG9iaik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChpZCkge1xuICAgICAgICAgIHJldHVybiByZWFkQ2hhcnQoaWQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxpc3Q6IGZ1bmN0aW9uIGxpc3QoKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RDaGFydHMoY2hhcnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShpZCwgb2JqKSB7XG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZUNoYXJ0KGlkLCBvYmopO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgICAgICByZXR1cm4gZGVzdHJveUNoYXJ0KGlkKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkaXNwYXRjaDogZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gICAgICAgICAgcmV0dXJuIGQzLmtleXMoZGlzcGF0Y2hlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2F0OiBmdW5jdGlvbiB3YXQoKSB7XG4gICAgICAgICAgY29uc29sZS5pbmZvKFwiQ2hhcnRUb29sIHZcIiArIHNldHRpbmdzLnZlcnNpb24gKyBcIiBpcyBhIGZyZWUsIG9wZW4tc291cmNlIGNoYXJ0IGdlbmVyYXRvciBhbmQgZnJvbnQtZW5kIGxpYnJhcnkgbWFpbnRhaW5lZCBieSBUaGUgR2xvYmUgYW5kIE1haWwuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBjaGVjayBvdXQgb3VyIEdpdEh1YiByZXBvOiB3d3cuZ2l0aHViLmNvbS9nbG9iZWFuZG1haWwvY2hhcnQtdG9vbFwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICB2ZXJzaW9uOiBzZXR0aW5ncy52ZXJzaW9uLFxuICAgICAgICBidWlsZDogc2V0dGluZ3MuYnVpbGQsXG4gICAgICAgIHNldHRpbmdzOiByZXF1aXJlKFwiLi9jb25maWcvY2hhcnQtc2V0dGluZ3NcIiksXG4gICAgICAgIGNoYXJ0czogcmVxdWlyZShcIi4vY2hhcnRzL21hbmFnZXJcIiksXG4gICAgICAgIGNvbXBvbmVudHM6IHJlcXVpcmUoXCIuL2NoYXJ0cy9jb21wb25lbnRzL2NvbXBvbmVudHNcIiksXG4gICAgICAgIGhlbHBlcnM6IHJlcXVpcmUoXCIuL2hlbHBlcnMvaGVscGVyc1wiKSxcbiAgICAgICAgdXRpbHM6IHJlcXVpcmUoXCIuL3V0aWxzL3V0aWxzXCIpLFxuICAgICAgICBsaW5lOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvbGluZVwiKSxcbiAgICAgICAgYXJlYTogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL2FyZWFcIiksXG4gICAgICAgIG11bHRpbGluZTogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL211bHRpbGluZVwiKSxcbiAgICAgICAgc3RhY2tlZEFyZWE6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9zdGFja2VkLWFyZWFcIiksXG4gICAgICAgIGNvbHVtbjogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL2NvbHVtblwiKSxcbiAgICAgICAgc3RhY2tlZENvbHVtbjogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL3N0YWNrZWQtY29sdW1uXCIpLFxuICAgICAgICBzdHJlYW1ncmFwaDogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL3N0cmVhbWdyYXBoXCIpLFxuICAgICAgICBiYXI6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9iYXJcIilcblxuICAgICAgfVxuXG4gICAgfSkoKTtcblxuICAgIGlmICghcm9vdC5NZXRlb3IpIHsgQ2hhcnRUb29sLmluaXQoKTsgfVxuXG4gIH0gZWxzZSB7XG5cbiAgICB2YXIgTWV0ZW9yID0gdGhpcy5NZXRlb3IgfHwge30sXG4gICAgICAgIGlzU2VydmVyID0gTWV0ZW9yLmlzU2VydmVyIHx8IHVuZGVmaW5lZDtcblxuICAgIGlmICghaXNTZXJ2ZXIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDaGFydCBUb29sOiBubyBEMyBsaWJyYXJ5IGRldGVjdGVkLlwiKTtcbiAgICB9XG5cblxuICB9XG5cbiAgcm9vdC5DaGFydFRvb2wgPSBDaGFydFRvb2w7XG5cbn0pKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB0aGlzKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgdmVyc2lvbiA9IHtcbiAgdmVyc2lvbjogcmVxdWlyZShcImpzb24hLi4vLi4vLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb24sXG4gIGJ1aWxkOiByZXF1aXJlKFwianNvbiEuLi8uLi8uLi9wYWNrYWdlLmpzb25cIikuYnVpbGR2ZXJcbn07XG5cbnZhciBzZXR0aW5ncyA9IHJlcXVpcmUoXCJqc29uIS4uLy4uLy4uL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBDVVNUT006IHNldHRpbmdzLkNVU1RPTSxcbiAgdmVyc2lvbjogdmVyc2lvbi52ZXJzaW9uLFxuICBidWlsZDogdmVyc2lvbi5idWlsZCxcbiAgaWQ6IFwiXCIsXG4gIGRhdGE6IFwiXCIsXG4gIGRhdGVGb3JtYXQ6IHNldHRpbmdzLmRhdGVGb3JtYXQsXG4gIHRpbWVGb3JtYXQ6IHNldHRpbmdzLnRpbWVGb3JtYXQsXG4gIGltYWdlOiBzZXR0aW5ncy5pbWFnZSxcbiAgaGVhZGluZzogXCJcIixcbiAgcXVhbGlmaWVyOiBcIlwiLFxuICBzb3VyY2U6IFwiXCIsXG4gIGRlY2s6IFwiXCIsXG4gIGluZGV4OiBcIlwiLFxuICBoYXNIb3VyczogZmFsc2UsXG4gIHNvY2lhbDogc2V0dGluZ3Muc29jaWFsLFxuICBzZXJpZXNIaWdobGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmRhdGEuc2VyaWVzQW1vdW50ICYmIHRoaXMuZGF0YS5zZXJpZXNBbW91bnQgPD0gMSkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfSxcbiAgYmFzZUNsYXNzOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMucHJlZml4ICsgXCJjaGFydFwiOyB9LFxuICBjdXN0b21DbGFzczogXCJcIixcblxuICBvcHRpb25zOiB7XG4gICAgdHlwZTogXCJsaW5lXCIsXG4gICAgaW50ZXJwb2xhdGlvbjogXCJsaW5lYXJcIixcbiAgICBzdGFja2VkOiBmYWxzZSxcbiAgICBleHBhbmRlZDogZmFsc2UsXG4gICAgaGVhZDogdHJ1ZSxcbiAgICBkZWNrOiBmYWxzZSxcbiAgICBxdWFsaWZpZXI6IHRydWUsXG4gICAgbGVnZW5kOiB0cnVlLFxuICAgIGZvb3RlcjogdHJ1ZSxcbiAgICB4X2F4aXM6IHRydWUsXG4gICAgeV9heGlzOiB0cnVlLFxuICAgIHRpcHM6IGZhbHNlLFxuICAgIGFubm90YXRpb25zOiBmYWxzZSxcbiAgICByYW5nZTogZmFsc2UsXG4gICAgc2VyaWVzOiBmYWxzZSxcbiAgICBzaGFyZV9kYXRhOiB0cnVlLFxuICAgIHNvY2lhbDogdHJ1ZVxuICB9LFxuXG4gIHJhbmdlOiB7fSxcbiAgc2VyaWVzOiB7fSxcbiAgeEF4aXM6IHNldHRpbmdzLnhBeGlzLFxuICB5QXhpczogc2V0dGluZ3MueUF4aXMsXG5cbiAgZXhwb3J0YWJsZTogZmFsc2UsIC8vIHRoaXMgY2FuIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBiYWNrZW5kIGFzIG5lZWRlZFxuICBlZGl0YWJsZTogZmFsc2UsXG5cbiAgcHJlZml4OiBzZXR0aW5ncy5wcmVmaXgsXG4gIGRlYm91bmNlOiBzZXR0aW5ncy5kZWJvdW5jZSxcbiAgdGlwVGltZW91dDogc2V0dGluZ3MudGlwVGltZW91dCxcbiAgbW9udGhzQWJyOiBzZXR0aW5ncy5tb250aHNBYnIsXG5cbiAgZGltZW5zaW9uczoge1xuICAgIHdpZHRoOiAwLFxuICAgIGNvbXB1dGVkV2lkdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHQ7XG4gICAgfSxcbiAgICBoZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJhdGlvU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMzAwLCA5MDBdKS5kb21haW4oW3RoaXMud2lkdGggKiB0aGlzLnJhdGlvTW9iaWxlLCB0aGlzLndpZHRoICogdGhpcy5yYXRpb0Rlc2t0b3BdKTtcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKHJhdGlvU2NhbGUodGhpcy53aWR0aCkpO1xuICAgIH0sXG4gICAgY29tcHV0ZWRIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICh0aGlzLmhlaWdodCgpIC0gdGhpcy5oZWFkZXJIZWlnaHQgLSB0aGlzLmZvb3RlckhlaWdodCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbSk7XG4gICAgfSxcbiAgICByYXRpb01vYmlsZTogc2V0dGluZ3MucmF0aW9Nb2JpbGUsXG4gICAgcmF0aW9EZXNrdG9wOiBzZXR0aW5ncy5yYXRpb0Rlc2t0b3AsXG4gICAgbWFyZ2luOiBzZXR0aW5ncy5tYXJnaW4sXG4gICAgdGlwUGFkZGluZzogc2V0dGluZ3MudGlwUGFkZGluZyxcbiAgICB0aXBPZmZzZXQ6IHNldHRpbmdzLnRpcE9mZnNldCxcbiAgICBoZWFkZXJIZWlnaHQ6IDAsXG4gICAgZm9vdGVySGVpZ2h0OiAwLFxuICAgIHhBeGlzSGVpZ2h0OiAwLFxuICAgIHlBeGlzSGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAodGhpcy5jb21wdXRlZEhlaWdodCgpIC0gdGhpcy54QXhpc0hlaWdodCk7XG4gICAgfSxcbiAgICB4QXhpc1dpZHRoOiAwLFxuICAgIGxhYmVsV2lkdGg6IDAsXG4gICAgeUF4aXNQYWRkaW5nUmlnaHQ6IHNldHRpbmdzLnlBeGlzLnBhZGRpbmdSaWdodCxcbiAgICB0aWNrV2lkdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICh0aGlzLmNvbXB1dGVkV2lkdGgoKSAtICh0aGlzLmxhYmVsV2lkdGggKyB0aGlzLnlBeGlzUGFkZGluZ1JpZ2h0KSk7XG4gICAgfSxcbiAgICBiYXJIZWlnaHQ6IHNldHRpbmdzLmJhckhlaWdodCxcbiAgICBiYW5kczoge1xuICAgICAgcGFkZGluZzogc2V0dGluZ3MuYmFuZHMucGFkZGluZyxcbiAgICAgIG9mZnNldDogc2V0dGluZ3MuYmFuZHMub2Zmc2V0LFxuICAgICAgb3V0ZXJQYWRkaW5nOiBzZXR0aW5ncy5iYW5kcy5vdXRlclBhZGRpbmdcbiAgICB9XG4gIH1cblxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY29uZmlnL2NoYXJ0LXNldHRpbmdzLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwibmFtZVwiOiBcImNoYXJ0LXRvb2xcIixcblx0XCJ2ZXJzaW9uXCI6IFwiMS4xLjBcIixcblx0XCJidWlsZFZlclwiOiBcIjBcIixcblx0XCJkZXNjcmlwdGlvblwiOiBcIkEgcmVzcG9uc2l2ZSBjaGFydGluZyBhcHBsaWNhdGlvblwiLFxuXHRcIm1haW5cIjogXCJndWxwZmlsZS5qc1wiLFxuXHRcImRlcGVuZGVuY2llc1wiOiB7fSxcblx0XCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiYnJvd3Nlci1zeW5jXCI6IFwiXjIuOC4wXCIsXG5cdFx0XCJndWxwXCI6IFwiXjMuOC4xMVwiLFxuXHRcdFwiZ3VscC1jbGVhblwiOiBcIl4wLjMuMVwiLFxuXHRcdFwiZ3VscC1qc29uLWVkaXRvclwiOiBcIl4yLjIuMVwiLFxuXHRcdFwiZ3VscC1taW5pZnktY3NzXCI6IFwiXjEuMi4wXCIsXG5cdFx0XCJndWxwLXJlbmFtZVwiOiBcIl4xLjIuMlwiLFxuXHRcdFwiZ3VscC1yZXBsYWNlXCI6IFwiXjAuNS4zXCIsXG5cdFx0XCJndWxwLXNhc3NcIjogXCJeMi4wLjRcIixcblx0XHRcImd1bHAtc2hlbGxcIjogXCJeMC40LjJcIixcblx0XHRcImd1bHAtc291cmNlbWFwc1wiOiBcIl4xLjUuMlwiLFxuXHRcdFwiZ3VscC11dGlsXCI6IFwiXjMuMC42XCIsXG5cdFx0XCJqc2RvY1wiOiBcIl4zLjMuMlwiLFxuXHRcdFwianNvbi1sb2FkZXJcIjogXCJeMC41LjNcIixcblx0XHRcInJ1bi1zZXF1ZW5jZVwiOiBcIl4xLjEuNFwiLFxuXHRcdFwid2VicGFja1wiOiBcIl4xLjEyLjE0XCIsXG5cdFx0XCJ3ZWJwYWNrLXN0cmVhbVwiOiBcIl4zLjEuMFwiLFxuXHRcdFwieWFyZ3NcIjogXCJeMy4xNS4wXCJcblx0fSxcblx0XCJzY3JpcHRzXCI6IHtcblx0XHRcInRlc3RcIjogXCJcIlxuXHR9LFxuXHRcImtleXdvcmRzXCI6IFtcblx0XHRcImNoYXJ0c1wiLFxuXHRcdFwiZDNcIixcblx0XHRcImQzanNcIixcblx0XHRcIm1ldGVvclwiLFxuXHRcdFwiZ3VscFwiLFxuXHRcdFwid2VicGFja1wiLFxuXHRcdFwiZGF0YSB2aXN1YWxpemF0aW9uXCIsXG5cdFx0XCJjaGFydFwiLFxuXHRcdFwibW9uZ29cIlxuXHRdLFxuXHRcInJlcG9zaXRvcnlcIjoge1xuXHRcdFwidHlwZVwiOiBcImdpdFwiLFxuXHRcdFwidXJsXCI6IFwiZ2l0QGdpdGh1Yi5jb206Z2xvYmVhbmRtYWlsL2NoYXJ0LXRvb2wuZ2l0XCJcblx0fSxcblx0XCJjb250cmlidXRvcnNcIjogW1xuXHRcdHtcblx0XHRcdFwiYXV0aG9yXCI6IFwiVG9tIENhcmRvc29cIixcblx0XHRcdFwiZW1haWxcIjogXCJ0Y2FyZG9zb0BnbG9iZWFuZG1haWwuY29tXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwiYXV0aG9yXCI6IFwiSmVyZW15IEFnaXVzXCIsXG5cdFx0XHRcImVtYWlsXCI6IFwiamFnaXVzQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJNaWNoYWVsIFBlcmVpcmFcIixcblx0XHRcdFwiZW1haWxcIjogXCJtcGVyZWlyYUBnbG9iZWFuZG1haWwuY29tXCJcblx0XHR9XG5cdF0sXG5cdFwibGljZW5zZVwiOiBcIk1JVFwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcGFja2FnZS5qc29uXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJDVVNUT01cIjogZmFsc2UsXG5cdFwicHJlZml4XCI6IFwiY3QtXCIsXG5cdFwibW9udGhzQWJyXCI6IFtcblx0XHRcIkphbi5cIixcblx0XHRcIkZlYi5cIixcblx0XHRcIk1hci5cIixcblx0XHRcIkFwci5cIixcblx0XHRcIk1heVwiLFxuXHRcdFwiSnVuZVwiLFxuXHRcdFwiSnVseVwiLFxuXHRcdFwiQXVnLlwiLFxuXHRcdFwiU2VwdC5cIixcblx0XHRcIk9jdC5cIixcblx0XHRcIk5vdi5cIixcblx0XHRcIkRlYy5cIixcblx0XHRcIkphbi5cIlxuXHRdLFxuXHRcImRlYm91bmNlXCI6IDUwMCxcblx0XCJ0aXBUaW1lb3V0XCI6IDUwMDAsXG5cdFwicmF0aW9Nb2JpbGVcIjogMS4xNSxcblx0XCJyYXRpb0Rlc2t0b3BcIjogMC42NSxcblx0XCJkYXRlRm9ybWF0XCI6IFwiJVktJW0tJWRcIixcblx0XCJ0aW1lRm9ybWF0XCI6IFwiJUg6JU1cIixcblx0XCJtYXJnaW5cIjoge1xuXHRcdFwidG9wXCI6IDEwLFxuXHRcdFwicmlnaHRcIjogMyxcblx0XHRcImJvdHRvbVwiOiAwLFxuXHRcdFwibGVmdFwiOiAwXG5cdH0sXG5cdFwidGlwT2Zmc2V0XCI6IHtcblx0XHRcInZlcnRpY2FsXCI6IDQsXG5cdFx0XCJob3Jpem9udGFsXCI6IDFcblx0fSxcblx0XCJ0aXBQYWRkaW5nXCI6IHtcblx0XHRcInRvcFwiOiA0LFxuXHRcdFwicmlnaHRcIjogOSxcblx0XHRcImJvdHRvbVwiOiA0LFxuXHRcdFwibGVmdFwiOiA5XG5cdH0sXG5cdFwieUF4aXNcIjoge1xuXHRcdFwiZGlzcGxheVwiOiB0cnVlLFxuXHRcdFwic2NhbGVcIjogXCJsaW5lYXJcIixcblx0XHRcInRpY2tzXCI6IFwiYXV0b1wiLFxuXHRcdFwib3JpZW50XCI6IFwicmlnaHRcIixcblx0XHRcImZvcm1hdFwiOiBcImNvbW1hXCIsXG5cdFx0XCJwcmVmaXhcIjogXCJcIixcblx0XHRcInN1ZmZpeFwiOiBcIlwiLFxuXHRcdFwibWluXCI6IFwiXCIsXG5cdFx0XCJtYXhcIjogXCJcIixcblx0XHRcInJlc2NhbGVcIjogZmFsc2UsXG5cdFx0XCJuaWNlXCI6IHRydWUsXG5cdFx0XCJwYWRkaW5nUmlnaHRcIjogOSxcblx0XHRcInRpY2tMb3dlckJvdW5kXCI6IDMsXG5cdFx0XCJ0aWNrVXBwZXJCb3VuZFwiOiA4LFxuXHRcdFwidGlja0dvYWxcIjogNSxcblx0XHRcIndpZHRoVGhyZXNob2xkXCI6IDQyMCxcblx0XHRcImR5XCI6IFwiXCIsXG5cdFx0XCJ0ZXh0WFwiOiAwLFxuXHRcdFwidGV4dFlcIjogXCJcIlxuXHR9LFxuXHRcInhBeGlzXCI6IHtcblx0XHRcImRpc3BsYXlcIjogdHJ1ZSxcblx0XHRcInNjYWxlXCI6IFwidGltZVwiLFxuXHRcdFwidGlja3NcIjogXCJhdXRvXCIsXG5cdFx0XCJvcmllbnRcIjogXCJib3R0b21cIixcblx0XHRcImZvcm1hdFwiOiBcImF1dG9cIixcblx0XHRcInByZWZpeFwiOiBcIlwiLFxuXHRcdFwic3VmZml4XCI6IFwiXCIsXG5cdFx0XCJtaW5cIjogXCJcIixcblx0XHRcIm1heFwiOiBcIlwiLFxuXHRcdFwicmVzY2FsZVwiOiBmYWxzZSxcblx0XHRcIm5pY2VcIjogZmFsc2UsXG5cdFx0XCJyYW5nZVBvaW50c1wiOiAxLFxuXHRcdFwidGlja1RhcmdldFwiOiA2LFxuXHRcdFwidGlja3NTbWFsbFwiOiA0LFxuXHRcdFwid2lkdGhUaHJlc2hvbGRcIjogNDIwLFxuXHRcdFwiZHlcIjogMC43LFxuXHRcdFwidXBwZXJcIjoge1xuXHRcdFx0XCJ0aWNrSGVpZ2h0XCI6IDcsXG5cdFx0XHRcInRleHRYXCI6IDYsXG5cdFx0XHRcInRleHRZXCI6IDdcblx0XHR9LFxuXHRcdFwibG93ZXJcIjoge1xuXHRcdFx0XCJ0aWNrSGVpZ2h0XCI6IDEyLFxuXHRcdFx0XCJ0ZXh0WFwiOiA2LFxuXHRcdFx0XCJ0ZXh0WVwiOiAyXG5cdFx0fVxuXHR9LFxuXHRcImJhckhlaWdodFwiOiAzMCxcblx0XCJiYW5kc1wiOiB7XG5cdFx0XCJwYWRkaW5nXCI6IDAuMDYsXG5cdFx0XCJvZmZzZXRcIjogMC4xMixcblx0XHRcIm91dGVyUGFkZGluZ1wiOiAwLjAzXG5cdH0sXG5cdFwic291cmNlXCI6IHtcblx0XHRcInByZWZpeFwiOiBcIkNIQVJUIFRPT0xcIixcblx0XHRcInN1ZmZpeFwiOiBcIiDCuyBTT1VSQ0U6XCJcblx0fSxcblx0XCJzb2NpYWxcIjoge1xuXHRcdFwiZmFjZWJvb2tcIjoge1xuXHRcdFx0XCJsYWJlbFwiOiBcIkZhY2Vib29rXCIsXG5cdFx0XHRcImljb25cIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb3VuZGljb25zLzMuMC4wL3N2Z3MvZmktc29jaWFsLWZhY2Vib29rLnN2Z1wiLFxuXHRcdFx0XCJyZWRpcmVjdFwiOiBcIlwiLFxuXHRcdFx0XCJhcHBJRFwiOiBcIlwiXG5cdFx0fSxcblx0XHRcInR3aXR0ZXJcIjoge1xuXHRcdFx0XCJsYWJlbFwiOiBcIlR3aXR0ZXJcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1zb2NpYWwtdHdpdHRlci5zdmdcIixcblx0XHRcdFwidmlhXCI6IFwiXCIsXG5cdFx0XHRcImhhc2h0YWdcIjogXCJcIlxuXHRcdH0sXG5cdFx0XCJlbWFpbFwiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiRW1haWxcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1tYWlsLnN2Z1wiXG5cdFx0fSxcblx0XHRcInNtc1wiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiU01TXCIsXG5cdFx0XHRcImljb25cIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb3VuZGljb25zLzMuMC4wL3N2Z3MvZmktdGVsZXBob25lLnN2Z1wiXG5cdFx0fVxuXHR9LFxuXHRcImltYWdlXCI6IHtcblx0XHRcImVuYWJsZVwiOiBmYWxzZSxcblx0XHRcImJhc2VfcGF0aFwiOiBcIlwiLFxuXHRcdFwiZXhwaXJhdGlvblwiOiAzMDAwMCxcblx0XHRcImZpbGVuYW1lXCI6IFwidGh1bWJuYWlsXCIsXG5cdFx0XCJleHRlbnNpb25cIjogXCJwbmdcIixcblx0XHRcInRodW1ibmFpbFdpZHRoXCI6IDQ2MFxuXHR9XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vY3VzdG9tL2NoYXJ0LXRvb2wtY29uZmlnLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsIi8qKlxuICogVXRpbGl0aWVzIG1vZHVsZS4gRnVuY3Rpb25zIHRoYXQgYXJlbid0IHNwZWNpZmljIHRvIGFueSBvbmUgbW9kdWxlLlxuICogQG1vZHVsZSB1dGlscy91dGlsc1xuICovXG5cbi8qKlxuICogR2l2ZW4gYSBmdW5jdGlvbiB0byBwZXJmb3JtLCBhIHRpbWVvdXQgcGVyaW9kLCBhIHBhcmFtZXRlciB0byBwYXNzIHRvIHRoZSBwZXJmb3JtZWQgZnVuY3Rpb24sIGFuZCBhIHJlZmVyZW5jZSB0byB0aGUgd2luZG93LCBmaXJlIGEgc3BlY2lmaWMgZnVuY3Rpb24uXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICAgICBGdW5jdGlvbiB0byBwZXJmb3JtIG9uIGRlYm91bmNlLlxuICogQHBhcmFtICB7T2JqZWN0fSBvYmogICAgICBPYmplY3QgcGFzc2VkIHRvIEZ1bmN0aW9uIHdoaWNoIGlzIHBlcmZvcm1lZCBvbiBkZWJvdW5jZS5cbiAqIEBwYXJhbSAge0ludGVnZXJ9ICAgdGltZW91dCBUaW1lb3V0IHBlcmlvZCBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgcm9vdCAgICBXaW5kb3cgb2JqZWN0LlxuICogQHJldHVybiB7RnVuY3Rpb259ICAgICAgICAgICBGaW5hbCBkZWJvdW5jZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZm4sIG9iaiwgdGltZW91dCwgcm9vdCkge1xuICB2YXIgdGltZW91dElEID0gLTE7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGltZW91dElEID4gLTEpIHsgcm9vdC5jbGVhclRpbWVvdXQodGltZW91dElEKTsgfVxuICAgIHRpbWVvdXRJRCA9IHJvb3Quc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgZm4ob2JqKVxuICAgIH0sIHRpbWVvdXQpO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbW92ZSBjaGFydCBTVkcgYW5kIGRpdnMgaW5zaWRlIGEgY29udGFpbmVyIGZyb20gdGhlIERPTS5cbiAqIEBwYXJhbSAge1N0cmluZ30gY29udGFpbmVyXG4gKi9cbmZ1bmN0aW9uIGNsZWFyQ2hhcnQoY29udGFpbmVyKSB7XG5cbiAgdmFyIGNvbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XG5cbiAgd2hpbGUgKGNvbnQgJiYgY29udC5xdWVyeVNlbGVjdG9yQWxsKFwic3ZnXCIpLmxlbmd0aCkge1xuICAgIHZhciBzdmcgPSBjb250LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzdmdcIik7XG4gICAgc3ZnW3N2Zy5sZW5ndGggLSAxXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN2Z1tzdmcubGVuZ3RoIC0gMV0pO1xuICB9XG5cbiAgd2hpbGUgKGNvbnQgJiYgY29udC5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLmxlbmd0aCkge1xuICAgIHZhciBkaXYgPSBjb250LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIik7XG4gICAgZGl2W2Rpdi5sZW5ndGggLSAxXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdltkaXYubGVuZ3RoIC0gMV0pO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuLyoqXG4gKiBDbGVhcnMgdGhlIGNoYXJ0IGRhdGEgb2YgaXRzIHBvc3QtcmVuZGVyIGNoYXJ0T2JqIG9iamVjdC5cbiAqIEBwYXJhbSAge09iamVjdH0gb2JqIE9iamVjdCB1c2VkIHRvIGNvbnN0cnVjdCBjaGFydHMuXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICBUaGUgbmV3IHZlcnNpb24gb2YgdGhlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xlYXJPYmoob2JqKSB7XG4gIGlmIChvYmouY2hhcnRPYmopIHsgb2JqLmNoYXJ0T2JqID0gdW5kZWZpbmVkOyB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogQ2xlYXJzIHRoZSBkcmF3biBhcnJheS5cbiAqIEBwYXJhbSAge0FycmF5fSBkcmF3blxuICogQHBhcmFtICB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBjbGVhckRyYXduKGRyYXduLCBvYmopIHtcbiAgaWYgKGRyYXduLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSBkcmF3bi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKGRyYXduW2ldLmlkID09PSBvYmouaWQpIHtcbiAgICAgICAgZHJhd24uc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gZHJhd247XG59XG5cbi8qKlxuICogR2V0IHRoZSBib3VuZGluZ0NsaWVudFJlY3QgZGltZW5zaW9ucyBnaXZlbiBhIHNlbGVjdG9yLlxuICogQHBhcmFtICB7U3RyaW5nfSBjb250YWluZXJcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgIFRoZSBib3VuZGluZ0NsaWVudFJlY3Qgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBnZXRCb3VuZGluZyhzZWxlY3RvciwgZGltZW5zaW9uKSB7XG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVtkaW1lbnNpb25dO1xufVxuXG4vKipcbiAqIEJhc2ljIGZhY3RvcnkgZm9yIGZpZ3VyaW5nIG91dCBhbW91bnQgb2YgbWlsbGlzZWNvbmRzIGluIGEgZ2l2ZW4gdGltZSBwZXJpb2QuXG4gKi9cbmZ1bmN0aW9uIFRpbWVPYmooKSB7XG4gIHRoaXMuc2VjID0gMTAwMDtcbiAgdGhpcy5taW4gPSB0aGlzLnNlYyAqIDYwO1xuICB0aGlzLmhvdXIgPSB0aGlzLm1pbiAqIDYwO1xuICB0aGlzLmRheSA9IHRoaXMuaG91ciAqIDI0O1xuICB0aGlzLndlZWsgPSB0aGlzLmRheSAqIDc7XG4gIHRoaXMubW9udGggPSB0aGlzLmRheSAqIDMwO1xuICB0aGlzLnllYXIgPSB0aGlzLmRheSAqIDM2NTtcbn1cblxuLyoqXG4gKiBTbGlnaHRseSBhbHRlcmVkIEJvc3RvY2sgbWFnaWMgdG8gd3JhcCBTVkcgPHRleHQ+IG5vZGVzIGJhc2VkIG9uIGF2YWlsYWJsZSB3aWR0aFxuICogQHBhcmFtICB7T2JqZWN0fSB0ZXh0ICAgIEQzIHRleHQgc2VsZWN0aW9uLlxuICogQHBhcmFtICB7SW50ZWdlcn0gd2lkdGhcbiAqL1xuZnVuY3Rpb24gd3JhcFRleHQodGV4dCwgd2lkdGgpIHtcbiAgdGV4dC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciB0ZXh0ID0gZDMuc2VsZWN0KHRoaXMpLFxuICAgICAgICB3b3JkcyA9IHRleHQudGV4dCgpLnNwbGl0KC9cXHMrLykucmV2ZXJzZSgpLFxuICAgICAgICB3b3JkLFxuICAgICAgICBsaW5lID0gW10sXG4gICAgICAgIGxpbmVOdW1iZXIgPSAwLFxuICAgICAgICBsaW5lSGVpZ2h0ID0gMS4wLCAvLyBlbXNcbiAgICAgICAgeCA9IDAsXG4gICAgICAgIHkgPSB0ZXh0LmF0dHIoXCJ5XCIpLFxuICAgICAgICBkeSA9IHBhcnNlRmxvYXQodGV4dC5hdHRyKFwiZHlcIikpLFxuICAgICAgICB0c3BhbiA9IHRleHQudGV4dChudWxsKS5hcHBlbmQoXCJ0c3BhblwiKVxuICAgICAgICAgIC5hdHRyKFwieFwiLCB4KVxuICAgICAgICAgIC5hdHRyKFwieVwiLCB5KVxuICAgICAgICAgIC5hdHRyKFwiZHlcIiwgZHkgKyBcImVtXCIpO1xuXG4gICAgd2hpbGUgKHdvcmQgPSB3b3Jkcy5wb3AoKSkge1xuICAgICAgbGluZS5wdXNoKHdvcmQpO1xuICAgICAgdHNwYW4udGV4dChsaW5lLmpvaW4oXCIgXCIpKTtcbiAgICAgIGlmICh0c3Bhbi5ub2RlKCkuZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCkgPiB3aWR0aCAmJiBsaW5lLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbGluZS5wb3AoKTtcbiAgICAgICAgdHNwYW4udGV4dChsaW5lLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbGluZSA9IFt3b3JkXTtcbiAgICAgICAgdHNwYW4gPSB0ZXh0LmFwcGVuZChcInRzcGFuXCIpXG4gICAgICAgICAgLmF0dHIoXCJ4XCIsIHgpXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIHkpXG4gICAgICAgICAgLmF0dHIoXCJkeVwiLCArK2xpbmVOdW1iZXIgKiBsaW5lSGVpZ2h0ICsgZHkgKyBcImVtXCIpXG4gICAgICAgICAgLnRleHQod29yZCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0d28gZGF0ZXMgZGF0ZSBhbmQgYSB0b2xlcmFuY2UgbGV2ZWwsIHJldHVybiBhIHRpbWUgXCJjb250ZXh0XCIgZm9yIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHR3byB2YWx1ZXMuXG4gKiBAcGFyYW0gIHtPYmplY3R9IGQxICAgICBCZWdpbm5pbmcgZGF0ZSBvYmplY3QuXG4gKiBAcGFyYW0gIHtPYmplY3R9IGQyICAgICBFbmQgZGF0ZSBvYmplY3QuXG4gKiBAcGFyYW0gIHtJbnRlZ2VyfSB0b2xlcmFuY2VcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgIFRoZSByZXN1bHRpbmcgdGltZSBjb250ZXh0LlxuICovXG5mdW5jdGlvbiB0aW1lRGlmZihkMSwgZDIsIHRvbGVyYW5jZSkge1xuXG4gIHZhciBkaWZmID0gZDIgLSBkMSxcbiAgICAgIHRpbWUgPSBuZXcgVGltZU9iaigpO1xuXG4gIC8vIHJldHVybmluZyB0aGUgY29udGV4dFxuICBpZiAoKGRpZmYgLyB0aW1lLnllYXIpID4gdG9sZXJhbmNlKSB7IHJldHVybiBcInllYXJzXCI7IH1cbiAgZWxzZSBpZiAoKGRpZmYgLyB0aW1lLm1vbnRoKSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJtb250aHNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUud2VlaykgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwid2Vla3NcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUuZGF5KSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJkYXlzXCI7IH1cbiAgZWxzZSBpZiAoKGRpZmYgLyB0aW1lLmhvdXIpID4gdG9sZXJhbmNlKSB7IHJldHVybiBcImhvdXJzXCI7IH1cbiAgZWxzZSBpZiAoKGRpZmYgLyB0aW1lLm1pbikgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwibWludXRlc1wiOyB9XG4gIGVsc2UgeyByZXR1cm4gXCJkYXlzXCI7IH1cbiAgLy8gaWYgbm9uZSBvZiB0aGVzZSB3b3JrIGkgZmVlbCBiYWQgZm9yIHlvdSBzb25cbiAgLy8gaSd2ZSBnb3QgOTkgcHJvYmxlbXMgYnV0IGFuIGlmL2Vsc2UgYWluXCJ0IG9uZVxuXG59XG5cbi8qKlxuICogR2l2ZW4gYSBkYXRhc2V0LCBmaWd1cmUgb3V0IHdoYXQgdGhlIHRpbWUgY29udGV4dCBpcyBhbmRcbiAqIHdoYXQgdGhlIG51bWJlciBvZiB0aW1lIHVuaXRzIGVsYXBzZWQgaXNcbiAqIEBwYXJhbSAge0FycmF5fSBkYXRhXG4gKiBAcmV0dXJuIHtJbnRlZ2VyfVxuICovXG5mdW5jdGlvbiB0aW1lSW50ZXJ2YWwoZGF0YSkge1xuXG4gIHZhciBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICBkMSA9IGRhdGFbMF0ua2V5LFxuICAgICAgZDIgPSBkYXRhW2RhdGFMZW5ndGggLSAxXS5rZXk7XG5cbiAgdmFyIHJldDtcblxuICB2YXIgaW50ZXJ2YWxzID0gW1xuICAgIHsgdHlwZTogXCJ5ZWFyc1wiLCBzdGVwOiAxIH0sXG4gICAgeyB0eXBlOiBcIm1vbnRoc1wiLCBzdGVwOiAzIH0sIC8vIHF1YXJ0ZXJzXG4gICAgeyB0eXBlOiBcIm1vbnRoc1wiLCBzdGVwOiAxIH0sXG4gICAgeyB0eXBlOiBcImRheXNcIiwgc3RlcDogMSB9LFxuICAgIHsgdHlwZTogXCJob3Vyc1wiLCBzdGVwOiAxIH0sXG4gICAgeyB0eXBlOiBcIm1pbnV0ZXNcIiwgc3RlcDogMSB9XG4gIF07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcnZhbHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaW50ZXJ2YWxDYW5kaWRhdGUgPSBkMy50aW1lW2ludGVydmFsc1tpXS50eXBlXShkMSwgZDIsIGludGVydmFsc1tpXS5zdGVwKS5sZW5ndGg7XG4gICAgaWYgKGludGVydmFsQ2FuZGlkYXRlID49IGRhdGFMZW5ndGggLSAxKSB7XG4gICAgICB2YXIgcmV0ID0gaW50ZXJ2YWxDYW5kaWRhdGU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHJldDtcblxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHRyYW5zZm9ybSBwb3NpdGlvbiBvZiBhbiBlbGVtZW50IGFzIGFuIGFycmF5XG4gKiBAcGFyYW0gIHtPYmplY3R9IG5vZGVcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBnZXRUcmFuc2xhdGVYWShub2RlKSB7XG4gIHJldHVybiBkMy50cmFuc2Zvcm0oZDMuc2VsZWN0KG5vZGUpLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdHJhbnNsYXRlIHN0YXRlbWVudCBiZWNhdXNlIGl0J3MgYW5ub3lpbmcgdG8gdHlwZSBvdXRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdHJhbnNsYXRlKHgsIHkpIHtcbiAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiKVwiO1xufVxuXG4vKipcbiAqIFRlc3RzIGZvciBTVkcgc3VwcG9ydCwgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vdmlsamFtaXMvZmVhdHVyZS5qcy9cbiAqIEBwYXJhbSAge09iamVjdH0gcm9vdCBBIHJlZmVyZW5jZSB0byB0aGUgYnJvd3NlciB3aW5kb3cgb2JqZWN0LlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gc3ZnVGVzdChyb290KSB7XG4gIHJldHVybiAhIXJvb3QuZG9jdW1lbnQgJiYgISFyb290LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhIXJvb3QuZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIikuY3JlYXRlU1ZHUmVjdDtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIHRoZSBBV1MgVVJMIGZvciBhIGdpdmVuIGNoYXJ0IElELlxuICogQHBhcmFtICB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0VGh1bWJuYWlsUGF0aChvYmopIHtcbiAgdmFyIGltZ1NldHRpbmdzID0gb2JqLmltYWdlO1xuXG4gIGltZ1NldHRpbmdzLmJ1Y2tldCA9IHJlcXVpcmUoXCIuLi9jb25maWcvZW52XCIpO1xuXG4gIHZhciBpZCA9IG9iai5pZC5yZXBsYWNlKG9iai5wcmVmaXgsIFwiXCIpO1xuXG4gIHJldHVybiBcImh0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9cIiArIGltZ1NldHRpbmdzLmJ1Y2tldCArIFwiL1wiICsgaW1nU2V0dGluZ3MuYmFzZV9wYXRoICsgaWQgKyBcIi9cIiArIGltZ1NldHRpbmdzLmZpbGVuYW1lICsgXCIuXCIgKyBpbWdTZXR0aW5ncy5leHRlbnNpb247XG59XG5cbi8qKlxuICogR2l2ZW4gYSBjaGFydCBvYmplY3QgYW5kIGNvbnRhaW5lciwgZ2VuZXJhdGUgYW5kIGFwcGVuZCBhIHRodW1ibmFpbFxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZVRodW1iKGNvbnRhaW5lciwgb2JqLCBzZXR0aW5ncykge1xuXG4gIHZhciBpbWdTZXR0aW5ncyA9IHNldHRpbmdzLmltYWdlO1xuXG4gIHZhciBjb250ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpLFxuICAgICAgZmFsbGJhY2sgPSBjb250LnF1ZXJ5U2VsZWN0b3IoXCIuXCIgKyBzZXR0aW5ncy5wcmVmaXggKyBcImJhc2U2NGltZ1wiKTtcblxuICBpZiAoaW1nU2V0dGluZ3MgJiYgaW1nU2V0dGluZ3MuZW5hYmxlICYmIG9iai5kYXRhLmlkKSB7XG5cbiAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCBnZXRUaHVtYm5haWxQYXRoKG9iaikpO1xuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsIG9iai5kYXRhLmhlYWRpbmcpO1xuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgc2V0dGluZ3MucHJlZml4ICsgXCJ0aHVtYm5haWxcIik7XG5cbiAgICBjb250LmFwcGVuZENoaWxkKGltZyk7XG5cbiAgfSBlbHNlIGlmIChmYWxsYmFjaykge1xuXG4gICAgZmFsbGJhY2suc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGNzdlRvVGFibGUodGFyZ2V0LCBkYXRhKSB7XG4gIHZhciBwYXJzZWRDU1YgPSBkMy5jc3YucGFyc2VSb3dzKGRhdGEpO1xuXG4gIHRhcmdldC5hcHBlbmQoXCJ0YWJsZVwiKS5zZWxlY3RBbGwoXCJ0clwiKVxuICAgIC5kYXRhKHBhcnNlZENTVikuZW50ZXIoKVxuICAgIC5hcHBlbmQoXCJ0clwiKS5zZWxlY3RBbGwoXCJ0ZFwiKVxuICAgIC5kYXRhKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pLmVudGVyKClcbiAgICAuYXBwZW5kKFwidGRcIilcbiAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlYm91bmNlOiBkZWJvdW5jZSxcbiAgY2xlYXJDaGFydDogY2xlYXJDaGFydCxcbiAgY2xlYXJPYmo6IGNsZWFyT2JqLFxuICBjbGVhckRyYXduOiBjbGVhckRyYXduLFxuICBnZXRCb3VuZGluZzogZ2V0Qm91bmRpbmcsXG4gIFRpbWVPYmo6IFRpbWVPYmosXG4gIHdyYXBUZXh0OiB3cmFwVGV4dCxcbiAgdGltZURpZmY6IHRpbWVEaWZmLFxuICB0aW1lSW50ZXJ2YWw6IHRpbWVJbnRlcnZhbCxcbiAgZ2V0VHJhbnNsYXRlWFk6IGdldFRyYW5zbGF0ZVhZLFxuICB0cmFuc2xhdGU6IHRyYW5zbGF0ZSxcbiAgc3ZnVGVzdDogc3ZnVGVzdCxcbiAgZ2V0VGh1bWJuYWlsUGF0aDogZ2V0VGh1bWJuYWlsUGF0aCxcbiAgZ2VuZXJhdGVUaHVtYjogZ2VuZXJhdGVUaHVtYixcbiAgY3N2VG9UYWJsZTogY3N2VG9UYWJsZSxcbiAgZGF0YVBhcnNlOiByZXF1aXJlKFwiLi9kYXRhcGFyc2VcIiksXG4gIGZhY3Rvcnk6IHJlcXVpcmUoXCIuL2ZhY3RvcnlcIilcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL3V0aWxzL3V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gczNfYnVja2V0IGlzIGRlZmluZWQgaW4gd2VicGFjay5jb25maWcuanNcbm1vZHVsZS5leHBvcnRzID0gczNfYnVja2V0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jb25maWcvZW52LmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBEYXRhIHBhcnNpbmcgbW9kdWxlLiBUYWtlcyBhIENTViBhbmQgdHVybnMgaXQgaW50byBhbiBPYmplY3QsIGFuZCBvcHRpb25hbGx5IGRldGVybWluZXMgdGhlIGZvcm1hdHRpbmcgdG8gdXNlIHdoZW4gcGFyc2luZyBkYXRlcy5cbiAqIEBtb2R1bGUgdXRpbHMvZGF0YXBhcnNlXG4gKiBAc2VlIG1vZHVsZTp1dGlscy9mYWN0b3J5XG4gKi9cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBzY2FsZSByZXR1cm5zIGFuIGlucHV0IGRhdGUgb3Igbm90LlxuICogQHBhcmFtICB7U3RyaW5nfSBzY2FsZVR5cGUgICAgICBUaGUgdHlwZSBvZiBzY2FsZS5cbiAqIEBwYXJhbSAge1N0cmluZ30gZGVmYXVsdEZvcm1hdCAgRm9ybWF0IHNldCBieSB0aGUgY2hhcnQgdG9vbCBzZXR0aW5ncy5cbiAqIEBwYXJhbSAge1N0cmluZ30gZGVjbGFyZWRGb3JtYXQgRm9ybWF0IHBhc3NlZCBieSB0aGUgY2hhcnQgZW1iZWQgY29kZSwgaWYgdGhlcmUgaXMgb25lXG4gKiBAcmV0dXJuIHtTdHJpbmd8VW5kZWZpbmVkfVxuICovXG5mdW5jdGlvbiBpbnB1dERhdGUoc2NhbGVUeXBlLCBkZWZhdWx0Rm9ybWF0LCBkZWNsYXJlZEZvcm1hdCkge1xuXG4gIGlmIChzY2FsZVR5cGUgPT09IFwidGltZVwiIHx8IHNjYWxlVHlwZSA9PT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgIHJldHVybiBkZWNsYXJlZEZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxufVxuXG4vKipcbiAqIFBhcnNlcyBhIENTViBzdHJpbmcgdXNpbmcgZDMuY3N2LnBhcnNlKCkgYW5kIHR1cm5zIGl0IGludG8gYW4gYXJyYXkgb2Ygb2JqZWN0cy5cbiAqIEBwYXJhbSAge1N0cmluZ30gY3N2ICAgICAgICAgICAgIENTViBzdHJpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcGFyYW0gIHtTdHJpbmcgaW5wdXREYXRlRm9ybWF0IERhdGUgZm9ybWF0IGluIEQzIHN0cmZ0aW1lIHN0eWxlLCBpZiB0aGVyZSBpcyBvbmVcbiAqIEBwYXJhbSAge1N0cmluZ30gaW5kZXggICAgICAgICAgIFZhbHVlIHRvIGluZGV4IHRoZSBkYXRhIHRvLCBpZiB0aGVyZSBpcyBvbmVcbiAqIEByZXR1cm4geyB7Y3N2OiBTdHJpbmcsIGRhdGE6IEFycmF5LCBzZXJpZXNBbW91bnQ6IEludGVnZXIsIGtleXM6IEFycmF5fSB9ICAgICAgICAgICAgICAgICBBbiBvYmplY3Qgd2l0aCB0aGUgb3JpZ2luYWwgQ1NWIHN0cmluZywgdGhlIG5ld2x5LWZvcm1hdHRlZCBkYXRhLCB0aGUgbnVtYmVyIG9mIHNlcmllcyBpbiB0aGUgZGF0YSBhbmQgYW4gYXJyYXkgb2Yga2V5cyB1c2VkLlxuICovXG5mdW5jdGlvbiBwYXJzZShjc3YsIGlucHV0RGF0ZUZvcm1hdCwgaW5kZXgsIHN0YWNrZWQsIHR5cGUpIHtcblxuICB2YXIga2V5cywgdmFsO1xuXG4gIHZhciBmaXJzdFZhbHMgPSB7fTtcblxuICB2YXIgZGF0YSA9IGQzLmNzdi5wYXJzZShjc3YsIGZ1bmN0aW9uKGQsIGkpIHtcblxuICAgIHZhciBvYmogPSB7fTtcblxuICAgIGlmIChpID09PSAwKSB7IGtleXMgPSBkMy5rZXlzKGQpOyB9XG5cbiAgICBpZiAoaW5wdXREYXRlRm9ybWF0KSB7XG4gICAgICB2YXIgZGF0ZUZvcm1hdCA9IGQzLnRpbWUuZm9ybWF0KGlucHV0RGF0ZUZvcm1hdCk7XG4gICAgICBvYmoua2V5ID0gZGF0ZUZvcm1hdC5wYXJzZShkMy52YWx1ZXMoZClbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmoua2V5ID0gZDMudmFsdWVzKGQpWzBdO1xuICAgIH1cblxuICAgIG9iai5zZXJpZXMgPSBbXTtcblxuICAgIGZvciAodmFyIGogPSAxOyBqIDwgZDMua2V5cyhkKS5sZW5ndGg7IGorKykge1xuXG4gICAgICB2YXIga2V5ID0gZDMua2V5cyhkKVtqXTtcblxuICAgICAgaWYgKGRba2V5XSA9PT0gMCB8fCBkW2tleV0gPT09IFwiXCIpIHtcbiAgICAgICAgZFtrZXldID0gXCJfX3VuZGVmaW5lZF9fXCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmRleCkge1xuXG4gICAgICAgIGlmIChpID09PSAwICYmICFmaXJzdFZhbHNba2V5XSkge1xuICAgICAgICAgIGZpcnN0VmFsc1trZXldID0gZFtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSBcIjBcIikge1xuICAgICAgICAgIHZhbCA9ICgoZFtrZXldIC8gZmlyc3RWYWxzW2tleV0pIC0gMSkgKiAxMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsID0gKGRba2V5XSAvIGZpcnN0VmFsc1trZXldKSAqIGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IGRba2V5XTtcbiAgICAgIH1cblxuICAgICAgb2JqLnNlcmllcy5wdXNoKHtcbiAgICAgICAgdmFsOiB2YWwsXG4gICAgICAgIGtleToga2V5XG4gICAgICB9KTtcblxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG5cbiAgfSk7XG5cbiAgdmFyIHNlcmllc0Ftb3VudCA9IGRhdGFbMF0uc2VyaWVzLmxlbmd0aDtcblxuICBpZiAoc3RhY2tlZCkge1xuICAgIGlmICh0eXBlID09PSBcInN0cmVhbVwiKSB7XG4gICAgICB2YXIgc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKS5vZmZzZXQoXCJzaWxob3VldHRlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKTtcbiAgICB9XG4gICAgdmFyIHN0YWNrZWREYXRhID0gc3RhY2soZDMucmFuZ2Uoc2VyaWVzQW1vdW50KS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZGF0YS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxlZ2VuZDoga2V5c1trZXkgKyAxXSxcbiAgICAgICAgICB4OiBkLmtleSxcbiAgICAgICAgICB5OiBOdW1iZXIoZC5zZXJpZXNba2V5XS52YWwpLFxuICAgICAgICAgIHJhdzogZFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSkpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjc3Y6IGNzdixcbiAgICBkYXRhOiBkYXRhLFxuICAgIHNlcmllc0Ftb3VudDogc2VyaWVzQW1vdW50LFxuICAgIGtleXM6IGtleXMsXG4gICAgc3RhY2tlZERhdGE6IHN0YWNrZWREYXRhIHx8IHVuZGVmaW5lZFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbnB1dERhdGU6IGlucHV0RGF0ZSxcbiAgcGFyc2U6IHBhcnNlXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy91dGlscy9kYXRhcGFyc2UuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIFJlY2lwZSBmYWN0b3IgZmFjdG9yeSBtb2R1bGUuXG4gKiBAbW9kdWxlIHV0aWxzL2ZhY3RvcnlcbiAqIEBzZWUgbW9kdWxlOmNoYXJ0cy9pbmRleFxuICovXG5cbi8qKlxuICogR2l2ZW4gYSBcInJlY2lwZVwiIG9mIHNldHRpbmdzIGZvciBhIGNoYXJ0LCBwYXRjaCBpdCB3aXRoIGFuIG9iamVjdCBhbmQgcGFyc2UgdGhlIGRhdGEgZm9yIHRoZSBjaGFydC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgZmluYWwgY2hhcnQgcmVjaXBlLlxuICovXG5mdW5jdGlvbiBSZWNpcGVGYWN0b3J5KHNldHRpbmdzLCBvYmopIHtcbiAgdmFyIGRhdGFQYXJzZSA9IHJlcXVpcmUoXCIuL2RhdGFwYXJzZVwiKTtcbiAgdmFyIGhlbHBlcnMgPSByZXF1aXJlKFwiLi4vaGVscGVycy9oZWxwZXJzXCIpO1xuXG4gIHZhciB0ID0gaGVscGVycy5leHRlbmQoc2V0dGluZ3MpOyAvLyBzaG9ydCBmb3IgdGVtcGxhdGVcblxuICB2YXIgZW1iZWQgPSBvYmouZGF0YTtcbiAgdmFyIGNoYXJ0ID0gZW1iZWQuY2hhcnQ7XG5cbiAgLy8gSSdtIG5vdCBhIGJpZyBmYW4gb2YgaW5kZW50aW5nIHN0dWZmIGxpa2UgdGhpc1xuICAvLyAobG9va2luZyBhdCB5b3UsIFBlcmVpcmEpLCBidXQgSSdtIG1ha2luZyBhbiBleGNlcHRpb25cbiAgLy8gaW4gdGhpcyBjYXNlIGJlY2F1c2UgbXkgZXllcyB3ZXJlIGJsZWVkaW5nLlxuXG4gIHQuZGlzcGF0Y2ggICAgICAgICA9IG9iai5kaXNwYXRjaDtcblxuICB0LnZlcnNpb24gICAgICAgICAgPSBlbWJlZC52ZXJzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LnZlcnNpb247XG4gIHQuaWQgICAgICAgICAgICAgICA9IG9iai5pZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuaWQ7XG4gIHQuaGVhZGluZyAgICAgICAgICA9IGVtYmVkLmhlYWRpbmcgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuaGVhZGluZztcbiAgdC5xdWFsaWZpZXIgICAgICAgID0gZW1iZWQucXVhbGlmaWVyICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5xdWFsaWZpZXI7XG4gIHQuc291cmNlICAgICAgICAgICA9IGVtYmVkLnNvdXJjZSAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuc291cmNlO1xuICB0LmRlY2sgICAgICAgICAgICAgPSBlbWJlZC5kZWNrICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmRlY2tcbiAgdC5jdXN0b21DbGFzcyAgICAgID0gY2hhcnQuY2xhc3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5jdXN0b21DbGFzcztcblxuICB0LnhBeGlzICAgICAgICAgICAgPSBoZWxwZXJzLmV4dGVuZCh0LnhBeGlzLCBjaGFydC54X2F4aXMpICB8fCB0LnhBeGlzO1xuICB0LnlBeGlzICAgICAgICAgICAgPSBoZWxwZXJzLmV4dGVuZCh0LnlBeGlzLCBjaGFydC55X2F4aXMpICB8fCB0LnlBeGlzO1xuXG4gIHZhciBvID0gdC5vcHRpb25zLFxuICAgICAgY28gPSBjaGFydC5vcHRpb25zO1xuXG4gIC8vICBcIm9wdGlvbnNcIiBhcmVhIG9mIGVtYmVkIGNvZGVcbiAgby50eXBlICAgICAgICAgICAgID0gY2hhcnQub3B0aW9ucy50eXBlICAgICAgICAgICAgICAgICAgICAgfHwgby50eXBlO1xuICBvLmludGVycG9sYXRpb24gICAgPSBjaGFydC5vcHRpb25zLmludGVycG9sYXRpb24gICAgICAgICAgICB8fCBvLmludGVycG9sYXRpb247XG5cbiAgby5zb2NpYWwgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnNvY2lhbCkgPT09IHRydWUgPyBjby5zb2NpYWwgICAgICAgICAgIDogby5zb2NpYWw7XG4gIG8uc2hhcmVfZGF0YSAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uc2hhcmVfZGF0YSkgPT09IHRydWUgPyBjby5zaGFyZV9kYXRhICA6IG8uc2hhcmVfZGF0YTtcbiAgby5zdGFja2VkICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnN0YWNrZWQpID09PSB0cnVlID8gY28uc3RhY2tlZCAgICAgICAgIDogby5zdGFja2VkO1xuICBvLmV4cGFuZGVkICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uZXhwYW5kZWQpID09PSB0cnVlID8gY28uZXhwYW5kZWQgICAgICAgOiBvLmV4cGFuZGVkO1xuICBvLmhlYWQgICAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uaGVhZCkgPT09IHRydWUgPyBjby5oZWFkICAgICAgICAgICAgICAgOiBvLmhlYWQ7XG4gIG8uZGVjayAgICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5kZWNrKSA9PT0gdHJ1ZSA/IGNvLmRlY2sgICAgICAgICAgICAgICA6IG8uZGVjaztcbiAgby5sZWdlbmQgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmxlZ2VuZCkgPT09IHRydWUgPyBjby5sZWdlbmQgICAgICAgICAgIDogby5sZWdlbmQ7XG4gIG8ucXVhbGlmaWVyICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5xdWFsaWZpZXIpID09PSB0cnVlID8gY28ucXVhbGlmaWVyICAgICA6IG8ucXVhbGlmaWVyO1xuICBvLmZvb3RlciAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uZm9vdGVyKSA9PT0gdHJ1ZSA/IGNvLmZvb3RlciAgICAgICAgICAgOiBvLmZvb3RlcjtcbiAgby54X2F4aXMgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnhfYXhpcykgPT09IHRydWUgPyBjby54X2F4aXMgICAgICAgICAgIDogby54X2F4aXM7XG4gIG8ueV9heGlzICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby55X2F4aXMpID09PSB0cnVlID8gY28ueV9heGlzICAgICAgICAgICA6IG8ueV9heGlzO1xuICBvLnRpcHMgICAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28udGlwcykgPT09IHRydWUgPyBjby50aXBzICAgICAgICAgICAgICAgOiBvLnRpcHM7XG4gIG8uYW5ub3RhdGlvbnMgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5hbm5vdGF0aW9ucykgPT09IHRydWUgPyBjby5hbm5vdGF0aW9ucyA6IG8uYW5ub3RhdGlvbnM7XG4gIG8ucmFuZ2UgICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5yYW5nZSkgPT09IHRydWUgPyBjby5yYW5nZSAgICAgICAgICAgICA6IG8ucmFuZ2U7XG4gIG8uc2VyaWVzICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5zZXJpZXMpID09PSB0cnVlID8gY28uc2VyaWVzICAgICAgICAgICA6IG8uc2VyaWVzO1xuICBvLmluZGV4ICAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uaW5kZXhlZCkgPT09IHRydWUgPyBjby5pbmRleGVkICAgICAgICAgOiBvLmluZGV4O1xuXG4gIC8vICB0aGVzZSBhcmUgc3BlY2lmaWMgdG8gdGhlIHQgb2JqZWN0IGFuZCBkb24ndCBleGlzdCBpbiB0aGUgZW1iZWRcbiAgdC5iYXNlQ2xhc3MgICAgICAgID0gZW1iZWQuYmFzZUNsYXNzICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5iYXNlQ2xhc3M7XG5cbiAgdC5kaW1lbnNpb25zLndpZHRoID0gZW1iZWQud2lkdGggICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5kaW1lbnNpb25zLndpZHRoO1xuXG4gIHQucHJlZml4ICAgICAgICAgICA9IGNoYXJ0LnByZWZpeCAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQucHJlZml4O1xuICB0LmV4cG9ydGFibGUgICAgICAgPSBjaGFydC5leHBvcnRhYmxlICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmV4cG9ydGFibGU7XG4gIHQuZWRpdGFibGUgICAgICAgICA9IGNoYXJ0LmVkaXRhYmxlICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuZWRpdGFibGU7XG5cbiAgaWYgKHQuZXhwb3J0YWJsZSkge1xuICAgIHQuZGltZW5zaW9ucy53aWR0aCA9IGNoYXJ0LmV4cG9ydGFibGUud2lkdGggfHwgZW1iZWQud2lkdGggfHwgdC5kaW1lbnNpb25zLndpZHRoO1xuICAgIHQuZGltZW5zaW9ucy5oZWlnaHQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNoYXJ0LmV4cG9ydGFibGUuaGVpZ2h0OyB9XG4gICAgdC5kaW1lbnNpb25zLm1hcmdpbiA9IGNoYXJ0LmV4cG9ydGFibGUubWFyZ2luIHx8IHQuZGltZW5zaW9ucy5tYXJnaW47XG4gIH1cblxuICBpZiAoY2hhcnQuaGFzSG91cnMpIHsgdC5kYXRlRm9ybWF0ICs9IFwiIFwiICsgdC50aW1lRm9ybWF0OyB9XG4gIHQuaGFzSG91cnMgICAgICAgICA9IGNoYXJ0Lmhhc0hvdXJzICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuaGFzSG91cnM7XG4gIHQuZGF0ZUZvcm1hdCAgICAgICA9IGNoYXJ0LmRhdGVGb3JtYXQgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuZGF0ZUZvcm1hdDtcblxuICB0LmRhdGVGb3JtYXQgPSBkYXRhUGFyc2UuaW5wdXREYXRlKHQueEF4aXMuc2NhbGUsIHQuZGF0ZUZvcm1hdCwgY2hhcnQuZGF0ZV9mb3JtYXQpO1xuICB0LmRhdGEgPSBkYXRhUGFyc2UucGFyc2UoY2hhcnQuZGF0YSwgdC5kYXRlRm9ybWF0LCBvLmluZGV4LCBvLnN0YWNrZWQsIG8udHlwZSkgfHwgdC5kYXRhO1xuXG4gIHJldHVybiB0O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVjaXBlRmFjdG9yeTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvdXRpbHMvZmFjdG9yeS5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogSGVscGVycyB0aGF0IG1hbmlwdWxhdGUgYW5kIGNoZWNrIHByaW1pdGl2ZXMuIE5vdGhpbmcgRDMtc3BlY2lmaWMgaGVyZS5cbiAqIEBtb2R1bGUgaGVscGVycy9oZWxwZXJzXG4gKi9cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2Ugb3RoZXJ3aXNlLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNJbnRlZ2VyKHgpIHtcbiAgcmV0dXJuIHggJSAxID09PSAwO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIGZsb2F0LlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNGbG9hdChuKSB7XG4gIHJldHVybiBuID09PSArbiAmJiBuICE9PSAobnwwKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSB2YWx1ZSBpcyBlbXB0eS4gV29ya3MgZm9yIE9iamVjdHMsIEFycmF5cywgU3RyaW5ncyBhbmQgSW50ZWdlcnMuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0VtcHR5KHZhbCkge1xuICBpZiAodmFsLmNvbnN0cnVjdG9yID09IE9iamVjdCkge1xuICAgIGZvciAodmFyIHByb3AgaW4gdmFsKSB7XG4gICAgICBpZiAodmFsLmhhc093blByb3BlcnR5KHByb3ApKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmICh2YWwuY29uc3RydWN0b3IgPT0gQXJyYXkpIHtcbiAgICByZXR1cm4gIXZhbC5sZW5ndGg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICF2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBTaW1wbGUgY2hlY2sgZm9yIHdoZXRoZXIgYSB2YWx1ZSBpcyB1bmRlZmluZWQgb3Igbm90XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGZhbHNlO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBhcnJheXMsIHJldHVybnMgb25seSB1bmlxdWUgdmFsdWVzIGluIHRob3NlIGFycmF5cy5cbiAqIEBwYXJhbSAge0FycmF5fSBhMVxuICogQHBhcmFtICB7QXJyYXl9IGEyXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgQXJyYXkgb2YgdW5pcXVlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlEaWZmKGExLCBhMikge1xuICB2YXIgbzEgPSB7fSwgbzIgPSB7fSwgZGlmZj0gW10sIGksIGxlbiwgaztcbiAgZm9yIChpID0gMCwgbGVuID0gYTEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHsgbzFbYTFbaV1dID0gdHJ1ZTsgfVxuICBmb3IgKGkgPSAwLCBsZW4gPSBhMi5sZW5ndGg7IGkgPCBsZW47IGkrKykgeyBvMlthMltpXV0gPSB0cnVlOyB9XG4gIGZvciAoayBpbiBvMSkgeyBpZiAoIShrIGluIG8yKSkgeyBkaWZmLnB1c2goayk7IH0gfVxuICBmb3IgKGsgaW4gbzIpIHsgaWYgKCEoayBpbiBvMSkpIHsgZGlmZi5wdXNoKGspOyB9IH1cbiAgcmV0dXJuIGRpZmY7XG59XG5cbi8qKlxuICogT3Bwb3NpdGUgb2YgYXJyYXlEaWZmKCksIHRoaXMgcmV0dXJucyBvbmx5IGNvbW1vbiBlbGVtZW50cyBiZXR3ZWVuIGFycmF5cy5cbiAqIEBwYXJhbSAge0FycmF5fSBhcnIxXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyMlxuICogQHJldHVybiB7QXJyYXl9ICAgICAgQXJyYXkgb2YgY29tbW9uIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTYW1lKGExLCBhMikge1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAoaSBpbiBhMSkge1xuICAgIGlmIChhMi5pbmRleE9mKCBhMVtpXSApID4gLTEpe1xuICAgICAgcmV0LnB1c2goIGExW2ldICk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyAnZnJvbScgb2JqZWN0IHdpdGggbWVtYmVycyBmcm9tICd0bycuIElmICd0bycgaXMgbnVsbCwgYSBkZWVwIGNsb25lIG9mICdmcm9tJyBpcyByZXR1cm5lZFxuICogQHBhcmFtICB7Kn0gZnJvbVxuICogQHBhcmFtICB7Kn0gdG9cbiAqIEByZXR1cm4geyp9ICAgICAgQ2xvbmVkIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGZyb20sIHRvKSB7XG4gIGlmIChmcm9tID09IG51bGwgfHwgdHlwZW9mIGZyb20gIT0gXCJvYmplY3RcIikgcmV0dXJuIGZyb207XG4gIGlmIChmcm9tLmNvbnN0cnVjdG9yICE9IE9iamVjdCAmJiBmcm9tLmNvbnN0cnVjdG9yICE9IEFycmF5KSByZXR1cm4gZnJvbTtcbiAgaWYgKGZyb20uY29uc3RydWN0b3IgPT0gRGF0ZSB8fCBmcm9tLmNvbnN0cnVjdG9yID09IFJlZ0V4cCB8fCBmcm9tLmNvbnN0cnVjdG9yID09IEZ1bmN0aW9uIHx8XG4gICAgZnJvbS5jb25zdHJ1Y3RvciA9PSBTdHJpbmcgfHwgZnJvbS5jb25zdHJ1Y3RvciA9PSBOdW1iZXIgfHwgZnJvbS5jb25zdHJ1Y3RvciA9PSBCb29sZWFuKVxuICAgIHJldHVybiBuZXcgZnJvbS5jb25zdHJ1Y3Rvcihmcm9tKTtcblxuICB0byA9IHRvIHx8IG5ldyBmcm9tLmNvbnN0cnVjdG9yKCk7XG5cbiAgZm9yICh2YXIgbmFtZSBpbiBmcm9tKSB7XG4gICAgdG9bbmFtZV0gPSB0eXBlb2YgdG9bbmFtZV0gPT0gXCJ1bmRlZmluZWRcIiA/IGV4dGVuZChmcm9tW25hbWVdLCBudWxsKSA6IHRvW25hbWVdO1xuICB9XG5cbiAgcmV0dXJuIHRvO1xufVxuXG4vKipcbiAqIENvbXBhcmVzIHR3byBvYmplY3RzLCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgdW5pcXVlIGtleXMuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG8xXG4gKiBAcGFyYW0gIHtPYmplY3R9IG8yXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gdW5pcXVlS2V5cyhvMSwgbzIpIHtcbiAgcmV0dXJuIGFycmF5RGlmZihkMy5rZXlzKG8xKSwgZDMua2V5cyhvMikpO1xufVxuXG4vKipcbiAqIENvbXBhcmVzIHR3byBvYmplY3RzLCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgY29tbW9uIGtleXMuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG8xXG4gKiBAcGFyYW0gIHtPYmplY3R9IG8yXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gc2FtZUtleXMobzEsIG8yKSB7XG4gIHJldHVybiBhcnJheVNhbWUoZDMua2V5cyhvMSksIGQzLmtleXMobzIpKTtcbn1cblxuLyoqXG4gKiBJZiBhIHN0cmluZyBpcyB1bmRlZmluZWQsIHJldHVybiBhbiBlbXB0eSBzdHJpbmcgaW5zdGVhZC5cbiAqIEBwYXJhbSAge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGNsZWFuU3RyKHN0cil7XG4gIGlmIChzdHIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzSW50ZWdlcjogaXNJbnRlZ2VyLFxuICBpc0Zsb2F0OiBpc0Zsb2F0LFxuICBpc0VtcHR5OiBpc0VtcHR5LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICBhcnJheURpZmY6IGFycmF5RGlmZixcbiAgYXJyYXlTYW1lOiBhcnJheVNhbWUsXG4gIHVuaXF1ZUtleXM6IHVuaXF1ZUtleXMsXG4gIHNhbWVLZXlzOiBzYW1lS2V5cyxcbiAgY2xlYW5TdHI6IGNsZWFuU3RyXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9oZWxwZXJzL2hlbHBlcnMuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIENoYXJ0IGNvbnRydWN0aW9uIG1hbmFnZXIgbW9kdWxlLlxuICogQG1vZHVsZSBjaGFydHMvbWFuYWdlclxuICovXG5cbi8qKlxuICogTWFuYWdlcyB0aGUgc3RlcC1ieS1zdGVwIGNyZWF0aW9uIG9mIGEgY2hhcnQsIGFuZCByZXR1cm5zIHRoZSBmdWxsIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBjaGFydCwgaW5jbHVkaW5nIHJlZmVyZW5jZXMgdG8gbm9kZXMsIHNjYWxlcywgYXhlcywgZXRjLlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbnRhaW5lciBTZWxlY3RvciBmb3IgdGhlIGNvbnRhaW5lciB0aGUgY2hhcnQgd2lsbCBiZSBkcmF3biBpbnRvLlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiAgICAgICBPYmplY3QgdGhhdCBjb250YWlucyBzZXR0aW5ncyBmb3IgdGhlIGNoYXJ0LlxuICovXG5mdW5jdGlvbiBDaGFydE1hbmFnZXIoY29udGFpbmVyLCBvYmopIHtcblxuICB2YXIgUmVjaXBlID0gcmVxdWlyZShcIi4uL3V0aWxzL2ZhY3RvcnlcIiksXG4gICAgICBzZXR0aW5ncyA9IHJlcXVpcmUoXCIuLi9jb25maWcvY2hhcnQtc2V0dGluZ3NcIiksXG4gICAgICBjb21wb25lbnRzID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9jb21wb25lbnRzXCIpO1xuXG4gIHZhciBjaGFydFJlY2lwZSA9IG5ldyBSZWNpcGUoc2V0dGluZ3MsIG9iaik7XG5cbiAgdmFyIHJlbmRlcmVkID0gY2hhcnRSZWNpcGUucmVuZGVyZWQgPSB7fTtcblxuICAvLyBjaGVjayB0aGF0IGVhY2ggc2VjdGlvbiBpcyBuZWVkZWRcblxuICBpZiAoY2hhcnRSZWNpcGUub3B0aW9ucy5oZWFkKSB7XG4gICAgcmVuZGVyZWQuaGVhZGVyID0gY29tcG9uZW50cy5oZWFkZXIoY29udGFpbmVyLCBjaGFydFJlY2lwZSk7XG4gIH1cblxuICBpZiAoY2hhcnRSZWNpcGUub3B0aW9ucy5mb290ZXIpIHtcbiAgICByZW5kZXJlZC5mb290ZXIgPSBjb21wb25lbnRzLmZvb3Rlcihjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcbiAgfVxuXG4gIHZhciBub2RlID0gY29tcG9uZW50cy5iYXNlKGNvbnRhaW5lciwgY2hhcnRSZWNpcGUpO1xuXG4gIHJlbmRlcmVkLmNvbnRhaW5lciA9IG5vZGU7XG5cbiAgcmVuZGVyZWQucGxvdCA9IGNvbXBvbmVudHMucGxvdChub2RlLCBjaGFydFJlY2lwZSk7XG5cbiAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMucXVhbGlmaWVyKSB7XG4gICAgcmVuZGVyZWQucXVhbGlmaWVyID0gY29tcG9uZW50cy5xdWFsaWZpZXIobm9kZSwgY2hhcnRSZWNpcGUpO1xuICB9XG5cbiAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMudGlwcykge1xuICAgIHJlbmRlcmVkLnRpcHMgPSBjb21wb25lbnRzLnRpcHMobm9kZSwgY2hhcnRSZWNpcGUpO1xuICB9XG5cbiAgaWYgKCFjaGFydFJlY2lwZS5lZGl0YWJsZSAmJiAhY2hhcnRSZWNpcGUuZXhwb3J0YWJsZSkge1xuICAgIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLnNoYXJlX2RhdGEpIHtcbiAgICAgIHJlbmRlcmVkLnNoYXJlRGF0YSA9IGNvbXBvbmVudHMuc2hhcmVEYXRhKGNvbnRhaW5lciwgY2hhcnRSZWNpcGUpO1xuICAgIH1cbiAgICBpZiAoY2hhcnRSZWNpcGUub3B0aW9ucy5zb2NpYWwpIHtcbiAgICAgIHJlbmRlcmVkLnNvY2lhbCA9IGNvbXBvbmVudHMuc29jaWFsKGNvbnRhaW5lciwgY2hhcnRSZWNpcGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjaGFydFJlY2lwZS5DVVNUT00pIHtcbiAgICB2YXIgY3VzdG9tID0gcmVxdWlyZShcIi4uLy4uLy4uL2N1c3RvbS9jdXN0b20uanNcIik7XG4gICAgcmVuZGVyZWQuY3VzdG9tID0gY3VzdG9tKG5vZGUsIGNoYXJ0UmVjaXBlLCByZW5kZXJlZCk7XG4gIH1cblxuICByZXR1cm4gY2hhcnRSZWNpcGU7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhcnRNYW5hZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvbWFuYWdlci5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBjb21wb25lbnRzID0ge1xuICBiYXNlOiByZXF1aXJlKFwiLi9iYXNlXCIpLFxuICBoZWFkZXI6IHJlcXVpcmUoXCIuL2hlYWRlclwiKSxcbiAgZm9vdGVyOiByZXF1aXJlKFwiLi9mb290ZXJcIiksXG4gIHBsb3Q6IHJlcXVpcmUoXCIuL3Bsb3RcIiksXG4gIHF1YWxpZmllcjogcmVxdWlyZShcIi4vcXVhbGlmaWVyXCIpLFxuICBheGlzOiByZXF1aXJlKFwiLi9heGlzXCIpLFxuICBzY2FsZTogcmVxdWlyZShcIi4vc2NhbGVcIiksXG4gIHRpcHM6IHJlcXVpcmUoXCIuL3RpcHNcIiksXG4gIHNvY2lhbDogcmVxdWlyZShcIi4vc29jaWFsXCIpLFxuICBzaGFyZURhdGE6IHJlcXVpcmUoXCIuL3NoYXJlLWRhdGFcIilcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcG9uZW50cztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvY29tcG9uZW50cy5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBhcHBlbmQoY29udGFpbmVyLCBvYmopIHtcblxuICB2YXIgbWFyZ2luID0gb2JqLmRpbWVuc2lvbnMubWFyZ2luO1xuXG4gIHZhciBjaGFydEJhc2UgPSBkMy5zZWxlY3QoY29udGFpbmVyKVxuICAgIC5pbnNlcnQoXCJzdmdcIiwgXCIuXCIgKyBvYmoucHJlZml4ICsgXCJjaGFydF9zb3VyY2VcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5iYXNlQ2xhc3MoKSArIFwiX3N2ZyBcIiArIG9iai5wcmVmaXggKyBvYmouY3VzdG9tQ2xhc3MgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcInR5cGVfXCIgKyBvYmoub3B0aW9ucy50eXBlICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXMtXCIgKyBvYmouZGF0YS5zZXJpZXNBbW91bnQsXG4gICAgICBcIndpZHRoXCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0LFxuICAgICAgXCJoZWlnaHRcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tLFxuICAgICAgXCJ2ZXJzaW9uXCI6IDEuMSxcbiAgICAgIFwieG1sbnNcIjogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgfSk7XG5cbiAgLy8gYmFja2dyb3VuZCByZWN0XG4gIGNoYXJ0QmFzZVxuICAgIC5hcHBlbmQoXCJyZWN0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJiZ1wiLFxuICAgICAgXCJ4XCI6IDAsXG4gICAgICBcInlcIjogMCxcbiAgICAgIFwid2lkdGhcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpLFxuICAgICAgXCJoZWlnaHRcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSxcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIlxuICAgIH0pO1xuXG4gIHZhciBncmFwaCA9IGNoYXJ0QmFzZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJncmFwaFwiLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyBtYXJnaW4ubGVmdCArIFwiLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiXG4gICAgfSk7XG5cbiAgcmV0dXJuIGdyYXBoO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwZW5kO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIGhlYWRlckNvbXBvbmVudChjb250YWluZXIsIG9iaikge1xuXG4gIHZhciBoZWxwZXJzID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvaGVscGVyc1wiKTtcblxuICB2YXIgaGVhZGVyR3JvdXAgPSBkMy5zZWxlY3QoY29udGFpbmVyKVxuICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJjaGFydF90aXRsZSBcIiArIG9iai5wcmVmaXggKyBvYmouY3VzdG9tQ2xhc3MsIHRydWUpXG5cbiAgLy8gaGFjayBuZWNlc3NhcnkgdG8gZW5zdXJlIFBERiBmaWVsZHMgYXJlIHNpemVkIHByb3Blcmx5XG4gIGlmIChvYmouZXhwb3J0YWJsZSkge1xuICAgIGhlYWRlckdyb3VwLnN0eWxlKFwid2lkdGhcIiwgb2JqLmV4cG9ydGFibGUud2lkdGggKyBcInB4XCIpO1xuICB9XG5cbiAgaWYgKG9iai5oZWFkaW5nICE9PSBcIlwiIHx8IG9iai5lZGl0YWJsZSkge1xuICAgIHZhciBoZWFkZXJUZXh0ID0gaGVhZGVyR3JvdXBcbiAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiY2hhcnRfdGl0bGUtdGV4dFwiKVxuICAgICAgLnRleHQob2JqLmhlYWRpbmcpO1xuXG4gICAgaWYgKG9iai5lZGl0YWJsZSkge1xuICAgICAgaGVhZGVyVGV4dFxuICAgICAgICAuYXR0cihcImNvbnRlbnRFZGl0YWJsZVwiLCB0cnVlKVxuICAgICAgICAuY2xhc3NlZChcImVkaXRhYmxlLWNoYXJ0X3RpdGxlXCIsIHRydWUpO1xuICAgIH1cblxuICB9XG5cbiAgdmFyIHF1YWxpZmllcjtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSA9PT0gXCJiYXJcIikge1xuICAgIHF1YWxpZmllciA9IGhlYWRlckdyb3VwXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHN0ciA9IG9iai5wcmVmaXggKyBcImNoYXJ0X3F1YWxpZmllciBcIiArIG9iai5wcmVmaXggKyBcImNoYXJ0X3F1YWxpZmllci1iYXJcIjtcbiAgICAgICAgICBpZiAob2JqLmVkaXRhYmxlKSB7XG4gICAgICAgICAgICBzdHIgKz0gXCIgZWRpdGFibGUtY2hhcnRfcXVhbGlmaWVyXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29udGVudEVkaXRhYmxlXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBvYmouZWRpdGFibGUgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAudGV4dChvYmoucXVhbGlmaWVyKTtcbiAgfVxuXG4gIGlmIChvYmouZGF0YS5rZXlzLmxlbmd0aCA+IDIpIHtcblxuICAgIHZhciBsZWdlbmQgPSBoZWFkZXJHcm91cC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImNoYXJ0X2xlZ2VuZFwiLCB0cnVlKTtcblxuICAgIHZhciBrZXlzID0gaGVscGVycy5leHRlbmQob2JqLmRhdGEua2V5cyk7XG5cbiAgICAvLyBnZXQgcmlkIG9mIHRoZSBmaXJzdCBpdGVtIGFzIGl0IGRvZXNudCByZXByZXNlbnQgYSBzZXJpZXNcbiAgICBrZXlzLnNoaWZ0KCk7XG5cbiAgICBpZiAob2JqLm9wdGlvbnMudHlwZSA9PT0gXCJtdWx0aWxpbmVcIikge1xuICAgICAga2V5cyA9IFtrZXlzWzBdLCBrZXlzWzFdXTtcbiAgICAgIGxlZ2VuZC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImNoYXJ0X2xlZ2VuZC1cIiArIG9iai5vcHRpb25zLnR5cGUsIHRydWUpO1xuICAgIH1cblxuICAgIHZhciBsZWdlbmRJdGVtID0gbGVnZW5kLnNlbGVjdEFsbChcImRpdi5cIiArIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtXCIpXG4gICAgICAuZGF0YShrZXlzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gb2JqLnByZWZpeCArIFwibGVnZW5kX2l0ZW0gXCIgKyBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbV9cIiArIChpKTtcbiAgICAgIH0pO1xuXG4gICAgbGVnZW5kSXRlbS5hcHBlbmQoXCJzcGFuXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtX2ljb25cIik7XG5cbiAgICBsZWdlbmRJdGVtLmFwcGVuZChcInNwYW5cIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwibGVnZW5kX2l0ZW1fdGV4dFwiKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSk7XG4gIH1cblxuICBvYmouZGltZW5zaW9ucy5oZWFkZXJIZWlnaHQgPSBoZWFkZXJHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gIHJldHVybiB7XG4gICAgaGVhZGVyR3JvdXA6IGhlYWRlckdyb3VwLFxuICAgIGxlZ2VuZDogbGVnZW5kLFxuICAgIHF1YWxpZmllcjogcXVhbGlmaWVyXG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoZWFkZXJDb21wb25lbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2hlYWRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBmb290ZXJDb21wb25lbnQoY29udGFpbmVyLCBvYmopIHtcblxuICB2YXIgZm9vdGVyR3JvdXA7XG5cbiAgaWYgKG9iai5zb3VyY2UgIT09IFwiXCIgfHwgb2JqLmVkaXRhYmxlKSB7XG4gICAgZm9vdGVyR3JvdXAgPSBkMy5zZWxlY3QoY29udGFpbmVyKVxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiY2hhcnRfc291cmNlXCIsIHRydWUpO1xuXG4gICAgLy8gaGFjayBuZWNlc3NhcnkgdG8gZW5zdXJlIFBERiBmaWVsZHMgYXJlIHNpemVkIHByb3Blcmx5XG4gICAgaWYgKG9iai5leHBvcnRhYmxlKSB7XG4gICAgICBmb290ZXJHcm91cC5zdHlsZShcIndpZHRoXCIsIG9iai5leHBvcnRhYmxlLndpZHRoICsgXCJweFwiKTtcbiAgICB9XG5cbiAgICB2YXIgZm9vdGVyVGV4dCA9IGZvb3Rlckdyb3VwLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJjaGFydF9zb3VyY2UtdGV4dFwiKVxuICAgICAgLnRleHQob2JqLnNvdXJjZSk7XG5cbiAgICBpZiAob2JqLmVkaXRhYmxlKSB7XG4gICAgICBmb290ZXJUZXh0XG4gICAgICAgIC5hdHRyKFwiY29udGVudEVkaXRhYmxlXCIsIHRydWUpXG4gICAgICAgIC5jbGFzc2VkKFwiZWRpdGFibGUtY2hhcnRfc291cmNlXCIsIHRydWUpO1xuICAgIH1cblxuICAgIG9iai5kaW1lbnNpb25zLmZvb3RlckhlaWdodCA9IGZvb3Rlckdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZm9vdGVyR3JvdXA6IGZvb3Rlckdyb3VwXG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb290ZXJDb21wb25lbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2Zvb3Rlci5qc1xuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBwbG90KG5vZGUsIG9iaikge1xuXG4gIHZhciBkcmF3ID0ge1xuICAgIGxpbmU6IHJlcXVpcmUoXCIuLi90eXBlcy9saW5lXCIpLFxuICAgIG11bHRpbGluZTogcmVxdWlyZShcIi4uL3R5cGVzL211bHRpbGluZVwiKSxcbiAgICBhcmVhOiByZXF1aXJlKFwiLi4vdHlwZXMvYXJlYVwiKSxcbiAgICBzdGFja2VkQXJlYTogcmVxdWlyZShcIi4uL3R5cGVzL3N0YWNrZWQtYXJlYVwiKSxcbiAgICBjb2x1bW46IHJlcXVpcmUoXCIuLi90eXBlcy9jb2x1bW5cIiksXG4gICAgYmFyOiByZXF1aXJlKFwiLi4vdHlwZXMvYmFyXCIpLFxuICAgIHN0YWNrZWRDb2x1bW46IHJlcXVpcmUoXCIuLi90eXBlcy9zdGFja2VkLWNvbHVtblwiKSxcbiAgICBzdHJlYW1ncmFwaDogcmVxdWlyZShcIi4uL3R5cGVzL3N0cmVhbWdyYXBoXCIpXG4gIH07XG5cbiAgdmFyIGNoYXJ0UmVmO1xuXG4gIHN3aXRjaChvYmoub3B0aW9ucy50eXBlKSB7XG5cbiAgICBjYXNlIFwibGluZVwiOlxuICAgICAgY2hhcnRSZWYgPSBkcmF3LmxpbmUobm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcIm11bHRpbGluZVwiOlxuICAgICAgY2hhcnRSZWYgPSBkcmF3Lm11bHRpbGluZShub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiYXJlYVwiOlxuICAgICAgY2hhcnRSZWYgPSBvYmoub3B0aW9ucy5zdGFja2VkID8gZHJhdy5zdGFja2VkQXJlYShub2RlLCBvYmopIDogZHJhdy5hcmVhKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJiYXJcIjpcbiAgICAgIGNoYXJ0UmVmID0gZHJhdy5iYXIobm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcImNvbHVtblwiOlxuICAgICAgY2hhcnRSZWYgPSBvYmoub3B0aW9ucy5zdGFja2VkID8gZHJhdy5zdGFja2VkQ29sdW1uKG5vZGUsIG9iaikgOiBkcmF3LmNvbHVtbihub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwic3RyZWFtXCI6XG4gICAgICBjaGFydFJlZiA9IGRyYXcuc3RyZWFtZ3JhcGgobm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIGNoYXJ0UmVmID0gZHJhdy5saW5lKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBjaGFydFJlZjtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBsb3Q7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3Bsb3QuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gTGluZUNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLCB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA9PT0gMSkgeyBvYmouc2VyaWVzSGlnaGxpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9IH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSk7XG5cbiAgLy8gU2Vjb25kYXJ5IGFycmF5IGlzIHVzZWQgdG8gc3RvcmUgYSByZWZlcmVuY2UgdG8gYWxsIHNlcmllcyBleGNlcHQgZm9yIHRoZSBoaWdobGlnaHRlZCBpdGVtXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBbXTtcblxuICBmb3IgKHZhciBpID0gb2JqLmRhdGEuc2VyaWVzQW1vdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAvLyBEb250IHdhbnQgdG8gaW5jbHVkZSB0aGUgaGlnaGxpZ2h0ZWQgaXRlbSBpbiB0aGUgbG9vcFxuICAgIC8vIGJlY2F1c2Ugd2UgYWx3YXlzIHdhbnQgaXQgdG8gc2l0IGFib3ZlIGFsbCB0aGUgb3RoZXIgbGluZXNcblxuICAgIGlmIChpICE9PSBvYmouc2VyaWVzSGlnaGxpZ2h0KCkpIHtcblxuICAgICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tpXS52YWwpOyB9KVxuICAgICAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgICAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbaV0udmFsKTsgfSk7XG5cbiAgICAgIHZhciBwYXRoUmVmID0gc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiZFwiOiBsaW5lLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibGluZS1cIiArIChpKTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgc2Vjb25kYXJ5QXJyLnB1c2gocGF0aFJlZik7XG4gICAgfVxuXG4gIH1cblxuICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBzZWNvbmRhcnkgc2VyaWVzIChhbGwgc2VyaWVzIGV4Y2VwdCB0aGUgaGlnaGxpZ2h0ZWQgb25lKVxuICAvLyBhbmQgc2V0IHRoZSBjb2xvdXJzIGluIHRoZSBjb3JyZWN0IG9yZGVyXG5cbiAgdmFyIHNlY29uZGFyeUFyciA9IHNlY29uZGFyeUFyci5yZXZlcnNlKCk7XG5cbiAgdmFyIGhMaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KTtcblxuICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibGluZS1cIiArIChvYmouc2VyaWVzSGlnaGxpZ2h0KCkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH0sXG4gICAgICBcImRcIjogaExpbmVcbiAgICB9KTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBoTGluZTogaExpbmUsXG4gICAgbGluZTogbGluZVxuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmVDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL2xpbmUuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gQXhpc0ZhY3RvcnkoYXhpc09iaiwgc2NhbGUpIHtcblxuICB2YXIgYXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAuc2NhbGUoc2NhbGUpXG4gICAgLm9yaWVudChheGlzT2JqLm9yaWVudCk7XG5cbiAgcmV0dXJuIGF4aXM7XG5cbn1cblxuZnVuY3Rpb24gYXhpc01hbmFnZXIobm9kZSwgb2JqLCBzY2FsZSwgYXhpc1R5cGUpIHtcblxuICB2YXIgYXhpc09iaiA9IG9ialtheGlzVHlwZV07XG4gIHZhciBheGlzID0gbmV3IEF4aXNGYWN0b3J5KGF4aXNPYmosIHNjYWxlKTtcblxuICB2YXIgcHJldkF4aXMgPSBub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXBcIiArIFwiLlwiICsgb2JqLnByZWZpeCArIGF4aXNUeXBlKS5ub2RlKCk7XG5cbiAgaWYgKHByZXZBeGlzICE9PSBudWxsKSB7IGQzLnNlbGVjdChwcmV2QXhpcykucmVtb3ZlKCk7IH1cblxuICB2YXIgYXhpc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwXCIgKyBcIiBcIiArIG9iai5wcmVmaXggKyBheGlzVHlwZSk7XG5cbiAgaWYgKGF4aXNUeXBlID09PSBcInhBeGlzXCIpIHtcbiAgICBhcHBlbmRYQXhpcyhheGlzR3JvdXAsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNUeXBlKTtcbiAgfSBlbHNlIGlmIChheGlzVHlwZSA9PT0gXCJ5QXhpc1wiKSB7XG4gICAgYXBwZW5kWUF4aXMoYXhpc0dyb3VwLCBvYmosIHNjYWxlLCBheGlzLCBheGlzVHlwZSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5vZGU6IGF4aXNHcm91cCxcbiAgICBheGlzOiBheGlzXG4gIH07XG5cbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lRm9ybWF0KGNvbnRleHQpIHtcblxuICBzd2l0Y2ggKGNvbnRleHQpIHtcbiAgICBjYXNlIFwieWVhcnNcIjogcmV0dXJuIGQzLnRpbWUuZm9ybWF0KFwiJVlcIik7XG4gICAgY2FzZSBcIm1vbnRoc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlYlwiKTtcbiAgICBjYXNlIFwid2Vla3NcIjogcmV0dXJuIGQzLnRpbWUuZm9ybWF0KFwiJVdcIik7XG4gICAgY2FzZSBcImRheXNcIjogcmV0dXJuIGQzLnRpbWUuZm9ybWF0KFwiJWpcIik7XG4gICAgY2FzZSBcImhvdXJzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVIXCIpO1xuICAgIGNhc2UgXCJtaW51dGVzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVNXCIpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gYXBwZW5kWEF4aXMoYXhpc0dyb3VwLCBvYmosIHNjYWxlLCBheGlzLCBheGlzTmFtZSkge1xuXG4gIHZhciBheGlzT2JqID0gb2JqW2F4aXNOYW1lXSxcbiAgICAgIGF4aXNTZXR0aW5ncztcblxuICBpZiAob2JqLmV4cG9ydGFibGUgJiYgb2JqLmV4cG9ydGFibGUueF9heGlzKSB7XG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL2hlbHBlcnNcIikuZXh0ZW5kO1xuICAgIGF4aXNTZXR0aW5ncyA9IGV4dGVuZChheGlzT2JqLCBvYmouZXhwb3J0YWJsZS54X2F4aXMpO1xuICB9IGVsc2Uge1xuICAgIGF4aXNTZXR0aW5ncyA9IGF4aXNPYmo7XG4gIH1cblxuICBheGlzR3JvdXBcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKSArIFwiKVwiKTtcblxuICB2YXIgYXhpc05vZGUgPSBheGlzR3JvdXAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwieC1heGlzXCIpO1xuXG4gIHN3aXRjaChheGlzT2JqLnNjYWxlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcbiAgICAgIHRpbWVBeGlzKGF4aXNOb2RlLCBvYmosIHNjYWxlLCBheGlzLCBheGlzU2V0dGluZ3MpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICAgIGRpc2NyZXRlQXhpcyhheGlzTm9kZSwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncywgb2JqLmRpbWVuc2lvbnMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWwtdGltZVwiOlxuICAgICAgb3JkaW5hbFRpbWVBeGlzKGF4aXNOb2RlLCBvYmosIHNjYWxlLCBheGlzLCBheGlzU2V0dGluZ3MpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCA9IGF4aXNOb2RlLm5vZGUoKS5nZXRCQm94KCkuaGVpZ2h0O1xuXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFlBeGlzKGF4aXNHcm91cCwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc05hbWUpIHtcblxuICBheGlzR3JvdXAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpO1xuXG4gIHZhciBheGlzTm9kZSA9IGF4aXNHcm91cC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ5LWF4aXNcIik7XG5cbiAgZHJhd1lBeGlzKG9iaiwgYXhpcywgYXhpc05vZGUpO1xuXG59XG5cbmZ1bmN0aW9uIGRyYXdZQXhpcyhvYmosIGF4aXMsIGF4aXNOb2RlKSB7XG5cbiAgdmFyIGF4aXNTZXR0aW5ncztcblxuICB2YXIgYXhpc09iaiA9IG9ialtcInlBeGlzXCJdO1xuXG4gIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS55X2F4aXMpIHtcbiAgICB2YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvaGVscGVyc1wiKS5leHRlbmQ7XG4gICAgYXhpc1NldHRpbmdzID0gZXh0ZW5kKGF4aXNPYmosIG9iai5leHBvcnRhYmxlLnlfYXhpcyk7XG4gIH0gZWxzZSB7XG4gICAgYXhpc1NldHRpbmdzID0gYXhpc09iajtcbiAgfVxuXG4gIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ID0gYXhpc1NldHRpbmdzLnBhZGRpbmdSaWdodDtcblxuICBheGlzLnNjYWxlKCkucmFuZ2UoW29iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KCksIDBdKTtcblxuICBheGlzLnRpY2tWYWx1ZXModGlja0ZpbmRlclkoYXhpcy5zY2FsZSgpLCBheGlzT2JqLnRpY2tzLCBheGlzU2V0dGluZ3MpKTtcblxuICBheGlzTm9kZS5jYWxsKGF4aXMpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcImdcIilcbiAgICAuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pXG4gICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwibWlub3JcIiwgdHJ1ZSk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2sgdGV4dFwiKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMClcIilcbiAgICAuY2FsbCh1cGRhdGVUZXh0WSwgYXhpc05vZGUsIG9iaiwgYXhpcywgYXhpc09iailcbiAgICAuY2FsbChyZXBvc2l0aW9uVGV4dFksIG9iai5kaW1lbnNpb25zLCBheGlzT2JqLnRleHRYKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGljayBsaW5lXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ4MVwiOiBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICBcIngyXCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKVxuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIHRpbWVBeGlzKGF4aXNOb2RlLCBvYmosIHNjYWxlLCBheGlzLCBheGlzU2V0dGluZ3MpIHtcblxuICB2YXIgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmYsXG4gICAgICBkb21haW4gPSBzY2FsZS5kb21haW4oKSxcbiAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluWzFdLCAzKSxcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkZXRlcm1pbmVGb3JtYXQoY3R4KTtcblxuICBheGlzLnRpY2tGb3JtYXQoY3VycmVudEZvcm1hdCk7XG5cbiAgdmFyIHRpY2tzO1xuXG4gIHZhciB0aWNrR29hbDtcbiAgaWYgKGF4aXNTZXR0aW5ncy50aWNrcyA9PT0gJ2F1dG8nKSB7XG4gICAgdGlja0dvYWwgPSBheGlzU2V0dGluZ3MudGlja1RhcmdldDtcbiAgfSBlbHNlIHtcbiAgICB0aWNrR29hbCA9IGF4aXNTZXR0aW5ncy50aWNrcztcbiAgfVxuXG4gIGlmIChvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSA+IGF4aXNTZXR0aW5ncy53aWR0aFRocmVzaG9sZCkge1xuICAgIHRpY2tzID0gdGlja0ZpbmRlclgoZG9tYWluLCBjdHgsIHRpY2tHb2FsKTtcbiAgfSBlbHNlIHtcbiAgICB0aWNrcyA9IHRpY2tGaW5kZXJYKGRvbWFpbiwgY3R4LCBheGlzU2V0dGluZ3MudGlja3NTbWFsbCk7XG4gIH1cblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSAhPT0gXCJjb2x1bW5cIikge1xuICAgIGF4aXMudGlja1ZhbHVlcyh0aWNrcyk7XG4gIH0gZWxzZSB7XG4gICAgYXhpcy50aWNrcygpO1xuICB9XG5cbiAgYXhpc05vZGUuY2FsbChheGlzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ4XCI6IGF4aXNTZXR0aW5ncy51cHBlci50ZXh0WCxcbiAgICAgIFwieVwiOiBheGlzU2V0dGluZ3MudXBwZXIudGV4dFksXG4gICAgICBcImR5XCI6IGF4aXNTZXR0aW5ncy5keSArIFwiZW1cIlxuICAgIH0pXG4gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJzdGFydFwiKVxuICAgIC5jYWxsKHNldFRpY2tGb3JtYXRYLCBjdHgsIGF4aXNTZXR0aW5ncy5lbXMsIG9iai5tb250aHNBYnIpO1xuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlID09PSBcImNvbHVtblwiKSB7IGRyb3BSZWR1bmRhbnRUaWNrcyhheGlzTm9kZSwgY3R4KTsgfVxuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpXG4gICAgLmNhbGwoZHJvcFRpY2tzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJsaW5lXCIpXG4gICAgLmF0dHIoXCJ5MlwiLCBheGlzU2V0dGluZ3MudXBwZXIudGlja0hlaWdodCk7XG5cbn1cblxuZnVuY3Rpb24gZGlzY3JldGVBeGlzKGF4aXNOb2RlLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzLCBkaW1lbnNpb25zKSB7XG5cbiAgdmFyIHdyYXBUZXh0ID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLndyYXBUZXh0O1xuXG4gIGF4aXMudGlja1BhZGRpbmcoMCk7XG5cbiAgc2NhbGUucmFuZ2VFeHRlbnQoWzAsIGRpbWVuc2lvbnMudGlja1dpZHRoKCldKTtcblxuICBzY2FsZS5yYW5nZVJvdW5kQmFuZHMoWzAsIGRpbWVuc2lvbnMudGlja1dpZHRoKCldLCBkaW1lbnNpb25zLmJhbmRzLnBhZGRpbmcsIGRpbWVuc2lvbnMuYmFuZHMub3V0ZXJQYWRkaW5nKTtcblxuICB2YXIgYmFuZFN0ZXAgPSBzY2FsZS5yYW5nZUJhbmQoKTtcblxuICBheGlzTm9kZS5jYWxsKGF4aXMpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgIC5hdHRyKFwiZHlcIiwgYXhpc1NldHRpbmdzLmR5ICsgXCJlbVwiKVxuICAgIC5jYWxsKHdyYXBUZXh0LCBiYW5kU3RlcCk7XG5cbiAgdmFyIGZpcnN0WFBvcyA9IGQzLnRyYW5zZm9ybShheGlzTm9kZS5zZWxlY3QoXCIudGlja1wiKS5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMF0gKiAtMTtcblxuICB2YXIgeFBvcyA9ICgtIChiYW5kU3RlcCAvIDIpIC0gKGJhbmRTdGVwICogZGltZW5zaW9ucy5iYW5kcy5vdXRlclBhZGRpbmcpKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJsaW5lXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ4MVwiOiB4UG9zLFxuICAgICAgXCJ4MlwiOiB4UG9zXG4gICAgfSk7XG5cbiAgYXhpc05vZGUuc2VsZWN0KFwibGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieDFcIjogZmlyc3RYUG9zLFxuICAgICAgXCJ4MlwiOiBmaXJzdFhQb3NcbiAgICB9KTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJsaW5lXCIpXG4gICAgLmF0dHIoXCJ5MlwiLCBheGlzU2V0dGluZ3MudXBwZXIudGlja0hlaWdodCk7XG5cbiAgdmFyIGxhc3RUaWNrID0gYXhpc05vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogXCJ0aWNrXCIsXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChkaW1lbnNpb25zLnRpY2tXaWR0aCgpICsgKGJhbmRTdGVwIC8gMikgKyBiYW5kU3RlcCAqIGRpbWVuc2lvbnMuYmFuZHMub3V0ZXJQYWRkaW5nKSArIFwiLDApXCJcbiAgICB9KTtcblxuICBsYXN0VGljay5hcHBlbmQoXCJsaW5lXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ5MlwiOiBheGlzU2V0dGluZ3MudXBwZXIudGlja0hlaWdodCxcbiAgICAgIFwieDFcIjogeFBvcyxcbiAgICAgIFwieDJcIjogeFBvc1xuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIG9yZGluYWxUaW1lQXhpcyhheGlzTm9kZSwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzKSB7XG5cbiAgdmFyIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmLFxuICAgICAgZG9tYWluID0gc2NhbGUuZG9tYWluKCksXG4gICAgICBjdHggPSB0aW1lRGlmZihkb21haW5bMF0sIGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0sIDMpLFxuICAgICAgY3VycmVudEZvcm1hdCA9IGRldGVybWluZUZvcm1hdChjdHgpO1xuXG4gIGF4aXMudGlja0Zvcm1hdChjdXJyZW50Rm9ybWF0KTtcblxuICBheGlzTm9kZS5jYWxsKGF4aXMpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAuYXR0cih7XG4gICAgICBcInhcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRleHRYLFxuICAgICAgXCJ5XCI6IGF4aXNTZXR0aW5ncy51cHBlci50ZXh0WSxcbiAgICAgIFwiZHlcIjogYXhpc1NldHRpbmdzLmR5ICsgXCJlbVwiXG4gICAgfSlcbiAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXG4gICAgLmNhbGwoc2V0VGlja0Zvcm1hdFgsIGN0eCwgYXhpc1NldHRpbmdzLmVtcywgb2JqLm1vbnRoc0Ficik7XG5cbiAgaWYgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSA+IG9iai54QXhpcy53aWR0aFRocmVzaG9sZCkge1xuICAgIHZhciBvcmRpbmFsVGlja1BhZGRpbmcgPSA3O1xuICB9IGVsc2Uge1xuICAgIHZhciBvcmRpbmFsVGlja1BhZGRpbmcgPSA0O1xuICB9XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2tcIilcbiAgICAuY2FsbChvcmRpbmFsVGltZVRpY2tzLCBheGlzTm9kZSwgY3R4LCBzY2FsZSwgb3JkaW5hbFRpY2tQYWRkaW5nKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJsaW5lXCIpXG4gICAgLmF0dHIoXCJ5MlwiLCBheGlzU2V0dGluZ3MudXBwZXIudGlja0hlaWdodCk7XG5cbn1cblxuLy8gdGV4dCBmb3JtYXR0aW5nIGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBzZXRUaWNrRm9ybWF0WChzZWxlY3Rpb24sIGN0eCwgZW1zLCBtb250aHNBYnIpIHtcblxuICB2YXIgcHJldlllYXIsXG4gICAgICBwcmV2TW9udGgsXG4gICAgICBwcmV2RGF0ZSxcbiAgICAgIGRZZWFyLFxuICAgICAgZE1vbnRoLFxuICAgICAgZERhdGUsXG4gICAgICBkSG91cixcbiAgICAgIGRNaW51dGU7XG5cbiAgc2VsZWN0aW9uLnRleHQoZnVuY3Rpb24oZCkge1xuXG4gICAgdmFyIG5vZGUgPSBkMy5zZWxlY3QodGhpcyk7XG5cbiAgICB2YXIgZFN0cjtcblxuICAgIHN3aXRjaCAoY3R4KSB7XG4gICAgICBjYXNlIFwieWVhcnNcIjpcbiAgICAgICAgZFN0ciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibW9udGhzXCI6XG5cbiAgICAgICAgZE1vbnRoID0gbW9udGhzQWJyW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuXG4gICAgICAgIGlmIChkWWVhciAhPT0gcHJldlllYXIpIHtcbiAgICAgICAgICBuZXdUZXh0Tm9kZShub2RlLCBkWWVhciwgZW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRTdHIgPSBkTW9udGg7XG5cbiAgICAgICAgcHJldlllYXIgPSBkWWVhcjtcblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ3ZWVrc1wiOlxuICAgICAgY2FzZSBcImRheXNcIjpcbiAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGRNb250aCA9IG1vbnRoc0FicltkLmdldE1vbnRoKCldO1xuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuXG4gICAgICAgIGlmIChkTW9udGggIT09IHByZXZNb250aCkge1xuICAgICAgICAgIGRTdHIgPSBkTW9udGggKyBcIiBcIiArIGREYXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRTdHIgPSBkRGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkWWVhciAhPT0gcHJldlllYXIpIHtcbiAgICAgICAgICBuZXdUZXh0Tm9kZShub2RlLCBkWWVhciwgZW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZNb250aCA9IGRNb250aDtcbiAgICAgICAgcHJldlllYXIgPSBkWWVhcjtcblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcImhvdXJzXCI6XG4gICAgICAgIGRNb250aCA9IG1vbnRoc0FicltkLmdldE1vbnRoKCldO1xuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICBkSG91ciA9IGQuZ2V0SG91cnMoKTtcbiAgICAgICAgZE1pbnV0ZSA9IGQuZ2V0TWludXRlcygpO1xuXG4gICAgICAgIHZhciBkSG91clN0cixcbiAgICAgICAgICAgIGRNaW51dGVTdHI7XG5cbiAgICAgICAgLy8gQ29udmVydCBmcm9tIDI0aCB0aW1lXG4gICAgICAgIHZhciBzdWZmaXggPSAoZEhvdXIgPj0gMTIpID8gJ3AubS4nIDogJ2EubS4nO1xuICAgICAgICBpZiAoZEhvdXIgPT09IDApIHtcbiAgICAgICAgICBkSG91clN0ciA9IDEyO1xuICAgICAgICB9IGVsc2UgaWYgKGRIb3VyID4gMTIpIHtcbiAgICAgICAgICBkSG91clN0ciA9IGRIb3VyIC0gMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSBkSG91cjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2UgbWludXRlcyBmb2xsb3cgR2xvYmUgc3R5bGVcbiAgICAgICAgaWYgKGRNaW51dGUgPT09IDApIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJyc7XG4gICAgICAgIH0gZWxzZSBpZiAoZE1pbnV0ZSA8IDEwKSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICc6MCcgKyBkTWludXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnOicgKyBkTWludXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZFN0ciA9IGRIb3VyU3RyICsgZE1pbnV0ZVN0ciArICcgJyArIHN1ZmZpeDtcblxuICAgICAgICBpZiAoZERhdGUgIT09IHByZXZEYXRlKSB7XG4gICAgICAgICAgdmFyIGRhdGVTdHIgPSBkTW9udGggKyBcIiBcIiArIGREYXRlO1xuICAgICAgICAgIG5ld1RleHROb2RlKG5vZGUsIGRhdGVTdHIsIGVtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2RGF0ZSA9IGREYXRlO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZFN0ciA9IGQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBkU3RyO1xuXG4gIH0pO1xuXG59XG5cbmZ1bmN0aW9uIHNldFRpY2tGb3JtYXRZKGZvcm1hdCwgZCwgbGFzdFRpY2spIHtcbiAgLy8gY2hlY2tpbmcgZm9yIGEgZm9ybWF0IGFuZCBmb3JtYXR0aW5nIHktYXhpcyB2YWx1ZXMgYWNjb3JkaW5nbHlcblxuICB2YXIgaXNGbG9hdCA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL2hlbHBlcnNcIikuaXNGbG9hdDtcblxuICB2YXIgY3VycmVudEZvcm1hdDtcblxuICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgIGNhc2UgXCJnZW5lcmFsXCI6XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiZ1wiKShkKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzaVwiOlxuICAgICAgdmFyIHByZWZpeCA9IGQzLmZvcm1hdFByZWZpeChsYXN0VGljayksXG4gICAgICAgICAgZm9ybWF0ID0gZDMuZm9ybWF0KFwiLjFmXCIpO1xuICAgICAgY3VycmVudEZvcm1hdCA9IGZvcm1hdChwcmVmaXguc2NhbGUoZCkpICsgcHJlZml4LnN5bWJvbDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJjb21tYVwiOlxuICAgICAgaWYgKGlzRmxvYXQocGFyc2VGbG9hdChkKSkpIHtcbiAgICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIiwuMmZcIikoZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLGdcIikoZCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicm91bmQxXCI6XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLC4xZlwiKShkKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyb3VuZDJcIjpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjJmXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInJvdW5kM1wiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIiwuM2ZcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicm91bmQ0XCI6XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLC40ZlwiKShkKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLGdcIikoZCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBjdXJyZW50Rm9ybWF0O1xuXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRleHRYKHRleHROb2RlcywgYXhpc05vZGUsIG9iaiwgYXhpcywgYXhpc09iaikge1xuXG4gIHZhciBsYXN0VGljayA9IGF4aXMudGlja1ZhbHVlcygpW2F4aXMudGlja1ZhbHVlcygpLmxlbmd0aCAtIDFdO1xuXG4gIHRleHROb2Rlc1xuICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHZhciB2YWwgPSBzZXRUaWNrRm9ybWF0WShheGlzT2JqLmZvcm1hdCwgZCwgbGFzdFRpY2spO1xuICAgICAgaWYgKGkgPT09IGF4aXMudGlja1ZhbHVlcygpLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgdmFsID0gKGF4aXNPYmoucHJlZml4IHx8IFwiXCIpICsgdmFsICsgKGF4aXNPYmouc3VmZml4IHx8IFwiXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9KTtcblxufVxuXG5mdW5jdGlvbiB1cGRhdGVUZXh0WSh0ZXh0Tm9kZXMsIGF4aXNOb2RlLCBvYmosIGF4aXMsIGF4aXNPYmopIHtcblxuICB2YXIgYXJyID0gW10sXG4gICAgICBsYXN0VGljayA9IGF4aXMudGlja1ZhbHVlcygpW2F4aXMudGlja1ZhbHVlcygpLmxlbmd0aCAtIDFdO1xuXG4gIHRleHROb2Rlc1xuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMClcIilcbiAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG4gICAgICB2YXIgdmFsID0gc2V0VGlja0Zvcm1hdFkoYXhpc09iai5mb3JtYXQsIGQsIGxhc3RUaWNrKTtcbiAgICAgIGlmIChpID09PSBheGlzLnRpY2tWYWx1ZXMoKS5sZW5ndGggLSAxKSB7XG4gICAgICAgIHZhbCA9IChheGlzT2JqLnByZWZpeCB8fCBcIlwiKSArIHZhbCArIChheGlzT2JqLnN1ZmZpeCB8fCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSlcbiAgICAudGV4dChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWwgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICB2YXIgdGV4dENoYXIgPSBzZWwubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgYXJyLnB1c2godGV4dENoYXIpO1xuICAgICAgcmV0dXJuIHNlbC50ZXh0KCk7XG4gICAgfSlcbiAgICAuYXR0cih7XG4gICAgICBcImR5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoYXhpc09iai5keSAhPT0gXCJcIikge1xuICAgICAgICAgIHJldHVybiBheGlzT2JqLmR5ICsgXCJlbVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcykuYXR0cihcImR5XCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJ4XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoYXhpc09iai50ZXh0WCAhPT0gXCJcIikge1xuICAgICAgICAgIHJldHVybiBheGlzT2JqLnRleHRYO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcykuYXR0cihcInhcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcInlcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChheGlzT2JqLnRleHRZICE9PSBcIlwiKSB7XG4gICAgICAgICAgcmV0dXJuIGF4aXNPYmoudGV4dFk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwieVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggPSBkMy5tYXgoYXJyKTtcblxufVxuXG5mdW5jdGlvbiByZXBvc2l0aW9uVGV4dFkodGV4dCwgZGltZW5zaW9ucywgdGV4dFgpIHtcbiAgdGV4dC5hdHRyKHtcbiAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChkaW1lbnNpb25zLmxhYmVsV2lkdGggLSB0ZXh0WCkgKyBcIiwwKVwiLFxuICAgIFwieFwiOiAwXG4gIH0pO1xufVxuXG4vLyBDbG9uZXMgY3VycmVudCB0ZXh0IHNlbGVjdGlvbiBhbmQgYXBwZW5kc1xuLy8gYSBuZXcgdGV4dCBub2RlIGJlbG93IHRoZSBzZWxlY3Rpb25cbmZ1bmN0aW9uIG5ld1RleHROb2RlKHNlbGVjdGlvbiwgdGV4dCwgZW1zKSB7XG5cbiAgdmFyIG5vZGVOYW1lID0gc2VsZWN0aW9uLnByb3BlcnR5KFwibm9kZU5hbWVcIiksXG4gICAgICBwYXJlbnQgPSBkMy5zZWxlY3Qoc2VsZWN0aW9uLm5vZGUoKS5wYXJlbnROb2RlKSxcbiAgICAgIGxpbmVIZWlnaHQgPSBlbXMgfHwgMS42LCAvLyBlbXNcbiAgICAgIGR5ID0gcGFyc2VGbG9hdChzZWxlY3Rpb24uYXR0cihcImR5XCIpKSxcbiAgICAgIHggPSBwYXJzZUZsb2F0KHNlbGVjdGlvbi5hdHRyKFwieFwiKSksXG5cbiAgICAgIGNsb25lZCA9IHBhcmVudC5hcHBlbmQobm9kZU5hbWUpXG4gICAgICAgIC5hdHRyKFwiZHlcIiwgbGluZUhlaWdodCArIGR5ICsgXCJlbVwiKVxuICAgICAgICAuYXR0cihcInhcIiwgeClcbiAgICAgICAgLnRleHQoZnVuY3Rpb24oKSB7IHJldHVybiB0ZXh0OyB9KTtcblxuICByZXR1cm4gY2xvbmVkO1xuXG59XG5cbi8vIHRpY2sgZHJvcHBpbmcgZnVuY3Rpb25zXG5cbmZ1bmN0aW9uIGRyb3BUaWNrcyhzZWxlY3Rpb24sIG9wdHMpIHtcblxuICB2YXIgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgdmFyIHRvbGVyYW5jZSA9IG9wdHMudG9sZXJhbmNlIHx8IDAsXG4gICAgICBmcm9tID0gb3B0cy5mcm9tIHx8IDAsXG4gICAgICB0byA9IG9wdHMudG8gfHwgc2VsZWN0aW9uWzBdLmxlbmd0aDtcblxuICBmb3IgKHZhciBqID0gZnJvbTsgaiA8IHRvOyBqKyspIHtcblxuICAgIHZhciBjID0gc2VsZWN0aW9uWzBdW2pdLCAvLyBjdXJyZW50IHNlbGVjdGlvblxuICAgICAgICBuID0gc2VsZWN0aW9uWzBdW2ogKyAxXTsgLy8gbmV4dCBzZWxlY3Rpb25cblxuICAgIGlmICghYyB8fCAhbiB8fCAhYy5nZXRCb3VuZGluZ0NsaWVudFJlY3QgfHwgIW4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7IGNvbnRpbnVlOyB9XG5cbiAgICB3aGlsZSAoKGMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQgKyB0b2xlcmFuY2UpID4gbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KSB7XG5cbiAgICAgIGlmIChkMy5zZWxlY3QobikuZGF0YSgpWzBdID09PSBzZWxlY3Rpb24uZGF0YSgpW3RvXSkge1xuICAgICAgICBkMy5zZWxlY3QoYykucmVtb3ZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkMy5zZWxlY3QobikucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGorKztcblxuICAgICAgbiA9IHNlbGVjdGlvblswXVtqICsgMV07XG5cbiAgICAgIGlmICghbikgeyBicmVhazsgfVxuXG4gICAgfVxuXG4gIH1cblxufVxuXG5mdW5jdGlvbiBkcm9wUmVkdW5kYW50VGlja3Moc2VsZWN0aW9uLCBjdHgpIHtcblxuICB2YXIgdGlja3MgPSBzZWxlY3Rpb24uc2VsZWN0QWxsKFwiLnRpY2tcIik7XG5cbiAgdmFyIHByZXZZZWFyLCBwcmV2TW9udGgsIHByZXZEYXRlLCBwcmV2SG91ciwgcHJldk1pbnV0ZSwgZFllYXIsIGRNb250aCwgZERhdGUsIGRIb3VyLCBkTWludXRlO1xuXG4gIHRpY2tzLmVhY2goZnVuY3Rpb24oZCkge1xuICAgIHN3aXRjaCAoY3R4KSB7XG4gICAgICBjYXNlIFwieWVhcnNcIjpcbiAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGlmIChkWWVhciA9PT0gcHJldlllYXIpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJldlllYXIgPSBkWWVhcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibW9udGhzXCI6XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkTW9udGggPSBkLmdldE1vbnRoKCk7XG4gICAgICAgIGlmICgoZE1vbnRoID09PSBwcmV2TW9udGgpICYmIChkWWVhciA9PT0gcHJldlllYXIpKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHByZXZNb250aCA9IGRNb250aDtcbiAgICAgICAgcHJldlllYXIgPSBkWWVhcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwid2Vla3NcIjpcbiAgICAgIGNhc2UgXCJkYXlzXCI6XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkTW9udGggPSBkLmdldE1vbnRoKCk7XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG5cbiAgICAgICAgaWYgKChkRGF0ZSA9PT0gcHJldkRhdGUpICYmIChkTW9udGggPT09IHByZXZNb250aCkgJiYgKGRZZWFyID09PSBwcmV2WWVhcikpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2RGF0ZSA9IGREYXRlO1xuICAgICAgICBwcmV2TW9udGggPSBkTW9udGg7XG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImhvdXJzXCI6XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIGRIb3VyID0gZC5nZXRIb3VycygpO1xuICAgICAgICBkTWludXRlID0gZC5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgaWYgKChkRGF0ZSA9PT0gcHJldkRhdGUpICYmIChkSG91ciA9PT0gcHJldkhvdXIpICYmIChkTWludXRlID09PSBwcmV2TWludXRlKSkge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZEYXRlID0gZERhdGU7XG4gICAgICAgIHByZXZIb3VyID0gZEhvdXI7XG4gICAgICAgIHByZXZNaW51dGUgPSBkTWludXRlO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0pO1xuXG59XG5cbmZ1bmN0aW9uIGRyb3BPdmVyc2V0VGlja3MoYXhpc05vZGUsIHRpY2tXaWR0aCkge1xuXG4gIHZhciBheGlzR3JvdXBXaWR0aCA9IGF4aXNOb2RlLm5vZGUoKS5nZXRCQm94KCkud2lkdGgsXG4gICAgICB0aWNrQXJyID0gYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2tcIilbMF07XG5cbiAgaWYgKHRpY2tBcnIubGVuZ3RoKSB7XG5cbiAgICB2YXIgZmlyc3RUaWNrT2Zmc2V0ID0gZDMudHJhbnNmb3JtKGQzLnNlbGVjdCh0aWNrQXJyWzBdKVxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVswXTtcblxuICAgIGlmICgoYXhpc0dyb3VwV2lkdGggKyBmaXJzdFRpY2tPZmZzZXQpID49IHRpY2tXaWR0aCkge1xuICAgICAgdmFyIGxhc3RUaWNrID0gdGlja0Fyclt0aWNrQXJyLmxlbmd0aCAtIDFdO1xuICAgICAgZDMuc2VsZWN0KGxhc3RUaWNrKS5hdHRyKFwiY2xhc3NcIiwgXCJsYXN0LXRpY2staGlkZVwiKTtcbiAgICAgIGF4aXNHcm91cFdpZHRoID0gYXhpc05vZGUubm9kZSgpLmdldEJCb3goKS53aWR0aDtcbiAgICAgIHRpY2tBcnIgPSBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKVswXTtcbiAgICB9XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHRpY2tGaW5kZXJYKGRvbWFpbiwgcGVyaW9kLCB0aWNrR29hbCkge1xuXG4gIC8vIHNldCByYW5nZXNcbiAgdmFyIHN0YXJ0RGF0ZSA9IGRvbWFpblswXSxcbiAgICAgIGVuZERhdGUgPSBkb21haW5bMV07XG5cbiAgLy8gc2V0IHVwcGVyIGFuZCBsb3dlciBib3VuZHMgZm9yIG51bWJlciBvZiBzdGVwcyBwZXIgdGlja1xuICAvLyBpLmUuIGlmIHlvdSBoYXZlIGZvdXIgbW9udGhzIGFuZCBzZXQgc3RlcHMgdG8gMSwgeW91J2xsIGdldCA0IHRpY2tzXG4gIC8vIGFuZCBpZiB5b3UgaGF2ZSBzaXggbW9udGhzIGFuZCBzZXQgc3RlcHMgdG8gMiwgeW91J2xsIGdldCAzIHRpY2tzXG4gIHZhciBzdGVwTG93ZXJCb3VuZCA9IDEsXG4gICAgICBzdGVwVXBwZXJCb3VuZCA9IDEyLFxuICAgICAgdGlja0NhbmRpZGF0ZXMgPSBbXSxcbiAgICAgIGNsb3Nlc3RBcnI7XG5cbiAgLy8gdXNpbmcgdGhlIHRpY2sgYm91bmRzLCBnZW5lcmF0ZSBtdWx0aXBsZSBhcnJheXMtaW4tb2JqZWN0cyB1c2luZ1xuICAvLyBkaWZmZXJlbnQgdGljayBzdGVwcy4gcHVzaCBhbGwgdGhvc2UgZ2VuZXJhdGVkIG9iamVjdHMgdG8gdGlja0NhbmRpZGF0ZXNcbiAgZm9yICh2YXIgaSA9IHN0ZXBMb3dlckJvdW5kOyBpIDw9IHN0ZXBVcHBlckJvdW5kOyBpKyspIHtcbiAgICB2YXIgb2JqID0ge307XG4gICAgb2JqLmludGVydmFsID0gaTtcbiAgICBvYmouYXJyID0gZDMudGltZVtwZXJpb2RdKHN0YXJ0RGF0ZSwgZW5kRGF0ZSwgaSkubGVuZ3RoO1xuICAgIHRpY2tDYW5kaWRhdGVzLnB1c2gob2JqKTtcbiAgfVxuXG4gIC8vIHJlZHVjZSB0byBmaW5kIGEgYmVzdCBjYW5kaWRhdGUgYmFzZWQgb24gdGhlIGRlZmluZWQgdGlja0dvYWxcbiAgaWYgKHRpY2tDYW5kaWRhdGVzLmxlbmd0aCA+IDEpIHtcbiAgICBjbG9zZXN0QXJyID0gdGlja0NhbmRpZGF0ZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyKSB7XG4gICAgICByZXR1cm4gKE1hdGguYWJzKGN1cnIuYXJyIC0gdGlja0dvYWwpIDwgTWF0aC5hYnMocHJldi5hcnIgLSB0aWNrR29hbCkgPyBjdXJyIDogcHJldik7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodGlja0NhbmRpZGF0ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgY2xvc2VzdEFyciA9IHRpY2tDYW5kaWRhdGVzWzBdO1xuICB9IGVsc2Uge1xuICAgIC8vIHNpZ2guIHdlIHRyaWVkLlxuICAgIGNsb3Nlc3RBcnIuaW50ZXJ2YWwgPSAxO1xuICB9XG5cbiAgdmFyIHRpY2tBcnIgPSBkMy50aW1lW3BlcmlvZF0oc3RhcnREYXRlLCBlbmREYXRlLCBjbG9zZXN0QXJyLmludGVydmFsKTtcblxuICB2YXIgc3RhcnREaWZmID0gdGlja0FyclswXSAtIHN0YXJ0RGF0ZTtcbiAgdmFyIHRpY2tEaWZmID0gdGlja0FyclsxXSAtIHRpY2tBcnJbMF07XG5cbiAgLy8gaWYgZGlzdGFuY2UgZnJvbSBzdGFydERhdGUgdG8gdGlja0FyclswXSBpcyBncmVhdGVyIHRoYW4gaGFsZiB0aGVcbiAgLy8gZGlzdGFuY2UgYmV0d2VlbiB0aWNrQXJyWzFdIGFuZCB0aWNrQXJyWzBdLCBhZGQgc3RhcnREYXRlIHRvIHRpY2tBcnJcblxuICBpZiAoIHN0YXJ0RGlmZiA+ICh0aWNrRGlmZiAvIDIpICkgeyB0aWNrQXJyLnVuc2hpZnQoc3RhcnREYXRlKTsgfVxuXG4gIHJldHVybiB0aWNrQXJyO1xuXG59XG5cbmZ1bmN0aW9uIHRpY2tGaW5kZXJZKHNjYWxlLCB0aWNrQ291bnQsIHRpY2tTZXR0aW5ncykge1xuXG4gIC8vIEluIGEgbnV0c2hlbGw6XG4gIC8vIENoZWNrcyBpZiBhbiBleHBsaWNpdCBudW1iZXIgb2YgdGlja3MgaGFzIGJlZW4gZGVjbGFyZWRcbiAgLy8gSWYgbm90LCBzZXRzIGxvd2VyIGFuZCB1cHBlciBib3VuZHMgZm9yIHRoZSBudW1iZXIgb2YgdGlja3NcbiAgLy8gSXRlcmF0ZXMgb3ZlciB0aG9zZSBhbmQgbWFrZXMgc3VyZSB0aGF0IHRoZXJlIGFyZSB0aWNrIGFycmF5cyB3aGVyZVxuICAvLyB0aGUgbGFzdCB2YWx1ZSBpbiB0aGUgYXJyYXkgbWF0Y2hlcyB0aGUgZG9tYWluIG1heCB2YWx1ZVxuICAvLyBpZiBzbywgdHJpZXMgdG8gZmluZCB0aGUgdGljayBudW1iZXIgY2xvc2VzdCB0byB0aWNrR29hbCBvdXQgb2YgdGhlIHdpbm5lcnMsXG4gIC8vIGFuZCByZXR1cm5zIHRoYXQgYXJyIHRvIHRoZSBzY2FsZSBmb3IgdXNlXG5cbiAgdmFyIG1pbiA9IHNjYWxlLmRvbWFpbigpWzBdLFxuICAgICAgbWF4ID0gc2NhbGUuZG9tYWluKClbMV07XG5cbiAgaWYgKHRpY2tDb3VudCAhPT0gXCJhdXRvXCIpIHtcblxuICAgIHJldHVybiBzY2FsZS50aWNrcyh0aWNrQ291bnQpO1xuXG4gIH0gZWxzZSB7XG5cbiAgICB2YXIgdGlja0xvd2VyQm91bmQgPSB0aWNrU2V0dGluZ3MudGlja0xvd2VyQm91bmQsXG4gICAgICAgIHRpY2tVcHBlckJvdW5kID0gdGlja1NldHRpbmdzLnRpY2tVcHBlckJvdW5kLFxuICAgICAgICB0aWNrR29hbCA9IHRpY2tTZXR0aW5ncy50aWNrR29hbCxcbiAgICAgICAgYXJyID0gW10sXG4gICAgICAgIHRpY2tDYW5kaWRhdGVzID0gW10sXG4gICAgICAgIGNsb3Nlc3RBcnI7XG5cbiAgICBmb3IgKHZhciBpID0gdGlja0xvd2VyQm91bmQ7IGkgPD0gdGlja1VwcGVyQm91bmQ7IGkrKykge1xuICAgICAgdmFyIHRpY2tDYW5kaWRhdGUgPSBzY2FsZS50aWNrcyhpKTtcblxuICAgICAgaWYgKG1pbiA8IDApIHtcbiAgICAgICAgaWYgKCh0aWNrQ2FuZGlkYXRlWzBdID09PSBtaW4pICYmICh0aWNrQ2FuZGlkYXRlW3RpY2tDYW5kaWRhdGUubGVuZ3RoIC0gMV0gPT09IG1heCkpIHtcbiAgICAgICAgICBhcnIucHVzaCh0aWNrQ2FuZGlkYXRlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRpY2tDYW5kaWRhdGVbdGlja0NhbmRpZGF0ZS5sZW5ndGggLSAxXSA9PT0gbWF4KSB7XG4gICAgICAgICAgYXJyLnB1c2godGlja0NhbmRpZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHRpY2tDYW5kaWRhdGVzLnB1c2godmFsdWUubGVuZ3RoKTtcbiAgICB9KTtcblxuICAgIHZhciBjbG9zZXN0QXJyO1xuXG4gICAgaWYgKHRpY2tDYW5kaWRhdGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNsb3Nlc3RBcnIgPSB0aWNrQ2FuZGlkYXRlcy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnIpIHtcbiAgICAgICAgcmV0dXJuIChNYXRoLmFicyhjdXJyIC0gdGlja0dvYWwpIDwgTWF0aC5hYnMocHJldiAtIHRpY2tHb2FsKSA/IGN1cnIgOiBwcmV2KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGlja0NhbmRpZGF0ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBjbG9zZXN0QXJyID0gdGlja0NhbmRpZGF0ZXNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3Nlc3RBcnIgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBzY2FsZS50aWNrcyhjbG9zZXN0QXJyKTtcblxuICB9XG59XG5cblxuZnVuY3Rpb24gb3JkaW5hbFRpbWVUaWNrcyhzZWxlY3Rpb24sIGF4aXNOb2RlLCBjdHgsIHNjYWxlLCB0b2xlcmFuY2UpIHtcblxuICBkcm9wUmVkdW5kYW50VGlja3MoYXhpc05vZGUsIGN0eCk7XG5cbiAgLy8gZHJvcFJlZHVuZGFudFRpY2tzIGhhcyBtb2RpZmllZCB0aGUgc2VsZWN0aW9uLCBzbyB3ZSBuZWVkIHRvIHJlc2VsZWN0XG4gIC8vIHRvIGdldCBhIHByb3BlciBpZGVhIG9mIHdoYXQncyBzdGlsbCBhdmFpbGFibGVcbiAgdmFyIG5ld1NlbGVjdGlvbiA9IGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpO1xuXG4gIC8vIGlmIHRoZSBjb250ZXh0IGlzIFwieWVhcnNcIiwgZXZlcnkgdGljayBpcyBhIG1ham9ydGljayBzbyB3ZSBjYW5cbiAgLy8ganVzdCBwYXNzIG9uIHRoZSBibG9jayBiZWxvd1xuICBpZiAoY3R4ICE9PSBcInllYXJzXCIpIHtcblxuICAgIC8vIGFycmF5IGZvciBhbnkgXCJtYWpvciB0aWNrc1wiLCBpLmUuIHRpY2tzIHdpdGggYSBjaGFuZ2UgaW4gY29udGV4dFxuICAgIC8vIG9uZSBsZXZlbCB1cC4gaS5lLiwgYSBcIm1vbnRoc1wiIGNvbnRleHQgc2V0IG9mIHRpY2tzIHdpdGggYSBjaGFuZ2UgaW4gdGhlIHllYXIsXG4gICAgLy8gb3IgXCJkYXlzXCIgY29udGV4dCB0aWNrcyB3aXRoIGEgY2hhbmdlIGluIG1vbnRoIG9yIHllYXJcbiAgICB2YXIgbWFqb3JUaWNrcyA9IFtdO1xuXG4gICAgdmFyIHByZXZZZWFyLCBwcmV2TW9udGgsIHByZXZEYXRlLCBkWWVhciwgZE1vbnRoLCBkRGF0ZTtcblxuICAgIG5ld1NlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBjdXJyU2VsID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgc3dpdGNoIChjdHgpIHtcbiAgICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuICAgICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIGlmIChkWWVhciAhPT0gcHJldlllYXIpIHsgbWFqb3JUaWNrcy5wdXNoKGN1cnJTZWwpOyB9XG4gICAgICAgICAgcHJldlllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ3ZWVrc1wiOlxuICAgICAgICBjYXNlIFwiZGF5c1wiOlxuICAgICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIGRNb250aCA9IGQuZ2V0TW9udGgoKTtcbiAgICAgICAgICBpZiAoKGRNb250aCAhPT0gcHJldk1vbnRoKSAmJiAoZFllYXIgIT09IHByZXZZZWFyKSkge1xuICAgICAgICAgICAgbWFqb3JUaWNrcy5wdXNoKGN1cnJTZWwpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZE1vbnRoICE9PSBwcmV2TW9udGgpIHtcbiAgICAgICAgICAgIG1ham9yVGlja3MucHVzaChjdXJyU2VsKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRZZWFyICE9PSBwcmV2WWVhcikge1xuICAgICAgICAgICAgbWFqb3JUaWNrcy5wdXNoKGN1cnJTZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwcmV2TW9udGggPSBkLmdldE1vbnRoKCk7XG4gICAgICAgICAgcHJldlllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJob3Vyc1wiOlxuICAgICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgICAgaWYgKGREYXRlICE9PSBwcmV2RGF0ZSkgeyBtYWpvclRpY2tzLnB1c2goY3VyclNlbCk7IH1cbiAgICAgICAgICBwcmV2RGF0ZSA9IGREYXRlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHQwLCB0bjtcblxuICAgIGlmIChtYWpvclRpY2tzLmxlbmd0aCA+IDEpIHtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYWpvclRpY2tzLmxlbmd0aCArIDE7IGkrKykge1xuXG4gICAgICAgIGlmIChpID09PSAwKSB7IC8vIGZyb20gdDAgdG8gbTBcbiAgICAgICAgICB0MCA9IDA7XG4gICAgICAgICAgdG4gPSBuZXdTZWxlY3Rpb24uZGF0YSgpLmluZGV4T2YobWFqb3JUaWNrc1swXS5kYXRhKClbMF0pO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPT09IChtYWpvclRpY2tzLmxlbmd0aCkpIHsgLy8gZnJvbSBtbiB0byB0blxuICAgICAgICAgIHQwID0gbmV3U2VsZWN0aW9uLmRhdGEoKS5pbmRleE9mKG1ham9yVGlja3NbaSAtIDFdLmRhdGEoKVswXSk7XG4gICAgICAgICAgdG4gPSBuZXdTZWxlY3Rpb24ubGVuZ3RoIC0gMTtcbiAgICAgICAgfSBlbHNlIHsgLy8gZnJvbSBtMCB0byBtblxuICAgICAgICAgIHQwID0gbmV3U2VsZWN0aW9uLmRhdGEoKS5pbmRleE9mKG1ham9yVGlja3NbaSAtIDFdLmRhdGEoKVswXSk7XG4gICAgICAgICAgdG4gPSBuZXdTZWxlY3Rpb24uZGF0YSgpLmluZGV4T2YobWFqb3JUaWNrc1tpXS5kYXRhKClbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEhKHRuIC0gdDApKSB7XG4gICAgICAgICAgZHJvcFRpY2tzKG5ld1NlbGVjdGlvbiwge1xuICAgICAgICAgICAgZnJvbTogdDAsXG4gICAgICAgICAgICB0bzogdG4sXG4gICAgICAgICAgICB0b2xlcmFuY2U6IHRvbGVyYW5jZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIGRyb3BUaWNrcyhuZXdTZWxlY3Rpb24sIHsgdG9sZXJhbmNlOiB0b2xlcmFuY2UgfSk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBheGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaikge1xuXG4gIC8vIHRoaXMgc2VjdGlvbiBpcyBraW5kYSBncm9zcywgc29ycnk6XG4gIC8vIHJlc2V0cyByYW5nZXMgYW5kIGRpbWVuc2lvbnMsIHJlZHJhd3MgeUF4aXMsIHJlZHJhd3MgeEF4aXNcbiAgLy8g4oCmdGhlbiByZWRyYXdzIHlBeGlzIGFnYWluIGlmIHRpY2sgd3JhcHBpbmcgaGFzIGNoYW5nZWQgeEF4aXMgaGVpZ2h0XG5cbiAgZHJhd1lBeGlzKG9iaiwgeUF4aXNPYmouYXhpcywgeUF4aXNPYmoubm9kZSk7XG5cbiAgdmFyIHNldFJhbmdlVHlwZSA9IHJlcXVpcmUoXCIuL3NjYWxlXCIpLnNldFJhbmdlVHlwZSxcbiAgICAgIHNldFJhbmdlQXJncyA9IHJlcXVpcmUoXCIuL3NjYWxlXCIpLnNldFJhbmdlQXJncztcblxuICB2YXIgc2NhbGVPYmogPSB7XG4gICAgcmFuZ2VUeXBlOiBzZXRSYW5nZVR5cGUob2JqLnhBeGlzKSxcbiAgICByYW5nZTogeEF4aXNPYmoucmFuZ2UgfHwgWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSxcbiAgICBiYW5kczogb2JqLmRpbWVuc2lvbnMuYmFuZHMsXG4gICAgcmFuZ2VQb2ludHM6IG9iai54QXhpcy5yYW5nZVBvaW50c1xuICB9O1xuXG4gIHNldFJhbmdlQXJncyh4QXhpc09iai5heGlzLnNjYWxlKCksIHNjYWxlT2JqKTtcblxuICB2YXIgcHJldlhBeGlzSGVpZ2h0ID0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQ7XG5cbiAgeEF4aXNPYmogPSBheGlzTWFuYWdlcihub2RlLCBvYmosIHhBeGlzT2JqLmF4aXMuc2NhbGUoKSwgXCJ4QXhpc1wiKTtcblxuICB4QXhpc09iai5ub2RlXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSAtIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KSArIFwiKVwiKTtcblxuICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWxcIikge1xuICAgIGRyb3BPdmVyc2V0VGlja3MoeEF4aXNPYmoubm9kZSwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpO1xuICB9XG5cbiAgaWYgKHByZXZYQXhpc0hlaWdodCAhPT0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpIHtcbiAgICBkcmF3WUF4aXMob2JqLCB5QXhpc09iai5heGlzLCB5QXhpc09iai5ub2RlKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFkZFplcm9MaW5lKG9iaiwgbm9kZSwgQXhpcywgYXhpc1R5cGUpIHtcblxuICB2YXIgdGlja3MgPSBBeGlzLmF4aXMudGlja1ZhbHVlcygpLFxuICAgICAgdGlja01pbiA9IHRpY2tzWzBdLFxuICAgICAgdGlja01heCA9IHRpY2tzW3RpY2tzLmxlbmd0aCAtIDFdO1xuXG4gIGlmICgodGlja01pbiA8PSAwKSAmJiAoMCA8PSB0aWNrTWF4KSkge1xuXG4gICAgdmFyIHJlZkdyb3VwID0gQXhpcy5ub2RlLnNlbGVjdEFsbChcIi50aWNrOm5vdCguXCIgKyBvYmoucHJlZml4ICsgXCJtaW5vcilcIiksXG4gICAgICAgIHJlZkxpbmUgPSByZWZHcm91cC5zZWxlY3QoXCJsaW5lXCIpO1xuXG4gICAgLy8gemVybyBsaW5lXG4gICAgdmFyIHplcm9MaW5lID0gbm9kZS5hcHBlbmQoXCJsaW5lXCIpXG4gICAgICAuc3R5bGUoXCJzaGFwZS1yZW5kZXJpbmdcIiwgXCJjcmlzcEVkZ2VzXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInplcm8tbGluZVwiKTtcblxuICAgIHZhciB0cmFuc2Zvcm0gPSBbMCwgMF07XG5cbiAgICB0cmFuc2Zvcm1bMF0gKz0gZDMudHJhbnNmb3JtKG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIGF4aXNUeXBlKS5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMF07XG4gICAgdHJhbnNmb3JtWzFdICs9IGQzLnRyYW5zZm9ybShub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBheGlzVHlwZSkuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzFdO1xuICAgIHRyYW5zZm9ybVswXSArPSBkMy50cmFuc2Zvcm0ocmVmR3JvdXAuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdO1xuICAgIHRyYW5zZm9ybVsxXSArPSBkMy50cmFuc2Zvcm0ocmVmR3JvdXAuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzFdO1xuXG4gICAgaWYgKGF4aXNUeXBlID09PSBcInhBeGlzXCIpIHtcblxuICAgICAgemVyb0xpbmUuYXR0cih7XG4gICAgICAgIFwieTFcIjogcmVmTGluZS5hdHRyKFwieTFcIiksXG4gICAgICAgIFwieTJcIjogcmVmTGluZS5hdHRyKFwieTJcIiksXG4gICAgICAgIFwieDFcIjogMCxcbiAgICAgICAgXCJ4MlwiOiAwLFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIHRyYW5zZm9ybVswXSArIFwiLFwiICsgdHJhbnNmb3JtWzFdICsgXCIpXCJcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIGlmIChheGlzVHlwZSA9PT0gXCJ5QXhpc1wiKSB7XG5cbiAgICAgIHplcm9MaW5lLmF0dHIoe1xuICAgICAgICBcIngxXCI6IHJlZkxpbmUuYXR0cihcIngxXCIpLFxuICAgICAgICBcIngyXCI6IHJlZkxpbmUuYXR0cihcIngyXCIpLFxuICAgICAgICBcInkxXCI6IDAsXG4gICAgICAgIFwieTJcIjogMCxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyB0cmFuc2Zvcm1bMF0gKyBcIixcIiArIHRyYW5zZm9ybVsxXSArIFwiKVwiXG4gICAgICB9KTtcblxuICAgIH1cblxuICAgIHJlZkxpbmUuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEF4aXNGYWN0b3J5OiBBeGlzRmFjdG9yeSxcbiAgYXhpc01hbmFnZXI6IGF4aXNNYW5hZ2VyLFxuICBkZXRlcm1pbmVGb3JtYXQ6IGRldGVybWluZUZvcm1hdCxcbiAgYXBwZW5kWEF4aXM6IGFwcGVuZFhBeGlzLFxuICBhcHBlbmRZQXhpczogYXBwZW5kWUF4aXMsXG4gIGRyYXdZQXhpczogZHJhd1lBeGlzLFxuICB0aW1lQXhpczogdGltZUF4aXMsXG4gIGRpc2NyZXRlQXhpczogZGlzY3JldGVBeGlzLFxuICBvcmRpbmFsVGltZUF4aXM6IG9yZGluYWxUaW1lQXhpcyxcbiAgc2V0VGlja0Zvcm1hdFg6IHNldFRpY2tGb3JtYXRYLFxuICBzZXRUaWNrRm9ybWF0WTogc2V0VGlja0Zvcm1hdFksXG4gIHVwZGF0ZVRleHRYOiB1cGRhdGVUZXh0WCxcbiAgdXBkYXRlVGV4dFk6IHVwZGF0ZVRleHRZLFxuICByZXBvc2l0aW9uVGV4dFk6IHJlcG9zaXRpb25UZXh0WSxcbiAgbmV3VGV4dE5vZGU6IG5ld1RleHROb2RlLFxuICBkcm9wVGlja3M6IGRyb3BUaWNrcyxcbiAgZHJvcE92ZXJzZXRUaWNrczogZHJvcE92ZXJzZXRUaWNrcyxcbiAgZHJvcFJlZHVuZGFudFRpY2tzOiBkcm9wUmVkdW5kYW50VGlja3MsXG4gIHRpY2tGaW5kZXJYOiB0aWNrRmluZGVyWCxcbiAgdGlja0ZpbmRlclk6IHRpY2tGaW5kZXJZLFxuICBheGlzQ2xlYW51cDogYXhpc0NsZWFudXAsXG4gIGFkZFplcm9MaW5lOiBhZGRaZXJvTGluZVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvYXhpcy5qc1xuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBzY2FsZU1hbmFnZXIob2JqLCBheGlzVHlwZSkge1xuXG4gIHZhciBheGlzID0gb2JqW2F4aXNUeXBlXSxcbiAgICAgIHNjYWxlT2JqID0gbmV3IFNjYWxlT2JqKG9iaiwgYXhpcywgYXhpc1R5cGUpO1xuXG4gIHZhciBzY2FsZSA9IHNldFNjYWxlVHlwZShzY2FsZU9iai50eXBlKTtcblxuICBzY2FsZS5kb21haW4oc2NhbGVPYmouZG9tYWluKTtcblxuICBzZXRSYW5nZUFyZ3Moc2NhbGUsIHNjYWxlT2JqKTtcblxuICBpZiAoYXhpcy5uaWNlKSB7IG5pY2VpZnkoc2NhbGUsIGF4aXNUeXBlLCBzY2FsZU9iaik7IH1cbiAgaWYgKGF4aXMucmVzY2FsZSkgeyByZXNjYWxlKHNjYWxlLCBheGlzVHlwZSwgYXhpcyk7IH1cblxuICByZXR1cm4ge1xuICAgIG9iajogc2NhbGVPYmosXG4gICAgc2NhbGU6IHNjYWxlXG4gIH07XG5cbn1cblxuZnVuY3Rpb24gU2NhbGVPYmoob2JqLCBheGlzLCBheGlzVHlwZSkge1xuICB0aGlzLnR5cGUgPSBheGlzLnNjYWxlO1xuICB0aGlzLmRvbWFpbiA9IHNldERvbWFpbihvYmosIGF4aXMpO1xuICB0aGlzLnJhbmdlVHlwZSA9IHNldFJhbmdlVHlwZShheGlzKTtcbiAgdGhpcy5yYW5nZSA9IHNldFJhbmdlKG9iaiwgYXhpc1R5cGUpO1xuICB0aGlzLmJhbmRzID0gb2JqLmRpbWVuc2lvbnMuYmFuZHM7XG4gIHRoaXMucmFuZ2VQb2ludHMgPSBheGlzLnJhbmdlUG9pbnRzIHx8IDEuMDtcbn1cblxuZnVuY3Rpb24gc2V0U2NhbGVUeXBlKHR5cGUpIHtcblxuICB2YXIgc2NhbGVUeXBlO1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy50aW1lLnNjYWxlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLm9yZGluYWwoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsaW5lYXJcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLmxpbmVhcigpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImlkZW50aXR5XCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5pZGVudGl0eSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInBvd1wiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUucG93KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic3FydFwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUuc3FydCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxvZ1wiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUubG9nKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicXVhbnRpemVcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnF1YW50aXplKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicXVhbnRpbGVcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnF1YW50aWxlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhyZXNob2xkXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS50aHJlc2hvbGQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHNjYWxlVHlwZTtcblxufVxuXG5mdW5jdGlvbiBzZXRSYW5nZVR5cGUoYXhpcykge1xuXG4gIHZhciB0eXBlO1xuXG4gIHN3aXRjaChheGlzLnNjYWxlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICB0eXBlID0gXCJyYW5nZVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICBjYXNlIFwiZGlzY3JldGVcIjpcbiAgICAgIHR5cGUgPSBcInJhbmdlUm91bmRCYW5kc1wiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWwtdGltZVwiOlxuICAgICAgdHlwZSA9IFwicmFuZ2VQb2ludHNcIjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0eXBlID0gXCJyYW5nZVwiO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gdHlwZTtcblxufVxuXG5mdW5jdGlvbiBzZXRSYW5nZShvYmosIGF4aXNUeXBlKSB7XG5cbiAgdmFyIHJhbmdlO1xuXG4gIGlmIChheGlzVHlwZSA9PT0gXCJ4QXhpc1wiKSB7XG4gICAgcmFuZ2UgPSBbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldOyAvLyBvcGVyYXRpbmcgb24gd2lkdGhcbiAgfSBlbHNlIGlmIChheGlzVHlwZSA9PT0gXCJ5QXhpc1wiKSB7XG4gICAgcmFuZ2UgPSBbb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKSwgMF07IC8vIG9wZXJhdGluZyBvbiBoZWlnaHRcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcblxufVxuXG5mdW5jdGlvbiBzZXRSYW5nZUFyZ3Moc2NhbGUsIHNjYWxlT2JqKSB7XG5cbiAgc3dpdGNoIChzY2FsZU9iai5yYW5nZVR5cGUpIHtcbiAgICBjYXNlIFwicmFuZ2VcIjpcbiAgICAgIHJldHVybiBzY2FsZVtzY2FsZU9iai5yYW5nZVR5cGVdKHNjYWxlT2JqLnJhbmdlKTtcbiAgICBjYXNlIFwicmFuZ2VSb3VuZEJhbmRzXCI6XG4gICAgICByZXR1cm4gc2NhbGVbc2NhbGVPYmoucmFuZ2VUeXBlXShzY2FsZU9iai5yYW5nZSwgc2NhbGVPYmouYmFuZHMucGFkZGluZywgc2NhbGVPYmouYmFuZHMub3V0ZXJQYWRkaW5nKTtcbiAgICBjYXNlIFwicmFuZ2VQb2ludHNcIjpcbiAgICAgIHJldHVybiBzY2FsZVtzY2FsZU9iai5yYW5nZVR5cGVdKHNjYWxlT2JqLnJhbmdlLCBzY2FsZU9iai5yYW5nZVBvaW50cyk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBzZXREb21haW4ob2JqLCBheGlzKSB7XG5cbiAgdmFyIGRhdGEgPSBvYmouZGF0YTtcbiAgdmFyIGRvbWFpbjtcblxuICAvLyBpbmNsdWRlZCBmYWxsYmFja3MganVzdCBpbiBjYXNlXG4gIHN3aXRjaChheGlzLnNjYWxlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcbiAgICAgIGRvbWFpbiA9IHNldERhdGVEb21haW4oZGF0YSwgYXhpcy5taW4sIGF4aXMubWF4KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsaW5lYXJcIjpcbiAgICAgIHZhciBjaGFydFR5cGUgPSBvYmoub3B0aW9ucy50eXBlLFxuICAgICAgICAgIGZvcmNlTWF4VmFsO1xuICAgICAgaWYgKGNoYXJ0VHlwZSA9PT0gXCJhcmVhXCIgfHwgY2hhcnRUeXBlID09PSBcImNvbHVtblwiIHx8IGNoYXJ0VHlwZSA9PT0gXCJiYXJcIikge1xuICAgICAgICBmb3JjZU1heFZhbCA9IHRydWU7XG4gICAgICB9XG4gICAgICBkb21haW4gPSBzZXROdW1lcmljYWxEb21haW4oZGF0YSwgYXhpcy5taW4sIGF4aXMubWF4LCBvYmoub3B0aW9ucy5zdGFja2VkLCBmb3JjZU1heFZhbCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcbiAgICAgIGRvbWFpbiA9IHNldERpc2NyZXRlRG9tYWluKGRhdGEpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gZG9tYWluO1xuXG59XG5cbmZ1bmN0aW9uIHNldERhdGVEb21haW4oZGF0YSwgbWluLCBtYXgpIHtcbiAgaWYgKG1pbiAmJiBtYXgpIHtcbiAgICB2YXIgc3RhcnREYXRlID0gbWluLCBlbmREYXRlID0gbWF4O1xuICB9IGVsc2Uge1xuICAgIHZhciBkYXRlUmFuZ2UgPSBkMy5leHRlbnQoZGF0YS5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmtleTsgfSk7XG4gICAgdmFyIHN0YXJ0RGF0ZSA9IG1pbiB8fCBuZXcgRGF0ZShkYXRlUmFuZ2VbMF0pLFxuICAgICAgICBlbmREYXRlID0gbWF4IHx8IG5ldyBEYXRlKGRhdGVSYW5nZVsxXSk7XG4gIH1cbiAgcmV0dXJuIFtzdGFydERhdGUsIGVuZERhdGVdO1xufVxuXG5mdW5jdGlvbiBzZXROdW1lcmljYWxEb21haW4oZGF0YSwgbWluLCBtYXgsIHN0YWNrZWQsIGZvcmNlTWF4VmFsKSB7XG5cbiAgdmFyIG1pblZhbCwgbWF4VmFsO1xuICB2YXIgbUFyciA9IFtdO1xuXG4gIGQzLm1hcChkYXRhLmRhdGEsIGZ1bmN0aW9uKGQpIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGQuc2VyaWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBtQXJyLnB1c2goTnVtYmVyKGQuc2VyaWVzW2pdLnZhbCkpO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHN0YWNrZWQpIHtcbiAgICBtYXhWYWwgPSBkMy5tYXgoZGF0YS5zdGFja2VkRGF0YVtkYXRhLnN0YWNrZWREYXRhLmxlbmd0aCAtIDFdLCBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gKGQueTAgKyBkLnkpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG1heFZhbCA9IGQzLm1heChtQXJyKTtcbiAgfVxuXG4gIG1pblZhbCA9IGQzLm1pbihtQXJyKTtcblxuICBpZiAobWluKSB7XG4gICAgbWluVmFsID0gbWluO1xuICB9IGVsc2UgaWYgKG1pblZhbCA+IDApIHtcbiAgICBtaW5WYWwgPSAwO1xuICB9XG5cbiAgaWYgKG1heCkge1xuICAgIG1heFZhbCA9IG1heDtcbiAgfSBlbHNlIGlmIChtYXhWYWwgPCAwICYmIGZvcmNlTWF4VmFsKSB7XG4gICAgbWF4VmFsID0gMDtcbiAgfVxuXG4gIHJldHVybiBbbWluVmFsLCBtYXhWYWxdO1xuXG59XG5cbmZ1bmN0aW9uIHNldERpc2NyZXRlRG9tYWluKGRhdGEpIHtcbiAgcmV0dXJuIGRhdGEuZGF0YS5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0pO1xufVxuXG5mdW5jdGlvbiByZXNjYWxlKHNjYWxlLCBheGlzVHlwZSwgYXhpc09iaikge1xuXG4gIHN3aXRjaChheGlzT2JqLnNjYWxlKSB7XG4gICAgY2FzZSBcImxpbmVhclwiOlxuICAgICAgaWYgKCFheGlzT2JqLm1heCkgeyByZXNjYWxlTnVtZXJpY2FsKHNjYWxlLCBheGlzT2JqKTsgfVxuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzY2FsZU51bWVyaWNhbChzY2FsZSwgYXhpc09iaikge1xuXG4gIC8vIHJlc2NhbGVzIHRoZSBcInRvcFwiIGVuZCBvZiB0aGUgZG9tYWluXG4gIHZhciB0aWNrcyA9IHNjYWxlLnRpY2tzKDEwKS5zbGljZSgpLFxuICAgICAgdGlja0luY3IgPSBNYXRoLmFicyh0aWNrc1t0aWNrcy5sZW5ndGggLSAxXSkgLSBNYXRoLmFicyh0aWNrc1t0aWNrcy5sZW5ndGggLSAyXSk7XG5cbiAgdmFyIG5ld01heCA9IHRpY2tzW3RpY2tzLmxlbmd0aCAtIDFdICsgdGlja0luY3I7XG5cbiAgc2NhbGUuZG9tYWluKFtzY2FsZS5kb21haW4oKVswXSwgbmV3TWF4XSk7XG5cbn1cblxuZnVuY3Rpb24gbmljZWlmeShzY2FsZSwgYXhpc1R5cGUsIHNjYWxlT2JqKSB7XG5cbiAgc3dpdGNoKHNjYWxlT2JqLnR5cGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuICAgICAgdmFyIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgdmFyIGNvbnRleHQgPSB0aW1lRGlmZihzY2FsZS5kb21haW4oKVswXSwgc2NhbGUuZG9tYWluKClbMV0sIDMpO1xuICAgICAgbmljZWlmeVRpbWUoc2NhbGUsIGNvbnRleHQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxpbmVhclwiOlxuICAgICAgbmljZWlmeU51bWVyaWNhbChzY2FsZSk7XG4gICAgICBicmVhaztcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIG5pY2VpZnlUaW1lKHNjYWxlLCBjb250ZXh0KSB7XG4gIHZhciBnZXRUaW1lSW50ZXJ2YWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZUludGVydmFsO1xuICB2YXIgdGltZUludGVydmFsID0gZ2V0VGltZUludGVydmFsKGNvbnRleHQpO1xuICBzY2FsZS5kb21haW4oc2NhbGUuZG9tYWluKCkpLm5pY2UodGltZUludGVydmFsKTtcbn1cblxuZnVuY3Rpb24gbmljZWlmeU51bWVyaWNhbChzY2FsZSkge1xuICBzY2FsZS5kb21haW4oc2NhbGUuZG9tYWluKCkpLm5pY2UoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNjYWxlTWFuYWdlcjogc2NhbGVNYW5hZ2VyLFxuICBTY2FsZU9iajogU2NhbGVPYmosXG4gIHNldFNjYWxlVHlwZTogc2V0U2NhbGVUeXBlLFxuICBzZXRSYW5nZVR5cGU6IHNldFJhbmdlVHlwZSxcbiAgc2V0UmFuZ2VBcmdzOiBzZXRSYW5nZUFyZ3MsXG4gIHNldFJhbmdlOiBzZXRSYW5nZSxcbiAgc2V0RG9tYWluOiBzZXREb21haW4sXG4gIHNldERhdGVEb21haW46IHNldERhdGVEb21haW4sXG4gIHNldE51bWVyaWNhbERvbWFpbjogc2V0TnVtZXJpY2FsRG9tYWluLFxuICBzZXREaXNjcmV0ZURvbWFpbjogc2V0RGlzY3JldGVEb21haW4sXG4gIHJlc2NhbGU6IHJlc2NhbGUsXG4gIHJlc2NhbGVOdW1lcmljYWw6IHJlc2NhbGVOdW1lcmljYWwsXG4gIG5pY2VpZnk6IG5pY2VpZnksXG4gIG5pY2VpZnlUaW1lOiBuaWNlaWZ5VGltZSxcbiAgbmljZWlmeU51bWVyaWNhbDogbmljZWlmeU51bWVyaWNhbFxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc2NhbGUuanNcbiAqKiBtb2R1bGUgaWQgPSAxN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gTXVsdGlMaW5lQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBpZiAoeFNjYWxlT2JqLm9iai50eXBlID09PSBcIm9yZGluYWxcIikge1xuICAgIHhTY2FsZS5yYW5nZVJvdW5kUG9pbnRzKFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sIDEuMCk7XG4gIH1cblxuICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID09PSAxKSB7IG9iai5zZXJpZXNIaWdobGlnaHQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH0gfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsaXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KTtcblxuICAvLyBTZWNvbmRhcnkgYXJyYXkgaXMgdXNlZCB0byBzdG9yZSBhIHJlZmVyZW5jZSB0byBhbGwgc2VyaWVzIGV4Y2VwdCBmb3IgdGhlIGhpZ2hsaWdodGVkIGl0ZW1cbiAgdmFyIHNlY29uZGFyeUFyciA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSBvYmouZGF0YS5zZXJpZXNBbW91bnQgLSAxOyBpID49IDA7IGktLSkge1xuICAgIC8vIERvbnQgd2FudCB0byBpbmNsdWRlIHRoZSBoaWdobGlnaHRlZCBpdGVtIGluIHRoZSBsb29wXG4gICAgLy8gYmVjYXVzZSB3ZSBhbHdheXMgd2FudCBpdCB0byBzaXQgYWJvdmUgYWxsIHRoZSBvdGhlciBsaW5lc1xuXG4gICAgaWYgKGkgIT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuXG4gICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAgICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW2ldLnZhbCk7IH0pXG4gICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tpXS52YWwpOyB9KTtcblxuICAgICAgdmFyIHBhdGhSZWYgPSBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkXCI6IGxpbmUsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcIm11bHRpbGluZSBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpbGluZS1cIiArIChpKTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgc2Vjb25kYXJ5QXJyLnB1c2gocGF0aFJlZik7XG4gICAgfVxuXG4gIH1cblxuICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBzZWNvbmRhcnkgc2VyaWVzIChhbGwgc2VyaWVzIGV4Y2VwdCB0aGUgaGlnaGxpZ2h0ZWQgb25lKVxuICAvLyBhbmQgc2V0IHRoZSBjb2xvdXJzIGluIHRoZSBjb3JyZWN0IG9yZGVyXG5cbiAgdmFyIHNlY29uZGFyeUFyciA9IHNlY29uZGFyeUFyci5yZXZlcnNlKCk7XG5cbiAgdmFyIGhMaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KTtcblxuICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJtdWx0aWxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aWxpbmUtXCIgKyAob2JqLnNlcmllc0hpZ2hsaWdodCgpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9LFxuICAgICAgXCJkXCI6IGhMaW5lXG4gICAgfSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgaExpbmU6IGhMaW5lLFxuICAgIGxpbmU6IGxpbmVcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNdWx0aUxpbmVDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL211bHRpbGluZS5qc1xuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBBcmVhQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBpZiAoeFNjYWxlT2JqLm9iai50eXBlID09PSBcIm9yZGluYWxcIikge1xuICAgIHhTY2FsZS5yYW5nZVJvdW5kUG9pbnRzKFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sIDEuMCk7XG4gIH1cblxuICAvLyB3aGE/XG4gIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPT09IDEpIHsgb2JqLnNlcmllc0hpZ2hsaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfSB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pO1xuXG4gIC8vIFNlY29uZGFyeSBhcnJheSBpcyB1c2VkIHRvIHN0b3JlIGEgcmVmZXJlbmNlIHRvIGFsbCBzZXJpZXMgZXhjZXB0IGZvciB0aGUgaGlnaGxpZ2h0ZWQgaXRlbVxuICB2YXIgc2Vjb25kYXJ5QXJyID0gW107XG5cbiAgZm9yICh2YXIgaSA9IG9iai5kYXRhLnNlcmllc0Ftb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgLy8gRG9udCB3YW50IHRvIGluY2x1ZGUgdGhlIGhpZ2hsaWdodGVkIGl0ZW0gaW4gdGhlIGxvb3BcbiAgICAvLyBiZWNhdXNlIHdlIGFsd2F5cyB3YW50IGl0IHRvIHNpdCBhYm92ZSBhbGwgdGhlIG90aGVyIGxpbmVzXG5cbiAgICBpZiAoaSAhPT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG5cbiAgICAgIHZhciBhcmVhID0gZDMuc3ZnLmFyZWEoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgICAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbaV0udmFsKTsgfSlcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAgICAgLnkwKHlTY2FsZSgwKSlcbiAgICAgICAgLnkxKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tpXS52YWwpOyB9KTtcblxuICAgICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tpXS52YWwpOyB9KVxuICAgICAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgICAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbaV0udmFsKTsgfSk7XG5cbiAgICAgIHZhciBwYXRoUmVmID0gc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiZFwiOiBhcmVhLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJmaWxsIFwiICsgb2JqLnByZWZpeCArIFwiZmlsbC1cIiArIChpKTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiZFwiOiBsaW5lLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibGluZS1cIiArIChpKTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgc2Vjb25kYXJ5QXJyLnB1c2gocGF0aFJlZik7XG4gICAgfVxuXG4gIH1cblxuICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBzZWNvbmRhcnkgc2VyaWVzIChhbGwgc2VyaWVzIGV4Y2VwdCB0aGUgaGlnaGxpZ2h0ZWQgb25lKVxuICAvLyBhbmQgc2V0IHRoZSBjb2xvdXJzIGluIHRoZSBjb3JyZWN0IG9yZGVyXG5cbiAgdmFyIHNlY29uZGFyeUFyciA9IHNlY29uZGFyeUFyci5yZXZlcnNlKCk7XG5cbiAgdmFyIGhBcmVhID0gZDMuc3ZnLmFyZWEoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAueTAoeVNjYWxlKDApKVxuICAgIC55MShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KTtcblxuICB2YXIgaExpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSlcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pO1xuXG4gIHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAuYXR0cih7XG4gICAgICBcImRcIjogaEFyZWEsXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImZpbGwgXCIgKyBvYmoucHJlZml4ICsgXCJmaWxsLVwiICsgKG9iai5zZXJpZXNIaWdobGlnaHQoKSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfVxuICAgIH0pO1xuXG4gIHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAuYXR0cih7XG4gICAgICBcImRcIjogaExpbmUsXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJsaW5lLVwiICsgKG9iai5zZXJpZXNIaWdobGlnaHQoKSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfVxuICAgIH0pO1xuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB5QXhpc09iaiwgXCJ5QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIGhMaW5lOiBoTGluZSxcbiAgICBoQXJlYTogaEFyZWEsXG4gICAgbGluZTogbGluZSxcbiAgICBhcmVhOiBhcmVhXG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXJlYUNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvYXJlYS5qc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBTdGFja2VkQXJlYUNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLCB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgaWYgKHhTY2FsZU9iai5vYmoudHlwZSA9PT0gXCJvcmRpbmFsXCIpIHtcbiAgICB4U2NhbGUucmFuZ2VSb3VuZFBvaW50cyhbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldLCAxLjApO1xuICB9XG5cbiAgLy8gd2hhP1xuICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID09PSAxKSB7IG9iai5zZXJpZXNIaWdobGlnaHQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH0gfVxuXG4gIG5vZGUuY2xhc3NlZChvYmoucHJlZml4ICsgXCJzdGFja2VkXCIsIHRydWUpO1xuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsaXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KTtcblxuICB2YXIgc2VyaWVzID0gc2VyaWVzR3JvdXAuc2VsZWN0QWxsKFwiZy5cIiArIG9iai5wcmVmaXggKyBcInNlcmllc1wiKVxuICAgIC5kYXRhKG9iai5kYXRhLnN0YWNrZWREYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZChcInN2ZzpnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzX1wiICsgKGkpO1xuICAgICAgICBpZiAoaSA9PT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG4gICAgICAgICAgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzX1wiICsgKGkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfVxuICAgIH0pO1xuXG4gIHZhciBhcmVhID0gZDMuc3ZnLmFyZWEoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnkwICsgZC55KTsgfSlcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC54KTsgfSlcbiAgICAueTAoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTApOyB9KVxuICAgIC55MShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55MCArIGQueSk7IH0pO1xuXG4gIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnkwICsgZC55KTsgfSlcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC54KTsgfSlcbiAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55MCArIGQueSk7IH0pO1xuXG4gIHNlcmllcy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwiZmlsbCBcIiArIG9iai5wcmVmaXggKyBcImZpbGwtXCIgKyAoaSk7XG4gICAgICBpZiAoaSA9PT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG4gICAgICAgIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImZpbGwgXCIgKyBvYmoucHJlZml4ICsgXCJmaWxsLVwiICsgKGkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSlcbiAgICAuYXR0cihcImRcIiwgYXJlYSk7XG5cbiAgc2VyaWVzLmFwcGVuZChcInBhdGhcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIG9iai5wcmVmaXggKyBcImxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJsaW5lLVwiICsgKGkpOyB9KVxuICAgIC5hdHRyKFwiZFwiLCBsaW5lKTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICBsaW5lOiBsaW5lLFxuICAgIGFyZWE6IGFyZWFcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFja2VkQXJlYUNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RhY2tlZC1hcmVhLmpzXG4gKiogbW9kdWxlIGlkID0gMjBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIENvbHVtbkNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLCB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgc3dpdGNoIChvYmoueEF4aXMuc2NhbGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuXG4gICAgICB2YXIgdGltZUludGVydmFsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVJbnRlcnZhbCxcbiAgICAgICAgICB0aW1lRWxhcHNlZCA9IHRpbWVJbnRlcnZhbChvYmouZGF0YS5kYXRhKSArIDE7XG4gICAgICB2YXIgc2luZ2xlQ29sdW1uID0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyB0aW1lRWxhcHNlZCAvIG9iai5kYXRhLnNlcmllc0Ftb3VudDtcblxuICAgICAgeEF4aXNPYmoucmFuZ2UgPSBbMCwgKG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAqIG9iai5kYXRhLnNlcmllc0Ftb3VudCkpXTtcblxuICAgICAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcblxuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IHhTY2FsZShvYmouZGF0YS5kYXRhWzFdLmtleSkgLSB4U2NhbGUob2JqLmRhdGEuZGF0YVswXS5rZXkpO1xuXG4gICAgICBub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXAuXCIgKyBvYmoucHJlZml4ICsgXCJ4QXhpc1wiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIChzaW5nbGVDb2x1bW4gLyAyKSkgKyBcIixcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpIC0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpICsgXCIpXCIpO1xuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IHhTY2FsZS5yYW5nZUJhbmQoKSAvIG9iai5kYXRhLnNlcmllc0Ftb3VudDtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWx0aXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHhPZmZzZXQ7XG4gICAgICBpZiAob2JqLnhBeGlzLnNjYWxlID09PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgIHhPZmZzZXQgPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIChzaW5nbGVDb2x1bW4gLyAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHhPZmZzZXQgPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHhPZmZzZXQgKyBcIiwwKVwiO1xuICAgIH0pO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmRhdGEuc2VyaWVzQW1vdW50OyBpKyspIHtcblxuICAgIHZhciBzZXJpZXMgPSBzZXJpZXNHcm91cC5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyBpKTtcblxuICAgIHZhciBjb2x1bW5JdGVtID0gc2VyaWVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwiY29sdW1uXCIpXG4gICAgICAuZGF0YShvYmouZGF0YS5kYXRhKS5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcImNvbHVtbiBcIiArIG9iai5wcmVmaXggKyBcImNvbHVtbi1cIiArIChpKSxcbiAgICAgICAgXCJkYXRhLXNlcmllc1wiOiBpLFxuICAgICAgICBcImRhdGEta2V5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQua2V5OyB9LFxuICAgICAgICBcImRhdGEtbGVnZW5kXCI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gb2JqLmRhdGEua2V5c1tpICsgMV07IH0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4U2NhbGUoZC5rZXkpICsgXCIsMClcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgY29sdW1uSXRlbS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBkLnNlcmllc1tpXS52YWwgPCAwID8gXCJuZWdhdGl2ZVwiIDogXCJwb3NpdGl2ZVwiO1xuICAgICAgICB9LFxuICAgICAgICBcInhcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBpICogc2luZ2xlQ29sdW1uO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4geFNjYWxlKGQua2V5KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ5XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBpZiAoZC5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgcmV0dXJuIHlTY2FsZShNYXRoLm1heCgwLCBkLnNlcmllc1tpXS52YWwpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaGVpZ2h0XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBpZiAoZC5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKHlTY2FsZShkLnNlcmllc1tpXS52YWwpIC0geVNjYWxlKDApKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2lkdGhcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKG9iai54QXhpcy5zY2FsZSAhPT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgICAgICAgICAgcmV0dXJuIHNpbmdsZUNvbHVtbjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNpbmdsZUNvbHVtbiAvIG9iai5kYXRhLnNlcmllc0Ftb3VudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcblxuICAgICAgdmFyIGNvbHVtbk9mZnNldCA9IG9iai5kaW1lbnNpb25zLmJhbmRzLm9mZnNldDtcblxuICAgICAgY29sdW1uSXRlbS5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcInhcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgaWYgKG9iai54QXhpcy5zY2FsZSAhPT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgICAgICAgICAgICByZXR1cm4gKChpICogc2luZ2xlQ29sdW1uKSArIChzaW5nbGVDb2x1bW4gKiAoY29sdW1uT2Zmc2V0IC8gMikpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB4U2NhbGUoZC5rZXkpICsgKGkgKiAoc2luZ2xlQ29sdW1uIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIndpZHRoXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKG9iai54QXhpcy5zY2FsZSAhPT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgICAgICAgICAgICByZXR1cm4gKHNpbmdsZUNvbHVtbiAtIChzaW5nbGVDb2x1bW4gKiBjb2x1bW5PZmZzZXQpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBzaW5nbGVDb2x1bW4gLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB5QXhpc09iaiwgXCJ5QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIHNlcmllczogc2VyaWVzLFxuICAgIHNpbmdsZUNvbHVtbjogc2luZ2xlQ29sdW1uLFxuICAgIGNvbHVtbkl0ZW06IGNvbHVtbkl0ZW1cbiAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbHVtbkNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvY29sdW1uLmpzXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIEJhckNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vIGJlY2F1c2UgdGhlIGVsZW1lbnRzIHdpbGwgYmUgYXBwZW5kZWQgaW4gcmV2ZXJzZSBkdWUgdG8gdGhlXG4gIC8vIGJhciBjaGFydCBvcGVyYXRpbmcgb24gdGhlIHktYXhpcywgbmVlZCB0byByZXZlcnNlIHRoZSBkYXRhc2V0LlxuICBvYmouZGF0YS5kYXRhLnJldmVyc2UoKTtcblxuICB2YXIgeEF4aXNPZmZzZXQgPSA5O1xuXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlO1xuXG4gIHZhciB4QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAuc2NhbGUoeFNjYWxlKVxuICAgIC5vcmllbnQoXCJib3R0b21cIik7XG5cbiAgdmFyIHhBeGlzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXBcIiArIFwiIFwiICsgb2JqLnByZWZpeCArIFwieEF4aXNcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiKTtcblxuICB2YXIgeEF4aXNOb2RlID0geEF4aXNHcm91cC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ4LWF4aXNcIilcbiAgICAuY2FsbCh4QXhpcyk7XG5cbiAgdmFyIHRleHRMZW5ndGhzID0gW107XG5cbiAgeEF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAuYXR0cihcInlcIiwgeEF4aXNPZmZzZXQpXG4gICAgLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB0ZXh0TGVuZ3Rocy5wdXNoKGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KTtcbiAgICB9KTtcblxuICB2YXIgdGFsbGVzdFRleHQgPSB0ZXh0TGVuZ3Rocy5yZWR1Y2UoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gKGEgPiBiID8gYSA6IGIpIH0pO1xuXG4gIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0ID0gdGFsbGVzdFRleHQgKyB4QXhpc09mZnNldDtcblxuICB4QXhpc05vZGUuc2VsZWN0QWxsKFwiZ1wiKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSlcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtaW5vclwiLCB0cnVlKTtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIG5lZWQgdGhpcyBmb3IgZml4ZWQtaGVpZ2h0IGJhcnNcbiAgaWYgKCFvYmouZXhwb3J0YWJsZSB8fCAob2JqLmV4cG9ydGFibGUgJiYgIW9iai5leHBvcnRhYmxlLmR5bmFtaWNIZWlnaHQpKSB7XG4gICAgdmFyIHRvdGFsQmFySGVpZ2h0ID0gKG9iai5kaW1lbnNpb25zLmJhckhlaWdodCAqIG9iai5kYXRhLmRhdGEubGVuZ3RoICogb2JqLmRhdGEuc2VyaWVzQW1vdW50KTtcbiAgICB5U2NhbGUucmFuZ2VSb3VuZEJhbmRzKFt0b3RhbEJhckhlaWdodCwgMF0sIG9iai5kaW1lbnNpb25zLmJhbmRzLnBhZGRpbmcsIG9iai5kaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZyk7XG4gICAgb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQgPSB0b3RhbEJhckhlaWdodCAtICh0b3RhbEJhckhlaWdodCAqIG9iai5kaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZyAqIDIpO1xuICB9XG5cbiAgdmFyIHlBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgIC5zY2FsZSh5U2NhbGUpXG4gICAgLm9yaWVudChcImxlZnRcIik7XG5cbiAgdmFyIHlBeGlzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXBcIiArIFwiIFwiICsgb2JqLnByZWZpeCArIFwieUF4aXNcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpO1xuXG4gIHZhciB5QXhpc05vZGUgPSB5QXhpc0dyb3VwLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInktYXhpc1wiKVxuICAgIC5jYWxsKHlBeGlzKTtcblxuICB5QXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKS5yZW1vdmUoKTtcbiAgeUF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIikuYXR0cihcInhcIiwgMCk7XG5cbiAgaWYgKG9iai5kaW1lbnNpb25zLndpZHRoID4gb2JqLnlBeGlzLndpZHRoVGhyZXNob2xkKSB7XG4gICAgdmFyIG1heExhYmVsV2lkdGggPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLyAzLjU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heExhYmVsV2lkdGggPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLyAzO1xuICB9XG5cbiAgaWYgKHlBeGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoID4gbWF4TGFiZWxXaWR0aCkge1xuICAgIHZhciB3cmFwVGV4dCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS53cmFwVGV4dDtcbiAgICB5QXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgLmNhbGwod3JhcFRleHQsIG1heExhYmVsV2lkdGgpXG4gICAgICAuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRzcGFucyA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJ0c3BhblwiKSxcbiAgICAgICAgICAgIHRzcGFuQ291bnQgPSB0c3BhbnNbMF0ubGVuZ3RoLFxuICAgICAgICAgICAgdGV4dEhlaWdodCA9IGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodDtcbiAgICAgICAgaWYgKHRzcGFuQ291bnQgPiAxKSB7XG4gICAgICAgICAgdHNwYW5zXG4gICAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAgIFwieVwiOiAoKHRleHRIZWlnaHQgLyB0c3BhbkNvdW50KSAvIDIpIC0gKHRleHRIZWlnaHQgLyAyKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCA9IHlBeGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoO1xuXG4gIHlBeGlzR3JvdXAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBcIiwwKVwiKTtcblxuICBpZiAob2JqLmV4cG9ydGFibGUgJiYgb2JqLmV4cG9ydGFibGUueF9heGlzKSB7XG4gICAgeEF4aXNTZXR0aW5ncyA9IG9iai5leHBvcnRhYmxlLnhfYXhpcztcbiAgfSBlbHNlIHtcbiAgICB4QXhpc1NldHRpbmdzID0gb2JqLnhBeGlzO1xuICB9XG5cbiAgdmFyIHRpY2tGaW5kZXJYID0gYXhpc01vZHVsZS50aWNrRmluZGVyWTtcblxuICBpZiAob2JqLnhBeGlzLndpZHRoVGhyZXNob2xkID4gb2JqLmRpbWVuc2lvbnMud2lkdGgpIHtcbiAgICB2YXIgeEF4aXNUaWNrU2V0dGluZ3MgPSB7IHRpY2tMb3dlckJvdW5kOiAzLCB0aWNrVXBwZXJCb3VuZDogOCwgdGlja0dvYWw6IDYgfTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgeEF4aXNUaWNrU2V0dGluZ3MgPSB7IHRpY2tMb3dlckJvdW5kOiAzLCB0aWNrVXBwZXJCb3VuZDogOCwgdGlja0dvYWw6IDQgfTtcbiAgfVxuXG4gIHZhciB0aWNrcyA9IHRpY2tGaW5kZXJYKHhTY2FsZSwgb2JqLnhBeGlzLnRpY2tzLCB4QXhpc1RpY2tTZXR0aW5ncyk7XG5cbiAgeFNjYWxlLnJhbmdlKFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0pO1xuXG4gIHhBeGlzLnRpY2tWYWx1ZXModGlja3MpO1xuXG4gIHhBeGlzTm9kZS5jYWxsKHhBeGlzKTtcblxuICB4QXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2sgdGV4dFwiKVxuICAgIC5hdHRyKFwieVwiLCB4QXhpc09mZnNldClcbiAgICAuY2FsbChheGlzTW9kdWxlLnVwZGF0ZVRleHRYLCB4QXhpc05vZGUsIG9iaiwgeEF4aXMsIG9iai54QXhpcyk7XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLmR5bmFtaWNIZWlnaHQpIHtcbiAgICAvLyB3b3JraW5nIHdpdGggYSBkeW5hbWljIGJhciBoZWlnaHRcbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArIG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgKyBcIilcIik7XG4gIH0gZWxzZSB7XG4gICAgLy8gd29ya2luZyB3aXRoIGEgZml4ZWQgYmFyIGhlaWdodFxuICAgIHhBeGlzR3JvdXBcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgdG90YWxCYXJIZWlnaHQgKyBcIilcIik7XG4gIH1cblxuICB2YXIgeEF4aXNXaWR0aCA9IGQzLnRyYW5zZm9ybSh4QXhpc0dyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVswXSArIHhBeGlzR3JvdXAubm9kZSgpLmdldEJCb3goKS53aWR0aDtcblxuICBpZiAoeEF4aXNXaWR0aCA+IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSkge1xuXG4gICAgeFNjYWxlLnJhbmdlKFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtICh4QXhpc1dpZHRoIC0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpKV0pO1xuXG4gICAgeEF4aXNOb2RlLmNhbGwoeEF4aXMpO1xuXG4gICAgeEF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrIHRleHRcIilcbiAgICAgIC5hdHRyKFwieVwiLCB4QXhpc09mZnNldClcbiAgICAgIC5jYWxsKGF4aXNNb2R1bGUudXBkYXRlVGV4dFgsIHhBeGlzTm9kZSwgb2JqLCB4QXhpcywgb2JqLnhBeGlzKTtcblxuICB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIik7XG5cbiAgdmFyIHNpbmdsZUJhciA9IHlTY2FsZS5yYW5nZUJhbmQoKSAvIG9iai5kYXRhLnNlcmllc0Ftb3VudDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG9iai5kYXRhLnNlcmllc0Ftb3VudDsgaSsrKSB7XG5cbiAgICB2YXIgc2VyaWVzID0gc2VyaWVzR3JvdXAuYXBwZW5kKFwiZ1wiKS5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwic2VyaWVzX1wiICsgaSk7XG5cbiAgICB2YXIgYmFySXRlbSA9IHNlcmllc1xuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcImJhclwiKVxuICAgICAgLmRhdGEob2JqLmRhdGEuZGF0YSkuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJiYXIgXCIgKyBvYmoucHJlZml4ICsgXCJiYXItXCIgKyAoaSksXG4gICAgICAgIFwiZGF0YS1zZXJpZXNcIjogaSxcbiAgICAgICAgXCJkYXRhLWtleVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiBkLmtleTsgfSxcbiAgICAgICAgXCJkYXRhLWxlZ2VuZFwiOiBmdW5jdGlvbigpIHsgcmV0dXJuIG9iai5kYXRhLmtleXNbaSArIDFdOyB9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKDAsXCIgKyB5U2NhbGUoZC5rZXkpICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgYmFySXRlbS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBkLnNlcmllc1tpXS52YWwgPCAwID8gXCJuZWdhdGl2ZVwiIDogXCJwb3NpdGl2ZVwiO1xuICAgICAgICB9LFxuICAgICAgICBcInhcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiB4U2NhbGUoTWF0aC5taW4oMCwgZC5zZXJpZXNbaV0udmFsKSk7XG4gICAgICAgIH0sXG4gICAgICAgIFwieVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gaSAqIHNpbmdsZUJhcjtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3aWR0aFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIE1hdGguYWJzKHhTY2FsZShkLnNlcmllc1tpXS52YWwpIC0geFNjYWxlKDApKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJoZWlnaHRcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gc2luZ2xlQmFyOyB9XG4gICAgICB9KTtcblxuICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICB2YXIgYmFyT2Zmc2V0ID0gb2JqLmRpbWVuc2lvbnMuYmFuZHMub2Zmc2V0O1xuICAgICAgYmFySXRlbS5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcInlcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gKChpICogc2luZ2xlQmFyKSArIChzaW5nbGVCYXIgKiAoYmFyT2Zmc2V0IC8gMikpKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGVpZ2h0XCI6IHNpbmdsZUJhciAtIChzaW5nbGVCYXIgKiBiYXJPZmZzZXQpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICB9XG5cbiAgeEF4aXNOb2RlLnNlbGVjdEFsbChcImdcIilcbiAgICAuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pXG4gICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwibWlub3JcIiwgdHJ1ZSk7XG5cbiAgeEF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICBcInkxXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAob2JqLmV4cG9ydGFibGUgJiYgb2JqLmV4cG9ydGFibGUuZHluYW1pY0hlaWdodCkge1xuICAgICAgICAgIC8vIGR5bmFtaWMgaGVpZ2h0LCBzbyBjYWxjdWxhdGUgd2hlcmUgdGhlIHkxIHNob3VsZCBnb1xuICAgICAgICAgIHJldHVybiAtKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZml4ZWQgaGVpZ2h0LCBzbyB1c2UgdGhhdFxuICAgICAgICAgIHJldHVybiAtKHRvdGFsQmFySGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwieTJcIjogMFxuICB9KTtcblxuICBpZiAob2JqLmV4cG9ydGFibGUgJiYgb2JqLmV4cG9ydGFibGUuZHluYW1pY0hlaWdodCkge1xuXG4gICAgLy8gZHluYW1pYyBoZWlnaHQsIG9ubHkgbmVlZCB0byB0cmFuc2Zvcm0geC1heGlzIGdyb3VwXG4gICAgeEF4aXNHcm91cFxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSAtIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KSArIFwiKVwiKTtcblxuICB9IGVsc2Uge1xuXG4gICAgLy8gZml4ZWQgaGVpZ2h0LCBzbyB0cmFuc2Zvcm0gYWNjb3JkaW5nbHkgYW5kIG1vZGlmeSB0aGUgZGltZW5zaW9uIGZ1bmN0aW9uIGFuZCBwYXJlbnQgcmVjdHNcblxuICAgIHhBeGlzR3JvdXBcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgdG90YWxCYXJIZWlnaHQgKyBcIilcIik7XG5cbiAgICBvYmouZGltZW5zaW9ucy50b3RhbFhBeGlzSGVpZ2h0ID0geEF4aXNHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gICAgb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMudG90YWxYQXhpc0hlaWdodDsgfTtcblxuICAgIGQzLnNlbGVjdChub2RlLm5vZGUoKS5wYXJlbnROb2RlKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtYXJnaW4gPSBvYmouZGltZW5zaW9ucy5tYXJnaW47XG4gICAgICAgIHJldHVybiBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b207XG4gICAgICB9KTtcblxuICAgIGQzLnNlbGVjdChub2RlLm5vZGUoKS5wYXJlbnROb2RlKS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJiZ1wiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImhlaWdodFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpXG4gICAgICB9KTtcblxuICB9XG5cbiAgdmFyIHhBeGlzT2JqID0geyBub2RlOiB4QXhpc0dyb3VwLCBheGlzOiB4QXhpcyB9LFxuICAgICAgeUF4aXNPYmogPSB7IG5vZGU6IHlBeGlzR3JvdXAsIGF4aXM6IHlBeGlzIH07XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB4QXhpc09iaiwgXCJ4QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIHNlcmllczogc2VyaWVzLFxuICAgIHNpbmdsZUJhcjogc2luZ2xlQmFyLFxuICAgIGJhckl0ZW06IGJhckl0ZW1cbiAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhckNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvYmFyLmpzXG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIFN0YWNrZWRDb2x1bW5DaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBzd2l0Y2ggKG9iai54QXhpcy5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG5cbiAgICAgIHZhciB0aW1lSW50ZXJ2YWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZUludGVydmFsLFxuICAgICAgICAgIHRpbWVFbGFwc2VkID0gdGltZUludGVydmFsKG9iai5kYXRhLmRhdGEpO1xuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gdGltZUVsYXBzZWQ7XG5cbiAgICAgIHhBeGlzT2JqLnJhbmdlID0gWzAsIChvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIHNpbmdsZUNvbHVtbildO1xuXG4gICAgICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWwtdGltZVwiOlxuXG4gICAgICB2YXIgc2luZ2xlQ29sdW1uID0geFNjYWxlKG9iai5kYXRhLmRhdGFbMV0ua2V5KSAtIHhTY2FsZShvYmouZGF0YS5kYXRhWzBdLmtleSk7XG5cbiAgICAgIG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cC5cIiArIG9iai5wcmVmaXggKyBcInhBeGlzXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAvIDIpKSArIFwiLFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkgKyBcIilcIik7XG5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgICB2YXIgc2luZ2xlQ29sdW1uID0geFNjYWxlLnJhbmdlQmFuZCgpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSlcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB4T2Zmc2V0O1xuICAgICAgaWYgKG9iai54QXhpcy5zY2FsZSA9PT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgICAgICB4T2Zmc2V0ID0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoc2luZ2xlQ29sdW1uIC8gMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4T2Zmc2V0ID0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4T2Zmc2V0ICsgXCIsMClcIjtcbiAgICB9KVxuXG4gIC8vIEFkZCBhIGdyb3VwIGZvciBlYWNoXG4gIHZhciBzZXJpZXMgPSBzZXJpZXNHcm91cC5zZWxlY3RBbGwoXCJnLlwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzXCIpXG4gICAgLmRhdGEob2JqLmRhdGEuc3RhY2tlZERhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gb2JqLnByZWZpeCArIFwic2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzX1wiICsgKGkpOyB9KTtcblxuICAvLyBBZGQgYSByZWN0IGZvciBlYWNoIGRhdGEgcG9pbnQuXG4gIHZhciByZWN0ID0gc2VyaWVzLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAuZGF0YShmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KVxuICAgIC5lbnRlcigpLmFwcGVuZChcInJlY3RcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcImNvbHVtblwiLFxuICAgICAgXCJkYXRhLWtleVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiBkLng7IH0sXG4gICAgICBcImRhdGEtbGVnZW5kXCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQubGVnZW5kOyB9LFxuICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9LFxuICAgICAgXCJ5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShNYXRoLm1heCgwLCBkLnkwICsgZC55KSk7IH0sXG4gICAgICBcImhlaWdodFwiOiBmdW5jdGlvbihkKSB7IHJldHVybiBNYXRoLmFicyh5U2NhbGUoZC55KSAtIHlTY2FsZSgwKSk7IH0sXG4gICAgICBcIndpZHRoXCI6IHNpbmdsZUNvbHVtblxuICAgIH0pO1xuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB5QXhpc09iaiwgXCJ5QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIHNlcmllczogc2VyaWVzLFxuICAgIHJlY3Q6IHJlY3RcbiAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrZWRDb2x1bW5DaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtY29sdW1uLmpzXG4gKiogbW9kdWxlIGlkID0gMjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIFN0cmVhbWdyYXBoQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBpZiAoeFNjYWxlT2JqLm9iai50eXBlID09PSBcIm9yZGluYWxcIikge1xuICAgIHhTY2FsZS5yYW5nZVJvdW5kUG9pbnRzKFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sIDEuMCk7XG4gIH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiXG4gICAgfX0pO1xuXG4gIC8vIEFkZCBhIGdyb3VwIGZvciBlYWNoIGNhdXNlLlxuICB2YXIgc2VyaWVzID0gc2VyaWVzR3JvdXAuc2VsZWN0QWxsKFwiZy5cIiArIG9iai5wcmVmaXggKyBcInNlcmllc1wiKVxuICAgIC5kYXRhKG9iai5kYXRhLnN0YWNrZWREYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIG9iai5wcmVmaXggKyBcInNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIChpKTsgfSk7XG5cbiAgdmFyIGFyZWEgPSBkMy5zdmcuYXJlYSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0pXG4gICAgLnkwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwKTsgfSlcbiAgICAueTEoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTAgKyBkLnkpOyB9KTtcblxuICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC54KTsgfSlcbiAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55MCArIGQueSk7IH0pO1xuXG4gIHNlcmllcy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic3RyZWFtLXNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInN0cmVhbS1cIiArIChpKTtcbiAgICAgIGlmIChpID09PSBvYmouc2VyaWVzSGlnaGxpZ2h0KCkpIHtcbiAgICAgICAgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic3RyZWFtLXNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInN0cmVhbS1cIiArIChpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJkXCIsIGFyZWEpO1xuXG4gIHNlcmllcy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHsgcmV0dXJuIG9iai5wcmVmaXggKyBcInN0cmVhbS1zZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJsaW5lXCI7IH0pXG4gICAgLmF0dHIoXCJkXCIsIGxpbmUpO1xuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB5QXhpc09iaiwgXCJ5QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIHNlcmllczogc2VyaWVzLFxuICAgIGxpbmU6IGxpbmUsXG4gICAgYXJlYTogYXJlYVxuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmVhbWdyYXBoQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9zdHJlYW1ncmFwaC5qc1xuICoqIG1vZHVsZSBpZCA9IDI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBxdWFsaWZpZXJDb21wb25lbnQobm9kZSwgb2JqKSB7XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgIT09IFwiYmFyXCIpIHtcblxuICAgIHZhciB5QXhpc05vZGUgPSBub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcInlBeGlzXCIpO1xuXG4gICAgaWYgKG9iai5lZGl0YWJsZSkge1xuXG4gICAgICB2YXIgZm9yZWlnbk9iamVjdCA9IHlBeGlzTm9kZS5hcHBlbmQoXCJmb3JlaWduT2JqZWN0XCIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcImZvIFwiICsgb2JqLnByZWZpeCArIFwicXVhbGlmaWVyXCIsXG4gICAgICAgICAgXCJ3aWR0aFwiOiBcIjEwMCVcIlxuICAgICAgICB9KTtcblxuICAgICAgdmFyIGZvcmVpZ25PYmplY3RHcm91cCA9IGZvcmVpZ25PYmplY3QuYXBwZW5kKFwieGh0bWw6ZGl2XCIpXG4gICAgICAgIC5hdHRyKFwieG1sbnNcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIpO1xuXG4gICAgICB2YXIgcXVhbGlmaWVyRmllbGQgPSBmb3JlaWduT2JqZWN0R3JvdXAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcImNoYXJ0X3F1YWxpZmllciBlZGl0YWJsZS1jaGFydF9xdWFsaWZpZXJcIixcbiAgICAgICAgICBcImNvbnRlbnRFZGl0YWJsZVwiOiB0cnVlLFxuICAgICAgICAgIFwieG1sbnNcIjogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnRleHQob2JqLnF1YWxpZmllcik7XG5cbiAgICAgIGZvcmVpZ25PYmplY3RcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwid2lkdGhcIjogcXVhbGlmaWVyRmllbGQubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgMTUsXG4gICAgICAgICAgXCJoZWlnaHRcIjogcXVhbGlmaWVyRmllbGQubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArICggLSAocXVhbGlmaWVyRmllbGQubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCkgLyAyICkgKyBcIilcIlxuICAgICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHZhciBxdWFsaWZpZXJCZyA9IHlBeGlzTm9kZS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiY2hhcnRfcXVhbGlmaWVyLXRleHQtYmdcIilcbiAgICAgICAgLnRleHQob2JqLnF1YWxpZmllcilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiZHlcIjogXCIwLjMyZW1cIixcbiAgICAgICAgICBcInlcIjogXCIwXCIsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsIDApXCJcbiAgICAgICAgfSk7XG5cbiAgICAgIHZhciBxdWFsaWZpZXJUZXh0ID0geUF4aXNOb2RlLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXItdGV4dFwiKVxuICAgICAgICAudGV4dChvYmoucXVhbGlmaWVyKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkeVwiOiBcIjAuMzJlbVwiLFxuICAgICAgICAgIFwieVwiOiBcIjBcIixcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwgMClcIlxuICAgICAgICB9KTtcblxuICAgIH1cblxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBxdWFsaWZpZXJCZzogcXVhbGlmaWVyQmcsXG4gICAgcXVhbGlmaWVyVGV4dDogcXVhbGlmaWVyVGV4dFxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcXVhbGlmaWVyQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9xdWFsaWZpZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBUaXBzIGhhbmRsaW5nIG1vZHVsZS5cbiAqIEBtb2R1bGUgY2hhcnRzL2NvbXBvbmVudHMvdGlwc1xuICovXG5cbmZ1bmN0aW9uIGJpc2VjdG9yKGRhdGEsIGtleVZhbCwgc3RhY2tlZCwgaW5kZXgpIHtcbiAgaWYgKHN0YWNrZWQpIHtcbiAgICB2YXIgYXJyID0gW107XG4gICAgdmFyIGJpc2VjdCA9IGQzLmJpc2VjdG9yKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQueDsgfSkubGVmdDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyci5wdXNoKGJpc2VjdChkYXRhW2ldLCBrZXlWYWwpKTtcbiAgICB9O1xuICAgIHJldHVybiBhcnI7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJpc2VjdCA9IGQzLmJpc2VjdG9yKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQua2V5OyB9KS5sZWZ0O1xuICAgIHJldHVybiBiaXNlY3QoZGF0YSwga2V5VmFsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjdXJzb3JQb3Mob3ZlcmxheSkge1xuICByZXR1cm4ge1xuICAgIHg6IGQzLm1vdXNlKG92ZXJsYXkubm9kZSgpKVswXSxcbiAgICB5OiBkMy5tb3VzZShvdmVybGF5Lm5vZGUoKSlbMV1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0VGlwRGF0YShvYmosIGN1cnNvcikge1xuXG4gIHZhciB4U2NhbGVPYmogPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmosXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsXG4gICAgICBzY2FsZVR5cGUgPSB4U2NhbGVPYmoub2JqLnR5cGU7XG5cbiAgdmFyIHhWYWw7XG5cbiAgaWYgKHNjYWxlVHlwZSA9PT0gXCJvcmRpbmFsLXRpbWVcIiB8fCBzY2FsZVR5cGUgPT09IFwib3JkaW5hbFwiKSB7XG5cbiAgICB2YXIgb3JkaW5hbEJpc2VjdGlvbiA9IGQzLmJpc2VjdG9yKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pLmxlZnQsXG4gICAgICAgIHJhbmdlUG9zID0gb3JkaW5hbEJpc2VjdGlvbih4U2NhbGUucmFuZ2UoKSwgY3Vyc29yLngpO1xuXG4gICAgeFZhbCA9IHhTY2FsZS5kb21haW4oKVtyYW5nZVBvc107XG5cbiAgfSBlbHNlIHtcbiAgICB4VmFsID0geFNjYWxlLmludmVydChjdXJzb3IueCk7XG4gIH1cblxuICB2YXIgdGlwRGF0YTtcblxuICBpZiAob2JqLm9wdGlvbnMuc3RhY2tlZCkge1xuICAgIHZhciBkYXRhID0gb2JqLmRhdGEuc3RhY2tlZERhdGE7XG4gICAgdmFyIGkgPSBiaXNlY3RvcihkYXRhLCB4VmFsLCBvYmoub3B0aW9ucy5zdGFja2VkKTtcblxuICAgIHZhciBhcnIgPSBbXSxcbiAgICAgICAgcmVmSW5kZXg7XG5cbiAgICBmb3IgKHZhciBrID0gMDsgayA8IGRhdGEubGVuZ3RoOyBrKyspIHtcbiAgICAgIGlmIChyZWZJbmRleCkge1xuICAgICAgICBhcnIucHVzaChkYXRhW2tdW3JlZkluZGV4XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZDAgPSBkYXRhW2tdW2lba10gLSAxXSxcbiAgICAgICAgICAgIGQxID0gZGF0YVtrXVtpW2tdXTtcbiAgICAgICAgcmVmSW5kZXggPSB4VmFsIC0gZDAueCA+IGQxLnggLSB4VmFsID8gaVtrXSA6IChpW2tdIC0gMSk7XG4gICAgICAgIGFyci5wdXNoKGRhdGFba11bcmVmSW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aXBEYXRhID0gYXJyO1xuXG4gIH0gZWxzZSB7XG4gICAgdmFyIGRhdGEgPSBvYmouZGF0YS5kYXRhO1xuICAgIHZhciBpID0gYmlzZWN0b3IoZGF0YSwgeFZhbCk7XG4gICAgdmFyIGQwID0gZGF0YVtpIC0gMV0sXG4gICAgICAgIGQxID0gZGF0YVtpXTtcblxuICAgIHRpcERhdGEgPSB4VmFsIC0gZDAua2V5ID4gZDEua2V5IC0geFZhbCA/IGQxIDogZDA7XG4gIH1cblxuICByZXR1cm4gdGlwRGF0YTtcblxufVxuXG5mdW5jdGlvbiBzaG93VGlwcyh0aXBOb2Rlcywgb2JqKSB7XG5cbiAgaWYgKHRpcE5vZGVzLnhUaXBMaW5lKSB7XG4gICAgdGlwTm9kZXMueFRpcExpbmUuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgdHJ1ZSk7XG4gIH1cblxuICBpZiAodGlwTm9kZXMudGlwQm94KSB7XG4gICAgdGlwTm9kZXMudGlwQm94LmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIHRydWUpO1xuICB9XG5cbiAgaWYgKHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzKSB7XG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXMuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgdHJ1ZSk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBoaWRlVGlwcyh0aXBOb2Rlcywgb2JqKSB7XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwiY29sdW1uXCIpIHtcbiAgICBpZihvYmoub3B0aW9ucy5zdGFja2VkKXtcbiAgICAgIG9iai5yZW5kZXJlZC5wbG90LnNlcmllcy5zZWxlY3RBbGwoXCJyZWN0XCIpLmNsYXNzZWQob2JqLnByZWZpeCArIFwibXV0ZWRcIiwgZmFsc2UpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgb2JqLnJlbmRlcmVkLnBsb3QuY29sdW1uSXRlbS5zZWxlY3RBbGwoXCJyZWN0XCIpLmNsYXNzZWQob2JqLnByZWZpeCArIFwibXV0ZWRcIiwgZmFsc2UpO1xuICAgIH1cblxuICB9XG5cbiAgaWYgKHRpcE5vZGVzLnhUaXBMaW5lKSB7XG4gICAgdGlwTm9kZXMueFRpcExpbmUuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZmFsc2UpO1xuICB9XG5cbiAgaWYgKHRpcE5vZGVzLnRpcEJveCkge1xuICAgIHRpcE5vZGVzLnRpcEJveC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmYWxzZSk7XG4gIH1cblxuICBpZiAodGlwTm9kZXMudGlwUGF0aENpcmNsZXMpIHtcbiAgICB0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlcy5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmYWxzZSk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBtb3VzZUlkbGUodGlwTm9kZXMsIG9iaikge1xuICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBoaWRlVGlwcyh0aXBOb2Rlcywgb2JqKTtcbiAgfSwgb2JqLnRpcFRpbWVvdXQpO1xufVxuXG52YXIgdGltZW91dDtcblxuZnVuY3Rpb24gdGlwc01hbmFnZXIobm9kZSwgb2JqKSB7XG5cbiAgdmFyIHRpcE5vZGVzID0gYXBwZW5kVGlwR3JvdXAobm9kZSwgb2JqKTtcblxuICB2YXIgZm5zID0ge1xuICAgIGxpbmU6IExpbmVDaGFydFRpcHMsXG4gICAgbXVsdGlsaW5lOiBMaW5lQ2hhcnRUaXBzLFxuICAgIGFyZWE6IG9iai5vcHRpb25zLnN0YWNrZWQgPyBTdGFja2VkQXJlYUNoYXJ0VGlwcyA6IEFyZWFDaGFydFRpcHMsXG4gICAgY29sdW1uOiBvYmoub3B0aW9ucy5zdGFja2VkID8gU3RhY2tlZENvbHVtbkNoYXJ0VGlwcyA6IENvbHVtbkNoYXJ0VGlwcyxcbiAgICBzdHJlYW06IFN0cmVhbWdyYXBoVGlwc1xuICB9O1xuXG4gIHZhciBkYXRhUmVmZXJlbmNlO1xuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlID09PSBcIm11bHRpbGluZVwiKSB7XG4gICAgZGF0YVJlZmVyZW5jZSA9IFtvYmouZGF0YS5kYXRhWzBdLnNlcmllc1swXV07XG4gIH0gZWxzZSB7XG4gICAgZGF0YVJlZmVyZW5jZSA9IG9iai5kYXRhLmRhdGFbMF0uc2VyaWVzO1xuICB9XG5cbiAgdmFyIGlubmVyVGlwRWxlbWVudHMgPSBhcHBlbmRUaXBFbGVtZW50cyhub2RlLCBvYmosIHRpcE5vZGVzLCBkYXRhUmVmZXJlbmNlKTtcblxuICBzd2l0Y2ggKG9iai5vcHRpb25zLnR5cGUpIHtcbiAgICBjYXNlIFwibGluZVwiOlxuICAgIGNhc2UgXCJtdWx0aWxpbmVcIjpcbiAgICBjYXNlIFwiYXJlYVwiOlxuICAgIGNhc2UgXCJzdHJlYW1cIjpcblxuICAgICAgdGlwTm9kZXMub3ZlcmxheSA9IHRpcE5vZGVzLnRpcE5vZGUuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0aXBfb3ZlcmxheVwiLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICAgICAgXCJ3aWR0aFwiOiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSxcbiAgICAgICAgICBcImhlaWdodFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpXG4gICAgICAgIH0pO1xuXG4gICAgICB0aXBOb2Rlcy5vdmVybGF5XG4gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbigpIHsgc2hvd1RpcHModGlwTm9kZXMsIG9iaik7IH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkgeyBoaWRlVGlwcyh0aXBOb2Rlcywgb2JqKTsgfSlcbiAgICAgICAgLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNob3dUaXBzKHRpcE5vZGVzLCBvYmopO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gbW91c2VJZGxlKHRpcE5vZGVzLCBvYmopO1xuICAgICAgICAgIHJldHVybiBmbnNbb2JqLm9wdGlvbnMudHlwZV0odGlwTm9kZXMsIGlubmVyVGlwRWxlbWVudHMsIG9iaik7XG4gICAgICAgIH0pO1xuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJjb2x1bW5cIjpcblxuICAgICAgdmFyIGNvbHVtblJlY3RzO1xuXG4gICAgICBpZiAob2JqLm9wdGlvbnMuc3RhY2tlZCkge1xuICAgICAgICBjb2x1bW5SZWN0cyA9IG9iai5yZW5kZXJlZC5wbG90LnNlcmllcy5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29sdW1uUmVjdHMgPSBvYmoucmVuZGVyZWQucGxvdC5jb2x1bW5JdGVtLnNlbGVjdEFsbCgncmVjdCcpO1xuICAgICAgfVxuXG4gICAgICBjb2x1bW5SZWN0c1xuICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHNob3dUaXBzKHRpcE5vZGVzLCBvYmopO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gbW91c2VJZGxlKHRpcE5vZGVzLCBvYmopO1xuICAgICAgICAgIGZucy5jb2x1bW4odGlwTm9kZXMsIG9iaiwgZCwgdGhpcyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBoaWRlVGlwcyh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGJyZWFrO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gYXBwZW5kVGlwR3JvdXAobm9kZSwgb2JqKSB7XG5cbiAgdmFyIHN2Z05vZGUgPSBkMy5zZWxlY3Qobm9kZS5ub2RlKCkucGFyZW50Tm9kZSksXG4gICAgICBjaGFydE5vZGUgPSBkMy5zZWxlY3Qobm9kZS5ub2RlKCkucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcblxuICB2YXIgdGlwTm9kZSA9IHN2Z05vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgb2JqLmRpbWVuc2lvbnMubWFyZ2luLmxlZnQgKyBcIixcIiArIG9iai5kaW1lbnNpb25zLm1hcmdpbi50b3AgKyBcIilcIixcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwXCJcbiAgICB9KVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcInRpcF9zdGFja2VkXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG9iai5vcHRpb25zLnN0YWNrZWQgPyB0cnVlIDogZmFsc2U7XG4gICAgfSk7XG5cbiAgdmFyIHhUaXBMaW5lID0gdGlwTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ0aXBfbGluZS14XCIpXG4gICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZhbHNlKTtcblxuICB4VGlwTGluZS5hcHBlbmQoXCJsaW5lXCIpO1xuXG4gIHZhciB0aXBCb3ggPSB0aXBOb2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcInRpcF9ib3hcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCJcbiAgICB9KTtcblxuICB2YXIgdGlwUmVjdCA9IHRpcEJveC5hcHBlbmQoXCJyZWN0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0aXBfcmVjdFwiLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoMCwwKVwiLFxuICAgICAgXCJ3aWR0aFwiOiAxLFxuICAgICAgXCJoZWlnaHRcIjogMVxuICAgIH0pO1xuXG4gIHZhciB0aXBHcm91cCA9IHRpcEJveC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ0aXBfZ3JvdXBcIik7XG5cbiAgdmFyIGxlZ2VuZEljb24gPSBjaGFydE5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwibGVnZW5kX2l0ZW1faWNvblwiKS5ub2RlKCk7XG5cbiAgaWYgKGxlZ2VuZEljb24pIHtcbiAgICB2YXIgcmFkaXVzID0gbGVnZW5kSWNvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAvIDI7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHJhZGl1cyA9IDA7XG4gIH1cblxuICB2YXIgdGlwUGF0aENpcmNsZXMgPSB0aXBOb2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInRpcF9wYXRoLWNpcmNsZS1ncm91cFwiKTtcblxuICB2YXIgdGlwVGV4dERhdGUgPSB0aXBHcm91cFxuICAgIC5pbnNlcnQoXCJnXCIsIFwiOmZpcnN0LWNoaWxkXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1kYXRlLWdyb3VwXCIpXG4gICAgLmFwcGVuZChcInRleHRcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWRhdGVcIixcbiAgICAgIFwieFwiOiAwLFxuICAgICAgXCJ5XCI6IDAsXG4gICAgICBcImR5XCI6IFwiMWVtXCJcbiAgICB9KTtcblxuICByZXR1cm4ge1xuICAgIHN2Zzogc3ZnTm9kZSxcbiAgICB0aXBOb2RlOiB0aXBOb2RlLFxuICAgIHhUaXBMaW5lOiB4VGlwTGluZSxcbiAgICB0aXBCb3g6IHRpcEJveCxcbiAgICB0aXBSZWN0OiB0aXBSZWN0LFxuICAgIHRpcEdyb3VwOiB0aXBHcm91cCxcbiAgICBsZWdlbmRJY29uOiBsZWdlbmRJY29uLFxuICAgIHRpcFBhdGhDaXJjbGVzOiB0aXBQYXRoQ2lyY2xlcyxcbiAgICByYWRpdXM6IHJhZGl1cyxcbiAgICB0aXBUZXh0RGF0ZTogdGlwVGV4dERhdGVcbiAgfTtcblxufVxuXG5mdW5jdGlvbiBhcHBlbmRUaXBFbGVtZW50cyhub2RlLCBvYmosIHRpcE5vZGVzLCBkYXRhUmVmKSB7XG5cbiAgdmFyIHRpcFRleHRHcm91cENvbnRhaW5lciA9IHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwLWNvbnRhaW5lclwiO1xuICAgIH0pO1xuXG4gIHZhciB0aXBUZXh0R3JvdXBzID0gdGlwVGV4dEdyb3VwQ29udGFpbmVyXG4gICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgLmRhdGEoZGF0YVJlZilcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICByZXR1cm4gb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAgXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cC1cIiArIChpKTtcbiAgICB9KTtcblxuICB2YXIgbGluZUhlaWdodDtcblxuICB0aXBUZXh0R3JvdXBzLmFwcGVuZChcInRleHRcIilcbiAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkLnZhbDsgfSlcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChvYmoucHJlZml4ICsgXCJ0aXBfdGV4dCBcIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LVwiICsgKGkpKTtcbiAgICAgIH0sXG4gICAgICBcImRhdGEtc2VyaWVzXCI6IGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGQua2V5OyB9LFxuICAgICAgXCJ4XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRpcE5vZGVzLnJhZGl1cyAqIDIpICsgKHRpcE5vZGVzLnJhZGl1cyAvIDEuNSk7XG4gICAgICB9LFxuICAgICAgXCJ5XCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgbGluZUhlaWdodCA9IGxpbmVIZWlnaHQgfHwgcGFyc2VJbnQoZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwibGluZS1oZWlnaHRcIikpO1xuICAgICAgICByZXR1cm4gKGkgKyAxKSAqIGxpbmVIZWlnaHQ7XG4gICAgICB9LFxuICAgICAgXCJkeVwiOiBcIjFlbVwiXG4gICAgfSk7XG5cbiAgdGlwVGV4dEdyb3Vwc1xuICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChvYmoucHJlZml4ICsgXCJ0aXBfY2lyY2xlIFwiICsgb2JqLnByZWZpeCArIFwidGlwX2NpcmNsZS1cIiArIChpKSk7XG4gICAgICB9LFxuICAgICAgXCJyXCI6IGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIHRpcE5vZGVzLnJhZGl1czsgfSxcbiAgICAgIFwiY3hcIjogZnVuY3Rpb24oKSB7IHJldHVybiB0aXBOb2Rlcy5yYWRpdXM7IH0sXG4gICAgICBcImN5XCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuICgoaSArIDEpICogbGluZUhlaWdodCkgKyAodGlwTm9kZXMucmFkaXVzICogMS41KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlc1xuICAgIC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAuZGF0YShkYXRhUmVmKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZChcImNpcmNsZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gKG9iai5wcmVmaXggKyBcInRpcF9wYXRoLWNpcmNsZSBcIiArIG9iai5wcmVmaXggKyBcInRpcF9wYXRoLWNpcmNsZS1cIiArIChpKSk7XG4gICAgICB9LFxuICAgICAgXCJyXCI6ICh0aXBOb2Rlcy5yYWRpdXMgLyAyKSB8fCAyLjVcbiAgICB9KTtcblxuICByZXR1cm4gdGlwVGV4dEdyb3VwcztcblxufVxuXG5mdW5jdGlvbiBMaW5lQ2hhcnRUaXBzKHRpcE5vZGVzLCBpbm5lclRpcEVscywgb2JqKSB7XG5cbiAgdmFyIGN1cnNvciA9IGN1cnNvclBvcyh0aXBOb2Rlcy5vdmVybGF5KSxcbiAgICAgIHRpcERhdGEgPSBnZXRUaXBEYXRhKG9iaiwgY3Vyc29yKTtcblxuICB2YXIgaXNVbmRlZmluZWQgPSAwO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGlwRGF0YS5zZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGlwRGF0YS5zZXJpZXNbaV0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgaXNVbmRlZmluZWQrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNVbmRlZmluZWQpIHtcblxuICAgIHZhciB5Rm9ybWF0dGVyID0gcmVxdWlyZShcIi4vYXhpc1wiKS5zZXRUaWNrRm9ybWF0WSxcbiAgICAgICAgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmY7XG4gICAgICAgIGRvbWFpbiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZS5kb21haW4oKSxcbiAgICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIHRleHRcIilcbiAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICBpZiAoIW9iai55QXhpcy5wcmVmaXgpIHsgb2JqLnlBeGlzLnByZWZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKCFvYmoueUF4aXMuc3VmZml4KSB7IG9iai55QXhpcy5zdWZmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmIChkLnZhbCkge1xuICAgICAgICAgIHJldHVybiBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIm4vYVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAuY2FsbCh0aXBEYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGEua2V5KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGQudmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHkgPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcDtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGVcIilcbiAgICAgICAgLmRhdGEodGlwRGF0YS5zZXJpZXMpXG4gICAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTsgfSlcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY3hcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGlmIChkLnZhbCkgeyByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueVNjYWxlT2JqLnNjYWxlKGQudmFsKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBSZWN0XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwid2lkdGhcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5yaWdodCxcbiAgICAgICAgXCJoZWlnaHRcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5ib3R0b21cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMueFRpcExpbmUuc2VsZWN0KFwibGluZVwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIngxXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieDJcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCAtIGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIH1cblxufVxuXG5mdW5jdGlvbiBBcmVhQ2hhcnRUaXBzKHRpcE5vZGVzLCBpbm5lclRpcEVscywgb2JqKSB7XG5cbiAgdmFyIGN1cnNvciA9IGN1cnNvclBvcyh0aXBOb2Rlcy5vdmVybGF5KSxcbiAgICAgIHRpcERhdGEgPSBnZXRUaXBEYXRhKG9iaiwgY3Vyc29yKTtcblxuICB2YXIgaXNVbmRlZmluZWQgPSAwO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGlwRGF0YS5zZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGlwRGF0YS5zZXJpZXNbaV0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgaXNVbmRlZmluZWQrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNVbmRlZmluZWQpIHtcblxuICAgIHZhciB5Rm9ybWF0dGVyID0gcmVxdWlyZShcIi4vYXhpc1wiKS5zZXRUaWNrRm9ybWF0WSxcbiAgICAgICAgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmY7XG4gICAgICAgIGRvbWFpbiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZS5kb21haW4oKSxcbiAgICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIHRleHRcIilcbiAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICBpZiAoIW9iai55QXhpcy5wcmVmaXgpIHsgb2JqLnlBeGlzLnByZWZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKCFvYmoueUF4aXMuc3VmZml4KSB7IG9iai55QXhpcy5zdWZmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmIChkLnZhbCkge1xuICAgICAgICAgIHJldHVybiBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIm4vYVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAuY2FsbCh0aXBEYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGEua2V5KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGQudmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHkgPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcDtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGVcIilcbiAgICAgICAgLmRhdGEodGlwRGF0YS5zZXJpZXMpXG4gICAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTsgfSlcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY3hcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGlmIChkLnZhbCkgeyByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueVNjYWxlT2JqLnNjYWxlKGQudmFsKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBSZWN0XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwid2lkdGhcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5yaWdodCxcbiAgICAgICAgXCJoZWlnaHRcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5ib3R0b21cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMueFRpcExpbmUuc2VsZWN0KFwibGluZVwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIngxXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieDJcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCAtIGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIH1cblxufVxuXG5mdW5jdGlvbiBTdGFja2VkQXJlYUNoYXJ0VGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGlwRGF0YVtpXS55ID09PSBOYU4gfHwgdGlwRGF0YVtpXS55MCA9PT0gTmFOKSB7XG4gICAgICBpc1VuZGVmaW5lZCsrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFpc1VuZGVmaW5lZCkge1xuXG4gICAgdmFyIHlGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi9heGlzXCIpLnNldFRpY2tGb3JtYXRZLFxuICAgICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZjtcbiAgICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgICBjdHggPSB0aW1lRGlmZihkb21haW5bMF0sIGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0sIDgpO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAgdGV4dFwiKVxuICAgICAgLmRhdGEodGlwRGF0YSlcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcblxuICAgICAgICBpZiAoIW9iai55QXhpcy5wcmVmaXgpIHsgb2JqLnlBeGlzLnByZWZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKCFvYmoueUF4aXMuc3VmZml4KSB7IG9iai55QXhpcy5zdWZmaXggPSBcIlwiOyB9XG5cbiAgICAgICAgdmFyIHRleHQ7XG5cbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aXBEYXRhLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgICB0ZXh0ID0gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC5yYXcuc2VyaWVzW2ldLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHQgPSBcIm4vYVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGsgPT09IGkpIHtcbiAgICAgICAgICAgIHZhciBoYXNVbmRlZmluZWQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgICAgaGFzVW5kZWZpbmVkKys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaGFzVW5kZWZpbmVkICYmIChkLnJhdy5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIikpIHtcbiAgICAgICAgICAgICAgdGV4dCA9IG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQucmF3LnNlcmllc1tpXS52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0ZXh0ID0gXCJuL2FcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhWzBdLngpO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cFwiKVxuICAgICAgLmRhdGEodGlwRGF0YSlcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHZhciBoYXNVbmRlZmluZWQgPSAwO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbal0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgaGFzVW5kZWZpbmVkKys7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiICYmICFoYXNVbmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3A7XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKHRpcERhdGEpXG4gICAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbal0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIiAmJiAhaGFzVW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY3hcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZShkLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHZhciB5ID0gZC55IHx8IDAsXG4gICAgICAgICAgICAgICAgeTAgPSBkLnkwIHx8IDA7XG4gICAgICAgICAgICByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueVNjYWxlT2JqLnNjYWxlKHkgKyB5MCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFJlY3RcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ3aWR0aFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnJpZ2h0LFxuICAgICAgICBcImhlaWdodFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3AgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmJvdHRvbVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy54VGlwTGluZS5zZWxlY3QoXCJsaW5lXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwieDFcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieDJcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieTFcIjogMCxcbiAgICAgICAgXCJ5MlwiOiBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0IC0gZDMuc2VsZWN0KHRoaXMpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIH1cblxufVxuXG5mdW5jdGlvbiBTdHJlYW1ncmFwaFRpcHModGlwTm9kZXMsIGlubmVyVGlwRWxzLCBvYmopIHtcblxuICB2YXIgY3Vyc29yID0gY3Vyc29yUG9zKHRpcE5vZGVzLm92ZXJsYXkpLFxuICAgICAgdGlwRGF0YSA9IGdldFRpcERhdGEob2JqLCBjdXJzb3IpO1xuXG4gIHZhciBpc1VuZGVmaW5lZCA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXBEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGFbaV0ueSA9PT0gTmFOIHx8IHRpcERhdGFbaV0ueTAgPT09IE5hTikge1xuICAgICAgaXNVbmRlZmluZWQrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNVbmRlZmluZWQpIHtcblxuICAgIHZhciB5Rm9ybWF0dGVyID0gcmVxdWlyZShcIi4vYXhpc1wiKS5zZXRUaWNrRm9ybWF0WSxcbiAgICAgICAgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmY7XG4gICAgICAgIGRvbWFpbiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZS5kb21haW4oKSxcbiAgICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIHRleHRcIilcbiAgICAgIC5kYXRhKHRpcERhdGEpXG4gICAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG5cbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuXG4gICAgICAgIHZhciB0ZXh0O1xuXG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGlwRGF0YS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgdGV4dCA9IG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQucmF3LnNlcmllc1tpXS52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0ZXh0ID0gXCJuL2FcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChrID09PSBpKSB7XG4gICAgICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbal0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWhhc1VuZGVmaW5lZCAmJiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpKSB7XG4gICAgICAgICAgICAgIHRleHQgPSBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnJhdy5zZXJpZXNbaV0udmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dCA9IFwibi9hXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgIC5jYWxsKHRpcERhdGVGb3JtYXR0ZXIsIGN0eCwgb2JqLm1vbnRoc0FiciwgdGlwRGF0YVswXS54KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkLnJhdy5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIiAmJiAhaGFzVW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgeSA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wO1xuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlc1xuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF9wYXRoLWNpcmNsZVwiKVxuICAgICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIHZhciBoYXNVbmRlZmluZWQgPSAwO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgaGFzVW5kZWZpbmVkKys7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIgJiYgIWhhc1VuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUoZC54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICB2YXIgeSA9IGQueSB8fCAwLFxuICAgICAgICAgICAgICAgIHkwID0gZC55MCB8fCAwO1xuICAgICAgICAgICAgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZSh5ICsgeTApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBSZWN0XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwid2lkdGhcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5yaWdodCxcbiAgICAgICAgXCJoZWlnaHRcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5ib3R0b21cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMueFRpcExpbmUuc2VsZWN0KFwibGluZVwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIngxXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcInkxXCI6IDAsXG4gICAgICAgIFwieTJcIjogb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBCb3hcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCAtIGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gQ29sdW1uQ2hhcnRUaXBzKHRpcE5vZGVzLCBvYmosIGQsIHRoaXNSZWYpIHtcblxuICB2YXIgY29sdW1uUmVjdHMgPSBvYmoucmVuZGVyZWQucGxvdC5jb2x1bW5JdGVtLnNlbGVjdEFsbCgncmVjdCcpLFxuICAgICAgaXNVbmRlZmluZWQgPSAwO1xuXG4gIHZhciB0aGlzQ29sdW1uID0gdGhpc1JlZixcbiAgICAgIHRpcERhdGEgPSBkO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGlwRGF0YS5zZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGlwRGF0YS5zZXJpZXNbaV0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgaXNVbmRlZmluZWQrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNVbmRlZmluZWQpIHtcblxuICAgIHZhciB5Rm9ybWF0dGVyID0gcmVxdWlyZShcIi4vYXhpc1wiKS5zZXRUaWNrRm9ybWF0WSxcbiAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmLFxuICAgICAgZ2V0VHJhbnNsYXRlWFkgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikuZ2V0VHJhbnNsYXRlWFksXG4gICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICBjdHggPSB0aW1lRGlmZihkb21haW5bMF0sIGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0sIDgpO1xuXG4gICAgdmFyIGN1cnNvclggPSBnZXRUcmFuc2xhdGVYWSh0aGlzQ29sdW1uLnBhcmVudE5vZGUpO1xuXG4gICAgY29sdW1uUmVjdHNcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyAnbXV0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAodGhpcyA9PT0gdGhpc0NvbHVtbikgPyBmYWxzZSA6IHRydWU7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIHRleHRcIilcbiAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cblxuICAgICAgICBpZiAoZC52YWwpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJuL2FcIjtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBpZihvYmouZGF0ZUZvcm1hdCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAgIC5jYWxsKHRpcERhdGVGb3JtYXR0ZXIsIGN0eCwgb2JqLm1vbnRoc0FiciwgdGlwRGF0YS5rZXkpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgICAgLnRleHQodGlwRGF0YS5rZXkpO1xuICAgIH1cblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGQudmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBSZWN0XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwid2lkdGhcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5yaWdodCxcbiAgICAgICAgXCJoZWlnaHRcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5ib3R0b21cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG5cbiAgICAgICAgICBpZih4ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKXtcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCAtIGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBzaG93VGlwcyh0aXBOb2Rlcywgb2JqKTtcblxuICB9XG5cbn1cblxuXG5mdW5jdGlvbiBTdGFja2VkQ29sdW1uQ2hhcnRUaXBzKHRpcE5vZGVzLCBvYmosIGQsIHRoaXNSZWYpIHtcblxuICB2YXIgY29sdW1uUmVjdHMgPSBvYmoucmVuZGVyZWQucGxvdC5zZXJpZXMuc2VsZWN0QWxsKCdyZWN0JyksXG4gICAgICBpc1VuZGVmaW5lZCA9IDA7XG5cbiAgdmFyIHRoaXNDb2x1bW5SZWN0ID0gdGhpc1JlZixcbiAgICAgIHRpcERhdGEgPSBkO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGlwRGF0YS5yYXcuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEucmF3LnNlcmllc1tpXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICBpc1VuZGVmaW5lZCsrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFpc1VuZGVmaW5lZCkge1xuXG4gICAgdmFyIHlGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi9heGlzXCIpLnNldFRpY2tGb3JtYXRZLFxuICAgICAgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmYsXG4gICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICBjdHggPSB0aW1lRGlmZihkb21haW5bMF0sIGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0sIDgpO1xuXG4gICAgdmFyIHBhcmVudEVsID0gZDMuc2VsZWN0KHRoaXNDb2x1bW5SZWN0LnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG4gICAgdmFyIHJlZlBvcyA9IGQzLnNlbGVjdCh0aGlzQ29sdW1uUmVjdCkuYXR0cihcInhcIik7XG5cbiAgICB2YXIgdGhpc0NvbHVtbktleSA9ICcnO1xuXG4gICAgLyogRmlndXJlIG91dCB3aGljaCBzdGFjayB0aGlzIHNlbGVjdGVkIHJlY3QgaXMgaW4gdGhlbiBsb29wIGJhY2sgdGhyb3VnaCBhbmQgKHVuKWFzc2lnbiBtdXRlZCBjbGFzcyAqL1xuICAgIGNvbHVtblJlY3RzLmNsYXNzZWQob2JqLnByZWZpeCArICdtdXRlZCcsZnVuY3Rpb24gKGQpIHtcblxuICAgICAgaWYodGhpcyA9PT0gdGhpc0NvbHVtblJlY3Qpe1xuICAgICAgICB0aGlzQ29sdW1uS2V5ID0gZC5yYXcua2V5O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKHRoaXMgPT09IHRoaXNDb2x1bW5SZWN0KSA/IGZhbHNlIDogdHJ1ZTtcblxuICAgIH0pO1xuXG4gICAgY29sdW1uUmVjdHMuY2xhc3NlZChvYmoucHJlZml4ICsgJ211dGVkJyxmdW5jdGlvbiAoZCkge1xuXG4gICAgICByZXR1cm4gKGQucmF3LmtleSA9PT0gdGhpc0NvbHVtbktleSkgPyBmYWxzZSA6IHRydWU7XG5cbiAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIHRleHRcIilcbiAgICAgIC5kYXRhKHRpcERhdGEucmF3LnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcblxuICAgICAgICBpZiAoIW9iai55QXhpcy5wcmVmaXgpIHsgb2JqLnlBeGlzLnByZWZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKCFvYmoueUF4aXMuc3VmZml4KSB7IG9iai55QXhpcy5zdWZmaXggPSBcIlwiOyB9XG5cbiAgICAgICAgaWYgKGQudmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQudmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwibi9hXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgaWYob2JqLmRhdGVGb3JtYXQgIT09IHVuZGVmaW5lZCl7XG4gICAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgICAuY2FsbCh0aXBEYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGEua2V5KTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAgIC50ZXh0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBkID0gdGlwRGF0YS5yYXcua2V5O1xuICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICByZXR1cm4gKG9iai5wcmVmaXggKyBcInRpcF9jaXJjbGUgXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfY2lyY2xlLVwiICsgKGkpKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJyXCI6IGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIHRpcE5vZGVzLnJhZGl1czsgfSxcbiAgICAgICAgXCJjeFwiOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRpcE5vZGVzLnJhZGl1czsgfSxcbiAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgcmV0dXJuICggKGkgKyAxKSAqIHBhcnNlSW50KGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImZvbnQtc2l6ZVwiKSkgKiAxLjEzICsgOSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cFwiKVxuICAgICAgLmRhdGEodGlwRGF0YS5yYXcuc2VyaWVzKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGQudmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBSZWN0XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwid2lkdGhcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5yaWdodCxcbiAgICAgICAgXCJoZWlnaHRcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5ib3R0b21cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgaWYgKHJlZlBvcyA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuXG4gICAgICAgIH1cblxuICAgICAgfSk7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHRpcERhdGVGb3JtYXR0ZXIoc2VsZWN0aW9uLCBjdHgsIG1vbnRocywgZGF0YSkge1xuXG4gIHZhciBkTW9udGgsXG4gICAgICBkRGF0ZSxcbiAgICAgIGRZZWFyLFxuICAgICAgZEhvdXIsXG4gICAgICBkTWludXRlO1xuXG4gIHNlbGVjdGlvbi50ZXh0KGZ1bmN0aW9uKCkge1xuICAgIHZhciBkID0gZGF0YTtcbiAgICB2YXIgZFN0cjtcbiAgICBzd2l0Y2ggKGN0eCkge1xuICAgICAgY2FzZSBcInllYXJzXCI6XG4gICAgICAgIGRTdHIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuICAgICAgICBkTW9udGggPSBtb250aHNbZC5nZXRNb250aCgpXTtcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGRTdHIgPSBkTW9udGggKyBcIiBcIiArIGREYXRlICsgXCIsIFwiICsgZFllYXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIndlZWtzXCI6XG4gICAgICBjYXNlIFwiZGF5c1wiOlxuICAgICAgICBkTW9udGggPSBtb250aHNbZC5nZXRNb250aCgpXTtcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGRTdHIgPSBkTW9udGggKyBcIiBcIiArIGREYXRlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJob3Vyc1wiOlxuXG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIGRIb3VyID0gZC5nZXRIb3VycygpO1xuICAgICAgICBkTWludXRlID0gZC5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgdmFyIGRIb3VyU3RyLFxuICAgICAgICAgIGRNaW51dGVTdHI7XG5cbiAgICAgICAgLy8gQ29udmVydCBmcm9tIDI0aCB0aW1lXG4gICAgICAgIHZhciBzdWZmaXggPSAoZEhvdXIgPj0gMTIpID8gJ3AubS4nIDogJ2EubS4nO1xuXG4gICAgICAgIGlmIChkSG91ciA9PT0gMCkge1xuICAgICAgICAgIGRIb3VyU3RyID0gMTI7XG4gICAgICAgIH0gZWxzZSBpZiAoZEhvdXIgPiAxMikge1xuICAgICAgICAgIGRIb3VyU3RyID0gZEhvdXIgLSAxMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkSG91clN0ciA9IGRIb3VyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBtaW51dGVzIGZvbGxvdyBHbG9iZSBzdHlsZVxuICAgICAgICBpZiAoZE1pbnV0ZSA9PT0gMCkge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnJztcbiAgICAgICAgfSBlbHNlIGlmIChkTWludXRlIDwgMTApIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJzowJyArIGRNaW51dGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICc6JyArIGRNaW51dGU7XG4gICAgICAgIH1cblxuICAgICAgICBkU3RyID0gZEhvdXJTdHIgKyBkTWludXRlU3RyICsgJyAnICsgc3VmZml4O1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZFN0ciA9IGQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBkU3RyO1xuXG4gIH0pO1xuXG59XG5cblxuLy8gW2Z1bmN0aW9uIEJhckNoYXJ0VGlwcyh0aXBOb2Rlcywgb2JqKSB7XG5cbi8vIH1cblxubW9kdWxlLmV4cG9ydHMgPSB0aXBzTWFuYWdlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvdGlwcy5qc1xuICoqIG1vZHVsZSBpZCA9IDI2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIFNvY2lhbCBtb2R1bGUuXG4gKiBAbW9kdWxlIGNoYXJ0cy9jb21wb25lbnRzL3NvY2lhbFxuICovXG5cbi8qXG5UaGlzIGNvbXBvbmVudCBhZGRzIGEgXCJzb2NpYWxcIiBidXR0b24gdG8gZWFjaCBjaGFydCB3aGljaCBjYW4gYmUgdG9nZ2xlZCB0byBwcmVzZW50IHRoZSB1c2VyIHdpdGggc29jaWFsIHNoYXJpbmcgb3B0aW9uc1xuICovXG5cbnZhciBnZXRUaHVtYm5haWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikuZ2V0VGh1bWJuYWlsUGF0aDtcblxuZnVuY3Rpb24gc29jaWFsQ29tcG9uZW50KG5vZGUsIG9iaikge1xuXG5cdHZhciBzb2NpYWxPcHRpb25zID0gW107XG5cblx0Zm9yICh2YXIgcHJvcCBpbiBvYmouc29jaWFsKSB7XG5cdFx0aWYgKG9iai5zb2NpYWxbcHJvcF0pIHtcblx0XHRcdHN3aXRjaCAob2JqLnNvY2lhbFtwcm9wXS5sYWJlbCkge1xuXHRcdFx0XHRjYXNlIFwiVHdpdHRlclwiOlxuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0udXJsID0gY29uc3RydWN0VHdpdHRlclVSTChvYmopO1xuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0ucG9wdXAgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiRmFjZWJvb2tcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdEZhY2Vib29rVVJMKG9iaik7XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS5wb3B1cCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJFbWFpbFwiOlxuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0udXJsID0gY29uc3RydWN0TWFpbFVSTChvYmopO1xuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0ucG9wdXAgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIlNNU1wiOlxuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0udXJsID0gY29uc3RydWN0U01TVVJMKG9iaik7XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS5wb3B1cCA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdJTkNPUlJFQ1QgU09DSUFMIElURU0gREVGSU5JVElPTicpXG5cdFx0XHR9XG5cdFx0XHRzb2NpYWxPcHRpb25zLnB1c2gob2JqLnNvY2lhbFtwcm9wXSk7XG5cdFx0fVxuXHR9XG5cblx0dmFyIGNoYXJ0Q29udGFpbmVyID0gZDMuc2VsZWN0KG5vZGUpO1xuXG4gIHZhciBjaGFydE1ldGEgPSBjaGFydENvbnRhaW5lci5zZWxlY3QoJy4nICsgb2JqLnByZWZpeCArICdjaGFydF9tZXRhJyk7XG5cbiAgaWYgKGNoYXJ0TWV0YS5ub2RlKCkgPT09IG51bGwpIHtcbiAgICBjaGFydE1ldGEgPSBjaGFydENvbnRhaW5lclxuICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YScpO1xuICB9XG5cblx0dmFyIGNoYXJ0U29jaWFsQnRuID0gY2hhcnRNZXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGFfYnRuJylcblx0XHQuaHRtbCgnc2hhcmUnKTtcblxuXHR2YXIgY2hhcnRTb2NpYWwgPSBjaGFydENvbnRhaW5lclxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9zb2NpYWwnKTtcblxuXHR2YXIgY2hhcnRTb2NpYWxDbG9zZUJ0biA9IGNoYXJ0U29jaWFsXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X3NvY2lhbF9jbG9zZScpXG5cdFx0Lmh0bWwoJyYjeGQ3OycpO1xuXG5cdHZhciBjaGFydFNvY2lhbE9wdGlvbnMgPSBjaGFydFNvY2lhbFxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9zb2NpYWxfb3B0aW9ucycpO1xuXG5cdGNoYXJ0U29jaWFsT3B0aW9uc1xuXHRcdC5hcHBlbmQoJ2gzJylcblx0XHQuaHRtbCgnU2hhcmUgdGhpcyBjaGFydDonKTtcblxuXHRjaGFydFNvY2lhbEJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjaGFydFNvY2lhbC5jbGFzc2VkKG9iai5wcmVmaXggKyAnYWN0aXZlJywgdHJ1ZSk7XG5cdH0pO1xuXG5cdGNoYXJ0U29jaWFsQ2xvc2VCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Y2hhcnRTb2NpYWwuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIGZhbHNlKTtcblx0fSk7XG5cblx0dmFyIGl0ZW1BbW91bnQgPSBzb2NpYWxPcHRpb25zLmxlbmd0aDtcblxuXHRmb3IodmFyIGkgPSAwOyBpIDwgaXRlbUFtb3VudDsgaSsrICkge1xuXHRcdGNoYXJ0U29jaWFsT3B0aW9uc1xuXHRcdFx0LnNlbGVjdEFsbCgnLicgKyBvYmoucHJlZml4ICsgJ3NvY2lhbC1pdGVtJylcblx0XHRcdC5kYXRhKHNvY2lhbE9wdGlvbnMpXG5cdFx0XHQuZW50ZXIoKVxuXHRcdFx0LmFwcGVuZCgnZGl2Jylcblx0XHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnc29jaWFsLWl0ZW0nKS5odG1sKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0aWYgKCFkLnBvcHVwKSB7XG5cdFx0XHRcdFx0cmV0dXJuICc8YSBocmVmPVwiJyArIGQudXJsICsgJ1wiPjxpbWcgY2xhc3M9XCInICsgb2JqLnByZWZpeCArICdzb2NpYWwtaWNvblwiIHNyYz1cIicgKyBkLmljb24gKyAnXCIgdGl0bGU9XCInICsgZC5sYWJlbCArICdcIi8+PC9hPic7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuICc8YSBjbGFzcz1cIicgKyBvYmoucHJlZml4ICsgJ2pzLXNoYXJlXCIgaHJlZj1cIicgKyBkLnVybCArICdcIj48aW1nIGNsYXNzPVwiJyArIG9iai5wcmVmaXggKyAnc29jaWFsLWljb25cIiBzcmM9XCInICsgZC5pY29uICsgJ1wiIHRpdGxlPVwiJyArIGQubGFiZWwgKyAnXCIvPjwvYT4nO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fVxuXG4gIGlmIChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkge1xuICAgIGNoYXJ0U29jaWFsT3B0aW9uc1xuICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnaW1hZ2UtdXJsJylcbiAgICAgIC5hdHRyKCdjb250ZW50RWRpdGFibGUnLCAndHJ1ZScpXG4gICAgICAuaHRtbChnZXRUaHVtYm5haWwob2JqKSk7XG4gIH1cblxuXHR2YXIgc2hhcmVQb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJqcy1zaGFyZVwiKTtcblxuICBpZiAoc2hhcmVQb3B1cCkge1xuICAgIFtdLmZvckVhY2guY2FsbChzaGFyZVBvcHVwLCBmdW5jdGlvbihhbmNob3IpIHtcbiAgICAgIGFuY2hvci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHdpbmRvd1BvcHVwKHRoaXMuaHJlZiwgNjAwLCA2MjApO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuXHRyZXR1cm4ge1xuXHRcdG1ldGFfbmF2OiBjaGFydE1ldGFcblx0fTtcblxufVxuXG4vLyBzb2NpYWwgcG9wdXBcbmZ1bmN0aW9uIHdpbmRvd1BvcHVwKHVybCwgd2lkdGgsIGhlaWdodCkge1xuICAvLyBjYWxjdWxhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb3B1cCBzbyBpdOKAmXMgY2VudGVyZWQgb24gdGhlIHNjcmVlbi5cbiAgdmFyIGxlZnQgPSAoc2NyZWVuLndpZHRoIC8gMikgLSAod2lkdGggLyAyKSxcbiAgICAgIHRvcCA9IChzY3JlZW4uaGVpZ2h0IC8gMikgLSAoaGVpZ2h0IC8gMik7XG4gIHdpbmRvdy5vcGVuKFxuICAgIHVybCxcbiAgICBcIlwiLFxuICAgIFwibWVudWJhcj1ubyx0b29sYmFyPW5vLHJlc2l6YWJsZT15ZXMsc2Nyb2xsYmFycz15ZXMsd2lkdGg9XCIgKyB3aWR0aCArIFwiLGhlaWdodD1cIiArIGhlaWdodCArIFwiLHRvcD1cIiArIHRvcCArIFwiLGxlZnQ9XCIgKyBsZWZ0XG4gICk7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdEZhY2Vib29rVVJMKG9iail7XG4gIHZhciBiYXNlID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9kaWFsb2cvc2hhcmU/JyxcbiAgICAgIHJlZGlyZWN0ID0gb2JqLnNvY2lhbC5mYWNlYm9vay5yZWRpcmVjdCxcbiAgICAgIHVybCA9ICdhcHBfaWQ9JyArIG9iai5zb2NpYWwuZmFjZWJvb2suYXBwSUQgKyAnJmFtcDtkaXNwbGF5PXBvcHVwJmFtcDt0aXRsZT0nICsgb2JqLmhlYWRpbmcgKyAnJmFtcDtkZXNjcmlwdGlvbj1Gcm9tJTIwYXJ0aWNsZScgKyBkb2N1bWVudC50aXRsZSArICcmYW1wO2hyZWY9JyArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgJyZhbXA7cmVkaXJlY3RfdXJpPScgKyByZWRpcmVjdDtcbiAgaWYgKG9iai5pbWFnZSAmJiBvYmouaW1hZ2UuZW5hYmxlKSB7ICB1cmwgKz0gJyZhbXA7cGljdHVyZT0nICsgZ2V0VGh1bWJuYWlsKG9iaik7IH1cbiAgcmV0dXJuIGJhc2UgKyB1cmw7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdE1haWxVUkwob2JqKXtcbiAgdmFyIGJhc2UgPSAnbWFpbHRvOj8nO1xuICB2YXIgdGh1bWJuYWlsID0gKG9iai5pbWFnZSAmJiBvYmouaW1hZ2UuZW5hYmxlKSA/ICclMEEnICsgZ2V0VGh1bWJuYWlsKG9iaikgOiBcIlwiO1xuICByZXR1cm4gYmFzZSArICdzdWJqZWN0PScgKyBvYmouaGVhZGluZyArICcmYW1wO2JvZHk9JyArIG9iai5oZWFkaW5nICsgdGh1bWJuYWlsICsgJyUwQWZyb20gYXJ0aWNsZTogJyArIGRvY3VtZW50LnRpdGxlICsgJyUwQScgKyB3aW5kb3cubG9jYXRpb24uaHJlZjtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0U01TVVJMKG9iail7XG4gIHZhciBiYXNlID0gJ3NtczonLFxuICAgICAgdXJsID0gJyZib2R5PUNoZWNrJTIwb3V0JTIwdGhpcyUyMGNoYXJ0OiAnICsgb2JqLmhlYWRpbmc7XG4gIGlmIChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkgeyAgdXJsICs9ICclMjAnICsgZ2V0VGh1bWJuYWlsKG9iaik7IH1cbiAgcmV0dXJuIGJhc2UgKyB1cmw7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFR3aXR0ZXJVUkwob2JqKXtcbiAgdmFyIGJhc2UgPSAnaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/JyxcbiAgICAgIGhhc2h0YWcgPSAhIShvYmouc29jaWFsLnR3aXR0ZXIuaGFzaHRhZykgPyAnJmFtcDtoYXNodGFncz0nICsgb2JqLnNvY2lhbC50d2l0dGVyLmhhc2h0YWcgOiBcIlwiLFxuICAgICAgdmlhID0gISEob2JqLnNvY2lhbC50d2l0dGVyLnZpYSkgPyAnJmFtcDt2aWE9JyArIG9iai5zb2NpYWwudHdpdHRlci52aWEgOiBcIlwiLFxuICAgICAgdXJsID0gJ3VybD0nICsgd2luZG93LmxvY2F0aW9uLmhyZWYgICsgdmlhICsgJyZhbXA7dGV4dD0nICsgZW5jb2RlVVJJKG9iai5oZWFkaW5nKSArIGhhc2h0YWc7XG4gIGlmIChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkgeyAgdXJsICs9ICclMjAnICsgZ2V0VGh1bWJuYWlsKG9iaik7IH1cbiAgcmV0dXJuIGJhc2UgKyB1cmw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc29jaWFsQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zb2NpYWwuanNcbiAqKiBtb2R1bGUgaWQgPSAyN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBTaGFyaW5nIERhdGEgbW9kdWxlLlxuICogQG1vZHVsZSBjaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhXG4gKi9cblxuLypcblRoaXMgY29tcG9uZW50IGFkZHMgYSBcImRhdGFcIiBidXR0b24gdG8gZWFjaCBjaGFydCB3aGljaCBjYW4gYmUgdG9nZ2xlZCB0byBwcmVzZW50IHRoZSBjaGFydHMgZGF0YSBpbiBhIHRhYnVsYXIgZm9ybSBhbG9uZyB3aXRoIGJ1dHRvbnMgYWxsb3dpbmcgdGhlIHJhdyBkYXRhIHRvIGJlIGRvd25sb2FkZWRcbiAqL1xuXG5mdW5jdGlvbiBzaGFyZURhdGFDb21wb25lbnQobm9kZSwgb2JqKSB7XG5cbiBcdHZhciBjaGFydENvbnRhaW5lciA9IGQzLnNlbGVjdChub2RlKTtcblxuICB2YXIgY2hhcnRNZXRhID0gY2hhcnRDb250YWluZXIuc2VsZWN0KCcuJyArIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YScpO1xuXG4gIGlmIChjaGFydE1ldGEubm9kZSgpID09PSBudWxsKSB7XG4gICAgY2hhcnRNZXRhID0gY2hhcnRDb250YWluZXJcbiAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGEnKTtcbiAgfVxuXG5cdHZhciBjaGFydERhdGFCdG4gPSBjaGFydE1ldGFcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YV9idG4nKVxuXHRcdC5odG1sKCdkYXRhJyk7XG5cblx0dmFyIGNoYXJ0RGF0YSA9IGNoYXJ0Q29udGFpbmVyXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X2RhdGEnKTtcblxuXHR2YXIgY2hhcnREYXRhQ2xvc2VCdG4gPSBjaGFydERhdGFcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfZGF0YV9jbG9zZScpXG5cdFx0Lmh0bWwoJyYjeGQ3OycpO1xuXG5cdHZhciBjaGFydERhdGFUYWJsZSA9IGNoYXJ0RGF0YVxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhX2lubmVyJyk7XG5cblx0Y2hhcnREYXRhXG5cdFx0LmFwcGVuZCgnaDInKVxuXHRcdC5odG1sKG9iai5oZWFkaW5nKTtcblxuXHR2YXIgY2hhcnREYXRhTmF2ID0gY2hhcnREYXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X2RhdGFfbmF2Jyk7XG5cblx0dmFyIGNzdkRMQnRuID0gY2hhcnREYXRhTmF2XG5cdFx0LmFwcGVuZCgnYScpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhX2J0biBjc3YnKVxuXHRcdC5odG1sKCdkb3dubG9hZCBjc3YnKTtcblxuICB2YXIgY3N2VG9UYWJsZSA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS5jc3ZUb1RhYmxlO1xuXG5cdGNzdlRvVGFibGUoY2hhcnREYXRhVGFibGUsIG9iai5kYXRhLmNzdik7XG5cblx0Y2hhcnREYXRhQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNoYXJ0RGF0YS5jbGFzc2VkKG9iai5wcmVmaXggKyAnYWN0aXZlJywgdHJ1ZSk7XG5cdH0pO1xuXG5cdGNoYXJ0RGF0YUNsb3NlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNoYXJ0RGF0YS5jbGFzc2VkKG9iai5wcmVmaXggKyAnYWN0aXZlJywgZmFsc2UpO1xuXHR9KTtcblxuXHRjc3ZETEJ0bi5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuXHQgIHZhciBkbERhdGEgPSAnZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudChvYmouZGF0YS5jc3YpO1xuXHQgIGQzLnNlbGVjdCh0aGlzKVxuXHQgIFx0LmF0dHIoJ2hyZWYnLCBkbERhdGEpXG5cdCAgXHQuYXR0cignZG93bmxvYWQnLCdkYXRhXycgKyBvYmouaWQgKyAnLmNzdicpO1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdG1ldGFfbmF2OiBjaGFydE1ldGEsXG5cdFx0ZGF0YV9wYW5lbDogY2hhcnREYXRhXG5cdH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaGFyZURhdGFDb21wb25lbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NoYXJlLWRhdGEuanNcbiAqKiBtb2R1bGUgaWQgPSAyOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDdXN0b20gY29kZSBmdW5jdGlvbiB0aGF0IGNhbiBiZSBpbnZva2VkIHRvIG1vZGlmeSBjaGFydCBlbGVtZW50cyBhZnRlciBjaGFydCBkcmF3aW5nIGhhcyBvY2N1cnJlZC5cbiAqIEBwYXJhbSAge09iamVjdH0gbm9kZSAgICAgICAgIFRoZSBtYWluIGNvbnRhaW5lciBncm91cCBmb3IgdGhlIGNoYXJ0LlxuICogQHBhcmFtICB7T2JqZWN0fSBjaGFydFJlY2lwZSAgT2JqZWN0IHRoYXQgY29udGFpbnMgc2V0dGluZ3MgZm9yIHRoZSBjaGFydC5cbiAqIEBwYXJhbSAge09iamVjdH0gcmVuZGVyZWQgICAgIEFuIG9iamVjdCBjb250YWluaW5nIHJlZmVyZW5jZXMgdG8gYWxsIHJlbmRlcmVkIGNoYXJ0IGVsZW1lbnRzLCBpbmNsdWRpbmcgYXhlcywgc2NhbGVzLCBwYXRocywgbm9kZXMsIGFuZCBzbyBmb3J0aC5cbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgIE9wdGlvbmFsLlxuICovXG5mdW5jdGlvbiBjdXN0b20obm9kZSwgY2hhcnRSZWNpcGUsIHJlbmRlcmVkKSB7XG5cbiAgLy8gV2l0aCB0aGlzIGZ1bmN0aW9uLCB5b3UgY2FuIGFjY2VzcyBhbGwgZWxlbWVudHMgb2YgYSBjaGFydCBhbmQgbW9kaWZ5XG4gIC8vIHRoZW0gYXQgd2lsbC4gRm9yIGluc3RhbmNlOiB5b3UgbWlnaHQgd2FudCB0byBwbGF5IHdpdGggY29sb3VyXG4gIC8vIGludGVycG9sYXRpb24gZm9yIGEgbXVsdGktc2VyaWVzIGxpbmUgY2hhcnQsIG9yIG1vZGlmeSB0aGUgd2lkdGggYW5kIHBvc2l0aW9uXG4gIC8vIG9mIHRoZSB4LSBhbmQgeS1heGlzIHRpY2tzLiBXaXRoIHRoaXMgZnVuY3Rpb24sIHlvdSBjYW4gZG8gYWxsIHRoYXQhXG5cbiAgLy8gSWYgeW91IGNhbiwgaXQncyBnb29kIENoYXJ0IFRvb2wgcHJhY3RpY2UgdG8gcmV0dXJuIHJlZmVyZW5jZXMgdG8gbmV3bHlcbiAgLy8gY3JlYXRlZCBub2RlcyBhbmQgZDMgb2JqZWN0cyBzbyB0aGV5IGJlIGFjY2Vzc2VkIGxhdGVyIOKAlCBieSBhIGRpc3BhdGNoZXJcbiAgLy8gZXZlbnQsIGZvciBpbnN0YW5jZS5cbiAgcmV0dXJuO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3VzdG9tO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9jdXN0b20vY3VzdG9tLmpzXG4gKiogbW9kdWxlIGlkID0gMjlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=