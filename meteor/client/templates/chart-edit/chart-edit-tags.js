Template.chartEditTags.rendered = function() {

  var chartId = Session.get("chartId");

  var tagsSelect = $('#tags-select').reactiveSelectize({
      maxItems: null,
      createOnBlur: true,
      valueField: '_id',
      labelField: 'tagName',
      searchField: 'tagName',
      options: function() { return Tags.find(); },
      create: function(input, callback) {
        var tagName = input;
        var self = this;
        Meteor.call('createTag', input, chartId, function(err, result) {
          if (err) {
            console.log(err);
          } else if (result) {
            Meteor.call('updateTags', chartId, tagName);
            callback(result);
          }
        });
        self.$control_input[0].value = "";
      },
      onItemAdd: function(value, item) {
        Meteor.call('addTag', value, chartId, function(err, result) {
          if (err) {
            console.log(err);
          } else if (result) {
            Meteor.call('updateTags', chartId, item[0].innerText);
          }
        });
      },
      onItemRemove: function(value, item) {
        Meteor.call('removeTag', value, chartId, function(err, result) {
          if (err) {
            console.log(err);
          } else if (result) {
            Meteor.call('updateTags', chartId, item[0].innerText);
          }
        });
      }
    })[0].reactiveSelectize;

  Tracker.autorun(function(comp) {
    var routeName = Router.current().route.getName();
    if (routeName !== "chart.edit") {
      comp.stop();
      return;
    }
    if (Session.get("chartTags")) {
      tagsSelect.selectize.addItems(Session.get("chartTags"));
    }
  });

}
