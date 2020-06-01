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
