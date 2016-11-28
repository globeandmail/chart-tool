import { select } from 'd3-selection';
import 'd3-selection-multi';

export default function base(container, obj) {

  const margin = obj.dimensions.margin;

  const chartBase = select(container)
    .insert('svg', `.${obj.prefix}chart_source`)
    .attrs({
      'class': `${obj.baseClass}_svg ${obj.prefix}${obj.customClass} ${obj.prefix}type_${obj.options.type} ${obj.prefix}series-${obj.data.seriesAmount}`,
      'width': obj.dimensions.computedWidth() + margin.left + margin.right,
      'height': obj.dimensions.computedHeight() + margin.top + margin.bottom,
      'version': 1.1,
      'xmlns': 'http://www.w3.org/2000/svg'
    });

  // background rect
  chartBase
    .append('rect')
    .attrs({
      'class': `${obj.prefix}bg`,
      'x': 0,
      'y': 0,
      'width': obj.dimensions.computedWidth(),
      'height': obj.dimensions.computedHeight(),
      'transform': `translate(${margin.left}, ${margin.top})`
    });

  const graph = chartBase.append('g')
    .attrs({
      'class': `${obj.prefix}graph`,
      'transform': `translate(${margin.left}, ${margin.top})`
    });

  return graph;

}
