var settings = require("./chart-tool-settings");

var yAxisSettings = {

  diplay: true,
  scale: "linear",
  ticks: "auto",
  orient: "right",
  format: "comma",
  prefix: "",
  suffix: "",
  min: "",
  max: "",
  rescale: false,
  nice: true,

  paddingRight: settings.yAxisPaddingRight,

  tickLowerBound: settings.yAxisTicks.tickLowerBound,
  tickUpperBound: settings.yAxisTicks.tickUpperBound,
  tickGoal: settings.yAxisTicks.tickGoal

};

module.exports = yAxisSettings;
