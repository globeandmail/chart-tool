Meteor.publish("chart", function (chartId) {
  check(chartId, String);
  var data = Charts.find({ _id: chartId });
  if (data) { return data; }
  return this.ready();
});

Meteor.publish("chartArchive", function (params) {
  var parameters = queryConstructor(params);
  var data = Charts.find(parameters.find, parameters.options);
  if (data) { return data; }
  return this.ready();
});

Meteor.publish("tags", function () {
  return Tags.find();
});

Meteor.publish('chartUsers', function (chartId) {
  check(chartId, String);
  var filter = { "state.currentChartId": chartId };
  var data = Presences.find(filter, { fields: { "state": true, "userId": true }});
  if (data) { return data; }
  return this.ready();
});

Meteor.publish("chartCount", function() {
  var data = Charts.find({}, {
    fields: {
      "_id": true,
      "createdAt": true,
      "lastEdited": true
    }
  });
  if (data) { return data; }
  return this.ready();
});

Meteor.publish("chartUserCount", function() {
  var data = Presences.find({}, { fields: { "state": true, "userId": true } });
  if (data) { return data; }
  return this.ready();
});

Meteor.publish("databaseStatus", function() {
  var data = DBStatus.find();
  if (data) { return data; }
  return this.ready();
});
