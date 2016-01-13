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
  d3.selectAll(container).selectAll("svg").remove();
  d3.selectAll(container).selectAll("div").remove();
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
  return d3.select(selector).node().getBoundingClientRect()[dimension];
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
 * Given a time context, return a d3 time interval.
 * @param  {String} context
 * @return {Object}
 */
function timeInterval(context) {
  var timeInterval;
  switch (context) {
    case "years":
      timeInterval = d3.time.year;
      break;
    case "months":
      timeInterval = d3.time.month;
      break;
    case "weeks":
      timeInterval = d3.time.week;
      break;
    case "days":
      timeInterval = d3.time.day;
      break;
    case "hours":
      timeInterval = d3.time.hour;
      break;
    case "minutes":
      timeInterval = d3.time.minute;
      break;
  }
  return timeInterval;
}

/**
 * Returns the transform position of an element as an array
 * @param  {Object} node
 * @return {Array}
 */
function getTranslateXY(node) {
  return d3.transform(d3.select(node).attr("transform")).translate;
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
  dataParse: require("./dataparse"),
  factory: require("./factory")
};
