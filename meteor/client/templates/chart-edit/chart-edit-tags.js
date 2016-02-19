Template.chartEditTags.rendered = function() {

  tagsSelect = $('#tags-select').reactiveSelectize({
    maxItems: null,
    createOnBlur: true,
    valueField: '_id',
    labelField: 'tagName',
    searchField: 'tagName',
    options: function() { return Tags.find(); },
    create: function(input, callback) {
      var tagName = input;
      var self = this;
      Meteor.call('createTag', input, Session.get("chartId"), function(err, result) {
        if (err) { console.log(err); }
        callback(result);
      });
      self.$control_input[0].value = "";
    },
    onItemAdd: function(value, item) {
      Meteor.call('addTag', value, Session.get("chartId"), function(err, result) {
        if (err) { console.log(err); }
        callback(result);
      });
    },
    onItemRemove: function(value) {
      Meteor.call('removeTag', value, Session.get("chartId"), function(err, result) {
        if (err) { console.log(err); }
        console.log(result + " removed!");
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
