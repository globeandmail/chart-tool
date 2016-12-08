import 'd3-selection-multi';

export default function qualifier(node, obj) {

  let qualifierBg, qualifierText;

  if (obj.options.type !== 'bar') {

    const yAxisNode = node.select(`.${obj.prefix}yAxis`);

    if (obj.editable) {

      const foreignObject = yAxisNode.append('foreignObject')
        .attrs({
          'class': `${obj.prefix}fo ${obj.prefix}qualifier`,
          'width': '100%'
        });

      const foreignObjectGroup = foreignObject.append('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml');

      const qualifierField = foreignObjectGroup.append('div')
        .attrs({
          'class': `${obj.prefix}chart_qualifier editable-chart_qualifier`,
          'contentEditable': true,
          'xmlns': 'http://www.w3.org/1999/xhtml'
        })
        .text(obj.qualifier);

      foreignObject
        .attrs({
          'width': qualifierField.node().getBoundingClientRect().width + 15,
          'height': qualifierField.node().getBoundingClientRect().height,
          'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()}, ${- (qualifierField.node().getBoundingClientRect().height) / 2})`
        });

    } else {

      qualifierBg = yAxisNode.append('text')
        .attr('class', `${obj.prefix}chart_qualifier-text-bg`)
        .text(obj.qualifier)
        .attrs({
          'dy': '0.32em',
          'y': '0',
          'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()}, 0)`
        });

      qualifierText = yAxisNode.append('text')
        .attr('class', `${obj.prefix}chart_qualifier-text`)
        .text(obj.qualifier)
        .attrs({
          'dy': '0.32em',
          'y': '0',
          'transform': `translate(${obj.dimensions.computedWidth() - obj.dimensions.tickWidth()}, 0)`
        });

    }

  }

  return {
    qualifierBg: qualifierBg,
    qualifierText: qualifierText
  };

}
