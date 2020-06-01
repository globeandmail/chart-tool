import { Meteor } from 'meteor/meteor';
import Tags from './Tags';

Meteor.methods({
  'tags.create'(tagName, chartId, chartTagArr) {
    const now = new Date();
    Meteor.call('charts.update.tags', chartId, chartTagArr);
    return Tags.insert({
      createdAt: now,
      lastEdited: now,
      tagName: tagName,
      tagged: [chartId]
    });
  },
  'tags.change'(tagId, chartId, chartTagArr) {
    const currTag = Tags.findOne(tagId),
      arr = currTag.tagged.slice(),
      chartIndex = arr.indexOf(chartId);

    Meteor.call('charts.update.tags', chartId, chartTagArr);

    // chart doesn't exist within array
    if (chartIndex === -1) {
      arr.push(chartId);
    } else {
      // chart exists in array, remove it
      arr.splice(chartIndex, 1);
    }

    if (arr.length) {
      return Tags.update(tagId, {
        $set: {
          tagged: arr,
          lastEdited: new Date()
        }
      });
    } else {
      return Tags.remove(tagId);
    }
  }
});
