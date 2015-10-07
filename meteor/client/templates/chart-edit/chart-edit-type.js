Template.chartEditType.events({
  'change .chart-types': function(event) {
    var type = event.target.value,
        defaults = app_settings.chart.options;

    // sets type and updates interpolation and stacking settings accordingly
    switch (type) {
      case "line":
        updateAndSave("updateType", this, type );
        updateAndSave("updateInterpolation", this, defaults.interpolation );
        updateAndSave("updateStacked", this, defaults.stacked );
        updateAndSave("updateXScale", this, "time");
        break;
      case "area":
        updateAndSave("updateType", this, type );
        updateAndSave("updateInterpolation", this, defaults.interpolation );
        updateAndSave("updateYMin", this, "");
        updateAndSave("updateXScale", this, "time");
        break;
      case "column":
        updateAndSave("updateType", this, type );
        updateAndSave("updateInterpolation", this, false );
        updateAndSave("updateYMin", this, "");
        updateAndSave("updateXScale", this, "ordinal");
        break;
      case "bar":
        updateAndSave("updateType", this, type );
        updateAndSave("updateInterpolation", this, false );
        updateAndSave("updateYMin", this, "");
        updateAndSave("updateXScale", this, "ordinal");
        break;
      case "pie":
        updateAndSave("updateType", this, type );
        updateAndSave("updateInterpolation", this, false );
        updateAndSave("updateStacked", this, defaults.stacked );
        updateAndSave("updateYMin", this, "");
        updateAndSave("updateXScale", this, false);
        break;
      case "stream":
        updateAndSave("updateType", this, type );
        updateAndSave("updateInterpolation", this, false );
        updateAndSave("updateStacked", this, defaults.stacked );
        updateAndSave("updateXScale", this, "time");
        break;
      default:
        updateAndSave("updateType", this, "line");
        updateAndSave("updateInterpolation", this, false );
        updateAndSave("updateStacked", this, defaults.stacked );
        updateAndSave("resetXAxis", this);
        updateAndSave("resetYAxis", this);
        break;
    }
  }
});


Template.chartEditType.helpers({
  typeSelected: function(val) {
    if (this.options) {
      if (this.options.type === val) { return "selected"; }
    }
  }
});