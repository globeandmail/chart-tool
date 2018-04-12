import { select } from 'd3-selection';

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
  let ref;
  if (obj.options.type === 'bar') {
    ref = rendered.plot.barItems[0];
  } else if (obj.options.type === 'column') {
    ref = rendered.plot.columnItems[0];
  }
  if (ref && obj.data.seriesAmount === 1) {
    const h = obj.annotations.highlight;
    for (let i = 0; i < h.length; i++) {
      ref.filter(d => d.key === h[i].key)
        .select('rect')
        .style('fill', h[i].color);
    }
  }
}

function text(node, obj, rendered) {

}

function range(node, obj, rendered) {

}
