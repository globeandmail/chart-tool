function plot(node, obj) {

  var draw = {
    line: require("../types/line"),
    multiline: require("../types/multiline"),
    area: require("../types/area"),
    stackedArea: require("../types/stacked-area"),
    column: require("../types/column"),
    stackedColumn: require("../types/stacked-column"),
    streamgraph: require("../types/streamgraph")
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
      if (obj.options.stacked) {
        chartRef = draw.stackedArea(node, obj);
      } else {
        chartRef = draw.area(node, obj);
      }
      break;

    case "column":
      if (obj.options.stacked) {
        chartRef = draw.stackedColumn(node, obj);
      } else {
        chartRef = draw.column(node, obj);
      }
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

module.exports = plot;
