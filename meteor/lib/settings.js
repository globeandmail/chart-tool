// // this file sets the defaults for the app as a whole.

// app_version = '1.1.0';
// app_build = '0';
// prefix = "ct-";

// app_settings = {

//   standard_date: "%Y-%m-%d",
//   standard_time: "%H:%M",

//   // animal-namer api endpoint (and a fallback list of names)
//   animal_api: "http://ed-lab.colo.theglobeandmail.com:8080/api/name",
//   names: [
//     "Sardonic Salamander",
//     "Obstreperous Okapi",
//     "Jaundiced Jaguar",
//     "Warbling Wren",
//     "Pontificating Panther",
//     "Ceylonese Civet",
//     "Smug Sponge",
//     "Stained Seahorse",
//     "Knightly Kangaroo",
//     "Traditionalist Tortoise",
//     "Stalkless Shrimp",
//     "Colloidal Coral",
//     "Terrified Tang",
//     "Booked Baboon"
//   ],

//   // app defaults
//   defaults: {
//     source_prefix: "CHART TOOL",
//     source_suffix: " » SOURCE:"
//   },

//   // chart defaults
//   chart: {
//     version: app_version,
//     build: app_build,
//     prefix: prefix,
//     slug: "",
//     heading: "",
//     qualifier: "",
//     deck: "",
//     source: "",
//     class: "primary",
//     date_format: "%Y-%m-%d",
//     hasHours: false,
//     data: "",
//     options: {
//       type: "line",
//       interpolation: "linear",
//       stacked: false,
//       expanded: false,
//       head: true,
//       deck: false,
//       legend: true,
//       footer: true,
//       x_axis: true,
//       y_axis: true,
//       tips: false,
//       annotations: false,
//       range: false,
//       series: false
//     },
//     x_axis: {
//       display: true,
//       scale: "time",
//       ticks: "auto",
//       orient: "bottom",
//       format: "auto",
//       prefix: "",
//       suffix: "",
//       min: "",
//       max: "",
//       rescale: false,
//       nice: false
//     },
//     y_axis: {
//       display: true,
//       scale: "linear",
//       ticks: "auto",
//       orient: "right",
//       format: "comma",
//       prefix: "",
//       suffix: "",
//       min: "",
//       max: "",
//       rescale: true,
//       nice: true
//     },
//     series: [{
//       style: "",
//       emphasis: {},
//       pointers: {}
//     }],
//     mobile: {},
//     annotations: {},

//     // for when series are indexed to a value
//     index: "",

//     range: [{
//       //x or y
//       axis: "",
//       //key to use as start location
//       start: "",
//       //optional - if not specified a line is shown instead
//       end: "",
//       label: ""
//     }],

//     img: "",
//     print: {
//       columns: "2col",
//       lines: 20
//     },
//   },

//   empty_series: {
//     style: "",
//     emphasis: {},
//     pointers: {}
//   },

//   // print specific measurements, in mm
//   print: {
//     default_cols: "2col",
//     default_scale: 8,
//     gutter_width: 4,
//     column_width: 47,
//     first_line_depth: 2.14,
//     line_depth: 3.35,
//     dpi: 266, // this actually doesn't matter for PDFs, but good to make note
//     magic: {
//       // i don't understand why these are necessary for print, but they are
//       width: 3.698,
//       height: 3.675
//     },
//     x_axis: {
//       tickTarget: 8,
//       ticksSmall: 5,
//       dy: 0.7,
//       ems: 1.1,
//       upper: {
//         tickHeight: 4,
//         textX: 2,
//         textY: 2
//       },
//       lower: {
//         tickHeight: 7,
//         textX: 2,
//         textY: 0
//       }
//     },
//     y_axis: {
//       paddingRight: 6
//     }
//   }

// }
