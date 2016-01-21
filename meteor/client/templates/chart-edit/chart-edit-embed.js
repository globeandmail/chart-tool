Template.chartEditEmbed.helpers({
  useBase64Images: function() {
    if (app_settings.s3 && app_settings.s3.enable) {
      return false;
    } else {
      return true;
    }
  },
  angleBracket: function() {
    return '<';
  },
  embedJSON: function() {
    if (!isEmpty(this)) {
      return JSON.stringify(embed(this), null, 2);
    }
  }
});
