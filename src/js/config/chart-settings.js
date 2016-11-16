import { scaleLinear } from 'd3-scale';
import * as settings from '../../../custom/chart-tool-config.json';
import { version, buildVer } from '../../../package.json';

export default class Settings {

  constructor() {

    this.prefix = settings.prefix;

    this.CUSTOM = settings.CUSTOM;
    this.version = version;
    this.build = buildVer;
    this.id = '';
    this.data = '';
    this.dateFormat = settings.dateFormat;
    this.timeFormat = settings.timeFormat;
    this.image = settings.image;
    this.heading = '';
    this.qualifier = '';
    this.source = '';
    this.deck = '';
    this.index = '';
    this.hasHours = false;
    this.social = settings.social;
    this.seriesHighlight = () => {
      return (this.data.seriesAmount && this.data.seriesAmount <= 1) ? 1 : 0;
    };
    this.baseClass = () => { return `${this.prefix}chart`; };
    this.customClass = '';

    this.options = {
      type: 'line',
      interpolation: 'linear',
      stacked: false,
      expanded: false,
      head: true,
      deck: false,
      qualifier: true,
      legend: true,
      footer: true,
      x_axis: true,
      y_axis: true,
      tips: false,
      annotations: false,
      range: false,
      series: false,
      share_data: true,
      social: true
    };

    this.range = {};
    this.series = {};
    this.xAxis = settings.xAxis;
    this.yAxis = settings.yAxis;

    this.exportable = false; // this can be overwritten by the backend as needed
    this.editable = false;
    this.debounce = settings.debounce;
    this.tipTimeout = settings.tipTimeout;
    this.monthsAbr = settings.monthsAbr;

    this.dimensions = {
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
      bands: {
        padding: settings.bands.padding,
        offset: settings.bands.offset,
        outerPadding: settings.bands.outerPadding
      }
    };

  }

}
