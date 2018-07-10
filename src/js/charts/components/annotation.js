import { select, event } from 'd3-selection';
import { brushX, brushY } from 'd3-brush';
import { wrapAnnoText } from '../../utils/utils';
import { isNumeric } from '../../helpers/helpers';
import { getTipData } from './tips';

export default function annotation(node, obj, rendered) {

  const annoData = obj.annotations;

  const hasAnnotations = annoData && (
    (annoData.highlight && annoData.highlight.length) ||
    (annoData.text && annoData.text.length) ||
    (annoData.range && annoData.range.length)
  );

  let annoNode;

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

  if (annoData.text && annoData.text.length) {
    text(annoNode, obj, rendered);
  }

  if (obj.editable) {
    const annoEditable = select(node.node().parentNode)
      .append('g')
      .attrs({
        transform: `translate(${obj.dimensions.margin.left},${obj.dimensions.margin.top})`,
        class: `${obj.prefix}annotation-editable-group`
      });

    if (obj.annotationHandlers && obj.annotationHandlers.type && obj.annotationHandlers.type === 'range') {

      const axis = obj.annotationHandlers.rangeAxis,
        brush = getBrush(axis, obj);

      annoEditable
        .append('g')
        .attr('class', `${obj.prefix}brush`)
        .call(brush);

      // if (obj.annotationHandlers.rangeType === 'area') {
      //   brushes
      //     .call(getBrush(axis, obj));
      // }

      // if (obj.annotationHandlers.rangeType === 'line') {
      //   brushes.call(getBrush(axis, obj));
        // const d = drag()
        //   .on('start drag end', () => {
        //     getBrush(axis, obj);
        //   });
        //
        //   // x1: axis === 'x' ? scale(rangeObj.start) : 0;
        //   // x2: axis === 'x' ? scale(rangeObj.start) : obj.dimensions.tickWidth();
        //   // y1: axis === 'x' ? 0 : scale(rangeObj.start);
        //   // y2: axis === 'x' ? obj.dimensions.yAxisHeight() : scale(rangeObj.start);
        //
        // brushes
        //   .append('line')
        //   .attrs({
        //     class: 'handle',
        //     // x1,
        //     // x2,
        //     // x3,
        //     // x4
        //   })
        //   .on('mousedown', function(event) {
        //     debugger;
        //     // const mouse = event.sourceEvent.layerX
        //     select(this)
        //       .attrs({
        //
        //       })
        //   })
        //   .call(d);

      // }
    }
  }

  return {
    annoNode
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

      const y = Number(currRef.attr('cy')),
        x = Number(currRef.attr('cx')),
        config = generateTextAnnotationConfig(highlightObj, annoNode, obj);

      drawTextAnnotation(x, y, i, config, obj);
    });

  }

}

export function text(annoNode, obj) {
  const t = obj.annotations.text;
  t.map((textObj, i) => {
    const y = Number(obj.dimensions.computedHeight() * textObj.position.y),
      x = Number(obj.dimensions.computedWidth() * textObj.position.x),
      config = generateTextAnnotationConfig(textObj, annoNode, obj);
    drawTextAnnotation(x, y, i, config, obj);
  });
}

export function range(annoNode, obj, rendered) {
  const r = obj.annotations.range;

  r.map((rangeObj, i) => {
    const scale = rendered.plot[`${rangeObj.type}ScaleObj`].scale;

    if (obj.data.inputDateFormat) {
      rangeObj.start = new Date(rangeObj.start);
      if ('end' in rangeObj) rangeObj.end = new Date(rangeObj.end);
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
      const rangeVals = [scale(rangeObj.start), scale(rangeObj.end)].sort((a, b) => a - b);
      attrs.x = rangeObj.type === 'x' ? rangeVals[0] : 0;
      attrs.y = rangeObj.type === 'x' ? 0 : rangeVals[0];
      attrs.width = rangeObj.type === 'x' ? Math.abs(rangeVals[1] - rangeVals[0]) : obj.dimensions.tickWidth();
      attrs.height = rangeObj.type === 'x' ? obj.dimensions.yAxisHeight() : Math.abs(rangeVals[1] - rangeVals[0]);
      rangeNode = select(rendered.plot.seriesGroup.node().parentNode).insert(type, ':first-child');
    } else {
      type = 'line';
      attrs.x1 = rangeObj.type === 'x' ? scale(rangeObj.start) : 0;
      attrs.x2 = rangeObj.type === 'x' ? scale(rangeObj.start) : obj.dimensions.tickWidth();
      attrs.y1 = rangeObj.type === 'x' ? 0 : scale(rangeObj.start);
      attrs.y2 = rangeObj.type === 'x' ? obj.dimensions.yAxisHeight() : scale(rangeObj.start);
      rangeNode = annoNode.append(type);
    }

    rangeNode.attrs(attrs);

    if (rangeObj.color) {
      rangeNode.style('end' in rangeObj ? 'fill' : 'stroke', rangeObj.color);
    }

  });
}

export function generateTextAnnotationConfig(d, annoNode, obj) {

  const config = {
    annoNode: annoNode,
    key: d.key || null,
    text: d.text || d.key,
    offset: {
      x: d.offset && isNumeric(d.offset.x) ? d.offset.x : null,
      y: d.offset && isNumeric(d.offset.y) ? d.offset.y : null,
    },
    position: d.position || null,
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

export function drawTextAnnotation(x, y, i, config, obj) {

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
      'x': x + (config.offset.x || 0),
      'y': y + (config.offset.y || 0),
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

export function getBrush(type, obj) {

  const extent = [
    [obj.dimensions.computedWidth() - obj.dimensions.tickWidth(), 0],
    [obj.dimensions.computedWidth(), obj.dimensions.yAxisHeight()]
  ];

  if (type === 'x') {
    return brushX()
      .handleSize(2)
      .extent(extent)
      .on('end', () => {
        if (obj.annotationHandlers && obj.annotationHandlers.rangeHandler) {
          if (!event.selection) {
            // it's a line
            debugger;
            obj.annotationHandlers.rangeHandler({
              type,
              start: getTipData(obj, { x: event.sourceEvent.layerX - (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) }).key,
            });
          } else {
            // it's a range
            obj.annotationHandlers.rangeHandler({
              type,
              start: getTipData(obj, { x: event.selection[0] }).key,
              end: getTipData(obj, { x: event.selection[1] }).key,
            });
          }
        }
      });
  }

  if (type === 'y') {
    return brushY()
      .handleSize(2)
      .extent(extent)
      .on('end', () => {
        if (obj.annotationHandlers && obj.annotationHandlers.rangeHandler) {
          if (!event.selection) {
            // it's a line
            debugger;
            obj.annotationHandlers.rangeHandler({
              type,
              start: obj.rendered.plot.yScaleObj.scale.invert(event.sourceEvent.layerX - (obj.dimensions.computedWidth() - obj.dimensions.tickWidth())),
            });
          } else {
            // it's a range
            obj.annotationHandlers.rangeHandler({
              type,
              start: obj.rendered.plot.yScaleObj.scale.invert(event.selection[0]),
              end: obj.rendered.plot.yScaleObj.scale.invert(event.selection[1])
            });
          }
        }
      });
  }
}
