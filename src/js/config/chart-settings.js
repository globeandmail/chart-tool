import { scaleLinear } from 'd3-scale';
import * as settings from '../../../custom/chart-tool-config.json';
import { version, buildVer } from '../../../package.json';

const chartSettings = {

  prefix: settings.prefix,
  CUSTOM: settings.CUSTOM,
  version: version,
  build: buildVer,
  id: '',
  data: '',
  dateFormat: settings.dateFormat,
  timeFormat: settings.timeFormat,
  image: settings.image,
  heading: '',
  qualifier: '',
  source: '',
  index: '',
  hasHours: false,
  social: settings.social,
  baseClass: `${settings.prefix}chart`,
  customClass: '',

  options: {
    annotations: true,
    expanded: false,
    footer: true,
    head: true,
    indexed: false,
    interpolation: 'linear',
    legend: true,
    qualifier: true,
    share_data: true,
    social: true,
    stacked: false,
    tips: true,
    type: 'line',
    x_axis: true,
    y_axis: true
  },

  xAxis: settings.xAxis,
  yAxis: settings.yAxis,

  annotations: {
    highlight: [],
    range: [],
    text: [],
    pointer: []
  },

  exportable: false, // this can be overwritten by the backend as needed
  editable: false,
  debounce: settings.debounce,
  tipTimeout: settings.tipTimeout,
  monthsAbr: settings.monthsAbr,

  dimensions: {
    width: 0,
    computedWidth: function() {
      return this.width - this.margin.left - this.margin.right;
    },
    height: function() {
      const ratioScale = scaleLinear().range([300, 900]).domain([this.width * this.ratioMobile, this.width * this.ratioDesktop]);
      return Math.round(ratioScale(this.width));
    },
    computedHeight: function() {
      return (this.height() - this.headerHeight - this.footerHeight - this.margin.top - this.margin.bottom);
    },
    ratioMobile: settings.ratioMobile,
    ratioDesktop: settings.ratioDesktop,
    margin: settings.margin,
    tipPadding: settings.tipPadding,
    tipOffset: settings.tipOffset,
    headerHeight: 0,
    footerHeight: 0,
    xAxisHeight: 0,
    yAxisHeight: function() {
      return (this.computedHeight() - this.xAxisHeight);
    },
    xAxisWidth: 0,
    labelWidth: 0,
    yAxisPaddingRight: settings.yAxis.paddingRight,
    tickWidth: function() {
      return (this.computedWidth() - (this.labelWidth + this.yAxisPaddingRight));
    },
    barHeight: settings.barHeight,
    barLabelOffset: settings.barLabelOffset,
    scatterplotRadius: settings.scatterplotRadius,
    bands: {
      padding: settings.bands.padding,
      offset: settings.bands.offset,
      outerPadding: settings.bands.outerPadding
    }
  }

};

export default chartSettings;
