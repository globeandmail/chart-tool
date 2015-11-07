// Here be dragons

function AxisFactory(axisObj, scale) {

  var axis = d3.svg.axis()
    .scale(scale)
    .orient(axisObj.orient);

  return axis;

}

function axisManager(node, obj, scale, axisType) {

  var axisObj = obj[axisType];
  var axis = new AxisFactory(axisObj, scale);

  var axisGroup = node.append("g")
    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + axisType);

  if (axisType === "xAxis") {
    appendXAxis(axisGroup, obj, scale, axis, axisType);
  } else if (axisType === "yAxis") {
    appendYAxis(axisGroup, obj, scale, axis, axisType, axisObj);
  }

  return {
    node: axisGroup,
    axis: axis
  };

}

function determineFormat(context) {

  switch (context) {
    case "years":
      return d3.time.format("%Y");
      break;
    case "months":
      return d3.time.format("%b");
      break;
    case "weeks":
      return d3.time.format("%W");
      break;
    case "days":
      return d3.time.format("%j");
      break;
    case "hours":
      return d3.time.format("%H");
      break;
    case "minutes":
      return d3.time.format("%M");
      break;
  }

}

function appendXAxis(axisGroup, obj, scale, axis, axisName) {

  var axisObj = obj[axisName],
      axisSettings;

  if (obj.exportable && obj.exportable.x_axis) {
    axisSettings = obj.exportable.x_axis;
  } else {
    axisSettings = axisObj;
  }

  axisGroup
    .attr("transform", "translate(0," + obj.dimensions.yAxisHeight() + ")");

  var axisNode = axisGroup.append("g")
    .attr("class", obj.prefix + "x-axis");

  axisNode.call(axis);

  switch(axisObj.scale) {
    case "time":
    case "date":
      timeAxis(axisNode, obj, scale, axis, axisSettings);
      break;
    case "linear":
    case "numerical":
      // function doesn't exist yet:
      // numericalAxis(axisNode, scale, axis, axisSettings, obj);
      break;
    case "ordinal":
    case "discrete":
      discreteAxis(axisNode, scale, axis, axisSettings, obj.dimensions);
      break;
  }

  obj.dimensions.xAxisHeight = axisNode.node().getBBox().height;

}

function appendYAxis(axisGroup, obj, scale, axis, axisName) {

  var axisObj = obj[axisName],
      axisSettings;

  if (obj.exportable && obj.exportable.y_axis) {
    axisSettings = obj.exportable.y_axis;
  } else {
    axisSettings = axisObj;
  }

  obj.dimensions.yAxisPaddingRight = axisSettings.paddingRight;

  axisGroup
    .attr("transform", "translate(0,0)");

  var axisNode = axisGroup.append("g")
    .attr("class", obj.prefix + "y-axis");

  axis.tickValues(tickFinderY(scale, axisObj.ticks, axisSettings));

  axisNode.call(axis);

  axisNode.selectAll("g")
    .filter(function(d) { return d; })
    .classed(obj.prefix + "minor", true);

  axisNode.selectAll(".tick text")
    .attr("transform", "translate(0,0)")
    .call(updateTextY, axisNode, obj, axis, axisObj)
    .attr({
      "transform": "translate(" + ( -(obj.dimensions.computedWidth() - obj.dimensions.labelWidth)) + ",0)"
    });

  axisNode.selectAll(".tick line")
    .attr({
      "x1": obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
      "x2": obj.dimensions.computedWidth()
    });

}

function timeAxis(axisNode, obj, scale, axis, axisSettings) {

  var timeDiff = require("../../utils/utils").timeDiff,
      domain = scale.domain(),
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

  axis.tickValues(ticks);

  axisNode.call(axis);

  axisNode.selectAll("text")
    .attr({
      "x": axisSettings.upper.textX,
      "y": axisSettings.upper.textY,
      "dy": axisSettings.dy + "em"
    })
    .style("text-anchor", "start")
    .call(formatText, ctx, axisSettings.ems, obj.monthsAbr);

  axisNode.selectAll(".tick")
    .call(dropTicks);

  axisNode.selectAll("line")
    .attr("y2", axisSettings.upper.tickHeight);

}

function discreteAxis(axisNode, scale, axis, axisSettings, dimensions) {

  var wrapText = require("../../utils/utils").wrapText;

  axis.tickPadding(0);

  scale.rangeExtent([0, dimensions.tickWidth()]);

  scale.rangeRoundBands([0, dimensions.tickWidth()], dimensions.bands.padding, dimensions.bands.outerPadding());

  var bandStep = scale.rangeBand();

  axisNode.call(axis);

  axisNode.selectAll("text")
    .style("text-anchor", "middle")
    .attr("dy", axisSettings.dy + "em")
    .call(wrapText, bandStep, dimensions.bands.padding);

  var xPos = (- (bandStep / 2) - (bandStep * dimensions.bands.outerPadding()));

  axisNode.selectAll("line")
    .attr({
      "x1": xPos,
      "x2": xPos
    });

  axisNode.selectAll("line")
    .attr("y2", axisSettings.upper.tickHeight);

  var lastTick = axisNode.append("g")
    .attr({
      "class": "tick",
      "transform": "translate(" + (dimensions.tickWidth() - 1) + ",0)"
    });

  lastTick.append("line")
    .attr({
      "y2": axisSettings.upper.tickHeight,
      "x1": xPos,
      "x2": xPos
    });

}

function numericalAxis(axisNode, scale, axis, axisSettings, obj) {

  // var axisObj = obj[axisName],
  //     axisSettings;

  // if (obj.exportable && obj.exportable.y_axis) {
  //   axisSettings = obj.exportable.y_axis;
  // } else {
  //   axisSettings = axisObj;
  // }

  // obj.dimensions.yAxisPaddingRight = axisSettings.paddingRight;

  // axis.tickValues(tickFinderY(scale, axisObj.ticks, axisSettings));

  axisNode.call(axis);

  // axisNode.selectAll("g")
  //   .filter(function(d) { return d; })
  //   .classed(obj.prefix + "minor", true);

  // axisNode.selectAll(".tick text")
  //   .attr("transform", "translate(0,0)")
  //   .call(updateTextY, axisNode, obj, axis, axisObj)
  //   .attr({
  //     "transform": "translate(" + ( -(obj.dimensions.computedWidth() - obj.dimensions.labelWidth)) + ",0)"
  //   });

  axisNode.selectAll(".tick line")
    .attr({
      "y1": -(obj.dimensions.computedHeight()),
      "y2": 0
    });

}

// text formatting functions

function formatText(selection, ctx, ems, monthsAbr) {

  var prevYear,
      prevMonth,
      prevDate,
      prevHour,
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

        prevYear = d.getFullYear();

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

        prevMonth = monthsAbr[d.getMonth()];
        prevYear = d.getFullYear();

        break;

      case "hours":
        dMonth = monthsAbr[d.getMonth()];
        dDate = d.getDate();
        dHour = d.getHours();
        dMinute = d.getMinutes();

        var dHourStr,
            dMinuteStr;

        // Convert from 24h time
        var suffix = (dHour >= 12)? 'p.m.' : 'a.m.';
        if (dHour === 0){
          dHourStr = 12;
        }
        else if(dHour > 12){
          dHourStr = dHour - 12;
        }
        else{
          dHourStr = dHour;
        }

        // Make minutes follow Globe style
        if(dMinute === 0){
          dMinuteStr = '';
        }
        else if(dMinute < 10){
          dMinuteStr = ':0' + dMinute;
        }
        else{
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

  var isFloat = require("../../helpers/helpers").isFloat;

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
      if (isFloat(d)) {
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

function updateTextY(textNode, axisNode, obj, axis, axisObj) {

  var arr = [],
      lastTick = axis.tickValues()[axis.tickValues().length - 1];

  textNode
    .attr("transform", "translate(0,0)")
    .text(function(d, i) {
      var val = setTickFormatY(axisObj.format, d, lastTick);
      if (!axisObj.prefix) { axisObj.prefix = ""; }
      if (!axisObj.suffix) { axisObj.suffix = ""; }
      if (i === axis.tickValues().length - 1) {
        val = axisObj.prefix + val + axisObj.suffix;
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
        if (obj.yAxis.dy !== "") {
          return obj.yAxis.dy + "em";
        } else {
          return d3.select(this).attr("dy");
        }
      },
      "x": function() {
        if (obj.yAxis.textX !== "") {
          return obj.yAxis.textX;
        } else {
          return d3.select(this).attr("x");
        }
      },
      "y": function() {
        if (obj.yAxis.textY !== "") {
          return obj.yAxis.textY;
        } else {
          return d3.select(this).attr("y");
        }
      }
    });

  obj.dimensions.labelWidth = d3.max(arr);

}

function repositionTextY(text, dimensions) {
  var x = text.attr("x");
  text.attr("transform", "translate(" + (dimensions.labelWidth - (x - 1)) + ",0)");
  text.attr("x", (2 * x));
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
//
function dropTicks(ticks) {

  for (var j = 0; j < ticks[0].length; j++) {
    var c = ticks[0][j],
        n = ticks[0][j+1];
    if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect)
      continue;
    while (c.getBoundingClientRect().right > n.getBoundingClientRect().left) {
      d3.select(n).remove();
      j++;
      n = ticks[0][j+1];
      if (!n)
        break;
    }
  }

}

function dropLastTick(axisNode, tickWidth) {

  var axisGroupWidth = axisNode.node().getBBox().width,
      tickArr = axisNode.selectAll(".tick")[0];

  if (tickArr.length) {

    var firstTickOffset = d3.transform(d3.select(tickArr[0])
      .attr("transform")).translate[0];

    if ((axisGroupWidth + firstTickOffset) >= tickWidth) {
      var lastTick = tickArr[tickArr.length - 1];
      d3.select(lastTick).attr("class", "last-tick-hide");
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

function tickFinderY(scale, tickCount, tickSettings) {

  // In a nutshell:
  // Checks if an explicit number of ticks has been declared
  // If not, sets lower and upper bounds for the number of ticks
  // Iterates over those and makes sure that there are tick arrays where
  // the last value in the array matches the domain max value
  // if so, tries to find the tick number closest to 5 out of the winners,
  // and returns that arr to the scale for use

  var min = scale.domain()[0],
      max = scale.domain()[1];

  if (tickCount !== "auto") {

    return scale.ticks(tickCount);

  } else {

    var tickLowerBound = tickSettings.tickLowerBound,
        tickUpperBound = tickSettings.tickUpperBound,
        tickGoal = tickSettings.tickGoal,
        arr = [],
        tickCandidates = [],
        closestArr;

    for (var i = tickLowerBound; i <= tickUpperBound; i++) {
      var tickCandidate = scale.ticks(i);

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

    return scale.ticks(closestArr);

  }
}

function axisCleanup(xAxisObj, yAxisObj, obj, node) {

  // this section is kinda gross, sorry:
  // resets ranges and dimensions, redraws yAxis, adds
  // the zero line and repositions the xAxis. phew.

  yAxisObj.axis.scale().range([obj.dimensions.yAxisHeight(), 0]);

  yAxisObj.node
    .call(yAxisObj.axis);

  var yAxisNode = yAxisObj.node.select("." + obj.prefix + "y-axis");
  var axisObj = obj["yAxis"];

  yAxisNode.selectAll(".tick text")
    .attr("transform", "translate(0,0)")
    .call(updateTextY, yAxisNode, obj, yAxisObj.axis, axisObj)
    .call(repositionTextY, obj.dimensions);

  yAxisNode.selectAll(".tick line")
    .attr({
      "x1": obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
      "x2": obj.dimensions.computedWidth()
    });

  if (obj.xAxis.scale === "ordinal") {
    // xAxisObj.axis.scale().rangeExtent([0, obj.dimensions.tickWidth()]);
    // xAxisObj.axis.scale().rangeRoundBands([0, obj.dimensions.tickWidth()], obj.dimensions.bands.padding, obj.dimensions.bands.outerPadding());
    // xAxisObj.node.call(xAxisObj.axis);

  } else {
    xAxisObj.axis.scale().range([0, obj.dimensions.tickWidth()]);
  }

  xAxisObj.node
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");

  // once the axis is fully drawn, check that we don"t have any ticks
  // extending beyond the width of the SVG. if so, drop it like its hot
  dropLastTick(xAxisObj.node, obj.dimensions.tickWidth());

}

function addZeroLine(obj, node, Axis) {

  var minVal = Axis.axis.scale().domain()[0];

  if (minVal <= 0) {

    var refGroup = Axis.node.selectAll(".tick:not(." + obj.prefix + "minor)");
        refLine = refGroup.select("line");

    // zero line
    node.append("line")
      .attr({
        "class": obj.prefix + "zero-line",
        "transform": refGroup.attr("transform"),
        "x1": refLine.attr("x1"),
        "x2": refLine.attr("x2"),
        "y1": 0,
        "y2": 0
      })
      .style("shape-rendering", "crispEdges");

    refLine.style("display", "none");

  }

}

module.exports = {
  AxisFactory: AxisFactory,
  axisManager: axisManager,
  determineFormat: determineFormat,
  appendXAxis: appendXAxis,
  appendYAxis: appendYAxis,
  timeAxis: timeAxis,
  discreteAxis: discreteAxis,
  formatText: formatText,
  setTickFormatY: setTickFormatY,
  updateTextY: updateTextY,
  repositionTextY: repositionTextY,
  newTextNode: newTextNode,
  dropTicks: dropTicks,
  dropLastTick: dropLastTick,
  tickFinderX: tickFinderX,
  tickFinderY: tickFinderY,
  axisCleanup: axisCleanup,
  addZeroLine: addZeroLine
};
