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

	var config = __webpack_require__(3);
	
	app_version = __webpack_require__(2).version;
	app_build = __webpack_require__(2).buildVer;
	app_name = __webpack_require__(2).name;
	prefix = config.prefix;
	
	app_settings = {
	
	  s3: config.image,
	
	  animal_api: "http://www.whimsicalwordimal.com/api/name/",
	  names: [
	    "Sardonic Salamander",
	    "Obstreperous Okapi",
	    "Jaundiced Jaguar",
	    "Warbling Wren",
	    "Pontificating Panther",
	    "Ceylonese Civet",
	    "Smug Sponge",
	    "Stained Seahorse",
	    "Knightly Kangaroo",
	    "Traditionalist Tortoise",
	    "Stalkless Shrimp",
	    "Colloidal Coral",
	    "Terrified Tang",
	    "Booked Baboon"
	  ],
	
	  source_suffix: config.source.suffix,
	
	  primary: "Primary",
	  alternate: "Alternate",
	
	  help: "https://github.com/globeandmail/chart-tool/tree/master/README.md",
	
	  chart: {
	    version: app_version,
	    build: app_build,
	    prefix: prefix,
	    slug: "",
	    heading: "",
	    qualifier: "",
	    deck: "",
	    class: "primary",
	    source: config.source.prefix,
	    date_format: config.dateFormat,
	    time_format: config.timeFormat,
	    hasHours: false,
	    data: "",
	    options: {
	      type: "line",
	      interpolation: "linear",
	      stacked: false,
	      expanded: false,
	      head: true,
	      deck: false,
	      legend: true,
	      footer: true,
	      x_axis: true,
	      y_axis: true,
	      tips: true,
	      annotations: false,
	      range: false,
	      series: false,
	      indexed: false,
	      qualifier: true,
	      share_data: true,
	      social: true
	    },
	    x_axis: {
	      display: config.xAxis.display,
	      scale: config.xAxis.scale,
	      ticks: config.xAxis.ticks,
	      orient: config.xAxis.orient,
	      format: config.xAxis.format,
	      prefix: config.xAxis.prefix,
	      suffix: config.xAxis.suffix,
	      min: config.xAxis.min,
	      max: config.xAxis.max,
	      rescale: config.xAxis.rescale,
	      nice: config.xAxis.nice
	    },
	    y_axis: {
	      display: config.yAxis.display,
	      scale: config.yAxis.scale,
	      ticks: config.yAxis.ticks,
	      orient: config.yAxis.orient,
	      format: config.yAxis.format,
	      prefix: config.yAxis.prefix,
	      suffix: config.yAxis.suffix,
	      min: config.yAxis.min,
	      max: config.yAxis.max,
	      rescale: config.yAxis.rescale,
	      nice: config.yAxis.nice
	    },
	
	    series: [],
	    mobile: {},
	    annotations: [],
	    range: [],
	
	    public: false,
	
	    users: [],
	    tags: [],
	
	    img: "",
	    print: {
	      columns: "2col",
	      lines: 20
	    }
	
	  },
	
	  empty_series: {
	    style: "",
	    emphasis: {},
	    pointers: {}
	  },
	
	  empty_range: {
	    //x or y
	    axis: "",
	    //key to use as start location
	    start: "",
	    //optional - if not specified a line is shown instead
	    end: "",
	    label: ""
	  },
	
	  print: {
	    gutter_width: 4,
	    column_width: 47,
	    first_line_depth: 2.14,
	    line_depth: 3.35,
	    dpi: 266, // this actually doesn't matter for PDFs, but good to make note
	    magic: {
	      width: 3.698,
	      height: 3.675
	    },
	    x_axis: {
	      tickTarget: 8,
	      ticksSmall: 5,
	      dy: 0.7,
	      ems: 1.1,
	      barOffset: 5,
	      upper: {
	        tickHeight: 4,
	        textX: 2,
	        textY: 2
	      },
	      lower: {
	        tickHeight: 7,
	        textX: 2,
	        textY: 0
	      }
	    },
	    y_axis: {
	      paddingRight: 5
	    },
	    margin: {
	      top: 7,
	      right: 2,
	      bottom: 0,
	      left: 0
	    }
	  }
	
	};


/***/ },
/* 1 */,
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWZiNzFmZTFlYTAxNWJmYzk0MDc/NWUwYiIsIndlYnBhY2s6Ly8vLi9jdXN0b20vbWV0ZW9yLWNvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlLmpzb24/NzBmZiIsIndlYnBhY2s6Ly8vLi9jdXN0b20vY2hhcnQtdG9vbC1jb25maWcuanNvbj9kNWRkIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxlQUFjO0FBQ2Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBRzs7QUFFSDtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRyIsImZpbGUiOiJtZXRlb3JTZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgOWZiNzFmZTFlYTAxNWJmYzk0MDdcbiAqKi8iLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcImpzb24hLi9jaGFydC10b29sLWNvbmZpZy5qc29uXCIpO1xuXG5hcHBfdmVyc2lvbiA9IHJlcXVpcmUoXCJqc29uIS4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9uO1xuYXBwX2J1aWxkID0gcmVxdWlyZShcImpzb24hLi4vcGFja2FnZS5qc29uXCIpLmJ1aWxkVmVyO1xuYXBwX25hbWUgPSByZXF1aXJlKFwianNvbiEuLi9wYWNrYWdlLmpzb25cIikubmFtZTtcbnByZWZpeCA9IGNvbmZpZy5wcmVmaXg7XG5cbmFwcF9zZXR0aW5ncyA9IHtcblxuICBzMzogY29uZmlnLmltYWdlLFxuXG4gIGFuaW1hbF9hcGk6IFwiaHR0cDovL3d3dy53aGltc2ljYWx3b3JkaW1hbC5jb20vYXBpL25hbWUvXCIsXG4gIG5hbWVzOiBbXG4gICAgXCJTYXJkb25pYyBTYWxhbWFuZGVyXCIsXG4gICAgXCJPYnN0cmVwZXJvdXMgT2thcGlcIixcbiAgICBcIkphdW5kaWNlZCBKYWd1YXJcIixcbiAgICBcIldhcmJsaW5nIFdyZW5cIixcbiAgICBcIlBvbnRpZmljYXRpbmcgUGFudGhlclwiLFxuICAgIFwiQ2V5bG9uZXNlIENpdmV0XCIsXG4gICAgXCJTbXVnIFNwb25nZVwiLFxuICAgIFwiU3RhaW5lZCBTZWFob3JzZVwiLFxuICAgIFwiS25pZ2h0bHkgS2FuZ2Fyb29cIixcbiAgICBcIlRyYWRpdGlvbmFsaXN0IFRvcnRvaXNlXCIsXG4gICAgXCJTdGFsa2xlc3MgU2hyaW1wXCIsXG4gICAgXCJDb2xsb2lkYWwgQ29yYWxcIixcbiAgICBcIlRlcnJpZmllZCBUYW5nXCIsXG4gICAgXCJCb29rZWQgQmFib29uXCJcbiAgXSxcblxuICBzb3VyY2Vfc3VmZml4OiBjb25maWcuc291cmNlLnN1ZmZpeCxcblxuICBwcmltYXJ5OiBcIlByaW1hcnlcIixcbiAgYWx0ZXJuYXRlOiBcIkFsdGVybmF0ZVwiLFxuXG4gIGhlbHA6IFwiaHR0cHM6Ly9naXRodWIuY29tL2dsb2JlYW5kbWFpbC9jaGFydC10b29sL3RyZWUvbWFzdGVyL1JFQURNRS5tZFwiLFxuXG4gIGNoYXJ0OiB7XG4gICAgdmVyc2lvbjogYXBwX3ZlcnNpb24sXG4gICAgYnVpbGQ6IGFwcF9idWlsZCxcbiAgICBwcmVmaXg6IHByZWZpeCxcbiAgICBzbHVnOiBcIlwiLFxuICAgIGhlYWRpbmc6IFwiXCIsXG4gICAgcXVhbGlmaWVyOiBcIlwiLFxuICAgIGRlY2s6IFwiXCIsXG4gICAgY2xhc3M6IFwicHJpbWFyeVwiLFxuICAgIHNvdXJjZTogY29uZmlnLnNvdXJjZS5wcmVmaXgsXG4gICAgZGF0ZV9mb3JtYXQ6IGNvbmZpZy5kYXRlRm9ybWF0LFxuICAgIHRpbWVfZm9ybWF0OiBjb25maWcudGltZUZvcm1hdCxcbiAgICBoYXNIb3VyczogZmFsc2UsXG4gICAgZGF0YTogXCJcIixcbiAgICBvcHRpb25zOiB7XG4gICAgICB0eXBlOiBcImxpbmVcIixcbiAgICAgIGludGVycG9sYXRpb246IFwibGluZWFyXCIsXG4gICAgICBzdGFja2VkOiBmYWxzZSxcbiAgICAgIGV4cGFuZGVkOiBmYWxzZSxcbiAgICAgIGhlYWQ6IHRydWUsXG4gICAgICBkZWNrOiBmYWxzZSxcbiAgICAgIGxlZ2VuZDogdHJ1ZSxcbiAgICAgIGZvb3RlcjogdHJ1ZSxcbiAgICAgIHhfYXhpczogdHJ1ZSxcbiAgICAgIHlfYXhpczogdHJ1ZSxcbiAgICAgIHRpcHM6IHRydWUsXG4gICAgICBhbm5vdGF0aW9uczogZmFsc2UsXG4gICAgICByYW5nZTogZmFsc2UsXG4gICAgICBzZXJpZXM6IGZhbHNlLFxuICAgICAgaW5kZXhlZDogZmFsc2UsXG4gICAgICBxdWFsaWZpZXI6IHRydWUsXG4gICAgICBzaGFyZV9kYXRhOiB0cnVlLFxuICAgICAgc29jaWFsOiB0cnVlXG4gICAgfSxcbiAgICB4X2F4aXM6IHtcbiAgICAgIGRpc3BsYXk6IGNvbmZpZy54QXhpcy5kaXNwbGF5LFxuICAgICAgc2NhbGU6IGNvbmZpZy54QXhpcy5zY2FsZSxcbiAgICAgIHRpY2tzOiBjb25maWcueEF4aXMudGlja3MsXG4gICAgICBvcmllbnQ6IGNvbmZpZy54QXhpcy5vcmllbnQsXG4gICAgICBmb3JtYXQ6IGNvbmZpZy54QXhpcy5mb3JtYXQsXG4gICAgICBwcmVmaXg6IGNvbmZpZy54QXhpcy5wcmVmaXgsXG4gICAgICBzdWZmaXg6IGNvbmZpZy54QXhpcy5zdWZmaXgsXG4gICAgICBtaW46IGNvbmZpZy54QXhpcy5taW4sXG4gICAgICBtYXg6IGNvbmZpZy54QXhpcy5tYXgsXG4gICAgICByZXNjYWxlOiBjb25maWcueEF4aXMucmVzY2FsZSxcbiAgICAgIG5pY2U6IGNvbmZpZy54QXhpcy5uaWNlXG4gICAgfSxcbiAgICB5X2F4aXM6IHtcbiAgICAgIGRpc3BsYXk6IGNvbmZpZy55QXhpcy5kaXNwbGF5LFxuICAgICAgc2NhbGU6IGNvbmZpZy55QXhpcy5zY2FsZSxcbiAgICAgIHRpY2tzOiBjb25maWcueUF4aXMudGlja3MsXG4gICAgICBvcmllbnQ6IGNvbmZpZy55QXhpcy5vcmllbnQsXG4gICAgICBmb3JtYXQ6IGNvbmZpZy55QXhpcy5mb3JtYXQsXG4gICAgICBwcmVmaXg6IGNvbmZpZy55QXhpcy5wcmVmaXgsXG4gICAgICBzdWZmaXg6IGNvbmZpZy55QXhpcy5zdWZmaXgsXG4gICAgICBtaW46IGNvbmZpZy55QXhpcy5taW4sXG4gICAgICBtYXg6IGNvbmZpZy55QXhpcy5tYXgsXG4gICAgICByZXNjYWxlOiBjb25maWcueUF4aXMucmVzY2FsZSxcbiAgICAgIG5pY2U6IGNvbmZpZy55QXhpcy5uaWNlXG4gICAgfSxcblxuICAgIHNlcmllczogW10sXG4gICAgbW9iaWxlOiB7fSxcbiAgICBhbm5vdGF0aW9uczogW10sXG4gICAgcmFuZ2U6IFtdLFxuXG4gICAgcHVibGljOiBmYWxzZSxcblxuICAgIHVzZXJzOiBbXSxcbiAgICB0YWdzOiBbXSxcblxuICAgIGltZzogXCJcIixcbiAgICBwcmludDoge1xuICAgICAgY29sdW1uczogXCIyY29sXCIsXG4gICAgICBsaW5lczogMjBcbiAgICB9XG5cbiAgfSxcblxuICBlbXB0eV9zZXJpZXM6IHtcbiAgICBzdHlsZTogXCJcIixcbiAgICBlbXBoYXNpczoge30sXG4gICAgcG9pbnRlcnM6IHt9XG4gIH0sXG5cbiAgZW1wdHlfcmFuZ2U6IHtcbiAgICAvL3ggb3IgeVxuICAgIGF4aXM6IFwiXCIsXG4gICAgLy9rZXkgdG8gdXNlIGFzIHN0YXJ0IGxvY2F0aW9uXG4gICAgc3RhcnQ6IFwiXCIsXG4gICAgLy9vcHRpb25hbCAtIGlmIG5vdCBzcGVjaWZpZWQgYSBsaW5lIGlzIHNob3duIGluc3RlYWRcbiAgICBlbmQ6IFwiXCIsXG4gICAgbGFiZWw6IFwiXCJcbiAgfSxcblxuICBwcmludDoge1xuICAgIGd1dHRlcl93aWR0aDogNCxcbiAgICBjb2x1bW5fd2lkdGg6IDQ3LFxuICAgIGZpcnN0X2xpbmVfZGVwdGg6IDIuMTQsXG4gICAgbGluZV9kZXB0aDogMy4zNSxcbiAgICBkcGk6IDI2NiwgLy8gdGhpcyBhY3R1YWxseSBkb2Vzbid0IG1hdHRlciBmb3IgUERGcywgYnV0IGdvb2QgdG8gbWFrZSBub3RlXG4gICAgbWFnaWM6IHtcbiAgICAgIHdpZHRoOiAzLjY5OCxcbiAgICAgIGhlaWdodDogMy42NzVcbiAgICB9LFxuICAgIHhfYXhpczoge1xuICAgICAgdGlja1RhcmdldDogOCxcbiAgICAgIHRpY2tzU21hbGw6IDUsXG4gICAgICBkeTogMC43LFxuICAgICAgZW1zOiAxLjEsXG4gICAgICBiYXJPZmZzZXQ6IDUsXG4gICAgICB1cHBlcjoge1xuICAgICAgICB0aWNrSGVpZ2h0OiA0LFxuICAgICAgICB0ZXh0WDogMixcbiAgICAgICAgdGV4dFk6IDJcbiAgICAgIH0sXG4gICAgICBsb3dlcjoge1xuICAgICAgICB0aWNrSGVpZ2h0OiA3LFxuICAgICAgICB0ZXh0WDogMixcbiAgICAgICAgdGV4dFk6IDBcbiAgICAgIH1cbiAgICB9LFxuICAgIHlfYXhpczoge1xuICAgICAgcGFkZGluZ1JpZ2h0OiA1XG4gICAgfSxcbiAgICBtYXJnaW46IHtcbiAgICAgIHRvcDogNyxcbiAgICAgIHJpZ2h0OiAyLFxuICAgICAgYm90dG9tOiAwLFxuICAgICAgbGVmdDogMFxuICAgIH1cbiAgfVxuXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2N1c3RvbS9tZXRlb3ItY29uZmlnLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwibmFtZVwiOiBcImNoYXJ0LXRvb2xcIixcblx0XCJ2ZXJzaW9uXCI6IFwiMS4xLjBcIixcblx0XCJidWlsZFZlclwiOiBcIjBcIixcblx0XCJkZXNjcmlwdGlvblwiOiBcIkEgcmVzcG9uc2l2ZSBjaGFydGluZyBhcHBsaWNhdGlvblwiLFxuXHRcIm1haW5cIjogXCJndWxwZmlsZS5qc1wiLFxuXHRcImRlcGVuZGVuY2llc1wiOiB7fSxcblx0XCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiYnJvd3Nlci1zeW5jXCI6IFwiXjIuOC4wXCIsXG5cdFx0XCJndWxwXCI6IFwiXjMuOC4xMVwiLFxuXHRcdFwiZ3VscC1jbGVhblwiOiBcIl4wLjMuMVwiLFxuXHRcdFwiZ3VscC1qc29uLWVkaXRvclwiOiBcIl4yLjIuMVwiLFxuXHRcdFwiZ3VscC1taW5pZnktY3NzXCI6IFwiXjEuMi4wXCIsXG5cdFx0XCJndWxwLXJlbmFtZVwiOiBcIl4xLjIuMlwiLFxuXHRcdFwiZ3VscC1yZXBsYWNlXCI6IFwiXjAuNS4zXCIsXG5cdFx0XCJndWxwLXNhc3NcIjogXCJeMi4wLjRcIixcblx0XHRcImd1bHAtc2hlbGxcIjogXCJeMC40LjJcIixcblx0XHRcImd1bHAtc291cmNlbWFwc1wiOiBcIl4xLjUuMlwiLFxuXHRcdFwiZ3VscC11dGlsXCI6IFwiXjMuMC42XCIsXG5cdFx0XCJqc2RvY1wiOiBcIl4zLjMuMlwiLFxuXHRcdFwianNvbi1sb2FkZXJcIjogXCJeMC41LjNcIixcblx0XHRcInJ1bi1zZXF1ZW5jZVwiOiBcIl4xLjEuNFwiLFxuXHRcdFwid2VicGFja1wiOiBcIl4xLjEyLjE0XCIsXG5cdFx0XCJ3ZWJwYWNrLXN0cmVhbVwiOiBcIl4zLjEuMFwiLFxuXHRcdFwieWFyZ3NcIjogXCJeMy4xNS4wXCJcblx0fSxcblx0XCJzY3JpcHRzXCI6IHtcblx0XHRcInRlc3RcIjogXCJcIlxuXHR9LFxuXHRcImtleXdvcmRzXCI6IFtcblx0XHRcImNoYXJ0c1wiLFxuXHRcdFwiZDNcIixcblx0XHRcImQzanNcIixcblx0XHRcIm1ldGVvclwiLFxuXHRcdFwiZ3VscFwiLFxuXHRcdFwid2VicGFja1wiLFxuXHRcdFwiZGF0YSB2aXN1YWxpemF0aW9uXCIsXG5cdFx0XCJjaGFydFwiLFxuXHRcdFwibW9uZ29cIlxuXHRdLFxuXHRcInJlcG9zaXRvcnlcIjoge1xuXHRcdFwidHlwZVwiOiBcImdpdFwiLFxuXHRcdFwidXJsXCI6IFwiZ2l0QGdpdGh1Yi5jb206Z2xvYmVhbmRtYWlsL2NoYXJ0LXRvb2wuZ2l0XCJcblx0fSxcblx0XCJjb250cmlidXRvcnNcIjogW1xuXHRcdHtcblx0XHRcdFwiYXV0aG9yXCI6IFwiVG9tIENhcmRvc29cIixcblx0XHRcdFwiZW1haWxcIjogXCJ0Y2FyZG9zb0BnbG9iZWFuZG1haWwuY29tXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwiYXV0aG9yXCI6IFwiSmVyZW15IEFnaXVzXCIsXG5cdFx0XHRcImVtYWlsXCI6IFwiamFnaXVzQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJNaWNoYWVsIFBlcmVpcmFcIixcblx0XHRcdFwiZW1haWxcIjogXCJtcGVyZWlyYUBnbG9iZWFuZG1haWwuY29tXCJcblx0XHR9XG5cdF0sXG5cdFwibGljZW5zZVwiOiBcIk1JVFwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcGFja2FnZS5qc29uXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJDVVNUT01cIjogZmFsc2UsXG5cdFwicHJlZml4XCI6IFwiY3QtXCIsXG5cdFwibW9udGhzQWJyXCI6IFtcblx0XHRcIkphbi5cIixcblx0XHRcIkZlYi5cIixcblx0XHRcIk1hci5cIixcblx0XHRcIkFwci5cIixcblx0XHRcIk1heVwiLFxuXHRcdFwiSnVuZVwiLFxuXHRcdFwiSnVseVwiLFxuXHRcdFwiQXVnLlwiLFxuXHRcdFwiU2VwdC5cIixcblx0XHRcIk9jdC5cIixcblx0XHRcIk5vdi5cIixcblx0XHRcIkRlYy5cIixcblx0XHRcIkphbi5cIlxuXHRdLFxuXHRcImRlYm91bmNlXCI6IDUwMCxcblx0XCJ0aXBUaW1lb3V0XCI6IDUwMDAsXG5cdFwicmF0aW9Nb2JpbGVcIjogMS4xNSxcblx0XCJyYXRpb0Rlc2t0b3BcIjogMC42NSxcblx0XCJkYXRlRm9ybWF0XCI6IFwiJVktJW0tJWRcIixcblx0XCJ0aW1lRm9ybWF0XCI6IFwiJUg6JU1cIixcblx0XCJtYXJnaW5cIjoge1xuXHRcdFwidG9wXCI6IDEwLFxuXHRcdFwicmlnaHRcIjogMyxcblx0XHRcImJvdHRvbVwiOiAwLFxuXHRcdFwibGVmdFwiOiAwXG5cdH0sXG5cdFwidGlwT2Zmc2V0XCI6IHtcblx0XHRcInZlcnRpY2FsXCI6IDQsXG5cdFx0XCJob3Jpem9udGFsXCI6IDFcblx0fSxcblx0XCJ0aXBQYWRkaW5nXCI6IHtcblx0XHRcInRvcFwiOiA0LFxuXHRcdFwicmlnaHRcIjogOSxcblx0XHRcImJvdHRvbVwiOiA0LFxuXHRcdFwibGVmdFwiOiA5XG5cdH0sXG5cdFwieUF4aXNcIjoge1xuXHRcdFwiZGlzcGxheVwiOiB0cnVlLFxuXHRcdFwic2NhbGVcIjogXCJsaW5lYXJcIixcblx0XHRcInRpY2tzXCI6IFwiYXV0b1wiLFxuXHRcdFwib3JpZW50XCI6IFwicmlnaHRcIixcblx0XHRcImZvcm1hdFwiOiBcImNvbW1hXCIsXG5cdFx0XCJwcmVmaXhcIjogXCJcIixcblx0XHRcInN1ZmZpeFwiOiBcIlwiLFxuXHRcdFwibWluXCI6IFwiXCIsXG5cdFx0XCJtYXhcIjogXCJcIixcblx0XHRcInJlc2NhbGVcIjogZmFsc2UsXG5cdFx0XCJuaWNlXCI6IHRydWUsXG5cdFx0XCJwYWRkaW5nUmlnaHRcIjogOSxcblx0XHRcInRpY2tMb3dlckJvdW5kXCI6IDMsXG5cdFx0XCJ0aWNrVXBwZXJCb3VuZFwiOiA4LFxuXHRcdFwidGlja0dvYWxcIjogNSxcblx0XHRcIndpZHRoVGhyZXNob2xkXCI6IDQyMCxcblx0XHRcImR5XCI6IFwiXCIsXG5cdFx0XCJ0ZXh0WFwiOiAwLFxuXHRcdFwidGV4dFlcIjogXCJcIlxuXHR9LFxuXHRcInhBeGlzXCI6IHtcblx0XHRcImRpc3BsYXlcIjogdHJ1ZSxcblx0XHRcInNjYWxlXCI6IFwidGltZVwiLFxuXHRcdFwidGlja3NcIjogXCJhdXRvXCIsXG5cdFx0XCJvcmllbnRcIjogXCJib3R0b21cIixcblx0XHRcImZvcm1hdFwiOiBcImF1dG9cIixcblx0XHRcInByZWZpeFwiOiBcIlwiLFxuXHRcdFwic3VmZml4XCI6IFwiXCIsXG5cdFx0XCJtaW5cIjogXCJcIixcblx0XHRcIm1heFwiOiBcIlwiLFxuXHRcdFwicmVzY2FsZVwiOiBmYWxzZSxcblx0XHRcIm5pY2VcIjogZmFsc2UsXG5cdFx0XCJyYW5nZVBvaW50c1wiOiAxLFxuXHRcdFwidGlja1RhcmdldFwiOiA2LFxuXHRcdFwidGlja3NTbWFsbFwiOiA0LFxuXHRcdFwid2lkdGhUaHJlc2hvbGRcIjogNDIwLFxuXHRcdFwiZHlcIjogMC43LFxuXHRcdFwiYmFyT2Zmc2V0XCI6IDksXG5cdFx0XCJ1cHBlclwiOiB7XG5cdFx0XHRcInRpY2tIZWlnaHRcIjogNyxcblx0XHRcdFwidGV4dFhcIjogNixcblx0XHRcdFwidGV4dFlcIjogN1xuXHRcdH0sXG5cdFx0XCJsb3dlclwiOiB7XG5cdFx0XHRcInRpY2tIZWlnaHRcIjogMTIsXG5cdFx0XHRcInRleHRYXCI6IDYsXG5cdFx0XHRcInRleHRZXCI6IDJcblx0XHR9XG5cdH0sXG5cdFwiYmFySGVpZ2h0XCI6IDMwLFxuXHRcImJhbmRzXCI6IHtcblx0XHRcInBhZGRpbmdcIjogMC4wNixcblx0XHRcIm9mZnNldFwiOiAwLjEyLFxuXHRcdFwib3V0ZXJQYWRkaW5nXCI6IDAuMDNcblx0fSxcblx0XCJzb3VyY2VcIjoge1xuXHRcdFwicHJlZml4XCI6IFwiQ0hBUlQgVE9PTFwiLFxuXHRcdFwic3VmZml4XCI6IFwiIMK7IFNPVVJDRTpcIlxuXHR9LFxuXHRcInNvY2lhbFwiOiB7XG5cdFx0XCJmYWNlYm9va1wiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiRmFjZWJvb2tcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1zb2NpYWwtZmFjZWJvb2suc3ZnXCIsXG5cdFx0XHRcInJlZGlyZWN0XCI6IFwiXCIsXG5cdFx0XHRcImFwcElEXCI6IFwiXCJcblx0XHR9LFxuXHRcdFwidHdpdHRlclwiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiVHdpdHRlclwiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLXNvY2lhbC10d2l0dGVyLnN2Z1wiLFxuXHRcdFx0XCJ2aWFcIjogXCJcIixcblx0XHRcdFwiaGFzaHRhZ1wiOiBcIlwiXG5cdFx0fSxcblx0XHRcImVtYWlsXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJFbWFpbFwiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLW1haWwuc3ZnXCJcblx0XHR9LFxuXHRcdFwic21zXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJTTVNcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS10ZWxlcGhvbmUuc3ZnXCJcblx0XHR9XG5cdH0sXG5cdFwiaW1hZ2VcIjoge1xuXHRcdFwiZW5hYmxlXCI6IGZhbHNlLFxuXHRcdFwiYmFzZV9wYXRoXCI6IFwiXCIsXG5cdFx0XCJleHBpcmF0aW9uXCI6IDMwMDAwLFxuXHRcdFwiZmlsZW5hbWVcIjogXCJ0aHVtYm5haWxcIixcblx0XHRcImV4dGVuc2lvblwiOiBcInBuZ1wiLFxuXHRcdFwidGh1bWJuYWlsV2lkdGhcIjogNDYwXG5cdH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9jdXN0b20vY2hhcnQtdG9vbC1jb25maWcuanNvblxuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==