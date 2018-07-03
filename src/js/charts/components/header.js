import { select } from 'd3-selection';
import 'd3-selection-multi';

export default function header(container, obj) {

  const headerGroup = select(container)
    .append('div')
    .classed(`${obj.prefix}chart_title ${obj.prefix}${obj.customClass}`, true);

  // hack necessary to ensure PDF fields are sized properly
  if (obj.exportable) {
    headerGroup.style('width', `${obj.exportable.width}px`);
  }

  if ((obj.heading !== '' || obj.editable) && obj.options.head) {
    const headerText = headerGroup
      .append('div')
      .attr('class', `${obj.prefix}chart_title-text`)
      .text(obj.heading);

    if (obj.editable) {
      headerText
        .attr('contentEditable', true)
        .classed('editable-chart_title', true);
    }

  }

  let qualifier;

  if ((obj.qualifier !== '' || obj.editable) && obj.options.qualifier) {
    qualifier = headerGroup
      .append('div')
      .attrs({
        'class': () => {
          let str = `${obj.prefix}chart_qualifier`;
          if (obj.editable) { str += ' editable-chart_qualifier'; }
          return str;
        },
        'contentEditable': () => { return obj.editable ? true : false; }
      })
      .text(obj.qualifier);
  }

  let legend;

  if (obj.data.keys.length > 2) {

    legend = headerGroup.append('div')
      .classed(`${obj.prefix}chart_legend`, true);

    // if (obj.options.type === 'scatterplot') {
    //   // Murat's note:
    //   // For the scatterplot, keys must be replaced with unique categories from 'z' column
    //   // For categories, return unique values from the 'z' column.
    //   const categories = ['0'];
    //   csvParse(obj.data.csv, function(d,i){
    //     const lastColumn = obj.data.data.columns[obj.data.data.columns.length-1];
    //     if(categories.indexOf(d[lastColumn]) === -1){
    //       if(d[lastColumn] !== undefined){categories.push(d[lastColumn]);}
    //     }
    //   });
    //   obj.data.keys = categories;
    // }

    let keys = obj.data.keys.slice();

    // get rid of the first item as it doesnt represent a series
    keys.shift();

    if (obj.options.type === 'multiline') {
      keys = [keys[0], keys[1]];
      legend.classed(`${obj.prefix}chart_legend-${obj.options.type}`, true);
    }

    const legendItem = legend.selectAll(`div.${obj.prefix}legend_item`)
      .data(keys)
      .enter()
      .append('div')
      .attr('class', (d, i) => {
        return `${obj.prefix}legend_item ${obj.prefix}legend_item_${i}`;
      });

    legendItem.append('span')
      .attr('class', `${obj.prefix}legend_item_icon`)
      .text('\u00A0');

    legendItem.append('span')
      .attr('class', `${obj.prefix}legend_item_text`)
      .text(d => d);
  }

  obj.dimensions.headerHeight = headerGroup.node().getBoundingClientRect().height;

  return {
    headerGroup: headerGroup,
    legend: legend,
    qualifier: qualifier
  };

}
