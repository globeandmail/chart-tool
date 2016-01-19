Meteor.methods({
  getAnimalName: function() {
    this.unblock();
    return Meteor.http.get(app_settings.animal_api);
  }
});

if (app_settings.s3.enable) {
  S3.config = {
    key: process.env.S3_CHARTTOOL_KEY,
    secret: process.env.S3_CHARTTOOL_SECRET,
    bucket: app_settings.s3.bucket,
    region: app_settings.s3.region
  };
}

Meteor.startup(function() {
  // clears status database
  DBStatus.remove({});
});
