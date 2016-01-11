var environment, settings;

environment = process.env.METEOR_ENV || "development";

settings = {
  development: {
    public: {
      "version": app_version,
      "build": app_build,
      "prefix": prefix,
      "name": app_name
    },
    private: {}
  },
  staging: {
    public: {
      version: app_version,
      build: app_build,
      prefix: prefix,
      name: app_name
    },
    private: {}
  },
  production: {
    public: {
      version: app_version,
      build: app_build,
      prefix: prefix,
      name: app_name
    },
    private: {}
  }
};

if (!process.env.METEOR_SETTINGS) {
  if (environment === "production") {
    Meteor.settings = settings.production;
  } else if (environment === "staging") {
    Meteor.settings = settings.staging;
  } else {
    Meteor.settings = settings.development;
  }
  console.log("Using [ " + environment + " ] Meteor.settings");
}

Meteor.methods({
  getEnvironment: function() {
    if (process.env.ROOT_URL == "http://localhost:3000") {
      return "development";
    } else {
      return "production";
    }
  }
});
