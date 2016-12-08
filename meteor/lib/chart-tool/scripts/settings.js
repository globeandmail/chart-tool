var CUSTOM = false;
var prefix$1 = "ct-";
var monthsAbr = ["Jan.","Feb.","Mar.","Apr.","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec.","Jan."];
var debounce = 500;
var tipTimeout = 5000;
var ratioMobile = 1.15;
var ratioDesktop = 0.65;
var dateFormat = "%Y-%m-%d";
var timeFormat = "%H:%M";
var margin = {"top":10,"right":3,"bottom":0,"left":0};
var tipOffset = {"vertical":2,"horizontal":1};
var tipPadding = {"top":4,"right":9,"bottom":4,"left":9};
var tipRadius = 3.5;
var yAxis = {"display":true,"scale":"linear","ticks":"auto","orient":"right","format":"comma","prefix":"","suffix":"","min":"","max":"","rescale":false,"nice":true,"paddingRight":9,"tickLowerBound":3,"tickUpperBound":8,"tickGoal":5,"widthThreshold":420,"dy":"","textX":0,"textY":""};
var xAxis = {"display":true,"scale":"time","ticks":"auto","orient":"bottom","format":"auto","prefix":"","suffix":"","min":"","max":"","rescale":false,"nice":false,"rangePoints":1,"tickTarget":6,"ticksSmall":4,"widthThreshold":420,"dy":0.7,"barOffset":9,"upper":{"tickHeight":7,"textX":6,"textY":7},"lower":{"tickHeight":12,"textX":6,"textY":2}};
var barHeight = 25;
var barLabelOffset = 6;
var bands = {"padding":0.12,"offset":0.06,"outerPadding":0.06};
var source = {"prefix":"CHART TOOL","suffix":" » SOURCE:"};
var social = {"facebook":{"label":"Facebook","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-facebook.svg","redirect":"","appID":""},"twitter":{"label":"Twitter","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-twitter.svg","via":"","hashtag":""},"email":{"label":"Email","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-mail.svg"},"sms":{"label":"SMS","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-telephone.svg"}};
var image = {"enable":false,"base_path":"","expiration":30000,"filename":"thumbnail","extension":"png","thumbnailWidth":460};
var embedJS = "http://beta.images.theglobeandmail.com/static/templates/tools/chart-tool/1.2.0/chart-tool.min.js";
var embedCSS = "http://beta.images.theglobeandmail.com/static/templates/tools/chart-tool/1.2.0/chart-tool.min.css";
var config = {
	CUSTOM: CUSTOM,
	prefix: prefix$1,
	monthsAbr: monthsAbr,
	debounce: debounce,
	tipTimeout: tipTimeout,
	ratioMobile: ratioMobile,
	ratioDesktop: ratioDesktop,
	dateFormat: dateFormat,
	timeFormat: timeFormat,
	margin: margin,
	tipOffset: tipOffset,
	tipPadding: tipPadding,
	tipRadius: tipRadius,
	yAxis: yAxis,
	xAxis: xAxis,
	barHeight: barHeight,
	barLabelOffset: barLabelOffset,
	bands: bands,
	source: source,
	social: social,
	image: image,
	embedJS: embedJS,
	embedCSS: embedCSS
};

var name = "chart-tool";
var version = "1.2.0";
var buildVer = "0";

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

  primary: 'Primary',
  alternate: 'Alternate',

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
    }
  }

};
