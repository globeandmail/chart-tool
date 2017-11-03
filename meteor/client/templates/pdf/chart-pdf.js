Template.chartPdf.rendered = function() {
  var data = Router.current() && Router.current().data();
  if (data) {

    var width, height;

    var magicW = app_settings.print.magic.width,
        magicH = app_settings.print.magic.height;

    if (data.print.mode === 'millimetres') {
      width = data.print.width * magicW;
      height = data.print.height * magicH;
    } else {
      width = determineWidth(data.print.columns) * magicW;
      height = determineHeight(data.print.lines, width) * magicH;
    }

    data.exportable = {
      width: width,
      height: height,
      dynamicHeight: true,
      x_axis: app_settings.print.x_axis,
      y_axis: app_settings.print.y_axis,
      margin: app_settings.print.margin,
      type: "pdf",
      barLabelOffset: app_settings.print.barLabelOffset
    };

    data.prefix = prefix;

    var chartObj = {};
    chartObj.id = data._id;
    chartObj.data = embed(data);
    ChartTool.create(".chart-pdf", chartObj);

  }
}
