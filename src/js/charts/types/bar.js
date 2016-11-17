import { select } from 'd3-selection';
import { axisFactory, addZeroLine, updateTextX, tickFinderY as tickFinderX } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import { wrapText, getTranslate } from '../../utils/utils';
import 'd3-selection-multi';

export default function barChart(node, obj) {

  // because the elements will be appended in reverse due to the
  // bar chart operating on the y-axis, need to reverse the dataset.
  obj.data.data.reverse();

  let xAxisSettings, yAxisSettings;

  if (obj.exportable && obj.exportable.x_axis) {
    xAxisSettings = Object.assign(obj.xAxis, obj.exportable.x_axis);
  } else {
    xAxisSettings = obj.xAxis;
  }

  if (obj.exportable && obj.exportable.y_axis) {
    yAxisSettings = Object.assign(obj.yAxis, obj.exportable.y_axis);
  } else {
    yAxisSettings = obj.yAxis;
  }

  const xScaleObj = new Scale(obj, 'xAxis'),
    xScale = xScaleObj.scale;

  const xAxis = axisFactory(xAxisSettings, xScale);

  const xAxisGroup = node.append('g')
    .attrs({
      class: `${obj.prefix}axis-group ${obj.prefix}xAxis`,
      transform: `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`
    });

  const xAxisNode = xAxisGroup.append('g')
    .attr('class', `${obj.prefix}x-axis`)
    .call(xAxis);

  const textLengths = [];

  xAxisNode.selectAll('text')
    .attr('y', xAxisSettings.barOffset)
    .each(function() {
      textLengths.push(select(this).node().getBoundingClientRect().height);
    });

  const tallestText = textLengths.reduce((a, b) => { return (a > b ? a : b); });

  obj.dimensions.xAxisHeight = tallestText + xAxisSettings.barOffset;

  xAxisNode.selectAll('g')
    .filter(d => { return d; })
    .classed(`${obj.prefix}minor`, true);

  //  scales
  const yScaleObj = new Scale(obj, 'yAxis'),
    yScale = yScaleObj.scale;

  let totalBarHeight;

  // need this for fixed-height bars
  if (!obj.exportable || (obj.exportable && !obj.exportable.dynamicHeight)) {
    totalBarHeight = (obj.dimensions.barHeight * obj.data.data.length * obj.data.seriesAmount);
    yScale.rangeRoundBands([totalBarHeight, 0], obj.dimensions.bands.padding, obj.dimensions.bands.outerPadding);
    obj.dimensions.yAxisHeight = totalBarHeight - (totalBarHeight * obj.dimensions.bands.outerPadding * 2);
  }

  const yAxis = axisFactory(yAxisSettings, yScale);

  const yAxisGroup = node.append('g')
    .attr('class', `${obj.prefix}axis-group ${obj.prefix}yAxis`)
    .attr('transform', 'translate(0,0)');

  const yAxisNode = yAxisGroup.append('g')
    .attr('class', `${obj.prefix}y-axis`)
    .call(yAxis);

  yAxisNode.selectAll('line').remove();
  yAxisNode.selectAll('text').attr('x', 0);

  let maxLabelWidth;

  if (obj.dimensions.width > obj.yAxis.widthThreshold) {
    maxLabelWidth = obj.dimensions.computedWidth() / 3.5;
  } else {
    maxLabelWidth = obj.dimensions.computedWidth() / 3;
  }

  if (yAxisNode.node().getBBox().width > maxLabelWidth) {
    yAxisNode.selectAll('text')
      .call(wrapText, maxLabelWidth)
      .each(function() {
        const tspans = select(this).selectAll('tspan'),
          tspanCount = tspans[0].length,
          textHeight = select(this).node().getBBox().height;
        if (tspanCount > 1) {
          tspans.attr('y', ((textHeight / tspanCount) / 2) - (textHeight / 2));
        }
      });
  }

  obj.dimensions.labelWidth = yAxisNode.node().getBBox().width;

  yAxisGroup.attr('transform', `translate(${obj.dimensions.labelWidth},0)`);

  let xAxisTickSettings;

  if (obj.xAxis.widthThreshold > obj.dimensions.width) {
    xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 6 };
  } else {
    xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 4 };
  }

  const ticks = tickFinderX(xScale, obj.xAxis.ticks, xAxisTickSettings);

  xScale.range([0, obj.dimensions.tickWidth()]);

  xAxis.tickValues(ticks);

  xAxisNode.call(xAxis);

  xAxisNode.selectAll('.tick text')
    .attr('y', xAxisSettings.barOffset)
    .call(updateTextX, xAxisNode, obj, xAxis, obj.xAxis);

  if (obj.exportable && obj.exportable.dynamicHeight) {
    // working with a dynamic bar height
    xAxisGroup
      .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},${obj.dimensions.computedHeight()})`);
  } else {
    // working with a fixed bar height
    xAxisGroup
      .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},${totalBarHeight})`);
  }

  const xAxisWidth = getTranslate(xAxisGroup.node())[0] + xAxisGroup.node().getBBox().width;

  if (xAxisWidth > obj.dimensions.computedWidth()) {

    xScale.range([0, obj.dimensions.tickWidth() - (xAxisWidth - obj.dimensions.computedWidth())]);

    xAxisNode.call(xAxis);

    xAxisNode.selectAll('.tick text')
      .attr('y', xAxisSettings.barOffset)
      .call(updateTextX, xAxisNode, obj, xAxis, obj.xAxis);

  }

  const seriesGroup = node.append('g')
    .attr('class', () => {
      let output = `${obj.prefix}series_group`;
      if (obj.data.seriesAmount > 1) {
        output += ` ${obj.prefix}multiple`;
      }
      return output;
    })
    .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`);

  const singleBar = yScale.rangeBand() / obj.data.seriesAmount;

  let series, barItem;

  for (let i = 0; i < obj.data.seriesAmount; i++) {

    series = seriesGroup.append('g').attr('class', `${obj.prefix}series-${i}`);

    barItem = series
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

  }

  xAxisNode.selectAll('g')
    .filter(d => { return d; })
    .classed(`${obj.prefix}minor`, true);

  xAxisNode.selectAll('line')
    .attrs({
      'y1': () => {
        if (obj.exportable && obj.exportable.dynamicHeight) {
          // dynamic height, so calculate where the y1 should go
          return ((obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) * -1);
        } else {
          // fixed height, so use that
          return (totalBarHeight * -1);
        }
      },
      'y2': 0
    });

  if (obj.exportable && obj.exportable.dynamicHeight) {

    // dynamic height, only need to transform x-axis group
    xAxisGroup
      .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},${obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight})`);

  } else {

    // fixed height, so transform accordingly and modify the dimension function and parent rects

    xAxisGroup
      .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},${totalBarHeight})`);

    obj.dimensions.totalXAxisHeight = xAxisGroup.node().getBoundingClientRect().height;

    obj.dimensions.computedHeight = () => { return this.totalXAxisHeight; };

    select(node.node().parentNode)
      .attr('height', () => {
        let margin = obj.dimensions.margin;
        return obj.dimensions.computedHeight() + margin.top + margin.bottom;
      });

    select(node.node().parentNode).select(`.${obj.prefix}bg`)
      .attrs({
        'height': obj.dimensions.computedHeight()
      });

  }

  const xAxisObj = { node: xAxisGroup, axis: xAxis },
    yAxisObj = { node: yAxisGroup, axis: yAxis };

  addZeroLine(obj, node, xAxisObj, 'xAxis');

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    series: series,
    singleBar: singleBar,
    barItem: barItem
  };

}
