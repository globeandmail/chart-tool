import { axisManager as Axis, axisCleanup, addZeroLine } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import { line, area } from 'd3-shape';
import { getCurve } from '../../utils/utils';
import 'd3-selection-multi';

export default function streamgraphChart(node, obj) {

  const xScaleObj = new Scale(obj, 'xAxis'),
    yScaleObj = new Scale(obj, 'yAxis'),
    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  const xAxisObj = new Axis(node, obj, xScaleObj.scale, 'xAxis'),
    yAxisObj = new Axis(node, obj, yScaleObj.scale, 'yAxis');

  axisCleanup(node, obj, xAxisObj, yAxisObj);

  if (xScaleObj.obj.type === 'ordinal') {
    xScale.rangeRound([0, obj.dimensions.tickWidth()], 1.0);
  }

  const seriesGroup = node.append('g')
    .attrs({
      'class': `${obj.prefix}series_group`,
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
    });

  // Add a group for each cause.
  const series = seriesGroup.selectAll(`g.${obj.prefix}series`)
    .data(obj.data.stackedData)
    .enter().append('g')
    .attr('class', (d, i) => { return `${obj.prefix}series ${obj.prefix}series-${i}`; });

  const a = area().curve(getCurve(obj.options.interpolation))
    .x(d => { return xScale(d.x); })
    .y0(d => { return yScale(d.y0); })
    .y1(d => { return yScale(d.y0 + d.y); });

  const l = line().curve(getCurve(obj.options.interpolation))
    .x(d => { return xScale(d.x); })
    .y(d => { return yScale(d.y0 + d.y); });

  series.append('path')
    .attr('class', (d, i) => {
      let output = `${obj.prefix}stream-series ${obj.prefix}stream-${i}`;
      if (i === obj.seriesHighlight()) {
        output += ` ${obj.prefix}highlight`;
      } else {
        return output;
      }
    })
    .attr('d', a);

  series.append('path')
    .attr('class', `${obj.prefix}stream-series ${obj.prefix}line`)
    .attr('d', l);

  addZeroLine(obj, node, yAxisObj, 'yAxis');

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    series: series,
    line: line,
    area: area
  };

}
