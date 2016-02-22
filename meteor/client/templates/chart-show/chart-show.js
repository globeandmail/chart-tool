function timeSince(timeStamp) {
  var now = new Date(),
      secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  if (secondsPast < 60) {
    return parseInt(secondsPast) + ' seconds';
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + ' minutes';
  }
  if (secondsPast <= 86400) {
    return parseInt(secondsPast / 3600) + ' hours';
  }
  if (secondsPast > 86400) {
      var day = timeStamp.getDate();
      var month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
      var year = timeStamp.getFullYear() === now.getFullYear() ? "" :  ", " + timeStamp.getFullYear();
      return month + " " + day + year;
  }
}

Template.chartShow.helpers({
  relativeLastEdited: function () {
    if (this.lastEdited) {
      return timeSince(this.lastEdited);
    }
  },
  prettyCreatedAt: function() {
    if (this.createdAt) {
      var now = new Date(),
          timeStamp = this.createdAt,
          day = timeStamp.getDate(),
          month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", ""),
          year = timeStamp.getFullYear() === now.getFullYear() ? "" :  " " + timeStamp.getFullYear();
      return day + " " + month + ". " + year;
    }
  }
});

Template.chartShow.events({
  "click .chart-show_fork": function() {
    if (this._id) {
      var chartId = this._id;
      Meteor.call("forkChart", chartId, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          Router.go('chart.edit', { _id: result });
        }
      });
    }
  }
})

Template.chartShow.rendered = function() {
  Tracker.autorun(function(comp) {
    var routeName = Router.current().route.getName();

    if (routeName !== "chart.show") {
      comp.stop();
      return;
    }

    var data = Router.current() && Router.current().data();

    if (data) {
      drawChart(".chart-show_preview", data);
    }

  });
}
