import { Meteor } from 'meteor/meteor';
import Tags from './Tags';

export function chartTags(chartId) {
  return Tags.find({ tagged: chartId });
}

Meteor.methods({
  createTag: (tagName, chartId) => {
    const tagExists = Tags.find({ tagName: tagName }).count();
    if (!tagExists) {
      const now = new Date();
      return Tags.insert({
        createdAt: now,
        lastEdited: now,
        tagName: tagName,
        tagged: [chartId]
      });
    }
  },
  addTag: (tagId, chartId) => {
    const currTag = Tags.findOne(tagId),
      arr = currTag.tagged.slice();
    // if chart doesn't already exist within array
    if (!(arr.indexOf(chartId) > -1)) {
      arr.push(chartId);
      return Tags.update(tagId, {
        $set: {
          tagged: arr,
          lastEdited: new Date()
        }
      });
    }
  },
  removeTag: (tagId, chartId) => {
    const currTag = Tags.findOne(tagId),
      taggedArr = currTag.tagged,
      index = taggedArr.indexOf(chartId);
    if (index > -1) {
      taggedArr.splice(index, 1);
      if (taggedArr.length) {
        return Tags.update(tagId, {
          $set: {
            tagged: taggedArr,
            lastEdited: new Date()
          }
        });
      } else {
        return Tags.remove(tagId);
      }
    }
  }
});
