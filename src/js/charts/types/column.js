import { axisManager as Axis, axisCleanup, addZeroLine } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import { timeInterval } from '../../utils/utils';
import 'd3-selection-multi';

export default function columnChart(node, obj) {

  const xScaleObj = new Scale(obj, 'xAxis'),
    yScaleObj = new Scale(obj, 'yAxis'),
    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  const xAxisObj = new Axis(node, obj, xScaleObj.scale, 'xAxis'),
    yAxisObj = new Axis(node, obj, yScaleObj.scale, 'yAxis');

  axisCleanup(node, obj, xAxisObj, yAxisObj);

  let singleColumn;

  switch (obj.xAxis.scale) {
    case 'time':
      singleColumn = obj.dimensions.tickWidth() / (timeInterval(obj.data.data) + 1) / obj.data.seriesAmount;
      xAxisObj.range = [0, (obj.dimensions.tickWidth() - (singleColumn * obj.data.seriesAmount))];
      axisCleanup(node, obj, xAxisObj, yAxisObj);
      break;
    case 'ordinal-time':
      singleColumn = xScale.step();
      break;
    case 'ordinal':
      singleColumn = xScale.bandwidth() / obj.data.seriesAmount;
      break;
  }

  const seriesGroup = node.append('g')
    .attr('class', () => {
      let output = `${obj.prefix}series_group`;
      if (obj.data.seriesAmount > 1) { output += ` ${obj.prefix}multiple`; }
      return output;
    })
    .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`);

  const series = [], columnItems = [];

  for (let i = 0; i < obj.data.seriesAmount; i++) {

    let seriesItem = seriesGroup.append('g').attr('class', `${obj.prefix}series-${i}`);

    let columnItem = seriesItem
      .selectAll(`.${obj.prefix}column`)
      .data(obj.data.data).enter()
      .append('g')
      .attrs({
        'class': `${obj.prefix}column ${obj.prefix}column-${i}`,
        'data-series': i,
        'data-key': d => d.key,
        'data-legend': () => obj.data.keys[i + 1],
        'transform': d => {
          if (obj.xAxis.scale !== 'ordinal-time') {
            return `translate(${xScale(d.key)},0)`;
          }
        }
      });

    columnItem.append('rect')
      .attrs({
        'class': d => {
          return d.series[i].val < 0 ? `${obj.prefix}negative` : `${obj.prefix}positive`;
        },
        'x': d => {
          if (obj.xAxis.scale !== 'ordinal-time') {
            return i * singleColumn;
          } else {
            return xScale(d.key);
          }
        },
        'y': d => {
          if (d.series[i].val && d.series[i].val !== '__undefined__') {
            return yScale(Math.max(0, d.series[i].val));
          }
        },
        'height': d => {
          if (d.series[i].val && d.series[i].val !== '__undefined__') {
            return Math.abs(yScale(d.series[i].val) - yScale(0));
          }
        },
        'width': () => {
          if (obj.xAxis.scale !== 'ordinal-time') {
            return singleColumn;
          } else {
            return singleColumn / obj.data.seriesAmount;
          }
        }
      });

    if (obj.data.seriesAmount > 1) {

      const columnOffset = obj.dimensions.bands.offset;

      columnItem.selectAll('rect')
        .attrs({
          'x': d => {
            if (obj.xAxis.scale !== 'ordinal-time') {
              return ((i * singleColumn) + (singleColumn * (columnOffset / 2)));
            } else {
              return xScale(d.key) + (i * (singleColumn / obj.data.seriesAmount));
            }
          },
          'width': () => {
            if (obj.xAxis.scale !== 'ordinal-time') {
              return (singleColumn - (singleColumn * columnOffset));
            } else {
              return singleColumn / obj.data.seriesAmount;
            }
          }
        });
    }

    series.push(seriesItem);
    columnItems.push(columnItem);

  }

  addZeroLine(obj, node, yAxisObj, 'yAxis');

  return {
    xScaleObj,
    yScaleObj,
    xAxisObj,
    yAxisObj,
    seriesGroup,
    series,
    singleColumn,
    columnItems
  };

}
