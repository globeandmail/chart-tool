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
    };
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

function mouseIdle(tipNodes, obj, timeout) {
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
          timeout = mouseIdle(tipNodes, obj, timeout);
          return fns[obj.options.type](tipNodes, innerTipElements, obj);
        });

      break;

    case "column":

      var columnRects;

      if (obj.options.stacked) {
        columnRects = obj.rendered.plot.series.selectAll('rect')
      } else {
        columnRects = obj.rendered.plot.columnItem.selectAll('rect');
      }

      columnRects
        .on("mouseover", function(d) {
          showTips(tipNodes, obj);
          clearTimeout(timeout);
          timeout = mouseIdle(tipNodes, obj, timeout);
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

    var yFormatter = require("./axis").setTickFormatY,
        timeDiff = require("../../utils/utils").timeDiff;
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

    var yFormatter = require("./axis").setTickFormatY,
        timeDiff = require("../../utils/utils").timeDiff;
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

    var yFormatter = require("./axis").setTickFormatY,
        timeDiff = require("../../utils/utils").timeDiff;
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

    var yFormatter = require("./axis").setTickFormatY,
        timeDiff = require("../../utils/utils").timeDiff;
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

    var yFormatter = require("./axis").setTickFormatY,
      timeDiff = require("../../utils/utils").timeDiff,
      getTranslateXY = require("../../utils/utils").getTranslateXY,
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

    var yFormatter = require("./axis").setTickFormatY,
      timeDiff = require("../../utils/utils").timeDiff,
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

module.exports = tipsManager;
