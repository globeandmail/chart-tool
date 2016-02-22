Template.chartShow.rendered = function() {
  Tracker.autorun(function(comp) {
    var routeName = Router.current().route.getName();

    if (routeName !== "chart.show") {
      comp.stop();
      return;
    }

    var data = Router.current() && Router.current().data();

    if (data) {
      drawChart(".chart-show_preview", data);
    }

  });
}
