Template.chartPdf.rendered = function() {
  var data = Router.current() && Router.current().data();
  if (data) {

    var magicW = app_settings.print.magic.width,
        magicH = app_settings.print.magic.height,
        width = determineWidth(data.print.columns) * magicW, // in px
        height = determineHeight(data.print.lines, width) * magicH; // in px

    data.exportable = {};
    data.exportable.width = width;
    data.exportable.height = height;
    data.exportable.x_axis = app_settings.print.x_axis;
    data.exportable.y_axis = app_settings.print.y_axis;
    data.exportable.type = "pdf";
    data.prefix = prefix;

    drawChart(".chart-pdf", data);

  }
}
