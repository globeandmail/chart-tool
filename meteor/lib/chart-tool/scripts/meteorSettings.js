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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjFkYzExYmVmY2QxYThmY2YzY2U/NTIwYyIsIndlYnBhY2s6Ly8vLi9jdXN0b20vbWV0ZW9yLWNvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlLmpzb24/NzBmZiIsIndlYnBhY2s6Ly8vLi9jdXN0b20vY2hhcnQtdG9vbC1jb25maWcuanNvbj9kNWRkIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxlQUFjO0FBQ2Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBRzs7QUFFSDtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEc7Ozs7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHIiwiZmlsZSI6Im1ldGVvclNldHRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBmMWRjMTFiZWZjZDFhOGZjZjNjZVxuICoqLyIsInZhciBjb25maWcgPSByZXF1aXJlKFwianNvbiEuL2NoYXJ0LXRvb2wtY29uZmlnLmpzb25cIik7XG5cbmFwcF92ZXJzaW9uID0gcmVxdWlyZShcImpzb24hLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb247XG5hcHBfYnVpbGQgPSByZXF1aXJlKFwianNvbiEuLi9wYWNrYWdlLmpzb25cIikuYnVpbGRWZXI7XG5hcHBfbmFtZSA9IHJlcXVpcmUoXCJqc29uIS4uL3BhY2thZ2UuanNvblwiKS5uYW1lO1xucHJlZml4ID0gY29uZmlnLnByZWZpeDtcblxuYXBwX3NldHRpbmdzID0ge1xuXG4gIHMzOiBjb25maWcuaW1hZ2UsXG5cbiAgYW5pbWFsX2FwaTogXCJodHRwOi8vd3d3LndoaW1zaWNhbHdvcmRpbWFsLmNvbS9hcGkvbmFtZS9cIixcbiAgbmFtZXM6IFtcbiAgICBcIlNhcmRvbmljIFNhbGFtYW5kZXJcIixcbiAgICBcIk9ic3RyZXBlcm91cyBPa2FwaVwiLFxuICAgIFwiSmF1bmRpY2VkIEphZ3VhclwiLFxuICAgIFwiV2FyYmxpbmcgV3JlblwiLFxuICAgIFwiUG9udGlmaWNhdGluZyBQYW50aGVyXCIsXG4gICAgXCJDZXlsb25lc2UgQ2l2ZXRcIixcbiAgICBcIlNtdWcgU3BvbmdlXCIsXG4gICAgXCJTdGFpbmVkIFNlYWhvcnNlXCIsXG4gICAgXCJLbmlnaHRseSBLYW5nYXJvb1wiLFxuICAgIFwiVHJhZGl0aW9uYWxpc3QgVG9ydG9pc2VcIixcbiAgICBcIlN0YWxrbGVzcyBTaHJpbXBcIixcbiAgICBcIkNvbGxvaWRhbCBDb3JhbFwiLFxuICAgIFwiVGVycmlmaWVkIFRhbmdcIixcbiAgICBcIkJvb2tlZCBCYWJvb25cIlxuICBdLFxuXG4gIHNvdXJjZV9zdWZmaXg6IGNvbmZpZy5zb3VyY2Uuc3VmZml4LFxuXG4gIHByaW1hcnk6IFwiUHJpbWFyeVwiLFxuICBhbHRlcm5hdGU6IFwiQWx0ZXJuYXRlXCIsXG5cbiAgaGVscDogXCJodHRwczovL2dpdGh1Yi5jb20vZ2xvYmVhbmRtYWlsL2NoYXJ0LXRvb2wvdHJlZS9tYXN0ZXIvUkVBRE1FLm1kXCIsXG5cbiAgY2hhcnQ6IHtcbiAgICB2ZXJzaW9uOiBhcHBfdmVyc2lvbixcbiAgICBidWlsZDogYXBwX2J1aWxkLFxuICAgIHByZWZpeDogcHJlZml4LFxuICAgIHNsdWc6IFwiXCIsXG4gICAgaGVhZGluZzogXCJcIixcbiAgICBxdWFsaWZpZXI6IFwiXCIsXG4gICAgZGVjazogXCJcIixcbiAgICBjbGFzczogXCJwcmltYXJ5XCIsXG4gICAgc291cmNlOiBjb25maWcuc291cmNlLnByZWZpeCxcbiAgICBkYXRlX2Zvcm1hdDogY29uZmlnLmRhdGVGb3JtYXQsXG4gICAgdGltZV9mb3JtYXQ6IGNvbmZpZy50aW1lRm9ybWF0LFxuICAgIGhhc0hvdXJzOiBmYWxzZSxcbiAgICBkYXRhOiBcIlwiLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHR5cGU6IFwibGluZVwiLFxuICAgICAgaW50ZXJwb2xhdGlvbjogXCJsaW5lYXJcIixcbiAgICAgIHN0YWNrZWQ6IGZhbHNlLFxuICAgICAgZXhwYW5kZWQ6IGZhbHNlLFxuICAgICAgaGVhZDogdHJ1ZSxcbiAgICAgIGRlY2s6IGZhbHNlLFxuICAgICAgbGVnZW5kOiB0cnVlLFxuICAgICAgZm9vdGVyOiB0cnVlLFxuICAgICAgeF9heGlzOiB0cnVlLFxuICAgICAgeV9heGlzOiB0cnVlLFxuICAgICAgdGlwczogdHJ1ZSxcbiAgICAgIGFubm90YXRpb25zOiBmYWxzZSxcbiAgICAgIHJhbmdlOiBmYWxzZSxcbiAgICAgIHNlcmllczogZmFsc2UsXG4gICAgICBpbmRleGVkOiBmYWxzZSxcbiAgICAgIHF1YWxpZmllcjogdHJ1ZSxcbiAgICAgIHNoYXJlX2RhdGE6IHRydWUsXG4gICAgICBzb2NpYWw6IHRydWVcbiAgICB9LFxuICAgIHhfYXhpczoge1xuICAgICAgZGlzcGxheTogY29uZmlnLnhBeGlzLmRpc3BsYXksXG4gICAgICBzY2FsZTogY29uZmlnLnhBeGlzLnNjYWxlLFxuICAgICAgdGlja3M6IGNvbmZpZy54QXhpcy50aWNrcyxcbiAgICAgIG9yaWVudDogY29uZmlnLnhBeGlzLm9yaWVudCxcbiAgICAgIGZvcm1hdDogY29uZmlnLnhBeGlzLmZvcm1hdCxcbiAgICAgIHByZWZpeDogY29uZmlnLnhBeGlzLnByZWZpeCxcbiAgICAgIHN1ZmZpeDogY29uZmlnLnhBeGlzLnN1ZmZpeCxcbiAgICAgIG1pbjogY29uZmlnLnhBeGlzLm1pbixcbiAgICAgIG1heDogY29uZmlnLnhBeGlzLm1heCxcbiAgICAgIHJlc2NhbGU6IGNvbmZpZy54QXhpcy5yZXNjYWxlLFxuICAgICAgbmljZTogY29uZmlnLnhBeGlzLm5pY2VcbiAgICB9LFxuICAgIHlfYXhpczoge1xuICAgICAgZGlzcGxheTogY29uZmlnLnlBeGlzLmRpc3BsYXksXG4gICAgICBzY2FsZTogY29uZmlnLnlBeGlzLnNjYWxlLFxuICAgICAgdGlja3M6IGNvbmZpZy55QXhpcy50aWNrcyxcbiAgICAgIG9yaWVudDogY29uZmlnLnlBeGlzLm9yaWVudCxcbiAgICAgIGZvcm1hdDogY29uZmlnLnlBeGlzLmZvcm1hdCxcbiAgICAgIHByZWZpeDogY29uZmlnLnlBeGlzLnByZWZpeCxcbiAgICAgIHN1ZmZpeDogY29uZmlnLnlBeGlzLnN1ZmZpeCxcbiAgICAgIG1pbjogY29uZmlnLnlBeGlzLm1pbixcbiAgICAgIG1heDogY29uZmlnLnlBeGlzLm1heCxcbiAgICAgIHJlc2NhbGU6IGNvbmZpZy55QXhpcy5yZXNjYWxlLFxuICAgICAgbmljZTogY29uZmlnLnlBeGlzLm5pY2VcbiAgICB9LFxuXG4gICAgc2VyaWVzOiBbXSxcbiAgICBtb2JpbGU6IHt9LFxuICAgIGFubm90YXRpb25zOiBbXSxcbiAgICByYW5nZTogW10sXG5cbiAgICBwdWJsaWM6IGZhbHNlLFxuXG4gICAgdXNlcnM6IFtdLFxuICAgIHRhZ3M6IFtdLFxuXG4gICAgaW1nOiBcIlwiLFxuICAgIHByaW50OiB7XG4gICAgICBjb2x1bW5zOiBcIjJjb2xcIixcbiAgICAgIGxpbmVzOiAyMFxuICAgIH1cblxuICB9LFxuXG4gIGVtcHR5X3Nlcmllczoge1xuICAgIHN0eWxlOiBcIlwiLFxuICAgIGVtcGhhc2lzOiB7fSxcbiAgICBwb2ludGVyczoge31cbiAgfSxcblxuICBlbXB0eV9yYW5nZToge1xuICAgIC8veCBvciB5XG4gICAgYXhpczogXCJcIixcbiAgICAvL2tleSB0byB1c2UgYXMgc3RhcnQgbG9jYXRpb25cbiAgICBzdGFydDogXCJcIixcbiAgICAvL29wdGlvbmFsIC0gaWYgbm90IHNwZWNpZmllZCBhIGxpbmUgaXMgc2hvd24gaW5zdGVhZFxuICAgIGVuZDogXCJcIixcbiAgICBsYWJlbDogXCJcIlxuICB9LFxuXG4gIHByaW50OiB7XG4gICAgZ3V0dGVyX3dpZHRoOiA0LFxuICAgIGNvbHVtbl93aWR0aDogNDcsXG4gICAgZmlyc3RfbGluZV9kZXB0aDogMi4xNCxcbiAgICBsaW5lX2RlcHRoOiAzLjM1LFxuICAgIGRwaTogMjY2LCAvLyB0aGlzIGFjdHVhbGx5IGRvZXNuJ3QgbWF0dGVyIGZvciBQREZzLCBidXQgZ29vZCB0byBtYWtlIG5vdGVcbiAgICBtYWdpYzoge1xuICAgICAgd2lkdGg6IDMuNjk4LFxuICAgICAgaGVpZ2h0OiAzLjY3NVxuICAgIH0sXG4gICAgeF9heGlzOiB7XG4gICAgICB0aWNrVGFyZ2V0OiA4LFxuICAgICAgdGlja3NTbWFsbDogNSxcbiAgICAgIGR5OiAwLjcsXG4gICAgICBlbXM6IDEuMSxcbiAgICAgIHVwcGVyOiB7XG4gICAgICAgIHRpY2tIZWlnaHQ6IDQsXG4gICAgICAgIHRleHRYOiAyLFxuICAgICAgICB0ZXh0WTogMlxuICAgICAgfSxcbiAgICAgIGxvd2VyOiB7XG4gICAgICAgIHRpY2tIZWlnaHQ6IDcsXG4gICAgICAgIHRleHRYOiAyLFxuICAgICAgICB0ZXh0WTogMFxuICAgICAgfVxuICAgIH0sXG4gICAgeV9heGlzOiB7XG4gICAgICBwYWRkaW5nUmlnaHQ6IDVcbiAgICB9LFxuICAgIG1hcmdpbjoge1xuICAgICAgdG9wOiA3LFxuICAgICAgcmlnaHQ6IDIsXG4gICAgICBib3R0b206IDAsXG4gICAgICBsZWZ0OiAwXG4gICAgfVxuICB9XG5cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vY3VzdG9tL21ldGVvci1jb25maWcuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJuYW1lXCI6IFwiY2hhcnQtdG9vbFwiLFxuXHRcInZlcnNpb25cIjogXCIxLjEuMFwiLFxuXHRcImJ1aWxkVmVyXCI6IFwiMFwiLFxuXHRcImRlc2NyaXB0aW9uXCI6IFwiQSByZXNwb25zaXZlIGNoYXJ0aW5nIGFwcGxpY2F0aW9uXCIsXG5cdFwibWFpblwiOiBcImd1bHBmaWxlLmpzXCIsXG5cdFwiZGVwZW5kZW5jaWVzXCI6IHt9LFxuXHRcImRldkRlcGVuZGVuY2llc1wiOiB7XG5cdFx0XCJicm93c2VyLXN5bmNcIjogXCJeMi44LjBcIixcblx0XHRcImd1bHBcIjogXCJeMy44LjExXCIsXG5cdFx0XCJndWxwLWNsZWFuXCI6IFwiXjAuMy4xXCIsXG5cdFx0XCJndWxwLWpzb24tZWRpdG9yXCI6IFwiXjIuMi4xXCIsXG5cdFx0XCJndWxwLW1pbmlmeS1jc3NcIjogXCJeMS4yLjBcIixcblx0XHRcImd1bHAtcmVuYW1lXCI6IFwiXjEuMi4yXCIsXG5cdFx0XCJndWxwLXJlcGxhY2VcIjogXCJeMC41LjNcIixcblx0XHRcImd1bHAtc2Fzc1wiOiBcIl4yLjAuNFwiLFxuXHRcdFwiZ3VscC1zaGVsbFwiOiBcIl4wLjQuMlwiLFxuXHRcdFwiZ3VscC1zb3VyY2VtYXBzXCI6IFwiXjEuNS4yXCIsXG5cdFx0XCJndWxwLXV0aWxcIjogXCJeMy4wLjZcIixcblx0XHRcImpzZG9jXCI6IFwiXjMuMy4yXCIsXG5cdFx0XCJqc29uLWxvYWRlclwiOiBcIl4wLjUuM1wiLFxuXHRcdFwicnVuLXNlcXVlbmNlXCI6IFwiXjEuMS40XCIsXG5cdFx0XCJ3ZWJwYWNrXCI6IFwiXjEuMTIuMTRcIixcblx0XHRcIndlYnBhY2stc3RyZWFtXCI6IFwiXjMuMS4wXCIsXG5cdFx0XCJ5YXJnc1wiOiBcIl4zLjE1LjBcIlxuXHR9LFxuXHRcInNjcmlwdHNcIjoge1xuXHRcdFwidGVzdFwiOiBcIlwiXG5cdH0sXG5cdFwia2V5d29yZHNcIjogW1xuXHRcdFwiY2hhcnRzXCIsXG5cdFx0XCJkM1wiLFxuXHRcdFwiZDNqc1wiLFxuXHRcdFwibWV0ZW9yXCIsXG5cdFx0XCJndWxwXCIsXG5cdFx0XCJ3ZWJwYWNrXCIsXG5cdFx0XCJkYXRhIHZpc3VhbGl6YXRpb25cIixcblx0XHRcImNoYXJ0XCIsXG5cdFx0XCJtb25nb1wiXG5cdF0sXG5cdFwicmVwb3NpdG9yeVwiOiB7XG5cdFx0XCJ0eXBlXCI6IFwiZ2l0XCIsXG5cdFx0XCJ1cmxcIjogXCJnaXRAZ2l0aHViLmNvbTpnbG9iZWFuZG1haWwvY2hhcnQtdG9vbC5naXRcIlxuXHR9LFxuXHRcImNvbnRyaWJ1dG9yc1wiOiBbXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJUb20gQ2FyZG9zb1wiLFxuXHRcdFx0XCJlbWFpbFwiOiBcInRjYXJkb3NvQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJKZXJlbXkgQWdpdXNcIixcblx0XHRcdFwiZW1haWxcIjogXCJqYWdpdXNAZ2xvYmVhbmRtYWlsLmNvbVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcImF1dGhvclwiOiBcIk1pY2hhZWwgUGVyZWlyYVwiLFxuXHRcdFx0XCJlbWFpbFwiOiBcIm1wZXJlaXJhQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH1cblx0XSxcblx0XCJsaWNlbnNlXCI6IFwiTUlUXCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9wYWNrYWdlLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIkNVU1RPTVwiOiBmYWxzZSxcblx0XCJwcmVmaXhcIjogXCJjdC1cIixcblx0XCJtb250aHNBYnJcIjogW1xuXHRcdFwiSmFuLlwiLFxuXHRcdFwiRmViLlwiLFxuXHRcdFwiTWFyLlwiLFxuXHRcdFwiQXByLlwiLFxuXHRcdFwiTWF5XCIsXG5cdFx0XCJKdW5lXCIsXG5cdFx0XCJKdWx5XCIsXG5cdFx0XCJBdWcuXCIsXG5cdFx0XCJTZXB0LlwiLFxuXHRcdFwiT2N0LlwiLFxuXHRcdFwiTm92LlwiLFxuXHRcdFwiRGVjLlwiLFxuXHRcdFwiSmFuLlwiXG5cdF0sXG5cdFwiZGVib3VuY2VcIjogNTAwLFxuXHRcInRpcFRpbWVvdXRcIjogNTAwMCxcblx0XCJyYXRpb01vYmlsZVwiOiAxLjE1LFxuXHRcInJhdGlvRGVza3RvcFwiOiAwLjY1LFxuXHRcImRhdGVGb3JtYXRcIjogXCIlWS0lbS0lZFwiLFxuXHRcInRpbWVGb3JtYXRcIjogXCIlSDolTVwiLFxuXHRcIm1hcmdpblwiOiB7XG5cdFx0XCJ0b3BcIjogMTAsXG5cdFx0XCJyaWdodFwiOiAzLFxuXHRcdFwiYm90dG9tXCI6IDAsXG5cdFx0XCJsZWZ0XCI6IDBcblx0fSxcblx0XCJ0aXBPZmZzZXRcIjoge1xuXHRcdFwidmVydGljYWxcIjogNCxcblx0XHRcImhvcml6b250YWxcIjogMVxuXHR9LFxuXHRcInRpcFBhZGRpbmdcIjoge1xuXHRcdFwidG9wXCI6IDQsXG5cdFx0XCJyaWdodFwiOiA5LFxuXHRcdFwiYm90dG9tXCI6IDQsXG5cdFx0XCJsZWZ0XCI6IDlcblx0fSxcblx0XCJ5QXhpc1wiOiB7XG5cdFx0XCJkaXNwbGF5XCI6IHRydWUsXG5cdFx0XCJzY2FsZVwiOiBcImxpbmVhclwiLFxuXHRcdFwidGlja3NcIjogXCJhdXRvXCIsXG5cdFx0XCJvcmllbnRcIjogXCJyaWdodFwiLFxuXHRcdFwiZm9ybWF0XCI6IFwiY29tbWFcIixcblx0XHRcInByZWZpeFwiOiBcIlwiLFxuXHRcdFwic3VmZml4XCI6IFwiXCIsXG5cdFx0XCJtaW5cIjogXCJcIixcblx0XHRcIm1heFwiOiBcIlwiLFxuXHRcdFwicmVzY2FsZVwiOiBmYWxzZSxcblx0XHRcIm5pY2VcIjogdHJ1ZSxcblx0XHRcInBhZGRpbmdSaWdodFwiOiA5LFxuXHRcdFwidGlja0xvd2VyQm91bmRcIjogMyxcblx0XHRcInRpY2tVcHBlckJvdW5kXCI6IDgsXG5cdFx0XCJ0aWNrR29hbFwiOiA1LFxuXHRcdFwid2lkdGhUaHJlc2hvbGRcIjogNDIwLFxuXHRcdFwiZHlcIjogXCJcIixcblx0XHRcInRleHRYXCI6IDAsXG5cdFx0XCJ0ZXh0WVwiOiBcIlwiXG5cdH0sXG5cdFwieEF4aXNcIjoge1xuXHRcdFwiZGlzcGxheVwiOiB0cnVlLFxuXHRcdFwic2NhbGVcIjogXCJ0aW1lXCIsXG5cdFx0XCJ0aWNrc1wiOiBcImF1dG9cIixcblx0XHRcIm9yaWVudFwiOiBcImJvdHRvbVwiLFxuXHRcdFwiZm9ybWF0XCI6IFwiYXV0b1wiLFxuXHRcdFwicHJlZml4XCI6IFwiXCIsXG5cdFx0XCJzdWZmaXhcIjogXCJcIixcblx0XHRcIm1pblwiOiBcIlwiLFxuXHRcdFwibWF4XCI6IFwiXCIsXG5cdFx0XCJyZXNjYWxlXCI6IGZhbHNlLFxuXHRcdFwibmljZVwiOiBmYWxzZSxcblx0XHRcInJhbmdlUG9pbnRzXCI6IDEsXG5cdFx0XCJ0aWNrVGFyZ2V0XCI6IDYsXG5cdFx0XCJ0aWNrc1NtYWxsXCI6IDQsXG5cdFx0XCJ3aWR0aFRocmVzaG9sZFwiOiA0MjAsXG5cdFx0XCJkeVwiOiAwLjcsXG5cdFx0XCJ1cHBlclwiOiB7XG5cdFx0XHRcInRpY2tIZWlnaHRcIjogNyxcblx0XHRcdFwidGV4dFhcIjogNixcblx0XHRcdFwidGV4dFlcIjogN1xuXHRcdH0sXG5cdFx0XCJsb3dlclwiOiB7XG5cdFx0XHRcInRpY2tIZWlnaHRcIjogMTIsXG5cdFx0XHRcInRleHRYXCI6IDYsXG5cdFx0XHRcInRleHRZXCI6IDJcblx0XHR9XG5cdH0sXG5cdFwiYmFySGVpZ2h0XCI6IDMwLFxuXHRcImJhbmRzXCI6IHtcblx0XHRcInBhZGRpbmdcIjogMC4wNixcblx0XHRcIm9mZnNldFwiOiAwLjEyLFxuXHRcdFwib3V0ZXJQYWRkaW5nXCI6IDAuMDNcblx0fSxcblx0XCJzb3VyY2VcIjoge1xuXHRcdFwicHJlZml4XCI6IFwiQ0hBUlQgVE9PTFwiLFxuXHRcdFwic3VmZml4XCI6IFwiIMK7IFNPVVJDRTpcIlxuXHR9LFxuXHRcInNvY2lhbFwiOiB7XG5cdFx0XCJmYWNlYm9va1wiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiRmFjZWJvb2tcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1zb2NpYWwtZmFjZWJvb2suc3ZnXCIsXG5cdFx0XHRcInJlZGlyZWN0XCI6IFwiXCIsXG5cdFx0XHRcImFwcElEXCI6IFwiXCJcblx0XHR9LFxuXHRcdFwidHdpdHRlclwiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiVHdpdHRlclwiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLXNvY2lhbC10d2l0dGVyLnN2Z1wiLFxuXHRcdFx0XCJ2aWFcIjogXCJcIixcblx0XHRcdFwiaGFzaHRhZ1wiOiBcIlwiXG5cdFx0fSxcblx0XHRcImVtYWlsXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJFbWFpbFwiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLW1haWwuc3ZnXCJcblx0XHR9LFxuXHRcdFwic21zXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJTTVNcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS10ZWxlcGhvbmUuc3ZnXCJcblx0XHR9XG5cdH0sXG5cdFwiaW1hZ2VcIjoge1xuXHRcdFwiZW5hYmxlXCI6IGZhbHNlLFxuXHRcdFwiYmFzZV9wYXRoXCI6IFwiXCIsXG5cdFx0XCJleHBpcmF0aW9uXCI6IDMwMDAwLFxuXHRcdFwiZmlsZW5hbWVcIjogXCJ0aHVtYm5haWxcIixcblx0XHRcImV4dGVuc2lvblwiOiBcInBuZ1wiLFxuXHRcdFwidGh1bWJuYWlsV2lkdGhcIjogNDYwXG5cdH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9jdXN0b20vY2hhcnQtdG9vbC1jb25maWcuanNvblxuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==