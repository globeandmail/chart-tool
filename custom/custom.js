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