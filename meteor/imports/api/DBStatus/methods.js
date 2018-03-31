import { Meteor } from 'meteor/meteor';
import DBStatus from './DBStatus';

Meteor.methods({
  clearDBStatus: () => {
    return DBStatus.remove({});
  },
  checkDBStatus: () => {
    return DBStatus.insert({
      createdAt: new Date(),
      lastEdited: new Date(),
      connected: true
    });
  }
});
