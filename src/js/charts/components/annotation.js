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
    (annoData.range && annoData.range.length)
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

    if ('end' in rangeObj) {
      // need to test with bar chart
      type = 'rect';
      const rangeVals = [scale(start), scale(end)].sort((a, b) => a - b);
      attrs.x = rangeObj.axis === 'x' ? rangeVals[0] : 0;
      attrs.y = rangeObj.axis === 'x' ? 0 : rangeVals[0];
      attrs.width = rangeObj.axis === 'x' ? Math.abs(rangeVals[1] - rangeVals[0]) : obj.dimensions.tickWidth();
      attrs.height = rangeObj.axis === 'x' ? obj.dimensions.yAxisHeight() : Math.abs(rangeVals[1] - rangeVals[0]);
      rangeNode = select(obj.rendered.plot.seriesGroup.node().parentNode).insert(type, ':first-child');
    } else {
      type = 'line';
      attrs.x1 = rangeObj.axis === 'x' ? scale(start) : 0;
      attrs.x2 = rangeObj.axis === 'x' ? scale(start) : obj.dimensions.tickWidth();
      attrs.y1 = rangeObj.axis === 'x' ? 0 : scale(start);
      attrs.y2 = rangeObj.axis === 'x' ? obj.dimensions.yAxisHeight() : scale(start);
      rangeNode = annoNode.append(type);
    }

    rangeNode.attrs(attrs);

    if (rangeObj.color) {
      rangeNode.style('end' in rangeObj ? 'fill' : 'stroke', rangeObj.color);
    }

  });
}

export function editableRange(annoEditable, obj) {

  const hasRangePassedFromInterface =
    (obj.annotationHandlers.rangeType === 'area' && obj.annotationHandlers.rangeStart && obj.annotationHandlers.rangeEnd) ||
    (obj.annotationHandlers.rangeType === 'line' && obj.annotationHandlers.rangeStart);

  const brush = (obj.annotationHandlers.rangeAxis === 'x' ? brushX : brushY)()
    .handleSize(3)
    .extent([
      [0, 0],
      [obj.dimensions.tickWidth(), obj.dimensions.yAxisHeight()]
    ])
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

  const scale = obj.rendered.plot[`${obj.annotationHandlers.rangeAxis}ScaleObj`].scale,
    scaleType = obj.rendered.plot[`${obj.annotationHandlers.rangeAxis}ScaleObj`].obj.type,
    isTime = scaleType === 'time' || scaleType === 'ordinal-time';

  if (hasRangePassedFromInterface) {
    let move;

    const start = obj.annotationHandlers.rangeStart,
      end = obj.annotationHandlers.rangeEnd;

    if (obj.annotationHandlers.rangeType === 'line') {
      move = getBrushFromCenter(obj, scale(isTime ? new Date(start) : Number(start)));
    } else {
      move = [
        scale(isTime ? new Date(start) : Number(start)),
        scale(isTime ? new Date(end) : Number(end))
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

  if (!e.selection || !select(node).classed('inuse') || !event.sourceEvent || event.sourceEvent.type !== 'mouseup') {
    return;
  }

  select(node).classed('inuse', false);

  const r = obj.annotationHandlers,
    axis = r.rangeAxis,
    sel = e.selection,
    yScale = obj.rendered.plot.yScaleObj.scale,
    startVal = r.rangeType === 'line' ? sel[0] + ((sel[1] - sel[0]) / 2) : sel[0],
    endVal = sel[1],
    start = axis === 'x' ? getTipData(obj, { x: startVal }).key : yScale.invert(startVal),
    data = {
      axis,
    };

  if (r.rangeType === 'area') {
    data.start = start;
    data.end = axis === 'x' ? getTipData(obj, { x: endVal }).key : yScale.invert(endVal);
  } else {
    data.start = start;
  }

  if (r && r.rangeHandler) r.rangeHandler(data);

}

export function text(annoNode, obj) {
  const t = obj.annotations.text;
  t.map((textObj, i) => {
    const config = generateTextAnnotationConfig(textObj, annoNode, obj);
    drawTextAnnotation(i, config, obj);
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
      appendTextInput(obj, this);
    });

  if (isNumeric(obj.annotationHandlers.textX) && isNumeric(obj.annotationHandlers.textY) && obj.annotationHandlers.textText) {
    appendTextInput(obj, this);
  }

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

  // TODO
  // make note of 'annotation mode' in chart preview headings
  // make currently selected text/range pink
  // get rid of save button
  // directly click on text to edit / add listeners to text
  // editable-group rect goes behind ct-annotations
  // still need to handle 'highlight' annotations for scatterplot

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

  if (t && t.textHandler) t.textHandler(data);

}

export function pointer(annoNode, obj) {
  const p = obj.annotations.pointer;

  if (p.length) appendMarker(annoNode.node().parentNode, obj);

  p.map((pointerObj, i) => {

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
        'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
        class: `${obj.prefix}pointer-path ${obj.prefix}pointer-path-${i}`,
        'marker-end': `url(#${obj.prefix}arrow)`,
        d: pointerLine()
      });
  });
}

export function editablePointer(annoEditable, obj) {

  const p = obj.annotationHandlers;

  appendMarker(annoEditable.node().parentNode, obj);

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

  pointerSel
    .selectAll(`.${obj.prefix}pointer-handle`)
    .data(['start', 'end']).enter()
    .append('circle')
    .attrs({
      class: d => `${obj.prefix}pointer-handle ${obj.prefix}pointer-handle_${d}`,
      cx: d => d === 'start' ? pointerPositions[0].x : pointerPositions[1].x,
      cy: d => d === 'start' ? pointerPositions[0].y : pointerPositions[1].y,
      r: 2
    });

  pointerSel
    .append('path')
    .datum([pointerPositions[0], midpoint, pointerPositions[1]])
    .attrs({
      class: `${obj.prefix}pointer-handle-path`,
      'marker-end': `url(#${obj.prefix}arrow)`,
      d: pointerLine()
    });

  const dragFn = drag()
    .on('start', () => pointerDragStart(obj, pointerSel))
    .on('drag', () => pointerDrag(obj, pointerSel))
    .on('end', () => pointerDragEnd(obj, pointerSel));

  pointerSelRect.call(dragFn);

}

export function pointerDragStart(obj, node) {
  node
    .selectAll(`.${obj.prefix}pointer-handle`)
    .datum({
      x: Math.max(0, Math.min(obj.dimensions.tickWidth(), event.x)),
      y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), event.y))
    })
    .attrs({
      cx: d => d.x,
      cy: d => d.y
    });
}

export function pointerDrag(obj, node) {

  const p = obj.annotationHandlers;

  node.select(`.${obj.prefix}pointer-handle_end`)
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

export function pointerDragEnd(obj, node) {

  const p = obj.annotationHandlers;

  node.select(`.${obj.prefix}pointer-handle_end`)
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

  node.select(`.${obj.prefix}pointer-handle-path`)
    .datum([data[0], midpoint, data[1]])
    .attr('d', pointerLine());

  if (p && p.pointerHandler) p.pointerHandler(data.map(d => {
    return {
      x: roundToPrecision(d.x / obj.dimensions.tickWidth(), 4),
      y: roundToPrecision(d.y / obj.dimensions.yAxisHeight(), 4)
    };
  }));

}

export function calculateMidpoint(d, pct) {

  const sign = d[1].x > d[0].x ? -1 * Math.sign(pct) : 1 * Math.sign(pct),
    minMid = {
      x: ((d[1].x - d[0].x) / 2) + d[0].x,
      y: ((d[1].y - d[0].y) / 2) + d[0].y
    },
    maxMid = {
      x: minMid.x + (sign * ((d[1].y - d[0].y) / 2)),
      y: minMid.y + (sign * -1 * ((d[1].x - d[0].x) / 2))
    };
  return interpolateObject(minMid, maxMid)(Math.abs(pct));
}

export function pointerLine() {
  return line()
    .curve(curveBasis)
    .x(d => d.x)
    .y(d => d.y);
}

export function appendMarker(node, obj) {
  select(node)
    .insert('defs', ':first-child')
    .append('marker')
    .attrs({
      'id': `${obj.prefix}arrow`,
      'viewBox': '0 0 100 80',
      'refX': 20,
      'refY': 40,
      'markerWidth': 8,
      'markerHeight': 6.4,
      'orient': 'auto'
    })
    .append('path')
    .attr('d', 'M100,40L0 80 23.7 40 0 0 z')
    .attr('class', `${obj.prefix}arrow-head`);
}
