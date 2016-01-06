Meteor.methods({
  getAnimalName: function() {
    this.unblock();
    return Meteor.http.get(app_settings.animal_api);
  }
});


Meteor.startup(function() {
  // clears status database
  DBStatus.remove({});
});
