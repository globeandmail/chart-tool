function plot(node, obj) {

  var draw = {
    line: require("../types/line"),
    multiline: require("../types/multiline"),
    area: require("../types/area"),
    stackedArea: require("../types/stacked-area"),
    column: require("../types/column").ColumnChart,
    ordinalTimeColumn: require("../types/column").OrdinalTimeColumnChart,
    bar: require("../types/bar"),
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
      chartRef = obj.options.stacked ? draw.stackedArea(node, obj) : draw.area(node, obj);
      break;

    case "bar":
      chartRef = draw.bar(node, obj);
      break;

    case "column":
      if (obj.xAxis.scale === "ordinal-time") {
        chartRef = draw.ordinalTimeColumn(node, obj);
      } else {
        chartRef = obj.options.stacked ? draw.stackedColumn(node, obj) : draw.column(node, obj);
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
