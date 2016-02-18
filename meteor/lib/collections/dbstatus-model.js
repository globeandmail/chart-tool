DBStatus = new Meteor.Collection("database-status");

Meteor.methods({
  clearDBStatus: function() {
    return DBStatus.remove({});
  },
  checkDBStatus: function() {
    return DBStatus.insert({
      createdAt: new Date(),
      lastEdited: new Date(),
      connected: true
    });
  }
});
