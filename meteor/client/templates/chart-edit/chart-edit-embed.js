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
  pfx: function() {
    if (prefix) { return prefix; }
  },
  embedCSS: function() {
    if (app_settings) { return app_settings.embedCSS; }
  },
  embedJS: function() {
    if (app_settings) { return app_settings.embedJS; }
  },
  app_build: function() {
    if (app_build) { return app_build; }
  },
  embedJSON: function() {
    if (!isEmpty(this)) {
      return JSON.stringify(embed(this), null, 2);
    }
  }
});
