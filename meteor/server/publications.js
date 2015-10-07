Meteor.publish("chart", function (id) {
  return Charts.find({ _id: id });
});

Meteor.publish("chartList", function () {
  return Charts.find({}, {sort: {lastEdited: -1}, limit: 25});
});

Meteor.publish('chartUsers', function (chartId) {
  var filter = { "state.currentChartId": chartId};
  return Presences.find(filter, { fields: { state: true, userId: true }});
});