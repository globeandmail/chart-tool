import { axisManager as Axis, axisCleanup, addZeroLine } from '../components/axis';
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
      singleColumn = xScale.step();
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
    .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`);

  const series = seriesGroup.selectAll(`g.${obj.prefix}series`)
    .data(obj.data.stackedData)
    .enter().append('g')
    .attr('class', (d, i) => `${obj.prefix}series ${obj.prefix}series-${i}`);

  const columnItem = series
    .append('g')
    .attrs({
      'class': (d, i) => `${obj.prefix}column ${obj.prefix}column-${i}`,
      'data-legend': d => d.key,
    });

  const rect = columnItem.selectAll('rect')
    .data(d => d)
    .enter().append('rect')
    .attrs({
      'data-key': d => obj.data.inputDateFormat ? d.data.originalKey : d.data[obj.data.keys[0]],
      'x': d => xScale(d.data[obj.data.keys[0]]),
      'y': d => yScale(Math.max(0, d[1])),
      'height': d => Math.abs(yScale(d[1]) - yScale(d[0])),
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
    rect: rect,
    singleColumn: singleColumn
  };

}
