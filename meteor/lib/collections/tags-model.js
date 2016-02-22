Tags = new Mongo.Collection("tags");

Tags.allow({
  insert: function() { return false; },
  update: function() { return false; },
  remove: function() { return false; }
});

Tags.deny({
  insert: function() { return true; },
  update: function() { return true; },
  remove: function() { return true; }
});

chartTags = function(chartId) {
  return Tags.find({ tagged: chartId });
};

Meteor.methods({
  createTag: function(tagName, chartId) {
    var tagExists = Tags.find({ tagName: tagName }).count();

    if (!tagExists) {

      var now = new Date();

      return Tags.insert({
        createdAt: now,
        lastEdited: now,
        tagName: tagName,
        tagged: [chartId]
      });

    }
  },
  addTag: function(tagId, chartId) {

    var currTag = Tags.findOne(tagId);

    var arr = currTag.tagged.slice();

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
  removeTag: function(tagId, chartId) {

    var currTag = Tags.findOne(tagId);

    var taggedArr = currTag.tagged,
        index = taggedArr.indexOf(chartId);

    if (index > -1) {
      taggedArr.splice(index, 1);
      if (taggedArr.length) {
        return Tags.update(tagId, {
          $set: {
            tagged: taggedArr,
            lastEdited: new Date()
          }
        })
      } else {
        return Tags.remove(tagId);
      }
    }

  }
});
