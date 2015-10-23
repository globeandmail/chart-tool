var version = { version: '1.1.0', build: '0' };
var settings = require("json!../../../custom/chart-tool-config.json");

module.exports = {

  CUSTOM: settings.CUSTOM,
  version: version.version,
  build: version.build,
  id: "",
  data: "",
  dateFormat: settings.dateFormat,
  timeFormat: settings.timeFormat,
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
  xAxis: settings.xAxis,
  yAxis: settings.yAxis,

  exportable: false, // this can be overwritten by the backend as needed
  editable: false,

  prefix: settings.prefix,
  debounce: settings.debounce,
  tipTimeout: settings.tipTimeout,
  scaleMultiplier: settings.scaleMultiplier,
  monthsAbr: settings.monthsAbr,

  dimensions: {
    width: 0,
    computedWidth: function() {
      return this.width - this.padding.right - this.padding.left;
    },
    height: function() {
      var ratioScale = d3.scale.linear().range([300, 900]).domain([this.width * this.ratioMobile, this.width * this.ratioDesktop]);
      return Math.round(ratioScale(this.width));
    },
    computedHeight: function() {
      return (this.height() - this.headerHeight - this.footerHeight - this.padding.top - this.padding.bottom);
    },
    ratioMobile: settings.ratioMobile,
    ratioDesktop: settings.ratioDesktop,
    padding: settings.padding,
    headerHeight: 0,
    footerHeight: 0,
    xAxisHeight: 0,
    yAxisHeight: function() {
      return (this.computedHeight() - this.xAxisHeight);
    },
    xAxisWidth: 0,
    labelWidth: 0,
    yAxisPaddingRight: settings.yAxis.paddingRight,
    tickWidth: function() {
      return (this.computedWidth() - (this.labelWidth + this.yAxisPaddingRight));
    },
    bands: {
      padding: settings.bands.padding,
      offset: settings.bands.offset,
      outerPadding: function() {
        return (this.padding / 2);
      }
    }
  }

};
