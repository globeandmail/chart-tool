Template.chartEditPreview.helpers({
  data: function() {
    if (this && this._id) {
      return this;
    }
  }
});

Template.chartEditPreview.rendered = function() {
  this.autorun(function(comp) {
    var routeName = Router.current().route.getName();
    if (routeName !== "chart.edit") {
      comp.stop();
      return;
    }
  });
};
