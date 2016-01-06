Meteor.publish("chart", function (id) {
  return Charts.find({ _id: id });
});

Meteor.publish("chartList", function () {
  return Charts.find({}, {sort: {lastEdited: -1}, limit: 25});
});

Meteor.publish('chartUsers', function (chartId) {
  var filter = { "state.currentChartId": chartId };
  return Presences.find(filter, { fields: { state: true, userId: true }});
});

Meteor.publish("chartCount", function(chart) {
  return Charts.find();
});

Meteor.publish("chartUserCount", function(chart) {
  return Presences.find();
});

Meteor.publish("databaseStatus", function(chart) {
  return DBStatus.find();
});
