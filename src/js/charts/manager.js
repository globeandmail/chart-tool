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
  var node = components.base(container, chartRecipe);
  var rendered = chartRecipe.rendered = {};

  rendered.container = node;

  // check that each section is needed
  if (chartRecipe.options.head) {
    rendered.header = components.header(node, chartRecipe);
  }

  if (chartRecipe.options.footer) {
    rendered.footer = components.footer(node, chartRecipe);
  }

  rendered.plot = components.plot(node, chartRecipe);

  if (chartRecipe.options.qualifier) {
    rendered.qualifier = components.qualifier(node, chartRecipe);
  }

  if (chartRecipe.options.tips) {
    rendered.tips = components.tips(node, chartRecipe);
  }

  return chartRecipe;

};

module.exports = ChartManager;