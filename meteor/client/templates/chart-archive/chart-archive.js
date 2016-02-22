function performSearch(e) {
  var archiveFilters = Session.get('archiveFilters'),
      input = e.target.value;

  input.trim().replace(/^\s+/, "");

  if (input === "") { input = undefined; }

  archiveFilters.filters.search = input;
  Session.set("archiveFilters", archiveFilters);
}

function setQueryUrl(type, value) {
  var query = Router.current().params.query;

  var queryArr = [];

  for (prop in query) {
    if (prop !== type) {
      queryArr.push(prop + "=" + query[prop])
    }
  }

  if (value) { queryArr.push(type + "=" + value); }

  var newUrl = Router.current().route.path({},
    { query: queryArr.join('&') },
    { replaceState: true });

  history.pushState({}, document.title, newUrl);

}

Template.chartArchive.helpers({
  chartEntries: function() {
    var options = { sort: {} };

    if (Session.get('archiveFilters').filters.search) {
      options.sort.score = -1;
      options.sort.lastEdited = -1;
    } else {
      options.sort.lastEdited = -1;
    }

    return Charts.find({}, options);
  },
  typeChecked: function(type) {
    if (Session.get("archiveFilters")) {
      var typeFilters = Session.get("archiveFilters").filters.types;
      return typeFilters.indexOf(type) > -1 ? true : false;
    }
  },
  searchValue: function() {
    if (Session.get("archiveFilters")) {
      var search = Session.get("archiveFilters").filters.search;
      return search === "" ? false : search;
    }
  },
  chartsVisible: function() {
    return Charts.find().count();
  },
  chartCount: function() {
    if (Session.get("archiveFilters")) {
      var filters = Session.get("archiveFilters");
      filters.limit = false;
      Meteor.call("matchedCharts", filters, function(err, res) {
        if (!err) { Session.set("availableCharts", res); }
      });
      return Session.get("availableCharts");
    }
  },
  limitSelected: function(value) {
    if (Session.get("archiveFilters")) {
      var limit = Session.get("archiveFilters").limit;
      if (limit === parseInt(value)) {
        return "selected";
      }
    }
  }
});

Template.chartArchive.events({
  "keyup .charts-archive_search-field": function(event) {
    debounce(performSearch(event), 300);
  },
  "blur .charts-archive_search-field": function(event) {
    performSearch(event);
    if (event.target.value !== "") {
      setQueryUrl("search", event.target.value);
    }
  },
  "change .charts-archive_count-limit": function(event) {
    var params = Session.get("archiveFilters"),
        limitVal = parseInt(event.target.value);
    params.limit = limitVal;
    Session.set("archiveFilters", params);
    setQueryUrl("limit", limitVal);
  },
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

    setQueryUrl("types", params.filters.types.join(","));

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

  var tagsSelect = $('#archive-tags-select').reactiveSelectize({
      maxItems: null,
      valueField: '_id',
      labelField: 'tagName',
      searchField: 'tagName',
      options: function() { return Tags.find(); },
      onItemAdd: function(value, item) {
        var archiveFilters = Session.get("archiveFilters"),
            index = archiveFilters.filters.tags.indexOf(item.text());

        if (index === -1) {
          archiveFilters.filters.tags.push(item.text());
        }

        Session.set("archiveFilters", archiveFilters);

        setQueryUrl("tags", archiveFilters.filters.tags.join(","));
      },
      onItemRemove: function(value, item) {

        var archiveFilters = Session.get("archiveFilters"),
            index = archiveFilters.filters.tags.indexOf(item.text());

        archiveFilters.filters.tags.splice(index, 1);

        Session.set("archiveFilters", archiveFilters);

        setQueryUrl("tags", archiveFilters.filters.tags.join(","));
      }
    })[0].reactiveSelectize;

  Tracker.autorun(function(comp) {

    var routeName = Router.current().route.getName();

    if (routeName !== "chart.archive") {
      comp.stop();
      return;
    }

    if (Session.get("archiveFilters")) {
      var currTags = Session.get("archiveFilters").filters.tags;
      if (currTags.length) {
        var matchedTags = Tags.find({ tagName: { $in: currTags } }).fetch().map(function(p) {
          return p._id;
        });
        tagsSelect.selectize.addItem(matchedTags);
      }
    }

    Meteor.subscribe('chartArchive', Session.get("archiveFilters"));

  });
}
