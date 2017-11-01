Template.chartEditType.events({
  'change .chart-types': function(event) {
    var type = event.target.value,
        defaults = app_settings.chart.options;

    // sets type and updates interpolation and stacking settings accordingly
    switch (type) {
      case "line":
        updateObject(this, {
          Type: type,
          Interpolation: defaults.interpolation,
          Stacked: defaults.stacked,
          XScale: "time",
          YScale: "linear",
          XNice: false,
          YNice: true,
          Index: false
        });
        break;
      case "multiline":
        updateObject(this, {
          Type: type,
          Interpolation: defaults.interpolation,
          Stacked: defaults.stacked,
          XScale: "time",
          YScale: "linear",
          XNice: false,
          YNice: true,
          Index: false
        });
        break;
      case "area":
        updateObject(this, {
          Type: type,
          Interpolation: defaults.interpolation,
          YMin: "",
          XScale: "time",
          YScale: "linear",
          XNice: false,
          YNice: true,
          Index: false
        });
        break;
      case "column":
        updateObject(this, {
          Type: type,
          Interpolation: false,
          YMin: "",
          XScale: "ordinal",
          YScale: "linear",
          XNice: false,
          YNice: true,
          Index: false
        });
        break;
      case "bar":
        updateObject(this, {
          Type: type,
          Interpolation: false,
          YMin: "",
          XScale: "linear",
          YScale: "ordinal",
          XNice: false,
          YNice: false,
          Index: false
        });
        break;
      default:
        updateObject(this, {
          Type: "line",
          Interpolation: defaults.interpolation,
          Stacked: defaults.stacked,
          XScale: "time",
          YScale: "linear",
          XNice: false,
          YNice: true,
          Index: false
        });
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
