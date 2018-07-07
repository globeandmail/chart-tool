import { select } from 'd3-selection';
import { wrapAnnoText } from '../../utils/utils';
import { isNumeric } from '../../helpers/helpers';

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

  if (annoData.highlight && annoData.highlight.length) {
    highlight(annoNode, obj, rendered);
  }

  if (annoData.text && annoData.text.length) {
    text(annoNode, obj, rendered);
  }

  if (annoData.range && annoData.range.length) {
    range(annoNode, obj, rendered);
  }

}

function highlight(annoNode, obj, rendered) {

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

function text(annoNode, obj) {
  const t = obj.annotations.text;
  t.map((textObj, i) => {
    const y = Number(obj.dimensions.computedHeight() * textObj.position.y),
      x = Number(obj.dimensions.computedWidth() * textObj.position.x),
      config = generateTextAnnotationConfig(textObj, annoNode, obj);
    drawTextAnnotation(x, y, i, config, obj);
  });
}

function range(annoNode, obj, rendered) {
  const r = obj.annotations.range;
  r.map((rangeObj, i) => {
    console.log(rendered.plot);
    debugger;
    // const scale = rangeObj.

  });
}

function generateTextAnnotationConfig(d, annoNode, obj) {

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

function drawTextAnnotation(x, y, i, config, obj) {

  const textNode = config.annoNode
    .append('text')
    .text(config.text)
    .attrs({
      'class': () => {
        if (config.key) {
          return `${obj.prefix}annotation_highlight-text ${obj.prefix}annotation_highlight-text-${i}`;
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
