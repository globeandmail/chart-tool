import { select } from 'd3-selection';
import { wrapAnnoText } from '../../utils/utils';

export default function annotation(node, obj, rendered) {

  const annoData = obj.annotations;

  if (annoData.highlight && annoData.highlight.length) {
    highlight(node, obj, rendered);
  }

  if (annoData.text && annoData.text.length) {
    text(node, obj, rendered);
  }

  if (annoData.range && annoData.range.length) {
    range(node, obj, rendered);
  }

}

function highlight(node, obj, rendered) {

  const h = obj.annotations.highlight;

  let ref;

  if (obj.options.type === 'bar' || obj.options.type === 'column') {
    ref = rendered.plot[`${obj.options.type}Items`][0];

    if (ref && obj.data.seriesAmount === 1) {
      for (let i = 0; i < h.length; i++) {
        ref
          .filter(d => d.key.toString() === h[i].key)
          .select('rect')
          .style('fill', h[i].color);
      }
    }
  }

  if (obj.options.type === 'scatterplot') {
    ref = rendered.plot.dotItems;

    const svgNode = select(node.node().parentNode);

    const annoNode = svgNode.append('g')
      .attrs({
        'transform': `translate(${obj.dimensions.margin.left},${obj.dimensions.margin.top})`,
        'class': `${obj.prefix}annotations`
      });

    for (let i = 0; i < h.length; i++) {

      const currRef = ref
        .filter(d => d.key.toString() === h[i].key)
        .style('opacity', 1);

      let y = Number(currRef.attr('cy')),
        x = Number(currRef.attr('cx'));

      if (y < 12) {
        y += 12;
      } else {
        y -= 12;
      }

      const textNode = annoNode
        .append('text')
        .text(h[i].text || h[i].key)
        .attrs({
          'class': `${obj.prefix}annotation_text`,
          'x': currRef.attr('cx'),
          'y': y,
          'text-anchor': 'middle',
          'dominant-baseline': 'middle'
        });

      // check horizontal text placement by checking width
      const halfText = textNode.node().getBoundingClientRect().width / 2,
        offset = rendered.plot.xScaleObj.scale.range()[0];

      if ((x - offset) < halfText) {
        textNode
          .attr('text-anchor', 'start')
          .attr('x', x - obj.dimensions.scatterplotRadius);
      } else if ((obj.dimensions.computedWidth() - x) < halfText) {
        textNode
          .attr('text-anchor', 'end')
          .attr('x', x + obj.dimensions.scatterplotRadius);
      }

      if ((h[i].text || h[i].key).indexOf('\n') !== -1) {
        textNode.call(wrapAnnoText);
      }

    }

  }

  // if (obj.options.type === 'bar') {
  //   ref = rendered.plot.barItems[0];
  // } else if (obj.options.type === 'column') {
  //   ref = rendered.plot.columnItems[0];
  // }

}

function text(node, obj, rendered) {

}

function range(node, obj, rendered) {

}
