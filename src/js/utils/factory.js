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
  var dataParse = require("./dataparse");

  var helpers = require("../helpers/helpers"),
      extend = helpers.extend,
      isUndefined = helpers.isUndefined;

  var t = extend(settings); // short for template

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

  t.xAxis            = extend(extend(t.xAxis, chart.x_axis))  || t.xAxis;
  t.yAxis            = extend(extend(t.yAxis, chart.y_axis))  || t.yAxis;

  var o = t.options, co = chart.options;

  //  "options" area of embed code
  o.type             = chart.options.type                     || o.type;
  o.interpolation    = chart.options.interpolation            || o.interpolation;

  o.social      = !isUndefined(co.social) === true ? co.social           : o.social;
  o.share_data  = !isUndefined(co.share_data) === true ? co.share_data   : o.share_data;
  o.stacked     = !isUndefined(co.stacked) === true ? co.stacked         : o.stacked;
  o.expanded    = !isUndefined(co.expanded) === true ? co.expanded       : o.expanded;
  o.head        = !isUndefined(co.head) === true ? co.head               : o.head;
  o.deck        = !isUndefined(co.deck) === true ? co.deck               : o.deck;
  o.legend      = !isUndefined(co.legend) === true ? co.legend           : o.legend;
  o.qualifier   = !isUndefined(co.qualifier) === true ? co.qualifier     : o.qualifier;
  o.footer      = !isUndefined(co.footer) === true ? co.footer           : o.footer;
  o.x_axis      = !isUndefined(co.x_axis) === true ? co.x_axis           : o.x_axis;
  o.y_axis      = !isUndefined(co.y_axis) === true ? co.y_axis           : o.y_axis;
  o.tips        = !isUndefined(co.tips) === true ? co.tips               : o.tips;
  o.annotations = !isUndefined(co.annotations) === true ? co.annotations : o.annotations;
  o.range       = !isUndefined(co.range) === true ? co.range             : o.range;
  o.series      = !isUndefined(co.series) === true ? co.series           : o.series;
  o.index       = !isUndefined(co.indexed) === true ? co.indexed         : o.index;

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
