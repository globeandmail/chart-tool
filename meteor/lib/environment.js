var environment, settings;

var devURL = "http://localhost:3000";

if (Meteor.isServer) {
  environment = process.env.METEOR_ENV || "development";
} else {
  environment = (window.location.origin === devURL) ? "development" : "production";
}

settings = {
  development: {
    public: {
      version: app_version,
      build: app_build,
      prefix: prefix,
      name: app_name
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

if (environment === "production") {
  Meteor.settings = settings.production;
} else if (environment === "staging") {
  Meteor.settings = settings.staging;
} else {
  Meteor.settings = settings.development;
}

Meteor.methods({
  getEnvironment: function() {
    return (process.env.ROOT_URL === devURL) ? "development" : "production";
  }
});
