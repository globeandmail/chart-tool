import { select, event } from 'd3-selection';
import { brushX, brushY } from 'd3-brush';
import { drag } from 'd3-drag';
import { wrapAnnoText } from '../../utils/utils';
import { isNumeric, roundToPrecision } from '../../helpers/helpers';
import { cursorPos, getTipData } from './tips';

export default function annotation(node, obj, rendered) {

  const annoData = obj.annotations;

  const hasAnnotations = annoData && (
    (annoData.highlight && annoData.highlight.length) ||
    (annoData.text && annoData.text.length) ||
    (annoData.range && annoData.range.length)
  );

  let annoNode, annoEditable;

  if (hasAnnotations) {
    annoNode = select(node.node().parentNode).append('g')
      .attrs({
        'transform': `translate(${obj.dimensions.margin.left},${obj.dimensions.margin.top})`,
        'class': `${obj.prefix}annotations`
      });
  }

  if (annoData.range && annoData.range.length) {
    range(annoNode, obj, rendered);
  }

  if (annoData.highlight && annoData.highlight.length) {
    highlight(annoNode, obj, rendered);
  }

  if (annoData.pointer && annoData.pointer.length) {
    pointer(annoNode, obj, rendered);
  }

  if (annoData.text && annoData.text.length) {
    text(annoNode, obj, rendered);
  }

  if (obj.editable && obj.annotationHandlers && obj.annotationHandlers.type) {
    annoEditable = select(node.node().parentNode)
      .append('g')
      .attrs({
        transform: `translate(${obj.dimensions.margin.left},${obj.dimensions.margin.top})`,
        class: `${obj.prefix}annotation-editable-group`
      });

    if (obj.annotationHandlers.type === 'range') editableRange(annoEditable, obj, rendered);
    if (obj.annotationHandlers.type === 'text') editableText(annoEditable, obj, rendered);
    if (obj.annotationHandlers.type === 'pointer') editablePointer(annoEditable, obj, rendered);

    // still need to handle 'highlight' annotations for scatterplot

  }

  return {
    annoNode,
    annoEditable
  };

}

export function highlight(annoNode, obj, rendered) {

  const h = obj.annotations.highlight;

  if (obj.options.type === 'bar' || obj.options.type === 'column') {
    const ref = rendered.plot[`${obj.options.type}Items`][0];
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

      const currRef = rendered.plot.dotItems
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

export function range(annoNode, obj, rendered) {
  const r = obj.annotations.range;

  r.map((rangeObj, i) => {

    const scale = rendered.plot[`${rangeObj.axis}ScaleObj`].scale,
      scaleType = rendered.plot[`${rangeObj.axis}ScaleObj`].obj.type;

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
      rangeNode = select(rendered.plot.seriesGroup.node().parentNode).insert(type, ':first-child');
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

export function editableRange(annoEditable, obj, rendered) {

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

  const scale = rendered.plot[`${obj.annotationHandlers.rangeAxis}ScaleObj`].scale,
    scaleType = rendered.plot[`${obj.annotationHandlers.rangeAxis}ScaleObj`].obj.type,
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
    .on('drag', function() {
      textDrag(obj, this);
    })
    .on('end', function() {
      textDragEnd(obj, this);
    });

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

  if (position.x > 1) position.x = 1;
  if (position.x < 0) position.x = 0;
  if (position.y > 1) position.y = 1;
  if (position.y < 0) position.y = 0;

  const data = {
    text: node.innerText.trim(),
    position
  };

  if (t && t.textHandler) t.textHandler(data);

}

export function pointer(annoNode, obj, rendered) {

}

export function editablePointer(annoEditable, obj, rendered) {

  const pointerSel = annoEditable
    .append('g')
    .attrs({
      'class': `${obj.prefix}pointer`,
      'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()},0)`,
    });

  const pointerSelRect = pointerSel
    .append('rect')
    .attrs({
      x: 0,
      y: 0,
      width: obj.dimensions.tickWidth(),
      height: obj.dimensions.yAxisHeight()
    });

  const pointerSelHandles = pointerSel
    .selectAll(`.${obj.prefix}pointer-handle`)
    .data(['start', 'end']).enter()
    .append('circle')
    .attrs({
      class: d => `${obj.prefix}pointer-handle ${obj.prefix}pointer-handle_${d}`,
      r: 4,
      cx: 0,
      cy: 0
    });

  // const pointerSelPath = pointerSel
  //   .append('path')
  //   .attrs({
  //     class: `${obj.prefix}pointer-handle-path`,
  //
  //   })

  const dragFn = drag()
    .on('start', () => pointerDragStart(obj, pointerSelHandles))
    .on('drag', () => pointerDrag(obj, pointerSelHandles))
    .on('end', () => pointerDragEnd(obj, pointerSelHandles));

  pointerSelRect.call(dragFn);

  // if (isNumeric(obj.annotationHandlers.textX) && isNumeric(obj.annotationHandlers.textY) && obj.annotationHandlers.textText) {
  //   appendTextInput(obj, this);
  // }

}

export function pointerDragStart(obj, node) {
  node.select(`.${obj.prefix}pointer-handle_start`)
    .attrs({
      cx: event.x,
      cy: event.y,
    });
}

export function pointerDrag(obj, node) {

  const startPointer = node.select(`.${obj.prefix}pointer-handle_start`);

  node.select(`.${obj.prefix}pointer-handle_end`)
    .attrs({
      cx: parseFloat(startPointer.attr('cx')) + event.dx,
      cy: parseFloat(startPointer.attr('cy')) + event.dy,
    });
}

export function pointerDragEnd(obj, node) {
  // node.select(`.${obj.prefix}pointer-handle_end`)
  //   .attrs({
  //     cx: event.x,
  //     cy: event.y,
  //   });
}
