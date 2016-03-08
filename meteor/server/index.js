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
    bucket: process.env.S3_CHARTTOOL_BUCKET,
    region: process.env.S3_CHARTTOOL_REGION
  };
}

Charts._ensureIndex({
  "slug": "text",
  "heading": "text",
  "qualifier": "text",
  "deck": "text",
  "source": "text"
});

Meteor.startup(function() {
  // clears status database
  DBStatus.remove({});
});
