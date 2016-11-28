import { bisector } from 'd3-array';
import { select, mouse } from 'd3-selection';
import { setTickFormatY as yFormatter } from './axis';
import { timeDiff } from '../../utils/utils';

/**
 * Tips handling module.
 * @module charts/components/tips
 */

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

  const xScaleObj = obj.rendered.plot.xScaleObj,
    xScale = xScaleObj.scale,
    scaleType = xScaleObj.obj.type;

  let xVal;

  if (scaleType === 'ordinal-time' || scaleType === 'ordinal') {

    const ordinalBisection = bisector(d => { return d; }).left,
      rangePos = ordinalBisection(xScale.range(), cursor.x);

    xVal = xScale.domain()[rangePos];

  } else {
    xVal = xScale.invert(cursor.x);
  }

  let tipData;

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

    tipData = xVal - d0.key > d1.key - xVal ? d1 : d0;
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

  if (obj.options.type === 'column') {
    if (obj.options.stacked) {
      obj.rendered.plot.series.selectAll('rect').classed(`${obj.prefix}muted`, false);
    } else {
      obj.rendered.plot.columnItem.selectAll('rect').classed(`${obj.prefix}muted`, false);
    }
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
    column: obj.options.stacked ? stackedColumnChartTips : columnChartTips
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

    case 'column': {

      let columnRects;

      if (obj.options.stacked) {
        columnRects = obj.rendered.plot.series.selectAll('rect');
      } else {
        columnRects = obj.rendered.plot.columnItem.selectAll('rect');
      }

      columnRects
        .on('mouseover', d => {
          showTips(tipNodes, obj);
          clearTimeout(timeout);
          timeout = mouseIdle(tipNodes, obj);
          fns.column(tipNodes, obj, d, this);
        })
        .on('mouseout', () => { hideTips(tipNodes, obj); });

      break;
    }
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
      'r': (tipNodes.radius / 2) || 2.5
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

    const domain = obj.rendered.plot.xScaleObj.scale.domain(),
      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);

    tipNodes.tipGroup.selectAll(`.${obj.prefix}tip_text-group text`)
      .data(tipData.series)
      .text(d => {
        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
        if (d.val) {
          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
        } else {
          return 'n/a';
        }
      });

    tipNodes.tipTextDate
      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);

    tipNodes.tipGroup
      .selectAll(`.${obj.prefix}tip_text-group`)
      .data(tipData.series)
      .classed(`${obj.prefix}active`, d => {
        return d.val ? true : false;
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
        .data(tipData.series)
        .classed(`${obj.prefix}active`, d => { return d.val ? true : false; })
        .attrs({
          'cx': obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
          'cy': d => {
            if (d.val) { return obj.rendered.plot.yScaleObj.scale(d.val); }
          }
        });

    tipNodes.tipRect
      .attrs({
        'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
        'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
      });

    tipNodes.xTipLine.select('line')
      .attrs({
        'x1': obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
        'x2': obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
        'y1': 0,
        'y2': obj.dimensions.yAxisHeight()
      });

    tipNodes.tipBox
      .attr('transform', function() {
        let x;
        if (cursor.x > obj.dimensions.tickWidth() / 2) {
          // tipbox pointing left
          x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
        } else {
          // tipbox pointing right
          x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
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
      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);

    tipNodes.tipGroup.selectAll(`.${obj.prefix}tip_text-group text`)
      .data(tipData)
      .text((d, i) => {

        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }

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
      });

    tipNodes.tipTextDate
      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData[0].data[obj.data.keys[0]]);

    tipNodes.tipGroup
      .selectAll(`.${obj.prefix}tip_text-group`)
      .data(tipData)
      .classed(`${obj.prefix}active`, (d, i) => {
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
        .data(tipData)
        .classed(`${obj.prefix}active`, (d, i) => {
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
        })
        .attrs({
          'cx': d => {
            return obj.rendered.plot.xScaleObj.scale(d.data[obj.data.keys[0]]) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight;
          },
          'cy': d => {
            if (!isNaN(d[1])) {
              return obj.rendered.plot.yScaleObj.scale(d[1]);
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
        'x1': obj.rendered.plot.xScaleObj.scale(tipData[0].data[obj.data.keys[0]]) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
        'x2': obj.rendered.plot.xScaleObj.scale(tipData[0].data[obj.data.keys[0]]) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
        'y1': 0,
        'y2': obj.dimensions.yAxisHeight()
      });

    tipNodes.tipBox
      .attr('transform', function() {
        let x;
        if (cursor.x > obj.dimensions.tickWidth() / 2) {
          // tipbox pointing left
          x = obj.rendered.plot.xScaleObj.scale(tipData[0].data[obj.data.keys[0]]) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
        } else {
          // tipbox pointing right
          x = obj.rendered.plot.xScaleObj.scale(tipData[0].data[obj.data.keys[0]]) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
        }
        return `translate(${x},${obj.dimensions.tipOffset.vertical})`;
      });

  }

}

export function columnChartTips(tipNodes, obj, d, thisRef) {
  //
  // const columnRects = obj.rendered.plot.columnItem.selectAll('rect');
  //
  // const cursor = cursorPos(tipNodes.overlay);
  //
  // let isUndefined = 0;
  //
  // const thisColumn = thisRef,
  //   tipData = d;
  //
  // for (let i = 0; i < tipData.series.length; i++) {
  //   if (tipData.series[i].val === '__undefined__') {
  //     isUndefined++;
  //     break;
  //   }
  // }
  //
  // if (!isUndefined) {
  //
  //   const domain = obj.rendered.plot.xScaleObj.scale.domain(),
  //     ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
  //
  //   columnRects
  //     .classed(`${obj.prefix}muted`, () => {
  //       return (this === thisColumn) ? false : true;
  //     });
  //
  //   tipNodes.tipGroup.selectAll(`.${obj.prefix}tip_text-group text`)
  //     .data(tipData.series)
  //     .text(d => {
  //       if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
  //       if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
  //       if (d.val) {
  //         return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
  //       } else {
  //         return 'n/a';
  //       }
  //     });
  //
  //   if (obj.dateFormat !== undefined) {
  //     tipNodes.tipTextDate.call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
  //   } else {
  //     tipNodes.tipTextDate.text(tipData.key);
  //   }
  //
  //   tipNodes.tipGroup
  //     .selectAll(`.${obj.prefix}tip_text-group`)
  //     .data(tipData.series)
  //     .classed(`${obj.prefix}active`, d => {
  //       return d.val ? true : false;
  //     });
  //
  //   tipNodes.tipRect
  //     .attrs({
  //       'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
  //       'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
  //     });
  //
  //   tipNodes.tipBox
  //     .attr('transform', function() {
  //       let x;
  //       if (cursor.x > obj.dimensions.tickWidth() / 2) {
  //         // tipbox pointing left
  //         x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
  //       } else {
  //         // tipbox pointing right
  //         x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
  //       }
  //       return `translate(${x},${obj.dimensions.tipOffset.vertical})`;
  //     });
  //
  //   showTips(tipNodes, obj);
  //
  // }

}

export function stackedColumnChartTips(tipNodes, obj, d, thisRef) {
  //
  // const columnRects = obj.rendered.plot.series.selectAll('rect');
  //
  // let isUndefined = 0;
  //
  // const thisColumnRect = thisRef,
  //   tipData = d;
  //
  // for (let i = 0; i < tipData.raw.series.length; i++) {
  //   if (tipData.raw.series[i].val === '__undefined__') {
  //     isUndefined++;
  //     break;
  //   }
  // }
  //
  // if (!isUndefined) {
  //
  //   const domain = obj.rendered.plot.xScaleObj.scale.domain(),
  //     ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
  //
  //   const refPos = select(thisColumnRect).attr('x');
  //
  //   let thisColumnKey = '';
  //
  //   /* Figure out which stack this selected rect is in then loop back through and (un)assign muted class */
  //   columnRects.classed(`${obj.prefix}muted`, d => {
  //     if (this === thisColumnRect) {
  //       thisColumnKey = d.raw.key;
  //     }
  //     return (this === thisColumnRect) ? false : true;
  //   });
  //
  //   columnRects.classed(`${obj.prefix}muted`, d => {
  //     return (d.raw.key === thisColumnKey) ? false : true;
  //   });
  //
  //   tipNodes.tipGroup.selectAll(`.${obj.prefix}tip_text-group text`)
  //     .data(tipData.raw.series)
  //     .text(d => {
  //       if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
  //       if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
  //       if (d.val) {
  //         return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
  //       } else {
  //         return 'n/a';
  //       }
  //     });
  //
  //   if (obj.dateFormat !== undefined) {
  //     tipNodes.tipTextDate
  //       .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
  //   } else {
  //     tipNodes.tipTextDate
  //       .text(() => {
  //         return tipData.raw.key;
  //       });
  //   }
  //
  //   tipNodes.tipGroup
  //     .append('circle')
  //     .attrs({
  //       'class': function(d, i) {
  //         return `${obj.prefix}tip_circle ${obj.prefix}tip_circle-${i}`;
  //       },
  //       'r': tipNodes.radius,
  //       'cx': tipNodes.radius,
  //       'cy': function(d, i) {
  //         return ((i + 1) * parseInt(select(this).style('font-size')) * 1.13 + 9);
  //       }
  //     });
  //
  //   tipNodes.tipGroup
  //     .selectAll(`.${obj.prefix}tip_text-group`)
  //     .data(tipData.raw.series)
  //     .classed(`.${obj.prefix}active`, d => { return d.val ? true : false; });
  //
  //   tipNodes.tipRect
  //     .attrs({
  //       'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
  //       'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
  //     });
  //
  //   tipNodes.tipBox
  //     .attr('transform', function() {
  //       let x;
  //       if (refPos > obj.dimensions.tickWidth() / 2) {
  //         // tipbox pointing left
  //         x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
  //       } else {
  //         // tipbox pointing right
  //         x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
  //       }
  //       return `translate(${x},${obj.dimensions.tipOffset.vertical})`;
  //     });
  //
  // }

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
