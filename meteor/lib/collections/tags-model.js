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

Meteor.methods({
  addTag: function(tagName, chartId) {
    var now = new Date();

    return Tags.insert({
      createdAt: now,
      lastEdited: now,
      tagName: tagName,
      tagged: [chartId]
    });
  },
  editTag: function(tagId, tagName, chartId) {

    // determine if we're adding or removing a tag from a chart
    //
    // if removing a tag, and it's not related to any more charts, remove tag entirely
    //
    return Tags.update(tagId, {
      $set: {
        slug: text,
        lastEdited: new Date()
      }
    });
  }
});
