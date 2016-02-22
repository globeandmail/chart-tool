Template.chartArchiveSingle.events({
  "click .charts-archive_single": function() {
    window.open(Router.url('chart.show', { _id: this._id } ), '_blank');
  }
});
