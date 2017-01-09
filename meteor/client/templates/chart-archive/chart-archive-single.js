Template.chartArchiveSingle.helpers({
  imageOrFallback: function() {
    var img = this.img;
    if (img) {
      return "<img src='" + img + "'>";
    } else {
      return "<div class='empty-image'><p>No image available</p></div>";
    }
  }
});

Template.chartArchiveSingle.events({
  "click .charts-archive_single": function() {
    window.open(Router.url('chart.show', { _id: this._id } ), '_blank');
  }
});
