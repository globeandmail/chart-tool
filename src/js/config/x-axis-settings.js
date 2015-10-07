var settings = require("./chart-tool-settings").xAxisTicks;

var xAxisSettings = {
  diplay: true,
  scale: "time",
  ticks: "auto",
  orient: "bottom",
  format: "auto",
  prefix: "",
  suffix: "",
  min: "",
  max: "",
  rescale: false,
  nice: false,

  tickTarget: settings.tickTarget,
  ticksSmall: settings.ticksSmall,
  dy: settings.dy,
  widthThreshold: settings.widthThreshold,
  upper: settings.upper,
  lower: settings.lower

};

module.exports = xAxisSettings;
