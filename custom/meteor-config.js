import config from './chart-tool-config.json';
import { version, buildVer, name } from '../package.json';

app_version = version;
app_build = buildVer;
app_name = name;
prefix = config.prefix;

app_settings = {

  s3: config.image,

  embedJS: config.embedJS,
  embedCSS: config.embedCSS,

  animal_api: 'http://www.whimsicalwordimal.com/api/name/',
  names: [
    'Sardonic Salamander',
    'Obstreperous Okapi',
    'Jaundiced Jaguar',
    'Warbling Wren',
    'Pontificating Panther',
    'Ceylonese Civet',
    'Smug Sponge',
    'Stained Seahorse',
    'Knightly Kangaroo',
    'Traditionalist Tortoise',
    'Stalkless Shrimp',
    'Colloidal Coral',
    'Terrified Tang',
    'Booked Baboon'
  ],

  source_suffix: config.source.suffix,

  // if you want to add more colour palettes, just add their
  // name to this array and charts will be classed using this name
  palettes: ['Primary', 'Alternate', 'Grayscale'],
  help: 'https://github.com/globeandmail/chart-tool/tree/master/README.md',

  chart: {
    version: app_version,
    build: app_build,
    prefix: prefix,
    slug: '',
    heading: '',
    qualifier: '',
    deck: '',
    class: 'primary',
    source: config.source.prefix,
    date_format: config.dateFormat,
    time_format: config.timeFormat,
    hasHours: false,
    data: '',
    options: {
      type: 'line',
      interpolation: 'linear',
      stacked: false,
      expanded: false,
      head: true,
      deck: false,
      legend: true,
      footer: true,
      x_axis: true,
      y_axis: true,
      tips: true,
      annotations: false,
      range: false,
      series: false,
      indexed: false,
      qualifier: true,
      share_data: true,
      social: true
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
      nice: config.yAxis.nice
    },

    series: [],
    mobile: {},
    annotations: [],
    range: [],

    public: false,

    users: [],
    tags: [],

    img: '',
    print: {
      columns: '2col',
      lines: 20
    }

  },

  empty_series: {
    style: '',
    emphasis: {},
    pointers: {}
  },

  empty_range: {
    //x or y
    axis: '',
    //key to use as start location
    start: '',
    //optional - if not specified a line is shown instead
    end: '',
    label: ''
  },

  print: {
    gutter_width: 4,
    column_width: 47,
    first_line_depth: 2.14,
    line_depth: 3.35,
    dpi: 266, // this actually doesn't matter for PDFs, but good to make note
    magic: {
      width: 3.698,
      height: 3.675
    },
    x_axis: {
      tickTarget: 8,
      ticksSmall: 5,
      dy: 0.7,
      ems: 1.1,
      barOffset: 5,
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
      paddingRight: 5
    },
    margin: {
      top: 7,
      right: 2,
      bottom: 0,
      left: 0
    },
    barLabelOffset: 3
  }

};
