import { inputDate, parse } from './dataparse';
import { isUndefined as isUndef, extend } from '../helpers/helpers';
import chartSettings from '../config/chart-settings';

export default function recipe(obj) {

  const t = extend(chartSettings),
    embed = obj.data,
    chart = embed.chart;

  // I'm not a big fan of indenting stuff like this but making
  // an exception in this case because eyes were bleeding

  t.dispatch    = obj.dispatch;
  t.version     = embed.version                 || t.version;
  t.id          = obj.id                        || t.id;
  t.heading     = embed.heading                 || t.heading;
  t.qualifier   = embed.qualifier               || t.qualifier;
  t.source      = embed.source                  || t.source;
  t.customClass = chart.class                   || t.customClass;
  t.xAxis       = extend(t.xAxis, chart.x_axis) || t.xAxis;
  t.yAxis       = extend(t.yAxis, chart.y_axis) || t.yAxis;

  const o = t.options,
    co = chart.options;

  // 'options' area of embed code
  o.type          = chart.options.type          || o.type;
  o.interpolation = chart.options.interpolation || o.interpolation;

  o.social      = !isUndef(co.social) === true ? co.social           : o.social;
  o.share_data  = !isUndef(co.share_data) === true ? co.share_data   : o.share_data;
  o.stacked     = !isUndef(co.stacked) === true ? co.stacked         : o.stacked;
  o.expanded    = !isUndef(co.expanded) === true ? co.expanded       : o.expanded;
  o.head        = !isUndef(co.head) === true ? co.head               : o.head;
  o.legend      = !isUndef(co.legend) === true ? co.legend           : o.legend;
  o.qualifier   = !isUndef(co.qualifier) === true ? co.qualifier     : o.qualifier;
  o.footer      = !isUndef(co.footer) === true ? co.footer           : o.footer;
  o.x_axis      = !isUndef(co.x_axis) === true ? co.x_axis           : o.x_axis;
  o.y_axis      = !isUndef(co.y_axis) === true ? co.y_axis           : o.y_axis;
  o.tips        = !isUndef(co.tips) === true ? co.tips               : o.tips;
  o.annotations = !isUndef(co.annotations) === true ? co.annotations : o.annotations;
  o.index       = !isUndef(co.indexed) === true ? co.indexed         : o.index;

  //  these are specific to the t object and don't exist in the embed
  t.baseClass        = embed.baseClass  || t.baseClass;
  t.dimensions.width = embed.width      || t.dimensions.width;
  t.prefix           = chart.prefix     || t.prefix;
  t.exportable       = chart.exportable || t.exportable;
  t.editable         = chart.editable   || t.editable;

  if (t.exportable) {
    t.dimensions.margin = chart.exportable.margin || t.dimensions.margin;
    t.dimensions.width = chart.exportable.width || embed.width || t.dimensions.width;
    if (chart.exportable.height) t.dimensions.height = () => chart.exportable.height;
  }

  if (chart.hasHours) t.dateFormat += ` ${t.timeFormat}`;

  t.hasHours   = chart.hasHours   || t.hasHours;
  t.dateFormat = chart.dateFormat || t.dateFormat;

  t.dateFormat = inputDate(t.xAxis.scale, t.dateFormat, chart.date_format);
  t.data = parse(chart.data, t.dateFormat, o.index, o.stacked, o.type) || t.data;

  t.annotations = chart.annotations || t.annotations;
  if (chart.annotationHandlers) t.annotationHandlers = chart.annotationHandlers;

  if (!t.data.stackedData) o.stacked = false;

  t.seriesHighlight = () => {
    return (t.data.seriesAmount && t.data.seriesAmount <= 1) ? 1 : 0;
  };

  return t;

}
