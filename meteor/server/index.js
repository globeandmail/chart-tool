Meteor.methods({
  getAnimalName: function() {
    this.unblock();
    return Meteor.http.get(app_settings.animal_api);
  }
});

S3.config = {
  key: process.env.S3_KEY || "undefined",
  secret: process.env.S3_SECRET || "undefined",
  bucket: app_settings.s3.bucket || "undefined",
  region: app_settings.s3.region || "undefined"
};

console.log(S3.config);
