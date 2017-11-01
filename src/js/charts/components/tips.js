import { bisector } from 'd3-array';
import { select, mouse } from 'd3-selection';
import { setTickFormatY as yFormatter } from './axis';
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

    if (domainPosition > scale.domain().length) {
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

    // still need to handle ordinal stacking

    return tipData;

  }

  xVal = scale.invert(cursorVal);

  if (obj.options.stacked) {
    const data = obj.data.stackedData;
    const i = bisectData(data, xVal, obj.options.stacked, obj.data.keys[0]);

    const arr = [];
    let refIndex;

    for (let k = 0; k < data.length; k++) {
      if (refIndex) {
        arr.push(data[k][refIndex]);
      } else {
        const d0 = data[k][i[k] - 1],
          d1 = data[k][i[k]];
        refIndex = xVal - d0.x > d1.x - xVal ? i[k] : (i[k] - 1);
        arr.push(data[k][refIndex]);
      }
    }

    tipData = arr;

  } else {
    const data = obj.data.data,
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

  if (tipNodes.tipBox) {
    tipNodes.tipBox.classed(`${obj.prefix}active`, true);
  }

  if (tipNodes.tipPathCircles) {
    tipNodes.tipPathCircles.classed(`${obj.prefix}active`, true);
  }

}

export function hideTips(tipNodes, obj) {

  if (obj.options.type === 'column' || obj.options.type === 'bar') {
    obj.rendered.plot.seriesGroup.selectAll(`.${obj.prefix}muted`)
      .classed(`${obj.prefix}muted`, false);
  }

  if (tipNodes.xTipLine) {
    tipNodes.xTipLine.classed(`${obj.prefix}active`, false);
  }

  if (tipNodes.tipBox) {
    tipNodes.tipBox.classed(`${obj.prefix}active`, false);
  }

  if (tipNodes.tipPathCircles) {
    tipNodes.tipPathCircles.classed(`${obj.prefix}active`, false);
  }

}

export function mouseIdle(tipNodes, obj) {
  return setTimeout(() => {
    hideTips(tipNodes, obj);
  }, obj.tipTimeout);
}

let timeout;

export function tipsManager(node, obj) {

  const tipNodes = appendTipGroup(node, obj);

  const fns = {
    line: lineChartTips,
    multiline: lineChartTips,
    area: obj.options.stacked ? stackedAreaChartTips : areaChartTips,
    column: obj.options.stacked ? stackedColumnChartTips : columnChartTips,
    bar: obj.options.stacked ? stackedBarChartTips : barChartTips
  };

  let dataReference;

  if (obj.options.type === 'multiline') {
    dataReference = [obj.data.data[0].series[0]];
  } else {
    dataReference = obj.data.data[0].series;
  }

  const innerTipElements = appendTipElements(node, obj, tipNodes, dataReference);

  switch (obj.options.type) {
    case 'line':
    case 'multiline':
    case 'area':
    case 'column':
    case 'bar':
      tipNodes.overlay = tipNodes.tipNode.append('rect')
        .attrs({
          'class': `${obj.prefix}tip_overlay`,
          'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
          'width': obj.dimensions.tickWidth(),
          'height': obj.dimensions.computedHeight()
        });

      tipNodes.overlay
        .on('mouseover', () => { showTips(tipNodes, obj); })
        .on('mouseout', () => { hideTips(tipNodes, obj); })
        .on('mousemove', () => {
          showTips(tipNodes, obj);
          clearTimeout(timeout);
          timeout = mouseIdle(tipNodes, obj);
          return fns[obj.options.type](tipNodes, innerTipElements, obj);
        });

      break;
  }

}

export function appendTipGroup(node, obj) {

  const svgNode = select(node.node().parentNode),
    chartNode = select(node.node().parentNode.parentNode);

  const tipNode = svgNode.append('g')
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

  const tipBox = tipNode.append('g')
    .attrs({
      'class': `${obj.prefix}tip_box`,
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`
    });

  const tipRect = tipBox.append('rect')
    .attrs({
      'class': `${obj.prefix}tip_rect`,
      'transform': 'translate(0,0)',
      'width': 1,
      'height': 1
    });

  const tipGroup = tipBox.append('g')
    .attr('class', `${obj.prefix}tip_group`);

  const legendIcon = chartNode.select(`.${obj.prefix}legend_item_icon`).node();

  const radius = legendIcon ? legendIcon.getBoundingClientRect().width / 2 : 0;

  const tipPathCircles = tipNode.append('g')
    .attr('class', `${obj.prefix}tip_path-circle-group`);

  const tipTextDate = tipGroup
    .insert('g', ':first-child')
    .attr('class', `${obj.prefix}tip_text-date-group`)
    .append('text')
    .attrs({
      'class': `${obj.prefix}tip_text-date`,
      'x': 0,
      'y': 0,
      'dy': '1em'
    });

  return {
    svg: svgNode,
    tipNode: tipNode,
    xTipLine: xTipLine,
    tipBox: tipBox,
    tipRect: tipRect,
    tipGroup: tipGroup,
    legendIcon: legendIcon,
    tipPathCircles: tipPathCircles,
    radius: radius,
    tipTextDate: tipTextDate
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
    .text(d => { return d.val; })
    .attrs({
      'class': (d, i) => {
        return `${obj.prefix}tip_text ${obj.prefix}tip_text-${i}`;
      },
      'data-series': d => { return d.key; },
      'x': (tipNodes.radius * 2) + (tipNodes.radius / 1.5),
      'y': function(d, i) {
        lineHeight = lineHeight || parseInt(select(this).style('line-height'));
        return (i + 1) * lineHeight;
      },
      'dy': '1em'
    });

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

  tipNodes.tipPathCircles.selectAll('circle')
    .data(dataRef).enter()
    .append('circle')
    .attrs({
      'class': (d, i) => {
        return `${obj.prefix}tip_path-circle ${obj.prefix}tip_path-circle-${i}`;
      },
      'r': tipRadius
    });

  return tipTextGroups;

}

export function lineChartTips(tipNodes, innerTipEls, obj) {

  const cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  let isUndefined = 0;

  for (let i = 0; i < tipData.series.length; i++) {
    if (tipData.series[i].val === '__undefined__') {
      isUndefined++;
      break;
    }
  }

  if (!isUndefined) {

    const domain = obj.rendered.plot.xScaleObj.scale.domain();
    let ctx = timeDiff(domain[0], domain[domain.length - 1], 8, obj.data);

    tipNodes.tipGroup.selectAll(`.${obj.prefix}tip_text-group text`)
      .data(tipData.series)
      .text(d => {
        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
        if (d.val && d.val !== '__undefined__') {
          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
        } else {
          return 'n/a';
        }
      })
      .classed(`${obj.prefix}muted`, d => {
        return (!d.val || d.val === '__undefined__');
      });

    let bandwidth = 0;

    if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
      tipNodes.tipTextDate
        .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
    } else {
      tipNodes.tipTextDate
        .text(tipData.key);
      bandwidth = obj.rendered.plot.xScaleObj.scale.bandwidth();
    }

    tipNodes.tipGroup
      .selectAll(`.${obj.prefix}tip_text-group`)
      .data(tipData.series)
      .classed(`${obj.prefix}active`, d => { return d.val ? true : false; });

    tipNodes.tipGroup
      .attr('transform', () => {
        let x;
        if (cursor.x > obj.dimensions.tickWidth() / 2) {
          // tipbox pointing left
          x = obj.dimensions.tipPadding.left;
        } else {
          // tipbox pointing right
          x = obj.dimensions.tipPadding.right;
        }
        return `translate(${x},${obj.dimensions.tipPadding.top})`;
      });

    tipNodes.tipPathCircles
      .selectAll(`.${obj.prefix}tip_path-circle`)
        .data(tipData.series)
        .classed(`${obj.prefix}active`, d => { return d.val ? true : false; })
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

}

export function areaChartTips(tipNodes, innerTipEls, obj) {
  // area tips implementation is currently
  // *exactly* the same as line tips, so…
  lineChartTips(tipNodes, innerTipEls, obj);
}

export function stackedAreaChartTips(tipNodes, innerTipEls, obj) {

  const cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  let isUndefined = 0;

  for (let i = 0; i < tipData.length; i++) {
    if (tipData[i].val === '__undefined__') {
      isUndefined++;
      break;
    }
  }

  if (!isUndefined) {

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
          if (d.val) {
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
      tipNodes.tipTextDate
        .call(tipDateFormatter, ctx, obj.monthsAbr, tipData[0].data[obj.data.keys[0]]);
    } else {
      tipNodes.tipTextDate
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
        let x;
        if (cursor.x > obj.dimensions.tickWidth() / 2) {
          // tipbox pointing left
          x = obj.dimensions.tipPadding.left;
        } else {
          // tipbox pointing right
          x = obj.dimensions.tipPadding.right;
        }
        return `translate(${x},${obj.dimensions.tipPadding.top})`;
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
            if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
              xData = tipData.key;
            } else {
              xData = d.data[obj.data.keys[0]];
            }
            return obj.rendered.plot.xScaleObj.scale(xData) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2);
          },
          'cy': d => {
            let yData;
            if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
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

    if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
      xPos = tipData.key;
    } else {
      xPos = tipData[0].data[obj.data.keys[0]];
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

}

export function columnChartTips(tipNodes, innerTipEls, obj) {

  const cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  tipNodes.tipGroup.selectAll(`.${obj.prefix}tip_text-group text`)
    .data(tipData.series)
    .text(d => {
      if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
      if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
      if (d.val && d.val !== '__undefined__') {
        return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
      } else {
        return 'n/a';
      }
    })
    .classed(`${obj.prefix}muted`, d => {
      return (!d.val || d.val === '__undefined__');
    });

  obj.rendered.plot.seriesGroup.selectAll('rect')
    .classed(`${obj.prefix}muted`, true);

  if (obj.options.stacked) {
    obj.rendered.plot.seriesGroup.selectAll(`[data-key="${tipData.key}"]`)
      .classed(`${obj.prefix}muted`, false);
  } else {
    obj.rendered.plot.seriesGroup.selectAll(`[data-key="${tipData.key}"] rect`)
      .classed(`${obj.prefix}muted`, false);
  }

  tipNodes.tipGroup
    .selectAll(`.${obj.prefix}tip_text-group`)
    .data(tipData.series)
    .classed(`${obj.prefix}active`, d => { return d.val ? true : false; });

  if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
    tipNodes.tipTextDate.text(tipData.key);
  } else {
    const domain = obj.rendered.plot.xScaleObj.scale.domain(),
      ctx = timeDiff(domain[0], domain[domain.length - 1], 8, obj.data);

    tipNodes.tipTextDate
    .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
  }

  tipNodes.tipGroup
    .attr('transform', () => {
      let x;
      if (cursor.x > obj.dimensions.tickWidth() / 2) {
        // tipbox pointing left
        x = obj.dimensions.tipPadding.left;
      } else {
        // tipbox pointing right
        x = obj.dimensions.tipPadding.right;
      }
      return `translate(${x},${obj.dimensions.tipPadding.top})`;
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

export function stackedColumnChartTips(tipNodes, innerTipEls, obj) {
  // stacked column tips implementation is the same
  // as column tips except for one line, so…
  columnChartTips(tipNodes, innerTipEls, obj);
}

export function barChartTips(tipNodes, innerTipEls, obj) {

  const cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  tipNodes.tipGroup.style('display', 'none');

  obj.rendered.plot.seriesGroup.selectAll('rect')
    .classed(`${obj.prefix}muted`, true);

  obj.rendered.plot.seriesGroup.selectAll(`.${obj.prefix}bar-label`)
    .classed(`${obj.prefix}muted`, true);

  obj.rendered.plot.seriesGroup.selectAll(`[data-key="${tipData.key}"] rect`)
    .classed(`${obj.prefix}muted`, false);

  obj.rendered.plot.seriesGroup.selectAll(`[data-key="${tipData.key}"] .${obj.prefix}bar-label`)
    .classed(`${obj.prefix}muted`, false);

}

export function stackedBarChartTips(tipNodes, innerTipEls, obj) {

  const cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  tipNodes.tipGroup.style('display', 'none');

  obj.rendered.plot.seriesGroup.selectAll('rect')
    .classed(`${obj.prefix}muted`, true);

  obj.rendered.plot.seriesGroup.selectAll(`.${obj.prefix}bar-label`)
    .classed(`${obj.prefix}muted`, true);

  obj.rendered.plot.seriesGroup.selectAll(`[data-key="${tipData.key}"]`)
    .classed(`${obj.prefix}muted`, false);

  obj.rendered.plot.seriesGroup.selectAll(`[data-legend="${tipData.key}"]`)
    .classed(`${obj.prefix}muted`, false);


}

export function tipDateFormatter(selection, ctx, months, data) {

  let dMonth,
    dDate,
    dYear,
    dHour,
    dMinute;

  selection.text(() => {
    const d = data;
    let dStr;
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

  });

}
