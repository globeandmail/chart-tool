import { Mongo } from 'meteor/mongo';

const Tags = new Mongo.Collection('tags');

Tags.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Tags.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

export default Tags;
