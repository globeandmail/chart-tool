import { Meteor } from 'meteor/meteor';
import { Presences } from 'meteor/tmeasday:presence';
import { check } from 'meteor/check';
import Charts from '../Charts';
import { queryConstructor } from '../../../modules/utils';

Meteor.publish('chart', function(chartId) {
  check(chartId, String);
  const data = Charts.find({ _id: chartId });
  if (data) { return data; }
  return this.ready();
});

Meteor.publish('chart.archive', function(params) {
  const parameters = queryConstructor(params);

  parameters.options.fields = parameters.options.fields || {};
  parameters.options.fields.img = true;
  parameters.options.fields.slug = true;
  parameters.options.fields.lastEdited = true;
  parameters.options.fields.createdAt = true;

  const data = Charts.find(parameters.find, parameters.options);
  if (data) { return data; }
  return this.ready();
});

Meteor.publish('chart.users', function(chartId) {
  check(chartId, String);
  const filter = { 'state.currentChartId': chartId };
  const data = Presences.find(filter, { fields: { 'state': true, 'userId': true }});
  if (data) { return data; }
  return this.ready();
});

Meteor.publish('chart.count', function() {
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

Meteor.publish('chart.usercount', function() {
  const data = Presences.find({}, { fields: { 'state': true, 'userId': true } });
  if (data) { return data; }
  return this.ready();
});
