Meteor.methods({
  getAnimalName: function() {
    this.unblock();
    return Meteor.http.get(app_settings.animal_api);
  }
});

S3.config = {
  key: process.env.S3_KEY || undefined,
  secret: process.env.S3_SECRET || undefined,
  bucket: process.env.S3_BUCKET || undefined,
  region: 'us-west-2'
};

console.log(S3.config);
