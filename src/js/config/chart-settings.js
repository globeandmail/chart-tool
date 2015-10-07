var settings = require("./chart-tool-settings");

var chartDefault = {

  version: "",
  id: "",
  data: "",
  dateFormat: "%Y-%m-%d",
  timeFormat: "%H:%M",
  heading: "",
  qualifier: "",
  source: "",
  deck: "",
  index: "",
  hasHours: false,
  seriesHighlight: function() {
    if (this.data.seriesAmount && this.data.seriesAmount <= 1) {
      return 1;
    } else {
      return 0;
    }
  },
  baseClass: function() { return this.prefix + "chart"; },
  customClass: "",

  options: {
    type: "line",
    interpolation: "linear",
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
    series: false
  },

  range: {},
  series: {},
  dimensions: require("./dimension-settings"),
  xAxis: require("./x-axis-settings"),
  yAxis: require("./y-axis-settings"),

  exportable: false, // this can be overwritten by the backend as needed
  editable: false,

  prefix: settings.prefix,
  debounce: settings.debounce,
  scaleMultiplier: settings.scaleMultiplier,
  colorScale: settings.colorScale

};

module.exports = chartDefault;