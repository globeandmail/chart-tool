var config = require("json!./chart-tool-config.json"),
    p = require("json!../package.json");

app_version = p.version;
app_build = p.buildVer;
app_name = p.name;
prefix = config.prefix;

app_settings = {

  animal_api: "http://www.whimsicalwordimal.com/api/name",
  names: [
    "Sardonic Salamander",
    "Obstreperous Okapi",
    "Jaundiced Jaguar",
    "Warbling Wren",
    "Pontificating Panther",
    "Ceylonese Civet",
    "Smug Sponge",
    "Stained Seahorse",
    "Knightly Kangaroo",
    "Traditionalist Tortoise",
    "Stalkless Shrimp",
    "Colloidal Coral",
    "Terrified Tang",
    "Booked Baboon"
  ],

  defaults: {
    source_prefix: "CHART TOOL",
    source_suffix: " » SOURCE:"
  },

  primary: "NEWS & ROB",
  alternate: "Globe Investor",

  help: "http://confluence.colo.theglobeandmail.com/display/ed/Chart+Tool",

  chart: {
    version: app_version,
    build: app_build,
    prefix: prefix,
    slug: "",
    heading: "",
    qualifier: "",
    deck: "",
    source: "CHART TOOL",
    class: "primary",
    date_format: config.dateFormat,
    time_format: config.timeFormat,
    hasHours: false,
    data: "",
    options: {
      type: "line",
      interpolation: "linear",
      stacked: false,
      expanded: false,
      head: true,
      deck: false,
      legend: true,
      footer: true,
      x_axis: true,
      y_axis: true,
      tips: false,
      annotations: false,
      range: false,
      series: false,
      indexed: false,
      qualifier: true
    },
    x_axis: {
      display: config.xAxis.display,
      scale: config.xAxis.scale,
      ticks: config.xAxis.ticks,
      orient: config.xAxis.orient,
      format: config.xAxis.format,
      prefix: config.xAxis.prefix,
      suffix: config.xAxis.suffix,
      min: config.xAxis.min,
      max: config.xAxis.max,
      rescale: config.xAxis.rescale,
      nice: config.xAxis.nice
    },
    y_axis: {
      display: config.yAxis.display,
      scale: config.yAxis.scale,
      ticks: config.yAxis.ticks,
      orient: config.yAxis.orient,
      format: config.yAxis.format,
      prefix: config.yAxis.prefix,
      suffix: config.yAxis.suffix,
      min: config.yAxis.min,
      max: config.yAxis.max,
      rescale: config.yAxis.rescale,
      nice: config.yAxis.nice
    },

    series: [],
    mobile: {},
    annotations: {},

    // for when series are indexed to a value
    index: "",
    range: [],

    img: "",
    print: {
      columns: "2col",
      lines: 20
    }

  },

  empty_series: {
    style: "",
    emphasis: {},
    pointers: {}
  },

  empty_range: {
    //x or y
    axis: "",
    //key to use as start location
    start: "",
    //optional - if not specified a line is shown instead
    end: "",
    label: ""
  },

  print: {
    default_cols: "2col",
    default_scale: 8,
    gutter_width: 4,
    column_width: 47,
    first_line_depth: 2.14,
    line_depth: 3.35,
    dpi: 266, // this actually doesn't matter for PDFs, but good to make note
    magic: {
      // i don't understand why these are necessary for print, but they are
      width: 3.698,
      height: 3.675
    },
    x_axis: {
      tickTarget: 8,
      ticksSmall: 5,
      dy: 0.7,
      ems: 1.1,
      upper: {
        tickHeight: 4,
        textX: 2,
        textY: 2
      },
      lower: {
        tickHeight: 7,
        textX: 2,
        textY: 0
      }
    },
    y_axis: {
      paddingRight: 6
    }
  }

};
