import { axisManager as Axis, axisCleanup, addZeroLine } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import { line, area } from 'd3-shape';
import { getCurve } from '../../utils/utils';
import 'd3-selection-multi';

export default function sreaChart(node, obj) {

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

  const seriesGroup = node.append('g')
    .attr('class', () => {
      let output = `${obj.prefix}series_group`;
      if (obj.data.seriesAmount > 1) {
        // If more than one series append a 'muliple' class so we can target
        output += ` ${obj.prefix}multiple`;
      }
      return output;
    });

  // Secondary array is used to store a reference to all series except for the highlighted item
  const secondaryArr = [];

  for (let i = obj.data.seriesAmount - 1; i >= 0; i--) {
    // Dont want to include the highlighted item in the loop
    // because we always want it to sit above all the other lines

    if (i !== obj.seriesHighlight()) {

      const a = area().curve(getCurve(obj.options.interpolation))
        .defined(d => { return !isNaN(d.series[i].val); })
        .x(d => { return xScale(d.key); })
        .y0(yScale(0))
        .y1(d => { return yScale(d.series[i].val); });

      const l = line().curve(getCurve(obj.options.interpolation))
        .defined(d => { return !isNaN(d.series[i].val); })
        .x(d => { return xScale(d.key); })
        .y(d => { return yScale(d.series[i].val); });

      const pathRef = seriesGroup.append('path')
        .datum(obj.data.data)
        .attrs({
          'd': a,
          'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
          'class': () => {
            return `${obj.prefix}fill ${obj.prefix}fill-${i}`;
          }
        });

      seriesGroup.append('path')
        .datum(obj.data.data)
        .attrs({
          'd': l,
          'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
          'class': () => {
            return `${obj.prefix}line ${obj.prefix}line-${i}`;
          }
        });

      secondaryArr.push(pathRef);
    }

  }

  // Loop through all the secondary series (all series except the highlighted one)
  // and set the colours in the correct order

  secondaryArr.reverse();

  const hArea = area().curve(getCurve(obj.options.interpolation))
    .defined(d => { return !isNaN(d.series[obj.seriesHighlight()].val); })
    .x(d => { return xScale(d.key); })
    .y0(yScale(0))
    .y1(d => { return yScale(d.series[obj.seriesHighlight()].val); });

  const hLine = line().curve(getCurve(obj.options.interpolation))
    .defined(d => { return !isNaN(d.series[obj.seriesHighlight()].val); })
    .x(d => { return xScale(d.key); })
    .y(d => { return yScale(d.series[obj.seriesHighlight()].val); });

  seriesGroup.append('path')
    .datum(obj.data.data)
    .attrs({
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
      'class': () => {
        return `${obj.prefix}fill ${obj.prefix}fill-${obj.seriesHighlight()} ${obj.prefix}highlight`;
      },
      'd': hArea
    });

  seriesGroup.append('path')
    .datum(obj.data.data)
    .attrs({
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
      'class': () => {
        return `${obj.prefix}line ${obj.prefix}line-${obj.seriesHighlight()} ${obj.prefix}highlight`;
      },
      'd': hLine
    });

  addZeroLine(obj, node, yAxisObj, 'yAxis');

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    hLine: hLine,
    hArea: hArea,
    line: line,
    area: area
  };

}
"<link href='https://fonts.googleapis.com/css?family=Lora' rel='stylesheet' type='text/css'>"
