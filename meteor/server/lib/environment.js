var environment, settings;

environment = process.env.METEOR_ENV || "development";

settings = {
  development: {
    public: {},
    private: {
    }
  },
  staging: {
    public: {
      "mongo_url": "mongodb://stgmongodb01.colo.theglobeandmail.com:27017/charttool"
    },
    private: {
      "kadira": {
        "appId": "JxYGRLS8GejbfjZdc",
        "appSecret": "4dc55fc5-2d81-4575-9e11-1be46ebc8c73"
      }
    }
  },
  production: {
    public: {},
    private: {
      "kadira": {
        "appId": "mq72RyJjZXpwiExYC",
        "appSecret": "95cc7c46-1b65-43c7-868c-bb3f06367031"
      }
    }
  }
};

if (!process.env.METEOR_SETTINGS) {
  console.log("No METEOR_SETTINGS passed in, using locally defined settings.");
  if (environment === "production") {
    Meteor.settings = settings.production;

    Kadira.connect(Meteor.settings.private.kadira.appId, Meteor.settings.private.kadira.appSecret);

  } else if (environment === "staging") {
    Meteor.settings = settings.staging;

    Kadira.connect(Meteor.settings.private.kadira.appId, Meteor.settings.private.kadira.appSecret);

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