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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDhiNDhkZjRkYzljYjgyNzRjMTI/MjE0OCIsIndlYnBhY2s6Ly8vLi9jdXN0b20vbWV0ZW9yLWNvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlLmpzb24/NzBmZiIsIndlYnBhY2s6Ly8vLi9jdXN0b20vY2hhcnQtdG9vbC1jb25maWcuanNvbj9kNWRkIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxlQUFjO0FBQ2Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBRzs7QUFFSDtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRyIsImZpbGUiOiJtZXRlb3JTZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNDhiNDhkZjRkYzljYjgyNzRjMTJcbiAqKi8iLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcImpzb24hLi9jaGFydC10b29sLWNvbmZpZy5qc29uXCIpO1xuXG5hcHBfdmVyc2lvbiA9IHJlcXVpcmUoXCJqc29uIS4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9uO1xuYXBwX2J1aWxkID0gcmVxdWlyZShcImpzb24hLi4vcGFja2FnZS5qc29uXCIpLmJ1aWxkVmVyO1xuYXBwX25hbWUgPSByZXF1aXJlKFwianNvbiEuLi9wYWNrYWdlLmpzb25cIikubmFtZTtcbnByZWZpeCA9IGNvbmZpZy5wcmVmaXg7XG5cbmFwcF9zZXR0aW5ncyA9IHtcblxuICBzMzogY29uZmlnLmltYWdlLFxuXG4gIGFuaW1hbF9hcGk6IFwiaHR0cDovL3d3dy53aGltc2ljYWx3b3JkaW1hbC5jb20vYXBpL25hbWUvXCIsXG4gIG5hbWVzOiBbXG4gICAgXCJTYXJkb25pYyBTYWxhbWFuZGVyXCIsXG4gICAgXCJPYnN0cmVwZXJvdXMgT2thcGlcIixcbiAgICBcIkphdW5kaWNlZCBKYWd1YXJcIixcbiAgICBcIldhcmJsaW5nIFdyZW5cIixcbiAgICBcIlBvbnRpZmljYXRpbmcgUGFudGhlclwiLFxuICAgIFwiQ2V5bG9uZXNlIENpdmV0XCIsXG4gICAgXCJTbXVnIFNwb25nZVwiLFxuICAgIFwiU3RhaW5lZCBTZWFob3JzZVwiLFxuICAgIFwiS25pZ2h0bHkgS2FuZ2Fyb29cIixcbiAgICBcIlRyYWRpdGlvbmFsaXN0IFRvcnRvaXNlXCIsXG4gICAgXCJTdGFsa2xlc3MgU2hyaW1wXCIsXG4gICAgXCJDb2xsb2lkYWwgQ29yYWxcIixcbiAgICBcIlRlcnJpZmllZCBUYW5nXCIsXG4gICAgXCJCb29rZWQgQmFib29uXCJcbiAgXSxcblxuICBzb3VyY2Vfc3VmZml4OiBjb25maWcuc291cmNlLnN1ZmZpeCxcblxuICBwcmltYXJ5OiBcIlByaW1hcnlcIixcbiAgYWx0ZXJuYXRlOiBcIkFsdGVybmF0ZVwiLFxuXG4gIGhlbHA6IFwiaHR0cHM6Ly9naXRodWIuY29tL2dsb2JlYW5kbWFpbC9jaGFydC10b29sL3RyZWUvbWFzdGVyL1JFQURNRS5tZFwiLFxuXG4gIGNoYXJ0OiB7XG4gICAgdmVyc2lvbjogYXBwX3ZlcnNpb24sXG4gICAgYnVpbGQ6IGFwcF9idWlsZCxcbiAgICBwcmVmaXg6IHByZWZpeCxcbiAgICBzbHVnOiBcIlwiLFxuICAgIGhlYWRpbmc6IFwiXCIsXG4gICAgcXVhbGlmaWVyOiBcIlwiLFxuICAgIGRlY2s6IFwiXCIsXG4gICAgY2xhc3M6IFwicHJpbWFyeVwiLFxuICAgIHNvdXJjZTogY29uZmlnLnNvdXJjZS5wcmVmaXgsXG4gICAgZGF0ZV9mb3JtYXQ6IGNvbmZpZy5kYXRlRm9ybWF0LFxuICAgIHRpbWVfZm9ybWF0OiBjb25maWcudGltZUZvcm1hdCxcbiAgICBoYXNIb3VyczogZmFsc2UsXG4gICAgZGF0YTogXCJcIixcbiAgICBvcHRpb25zOiB7XG4gICAgICB0eXBlOiBcImxpbmVcIixcbiAgICAgIGludGVycG9sYXRpb246IFwibGluZWFyXCIsXG4gICAgICBzdGFja2VkOiBmYWxzZSxcbiAgICAgIGV4cGFuZGVkOiBmYWxzZSxcbiAgICAgIGhlYWQ6IHRydWUsXG4gICAgICBkZWNrOiBmYWxzZSxcbiAgICAgIGxlZ2VuZDogdHJ1ZSxcbiAgICAgIGZvb3RlcjogdHJ1ZSxcbiAgICAgIHhfYXhpczogdHJ1ZSxcbiAgICAgIHlfYXhpczogdHJ1ZSxcbiAgICAgIHRpcHM6IHRydWUsXG4gICAgICBhbm5vdGF0aW9uczogZmFsc2UsXG4gICAgICByYW5nZTogZmFsc2UsXG4gICAgICBzZXJpZXM6IGZhbHNlLFxuICAgICAgaW5kZXhlZDogZmFsc2UsXG4gICAgICBxdWFsaWZpZXI6IHRydWUsXG4gICAgICBzaGFyZV9kYXRhOiB0cnVlLFxuICAgICAgc29jaWFsOiB0cnVlXG4gICAgfSxcbiAgICB4X2F4aXM6IHtcbiAgICAgIGRpc3BsYXk6IGNvbmZpZy54QXhpcy5kaXNwbGF5LFxuICAgICAgc2NhbGU6IGNvbmZpZy54QXhpcy5zY2FsZSxcbiAgICAgIHRpY2tzOiBjb25maWcueEF4aXMudGlja3MsXG4gICAgICBvcmllbnQ6IGNvbmZpZy54QXhpcy5vcmllbnQsXG4gICAgICBmb3JtYXQ6IGNvbmZpZy54QXhpcy5mb3JtYXQsXG4gICAgICBwcmVmaXg6IGNvbmZpZy54QXhpcy5wcmVmaXgsXG4gICAgICBzdWZmaXg6IGNvbmZpZy54QXhpcy5zdWZmaXgsXG4gICAgICBtaW46IGNvbmZpZy54QXhpcy5taW4sXG4gICAgICBtYXg6IGNvbmZpZy54QXhpcy5tYXgsXG4gICAgICByZXNjYWxlOiBjb25maWcueEF4aXMucmVzY2FsZSxcbiAgICAgIG5pY2U6IGNvbmZpZy54QXhpcy5uaWNlXG4gICAgfSxcbiAgICB5X2F4aXM6IHtcbiAgICAgIGRpc3BsYXk6IGNvbmZpZy55QXhpcy5kaXNwbGF5LFxuICAgICAgc2NhbGU6IGNvbmZpZy55QXhpcy5zY2FsZSxcbiAgICAgIHRpY2tzOiBjb25maWcueUF4aXMudGlja3MsXG4gICAgICBvcmllbnQ6IGNvbmZpZy55QXhpcy5vcmllbnQsXG4gICAgICBmb3JtYXQ6IGNvbmZpZy55QXhpcy5mb3JtYXQsXG4gICAgICBwcmVmaXg6IGNvbmZpZy55QXhpcy5wcmVmaXgsXG4gICAgICBzdWZmaXg6IGNvbmZpZy55QXhpcy5zdWZmaXgsXG4gICAgICBtaW46IGNvbmZpZy55QXhpcy5taW4sXG4gICAgICBtYXg6IGNvbmZpZy55QXhpcy5tYXgsXG4gICAgICByZXNjYWxlOiBjb25maWcueUF4aXMucmVzY2FsZSxcbiAgICAgIG5pY2U6IGNvbmZpZy55QXhpcy5uaWNlXG4gICAgfSxcblxuICAgIHNlcmllczogW10sXG4gICAgbW9iaWxlOiB7fSxcbiAgICBhbm5vdGF0aW9uczogW10sXG4gICAgcmFuZ2U6IFtdLFxuXG4gICAgcHVibGljOiBmYWxzZSxcblxuICAgIHVzZXJzOiBbXSxcbiAgICB0YWdzOiBbXSxcblxuICAgIGltZzogXCJcIixcbiAgICBwcmludDoge1xuICAgICAgY29sdW1uczogXCIyY29sXCIsXG4gICAgICBsaW5lczogMjBcbiAgICB9XG5cbiAgfSxcblxuICBlbXB0eV9zZXJpZXM6IHtcbiAgICBzdHlsZTogXCJcIixcbiAgICBlbXBoYXNpczoge30sXG4gICAgcG9pbnRlcnM6IHt9XG4gIH0sXG5cbiAgZW1wdHlfcmFuZ2U6IHtcbiAgICAvL3ggb3IgeVxuICAgIGF4aXM6IFwiXCIsXG4gICAgLy9rZXkgdG8gdXNlIGFzIHN0YXJ0IGxvY2F0aW9uXG4gICAgc3RhcnQ6IFwiXCIsXG4gICAgLy9vcHRpb25hbCAtIGlmIG5vdCBzcGVjaWZpZWQgYSBsaW5lIGlzIHNob3duIGluc3RlYWRcbiAgICBlbmQ6IFwiXCIsXG4gICAgbGFiZWw6IFwiXCJcbiAgfSxcblxuICBwcmludDoge1xuICAgIGd1dHRlcl93aWR0aDogNCxcbiAgICBjb2x1bW5fd2lkdGg6IDQ3LFxuICAgIGZpcnN0X2xpbmVfZGVwdGg6IDIuMTQsXG4gICAgbGluZV9kZXB0aDogMy4zNSxcbiAgICBkcGk6IDI2NiwgLy8gdGhpcyBhY3R1YWxseSBkb2Vzbid0IG1hdHRlciBmb3IgUERGcywgYnV0IGdvb2QgdG8gbWFrZSBub3RlXG4gICAgbWFnaWM6IHtcbiAgICAgIHdpZHRoOiAzLjY5OCxcbiAgICAgIGhlaWdodDogMy42NzVcbiAgICB9LFxuICAgIHhfYXhpczoge1xuICAgICAgdGlja1RhcmdldDogOCxcbiAgICAgIHRpY2tzU21hbGw6IDUsXG4gICAgICBkeTogMC43LFxuICAgICAgZW1zOiAxLjEsXG4gICAgICBiYXJPZmZzZXQ6IDUsXG4gICAgICB1cHBlcjoge1xuICAgICAgICB0aWNrSGVpZ2h0OiA0LFxuICAgICAgICB0ZXh0WDogMixcbiAgICAgICAgdGV4dFk6IDJcbiAgICAgIH0sXG4gICAgICBsb3dlcjoge1xuICAgICAgICB0aWNrSGVpZ2h0OiA3LFxuICAgICAgICB0ZXh0WDogMixcbiAgICAgICAgdGV4dFk6IDBcbiAgICAgIH1cbiAgICB9LFxuICAgIHlfYXhpczoge1xuICAgICAgcGFkZGluZ1JpZ2h0OiA1XG4gICAgfSxcbiAgICBtYXJnaW46IHtcbiAgICAgIHRvcDogNyxcbiAgICAgIHJpZ2h0OiAyLFxuICAgICAgYm90dG9tOiAwLFxuICAgICAgbGVmdDogMFxuICAgIH1cbiAgfVxuXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2N1c3RvbS9tZXRlb3ItY29uZmlnLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwibmFtZVwiOiBcImNoYXJ0LXRvb2xcIixcblx0XCJ2ZXJzaW9uXCI6IFwiMS4xLjFcIixcblx0XCJidWlsZFZlclwiOiBcIjBcIixcblx0XCJkZXNjcmlwdGlvblwiOiBcIkEgcmVzcG9uc2l2ZSBjaGFydGluZyBhcHBsaWNhdGlvblwiLFxuXHRcIm1haW5cIjogXCJndWxwZmlsZS5qc1wiLFxuXHRcImRlcGVuZGVuY2llc1wiOiB7fSxcblx0XCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiYnJvd3Nlci1zeW5jXCI6IFwiXjIuMTUuMFwiLFxuXHRcdFwiZ3VscFwiOiBcIl4zLjguMTFcIixcblx0XHRcImd1bHAtY2xlYW5cIjogXCJeMC4zLjFcIixcblx0XHRcImd1bHAtanNvbi1lZGl0b3JcIjogXCJeMi4yLjFcIixcblx0XHRcImd1bHAtbWluaWZ5LWNzc1wiOiBcIl4xLjIuMFwiLFxuXHRcdFwiZ3VscC1yZW5hbWVcIjogXCJeMS4yLjJcIixcblx0XHRcImd1bHAtcmVwbGFjZVwiOiBcIl4wLjUuM1wiLFxuXHRcdFwiZ3VscC1zYXNzXCI6IFwiXjIuMy4yXCIsXG5cdFx0XCJndWxwLXNoZWxsXCI6IFwiXjAuNS4yXCIsXG5cdFx0XCJndWxwLXNvdXJjZW1hcHNcIjogXCJeMS41LjJcIixcblx0XHRcImd1bHAtdXRpbFwiOiBcIl4zLjAuNlwiLFxuXHRcdFwianNkb2NcIjogXCJeMy4zLjJcIixcblx0XHRcImpzb24tbG9hZGVyXCI6IFwiXjAuNS4zXCIsXG5cdFx0XCJydW4tc2VxdWVuY2VcIjogXCJeMS4yLjJcIixcblx0XHRcIndlYnBhY2tcIjogXCJeMS4xMy4yXCIsXG5cdFx0XCJ3ZWJwYWNrLXN0cmVhbVwiOiBcIl4zLjEuMFwiLFxuXHRcdFwieWFyZ3NcIjogXCJeNS4wLjBcIlxuXHR9LFxuXHRcInNjcmlwdHNcIjoge1xuXHRcdFwidGVzdFwiOiBcIlwiXG5cdH0sXG5cdFwia2V5d29yZHNcIjogW1xuXHRcdFwiY2hhcnRzXCIsXG5cdFx0XCJkM1wiLFxuXHRcdFwiZDNqc1wiLFxuXHRcdFwibWV0ZW9yXCIsXG5cdFx0XCJndWxwXCIsXG5cdFx0XCJ3ZWJwYWNrXCIsXG5cdFx0XCJkYXRhIHZpc3VhbGl6YXRpb25cIixcblx0XHRcImNoYXJ0XCIsXG5cdFx0XCJtb25nb1wiXG5cdF0sXG5cdFwicmVwb3NpdG9yeVwiOiB7XG5cdFx0XCJ0eXBlXCI6IFwiZ2l0XCIsXG5cdFx0XCJ1cmxcIjogXCJnaXRAZ2l0aHViLmNvbTpnbG9iZWFuZG1haWwvY2hhcnQtdG9vbC5naXRcIlxuXHR9LFxuXHRcImNvbnRyaWJ1dG9yc1wiOiBbXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJUb20gQ2FyZG9zb1wiLFxuXHRcdFx0XCJlbWFpbFwiOiBcInRjYXJkb3NvQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJKZXJlbXkgQWdpdXNcIixcblx0XHRcdFwiZW1haWxcIjogXCJqYWdpdXNAZ2xvYmVhbmRtYWlsLmNvbVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcImF1dGhvclwiOiBcIk1pY2hhZWwgUGVyZWlyYVwiLFxuXHRcdFx0XCJlbWFpbFwiOiBcIm1wZXJlaXJhQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH1cblx0XSxcblx0XCJsaWNlbnNlXCI6IFwiTUlUXCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9wYWNrYWdlLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIkNVU1RPTVwiOiBmYWxzZSxcblx0XCJwcmVmaXhcIjogXCJjdC1cIixcblx0XCJtb250aHNBYnJcIjogW1xuXHRcdFwiSmFuLlwiLFxuXHRcdFwiRmViLlwiLFxuXHRcdFwiTWFyLlwiLFxuXHRcdFwiQXByLlwiLFxuXHRcdFwiTWF5XCIsXG5cdFx0XCJKdW5lXCIsXG5cdFx0XCJKdWx5XCIsXG5cdFx0XCJBdWcuXCIsXG5cdFx0XCJTZXB0LlwiLFxuXHRcdFwiT2N0LlwiLFxuXHRcdFwiTm92LlwiLFxuXHRcdFwiRGVjLlwiLFxuXHRcdFwiSmFuLlwiXG5cdF0sXG5cdFwiZGVib3VuY2VcIjogNTAwLFxuXHRcInRpcFRpbWVvdXRcIjogNTAwMCxcblx0XCJyYXRpb01vYmlsZVwiOiAxLjE1LFxuXHRcInJhdGlvRGVza3RvcFwiOiAwLjY1LFxuXHRcImRhdGVGb3JtYXRcIjogXCIlWS0lbS0lZFwiLFxuXHRcInRpbWVGb3JtYXRcIjogXCIlSDolTVwiLFxuXHRcIm1hcmdpblwiOiB7XG5cdFx0XCJ0b3BcIjogMTAsXG5cdFx0XCJyaWdodFwiOiAzLFxuXHRcdFwiYm90dG9tXCI6IDAsXG5cdFx0XCJsZWZ0XCI6IDBcblx0fSxcblx0XCJ0aXBPZmZzZXRcIjoge1xuXHRcdFwidmVydGljYWxcIjogNCxcblx0XHRcImhvcml6b250YWxcIjogMVxuXHR9LFxuXHRcInRpcFBhZGRpbmdcIjoge1xuXHRcdFwidG9wXCI6IDQsXG5cdFx0XCJyaWdodFwiOiA5LFxuXHRcdFwiYm90dG9tXCI6IDQsXG5cdFx0XCJsZWZ0XCI6IDlcblx0fSxcblx0XCJ5QXhpc1wiOiB7XG5cdFx0XCJkaXNwbGF5XCI6IHRydWUsXG5cdFx0XCJzY2FsZVwiOiBcImxpbmVhclwiLFxuXHRcdFwidGlja3NcIjogXCJhdXRvXCIsXG5cdFx0XCJvcmllbnRcIjogXCJyaWdodFwiLFxuXHRcdFwiZm9ybWF0XCI6IFwiY29tbWFcIixcblx0XHRcInByZWZpeFwiOiBcIlwiLFxuXHRcdFwic3VmZml4XCI6IFwiXCIsXG5cdFx0XCJtaW5cIjogXCJcIixcblx0XHRcIm1heFwiOiBcIlwiLFxuXHRcdFwicmVzY2FsZVwiOiBmYWxzZSxcblx0XHRcIm5pY2VcIjogdHJ1ZSxcblx0XHRcInBhZGRpbmdSaWdodFwiOiA5LFxuXHRcdFwidGlja0xvd2VyQm91bmRcIjogMyxcblx0XHRcInRpY2tVcHBlckJvdW5kXCI6IDgsXG5cdFx0XCJ0aWNrR29hbFwiOiA1LFxuXHRcdFwid2lkdGhUaHJlc2hvbGRcIjogNDIwLFxuXHRcdFwiZHlcIjogXCJcIixcblx0XHRcInRleHRYXCI6IDAsXG5cdFx0XCJ0ZXh0WVwiOiBcIlwiXG5cdH0sXG5cdFwieEF4aXNcIjoge1xuXHRcdFwiZGlzcGxheVwiOiB0cnVlLFxuXHRcdFwic2NhbGVcIjogXCJ0aW1lXCIsXG5cdFx0XCJ0aWNrc1wiOiBcImF1dG9cIixcblx0XHRcIm9yaWVudFwiOiBcImJvdHRvbVwiLFxuXHRcdFwiZm9ybWF0XCI6IFwiYXV0b1wiLFxuXHRcdFwicHJlZml4XCI6IFwiXCIsXG5cdFx0XCJzdWZmaXhcIjogXCJcIixcblx0XHRcIm1pblwiOiBcIlwiLFxuXHRcdFwibWF4XCI6IFwiXCIsXG5cdFx0XCJyZXNjYWxlXCI6IGZhbHNlLFxuXHRcdFwibmljZVwiOiBmYWxzZSxcblx0XHRcInJhbmdlUG9pbnRzXCI6IDEsXG5cdFx0XCJ0aWNrVGFyZ2V0XCI6IDYsXG5cdFx0XCJ0aWNrc1NtYWxsXCI6IDQsXG5cdFx0XCJ3aWR0aFRocmVzaG9sZFwiOiA0MjAsXG5cdFx0XCJkeVwiOiAwLjcsXG5cdFx0XCJiYXJPZmZzZXRcIjogOSxcblx0XHRcInVwcGVyXCI6IHtcblx0XHRcdFwidGlja0hlaWdodFwiOiA3LFxuXHRcdFx0XCJ0ZXh0WFwiOiA2LFxuXHRcdFx0XCJ0ZXh0WVwiOiA3XG5cdFx0fSxcblx0XHRcImxvd2VyXCI6IHtcblx0XHRcdFwidGlja0hlaWdodFwiOiAxMixcblx0XHRcdFwidGV4dFhcIjogNixcblx0XHRcdFwidGV4dFlcIjogMlxuXHRcdH1cblx0fSxcblx0XCJiYXJIZWlnaHRcIjogMzAsXG5cdFwiYmFuZHNcIjoge1xuXHRcdFwicGFkZGluZ1wiOiAwLjA2LFxuXHRcdFwib2Zmc2V0XCI6IDAuMTIsXG5cdFx0XCJvdXRlclBhZGRpbmdcIjogMC4wM1xuXHR9LFxuXHRcInNvdXJjZVwiOiB7XG5cdFx0XCJwcmVmaXhcIjogXCJDSEFSVCBUT09MXCIsXG5cdFx0XCJzdWZmaXhcIjogXCIgwrsgU09VUkNFOlwiXG5cdH0sXG5cdFwic29jaWFsXCI6IHtcblx0XHRcImZhY2Vib29rXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJGYWNlYm9va1wiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLXNvY2lhbC1mYWNlYm9vay5zdmdcIixcblx0XHRcdFwicmVkaXJlY3RcIjogXCJcIixcblx0XHRcdFwiYXBwSURcIjogXCJcIlxuXHRcdH0sXG5cdFx0XCJ0d2l0dGVyXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJUd2l0dGVyXCIsXG5cdFx0XHRcImljb25cIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb3VuZGljb25zLzMuMC4wL3N2Z3MvZmktc29jaWFsLXR3aXR0ZXIuc3ZnXCIsXG5cdFx0XHRcInZpYVwiOiBcIlwiLFxuXHRcdFx0XCJoYXNodGFnXCI6IFwiXCJcblx0XHR9LFxuXHRcdFwiZW1haWxcIjoge1xuXHRcdFx0XCJsYWJlbFwiOiBcIkVtYWlsXCIsXG5cdFx0XHRcImljb25cIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb3VuZGljb25zLzMuMC4wL3N2Z3MvZmktbWFpbC5zdmdcIlxuXHRcdH0sXG5cdFx0XCJzbXNcIjoge1xuXHRcdFx0XCJsYWJlbFwiOiBcIlNNU1wiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLXRlbGVwaG9uZS5zdmdcIlxuXHRcdH1cblx0fSxcblx0XCJpbWFnZVwiOiB7XG5cdFx0XCJlbmFibGVcIjogZmFsc2UsXG5cdFx0XCJiYXNlX3BhdGhcIjogXCJcIixcblx0XHRcImV4cGlyYXRpb25cIjogMzAwMDAsXG5cdFx0XCJmaWxlbmFtZVwiOiBcInRodW1ibmFpbFwiLFxuXHRcdFwiZXh0ZW5zaW9uXCI6IFwicG5nXCIsXG5cdFx0XCJ0aHVtYm5haWxXaWR0aFwiOiA0NjBcblx0fVxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9