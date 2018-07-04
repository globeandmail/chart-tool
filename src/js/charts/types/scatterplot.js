import { axisManager as Axis, axisCleanup, addZeroLine } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import 'd3-selection-multi';

export default function scatterplotChart(node, obj) {

  const xScaleObj = new Scale(obj, 'xAxis'),
    yScaleObj = new Scale(obj, 'yAxis'),
    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  const xAxisObj = new Axis(node, obj, xScaleObj.scale, 'xAxis'),
    yAxisObj = new Axis(node, obj, yScaleObj.scale, 'yAxis');

  axisCleanup(node, obj, xAxisObj, yAxisObj);

  addZeroLine(obj, node, yAxisObj, 'yAxis');

  xScale.range([obj.dimensions.computedWidth() - obj.dimensions.tickWidth(), obj.dimensions.tickWidth()]);

  const seriesGroup = node.append('g')
    .attr('class', `${obj.prefix}series_group`);

  const dotItems = seriesGroup
    .selectAll(`.${obj.prefix}dot`)
    .data(obj.data.data).enter()
    .append('circle')
    .attrs({
      'class': d => {
        let output = `${obj.prefix}dot`;
        if (obj.data.groups) {
          const groupIndex = obj.data.groups.indexOf(d.group);
          output += ` ${obj.prefix}dot-${groupIndex}`;
        } else {
          output += ` ${obj.prefix}dot-0`;
        }
        return output;
      },
      'data-key': d => d.key,
      'data-group': d => d.group,
      'cx': d => xScale(d.series[0].val),
      'cy': d => yScale(d.series[1].val),
      'r': obj.dimensions.scatterplotRadius
    });

  return {
    xScaleObj,
    yScaleObj,
    xAxisObj,
    yAxisObj,
    seriesGroup,
    dotItems
  };

}
