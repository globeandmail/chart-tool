Template.chartEditPreviewSingle.events({
  "blur .editable-chart_title": function(event) {
    event.preventDefault();
    var input = event.target.innerText;
    var text = removeNbsp(input).trim();
    updateAndSave("updateHed", this.data, text);
  },
  "blur .editable-chart_qualifier": function(event) {
    event.preventDefault();
    var input = event.target.innerText;
    var text = removeNbsp(input).trim();
    updateAndSave("updateQual", this.data, text);
  },
  "click .editable-chart_source": function(event) {
    event.preventDefault();
    var currText = event.target.textContent.trim();
    if (currText === app_settings.chart.source || currText === "") {
      event.target.textContent = app_settings.chart.source + app_settings.source_suffix;
    }
    cursorManager.setEndOfContenteditable(event.target);
  },
  "blur .editable-chart_source": function(event) {
    event.preventDefault();
    var currText = event.target.textContent;
    var text;
    if (currText === app_settings.chart.source + app_settings.source_suffix || currText === "") {
      event.target.textContent = app_settings.chart.source;
      text = app_settings.chart.source
    } else {
      text = removeNbsp(currText).trim();
    }
    updateAndSave("updateSource", this.data, text);
  }
});

Template.chartEditPreviewSingle.rendered = function() {

  this.autorun(function(comp) {

    var dataContext = Template.currentData();

    if (!dataContext) { return; }

    if (dataContext.data) {

      var data = dataContext.data;

      data.editable = true;

      Tracker.afterFlush(function() {
        drawChart('.' + dataContext.type + '-preview-container', data);
      });

    }

  });
}
