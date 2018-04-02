import { Meteor } from 'meteor/meteor';
import Tags from '../Tags';
import { queryConstructor } from '../../../modules/utils';

Meteor.publish('tags', function() {
  const parameters = queryConstructor();
  parameters.options.fields = {
    'tagName': true,
    'tagged': true
  };
  delete parameters.options.limit;
  const data = Tags.find(parameters.find, parameters.options);
  if (data) { return data; }
  return this.ready();
});

Meteor.publish('chart.tags', chartId => {
  const data = Tags.find({ tagged: chartId });
  if (data) { return data; }
  return this.ready();
});
