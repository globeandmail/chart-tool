import { select } from 'd3-selection';
import { axisManager as Axis } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import 'd3-selection-multi';

export default function barChart(node, obj) {

  // because the elements will be appended in reverse due to the
  // bar chart operating on the y-axis, need to reverse the dataset.
  obj.data.data.reverse();

  const xScaleObj = new Scale(obj, 'xAxis'),
    xScale = xScaleObj.scale;

  //  scales
  const yScaleObj = new Scale(obj, 'yAxis'),
    yScale = yScaleObj.scale;

  let totalBarHeight;

  // need this for fixed-height bars
  if (!obj.exportable || (obj.exportable && !obj.exportable.dynamicHeight)) {
    totalBarHeight = (obj.dimensions.barHeight * obj.data.data.length * obj.data.seriesAmount);
    yScale.range([totalBarHeight, 0]);
    obj.dimensions.yAxisHeight = totalBarHeight - (totalBarHeight * obj.dimensions.bands.outerPadding * 2);
  }

  const yAxisObj = new Axis(node, obj, yScale, 'yAxis');

  const seriesGroup = node.append('g')
    .attr('class', () => {
      let output = `${obj.prefix}series_group`;
      if (obj.data.seriesAmount > 1) { output += ` ${obj.prefix}multiple`; }
      return output;
    })
    .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`);

  const singleBar = yScale.bandwidth() / obj.data.seriesAmount;

  const series = [], barItems = [];

  for (let i = 0; i < obj.data.seriesAmount; i++) {

    let seriesItem = seriesGroup.append('g').attr('class', `${obj.prefix}series-${i}`);

    let barItem = seriesItem
      .selectAll(`.${obj.prefix}bar`)
      .data(obj.data.data).enter()
      .append('g')
      .attrs({
        'class': `${obj.prefix}bar ${obj.prefix}bar-${i}`,
        'data-series': i,
        'data-key': d => { return d.key; },
        'data-legend': () => { return obj.data.keys[i + 1]; },
        'transform': d => { return `translate(0,${yScale(d.key)})`; }
      });

    barItem.append('rect')
      .attrs({
        'class': d => { return d.series[i].val < 0 ? 'negative' : 'positive'; },
        'width': d => { return Math.abs(xScale(d.series[i].val) - xScale(0)); },
        'x': d => { return xScale(Math.min(0, d.series[i].val)); },
        'y': i * singleBar,
        'height': singleBar
      });

    if (obj.data.seriesAmount > 1) {
      let barOffset = obj.dimensions.bands.offset;
      barItem.selectAll('rect')
        .attrs({
          'y': ((i * singleBar) + (singleBar * (barOffset / 2))),
          'height': singleBar - (singleBar * barOffset)
        });
    }

    series.push(seriesItem);
    barItems.push(barItem);

  }

  node.append('line')
    .style('shape-rendering', 'crispEdges')
    .attrs({
      'class': `${obj.prefix}zero-line`,
      'y1': yScale.range()[0],
      'y2': yScale.range()[1],
      'x1': xScale(0),
      'x2': xScale(0),
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`
    });

  if (!obj.exportable) {

    // fixed height, so transform accordingly and modify the dimension function and parent rects
    select(node.node().parentNode)
      .attr('height', () => {
        let margin = obj.dimensions.margin;
        return node.node().getBoundingClientRect().height + margin.top + margin.bottom;
      });

    select(node.node().parentNode).select(`.${obj.prefix}bg`)
      .attr('height', node.node().getBoundingClientRect().height);

  }

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    series: series,
    singleBar: singleBar,
    barItems: barItems
  };

}
