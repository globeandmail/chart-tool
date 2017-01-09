import { select } from 'd3-selection';
import { axisManager as Axis, setTickFormatY as setLabelFormat } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import 'd3-selection-multi';

export default function barChart(node, obj) {

  // because the elements will be appended in reverse due to the
  // bar chart operating on the y-axis, need to reverse the dataset
  obj.data.data.reverse();

  const yScaleObj = new Scale(obj, 'yAxis'),
    yScale = yScaleObj.scale;

  let totalBarHeight, barLabelOffset;

  if (obj.exportable && obj.exportable.barLabelOffset) {
    barLabelOffset = obj.exportable.barLabelOffset;
  } else {
    barLabelOffset = obj.dimensions.barLabelOffset;
  }

  // need this for fixed-height bars
  if (!obj.exportable || (obj.exportable && !obj.exportable.dynamicHeight)) {
    let bands = obj.dimensions.bands;
    const step = obj.dimensions.barHeight / ((bands.padding * -1) + 1);
    totalBarHeight = (step * obj.data.data.length * obj.data.seriesAmount) - (step * bands.padding) + (step * bands.outerPadding * 2);
    yScale.range([totalBarHeight, 0]);
    obj.dimensions.yAxisHeight = totalBarHeight;
  }

  const yAxisObj = new Axis(node, obj, yScale, 'yAxis');

  const xScaleObj = new Scale(obj, 'xAxis'),
    xScale = xScaleObj.scale;

  const seriesGroup = node.append('g')
    .attr('class', () => {
      let output = `${obj.prefix}series_group`;
      if (obj.data.seriesAmount > 1) { output += ` ${obj.prefix}multiple`; }
      return output;
    })
    .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`);

  const singleBar = yScale.bandwidth() / obj.data.seriesAmount;

  const series = [], barItems = [];

  const widestText = { width: null, height: null };

  for (let i = 0; i < obj.data.seriesAmount; i++) {

    let seriesItem = seriesGroup.append('g').attr('class', `${obj.prefix}series-${i}`);

    let barItem = seriesItem
      .selectAll(`.${obj.prefix}bar`)
      .data(obj.data.data).enter()
      .append('g')
      .attrs({
        'class': `${obj.prefix}bar ${obj.prefix}bar-${i}`,
        'data-series': i,
        'data-key': d => d.key,
        'data-legend': () => obj.data.keys[i + 1],
        'transform': d => `translate(0,${yScale(d.key)})`
      });

    barItem.append('rect')
      .attrs({
        'class': d => { return d.series[i].val < 0 ? 'negative' : 'positive'; },
        'width': d => { return Math.abs(xScale(d.series[i].val) - xScale(0)); },
        'x': d => { return xScale(Math.min(0, d.series[i].val)); },
        'y': i * singleBar,
        'height': singleBar
      });

    barItem.append('text')
      .attrs({
        'x': 0,
        'y': (i * singleBar),
        'class': `${obj.prefix}bar-label`
      })
      .text((d, j) => {
        let val = setLabelFormat(obj.xAxis.format, d.series[i].val);
        if (i === 0 && j === obj.data.data.length - 1) {
          val = (obj.xAxis.prefix || '') + val + (obj.xAxis.suffix || '');
        }
        return val;
      })
      .each(function() {
        if (Math.ceil(this.getComputedTextLength()) > widestText.width) {
          widestText.width = Math.ceil(this.getComputedTextLength());
        }
        if (this.getBBox().height > widestText.height) {
          widestText.height = this.getBBox().height;
        }
      });

    if (obj.data.seriesAmount > 1) {
      let barOffset = obj.dimensions.bands.offset;
      barItem
        .attr('transform', d => {
          const offset = i * (singleBar * (barOffset / 2));
          return `translate(0,${yScale(d.key) + offset})`;
        });
    }

    series.push(seriesItem);
    barItems.push(barItem);

  }

  xScale.range([0, obj.dimensions.tickWidth() - widestText.width - barLabelOffset]);

  for (let i = 0; i < series.length; i++) {
    series[i].selectAll(`.${obj.prefix}bar rect`)
      .attrs({
        'width': d => { return Math.abs(xScale(d.series[i].val) - xScale(0)); },
        'x': d => { return xScale(Math.min(0, d.series[i].val)); }
      });

    series[i].selectAll(`.${obj.prefix}bar-label`)
      .attrs({
        'x': d => {
          return xScale(Math.max(0, d.series[i].val)) + barLabelOffset;
        },
        'y': () => { return i * singleBar + Math.ceil(singleBar / 2); }
      });
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

  if (!obj.exportable || !obj.exportable.height) {

    obj.dimensions.computedHeight = function() { return node.node().getBoundingClientRect().height; };

    // fixed height, so transform accordingly and modify the dimension function and parent rects
    select(node.node().parentNode)
      .attr('height', () => {
        let margin = obj.dimensions.margin;
        return obj.dimensions.computedHeight() + margin.top + margin.bottom;
      });

    select(node.node().parentNode).select(`.${obj.prefix}bg`)
      .attr('height', obj.dimensions.computedHeight());

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
