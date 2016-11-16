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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmM1M2ZjYTY0NTAwYjJmMWU3MTQ/ZTkzNiIsIndlYnBhY2s6Ly8vLi9jdXN0b20vbWV0ZW9yLWNvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlLmpzb24/NzBmZiIsIndlYnBhY2s6Ly8vLi9jdXN0b20vY2hhcnQtdG9vbC1jb25maWcuanNvbj9kNWRkIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxlQUFjO0FBQ2Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBRzs7QUFFSDtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRyIsImZpbGUiOiJtZXRlb3JTZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDJjNTNmY2E2NDUwMGIyZjFlNzE0IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoXCJqc29uIS4vY2hhcnQtdG9vbC1jb25maWcuanNvblwiKTtcblxuYXBwX3ZlcnNpb24gPSByZXF1aXJlKFwianNvbiEuLi9wYWNrYWdlLmpzb25cIikudmVyc2lvbjtcbmFwcF9idWlsZCA9IHJlcXVpcmUoXCJqc29uIS4uL3BhY2thZ2UuanNvblwiKS5idWlsZFZlcjtcbmFwcF9uYW1lID0gcmVxdWlyZShcImpzb24hLi4vcGFja2FnZS5qc29uXCIpLm5hbWU7XG5wcmVmaXggPSBjb25maWcucHJlZml4O1xuXG5hcHBfc2V0dGluZ3MgPSB7XG5cbiAgczM6IGNvbmZpZy5pbWFnZSxcblxuICBhbmltYWxfYXBpOiBcImh0dHA6Ly93d3cud2hpbXNpY2Fsd29yZGltYWwuY29tL2FwaS9uYW1lL1wiLFxuICBuYW1lczogW1xuICAgIFwiU2FyZG9uaWMgU2FsYW1hbmRlclwiLFxuICAgIFwiT2JzdHJlcGVyb3VzIE9rYXBpXCIsXG4gICAgXCJKYXVuZGljZWQgSmFndWFyXCIsXG4gICAgXCJXYXJibGluZyBXcmVuXCIsXG4gICAgXCJQb250aWZpY2F0aW5nIFBhbnRoZXJcIixcbiAgICBcIkNleWxvbmVzZSBDaXZldFwiLFxuICAgIFwiU211ZyBTcG9uZ2VcIixcbiAgICBcIlN0YWluZWQgU2VhaG9yc2VcIixcbiAgICBcIktuaWdodGx5IEthbmdhcm9vXCIsXG4gICAgXCJUcmFkaXRpb25hbGlzdCBUb3J0b2lzZVwiLFxuICAgIFwiU3RhbGtsZXNzIFNocmltcFwiLFxuICAgIFwiQ29sbG9pZGFsIENvcmFsXCIsXG4gICAgXCJUZXJyaWZpZWQgVGFuZ1wiLFxuICAgIFwiQm9va2VkIEJhYm9vblwiXG4gIF0sXG5cbiAgc291cmNlX3N1ZmZpeDogY29uZmlnLnNvdXJjZS5zdWZmaXgsXG5cbiAgcHJpbWFyeTogXCJQcmltYXJ5XCIsXG4gIGFsdGVybmF0ZTogXCJBbHRlcm5hdGVcIixcblxuICBoZWxwOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9nbG9iZWFuZG1haWwvY2hhcnQtdG9vbC90cmVlL21hc3Rlci9SRUFETUUubWRcIixcblxuICBjaGFydDoge1xuICAgIHZlcnNpb246IGFwcF92ZXJzaW9uLFxuICAgIGJ1aWxkOiBhcHBfYnVpbGQsXG4gICAgcHJlZml4OiBwcmVmaXgsXG4gICAgc2x1ZzogXCJcIixcbiAgICBoZWFkaW5nOiBcIlwiLFxuICAgIHF1YWxpZmllcjogXCJcIixcbiAgICBkZWNrOiBcIlwiLFxuICAgIGNsYXNzOiBcInByaW1hcnlcIixcbiAgICBzb3VyY2U6IGNvbmZpZy5zb3VyY2UucHJlZml4LFxuICAgIGRhdGVfZm9ybWF0OiBjb25maWcuZGF0ZUZvcm1hdCxcbiAgICB0aW1lX2Zvcm1hdDogY29uZmlnLnRpbWVGb3JtYXQsXG4gICAgaGFzSG91cnM6IGZhbHNlLFxuICAgIGRhdGE6IFwiXCIsXG4gICAgb3B0aW9uczoge1xuICAgICAgdHlwZTogXCJsaW5lXCIsXG4gICAgICBpbnRlcnBvbGF0aW9uOiBcImxpbmVhclwiLFxuICAgICAgc3RhY2tlZDogZmFsc2UsXG4gICAgICBleHBhbmRlZDogZmFsc2UsXG4gICAgICBoZWFkOiB0cnVlLFxuICAgICAgZGVjazogZmFsc2UsXG4gICAgICBsZWdlbmQ6IHRydWUsXG4gICAgICBmb290ZXI6IHRydWUsXG4gICAgICB4X2F4aXM6IHRydWUsXG4gICAgICB5X2F4aXM6IHRydWUsXG4gICAgICB0aXBzOiB0cnVlLFxuICAgICAgYW5ub3RhdGlvbnM6IGZhbHNlLFxuICAgICAgcmFuZ2U6IGZhbHNlLFxuICAgICAgc2VyaWVzOiBmYWxzZSxcbiAgICAgIGluZGV4ZWQ6IGZhbHNlLFxuICAgICAgcXVhbGlmaWVyOiB0cnVlLFxuICAgICAgc2hhcmVfZGF0YTogdHJ1ZSxcbiAgICAgIHNvY2lhbDogdHJ1ZVxuICAgIH0sXG4gICAgeF9heGlzOiB7XG4gICAgICBkaXNwbGF5OiBjb25maWcueEF4aXMuZGlzcGxheSxcbiAgICAgIHNjYWxlOiBjb25maWcueEF4aXMuc2NhbGUsXG4gICAgICB0aWNrczogY29uZmlnLnhBeGlzLnRpY2tzLFxuICAgICAgb3JpZW50OiBjb25maWcueEF4aXMub3JpZW50LFxuICAgICAgZm9ybWF0OiBjb25maWcueEF4aXMuZm9ybWF0LFxuICAgICAgcHJlZml4OiBjb25maWcueEF4aXMucHJlZml4LFxuICAgICAgc3VmZml4OiBjb25maWcueEF4aXMuc3VmZml4LFxuICAgICAgbWluOiBjb25maWcueEF4aXMubWluLFxuICAgICAgbWF4OiBjb25maWcueEF4aXMubWF4LFxuICAgICAgcmVzY2FsZTogY29uZmlnLnhBeGlzLnJlc2NhbGUsXG4gICAgICBuaWNlOiBjb25maWcueEF4aXMubmljZVxuICAgIH0sXG4gICAgeV9heGlzOiB7XG4gICAgICBkaXNwbGF5OiBjb25maWcueUF4aXMuZGlzcGxheSxcbiAgICAgIHNjYWxlOiBjb25maWcueUF4aXMuc2NhbGUsXG4gICAgICB0aWNrczogY29uZmlnLnlBeGlzLnRpY2tzLFxuICAgICAgb3JpZW50OiBjb25maWcueUF4aXMub3JpZW50LFxuICAgICAgZm9ybWF0OiBjb25maWcueUF4aXMuZm9ybWF0LFxuICAgICAgcHJlZml4OiBjb25maWcueUF4aXMucHJlZml4LFxuICAgICAgc3VmZml4OiBjb25maWcueUF4aXMuc3VmZml4LFxuICAgICAgbWluOiBjb25maWcueUF4aXMubWluLFxuICAgICAgbWF4OiBjb25maWcueUF4aXMubWF4LFxuICAgICAgcmVzY2FsZTogY29uZmlnLnlBeGlzLnJlc2NhbGUsXG4gICAgICBuaWNlOiBjb25maWcueUF4aXMubmljZVxuICAgIH0sXG5cbiAgICBzZXJpZXM6IFtdLFxuICAgIG1vYmlsZToge30sXG4gICAgYW5ub3RhdGlvbnM6IFtdLFxuICAgIHJhbmdlOiBbXSxcblxuICAgIHB1YmxpYzogZmFsc2UsXG5cbiAgICB1c2VyczogW10sXG4gICAgdGFnczogW10sXG5cbiAgICBpbWc6IFwiXCIsXG4gICAgcHJpbnQ6IHtcbiAgICAgIGNvbHVtbnM6IFwiMmNvbFwiLFxuICAgICAgbGluZXM6IDIwXG4gICAgfVxuXG4gIH0sXG5cbiAgZW1wdHlfc2VyaWVzOiB7XG4gICAgc3R5bGU6IFwiXCIsXG4gICAgZW1waGFzaXM6IHt9LFxuICAgIHBvaW50ZXJzOiB7fVxuICB9LFxuXG4gIGVtcHR5X3JhbmdlOiB7XG4gICAgLy94IG9yIHlcbiAgICBheGlzOiBcIlwiLFxuICAgIC8va2V5IHRvIHVzZSBhcyBzdGFydCBsb2NhdGlvblxuICAgIHN0YXJ0OiBcIlwiLFxuICAgIC8vb3B0aW9uYWwgLSBpZiBub3Qgc3BlY2lmaWVkIGEgbGluZSBpcyBzaG93biBpbnN0ZWFkXG4gICAgZW5kOiBcIlwiLFxuICAgIGxhYmVsOiBcIlwiXG4gIH0sXG5cbiAgcHJpbnQ6IHtcbiAgICBndXR0ZXJfd2lkdGg6IDQsXG4gICAgY29sdW1uX3dpZHRoOiA0NyxcbiAgICBmaXJzdF9saW5lX2RlcHRoOiAyLjE0LFxuICAgIGxpbmVfZGVwdGg6IDMuMzUsXG4gICAgZHBpOiAyNjYsIC8vIHRoaXMgYWN0dWFsbHkgZG9lc24ndCBtYXR0ZXIgZm9yIFBERnMsIGJ1dCBnb29kIHRvIG1ha2Ugbm90ZVxuICAgIG1hZ2ljOiB7XG4gICAgICB3aWR0aDogMy42OTgsXG4gICAgICBoZWlnaHQ6IDMuNjc1XG4gICAgfSxcbiAgICB4X2F4aXM6IHtcbiAgICAgIHRpY2tUYXJnZXQ6IDgsXG4gICAgICB0aWNrc1NtYWxsOiA1LFxuICAgICAgZHk6IDAuNyxcbiAgICAgIGVtczogMS4xLFxuICAgICAgYmFyT2Zmc2V0OiA1LFxuICAgICAgdXBwZXI6IHtcbiAgICAgICAgdGlja0hlaWdodDogNCxcbiAgICAgICAgdGV4dFg6IDIsXG4gICAgICAgIHRleHRZOiAyXG4gICAgICB9LFxuICAgICAgbG93ZXI6IHtcbiAgICAgICAgdGlja0hlaWdodDogNyxcbiAgICAgICAgdGV4dFg6IDIsXG4gICAgICAgIHRleHRZOiAwXG4gICAgICB9XG4gICAgfSxcbiAgICB5X2F4aXM6IHtcbiAgICAgIHBhZGRpbmdSaWdodDogNVxuICAgIH0sXG4gICAgbWFyZ2luOiB7XG4gICAgICB0b3A6IDcsXG4gICAgICByaWdodDogMixcbiAgICAgIGJvdHRvbTogMCxcbiAgICAgIGxlZnQ6IDBcbiAgICB9XG4gIH1cblxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY3VzdG9tL21ldGVvci1jb25maWcuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwibmFtZVwiOiBcImNoYXJ0LXRvb2xcIixcblx0XCJ2ZXJzaW9uXCI6IFwiMS4xLjFcIixcblx0XCJidWlsZFZlclwiOiBcIjBcIixcblx0XCJkZXNjcmlwdGlvblwiOiBcIkEgcmVzcG9uc2l2ZSBjaGFydGluZyBhcHBsaWNhdGlvblwiLFxuXHRcIm1haW5cIjogXCJndWxwZmlsZS5qc1wiLFxuXHRcImRlcGVuZGVuY2llc1wiOiB7fSxcblx0XCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiYnJvd3Nlci1zeW5jXCI6IFwiXjIuMTUuMFwiLFxuXHRcdFwiZ3VscFwiOiBcIl4zLjguMTFcIixcblx0XHRcImd1bHAtY2xlYW5cIjogXCJeMC4zLjFcIixcblx0XHRcImd1bHAtanNvbi1lZGl0b3JcIjogXCJeMi4yLjFcIixcblx0XHRcImd1bHAtbWluaWZ5LWNzc1wiOiBcIl4xLjIuMFwiLFxuXHRcdFwiZ3VscC1yZW5hbWVcIjogXCJeMS4yLjJcIixcblx0XHRcImd1bHAtcmVwbGFjZVwiOiBcIl4wLjUuM1wiLFxuXHRcdFwiZ3VscC1zYXNzXCI6IFwiXjIuMy4yXCIsXG5cdFx0XCJndWxwLXNoZWxsXCI6IFwiXjAuNS4yXCIsXG5cdFx0XCJndWxwLXNvdXJjZW1hcHNcIjogXCJeMS41LjJcIixcblx0XHRcImd1bHAtdXRpbFwiOiBcIl4zLjAuNlwiLFxuXHRcdFwianNkb2NcIjogXCJeMy4zLjJcIixcblx0XHRcImpzb24tbG9hZGVyXCI6IFwiXjAuNS4zXCIsXG5cdFx0XCJydW4tc2VxdWVuY2VcIjogXCJeMS4yLjJcIixcblx0XHRcIndlYnBhY2tcIjogXCJeMS4xMy4yXCIsXG5cdFx0XCJ3ZWJwYWNrLXN0cmVhbVwiOiBcIl4zLjEuMFwiLFxuXHRcdFwieWFyZ3NcIjogXCJeNS4wLjBcIlxuXHR9LFxuXHRcInNjcmlwdHNcIjoge1xuXHRcdFwidGVzdFwiOiBcIlwiXG5cdH0sXG5cdFwia2V5d29yZHNcIjogW1xuXHRcdFwiY2hhcnRzXCIsXG5cdFx0XCJkM1wiLFxuXHRcdFwiZDNqc1wiLFxuXHRcdFwibWV0ZW9yXCIsXG5cdFx0XCJndWxwXCIsXG5cdFx0XCJ3ZWJwYWNrXCIsXG5cdFx0XCJkYXRhIHZpc3VhbGl6YXRpb25cIixcblx0XHRcImNoYXJ0XCIsXG5cdFx0XCJtb25nb1wiXG5cdF0sXG5cdFwicmVwb3NpdG9yeVwiOiB7XG5cdFx0XCJ0eXBlXCI6IFwiZ2l0XCIsXG5cdFx0XCJ1cmxcIjogXCJnaXRAZ2l0aHViLmNvbTpnbG9iZWFuZG1haWwvY2hhcnQtdG9vbC5naXRcIlxuXHR9LFxuXHRcImNvbnRyaWJ1dG9yc1wiOiBbXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJUb20gQ2FyZG9zb1wiLFxuXHRcdFx0XCJlbWFpbFwiOiBcInRjYXJkb3NvQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJKZXJlbXkgQWdpdXNcIixcblx0XHRcdFwiZW1haWxcIjogXCJqYWdpdXNAZ2xvYmVhbmRtYWlsLmNvbVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcImF1dGhvclwiOiBcIk1pY2hhZWwgUGVyZWlyYVwiLFxuXHRcdFx0XCJlbWFpbFwiOiBcIm1wZXJlaXJhQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH1cblx0XSxcblx0XCJsaWNlbnNlXCI6IFwiTUlUXCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzb24tbG9hZGVyIS4vcGFja2FnZS5qc29uXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiQ1VTVE9NXCI6IGZhbHNlLFxuXHRcInByZWZpeFwiOiBcImN0LVwiLFxuXHRcIm1vbnRoc0FiclwiOiBbXG5cdFx0XCJKYW4uXCIsXG5cdFx0XCJGZWIuXCIsXG5cdFx0XCJNYXIuXCIsXG5cdFx0XCJBcHIuXCIsXG5cdFx0XCJNYXlcIixcblx0XHRcIkp1bmVcIixcblx0XHRcIkp1bHlcIixcblx0XHRcIkF1Zy5cIixcblx0XHRcIlNlcHQuXCIsXG5cdFx0XCJPY3QuXCIsXG5cdFx0XCJOb3YuXCIsXG5cdFx0XCJEZWMuXCIsXG5cdFx0XCJKYW4uXCJcblx0XSxcblx0XCJkZWJvdW5jZVwiOiA1MDAsXG5cdFwidGlwVGltZW91dFwiOiA1MDAwLFxuXHRcInJhdGlvTW9iaWxlXCI6IDEuMTUsXG5cdFwicmF0aW9EZXNrdG9wXCI6IDAuNjUsXG5cdFwiZGF0ZUZvcm1hdFwiOiBcIiVZLSVtLSVkXCIsXG5cdFwidGltZUZvcm1hdFwiOiBcIiVIOiVNXCIsXG5cdFwibWFyZ2luXCI6IHtcblx0XHRcInRvcFwiOiAxMCxcblx0XHRcInJpZ2h0XCI6IDMsXG5cdFx0XCJib3R0b21cIjogMCxcblx0XHRcImxlZnRcIjogMFxuXHR9LFxuXHRcInRpcE9mZnNldFwiOiB7XG5cdFx0XCJ2ZXJ0aWNhbFwiOiA0LFxuXHRcdFwiaG9yaXpvbnRhbFwiOiAxXG5cdH0sXG5cdFwidGlwUGFkZGluZ1wiOiB7XG5cdFx0XCJ0b3BcIjogNCxcblx0XHRcInJpZ2h0XCI6IDksXG5cdFx0XCJib3R0b21cIjogNCxcblx0XHRcImxlZnRcIjogOVxuXHR9LFxuXHRcInlBeGlzXCI6IHtcblx0XHRcImRpc3BsYXlcIjogdHJ1ZSxcblx0XHRcInNjYWxlXCI6IFwibGluZWFyXCIsXG5cdFx0XCJ0aWNrc1wiOiBcImF1dG9cIixcblx0XHRcIm9yaWVudFwiOiBcInJpZ2h0XCIsXG5cdFx0XCJmb3JtYXRcIjogXCJjb21tYVwiLFxuXHRcdFwicHJlZml4XCI6IFwiXCIsXG5cdFx0XCJzdWZmaXhcIjogXCJcIixcblx0XHRcIm1pblwiOiBcIlwiLFxuXHRcdFwibWF4XCI6IFwiXCIsXG5cdFx0XCJyZXNjYWxlXCI6IGZhbHNlLFxuXHRcdFwibmljZVwiOiB0cnVlLFxuXHRcdFwicGFkZGluZ1JpZ2h0XCI6IDksXG5cdFx0XCJ0aWNrTG93ZXJCb3VuZFwiOiAzLFxuXHRcdFwidGlja1VwcGVyQm91bmRcIjogOCxcblx0XHRcInRpY2tHb2FsXCI6IDUsXG5cdFx0XCJ3aWR0aFRocmVzaG9sZFwiOiA0MjAsXG5cdFx0XCJkeVwiOiBcIlwiLFxuXHRcdFwidGV4dFhcIjogMCxcblx0XHRcInRleHRZXCI6IFwiXCJcblx0fSxcblx0XCJ4QXhpc1wiOiB7XG5cdFx0XCJkaXNwbGF5XCI6IHRydWUsXG5cdFx0XCJzY2FsZVwiOiBcInRpbWVcIixcblx0XHRcInRpY2tzXCI6IFwiYXV0b1wiLFxuXHRcdFwib3JpZW50XCI6IFwiYm90dG9tXCIsXG5cdFx0XCJmb3JtYXRcIjogXCJhdXRvXCIsXG5cdFx0XCJwcmVmaXhcIjogXCJcIixcblx0XHRcInN1ZmZpeFwiOiBcIlwiLFxuXHRcdFwibWluXCI6IFwiXCIsXG5cdFx0XCJtYXhcIjogXCJcIixcblx0XHRcInJlc2NhbGVcIjogZmFsc2UsXG5cdFx0XCJuaWNlXCI6IGZhbHNlLFxuXHRcdFwicmFuZ2VQb2ludHNcIjogMSxcblx0XHRcInRpY2tUYXJnZXRcIjogNixcblx0XHRcInRpY2tzU21hbGxcIjogNCxcblx0XHRcIndpZHRoVGhyZXNob2xkXCI6IDQyMCxcblx0XHRcImR5XCI6IDAuNyxcblx0XHRcImJhck9mZnNldFwiOiA5LFxuXHRcdFwidXBwZXJcIjoge1xuXHRcdFx0XCJ0aWNrSGVpZ2h0XCI6IDcsXG5cdFx0XHRcInRleHRYXCI6IDYsXG5cdFx0XHRcInRleHRZXCI6IDdcblx0XHR9LFxuXHRcdFwibG93ZXJcIjoge1xuXHRcdFx0XCJ0aWNrSGVpZ2h0XCI6IDEyLFxuXHRcdFx0XCJ0ZXh0WFwiOiA2LFxuXHRcdFx0XCJ0ZXh0WVwiOiAyXG5cdFx0fVxuXHR9LFxuXHRcImJhckhlaWdodFwiOiAzMCxcblx0XCJiYW5kc1wiOiB7XG5cdFx0XCJwYWRkaW5nXCI6IDAuMDYsXG5cdFx0XCJvZmZzZXRcIjogMC4xMixcblx0XHRcIm91dGVyUGFkZGluZ1wiOiAwLjAzXG5cdH0sXG5cdFwic291cmNlXCI6IHtcblx0XHRcInByZWZpeFwiOiBcIkNIQVJUIFRPT0xcIixcblx0XHRcInN1ZmZpeFwiOiBcIiDCuyBTT1VSQ0U6XCJcblx0fSxcblx0XCJzb2NpYWxcIjoge1xuXHRcdFwiZmFjZWJvb2tcIjoge1xuXHRcdFx0XCJsYWJlbFwiOiBcIkZhY2Vib29rXCIsXG5cdFx0XHRcImljb25cIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb3VuZGljb25zLzMuMC4wL3N2Z3MvZmktc29jaWFsLWZhY2Vib29rLnN2Z1wiLFxuXHRcdFx0XCJyZWRpcmVjdFwiOiBcIlwiLFxuXHRcdFx0XCJhcHBJRFwiOiBcIlwiXG5cdFx0fSxcblx0XHRcInR3aXR0ZXJcIjoge1xuXHRcdFx0XCJsYWJlbFwiOiBcIlR3aXR0ZXJcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1zb2NpYWwtdHdpdHRlci5zdmdcIixcblx0XHRcdFwidmlhXCI6IFwiXCIsXG5cdFx0XHRcImhhc2h0YWdcIjogXCJcIlxuXHRcdH0sXG5cdFx0XCJlbWFpbFwiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiRW1haWxcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1tYWlsLnN2Z1wiXG5cdFx0fSxcblx0XHRcInNtc1wiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiU01TXCIsXG5cdFx0XHRcImljb25cIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb3VuZGljb25zLzMuMC4wL3N2Z3MvZmktdGVsZXBob25lLnN2Z1wiXG5cdFx0fVxuXHR9LFxuXHRcImltYWdlXCI6IHtcblx0XHRcImVuYWJsZVwiOiBmYWxzZSxcblx0XHRcImJhc2VfcGF0aFwiOiBcIlwiLFxuXHRcdFwiZXhwaXJhdGlvblwiOiAzMDAwMCxcblx0XHRcImZpbGVuYW1lXCI6IFwidGh1bWJuYWlsXCIsXG5cdFx0XCJleHRlbnNpb25cIjogXCJwbmdcIixcblx0XHRcInRodW1ibmFpbFdpZHRoXCI6IDQ2MFxuXHR9XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uLWxvYWRlciEuL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIl0sInNvdXJjZVJvb3QiOiIifQ==