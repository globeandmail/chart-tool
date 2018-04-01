import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Charts from '../Charts';
import { queryConstructor } from '../../../modules/utils';

Meteor.publish('chart', function(chartId) {
  check(chartId, String);
  const data = Charts.find({ _id: chartId });
  if (data) { return data; }
  return this.ready();
});

Meteor.publish('chartArchive', function(params) {
  const parameters = queryConstructor(params);

  parameters.options.fields = parameters.options.fields || {};

  const fields = parameters.options.fields;

  fields.img = true;
  fields.slug = true;
  fields.lastEdited = true;

  const data = Charts.find(parameters.find, parameters.options);
  if (data) { return data; }
  return this.ready();
});

// Meteor.publish('chartUsers', function (chartId) {
//   check(chartId, String);
//   const filter = { 'state.currentChartId': chartId };
//   const data = Presences.find(filter, { fields: { 'state': true, 'userId': true }});
//   if (data) { return data; }
//   return this.ready();
// });

Meteor.publish('chartCount', function() {
  const data = Charts.find({}, {
    fields: {
      '_id': true,
      'createdAt': true,
      'lastEdited': true
    }
  });
  if (data) { return data; }
  return this.ready();
});

// Meteor.publish('chartUserCount', function() {
//   const data = Presences.find({}, { fields: { 'state': true, 'userId': true } });
//   if (data) { return data; }
//   return this.ready();
// });
