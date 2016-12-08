import { axisManager as Axis, axisCleanup, addZeroLine } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import { line, area } from 'd3-shape';
import { getCurve } from '../../utils/utils';
import 'd3-selection-multi';

export default function stackedAreaChart(node, obj) {

  const xScaleObj = new Scale(obj, 'xAxis'),
    yScaleObj = new Scale(obj, 'yAxis'),
    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  const xAxisObj = new Axis(node, obj, xScaleObj.scale, 'xAxis'),
    yAxisObj = new Axis(node, obj, yScaleObj.scale, 'yAxis');

  axisCleanup(node, obj, xAxisObj, yAxisObj);

  if (xScaleObj.obj.type === 'ordinal') {
    xScale.rangeRound([0, obj.dimensions.tickWidth()], 1.0);
  }

  if (obj.data.seriesAmount === 1) {
    obj.seriesHighlight = () => { return 0; };
  }

  node.classed(`${obj.prefix}stacked`, true);

  const seriesGroup = node.append('g')
    .attr('class', () => {
      let output = `${obj.prefix}series_group`;
      if (obj.data.seriesAmount > 1) { output += ` ${obj.prefix}multiple`; }
      return output;
    });

  const series = seriesGroup.selectAll(`g.${obj.prefix}series`)
    .data(obj.data.stackedData)
    .enter().append('g')
    .attrs({
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
      'class': (d, i) => {
        let output = `${obj.prefix}series ${obj.prefix}series-${i}`;
        if (i === obj.seriesHighlight()) { output += ` ${obj.prefix}highlight`; }
        return output;
      }
    });

  const a = area().curve(getCurve(obj.options.interpolation))
    .defined(d => { return !isNaN(d[0] + d[1]); })
    .x(d => { return xScale(d.data[obj.data.keys[0]]); })
    .y0(d => { return yScale(d[0]); })
    .y1(d => { return yScale(d[1]); });

  const l = line().curve(getCurve(obj.options.interpolation))
    .defined(d => { return !isNaN(d[0] + d[1]); })
    .x(d => { return xScale(d.data[obj.data.keys[0]]); })
    .y(d => { return yScale(d[1]); });

  series.append('path')
    .attr('class', (d, i) => {
      let output = `${obj.prefix}fill ${obj.prefix}fill-${i}`;
      if (i === obj.seriesHighlight()) { output += ` ${obj.prefix}highlight`; }
      return output;
    })
    .attr('d', a);

  series.append('path')
    .attr('class', (d, i) => `${obj.prefix}line ${obj.prefix}line-${i}`)
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
