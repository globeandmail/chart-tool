import { axisRight, axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { max } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import { timeYears, timeMonths, timeWeeks, timeDays, timeHours, timeMinutes } from 'd3-time';
import { setRangeArgs } from './scale';
import { timeDiff, wrapText, getTranslate } from '../../utils/utils';
import { isFloat } from '../../helpers/helpers';
import 'd3-selection-multi';

export function axisFactory(axisObj, scale) {
  switch (axisObj.orient) {
    case 'left': return axisLeft(scale);
    case 'right': return axisRight(scale);
    case 'bottom': return axisBottom(scale);
  }
}

export function axisManager(node, obj, scale, axisType) {

  const axisObj = obj[axisType],
    axis = new axisFactory(axisObj, scale);

  const prevAxis = node.select(`.${obj.prefix}axis-group.${obj.prefix}${axisType}`).node();

  if (prevAxis !== null) { select(prevAxis).remove(); }

  const axisGroup = node.append('g')
    .attr('class', `${obj.prefix}axis-group ${obj.prefix}${axisType}`);

  if (axisType === 'xAxis') {
    appendXAxis(axisGroup, obj, scale, axis, axisType);
  } else if (axisType === 'yAxis') {
    appendYAxis(axisGroup, obj, scale, axis, axisType);
  }

  return {
    node: axisGroup,
    axis: axis
  };

}

export function determineFormat(context) {
  switch (context) {
    case 'years': return timeFormat('%Y');
    case 'months': return timeFormat('%b');
    case 'weeks': return timeFormat('%W');
    case 'days': return timeFormat('%j');
    case 'hours': return timeFormat('%H');
    case 'minutes': return timeFormat('%M');
  }
}

export function appendXAxis(axisGroup, obj, scale, axis, axisType) {

  const axisObj = obj[axisType];

  let axisSettings;

  if (obj.exportable && obj.exportable.x_axis) {
    axisSettings = Object.assign(axisObj, obj.exportable.x_axis);
  } else {
    axisSettings = axisObj;
  }

  axisSettings.axisType = axisType;

  axisGroup
    .attr('transform', `translate(0, ${obj.dimensions.yAxisHeight()})`);

  const axisNode = axisGroup.append('g')
    .attr('class', `${obj.prefix}x-axis`);

  switch(axisObj.scale) {
    case 'time':
      timeAxis(axisNode, obj, scale, axis, axisSettings);
      break;
    case 'ordinal':
      discreteAxis(axisNode, scale, axis, axisSettings, obj.dimensions);
      break;
    case 'ordinal-time':
      ordinalTimeAxis(axisNode, obj, scale, axis, axisSettings);
      break;
  }

  obj.dimensions.xAxisHeight = axisNode.node().getBBox().height;

}

export function appendYAxis(axisGroup, obj, scale, axis, axisType) {

  axisGroup.attr('transform', 'translate(0,0)');

  const axisNode = axisGroup.append('g').attr('class', `${obj.prefix}y-axis`);

  const axisObj = obj[axisType];

  let axisSettings;

  if (obj.exportable && obj.exportable.y_axis) {
    axisSettings = Object.assign(axisObj, obj.exportable.y_axis);
  } else {
    axisSettings = axisObj;
  }

  axisSettings.axisType = axisType;

  obj.dimensions.yAxisPaddingRight = axisSettings.paddingRight;

  switch(axisObj.scale) {
    case 'linear':
      drawYAxis(obj, axis, axisNode, axisSettings);
      break;
    case 'ordinal':
      discreteAxis(axisNode, scale, axis, axisSettings, obj.dimensions);
      break;
  }

}

export function drawYAxis(obj, axis, axisNode, axisSettings) {

  axis.scale().range([obj.dimensions.yAxisHeight(), 0]);

  axis.tickValues(tickFinderY(axis.scale(), axisSettings));

  axisNode.call(axis);

  axisNode.selectAll('g')
    .filter(d => { return d; })
    .classed(`${obj.prefix}minor`, true);

  axisNode.selectAll('.tick text')
    .attr('transform', 'translate(0,0)')
    .call(updateTextY, axisNode, obj, axis, axisSettings)
    .call(repositionTextY, obj.dimensions, axisSettings.textX);

  axisNode.selectAll('.tick line')
    .attrs({
      'x1': obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
      'x2': obj.dimensions.computedWidth()
    });

}

export function timeAxis(axisNode, obj, scale, axis, axisSettings) {

  const domain = scale.domain(),
    ctx = timeDiff(domain[0], domain[1], 3),
    currentFormat = determineFormat(ctx);

  axis.tickFormat(currentFormat);

  let ticks, tickGoal;

  if (axisSettings.ticks === 'auto') {
    tickGoal = axisSettings.tickTarget;
  } else {
    tickGoal = axisSettings.ticks;
  }

  if (obj.dimensions.tickWidth() > axisSettings.widthThreshold) {
    ticks = tickFinderX(domain, ctx, tickGoal);
  } else {
    ticks = tickFinderX(domain, ctx, axisSettings.ticksSmall);
  }

  if (obj.options.type !== 'column') {
    axis.tickValues(ticks);
  } else {
    axis.ticks();
  }

  axisNode.call(axis);

  axisNode.selectAll('text')
    .attrs({
      'x': axisSettings.upper.textX,
      'y': axisSettings.upper.textY,
      'dy': `${axisSettings.dy}em`
    })
    .style('text-anchor', 'start')
    .call(setTickFormatX, ctx, axisSettings.ems, obj.monthsAbr);

  if (obj.options.type === 'column') { dropRedundantTicks(axisNode, ctx); }

  axisNode.selectAll('.tick')
    .call(dropTicks);

  axisNode.selectAll('line')
    .attr('y2', axisSettings.upper.tickHeight);

}

export function discreteAxis(axisNode, scale, axis, axisSettings, dimensions) {

  axis.tickPadding(0);

  const bandWidth = scale.bandwidth();

  axisNode.call(axis);

  if (axisSettings.axisType === 'xAxis') {
    axisNode.selectAll('text')
      .style('text-anchor', 'middle')
      .attr('dy', `${axisSettings.dy}em`)
      .call(wrapText, bandWidth);

    const xPos = -(bandWidth / 2) - ((scale.step() * dimensions.bands.padding) / 2);

    axisNode.selectAll('line')
      .attrs({
        'x1': xPos,
        'x2': xPos
      });

    axisNode.selectAll('line')
      .attr('y2', axisSettings.upper.tickHeight);

    const lastTick = axisNode.append('g')
      .attrs({
        'class': 'tick',
        'transform': `translate(${dimensions.tickWidth() + (bandWidth / 2) + ((scale.step() * dimensions.bands.padding) / 2)},0)`
      });

    lastTick.append('line')
      .attrs({
        'y2': axisSettings.upper.tickHeight,
        'x1': xPos,
        'x2': xPos
      });

  } else {

    axisNode.selectAll('line').remove();
    axisNode.selectAll('text').attr('x', 0);

    let maxLabelWidth;

    if (dimensions.width > axisSettings.widthThreshold) {
      maxLabelWidth = dimensions.computedWidth() / 3.5;
    } else {
      maxLabelWidth = dimensions.computedWidth() / 3;
    }


    if (axisNode.node().getBBox().width > maxLabelWidth) {
      axisNode.selectAll('text')
        .call(wrapText, maxLabelWidth)
        .each(function() {
          const tspans = select(this).selectAll('tspan'),
            tspanCount = tspans._groups[0].length,
            textHeight = select(this).node().getBBox().height;
          if (tspanCount > 1) {
            tspans.attr('y', ((textHeight / tspanCount) / 2) - (textHeight / 2));
          }
        });
    }

    dimensions.labelWidth = axisNode.node().getBBox().width;

    select(axisNode.node().parentNode).attr('transform', `translate(${dimensions.labelWidth},0)`);

  }

}

export function ordinalTimeAxis(axisNode, obj, scale, axis, axisSettings) {

  const domain = scale.domain(),
    ctx = timeDiff(domain[0], domain[domain.length - 1], 3),
    currentFormat = determineFormat(ctx);

  axis.tickFormat(currentFormat);

  axisNode.call(axis);

  axisNode.selectAll('text')
    .attrs({
      'x': axisSettings.upper.textX,
      'y': axisSettings.upper.textY,
      'dy': `${axisSettings.dy}em`
    })
    .style('text-anchor', 'start')
    .call(setTickFormatX, ctx, axisSettings.ems, obj.monthsAbr);

  let ordinalTickPadding;

  if (obj.dimensions.computedWidth() > obj.xAxis.widthThreshold) {
    ordinalTickPadding = 7;
  } else {
    ordinalTickPadding = 4;
  }

  axisNode.selectAll('.tick')
    .call(ordinalTimeTicks, axisNode, ctx, scale, ordinalTickPadding);

  axisNode.selectAll('line')
    .attr('y2', axisSettings.upper.tickHeight);

}

export function setTickFormatX(selection, ctx, ems, monthsAbr) {

  let prevYear,
    prevMonth,
    prevDate,
    dYear,
    dMonth,
    dDate,
    dHour,
    dMinute;

  selection.text(function(d) {

    const node = select(this);

    let dStr;

    switch (ctx) {
      case 'years':
        dStr = d.getFullYear();
        break;
      case 'months':
        dMonth = monthsAbr[d.getMonth()];
        dYear = d.getFullYear();
        if (dYear !== prevYear) {
          newTextNode(node, dYear, ems);
        }
        dStr = dMonth;
        prevYear = dYear;
        break;
      case 'weeks':
      case 'days':
        dYear = d.getFullYear();
        dMonth = monthsAbr[d.getMonth()];
        dDate = d.getDate();
        dStr = dMonth !== prevMonth ? `${dMonth} ${dDate}` : dDate;
        if (dYear !== prevYear) {
          newTextNode(node, dYear, ems);
        }
        prevMonth = dMonth;
        prevYear = dYear;
        break;
      case 'hours': {
        dMonth = monthsAbr[d.getMonth()];
        dDate = d.getDate();
        dHour = d.getHours();
        dMinute = d.getMinutes();

        let dHourStr,
          dMinuteStr;

        // Convert from 24h time
        let suffix = (dHour >= 12) ? 'p.m.' : 'a.m.';
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

        if (dDate !== prevDate) {
          let dateStr = `${dMonth} ${dDate}`;
          newTextNode(node, dateStr, ems);
        }

        prevDate = dDate;

        break;
      }
      default:
        dStr = d;
        break;
    }

    return dStr;

  });

}

export function setTickFormatY(fmt, d) {
  // checking for a format and formatting y-axis values accordingly

  let currentFormat;

  switch (fmt) {
    case 'general':
      currentFormat = format('')(d);
      break;
    case 'si':
    case 'comma':
      if (isFloat(parseFloat(d))) {
        currentFormat = format(',.2f')(d);
      } else {
        currentFormat = format(',')(d);
      }
      break;
    case 'round1':
      currentFormat = format(',.1f')(d);
      break;
    case 'round2':
      currentFormat = format(',.2f')(d);
      break;
    case 'round3':
      currentFormat = format(',.3f')(d);
      break;
    case 'round4':
      currentFormat = format(',.4f')(d);
      break;
    default:
      currentFormat = format(',')(d);
      break;
  }

  return currentFormat;

}

export function updateTextX(textNodes, axisNode, obj, axis, axisObj) {

  textNodes
    .text((d, i) => {
      let val = setTickFormatY(axisObj.format, d);
      if (i === axis.tickValues().length - 1) {
        val = (axisObj.prefix || '') + val + (axisObj.suffix || '');
      }
      return val;
    });

}

export function updateTextY(textNodes, axisNode, obj, axis, axisObj) {

  const arr = [];

  textNodes
    .attr('transform', 'translate(0,0)')
    .text((d, i) => {
      let val = setTickFormatY(axisObj.format, d);
      if (i === axis.tickValues().length - 1) {
        val = (axisObj.prefix || '') + val + (axisObj.suffix || '');
      }
      return val;
    })
    .text(function() {
      const sel = select(this);
      const textChar = sel.node().getBoundingClientRect().width;
      arr.push(textChar);
      return sel.text();
    })
    .attrs({
      'dy': function() {
        if (axisObj.dy !== '') {
          return `${axisObj.dy}em`;
        } else {
          return select(this).attr('dy');
        }
      },
      'x': function() {
        if (axisObj.textX !== '') {
          return axisObj.textX;
        } else {
          return select(this).attr('x');
        }
      },
      'y': function() {
        if (axisObj.textY !== '') {
          return axisObj.textY;
        } else {
          return select(this).attr('y');
        }
      }
    });

  obj.dimensions.labelWidth = max(arr);

}

export function repositionTextY(text, dimensions, textX) {
  text.attrs({
    'transform': `translate(${dimensions.labelWidth - textX},0)`,
    'x': 0
  });
}

// Clones current text selection and appends
// a new text node below the selection
export function newTextNode(selection, text, ems) {

  const nodeName = selection.property('nodeName'),
    parent = select(selection.node().parentNode),
    lineHeight = ems || 1.6, // ems
    dy = parseFloat(selection.attr('dy')),
    x = parseFloat(selection.attr('x')),
    textAnchor = selection.style('text-anchor');

  const cloned = parent.append(nodeName)
    .attr('dy', `${lineHeight + dy}em`)
    .attr('x', x)
    .style('text-anchor', textAnchor)
    .text(text);

  return cloned;

}

// tick dropping functions

export function dropTicks(selection, opts) {

  const options = opts || {};

  const tolerance = options.tolerance || 0,
    from = options.from || 0,
    to = options.to || selection._groups[0].length;

  for (let j = from; j < to; j++) {

    const c = selection._groups[0][j]; // current selection
    let n = selection._groups[0][j + 1]; // next selection

    if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect) { continue; }

    while ((c.getBoundingClientRect().right + tolerance) > n.getBoundingClientRect().left) {

      if (select(n).data()[0] === selection.data()[to]) {
        select(c).remove();
      } else {
        select(n).remove();
      }

      j++;

      n = selection._groups[0][j + 1];

      if (!n) { break; }

    }

  }

}

export function dropRedundantTicks(selection, ctx) {

  const ticks = selection.selectAll('.tick');

  let prevYear, prevMonth, prevDate, prevHour, prevMinute, dYear, dMonth, dDate, dHour, dMinute;

  ticks.each(function(d) {
    switch (ctx) {
      case 'years':
        dYear = d.getFullYear();
        if (dYear === prevYear) {
          select(this).remove();
        }
        prevYear = dYear;
        break;
      case 'months':
        dYear = d.getFullYear();
        dMonth = d.getMonth();
        if ((dMonth === prevMonth) && (dYear === prevYear)) {
          select(this).remove();
        }
        prevMonth = dMonth;
        prevYear = dYear;
        break;
      case 'weeks':
      case 'days':
        dYear = d.getFullYear();
        dMonth = d.getMonth();
        dDate = d.getDate();

        if ((dDate === prevDate) && (dMonth === prevMonth) && (dYear === prevYear)) {
          select(this).remove();
        }

        prevDate = dDate;
        prevMonth = dMonth;
        prevYear = dYear;
        break;
      case 'hours':
        dDate = d.getDate();
        dHour = d.getHours();
        dMinute = d.getMinutes();

        if ((dDate === prevDate) && (dHour === prevHour) && (dMinute === prevMinute)) {
          select(this).remove();
        }

        prevDate = dDate;
        prevHour = dHour;
        prevMinute = dMinute;
        break;
    }
  });

}

export function dropOversetTicks(axisNode, tickWidth) {

  let axisGroupWidth = axisNode.node().getBBox().width,
    tickArr = axisNode.selectAll('.tick')._groups[0];

  if (tickArr.length) {

    const firstTickOffset = getTranslate(tickArr[0])[0];

    const lastTick = tickArr[tickArr.length - 1];

    if ((axisGroupWidth + firstTickOffset) >= tickWidth) {
      select(lastTick).classed('last-tick-hide', true);
      // axisGroupWidth = axisNode.node().getBBox().width;
      // tickArr = axisNode.selectAll('.tick')._groups[0];
    } else {
      select(lastTick).classed('last-tick-hide', false);
    }

  }

}

export function tickFinderX(domain, period, tickGoal) {

  // set ranges
  const startDate = domain[0],
    endDate = domain[1];

  // set upper and lower bounds for number of steps per tick
  // i.e. if you have four months and set steps to 1, you'll get 4 ticks
  // and if you have six months and set steps to 2, you'll get 3 ticks
  const stepLowerBound = 1,
    stepUpperBound = 12,
    tickCandidates = [];

  let closestArr;

  const intervals = {
    years: timeYears,
    months: timeMonths,
    weeks: timeWeeks,
    days: timeDays,
    hours: timeHours,
    minutes: timeMinutes
  };

  // using the tick bounds, generate multiple arrays-in-objects using
  // different tick steps. push all those generated objects to tickCandidates
  for (let i = stepLowerBound; i <= stepUpperBound; i++) {
    const obj = {};
    obj.interval = i;
    obj.arr = intervals[period](startDate, endDate, i).length;
    tickCandidates.push(obj);
  }

  // reduce to find a best candidate based on the defined tickGoal
  if (tickCandidates.length > 1) {
    closestArr = tickCandidates.reduce((prev, curr) => {
      return (Math.abs(curr.arr - tickGoal) < Math.abs(prev.arr - tickGoal) ? curr : prev);
    });
  } else if (tickCandidates.length === 1) {
    closestArr = tickCandidates[0];
  } else {
    // sigh. we tried.
    closestArr.interval = 1;
  }

  const tickArr = intervals[period](startDate, endDate, closestArr.interval);

  const startDiff = tickArr[0] - startDate,
    tickDiff = tickArr[1] - tickArr[0];

  // if distance from startDate to tickArr[0] is greater than half the
  // distance between tickArr[1] and tickArr[0], add startDate to tickArr

  if (startDiff > (tickDiff / 2)) { tickArr.unshift(startDate); }

  return tickArr;

}

export function tickFinderY(scale, tickSettings) {

  // In a nutshell:
  // Checks if an explicit number of ticks has been declared
  // If not, sets lower and upper bounds for the number of ticks
  // Iterates over those and makes sure that there are tick arrays where
  // the last value in the array matches the domain max value
  // if so, tries to find the tick number closest to tickGoal out of the winners,
  // and returns that arr to the scale for use

  const min = scale.domain()[0],
    max = scale.domain()[1];

  if (tickSettings.ticks !== 'auto') {

    return scale.ticks(tickSettings.ticks);

  } else {

    const tickLowerBound = tickSettings.tickLowerBound,
      tickUpperBound = tickSettings.tickUpperBound,
      tickGoal = tickSettings.tickGoal,
      arr = [],
      tickCandidates = [];

    let closestArr;

    for (let i = tickLowerBound; i <= tickUpperBound; i++) {
      const tickCandidate = scale.ticks(i);

      if (min < 0) {
        if ((tickCandidate[0] === min) && (tickCandidate[tickCandidate.length - 1] === max)) {
          arr.push(tickCandidate);
        }
      } else {
        if (tickCandidate[tickCandidate.length - 1] === max) {
          arr.push(tickCandidate);
        }
      }
    }

    arr.forEach(value => { tickCandidates.push(value.length); });

    if (tickCandidates.length > 1) {
      closestArr = tickCandidates.reduce((prev, curr) => {
        return (Math.abs(curr - tickGoal) < Math.abs(prev - tickGoal) ? curr : prev);
      });
    } else if (tickCandidates.length === 1) {
      closestArr = tickCandidates[0];
    } else {
      closestArr = null;
    }

    return scale.ticks(closestArr);

  }
}


export function ordinalTimeTicks(selection, axisNode, ctx, scale, tolerance) {

  dropRedundantTicks(axisNode, ctx);

  // dropRedundantTicks has modified the selection, so we need to reselect
  // to get a proper idea of what's still available
  const newSelection = axisNode.selectAll('.tick');

  // if the context is 'years', every tick is a majortick so we can
  // just pass on the block below
  if (ctx !== 'years') {

    // array for any 'major ticks', i.e. ticks with a change in context
    // one level up. i.e., a 'months' context set of ticks with a change in the year,
    // or 'days' context ticks with a change in month or year
    const majorTicks = [];

    let prevYear, prevMonth, prevDate, dYear, dMonth, dDate;

    newSelection.each(function(d) {
      const currSel = select(this);
      switch (ctx) {
        case 'months':
          dYear = d.getFullYear();
          if (dYear !== prevYear) { majorTicks.push(currSel); }
          prevYear = d.getFullYear();
          break;
        case 'weeks':
        case 'days':
          dYear = d.getFullYear();
          dMonth = d.getMonth();
          if ((dMonth !== prevMonth) && (dYear !== prevYear)) {
            majorTicks.push(currSel);
          } else if (dMonth !== prevMonth) {
            majorTicks.push(currSel);
          } else if (dYear !== prevYear) {
            majorTicks.push(currSel);
          }
          prevMonth = d.getMonth();
          prevYear = d.getFullYear();
          break;
        case 'hours':
          dDate = d.getDate();
          if (dDate !== prevDate) { majorTicks.push(currSel); }
          prevDate = dDate;
          break;
      }
    });

    if (majorTicks.length > 1) {

      for (let i = 0; i < majorTicks.length + 1; i++) {

        let t0, tn;

        if (i === 0) { // from t0 to m0
          t0 = 0;
          tn = newSelection.data().indexOf(majorTicks[0].data()[0]);
        } else if (i === (majorTicks.length)) { // from mn to tn
          t0 = newSelection.data().indexOf(majorTicks[i - 1].data()[0]);
          tn = newSelection._groups[0].length - 1;
        } else { // from m0 to mn
          t0 = newSelection.data().indexOf(majorTicks[i - 1].data()[0]);
          tn = newSelection.data().indexOf(majorTicks[i].data()[0]);
        }

        if (tn - t0) {
          dropTicks(newSelection, {
            from: t0,
            to: tn,
            tolerance: tolerance
          });
        }

      }

    } else {
      dropTicks(newSelection, { tolerance: tolerance });
    }

  } else {
    dropTicks(newSelection, { tolerance: tolerance });
  }

}

export function axisCleanup(node, obj, xAxisObj, yAxisObj) {

  // this section is kinda gross, sorry:
  // resets ranges and dimensions, redraws yAxis, redraws xAxis
  // …then redraws yAxis again if tick wrapping has changed xAxis height

  axisManager(node, obj, yAxisObj.axis.scale(), 'yAxis');

  const scaleObj = {
    rangeType: 'range',
    range: xAxisObj.range || [0, obj.dimensions.tickWidth()],
    bands: obj.dimensions.bands,
    rangePoints: obj.xAxis.rangePoints
  };

  setRangeArgs(xAxisObj.axis.scale(), scaleObj);

  const prevXAxisHeight = obj.dimensions.xAxisHeight;

  const newXAxisObj = axisManager(node, obj, xAxisObj.axis.scale(), 'xAxis');

  newXAxisObj.node
    .attr('transform', `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()}, ${obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight})`);

  if (obj.xAxis.scale !== 'ordinal') {
    dropOversetTicks(newXAxisObj.node, obj.dimensions.tickWidth());
  }

  if (prevXAxisHeight !== obj.dimensions.xAxisHeight) {
    axisManager(node, obj, yAxisObj.axis.scale(), 'yAxis');
  }

}

export function addZeroLine(obj, node, Axis, axisType) {

  const ticks = Axis.axis.tickValues(),
    tickMin = ticks[0],
    tickMax = ticks[ticks.length - 1];

  if ((tickMin <= 0) && (0 <= tickMax)) {
    const refGroup = Axis.node.selectAll(`.tick:not(.${obj.prefix}minor)`),
      refLine = refGroup.select('line');

    // zero line
    const zeroLine = node.append('line')
      .style('shape-rendering', 'crispEdges')
      .attr('class', `${obj.prefix}zero-line`);

    let transform = [0, 0];

    transform[0] += getTranslate(node.select(`.${obj.prefix + axisType}`).node())[0];
    transform[1] += getTranslate(node.select(`.${obj.prefix + axisType}`).node())[1];
    transform[0] += getTranslate(refGroup.node())[0];
    transform[1] += getTranslate(refGroup.node())[1];

    if (axisType === 'xAxis') {

      zeroLine.attrs({
        'y1': refLine.attr('y1'),
        'y2': refLine.attr('y2'),
        'x1': 0,
        'x2': 0,
        'transform': `translate(${transform[0]},${transform[1]})`
      });

    } else if (axisType === 'yAxis') {

      zeroLine.attrs({
        'x1': refLine.attr('x1'),
        'x2': refLine.attr('x2'),
        'y1': 0,
        'y2': 0,
        'transform': `translate(${transform[0]},${transform[1]})`
      });

    }

  }

}
