import { axisManager as Axis, axisCleanup, addZeroLine, dropOversetTicks } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import { timeInterval } from '../../utils/utils';
import 'd3-selection-multi';

export default function stackedColumnChart(node, obj) {

  const yScaleObj = new Scale(obj, 'yAxis'),
    xScaleObj = new Scale(obj, 'xAxis'),
    yScale = yScaleObj.scale,
    xScale = xScaleObj.scale;

  const xAxisObj = new Axis(node, obj, xScaleObj.scale, 'xAxis'),
    yAxisObj = new Axis(node, obj, yScaleObj.scale, 'yAxis');

  axisCleanup(node, obj, xAxisObj, yAxisObj);

  let singleColumn;

  switch (obj.xAxis.scale) {
    case 'time':
      singleColumn = obj.dimensions.tickWidth() / (timeInterval(obj.data.data) + 1);
      xAxisObj.range = [0, (obj.dimensions.tickWidth() - singleColumn)];
      axisCleanup(node, obj, xAxisObj, yAxisObj);
      break;
    case 'ordinal-time':
      singleColumn = xScale(obj.data.data[1].key) - xScale(obj.data.data[0].key);
      xAxisObj.node = node.select(`.${obj.prefix}axis-group.${obj.prefix}xAxis`)
        .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)},${obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight})`);
      dropOversetTicks(xAxisObj.node, obj.dimensions.tickWidth());
      break;
    case 'ordinal':
      singleColumn = xScale.bandwidth();
      break;
  }

  const seriesGroup = node.append('g')
    .attr('class', () => {
      let output = `${obj.prefix}series_group`;
      if (obj.data.seriesAmount > 1) { output += ` ${obj.prefix}multiple`; }
      return output;
    })
    .attr('transform', () => {
      let xOffset;
      if (obj.xAxis.scale === 'ordinal-time') {
        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2);
      } else {
        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth();
      }
      return `translate(${xOffset},0)`;
    });

  const series = seriesGroup.selectAll(`g.${obj.prefix}series`)
    .data(obj.data.stackedData)
    .enter().append('g')
    .attr('class', (d, i) => { return `${obj.prefix}series ${obj.prefix}series-${i}`; });

  const columnItem = series
    .append('g')
    .attrs({
      'class': (d, i) => { return `${obj.prefix}column ${obj.prefix}column-${i}`; },
      'data-legend': d => { return d.key; },
    });

  const rect = columnItem.selectAll('rect')
    .data(d => d)
    .enter().append('rect')
    .attrs({
      'data-key': d => { return d.data[obj.data.keys[0]]; },
      'x': d => { return xScale(d.data[obj.data.keys[0]]); },
      'y': d => { return yScale(Math.max(0, d[1])); },
      'height': d => { return Math.abs(yScale(d[1]) - yScale(d[0])); },
      'width': singleColumn
    });

  addZeroLine(obj, node, yAxisObj, 'yAxis');

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    series: series,
    rect: rect
  };

}
