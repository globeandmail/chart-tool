var settings = require("./chart-tool-settings");

var dimensionSettings = {
  width: 0,
  height: function() {
    var ratioScale = d3.scale.linear().range([300, 900]).domain([this.width * this.ratioMobile, this.width * this.ratioDesktop]);
    return Math.round(ratioScale(this.width));
  },
  ratioMobile: settings.ratioMobile,
  ratioDesktop: settings.ratioDesktop,
  margins: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  headerHeight: 0,
  footerHeight: 0,
  xAxisHeight: 0,
  yAxisHeight: function() {
    return (this.height() - (this.headerHeight + this.footerHeight + this.xAxisHeight));
  },
  xAxisWidth: 0,
  labelWidth: 0,
  yAxisPaddingRight: settings.yAxisPaddingRight,
  tickWidth: function() {
    return (this.width - (this.labelWidth + this.yAxisPaddingRight));
  },
  bands: {
    padding: 0.08,
    offset: 0.12,
    outerPadding: function() {
      return (this.padding / 2);
    }
  }
};

module.exports = dimensionSettings;
