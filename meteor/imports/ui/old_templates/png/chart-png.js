Template.chartPng.rendered = function() {
  var data = Router.current() && Router.current().data();
  if (data) {

    data.exportable = {};

    data.exportable.width = Router.current().params.width;
    data.exportable.height = Router.current().params.height;
    data.exportable.type = "png";
    data.prefix = app_settings.prefix;

    drawChart(".chart-png", data);

    var container = document.getElementsByClassName("ct-chart_svg")[0],
        filename = data.slug + "-web-" + data.exportable.width + "x" + data.exportable.height + ".png";

    saveSvgAsPng(container, filename, {
      scale: Router.current().params.scale || 1
    });

  }
}
