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

  var Recipe = require("../utils/factory"),
      settings = require("../config/chart-settings"),
      components = require("./components/components");

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

  if (chartRecipe.options.share_data) {
    if (!chartRecipe.editable && !chartRecipe.exportable) {
      rendered.shareData = components.shareData(container, chartRecipe);
    }
  }

  if (chartRecipe.options.social) {
    if (!chartRecipe.editable && !chartRecipe.exportable) {
      rendered.social = components.social(container, chartRecipe);
    }
  }

  if (chartRecipe.CUSTOM) {
    var custom = require("../../../custom/custom.js");
    rendered.custom = custom(node, chartRecipe, rendered);
  }

  return chartRecipe;

};

module.exports = ChartManager;
