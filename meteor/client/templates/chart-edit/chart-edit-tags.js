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

// Template.chartEditTags.events({
//   'item_add #tags-select': function(event, template) {
//     // console.log("init!");
//     debugger;
//   }
// })

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
      console.log(input);
      Meteor.call('addTag', input, Session.get("chartId"), function(err, result) {
        if (!err) {
          callback(input);
        } else {
          callback()
          console.log(err);
        }
      });
    },
  })[0].reactiveSelectize;

  Tracker.autorun(function(comp) {
    var routeName = Router.current().route.getName();
    if (routeName !== "chart.edit") {
      comp.stop();
      return;
    }
    if (Session.get("chartTags")) {
      tagsSelect.selectize.addItems(Session.get("chartTags"))
    }
  });

  // $('.tags-select').selectize({
  //   maxItems: null,
  //   createOnBlur: true,
  //   valueField: '_id',
  //   labelField: 'tagName',
  //   searchField: 'tagName',
  //   options: Tags.find().fetch(),
  //   items: matchedTags,
  //   create: function(input, callback) {
  //     var tagName = input;
  //     console.log(input);
  //     Meteor.call('addTag', input, chartId, function(err, result) {
  //       if (!err) {
  //         console.log("inserted " + result);
  //         // callback({ _id: result, tagName: tagName });
  //       } else {
  //         console.log(err);
  //       }
  //     });
  //   },
  //   onItemCreate: function(value) {
  //     debugger;
  //   },
  //   onItemRemove: function(value) {
  //     // debugger;
  //     Meteor.call('removeTag', value, chartId, function(err, result) {
  //       if (!err) {
  //       } else {
  //         console.log(err);
  //       }
  //     });
  //   }
  // });

}
