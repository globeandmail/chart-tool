import { Meteor } from 'meteor/meteor';
import DBStatus from '../../api/DBStatus/DBStatus';
import Charts from '../../api/Charts/Charts';

Charts._ensureIndex({
  'slug': 'text',
  'heading': 'text',
  'qualifier': 'text',
  'deck': 'text',
  'source': 'text'
});

Meteor.startup(() => {
  DBStatus.remove({}); // clears database status
});
