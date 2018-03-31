Template.navigation.helpers({
  helpLink: function() {
    if (app_settings) {
      return app_settings.help || "http://www.github.com/globeandmail/chart-tool";
    }
  }
});
