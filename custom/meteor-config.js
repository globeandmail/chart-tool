import config from './chart-tool-config.json';
import { version, buildVer, name } from '../package.json';

export const app_version = version;
export const app_build = buildVer;
export const app_name = name;
export const prefix = config.prefix;

export const app_settings = {

  s3: config.image,
  thumbnail_debounce: config.thumbnailDebounce,

  embedJS: config.embedJS.replace('{{version}}', version),
  embedCSS: config.embedCSS.replace('{{version}}', version),
  source_suffix: config.source.suffix,

  // if you want to add more colour palettes, just add their
  // name to this array and charts will be classed using this name
  palettes: ['Primary', 'Alternate', 'Grayscale'],

  highlightOptions: [
    '#1f77b4',
    '#ff7f0e',
    '#bcbd22',
    '#8c564b',
    '#7f7f7f',
    '#6b6ecf',
    '#b5cf6b',
    '#e7ba52',
    '#d6616b',
    '#ce6dbd'
  ],

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
    note: '',
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
      annotations: true,
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

    annotations: {
      highlight: [],
      range: [],
      text: []
    },

    public: false,

    users: [],
    tags: [],

    img: '',
    print: {
      columns: '2col',
      lines: 20,
      width: '',
      height: '',
      mode: 'columns'
    }

  },

  print: {
    gutter_width: 4,
    column_width: 47,
    first_line_depth: 2.14,
    line_depth: 3.35,
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
      top: 5,
      right: 1,
      bottom: 0,
      left: 0
    },
    barLabelOffset: 3
  },

  web: {
    margin: {
      top: 7,
      right: 0,
      bottom: 0,
      left: 0
    },
  }

};
