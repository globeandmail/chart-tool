Template.chartEditTags.helpers({
  tagEntries: function() {
    return Tags.find();
  },
  isTagged: function() {
    var chartId = Session.get("chartId");
    if (this.tagged.indexOf(chartId) > -1) {
      return "selected";
    }
  }
})

Template.chartEditTags.rendered = function() {

  Tracker.autorun(function(comp) {

    var routeName = Router.current().route.getName();

    if (routeName !== "chart.edit") {
      comp.stop();
      return;
    }

    var chartId = Session.get("chartId");

    var matchedTags = Tags.find({ tagged: chartId }).fetch().map(function(obj) {
      return obj._id;
    });

    $('.tags-select').selectize({
      maxItems: null,
      createOnBlur: true,
      valueField: '_id',
      labelField: 'tagName',
      searchField: 'tagName',
      options: Tags.find().fetch(),
      items: matchedTags,
      create: function(input, callback) {
        var tagName = input;
        Meteor.call('addTag', input, chartId, function(err, result) {
          if (!err) {
            callback({ _id: result, tagName: tagName });
          } else {
            console.log(err);
          }
        });
      }
    });

  });

}
