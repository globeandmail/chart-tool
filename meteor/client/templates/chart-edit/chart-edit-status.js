Presence.state = function() {
  return {
    currentChartId: Session.get("chartId"),
    user: Session.get("animalName")
  }
}

Template.chartEditStatus.helpers({
  manyConnections: function() {
    var count = Presences.find().fetch().length;
    if (count > 1) {
      return true;
    }
  },
  connected: function() {
    return Presences.find();
  },
  name: function() {
    return this.state.user;
  },
  currentSession: function() {
    if (this.state.user === Session.get("animalName")) {
      return true;
    }
  }
});

Template.chartEditStatus.events({
  "click .help-editing": function(event) {
    sweetAlert({
      title: "Who\u2019s editing my what now?",
      text: "Surprise! Chart Tool allows for multiple people to edit your chart at once.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  }
})