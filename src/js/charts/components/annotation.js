import { select, event } from 'd3-selection';
import { brushX, brushY } from 'd3-brush';
import { drag } from 'd3-drag';
import { wrapAnnoText } from '../../utils/utils';
import { isNumeric, roundToPrecision } from '../../helpers/helpers';
import { cursorPos, getTipData } from './tips';
import { interpolateObject } from 'd3-interpolate';
import { line, curveBasis } from 'd3-shape';

export default function annotation(node, obj) {

  const annoData = obj.annotations;

  const hasAnnotations = annoData && (
    (annoData.highlight && annoData.highlight.length) ||
    (annoData.text && annoData.text.length) ||
    (annoData.range && annoData.range.length) ||
    (annoData.pointer && annoData.pointer.length)
  );

  let annoNode, annoEditable;

  if (hasAnnotations) {
    annoNode = select(node.node().parentNode)
      .append('g')
      .attrs({
        'transform': `translate(${obj.dimensions.margin.left},${obj.dimensions.margin.top})`,
        'class': `${obj.prefix}annotations`
      });
  }

  if (annoData.range && annoData.range.length) range(annoNode, obj);
  if (annoData.highlight && annoData.highlight.length) highlight(annoNode, obj);
  if (annoData.pointer && annoData.pointer.length) pointer(annoNode, obj);
  if (annoData.text && annoData.text.length) text(annoNode, obj);

  if (obj.editable && obj.annotationHandlers && obj.annotationHandlers.type) {
    annoEditable = select(node.node().parentNode)
      .insert('g', `.${obj.prefix}annotations`)
      .attrs({
        transform: `translate(${obj.dimensions.margin.left},${obj.dimensions.margin.top})`,
        class: `${obj.prefix}annotation-editable-group`
      });

    if (obj.annotationHandlers.type === 'range') editableRange(annoEditable, obj);
    if (obj.annotationHandlers.type === 'text') editableText(annoEditable, obj);
    if (obj.annotationHandlers.type === 'pointer') editablePointer(annoEditable, obj);

  }

  return {
    annoNode,
    annoEditable
  };

}

export function highlight(annoNode, obj) {

  const h = obj.annotations.highlight;

  if (obj.options.type === 'bar' || obj.options.type === 'column') {
    const ref = obj.rendered.plot[`${obj.options.type}Items`][0];
    if (ref && obj.data.seriesAmount === 1) {
      h.map(highlightObj => {
        ref
          .filter(d => d.key.toString() === highlightObj.key)
          .select('rect')
          .style('fill', highlightObj.color);
      });
    }
  }

  if (obj.options.type === 'scatterplot') {
    h.map((highlightObj, i) => {

      const currRef = obj.rendered.plot.dotItems
        .filter(d => d.key.toString() === highlightObj.key)
        .style('opacity', 1);

      const config = generateTextAnnotationConfig(highlightObj, annoNode, obj, {
        x: Number(currRef.attr('cy')),
        y: Number(currRef.attr('cx'))
      });

      // need to revisit x and y stuff here since it's fractional right now for text annos

      drawTextAnnotation(i, config, obj);
    });

  }

}

export function range(annoNode, obj) {
  const r = obj.annotations.range;

  r.map((rangeObj, i) => {
    const handlers = obj.annotationHandlers;
    let skip;
    if (handlers && handlers.type === 'range' && isNumeric(handlers.currId)) {
      skip = handlers.currId;
    }
    if (skip !== i) {
      drawRangeAnnotation(obj, rangeObj, i, annoNode);
    }
  });
}

export function drawRangeAnnotation(obj, rangeObj, i, annoNode) {
  const scale = obj.rendered.plot[`${rangeObj.axis}ScaleObj`].scale,
    scaleType = obj.rendered.plot[`${rangeObj.axis}ScaleObj`].obj.type;

  let start, end;

  if (scaleType === 'linear') {
    start = Number(rangeObj.start);
    if ('end' in rangeObj) end = Number(rangeObj.end);
  } else {
    start = new Date(rangeObj.start);
    if ('end' in rangeObj) end = new Date(rangeObj.end);
  }

  const attrs = {
    'class': () => {
      let output = `${obj.prefix}annotation_range ${obj.prefix}annotation_range-${i}`;
      if ('end' in rangeObj) {
        output += ` ${obj.prefix}annotation_range-rect`;
      } else {
        output += ` ${obj.prefix}annotation_range-line`;
      }
      return output;
    },
    transform: `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`
  };

  let type, rangeNode;

  const isColumnAndX = obj.options.type === 'column' && rangeObj.axis === 'x';

  let offset = isColumnAndX ? obj.rendered.plot.singleColumn : 0;

  if ('end' in rangeObj) {
    type = 'rect';
    const rangeVals = [scale(start), scale(end)].sort((a, b) => a - b);

    // adjust width to account for column width if necessary
    rangeVals[1] = rangeVals[1] + offset;
    attrs.x = rangeObj.axis === 'x' ? rangeVals[0] : 0;
    attrs.y = rangeObj.axis === 'x' ? 0 : rangeVals[0];
    attrs.width = rangeObj.axis === 'x' ? Math.abs(rangeVals[1] - rangeVals[0]) : obj.dimensions.tickWidth();
    attrs.height = rangeObj.axis === 'x' ? obj.dimensions.yAxisHeight() : Math.abs(rangeVals[1] - rangeVals[0]);
    rangeNode = obj.rendered.container.insert(type, ':first-child');
  } else {
    type = 'line';

    // cancels out offsetting for leftmost column)
    const sameStarts = new Date(start).toString() === scale.domain()[0].toString();
    if (isColumnAndX && sameStarts) offset = 0;
    attrs.x1 = rangeObj.axis === 'x' ? scale(start) + offset : 0;
    attrs.x2 = rangeObj.axis === 'x' ? scale(start) + offset : obj.dimensions.tickWidth();
    attrs.y1 = rangeObj.axis === 'x' ? 0 : scale(start);
    attrs.y2 = rangeObj.axis === 'x' ? obj.dimensions.yAxisHeight() : scale(start);
    rangeNode = annoNode.append(type);
  }

  rangeNode.attrs(attrs);

  if (rangeObj.color) {
    rangeNode.style('end' in rangeObj ? 'fill' : 'stroke', rangeObj.color);
  }
}

export function editableRange(annoEditable, obj) {

  const hasRangePassedFromInterface =
    (obj.annotationHandlers.rangeType === 'area' && obj.annotationHandlers.rangeStart && obj.annotationHandlers.rangeEnd) ||
    (obj.annotationHandlers.rangeType === 'line' && obj.annotationHandlers.rangeStart);

  if (obj.rendered.plot[`${obj.annotationHandlers.rangeAxis}ScaleObj`].scale === 'ordinal') {
    return;
  }

  const brush = (obj.annotationHandlers.rangeAxis === 'x' ? brushX : brushY)()
    .handleSize(3)
    .extent([
      [0, 0],
      [obj.dimensions.tickWidth(), obj.dimensions.yAxisHeight()]
    ])
    .on('start', function() {
      select(this).classed('inuse', true);
    })
    .on('brush', function() {
      select(this).classed('inuse', true);
    })
    .on('end', function() {
      brushed(event, obj, this);
    });

  let brushSel = annoEditable
    .append('g')
    .attrs({
      'class': `${obj.prefix}brush ${obj.prefix}brush-${obj.annotationHandlers.rangeType}`,
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
    })
    .call(brush);

  brushSel.selectAll('.selection')
    .on('mousedown touchstart', () => brushSel.classed('brushmove', true));

  const scale = obj.rendered.plot[`${obj.annotationHandlers.rangeAxis}ScaleObj`].scale,
    scaleType = obj.rendered.plot[`${obj.annotationHandlers.rangeAxis}ScaleObj`].obj.type,
    isTime = scaleType === 'time' || scaleType === 'ordinal-time';

  if (hasRangePassedFromInterface) {
    let move;

    const start = obj.annotationHandlers.rangeStart,
      end = obj.annotationHandlers.rangeEnd,
      isColumnAndX = obj.options.type === 'column' && obj.annotationHandlers.rangeAxis === 'x';

    let offset = isColumnAndX ? obj.rendered.plot.singleColumn : 0;

    if (obj.annotationHandlers.rangeType === 'line') {
      const sameStarts = new Date(start).toString() === scale.domain()[0].toString();
      if (isColumnAndX && sameStarts) offset = 0;
      move = getBrushFromCenter(obj, scale(isTime ? new Date(start) : Number(start)) + offset);
    } else {
      move = [
        scale(isTime ? new Date(start) : Number(start)),
        scale(isTime ? new Date(end) : Number(end)) + offset
      ];

    }

    brushSel = brushSel.call(brush.move, move);
  }

  if (obj.annotationHandlers.rangeType === 'line') {
    brushSel
      .selectAll('.overlay')
      .each(d => d.type = 'selection') // Treat overlay interaction as move
      .on('mousedown touchstart', function() {
        brushCentered(this, obj, brush); // Recenter before brushing
      });
  }

}

export function getBrushFromCenter(obj, centerValue) {
  const d = 2, // Use a fixed width when recentering
    axis = obj.annotationHandlers.rangeAxis,
    dim = axis === 'x' ? obj.dimensions.tickWidth() : obj.dimensions.yAxisHeight(),
    d0 = centerValue - d / 2,
    d1 = centerValue + d / 2,
    move = d1 > dim ? [dim - d, dim] : d0 < 0 ? [0, d] : [d0, d1];

  return move;
}

export function brushCentered(node, obj, brush) {
  const axis = obj.annotationHandlers.rangeAxis,
    cursor = cursorPos(select(node))[axis],
    move = getBrushFromCenter(obj, cursor);

  select(node.parentNode).call(brush.move, move);
}

export function brushed(e, obj, node) {

  const r = obj.annotationHandlers;

  // !event.sourceEvent happens when clicking-to-select on a line
  // event.sourceEvent && event.sourceEvent.type !== 'mouseup' happens when releasing after drag on a line or area
  if (!event.sourceEvent) return;
  if (event.sourceEvent && event.sourceEvent.type !== 'mouseup') return;

  let data,
    id = isNumeric(obj.annotationHandlers.currId) ? obj.annotationHandlers.currId : obj.annotations.range.length;

  if (!e.selection || !select(node).classed('inuse')) {
    data = null;
  } else {

    const axis = r.rangeAxis,
      accessor = scaleAccessor(axis, obj),
      sel = e.selection,
      xScale = obj.rendered.plot.xScaleObj.scale,
      startVal = r.rangeType === 'line' ? sel[0] + ((sel[1] - sel[0]) / 2) : sel[0],
      endVal = sel[1];

    let start = accessor(startVal),
      end;

    if (r.rangeType === 'area') {
      // if it's a column, need to nudge it over to cover the end of the column
      const xEndVal = obj.options.type === 'column' ? endVal - obj.rendered.plot.singleColumn : endVal;
      end = accessor(xEndVal);
    }

    if (r.rangeType === 'line') {
      const isFirstValue = start.toString() === xScale.domain()[0].toString();
      // need to nudge start value over if column, except if it's the very first col
      if (!isFirstValue) {
        const xStartVal = obj.options.type === 'column' ? startVal - obj.rendered.plot.singleColumn : startVal;
        start = accessor(xStartVal);
      }
    }

    data = { axis };

    // if has r.rangeStart and target of event was the overlay
    // rect we're creating a new range, so increment id by 1
    if (r.rangeStart && typeof event.sourceEvent.target === 'object') {
      const brushMoving = select(node).classed('brushmove');
      // need to determine if brush is just moving, handle is moving, or it's a new brush
      if (r.rangeType === 'area') {
        const usingHandles = start.toString() === r.rangeStart || end.toString() === r.rangeEnd;
        if (!usingHandles && !brushMoving) id++;
      }

      if (r.rangeType === 'line' && !brushMoving) id++;
    }

    if (r.rangeType === 'area') {
      data.start = start;
      data.end = end;
      if (start === end) data = null;
    } else {
      data.start = start;
    }
  }

  select(node).classed('inuse brushmove', false);

  if (r && r.rangeHandler) r.rangeHandler(data, id);

}

export function scaleAccessor(axis, obj) {

  const scaleObj = obj.rendered.plot[`${axis}ScaleObj`];

  let fn;

  if (scaleObj.obj.type === 'linear') {
    fn = d => scaleObj.scale.invert(d);
  }

  if (scaleObj.obj.type === 'time' || scaleObj.obj.type === 'ordinal-time') {
    fn = d => getTipData(obj, { x: d }).key;
  }

  return fn;
}

export function text(annoNode, obj) {
  const t = obj.annotations.text;
  t.map((textObj, i) => {
    const handlers = obj.annotationHandlers;
    let skip;
    if (handlers && handlers.type === 'text' && isNumeric(handlers.currId)) {
      skip = handlers.currId;
    }
    if (skip !== i) {
      const config = generateTextAnnotationConfig(textObj, annoNode, obj);
      drawTextAnnotation(i, config, obj);
    }
  });
}

export function generateTextAnnotationConfig(d, annoNode, obj, pos) {

  const position = pos || {};

  if (d.position) {
    position.x = d.position.x * obj.dimensions.tickWidth();
    position.y = d.position.y * obj.dimensions.yAxisHeight();
  }

  const config = {
    annoNode: annoNode,
    key: d.key || null,
    text: d.text || d.key,
    offset: {
      x: d.offset && isNumeric(d.offset.x) ? d.offset.x : null,
      y: d.offset && isNumeric(d.offset.y) ? d.offset.y : null,
    },
    position: position || null,
    'text-align': d['text-align'] || 'middle',
    valign: d.valign || 'top',
    color: d.color
  };

  const radius = obj.options.type === 'scatterplot' && d.key ? obj.dimensions.scatterplotRadius : 0;

  switch(config['text-align']) {
    case 'left':
      config['text-align'] = 'start';
      config.offset.x = d.offset && isNumeric(d.offset.x) ? d.offset.x : radius * 2;
      break;
    case 'middle':
      config['text-align'] = 'middle';
      break;
    case 'right':
      config['text-align'] = 'end';
      config.offset.x = d.offset && isNumeric(d.offset.x) ? d.offset.x : radius * -2;
      break;
  }

  switch(config.valign) {
    case 'top':
      config.valign = 'hanging';
      config.offset.y = d.offset && isNumeric(d.offset.y) ? d.offset.y : radius * 2;
      break;
    case 'middle':
      config.valign = 'central';
      break;
    case 'bottom':
      config.valign = 'baseline';
      config.offset.y = d.offset && isNumeric(d.offset.y) ? d.offset.y : radius * -2;
      break;
  }

  return config;

}

export function drawTextAnnotation(i, config, obj) {

  const textNode = config.annoNode
    .append('text')
    .text(config.text)
    .attrs({
      'class': () => {
        if (config.key) {
          return `${obj.prefix}annotation_highlight-text ${obj.prefix}annotation_highlight-text-${i} `;
        } else {
          return `${obj.prefix}annotation_text ${obj.prefix}annotation_text-${i}`;
        }
      },
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
      'x': config.position.x + (config.offset.x || 0),
      'y': config.position.y + (config.offset.y || 0),
      'text-anchor': config['text-align'],
      'dominant-baseline': config.valign
    });

  if (config.key) textNode.attr('data-key', config.key);
  if (config.color) textNode.style('fill', config.color);

  let lines = 1;

  // wrap text as needed
  if ((config.text).indexOf('\n') !== -1) {
    textNode.call(wrapAnnoText);
    lines = config.text.split(/\r\n|\r|\n/).length;
  }

  const textMeasurement = textNode.node().getBoundingClientRect();

  const tspanHeight = textMeasurement.height / lines;

  if (lines > 1) {
    if (config.valign === 'central') {
      textNode.attr('y', Number(textNode.attr('y')) - (textMeasurement.height - tspanHeight) / 2);
    }
    if (config.valign === 'baseline') {
      textNode.attr('y', Number(textNode.attr('y')) + tspanHeight - textMeasurement.height);
    }
  }

  // y bounds positioning

  if (Number(textNode.attr('y')) < 0) {
    textNode.attr('y', 0);
  }

  if (Number(textNode.attr('y')) > obj.dimensions.computedHeight() - textMeasurement.height) {
    textNode.attr('y', obj.dimensions.computedHeight() - textMeasurement.height);
  }

  // x bounds positioning

  if (config['text-align'] === 'start') {
    if (textNode.attr('x') > obj.dimensions.computedWidth() - textMeasurement.width) {
      textNode.attr('x', obj.dimensions.computedWidth() - textMeasurement.width);
      textNode.selectAll('tspan').attr('x', obj.dimensions.computedWidth() - textMeasurement.width);
    }
  }

  if (config['text-align'] === 'middle') {
    // clipped on left
    if (Number(textNode.attr('x')) < textMeasurement.width / 2) {
      textNode.attr('x', textMeasurement.width / 2);
      textNode.selectAll('tspan').attr('x', textMeasurement.width / 2);
    }
    // clipped on right
    if (Number(textNode.attr('x')) > obj.dimensions.computedWidth() - (textMeasurement.width / 2)) {
      textNode.attr('x', obj.dimensions.computedWidth() - (textMeasurement.width / 2));
      textNode.selectAll('tspan').attr('x', obj.dimensions.computedWidth() - (textMeasurement.width / 2));
    }
  }

  if (config['text-align'] === 'end') {
    if (textNode.attr('x') < textMeasurement.width) {
      textNode.attr('x', textMeasurement.width);
      textNode.selectAll('tspan').attr('x', textMeasurement.width);
    }
  }
}

export function editableText(annoEditable, obj) {

  const textSel = annoEditable
    .append('g')
    .attrs({
      'class': `${obj.prefix}text`,
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
    });

  const hasText = isNumeric(obj.annotationHandlers.textX) && isNumeric(obj.annotationHandlers.textY) && obj.annotationHandlers.textText;

  textSel
    .append('rect')
    .attrs({
      class: `${obj.prefix}text-rect`,
      x: 0,
      y: 0,
      width: obj.dimensions.tickWidth(),
      height: obj.dimensions.yAxisHeight()
    })
    .on('click', function() {
      if (hasText && obj.annotationHandlers.textHandler) {
        obj.annotationHandlers.textHandler(null);
      } else {
        appendTextInput(obj, this);
      }
    });

  if (hasText) appendTextInput(obj, this);

}

export function appendTextInput(obj, node) {

  const dragFn = drag()
    .on('drag', function() { textDrag(obj, this); })
    .on('end', function() { textDragEnd(obj, this); });

  const position = { x: 0, y: 0 };

  if (isNumeric(obj.annotationHandlers.textX) && isNumeric(obj.annotationHandlers.textY)) {
    position.x = Number(obj.annotationHandlers.textX) * obj.dimensions.tickWidth();
    position.y = Number(obj.annotationHandlers.textY) * obj.dimensions.yAxisHeight();
  } else {
    const cursor = cursorPos(select(node));
    position.x = cursor.x;
    position.y = cursor.y;
  }

  const parentContainer = select(obj.rendered.container.node().parentNode.parentNode);

  let htmlContainer = parentContainer.select(`.${obj.prefix}annotation-text-input`);

  if (!htmlContainer.node()) {
    htmlContainer = parentContainer
      .insert('div', `.${obj.prefix}chart_source`)
      .attr('class', `${obj.prefix}annotation-text-input`);
  }

  htmlContainer
    .styles({
      top: `${obj.dimensions.headerHeight + obj.dimensions.margin.top}px`,
      left: `${obj.dimensions.computedWidth() - obj.dimensions.tickWidth() + obj.dimensions.margin.left}px`,
      width: `${obj.dimensions.tickWidth()}px`,
      height: `${obj.dimensions.yAxisHeight()}px`
    });

  let editableTextBox = htmlContainer.select(`.${obj.prefix}annotation-text-edit-box`);

  if (!editableTextBox.node()) {
    editableTextBox = htmlContainer
      .append('div')
      .attr('class', `${obj.prefix}annotation-text-edit-box`);
  }

  editableTextBox
    .styles(setTextPosition(obj, position))
    .call(dragFn);

  let editableText = editableTextBox.select(`.${obj.prefix}annotation-text-edit`);

  if (!editableText.node()) {
    editableText = editableTextBox
      .append('p')
      .attr('class', `${obj.prefix}annotation-text-edit`);
  }

  editableText
    .attr('contentEditable', true)
    .on('focusout', function() {
      textDragEnd(obj, this.parentNode);
      if (!this.innerText) htmlContainer.remove();
    })
    .on('click', setEditableTextCaret);

  if (obj.annotationHandlers.textText) {
    editableText.node().innerText = obj.annotationHandlers.textText;
  } else{
    editableText.each(setEditableTextCaret);
  }

}

export function setTextPosition(obj, position) {

  const styles = {},
    origin = { x: '0%', y: '0%' },
    translate = { x: '0px', y: '0px' };

  switch (obj.annotationHandlers['text-align']) {
    case 'left':
      styles[obj.annotationHandlers['text-align']] = `${position.x}px`;
      styles['text-align'] = obj.annotationHandlers['text-align'];
      break;
    case 'middle':
      styles.left = `${position.x}px`;
      origin.x = '50%';
      translate.x = '-50%';
      styles['text-align'] = 'center';
      break;
    case 'right':
      styles[obj.annotationHandlers['text-align']] = `${obj.dimensions.tickWidth() - position.x}px`;
      styles['text-align'] = obj.annotationHandlers['text-align'];
      break;
  }

  switch (obj.annotationHandlers.valign) {
    case 'top':
      styles[obj.annotationHandlers.valign] = `${position.y}px`;
      break;
    case 'middle':
      styles.top = `${position.y}px`;
      origin.y = '50%';
      translate.y = '-50%';
      break;
    case 'bottom':
      styles[obj.annotationHandlers.valign] = `${obj.dimensions.yAxisHeight() - position.y}px`;
      break;
  }

  styles['transform-origin'] = `${origin.x} ${origin.y}`;
  styles.transform = `translate(${translate.x},${translate.y})`;

  return styles;
}

export function setEditableTextCaret() {
  if (event && event.defaultPrevented) return;
  const range = document.createRange();
  range.selectNodeContents(this);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

export function textDrag(obj, node) {

  const styles = {};

  switch (obj.annotationHandlers['text-align']) {
    case 'left':
    case 'middle':
      styles.left = `${parseFloat(node.style.left) + event.dx}px`;
      break;
    case 'right':
      styles.right = `${parseFloat(node.style.right) - event.dx}px`;
      break;
  }

  switch (obj.annotationHandlers.valign) {
    case 'top':
    case 'middle':
      styles.top = `${parseFloat(node.style.top) + event.dy}px`;
      break;
    case 'bottom':
      styles.bottom = `${parseFloat(node.style.bottom) - event.dy}px`;
      break;
  }

  select(node).styles(styles);
}

export function textDragEnd(obj, node) {

  if (!node.innerText) return;

  const t = obj.annotationHandlers,
    position = {
      x: null,
      y: null
    };

  switch (t['text-align']) {
    case 'left':
      position.x = parseFloat(node.style[t['text-align']]);
      break;
    case 'middle':
      position.x = parseFloat(node.style.left);
      break;
    case 'right':
      position.x = obj.dimensions.tickWidth() - parseFloat(node.style[t['text-align']]);
      break;
  }

  switch (t.valign) {
    case 'top':
      position.y = parseFloat(node.style[t.valign]);
      break;
    case 'middle':
      position.y = parseFloat(node.style.top);
      break;
    case 'bottom':
      position.y = obj.dimensions.yAxisHeight() - parseFloat(node.style[t.valign]);
      break;
  }

  position.x = roundToPrecision(position.x / obj.dimensions.tickWidth(), 4);
  position.y = roundToPrecision(position.y / obj.dimensions.yAxisHeight(), 4);

  position.x = Math.max(0, Math.min(1, position.x));
  position.y = Math.max(0, Math.min(1, position.y));

  const data = {
    text: node.innerText.trim(),
    position
  };

  // id either already exists for a previously-generated text item (via obj.annotationHandlers.currId) OR it's brand new

  const id = isNumeric(obj.annotationHandlers.currId) ? obj.annotationHandlers.currId : obj.annotations.text.length;

  if (t && t.textHandler) t.textHandler(data, id);

}

export function pointer(annoNode, obj) {
  const p = obj.annotations.pointer;

  if (p.length) appendMarker(annoNode.node().parentNode, obj);

  p.map((pointerObj, i) => {
    const handlers = obj.annotationHandlers;
    let skip;
    if (handlers && handlers.type === 'pointer' && isNumeric(handlers.currId)) {
      skip = handlers.currId;
    }
    if (skip !== i) {
      const data = pointerObj.position.map(d => {
        return {
          x: Math.max(0, Math.min(obj.dimensions.tickWidth(), d.x * obj.dimensions.tickWidth())),
          y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), d.y * obj.dimensions.yAxisHeight()))
        };
      });

      const midpoint = calculateMidpoint(data, parseFloat(pointerObj.curve));

      annoNode
        .append('path')
        .datum([data[0], midpoint, data[1]])
        .attrs({
          transform: `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
          class: `${obj.prefix}pointer-path ${obj.prefix}pointer-path-${i}`,
          'marker-end': `url(#${obj.prefix}arrow)`,
          d: pointerLine()
        });
    }
  });
}

export function editablePointer(annoEditable, obj) {

  const p = obj.annotationHandlers;

  appendMarker(annoEditable.node().parentNode, obj, true);

  const dragFn = drag()
    .on('start', function() { pointerDragStart(obj, pointerSel, this); })
    .on('drag', function() { pointerDrag(obj, pointerSel, this); })
    .on('end', function() { pointerDragEnd(obj, pointerSel, this); });

  const pointerSel = annoEditable
    .append('g')
    .attrs({
      'class': `${obj.prefix}pointer`,
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
    });

  const pointerPositions = [{
    x: isNumeric(p.pointerX1) ? Number(p.pointerX1) : 0,
    y: isNumeric(p.pointerY1) ? Number(p.pointerY1) : 0
  }, {
    x: isNumeric(p.pointerX2) ? Number(p.pointerX2) : 0,
    y: isNumeric(p.pointerY2) ? Number(p.pointerY2) : 0
  }].map(d => {
    return {
      x: Math.max(0, Math.min(obj.dimensions.tickWidth(), d.x * obj.dimensions.tickWidth())),
      y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), d.y * obj.dimensions.yAxisHeight()))
    };
  });

  const midpoint = calculateMidpoint(pointerPositions, Number(p.pointerCurve));

  const pointerSelRect = pointerSel
    .append('rect')
    .attrs({
      x: 0,
      y: 0,
      width: obj.dimensions.tickWidth(),
      height: obj.dimensions.yAxisHeight()
    });

  const pointerHasData = pointerPositions[0].x || pointerPositions[0].y || pointerPositions[1].x || pointerPositions[1].y;

  pointerSel
    .append('path')
    .datum([pointerPositions[0], midpoint, pointerPositions[1]])
    .attrs({
      class: `${obj.prefix}pointer-handle-path`,
      'marker-end': `url(#${obj.prefix}arrow-editable)`,
      d: pointerHasData ? pointerLine() : null
    });

  pointerSel
    .selectAll(`.${obj.prefix}pointer-handle`)
    .data(pointerPositions).enter()
    .append('circle')
    .attrs({
      class: (d, i) => `${obj.prefix}pointer-handle ${obj.prefix}pointer-handle_${i === 0 ? 'start' : 'end'}`,
      cx: d => d.x,
      cy: d => d.y,
      r: 2.5
    })
    .style('opacity', (d, i) => i === 0 && pointerHasData ? 1 : 0)
    .call(dragFn);

  pointerSelRect.call(dragFn);

}

export function pointerDragStart(obj, node, currNode) {

  node.style('opacity', null);

  let selection;

  if (select(currNode).classed(`${obj.prefix}pointer-handle`)) {
    selection = select(currNode);
  } else {
    selection = node.selectAll(`.${obj.prefix}pointer-handle`);
  }

  selection
    .style('opacity', null)
    .datum({
      x: Math.max(0, Math.min(obj.dimensions.tickWidth(), event.x)),
      y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), event.y))
    })
    .attrs({
      cx: d => d.x,
      cy: d => d.y
    });
}

export function pointerDrag(obj, node, currNode) {

  const p = obj.annotationHandlers;

  let selection;

  if (select(currNode).classed(`${obj.prefix}pointer-handle`)) {
    selection = select(currNode);
  } else {
    selection = node.select(`.${obj.prefix}pointer-handle_end`);
  }

  selection
    .datum(function() {
      const x = parseFloat(select(this).attr('cx')) + event.dx,
        y = parseFloat(select(this).attr('cy')) + event.dy;
      return {
        x: Math.max(0, Math.min(obj.dimensions.tickWidth(), x)),
        y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), y))
      };
    })
    .attrs({
      cx: d => d.x,
      cy: d => d.y
    });

  const data = node.selectAll(`.${obj.prefix}pointer-handle`).data(),
    midpoint = calculateMidpoint(data, Number(p.pointerCurve));

  node.select(`.${obj.prefix}pointer-handle-path`)
    .datum([data[0], midpoint, data[1]])
    .attr('d', pointerLine());
}

export function pointerDragEnd(obj, node, currNode) {

  const p = obj.annotationHandlers;

  let selection;

  if (select(currNode).classed(`${obj.prefix}pointer-handle`)) {
    selection = select(currNode);
  } else {
    selection = node.select(`.${obj.prefix}pointer-handle_end`);
  }

  selection
    .datum({
      x: Math.max(0, Math.min(obj.dimensions.tickWidth(), event.x)),
      y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), event.y))
    })
    .attrs({
      cx: d => d.x,
      cy: d => d.y
    });

  const data = node.selectAll(`.${obj.prefix}pointer-handle`).data(),
    midpoint = calculateMidpoint(data, Number(p.pointerCurve));

  const path = node.select(`.${obj.prefix}pointer-handle-path`)
    .datum([data[0], midpoint, data[1]])
    .attr('d', pointerLine());

  let id;

  if (currNode.nodeName === 'rect') {
    // then it's a new pointer
    id = obj.annotations.pointer.length;
  } else {
    id = isNumeric(obj.annotationHandlers.currId) ? obj.annotationHandlers.currId : obj.annotations.pointer.length;
  }

  const pathLength = path.node().getTotalLength();

  // path needs to be at least 5px long, or it resets
  const pointerData = pathLength < 5 ? null : data.map(d => ({
    x: roundToPrecision(d.x / obj.dimensions.tickWidth(), 4),
    y: roundToPrecision(d.y / obj.dimensions.yAxisHeight(), 4)
  }));

  if (pointerData === null) node.style('opacity', pointerData === null ? 0 : 1);

  if (p && p.pointerHandler) p.pointerHandler(pointerData, id);

}

export function calculateMidpoint(d, pct) {

  const sign = d[1].x > d[0].x ? -1 * Math.sign(pct) : 1 * Math.sign(pct),
    // plots a point at the center of a line between start and end points
    minMid = {
      x: ((d[1].x - d[0].x) / 2) + d[0].x,
      y: ((d[1].y - d[0].y) / 2) + d[0].y
    },
    // plots a point at the 90deg point (i.e. an isoceles right triangle) between start and end points
    maxMid = {
      x: minMid.x + (sign * ((d[1].y - d[0].y) / 2)),
      y: minMid.y + (sign * -1 * ((d[1].x - d[0].x) / 2))
    };

  // interpolate between two positions
  return interpolateObject(minMid, maxMid)(Math.abs(pct));
}

export function pointerLine() {
  return line()
    .curve(curveBasis)
    .x(d => d.x)
    .y(d => d.y);
}

export function appendMarker(node, obj, editActive) {
  select(node)
    .insert('defs', ':first-child')
    .append('marker')
    .attrs({
      id: `${obj.prefix}arrow${editActive ? '-editable' : ''}`,
      viewBox: '0 0 100 80',
      refX: 20,
      refY: 40,
      markerWidth: 8,
      markerHeight: 6.4,
      orient: 'auto'
    })
    .append('path')
    .attr('d', 'M100,40L0 80 23.7 40 0 0 z')
    .attr('class', `${obj.prefix}arrow-head`);
}
