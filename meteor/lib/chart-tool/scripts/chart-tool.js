var chartToolInit = (function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var name = "chart-tool";
var version$1 = "1.1.1";
var buildVer = "0";
var description = "A responsive charting application";
var main = "gulpfile.js";
var dependencies = {};
var engines = {"node":"7.1.0"};
var devDependencies = {"autoprefixer":"^6.5.3","browser-sync":"^2.15.0","del":"^2.2.2","eslint":"^3.10.1","gulp":"^3.8.11","gulp-csso":"^2.0.0","gulp-file":"^0.3.0","gulp-json-editor":"^2.2.1","gulp-plumber":"^1.1.0","gulp-postcss":"^6.2.0","gulp-preprocess":"^2.0.0","gulp-rename":"^1.2.2","gulp-replace":"^0.5.3","gulp-sass":"^2.3.2","gulp-shell":"^0.5.2","gulp-size":"^2.1.0","gulp-sourcemaps":"^2.2.0","gulp-util":"^3.0.7","rollup":"^0.36.3","rollup-plugin-buble":"^0.14.0","rollup-plugin-commonjs":"^5.0.5","rollup-plugin-eslint":"^3.0.0","rollup-plugin-json":"^2.0.2","rollup-plugin-node-resolve":"^2.0.0","rollup-plugin-replace":"^1.1.1","rollup-plugin-strip":"^1.1.1","rollup-plugin-uglify":"^1.0.1","run-sequence":"^1.2.2","yargs":"^6.4.0"};
var scripts = {"test":""};
var keywords = ["charts","d3","d3js","meteor","gulp","webpack","data visualization","chart","mongo"];
var repository = {"type":"git","url":"git@github.com:globeandmail/chart-tool.git"};
var contributors = [{"author":"Tom Cardoso","email":"tcardoso@globeandmail.com"},{"author":"Jeremy Agius","email":"jagius@globeandmail.com"},{"author":"Michael Pereira","email":"mpereira@globeandmail.com"}];
var license = "MIT";
var _package = {
	name: name,
	version: version$1,
	buildVer: buildVer,
	description: description,
	main: main,
	dependencies: dependencies,
	engines: engines,
	devDependencies: devDependencies,
	scripts: scripts,
	keywords: keywords,
	repository: repository,
	contributors: contributors,
	license: license
};

var _package$1 = Object.freeze({
	name: name,
	version: version$1,
	buildVer: buildVer,
	description: description,
	main: main,
	dependencies: dependencies,
	engines: engines,
	devDependencies: devDependencies,
	scripts: scripts,
	keywords: keywords,
	repository: repository,
	contributors: contributors,
	license: license,
	default: _package
});

var CUSTOM = false;
var prefix = "ct-";
var monthsAbr = ["Jan.","Feb.","Mar.","Apr.","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec.","Jan."];
var debounce = 500;
var tipTimeout = 5000;
var ratioMobile = 1.15;
var ratioDesktop = 0.65;
var dateFormat = "%Y-%m-%d";
var timeFormat = "%H:%M";
var margin = {"top":10,"right":3,"bottom":0,"left":0};
var tipOffset = {"vertical":4,"horizontal":1};
var tipPadding = {"top":4,"right":9,"bottom":4,"left":9};
var yAxis = {"display":true,"scale":"linear","ticks":"auto","orient":"right","format":"comma","prefix":"","suffix":"","min":"","max":"","rescale":false,"nice":true,"paddingRight":9,"tickLowerBound":3,"tickUpperBound":8,"tickGoal":5,"widthThreshold":420,"dy":"","textX":0,"textY":""};
var xAxis = {"display":true,"scale":"time","ticks":"auto","orient":"bottom","format":"auto","prefix":"","suffix":"","min":"","max":"","rescale":false,"nice":false,"rangePoints":1,"tickTarget":6,"ticksSmall":4,"widthThreshold":420,"dy":0.7,"barOffset":9,"upper":{"tickHeight":7,"textX":6,"textY":7},"lower":{"tickHeight":12,"textX":6,"textY":2}};
var barHeight = 30;
var bands = {"padding":0.06,"offset":0.12,"outerPadding":0.03};
var source = {"prefix":"CHART TOOL","suffix":" » SOURCE:"};
var social = {"facebook":{"label":"Facebook","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-facebook.svg","redirect":"","appID":""},"twitter":{"label":"Twitter","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-twitter.svg","via":"","hashtag":""},"email":{"label":"Email","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-mail.svg"},"sms":{"label":"SMS","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-telephone.svg"}};
var image = {"enable":false,"base_path":"","expiration":30000,"filename":"thumbnail","extension":"png","thumbnailWidth":460};
var embedJS = "";
var embedCSS = "";
var chartToolConfig = {
	CUSTOM: CUSTOM,
	prefix: prefix,
	monthsAbr: monthsAbr,
	debounce: debounce,
	tipTimeout: tipTimeout,
	ratioMobile: ratioMobile,
	ratioDesktop: ratioDesktop,
	dateFormat: dateFormat,
	timeFormat: timeFormat,
	margin: margin,
	tipOffset: tipOffset,
	tipPadding: tipPadding,
	yAxis: yAxis,
	xAxis: xAxis,
	barHeight: barHeight,
	bands: bands,
	source: source,
	social: social,
	image: image,
	embedJS: embedJS,
	embedCSS: embedCSS
};

var chartToolConfig$1 = Object.freeze({
	CUSTOM: CUSTOM,
	prefix: prefix,
	monthsAbr: monthsAbr,
	debounce: debounce,
	tipTimeout: tipTimeout,
	ratioMobile: ratioMobile,
	ratioDesktop: ratioDesktop,
	dateFormat: dateFormat,
	timeFormat: timeFormat,
	margin: margin,
	tipOffset: tipOffset,
	tipPadding: tipPadding,
	yAxis: yAxis,
	xAxis: xAxis,
	barHeight: barHeight,
	bands: bands,
	source: source,
	social: social,
	image: image,
	embedJS: embedJS,
	embedCSS: embedCSS,
	default: chartToolConfig
});

var require$$1 = ( _package$1 && _package$1['default'] ) || _package$1;

var require$$0 = ( chartToolConfig$1 && chartToolConfig$1['default'] ) || chartToolConfig$1;

var version = {
  version: require$$1.version,
  build: require$$1.buildver
};

var settings = require$$0;

var chartSettings = {

  CUSTOM: settings.CUSTOM,
  version: version.version,
  build: version.build,
  id: '',
  data: '',
  dateFormat: settings.dateFormat,
  timeFormat: settings.timeFormat,
  image: settings.image,
  heading: '',
  qualifier: '',
  source: '',
  deck: '',
  index: '',
  hasHours: false,
  social: settings.social,
  seriesHighlight: function() {
    if (this.data.seriesAmount && this.data.seriesAmount <= 1) {
      return 1;
    } else {
      return 0;
    }
  },
  baseClass: function() { return this.prefix + 'chart'; },
  customClass: '',

  options: {
    type: 'line',
    interpolation: 'linear',
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

var dataparse = {
  inputDate: inputDate,
  parse: parse
};

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
  if (from == null || typeof from != "object") { return from; }
  if (from.constructor != Object && from.constructor != Array) { return from; }
  if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
    from.constructor == String || from.constructor == Number || from.constructor == Boolean)
    { return new from.constructor(from); }

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

var helpers = {
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
  var dataParse = dataparse;
  var helpers$$1 = helpers;

  var t = helpers$$1.extend(settings); // short for template

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
  t.deck             = embed.deck                             || t.deck;
  t.customClass      = chart.class                            || t.customClass;

  t.xAxis            = helpers$$1.extend(t.xAxis, chart.x_axis)  || t.xAxis;
  t.yAxis            = helpers$$1.extend(t.yAxis, chart.y_axis)  || t.yAxis;

  var o = t.options,
      co = chart.options;

  //  "options" area of embed code
  o.type             = chart.options.type                     || o.type;
  o.interpolation    = chart.options.interpolation            || o.interpolation;

  o.social      = !helpers$$1.isUndefined(co.social) === true ? co.social           : o.social;
  o.share_data   = !helpers$$1.isUndefined(co.share_data) === true ? co.share_data  : o.share_data;
  o.stacked     = !helpers$$1.isUndefined(co.stacked) === true ? co.stacked         : o.stacked;
  o.expanded    = !helpers$$1.isUndefined(co.expanded) === true ? co.expanded       : o.expanded;
  o.head        = !helpers$$1.isUndefined(co.head) === true ? co.head               : o.head;
  o.deck        = !helpers$$1.isUndefined(co.deck) === true ? co.deck               : o.deck;
  o.legend      = !helpers$$1.isUndefined(co.legend) === true ? co.legend           : o.legend;
  o.qualifier   = !helpers$$1.isUndefined(co.qualifier) === true ? co.qualifier     : o.qualifier;
  o.footer      = !helpers$$1.isUndefined(co.footer) === true ? co.footer           : o.footer;
  o.x_axis      = !helpers$$1.isUndefined(co.x_axis) === true ? co.x_axis           : o.x_axis;
  o.y_axis      = !helpers$$1.isUndefined(co.y_axis) === true ? co.y_axis           : o.y_axis;
  o.tips        = !helpers$$1.isUndefined(co.tips) === true ? co.tips               : o.tips;
  o.annotations = !helpers$$1.isUndefined(co.annotations) === true ? co.annotations : o.annotations;
  o.range       = !helpers$$1.isUndefined(co.range) === true ? co.range             : o.range;
  o.series      = !helpers$$1.isUndefined(co.series) === true ? co.series           : o.series;
  o.index       = !helpers$$1.isUndefined(co.indexed) === true ? co.indexed         : o.index;

  //  these are specific to the t object and don't exist in the embed
  t.baseClass        = embed.baseClass                        || t.baseClass;

  t.dimensions.width = embed.width                            || t.dimensions.width;

  t.prefix           = chart.prefix                           || t.prefix;
  t.exportable       = chart.exportable                       || t.exportable;
  t.editable         = chart.editable                         || t.editable;

  if (t.exportable) {
    t.dimensions.width = chart.exportable.width || embed.width || t.dimensions.width;
    t.dimensions.height = function() { return chart.exportable.height; };
    t.dimensions.margin = chart.exportable.margin || t.dimensions.margin;
  }

  if (chart.hasHours) { t.dateFormat += " " + t.timeFormat; }
  t.hasHours         = chart.hasHours                         || t.hasHours;
  t.dateFormat       = chart.dateFormat                       || t.dateFormat;

  t.dateFormat = dataParse.inputDate(t.xAxis.scale, t.dateFormat, chart.date_format);
  t.data = dataParse.parse(chart.data, t.dateFormat, o.index, o.stacked, o.type) || t.data;

  return t;

}

var factory = RecipeFactory;

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

var base = append;

function headerComponent(container, obj) {

  var helpers$$1 = helpers;

  var headerGroup = d3.select(container)
    .append("div")
    .classed(obj.prefix + "chart_title " + obj.prefix + obj.customClass, true);

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

    var keys = helpers$$1.extend(obj.data.keys);

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

var header = headerComponent;

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

var footer = footerComponent;

// s3_bucket is defined in webpack.config.js
var env = s3_bucket;

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
function debounce$1(fn, obj, timeout, root) {
  var timeoutID = -1;
  return function() {
    if (timeoutID > -1) { root.clearTimeout(timeoutID); }
    timeoutID = root.setTimeout(function(){
      fn(obj);
    }, timeout);
  }
}

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
    }
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
  }

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

  imgSettings.bucket = env;

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

var utils = {
  debounce: debounce$1,
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
  dataParse: dataparse,
  factory: factory
};

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
      var timeDiff = utils.timeDiff;
      var context = timeDiff(scale.domain()[0], scale.domain()[1], 3);
      niceifyTime(scale, context);
      break;
    case "linear":
      niceifyNumerical(scale);
      break;
  }

}

function niceifyTime(scale, context) {
  var getTimeInterval = utils.timeInterval;
  var timeInterval = getTimeInterval(context);
  scale.domain(scale.domain()).nice(timeInterval);
}

function niceifyNumerical(scale) {
  scale.domain(scale.domain()).nice();
}

var scale = {
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

function AxisFactory(axisObj, scale$$1) {

  var axis = d3.svg.axis()
    .scale(scale$$1)
    .orient(axisObj.orient);

  return axis;

}

function axisManager(node, obj, scale$$1, axisType) {

  var axisObj = obj[axisType];
  var axis = new AxisFactory(axisObj, scale$$1);

  var prevAxis = node.select("." + obj.prefix + "axis-group" + "." + obj.prefix + axisType).node();

  if (prevAxis !== null) { d3.select(prevAxis).remove(); }

  var axisGroup = node.append("g")
    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + axisType);

  if (axisType === "xAxis") {
    appendXAxis(axisGroup, obj, scale$$1, axis, axisType);
  } else if (axisType === "yAxis") {
    appendYAxis(axisGroup, obj, scale$$1, axis, axisType);
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

function appendXAxis(axisGroup, obj, scale$$1, axis, axisName) {

  var axisObj = obj[axisName],
      axisSettings;

  if (obj.exportable && obj.exportable.x_axis) {
    var extend = helpers.extend;
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
      timeAxis(axisNode, obj, scale$$1, axis, axisSettings);
      break;
    case "ordinal":
      discreteAxis(axisNode, scale$$1, axis, axisSettings, obj.dimensions);
      break;
    case "ordinal-time":
      ordinalTimeAxis(axisNode, obj, scale$$1, axis, axisSettings);
      break;
  }

  obj.dimensions.xAxisHeight = axisNode.node().getBBox().height;

}

function appendYAxis(axisGroup, obj, scale$$1, axis, axisName) {

  axisGroup.attr("transform", "translate(0,0)");

  var axisNode = axisGroup.append("g")
    .attr("class", obj.prefix + "y-axis");

  drawYAxis(obj, axis, axisNode);

}

function drawYAxis(obj, axis, axisNode) {

  var axisSettings;

  var axisObj = obj["yAxis"];

  if (obj.exportable && obj.exportable.y_axis) {
    var extend = helpers.extend;
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

function timeAxis(axisNode, obj, scale$$1, axis, axisSettings) {

  var timeDiff = utils.timeDiff,
      domain = scale$$1.domain(),
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

function discreteAxis(axisNode, scale$$1, axis, axisSettings, dimensions) {

  var wrapText = utils.wrapText;

  axis.tickPadding(0);

  scale$$1.rangeExtent([0, dimensions.tickWidth()]);

  scale$$1.rangeRoundBands([0, dimensions.tickWidth()], dimensions.bands.padding, dimensions.bands.outerPadding);

  var bandStep = scale$$1.rangeBand();

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

function ordinalTimeAxis(axisNode, obj, scale$$1, axis, axisSettings) {

  var timeDiff = utils.timeDiff,
      domain = scale$$1.domain(),
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
    .call(ordinalTimeTicks, axisNode, ctx, scale$$1, ordinalTickPadding);

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

  var isFloat = helpers.isFloat;

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

function tickFinderY(scale$$1, tickCount, tickSettings) {

  // In a nutshell:
  // Checks if an explicit number of ticks has been declared
  // If not, sets lower and upper bounds for the number of ticks
  // Iterates over those and makes sure that there are tick arrays where
  // the last value in the array matches the domain max value
  // if so, tries to find the tick number closest to tickGoal out of the winners,
  // and returns that arr to the scale for use

  var min = scale$$1.domain()[0],
      max = scale$$1.domain()[1];

  if (tickCount !== "auto") {

    return scale$$1.ticks(tickCount);

  } else {

    var tickLowerBound = tickSettings.tickLowerBound,
        tickUpperBound = tickSettings.tickUpperBound,
        tickGoal = tickSettings.tickGoal,
        arr = [],
        tickCandidates = [],
        closestArr;

    for (var i = tickLowerBound; i <= tickUpperBound; i++) {
      var tickCandidate = scale$$1.ticks(i);

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

    return scale$$1.ticks(closestArr);

  }
}


function ordinalTimeTicks(selection, axisNode, ctx, scale$$1, tolerance) {

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

  var setRangeType = scale.setRangeType,
      setRangeArgs = scale.setRangeArgs;

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

var axis = {
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

function LineChart(node, obj) {

  var axisModule = axis,
      scaleModule = scale,
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

  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; }; }

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

}

var line = LineChart;

function MultiLineChart(node, obj) {

  var axisModule = axis,
      scaleModule = scale,
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

  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; }; }

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

}

var multiline = MultiLineChart;

function AreaChart(node, obj) {

  var axisModule = axis,
      scaleModule = scale,
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
  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; }; }

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

}

var area = AreaChart;

function StackedAreaChart(node, obj) {

  var axisModule = axis,
      scaleModule = scale,
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
  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; }; }

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

}

var stackedArea = StackedAreaChart;

function ColumnChart(node, obj) {

  var axisModule = axis,
      scaleModule = scale,
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

      var timeInterval = utils.timeInterval,
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

var column = ColumnChart;

function BarChart(node, obj) {

  var axisModule = axis,
    scaleModule = scale,
    Scale = scaleModule.scaleManager;

  // because the elements will be appended in reverse due to the
  // bar chart operating on the y-axis, need to reverse the dataset.
  obj.data.data.reverse();

  var xAxisSettings;

  if (obj.exportable && obj.exportable.x_axis) {
    var extend = helpers.extend;
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
    var wrapText = utils.wrapText;
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

  var axisModule = axis;

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

var bar = BarChart;

function StackedColumnChart(node, obj) {

  var axisModule = axis,
      scaleModule = scale,
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

      var timeInterval = utils.timeInterval,
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

var stackedColumn = StackedColumnChart;

function StreamgraphChart(node, obj) {

  var axisModule = axis,
      scaleModule = scale,
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

}

var streamgraph = StreamgraphChart;

function plot(node, obj) {

  var draw = {
    line: line,
    multiline: multiline,
    area: area,
    stackedArea: stackedArea,
    column: column,
    bar: bar,
    stackedColumn: stackedColumn,
    streamgraph: streamgraph
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

var plot_1 = plot;

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

var qualifier = qualifierComponent;

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
    }
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
        columnRects = obj.rendered.plot.series.selectAll('rect');
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

    var yFormatter = axis.setTickFormatY,
        timeDiff = utils.timeDiff;
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

    var yFormatter = axis.setTickFormatY,
        timeDiff = utils.timeDiff;
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

    var yFormatter = axis.setTickFormatY,
        timeDiff = utils.timeDiff;
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

    var yFormatter = axis.setTickFormatY,
        timeDiff = utils.timeDiff;
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

    var yFormatter = axis.setTickFormatY,
      timeDiff = utils.timeDiff,
      getTranslateXY = utils.getTranslateXY,
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

    var yFormatter = axis.setTickFormatY,
      timeDiff = utils.timeDiff,
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

var tips = tipsManager;

/**
 * Social module.
 * @module charts/components/social
 */

/*
This component adds a "social" button to each chart which can be toggled to present the user with social sharing options
 */

var getThumbnail = utils.getThumbnailPath;

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
					console.log('INCORRECT SOCIAL ITEM DEFINITION');
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

var social$1 = socialComponent;

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

  var csvToTable = utils.csvToTable;

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

var shareData = shareDataComponent;

var components = {
  base: base,
  header: header,
  footer: footer,
  plot: plot_1,
  qualifier: qualifier,
  axis: axis,
  scale: scale,
  tips: tips,
  social: social$1,
  shareData: shareData
};

var components_1 = components;

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

var custom_1 = custom;

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

  var Recipe = factory,
      settings = chartSettings,
      components = components_1;

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
    var custom = custom_1;
    rendered.custom = custom(node, chartRecipe, rendered);
  }

  return chartRecipe;

}

var manager = ChartManager;

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

      var settings = chartSettings,
          utils$$1 = utils;

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

        drawn = utils$$1.clearDrawn(drawn, obj);
        obj = utils$$1.clearObj(obj);
        container = utils$$1.clearChart(container);

        var ChartManager = manager;

        obj.data.width = utils$$1.getBounding(container, "width");
        obj.dispatch = dispatcher;

        var chartObj;

        if (utils$$1.svgTest(root)) {
          chartObj = ChartManager(container, obj);
        } else {
          utils$$1.generateThumb(container, obj, settings);
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
        }
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
        }
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
        }
        container = '.' + settings.baseClass() + '[data-chartid=' + obj.id + ']';
        utils$$1.clearDrawn(drawn, obj);
        utils$$1.clearObj(obj);
        utils$$1.clearChart(container);
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
        }
      }

      /**
       * Chart Tool initializer which sets up debouncing and runs the createLoop(). Run only once, when the library is first loaded.
       * @param {Array} charts Array of charts on the page.
       */
      function initializer(charts) {
        createLoop(charts);
        var debounce = utils$$1.debounce(createLoop, charts, settings.debounce, root);
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
        settings: chartSettings,
        charts: manager,
        components: components_1,
        helpers: helpers,
        utils: utils,
        line: line,
        area: area,
        multiline: multiline,
        stackedArea: stackedArea,
        column: column,
        stackedColumn: stackedColumn,
        streamgraph: streamgraph,
        bar: bar

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

})(typeof window !== "undefined" ? window : commonjsGlobal);

var index = {

};

return index;

}());
//# sourceMappingURL=chart-tool.js.map
