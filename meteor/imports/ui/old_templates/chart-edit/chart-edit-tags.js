Template.chartEditTags.rendered = function() {

  var chartId = Session.get("chartId");

  var tagsSelect = new ReactiveSelectizeController({
      maxItems: null,
      createOnBlur: true,
      valueField: '_id',
      labelField: 'tagName',
      searchField: ['tagName'],
      options: function() { return Tags.find(); },
      create: function(input, callback) {
        var tagName = input;
        var self = this;
        var availableTags = chartTags(chartId).fetch();
        if (availableTags.map(function(p) { return p.tagName; }).indexOf(tagName) === -1) {
          Meteor.call('createTag', input, chartId, function(err, result) {
            if (err) {
              console.log(err);
            } else if (result) {
              debugger;
              Meteor.call('updateTags', chartId, tagName);
              callback(result);
            }
          });
        } else {
          callback();
        }
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
    });

  tagsSelect.attach($('#tags-select'));

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
