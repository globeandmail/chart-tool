import { Mongo } from 'meteor/mongo';

const Charts = new Mongo.Collection('charts');

Charts.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Charts.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

export default Charts;
