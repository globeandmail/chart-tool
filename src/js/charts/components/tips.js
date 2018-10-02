import { bisector } from 'd3-array';
import { select, mouse } from 'd3-selection';
import { voronoi } from 'd3-voronoi';
import { setTickFormat as yFormatter } from './axis';
import { timeDiff } from '../../utils/utils';
import { tipRadius } from '../../../../custom/chart-tool-config.json';

export function bisectData(data, keyVal, stacked, xKey) {
  if (stacked) {
    const arr = [];
    const bisectFn = bisector(d => { return d.data[xKey]; }).left;
    for (let i = 0; i < data.length; i++) {
      arr.push(bisectFn(data[i], keyVal));
    }
    return arr;
  } else {
    const bisectFn = bisector(d => { return d.key; }).left;
    return bisectFn(data, keyVal);
  }
}

export function cursorPos(overlay) {
  return {
    x: mouse(overlay.node())[0],
    y: mouse(overlay.node())[1]
  };
}

export function getTipData(obj, cursor) {

  // TODO:
  // need to standardize output of this between standard and stacked data.
  // right now tipData for regular data looks like this: { key: Date, series: [] }
  // while for stacked it's an array like [[y0, y1, data: {}]]

  let scale, scaleType, cursorVal;

  if (obj.options.type === 'bar') {
    scale = obj.rendered.plot.yScaleObj.scale.copy();
    scale.domain(scale.domain().reverse());
    scaleType = obj.rendered.plot.yScaleObj.obj.type;
    cursorVal = cursor.y;
  } else {
    scale = obj.rendered.plot.xScaleObj.scale;
    scaleType = obj.rendered.plot.xScaleObj.obj.type;
    cursorVal = cursor.x;
  }

  let xVal, tipData;

  if (scaleType === 'ordinal-time' || scaleType === 'ordinal') {

    const step = scale.step(),
      domainPosition = Math.floor(cursorVal / step);

    if (domainPosition >= scale.domain().length) {
      xVal = scale.domain()[scale.domain().length - 1];
    } else {
      xVal = scale.domain()[domainPosition];
    }

    for (let i = 0; i < obj.data.data.length; i++) {
      if (xVal === obj.data.data[i].key) {
        tipData = obj.data.data[i];
        break;
      }
    }

    return tipData;

  }

  xVal = scale.invert(cursorVal);

  if (obj.options.stacked && obj.options.type === 'area') {
    const data = obj.data.stackedData.map(item => {
      return item.sort((a, b) => {
        return a.data[obj.data.keys[0]] - b.data[obj.data.keys[0]];
      });
    });
    const i = bisectData(data, xVal, obj.options.stacked, obj.data.keys[0]);

    const arr = [];
    let refIndex;

    for (let k = 0; k < data.length; k++) {
      if (refIndex) {
        arr.push(data[k][refIndex]);
      } else {
        const d0 = data[k][i[k] - 1],
          d1 = data[k][i[k]];
        refIndex = xVal - d0.data[obj.data.keys[0]] > d1.data[obj.data.keys[0]] - xVal ? i[k] : (i[k] - 1);
        arr.push(data[k][refIndex]);
      }
    }

    tipData = arr;

  } else {
    const data = obj.data.data.sort((a, b) => a.key - b.key),
      i = bisectData(data, xVal),
      d0 = data[i - 1],
      d1 = data[i];

    if (d0 && d1) {
      tipData = xVal - d0.key > d1.key - xVal ? d1 : d0;
    } else {
      tipData = d0 ? d0 : d1;
    }

  }

  return tipData;

}

export function showTips(tipNodes, obj) {

  if (tipNodes.xTipLine) {
    tipNodes.xTipLine.classed(`${obj.prefix}active`, true);
  }

  if (tipNodes.yTipLine) {
    tipNodes.yTipLine.classed(`${obj.prefix}active`, true);
  }

  if (tipNodes.tipCircle) {
    tipNodes.tipCircle.classed(`${obj.prefix}active`, true);
  }

  if (tipNodes.tipBox) {
    tipNodes.tipBox.classed(`${obj.prefix}active`, true);
  }

  if (tipNodes.tipPathCircles) {
    tipNodes.tipPathCircles.classed(`${obj.prefix}active`, true);
  }

  const annoData = obj.annotations;

  const hasAnnotations = annoData && (
    (annoData.highlight && annoData.highlight.length) ||
    (annoData.text && annoData.text.length) ||
    (annoData.range && annoData.range.length) ||
    (annoData.pointer && annoData.pointer.length)
  );

  if (hasAnnotations) {
    obj.rendered.annotations.annoNode.classed(`${obj.prefix}muted`, true);
    obj.rendered.container
      .selectAll(`.${obj.prefix}annotation_range`)
      .classed(`${obj.prefix}muted`, true);
  }

}

export function hideTips(tipNodes, obj) {

  if (obj.options.type === 'column' || obj.options.type === 'bar' || obj.options.type === 'scatterplot') {
    obj.rendered.plot.seriesGroup
      .selectAll(`.${obj.prefix}muted`)
      .classed(`${obj.prefix}muted`, false);

    obj.rendered.plot.seriesGroup
      .selectAll(`.${obj.prefix}active`)
      .classed(`${obj.prefix}active`, false);

    obj.rendered.container
      .selectAll(`.${obj.prefix}axis-group line`)
      .classed(`${obj.prefix}muted`, false);
  }

  if (tipNodes.xTipLine) {
    tipNodes.xTipLine.classed(`${obj.prefix}active`, false);
  }

  if (tipNodes.yTipLine) {
    tipNodes.yTipLine.classed(`${obj.prefix}active`, false);
  }

  if (tipNodes.tipCircle) {
    tipNodes.tipCircle.classed(`${obj.prefix}active`, false);
  }

  if (tipNodes.tipBox) {
    tipNodes.tipBox.classed(`${obj.prefix}active`, false);
  }

  if (tipNodes.tipPathCircles) {
    tipNodes.tipPathCircles.classed(`${obj.prefix}active`, false);
  }

  const annoData = obj.annotations;

  const hasAnnotations = annoData && (
    (annoData.highlight && annoData.highlight.length) ||
    (annoData.text && annoData.text.length) ||
    (annoData.range && annoData.range.length) ||
    (annoData.pointer && annoData.pointer.length)
  );

  if (hasAnnotations) {
    obj.rendered.annotations.annoNode.classed(`${obj.prefix}muted`, false);
    obj.rendered.container
      .selectAll(`.${obj.prefix}annotation_range`)
      .classed(`${obj.prefix}muted`, false);
  }

}

export function mouseIdle(tipNodes, obj) {
  return setTimeout(() => {
    hideTips(tipNodes, obj);
  }, obj.tipTimeout);
}

let timeout;

export function tipsManager(node, obj) {

  const fns = {
    line: lineChartTips,
    multiline: lineChartTips,
    area: obj.options.stacked ? stackedAreaChartTips : areaChartTips,
    column: obj.options.stacked ? stackedColumnChartTips : columnChartTips,
    bar: obj.options.stacked ? stackedBarChartTips : barChartTips,
    scatterplot: scatterplotChartTips
  };

  const dataRef = obj.options.type === 'multiline' ? [obj.data.data[0].series[0]] : obj.data.data[0].series,
    tipNodes = appendTipGroup(node, obj);

  appendTipElements(node, obj, tipNodes, dataRef);

  if (obj.options.type === 'bar') {
    tipNodes.tipGroup.remove();
    tipNodes.xTipLine.remove();
    tipNodes.yTipLine.remove();
    tipNodes.tipBox.remove();
    tipNodes.tipPathCircles.remove();
  }

  let voronoiDiagram;

  if (obj.options.type === 'scatterplot') {
    voronoiDiagram = voronoi()
      .x(d => obj.rendered.plot.xScaleObj.scale(d.series[0].val))
      .y(d => obj.rendered.plot.yScaleObj.scale(d.series[1].val))(obj.data.data);

  }

  switch (obj.options.type) {
    case 'line':
    case 'multiline':
    case 'area':
    case 'column':
    case 'bar':
    case 'scatterplot':
      tipNodes.overlay = tipNodes.tipNode
        .append('rect')
        .attrs({
          'class': `${obj.prefix}tip_overlay`,
          'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
          'width': obj.dimensions.tickWidth(),
          'height': obj.dimensions.yAxisHeight()
        });
      tipNodes.overlay
        .on('mouseover', () => showTips(tipNodes, obj))
        .on('mouseout', () => hideTips(tipNodes, obj))
        .on('mousemove', () => {
          showTips(tipNodes, obj);
          clearTimeout(timeout);
          timeout = mouseIdle(tipNodes, obj);
          return fns[obj.options.type](tipNodes, obj, voronoiDiagram);
        });
      break;
  }

}

export function appendTipGroup(node, obj) {

  const svg = select(node.node().parentNode),
    chartNode = select(node.node().parentNode.parentNode),
    legendIcon = chartNode.select(`.${obj.prefix}legend_item_icon`).node(),
    radius = legendIcon ? legendIcon.getBoundingClientRect().width / 2 : 0;

  const tipNode = svg.append('g')
    .attrs({
      'transform': `translate(${obj.dimensions.margin.left},${obj.dimensions.margin.top})`,
      'class': `${obj.prefix}tip`
    })
    .classed(`${obj.prefix}tip_stacked`, () => {
      return obj.options.stacked ? true : false;
    });

  const xTipLine = tipNode.append('g')
    .attr('class', `${obj.prefix}tip_line-x`)
    .classed(`${obj.prefix}active`, false);

  xTipLine.append('line');

  let yTipLine = select(null),
    tipCircle = select(null);

  if (obj.options.type === 'scatterplot') {
    yTipLine = tipNode.append('g')
      .attr('class', `${obj.prefix}tip_line-y`)
      .classed(`${obj.prefix}active`, false);

    yTipLine.append('line');

    tipCircle = tipNode.append('g')
      .attrs({
        'class': `${obj.prefix}tip_circle-xy`,
        'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`
      })
      .classed(`${obj.prefix}active`, false);

    tipCircle.append('circle')
      .attr('r', obj.dimensions.scatterplotRadius);
  }

  const tipBox = tipNode.append('g')
    .attrs({
      'class': `${obj.prefix}tip_box`,
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`
    });

  const tipRect = tipBox.append('rect')
    .attrs({
      'class': `${obj.prefix}tip_rect`,
      'transform': `translate(0, ${obj.dimensions.tipOffset.horizontal})`,
      'width': 1,
      'height': 1
    });

  const tipGroup = tipBox.append('g')
    .attr('class', `${obj.prefix}tip_group`);

  const tipPathCircles = tipNode.append('g')
    .attr('class', `${obj.prefix}tip_path-circle-group`);

  const tipTextX = tipGroup
    .insert('g', ':first-child')
    .attr('class', `${obj.prefix}tip_text-x-group`)
    .append('text')
    .attrs({
      'class': `${obj.prefix}tip_text-x`,
      'x': 0,
      'y': 0,
      'dy': '1em'
    });

  return {
    svg,
    tipNode,
    xTipLine,
    yTipLine,
    tipCircle,
    tipBox,
    tipRect,
    tipGroup,
    legendIcon,
    tipPathCircles,
    radius,
    tipTextX
  };

}

export function appendTipElements(node, obj, tipNodes, dataRef) {

  const tipTextGroupContainer = tipNodes.tipGroup
    .append('g')
    .attr('class', `${obj.prefix}tip_text-group-container`);

  const tipTextGroups = tipTextGroupContainer
    .selectAll(`.${obj.prefix}tip_text-group`)
    .data(dataRef)
    .enter()
    .append('g')
    .attr('class', (d, i) => {
      return `${obj.prefix}tip_text-group ${obj.prefix}tip_text-group-${i}`;
    });

  let lineHeight;

  tipTextGroups.append('text')
    .text(d => d.val)
    .attrs({
      'class': (d, i) => {
        return `${obj.prefix}tip_text ${obj.prefix}tip_text-${i}`;
      },
      'data-series': d => d.key,
      'x': (tipNodes.radius * 2) + (tipNodes.radius / 1.5),
      'y': function(d, i) {
        lineHeight = lineHeight || parseInt(select(this).style('line-height'));
        return (i + 1) * lineHeight;
      },
      'dy': '1em'
    });

  if (obj.options.type !== 'scatterplot') {
    tipTextGroups
      .append('circle')
      .attrs({
        'class': (d, i) => {
          return `${obj.prefix}tip_circle ${obj.prefix}tip_circle-${i}`;
        },
        'r': tipNodes.radius,
        'cx': tipNodes.radius,
        'cy': (d, i) => {
          return ((i + 1) * lineHeight) + (tipNodes.radius * 1.5);
        }
      });
  }

  tipNodes.tipPathCircles.selectAll('circle')
    .data(dataRef)
    .enter()
    .append('circle')
    .attrs({
      'class': (d, i) => {
        return `${obj.prefix}tip_path-circle ${obj.prefix}tip_path-circle-${i}`;
      },
      'r': tipRadius
    });

  return tipTextGroups;

}

export function lineChartTips(tipNodes, obj) {
  const cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  let isUndefined = 0;

  for (let i = 0; i < tipData.series.length; i++) {
    if (tipData.series[i].val === '__undefined__') {
      isUndefined++;
      break;
    }
  }

  const hasData = !isUndefined || isUndefined !== tipData.series.length;

  if (!hasData) return;

  const domain = obj.rendered.plot.xScaleObj.scale.domain(),
    ctx = timeDiff(domain[0], domain[domain.length - 1], 8, obj.data);

  tipNodes.tipGroup.selectAll(`.${obj.prefix}tip_text-group text`)
    .data(tipData.series)
    .text(d => {
      if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
      if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
      if ((d.val || d.val === 0) && d.val !== '__undefined__') {
        return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
      } else {
        return 'n/a';
      }
    })
    .classed(`${obj.prefix}muted`, d => {
      return (!(d.val || d.val === 0) || d.val === '__undefined__');
    });

  let bandwidth = 0;

  if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
    tipNodes.tipTextX
      .text(() => tipDateFormatter(ctx, obj.monthsAbr, tipData.key));
  } else {
    tipNodes.tipTextX
      .text(tipData.key);
    bandwidth = obj.rendered.plot.xScaleObj.scale.bandwidth();
  }

  tipNodes.tipGroup
    .selectAll(`.${obj.prefix}tip_text-group`)
    .data(tipData.series)
    .classed(`${obj.prefix}active`, d => d.val ? true : false);

  tipNodes.tipGroup
    .attr('transform', () => {
      // tipbox pointing left or right
      const xDirection = cursor.x > obj.dimensions.tickWidth() / 2 ? 'left' : 'right';
      return `translate(${obj.dimensions.tipPadding[xDirection]},${obj.dimensions.tipPadding.top})`;
    });

  tipNodes.tipPathCircles
    .selectAll(`.${obj.prefix}tip_path-circle`)
    .data(tipData.series)
    .classed(`${obj.prefix}active`, d => {
      return d.val && d.val !== '__undefined__';
    })
    .attrs({
      'cx': obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
      'cy': d => {
        if (d.val && d.val !== '__undefined__') {
          return obj.rendered.plot.yScaleObj.scale(d.val);
        }
      }
    });

  tipNodes.tipRect
    .attrs({
      'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
      'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
    });

  tipNodes.xTipLine.select('line')
    .attrs({
      'x1': obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
      'x2': obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
      'y1': 0,
      'y2': obj.dimensions.yAxisHeight()
    });

  tipNodes.tipBox
    .attr('transform', function() {
      let x;
      if (cursor.x > obj.dimensions.tickWidth() / 2) {
        // tipbox pointing left
        x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - this.getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal + (bandwidth / 2);
      } else {
        // tipbox pointing right
        x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal + (bandwidth / 2);
      }
      return `translate(${x},${obj.dimensions.tipOffset.vertical})`;
    });

}

export function areaChartTips(tipNodes, obj) {
  // area tips implementation is currently
  // *exactly* the same as line tips, so…
  lineChartTips(tipNodes, obj);
}

export function stackedAreaChartTips(tipNodes, obj) {

  const cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  let isUndefined = 0;

  for (let i = 0; i < tipData.length; i++) {
    if (tipData[i].val === '__undefined__') {
      isUndefined++;
      break;
    }
  }

  const hasData = !isUndefined || isUndefined !== tipData.series.length;

  if (!hasData) return;

  const domain = obj.rendered.plot.xScaleObj.scale.domain(),
    ctx = timeDiff(domain[0], domain[domain.length - 1], 8, obj.data);

  tipNodes.tipGroup.selectAll(`.${obj.prefix}tip_text-group text`)
    .data(() => {
      if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
        return tipData;
      } else {
        return tipData.series;
      }
    })
    .text((d, i) => {
      if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
      if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
      if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
        if (d.val || d.val === 0) {
          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
        } else {
          return 'n/a';
        }
      } else {
        let text;
        for (let k = 0; k < tipData.length; k++) {
          if (i === 0) {
            if (!isNaN(d[0] + d[1])) {
              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.data[obj.data.keys[i + 1]]) + obj.yAxis.suffix;
              break;
            } else {
              text = 'n/a';
              break;
            }
          } else if (k === i) {
            let hasUndefined = 0;
            for (let j = 0; j < i; j++) {
              if (isNaN(d[0] + d[1])) {
                hasUndefined++;
                break;
              }
            }
            if (!hasUndefined && !isNaN(d[0] + d[1])) {
              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.data[obj.data.keys[i + 1]]) + obj.yAxis.suffix;
              break;
            } else {
              text = 'n/a';
              break;
            }
          }
        }
        return text;
      }
    });

  let bandwidth = 0;

  if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
    tipNodes.tipTextX
      .text(() => tipDateFormatter(ctx, obj.monthsAbr, tipData.key ? tipData.key : tipData[0].data[obj.data.keys[0]]));
  } else {
    tipNodes.tipTextX
      .text(tipData.key);
    bandwidth = obj.rendered.plot.xScaleObj.scale.bandwidth();
  }

  tipNodes.tipGroup
    .selectAll(`.${obj.prefix}tip_text-group`)
    .data(() => {
      if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
        return tipData;
      } else {
        return tipData.series;
      }
    })
    .classed(`${obj.prefix}active`, (d, i) => {
      if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
        return d.val ? true : false;
      } else {
        let hasUndefined = 0;
        for (let j = 0; j < i; j++) {
          if (isNaN(d[0] + d[1])) {
            hasUndefined++;
            break;
          }
        }
        if (!hasUndefined && !isNaN(d[0] + d[1])) {
          return true;
        } else {
          return false;
        }
      }
    });

  tipNodes.tipGroup
    .attr('transform', () => {
      // tipbox pointing left or right
      const xDirection = cursor.x > obj.dimensions.tickWidth() / 2 ? 'left' : 'right';
      return `translate(${obj.dimensions.tipPadding[xDirection]},${obj.dimensions.tipPadding.top})`;
    });

  tipNodes.tipPathCircles
    .selectAll(`.${obj.prefix}tip_path-circle`)
    .data(() => {
      if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
        return tipData;
      } else {
        return tipData.series;
      }
    })
    .classed(`${obj.prefix}active`, (d, i) => {
      if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
        return d.val ? true : false;
      } else {
        let hasUndefined = 0;
        for (let j = 0; j < i; j++) {
          if (isNaN(d[0] + d[1])) {
            hasUndefined++;
            break;
          }
        }
        if (!hasUndefined && !isNaN(d[0] + d[1])) {
          return true;
        } else {
          return false;
        }
      }
    })
    .attrs({
      'cx': d => {
        let xData;
        if (obj.rendered.plot.xScaleObj.obj.type !== 'time') {
          xData = tipData.key;
        } else {
          xData = d.data[obj.data.keys[0]];
        }
        return obj.rendered.plot.xScaleObj.scale(xData) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2);
      },
      'cy': d => {
        let yData;
        if (obj.rendered.plot.xScaleObj.obj.type !== 'time') {
          const index = obj.data.data.indexOf(obj.data.data.filter(a => {
            return a.key === tipData.key;
          })[0]);
          const stackedPoint = obj.data.stackedData[obj.data.keys.indexOf(d.key) - 1];
          yData = stackedPoint[index][1];
        } else {
          yData = d[1];
        }
        if (!isNaN(yData)) {
          return obj.rendered.plot.yScaleObj.scale(yData);
        }
      }
    });

  tipNodes.tipRect
    .attrs({
      'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
      'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
    });

  let xPos;

  if (obj.rendered.plot.xScaleObj.obj.type === 'time') {
    xPos = tipData[0].data[obj.data.keys[0]];
  } else {
    xPos = tipData.key;
  }

  tipNodes.xTipLine.select('line')
    .attrs({
      'x1': obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
      'x2': obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
      'y1': 0,
      'y2': obj.dimensions.yAxisHeight()
    });

  tipNodes.tipBox
    .attr('transform', function() {
      let x;
      if (cursor.x > obj.dimensions.tickWidth() / 2) {
        // tipbox pointing left
        x = obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - this.getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal + (bandwidth / 2);
      } else {
        // tipbox pointing right
        x = obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal + (bandwidth / 2);
      }
      return `translate(${x},${obj.dimensions.tipOffset.vertical})`;
    });

}

export function columnChartTips(tipNodes, obj) {

  const cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  tipNodes.tipGroup.selectAll(`.${obj.prefix}tip_text-group text`)
    .data(tipData.series)
    .text(d => {
      if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
      if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
      if ((d.val || d.val === 0) && d.val !== '__undefined__') {
        return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
      } else {
        return 'n/a';
      }
    })
    .classed(`${obj.prefix}muted`, d => {
      return (!(d.val || d.val === 0) || d.val === '__undefined__');
    });

  obj.rendered.plot.seriesGroup.selectAll('rect')
    .classed(`${obj.prefix}muted`, true);

  if (obj.options.stacked) {
    obj.rendered.plot.seriesGroup.selectAll(`[data-key="${tipData.originalKey || tipData.key}"]`)
      .classed(`${obj.prefix}muted`, false);
  } else {
    obj.rendered.plot.seriesGroup.selectAll(`[data-key="${tipData.originalKey || tipData.key}"] rect`)
      .classed(`${obj.prefix}muted`, false);
  }

  tipNodes.tipGroup
    .selectAll(`.${obj.prefix}tip_text-group`)
    .data(tipData.series)
    .classed(`${obj.prefix}active`, d => { return d.val ? true : false; });

  if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
    tipNodes.tipTextX.text(tipData.key);
  } else {
    const domain = obj.rendered.plot.xScaleObj.scale.domain(),
      ctx = timeDiff(domain[0], domain[domain.length - 1], 8, obj.data);

    tipNodes.tipTextX
      .text(() => tipDateFormatter(ctx, obj.monthsAbr, tipData.key));
  }

  tipNodes.tipGroup
    .attr('transform', () => {
      // tipbox pointing left or right
      const xDirection = cursor.x > obj.dimensions.tickWidth() / 2 ? 'left' : 'right';
      return `translate(${obj.dimensions.tipPadding[xDirection]},${obj.dimensions.tipPadding.top})`;
    });

  tipNodes.tipRect
    .attrs({
      'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
      'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
    });

  tipNodes.tipBox
    .attr('transform', function() {
      let x;

      if (cursor.x > obj.dimensions.tickWidth() / 2) {
        // tipbox pointing left

        let colWidth;

        if (!obj.rendered.plot.xScaleObj.scale.bandwidth) {
          colWidth = obj.rendered.plot.singleColumn;
        } else {
          colWidth = obj.rendered.plot.xScaleObj.scale.bandwidth();
        }

        x = obj.rendered.plot.xScaleObj.scale(tipData.key)  + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - obj.dimensions.tipOffset.horizontal - this.getBoundingClientRect().width + colWidth;

      } else {
        // tipbox pointing right
        x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
      }
      return `translate(${x},${obj.dimensions.tipOffset.vertical})`;
    });

}

export function stackedColumnChartTips(tipNodes, obj) {
  // stacked column tips implementation is the same
  // as column tips except for one line, so…
  columnChartTips(tipNodes, obj);
}

export function barChartTips(tipNodes, obj) {

  const cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor),
    isStacked = obj.options.stacked;

  obj.rendered.plot.seriesGroup
    .selectAll('rect')
    .classed(`${obj.prefix}muted`, true);

  obj.rendered.plot.seriesGroup
    .selectAll(`.${obj.prefix}bar-label`)
    .classed(`${obj.prefix}muted`, true);

  obj.rendered.plot.seriesGroup
    .selectAll(`[data-key="${tipData.key}"]${isStacked ? '' : ' rect'}`)
    .classed(`${obj.prefix}muted`, false);

  obj.rendered.plot.seriesGroup
    .selectAll(`[data-${isStacked ? 'legend' : 'key'}="${tipData.key}"]${isStacked ? '' : ` .${obj.prefix}bar-label`}`)
    .classed(`${obj.prefix}muted`, false);

}

export function stackedBarChartTips(tipNodes, obj) {
  // stacked bar tips implementation is almost exactly the same
  // as bar tips except for one condition, so…
  barChartTips(tipNodes, obj);
}

export function scatterplotChartTips(tipNodes, obj, voronoiDiagram) {
  const cursor = cursorPos(tipNodes.overlay),
    tipData = voronoiDiagram.find(cursor.x, cursor.y);

  if (!tipData) return;

  const dataGroup = tipData.data.group ? obj.data.groups.indexOf(tipData.data.group) : 0;

  obj.rendered.plot.seriesGroup
    .selectAll(`.${obj.prefix}dot`)
    .classed(`${obj.prefix}muted`, true)
    .classed(`${obj.prefix}active`, false);

  obj.rendered.container
    .selectAll(`.${obj.prefix}axis-group line`)
    .classed(`${obj.prefix}muted`, true);

  obj.rendered.plot.seriesGroup
    .selectAll(`[data-key="${tipData.data.key}"]`)
    .classed(`${obj.prefix}muted`, false)
    .classed(`${obj.prefix}active`, true);

  const xPos = tipData.data.series[0].val,
    yPos = tipData.data.series[1].val;

  tipNodes.xTipLine.select('line')
    .attrs({
      'x1': obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
      'x2': obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
      'y1': 0,
      'y2': obj.dimensions.yAxisHeight()
    });

  tipNodes.yTipLine.select('line')
    .attrs({
      'x1': obj.dimensions.computedWidth() - obj.dimensions.tickWidth(),
      'x2': obj.dimensions.computedWidth(),
      'y1': obj.rendered.plot.yScaleObj.scale(tipData.data.series[1].val),
      'y2': obj.rendered.plot.yScaleObj.scale(tipData.data.series[1].val)
    });

  tipNodes.tipCircle.select('circle')
    .attrs({
      'class': '',
      'cx': obj.rendered.plot.xScaleObj.scale(xPos),
      'cy': obj.rendered.plot.yScaleObj.scale(tipData.data.series[1].val)
    })
    .classed(`${obj.prefix}tip_circle-xy-${dataGroup}`, true);

  const isTimeScale = obj.xAxis.scale === 'time' || obj.xAxis.scale === 'ordinal-time';

  let domain, ctx;

  if (isTimeScale) {
    domain = obj.rendered.plot.xScaleObj.scale.domain();
    ctx = timeDiff(domain[0], domain[domain.length - 1], 8, obj.data);
  }

  tipNodes.tipGroup.selectAll(`.${obj.prefix}tip_text-group text`)
    .data(tipData.data.series)
    .attr('x', 0)
    .text((d, i) => {
      let rhs;
      if (i === 0 && isTimeScale) {
        rhs = tipDateFormatter(ctx, obj.monthsAbr, tipData.data.series[0].val);
      } else {
        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
        rhs = `${obj.yAxis.prefix}${yFormatter(obj.yAxis.format, d.val)}${obj.yAxis.suffix}`;
      }
      if ((d.val || d.val === 0) && d.val !== '__undefined__') {
        return `${d.key}: ${rhs}`;
      } else {
        return 'n/a';
      }
    })
    .classed(`${obj.prefix}muted`, d => {
      return (!(d.val || d.val === 0) || d.val === '__undefined__');
    });

  tipNodes.tipTextX
    .text(tipData.data.key);

  tipNodes.tipGroup
    .selectAll(`.${obj.prefix}tip_text-group`)
    .data(tipData.data.series)
    .classed(`${obj.prefix}active`, d => d.val ? true : false);

  tipNodes.tipGroup
    .attr('transform', () => {
      // tipbox pointing left or right, and top or bottom
      const xDirection = cursor.x > obj.dimensions.tickWidth() / 2 ? 'left' : 'right',
        yDirection = cursor.y > obj.dimensions.yAxisHeight() / 2 ? 'top' : 'bottom';
      return `translate(${obj.dimensions.tipPadding[xDirection]},${obj.dimensions.tipPadding[yDirection]})`;
    });

  tipNodes.tipRect
    .attrs({
      'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
      'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
    });

  tipNodes.tipBox
    .attr('transform', function() {
      let x, y;

      if (cursor.y > obj.dimensions.yAxisHeight() / 2) {
        // tipbox pointing up
        y = obj.rendered.plot.yScaleObj.scale(yPos) - this.getBoundingClientRect().height - obj.dimensions.tipOffset.vertical;
      } else {
        // tipbox pointing down
        y = obj.rendered.plot.yScaleObj.scale(yPos) + obj.dimensions.tipOffset.vertical;
      }

      if (cursor.x > obj.dimensions.tickWidth() / 2) {
        // tipbox pointing left
        x = obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - this.getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
      } else {
        // tipbox pointing right
        x = obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
      }
      return `translate(${x},${y})`;
    });

}

export function tipDateFormatter(ctx, months, data) {

  let dMonth,
    dDate,
    dYear,
    dHour,
    dMinute,
    dStr;

  const d = data;

  switch (ctx) {
    case 'years':
      dStr = d.getFullYear();
      break;
    case 'monthly':
      dMonth = months[d.getMonth()];
      dYear = d.getFullYear();
      dStr = `${dMonth} ${dYear}`;
      break;
    case 'months':
      dMonth = months[d.getMonth()];
      dDate = d.getDate();
      dYear = d.getFullYear();
      dStr = `${dMonth} ${dDate}, ${dYear}`;
      break;
    case 'weeks':
    case 'days':
      dMonth = months[d.getMonth()];
      dDate = d.getDate();
      dYear = d.getFullYear();
      dStr = `${dMonth} ${dDate}`;
      break;
    case 'hours': {

      dDate = d.getDate();
      dHour = d.getHours();
      dMinute = d.getMinutes();

      let dHourStr,
        dMinuteStr;

      // Convert from 24h time
      const suffix = (dHour >= 12) ? 'p.m.' : 'a.m.';

      if (dHour === 0) {
        dHourStr = 12;
      } else if (dHour > 12) {
        dHourStr = dHour - 12;
      } else {
        dHourStr = dHour;
      }

      // Make minutes follow Globe style
      if (dMinute === 0) {
        dMinuteStr = '';
      } else if (dMinute < 10) {
        dMinuteStr = `:0${dMinute}`;
      } else {
        dMinuteStr = `:${dMinute}`;
      }

      dStr = `${dHourStr}${dMinuteStr} ${suffix}`;

      break;
    }
    default:
      dStr = d;
      break;
  }

  return dStr;

}
