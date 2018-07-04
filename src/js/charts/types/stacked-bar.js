import { select } from 'd3-selection';
import { axisManager as Axis, setTickFormat as setLabelFormat } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import 'd3-selection-multi';

export default function stackedBarChart(node, obj) {

  // because the elements will be appended in reverse due to the
  // bar chart operating on the y-axis, need to reverse the dataset
  obj.data.data.reverse();

  const yScaleObj = new Scale(obj, 'yAxis'),
    yScale = yScaleObj.scale;

  let totalBarHeight;

  // need this for fixed-height bars
  if (!obj.exportable || (obj.exportable && !obj.exportable.dynamicHeight)) {
    let bands = obj.dimensions.bands;
    const step = obj.dimensions.barHeight / ((bands.padding * -1) + 1);
    totalBarHeight = (step * obj.data.data.length) - (step * bands.padding) + (step * bands.outerPadding * 2);
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

  const singleBar = yScale.bandwidth();

  const widestText = { value: null, width: null, height: null };

  const series = seriesGroup.selectAll(`g.${obj.prefix}series`)
    .data(obj.data.stackedData)
    .enter().append('g')
    .attr('class', (d, i) => { return `${obj.prefix}series ${obj.prefix}series-${i}`; });

  let barItem = series
    .append('g')
    .attrs({
      'class': (d, i) => { return `${obj.prefix}bar ${obj.prefix}bar-${i}`; },
      'data-legend': d => { return d.key; },
    });

  const rect = barItem.selectAll('rect')
    .data(d => d)
    .enter().append('rect')
    .attrs({
      'data-key': d => { return d.data[obj.data.keys[0]]; },
      'y': d => { return yScale(d.data[obj.data.keys[0]]); },
      'x': d => { return xScale(d[0]); },
      'width': d => { return Math.abs(xScale(d[1]) - xScale(d[0])); },
      'height': singleBar
    });

  const textGroup = seriesGroup.append('g')
    .attr('class', `${obj.prefix}bar-labels`);

  const lastStack = obj.data.stackedData[obj.data.stackedData.length - 1];

  const text = textGroup.selectAll(`.${obj.prefix}bar-label`)
    .data(() => {
      return [].concat(yScale.domain()).reverse().map(d => {
        const data = obj.data.data.filter(item => item.key === d)[0];
        return {
          key: d,
          value: data.series.reduce((a, b) => {
            return (typeof a === 'number' ? a : Number(a.val)) + Number(b.val);
          })
        };
      });
    })
    .enter().append('text')
    .attrs({
      'class': (d, i) => { return `${obj.prefix}bar-label ${obj.prefix}bar-label-${i}`; },
      'data-legend': d => d.key,
      'x': (d, i) => { return xScale(Math.max(0, lastStack[i][1])); },
      'y': d => yScale(d.key) + Math.ceil(singleBar / 2)
    })
    .text((d, i) => {
      let val = setLabelFormat(obj.xAxis.format, d.value);
      if (i === 0) {
        val = (obj.xAxis.prefix || '') + val + (obj.xAxis.suffix || '');
      }
      return val;
    })
    .each(function(d) {
      if (d.value > widestText.value) {
        widestText.value = d.value;
        widestText.width = Math.ceil(this.getComputedTextLength());
      }
      if (this.getBBox().height > widestText.height) {
        widestText.height = this.getBBox().height;
      }
    });

  xScale.range([0, obj.dimensions.tickWidth() - widestText.width - obj.dimensions.barLabelOffset]);

  rect
    .attrs({
      'x': d => { return xScale(d[0]); },
      'width': d => { return Math.abs(xScale(d[1]) - xScale(d[0])); }
    });

  text
    .attrs({
      'x': d => {
        return xScale(Math.max(0, d.value)) + obj.dimensions.barLabelOffset;
      }
    });

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
    barItem: barItem,
    rect: rect,
    textGroup: textGroup,
    text: text
  };

}
