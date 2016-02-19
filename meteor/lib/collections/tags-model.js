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
  addTag: function(tagName, chartId) {
    var tagExists = Tags.find({ tagName: tagName }).count();
    if (!tagExists) {
      var now = new Date();
      return Tags.insert({
        createdAt: now,
        lastEdited: now,
        tagName: tagName,
        tagged: [chartId]
      });
    } else {
      return "tag already exists";
    }
  },
  removeTag: function(tagId, chartId) {

    var taggedArr = Tags.findOne(tagId).tagged,
        index = taggedArr.indexOf(chartId);

    if (index > -1) {
      taggedArr.splice(index, 1);
      if (taggedArr.length) {
        return Tags.update(tagId, {
          $set: {
            tagged: taggedArr
          }
        })
      } else {
        return Tags.remove(tagId);
      }
    }

  },
  editTag: function(tagId, tagName, chartId) {

    // determine if we're adding or removing a tag from a chart
    // if removing a tag, and it's not related to any more charts,
    // remove tag entirely
    return Tags.update(tagId, {
      $set: {
        slug: text,
        lastEdited: new Date()
      }
    });
  }
});
