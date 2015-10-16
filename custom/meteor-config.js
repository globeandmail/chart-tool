var config = require("./chart-tool-config.json"),
    p = require("../package.json");

app_version = p.version;
app_build = p.buildVer;
prefix = config.prefix;

app_settings = {

  animal_api: "http://ed-lab.colo.theglobeandmail.com:8080/api/name",
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
    source_prefix: "",
    source_suffix: " » SOURCE:"
  },

  chart: {
    version: app_version,
    build: app_build,
    prefix: prefix,
    slug: "",
    heading: "",
    qualifier: "",
    deck: "",
    source: "",
    class: "",
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
      indexed: false
    },
    x_axis: config.xAxis,
    y_axis: config.yAxis,

    series: [{
      style: "",
      emphasis: {},
      pointers: {}
    }],
    mobile: {},
    annotations: {},

    // for when series are indexed to a value
    index: "",
    range: [{
      //x or y
      axis: "",
      //key to use as start location
      start: "",
      //optional - if not specified a line is shown instead
      end: "",
      label: ""
    }],

    img: "",
    print: {
      columns: "2col",
      lines: 20
    },

    empty_series: {
      style: "",
      emphasis: {},
      pointers: {}
    },

  }

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
