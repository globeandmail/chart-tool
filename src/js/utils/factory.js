import { inputDate, parse } from './dataparse';
import { isUndefined } from '../helpers/helpers';
import Settings from '../config/chart-settings';

/**
 * Chart object factory module.
 * @module utils/factory
 */

export default class Recipe extends Settings {

  constructor(obj) {

    super();

    const embed = obj.data,
      chart = embed.chart;

    // I'm not a big fan of indenting stuff like this
    // (looking at you, Pereira), but I'm making an exception
    // in this case because my eyes were bleeding.

    this.dispatch    = obj.dispatch;
    this.version     = embed.version                           || this.version;
    this.id          = obj.id                                  || this.id;
    this.heading     = embed.heading                           || this.heading;
    this.qualifier   = embed.qualifier                         || this.qualifier;
    this.source      = embed.source                            || this.source;
    this.deck        = embed.deck                              || this.deck;
    this.customClass = chart.class                             || this.customClass;
    this.xAxis       = Object.assign(this.xAxis, chart.x_axis) || this.xAxis;
    this.yAxis       = Object.assign(this.yAxis, chart.y_axis) || this.yAxis;

    const o = this.options,
      co = chart.options;

    //  'options' area of embed code
    o.type          = chart.options.type          || o.type;
    o.interpolation = chart.options.interpolation || o.interpolation;

    o.social      = !isUndefined(co.social) === true ? co.social           : o.social;
    o.share_data  = !isUndefined(co.share_data) === true ? co.share_data   : o.share_data;
    o.stacked     = !isUndefined(co.stacked) === true ? co.stacked         : o.stacked;
    o.expanded    = !isUndefined(co.expanded) === true ? co.expanded       : o.expanded;
    o.head        = !isUndefined(co.head) === true ? co.head               : o.head;
    o.deck        = !isUndefined(co.deck) === true ? co.deck               : o.deck;
    o.legend      = !isUndefined(co.legend) === true ? co.legend           : o.legend;
    o.qualifier   = !isUndefined(co.qualifier) === true ? co.qualifier     : o.qualifier;
    o.footer      = !isUndefined(co.footer) === true ? co.footer           : o.footer;
    o.x_axis      = !isUndefined(co.x_axis) === true ? co.x_axis           : o.x_axis;
    o.y_axis      = !isUndefined(co.y_axis) === true ? co.y_axis           : o.y_axis;
    o.tips        = !isUndefined(co.tips) === true ? co.tips               : o.tips;
    o.annotations = !isUndefined(co.annotations) === true ? co.annotations : o.annotations;
    o.range       = !isUndefined(co.range) === true ? co.range             : o.range;
    o.series      = !isUndefined(co.series) === true ? co.series           : o.series;
    o.index       = !isUndefined(co.indexed) === true ? co.indexed         : o.index;

    //  these are specific to the t object and don't exist in the embed
    this.baseClass        = embed.baseClass  || this.baseClass;
    this.dimensions.width = embed.width      || this.dimensions.width;
    this.prefix           = chart.prefix     || this.prefix;
    this.exportable       = chart.exportable || this.exportable;
    this.editable         = chart.editable   || this.editable;

    if (this.exportable) {
      this.dimensions.width = chart.exportable.width || embed.width || this.dimensions.width;
      this.dimensions.height = function() { return chart.exportable.height; };
      this.dimensions.margin = chart.exportable.margin || this.dimensions.margin;
    }

    if (chart.hasHours) { `${this.dateFormat} ${this.timeFormat}`; }

    this.hasHours   = chart.hasHours   || this.hasHours;
    this.dateFormat = chart.dateFormat || this.dateFormat;

    this.dateFormat = inputDate(this.xAxis.scale, this.dateFormat, chart.date_format);
    this.data = parse(chart.data, this.dateFormat, o.index, o.stacked, o.type) || this.data;

  }

}
