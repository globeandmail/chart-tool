var chartToolSettings = {
  version: '1.1.0',
  build: '0',
  prefix: "gc-",
  monthsAbr: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan"],

  colorScale: ['#555','#888','#bbb','#dedede'],

  yAxisTicks: {
    tickLowerBound: 3,
    tickUpperBound: 8,
    tickGoal: 5
  },

  xAxisTicks: {
    tickTarget: 6,
    ticksSmall: 4,
    dy: 0.7,
    widthThreshold: 420,
    upper: {
      tickHeight: 7,
      textX: 6,
      textY: 7
    },
    lower: {
      tickHeight: 12,
      textX: 6,
      textY: 2
    }
  },

  yAxisPaddingRight: 9,
  scaleMultiplier: 1.25,
  debounce: 500,
  ratioMobile: 1.15,
  ratioDesktop: 0.65

}

module.exports = chartToolSettings;
