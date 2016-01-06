Template.status.helpers({
  totalCharts: function() {
    return Number(Charts.find().fetch().length).toLocaleString("en");
  },
  totalActiveUsers: function() {
    return Number(Presences.find().fetch().length).toLocaleString("en");
  },
  totalChartsThisMonth: function() {

    var now = new Date(),
        m = now.getMonth() + 1,
        y = now.getFullYear();

    var thisMonth = y + "-" + m + "-01";

    var chartsThisMonth = Charts.find({
      createdAt: {
        $gte: new Date(thisMonth)
      }
    });

    return chartsThisMonth.fetch().length;

  },
  statusServer: function() {
    if (Meteor.status().connected) {
      return "status-active";
    } else {
      return "status-inactive";
    }
  },
  statusDatabase: function() {
    return Session.get("database-status");
  }
});

Template.status.rendered = function() {

  Tracker.autorun(function(comp) {

    Meteor.call("checkDBStatus", function(err, result) {
      if (err) {
        var status = "status-inactive";
      } else {
        var status = "status-active";
      }
      Session.set("database-status", status);
    });

  });

};
