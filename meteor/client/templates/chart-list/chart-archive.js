Template.chartArchive.helpers({
  chartEntries: function() {
    return Charts.find({}, {sort: { lastEdited: -1 }});
  },
  typeChecked: function(type) {
    if (Session.get("archiveFilters")) {
      var typeFilters = Session.get("archiveFilters").filters.types;
      return typeFilters.indexOf(type) > -1 ? true : false;
    }
  }
});

Template.chartArchive.events({
  "click .input-checkbox": function() {
    var params = Session.get("archiveFilters"),
        typeValue = event.target.value;

    var index = params.filters.types.indexOf(typeValue);

    if (index > -1) {
      params.filters.types.splice(index, 1);
    } else {
      params.filters.types.push(typeValue);
    }

    Session.set("archiveFilters", params);
  },
  "click .edit-box h3": function(event) {
    var el = d3.select(event.target).node().nextElementSibling;
    if (el.dataset.state === "hidden") {
      d3.select(el)
        .style("display", "block")
        .transition()
        .duration(250)
        .style("height", "auto")
        .style("opacity", "1");
      el.dataset.state = "visible";
    } else {
      d3.select(el)
        .transition()
        .duration(250)
        .style("opacity", "0")
        .style("height", "0px")
        .each("end", function() {
          d3.select(this).style("display", "none");
        });
      el.dataset.state = "hidden";
    }
  },
});

Template.chartArchive.rendered = function() {

  StickyfillInit();
  Stickyfill.add(document.querySelector('.sticky'));

  Tracker.autorun(function(comp) {

    var routeName = Router.current().route.getName();

    if (routeName !== "chart.archive") {
      comp.stop();
      return;
    }

    // masonry grid tk

    Meteor.subscribe('chartArchive', Session.get("archiveFilters"));

  });
}
