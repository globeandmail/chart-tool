Template.chartPdf.rendered = function() {
  var data = Router.current() && Router.current().data();
  if (data) {

    var magicW = app_settings.print.magic.width,
        magicH = app_settings.print.magic.height,
        width = determineWidth(data.print.columns) * magicW, // in px
        height = determineHeight(data.print.lines, width) * magicH; // in px

    data.exportable = {
      width: width,
      height: height,
      dynamicHeight: true,
      x_axis: app_settings.print.x_axis,
      y_axis: app_settings.print.y_axis,
      type: "pdf"
    };

    data.prefix = prefix;

    var chartObj = {};
    chartObj.id = data._id;
    chartObj.data = embed(data);
    ChartTool.create(".chart-pdf", chartObj);

  }
}
