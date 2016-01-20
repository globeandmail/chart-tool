Template.chartEditPreview.events({
  "blur .editable-chart_title": function(event) {
    var input = event.target.innerText;
    var text = removeNbsp(input).trim();
    updateAndSave("updateHed", this, text);
  },
  "blur .editable-chart_qualifier": function(event) {
    var input = event.target.innerText;
    var text = removeNbsp(input).trim();
    updateAndSave("updateQual", this, text);
  },
  "click .editable-chart_source": function(event) {
    var currText = event.target.textContent.trim();
    if (currText === app_settings.chart.source || currText === "") {
      event.target.textContent = app_settings.chart.source + app_settings.source_suffix;
    }
    cursorManager.setEndOfContenteditable(document.getElementsByClassName('editable-chart_source')[0]);
  },
  "blur .editable-chart_source": function(event) {
    var currText = event.target.textContent;
    if (currText === app_settings.chart.source + app_settings.source_suffix || currText === "") {
      event.target.textContent = app_settings.chart.source;
      updateAndSave("updateSource", this, app_settings.chart.source);
    } else {
      var text = removeNbsp(currText).trim();
      updateAndSave("updateSource", this, text);
    }
  }
});

Template.chartEditPreview.rendered = function() {
  Tracker.autorun(function(comp) {
    var routeName = Router.current().route.getName();

    if (routeName !== "chart.edit") {
      comp.stop();
      return;
    }

    var data = Router.current() && Router.current().data();

    if (data) {
      data.editable = true;
      drawPreviews(data);
    }

  });
}
