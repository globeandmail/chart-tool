Meteor.methods({
  getAnimalName: function() {
    this.unblock();
    return Meteor.http.get(app_settings.animal_api);
  }
});

S3.config = {
  key: process.env.S3_KEY || "abc",
  secret: process.env.S3_SECRET || "abc",
  bucket: process.env.S3_BUCKET || "abc",
  region: 'us-west-2'
};

console.log(S3.config);
