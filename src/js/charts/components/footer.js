function footerComponent(node, obj) {

  var foreignObject = node.append("foreignObject")
    .attr({
     "class": obj.prefix + "fo_bottom",
     "width": "100%"
    });

  var foreignObjectGroup = foreignObject.append("xhtml:div")
    .attr("xmlns", "http://www.w3.org/1999/xhtml");

  var sourceField = foreignObjectGroup.append("div")
    .classed(obj.prefix + "chart_source", true)
    .attr("xmlns", "http://www.w3.org/1999/xhtml")
    .text(obj.source);

  if (obj.editable === true) {
    sourceField.attr("contentEditable", true);
  }

  var fogHeight = foreignObjectGroup.node().getBoundingClientRect().height;

  // set the height attribute of the footer
  foreignObject.attr("height", fogHeight);

  foreignObject.attr("transform", "translate(0," + (obj.dimensions.height() - fogHeight) + ")");

  obj.dimensions.footerHeight = fogHeight;

  return {
    foreignObject: foreignObject,
    foreignObjectGroup: foreignObjectGroup,
    sourceField: sourceField
  };

}

module.exports = footerComponent;