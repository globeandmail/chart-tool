Template.chartArchiveSingle.events({
  "click .chart-archive_single": function() {
    Router.go('chart.show', {_id: this._id});
  }
});
