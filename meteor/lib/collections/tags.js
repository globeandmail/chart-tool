Tags = new Mongo.Collection("tags");

Meteor.methods({
  addTag: function(tagName, chartId) {
    var now = new Date();

    return Tags.insert({
      createdAt: now,
      lastEdited: now,
      tagName: tagName,
      tagged: []
    });
  }
});
