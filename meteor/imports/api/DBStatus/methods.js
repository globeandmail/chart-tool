import { Meteor } from 'meteor/meteor';
import DBStatus from './DBStatus';

Meteor.methods({
  'dbstatus.clear'() {
    return DBStatus.remove({});
  },
  'dbstatus.check'() {
    return DBStatus.insert({
      createdAt: new Date(),
      lastEdited: new Date(),
      connected: true
    });
  }
});
