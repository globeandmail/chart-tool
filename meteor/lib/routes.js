Router.configure({
  layoutTemplate: 'applicationLayout',
  loadingTemplate: 'loading'
});

Router.route('/', function() {
  this.redirect('/new');
});

Router.route('/new', {
  name: 'chart.new',
  layoutTemplate: 'introLayout',
  template: 'chartNew',
  onAfterAction: function () {
    return document.title = "New chart – Chart Tool";
  }
});

Router.route('/404', {
  name: 'chart.404',
  layoutTemplate: 'empty',
  template: 'notFound',
  onAfterAction: function () {
    return document.title = "Page not found – Chart Tool";
  }
});

Router.route('/status', {
  name: 'chart.status',
  layoutTemplate: 'statusLayout',
  template: 'status',
  onAfterAction: function () {
    return document.title = "Status – Chart Tool";
  },
  data: function() {
    if (this.ready()) {
      var chartCount = Charts.find().fetch().length,
          chartUserCount = Presences.find().fetch().length;
      return {
        chartCount: chartCount,
        chartUserCount: chartUserCount
      };
    } else {
      this.render('loading');
    }
  },
  waitOn: function() {
    return [
      Meteor.subscribe('chartCount'),
      Meteor.subscribe('chartUserCount')
    ];
  },
});


Router.route('/chart/edit/:_id', {
  name: 'chart.edit',
  layoutTemplate: 'applicationLayout',
  yieldRegions: {
    'chartEditType': { to: 'type' },
    'chartEditPreview': { to: 'preview' },
    'chartEditOutput': { to: 'output' },
    'chartEditAside': { to: 'aside' },
    'chartEditEmbed': { to: 'embed' },
    'chartEditStatus': { to: 'status' },
    'chartEditTags': { to: 'tags' },
    'overlay': { to: 'overlay' }
  },
  data: function() {
    var chart = Charts.findOne({ _id: this.params._id });
    if (this.ready()) {
      if (!chart) {
        this.redirect('/404');
      } else {
        return chart;
      }
    } else {
      this.render('loading');
    }
  },
  waitOn: function() {
    return [
      Meteor.subscribe('chart', this.params._id),
      Meteor.subscribe('chartUsers', this.params._id),
      Meteor.subscribe('tags')
    ];
  },
  onAfterAction: function () {
    var matchedTags = chartTags(this.params._id).fetch().map(function(p) { return p._id; });
    Session.set("chartTags", matchedTags);
    Session.set("chartId", this.params._id);
    Session.set('overlay-visible', false);
    Meteor.call("getAnimalName", function(err, result) {
      if (!err) {
        Session.set("animalName", result.data.name);
      } else {
        Session.set("animalName", randomFromArr(app_settings.names));
      }
    });
    return document.title = "Edit chart – Chart Tool";
  }
});

Router.route('/chart/:_id', {
  name: 'chart.show',
  layoutTemplate: 'showLayout',
  template: "chartShow",
  data: function() {
    var chart = Charts.findOne({ _id: this.params._id });
    if (this.ready()) {
      if (!chart) {
        this.redirect('/404');
      } else {
        return chart;
      }
    } else {
      this.render('loading');
    }
  },
  waitOn: function() {
    return Meteor.subscribe('chart', this.params._id);
  },
  onAfterAction: function() {
    return document.title = "Preview chart – Chart Tool";
  }
});

Router.route('/list', function() {
  this.redirect('/archive');
});

Router.route('/archive', {
  name: "chart.archive",
  layoutTemplate: "archiveLayout",
  yieldRegions: {
    'chartArchive': { to: 'archive' },
  },
  data: function() {
    if (this.ready()) {
      return Charts.find({});
    } else {
      this.render('loading');
    }
  },
  waitOn: function() {
    Meteor.subscribe('tags');
  },
  onAfterAction: function() {
    var query = this.params.query;

    var types = [],
        tags = [],
        search = "",
        limit = "";

    if (query.types) { types = query.types.split(","); }
    if (query.tags) { tags = query.tags.split(","); }
    if (query.search) { search = query.search; }
    if (query.limit) { limit = parseInt(query.limit); }

    var defaultFilters = {
      queryName: 'chartArchive',
      filters: {
        types: types,
        tags: tags,
        search: search
      },
      limit: limit || 24
    };

    Session.setDefault('archiveFilters', defaultFilters);

    return document.title = "Archive – Chart Tool";
  }
});

Router.route('/chart/pdf/:_id', {
  name: "chart.render.pdf",
  layoutTemplate: "pdfLayout",
  template: "chartPdf",
  data: function() {
    if (this.ready()) {
      return Charts.findOne({ _id: this.params._id });
    }
  },
  waitOn: function() {
    return Meteor.subscribe('chart', this.params._id);
  },
  onAfterAction: function() {
    return document.title = "Chart PDF – Chart Tool";
  }
});

// wkhtmltopdf implementation
Router.route('pdf', {
  where: 'server',
  name: "chart.download.pdf",
  path: '/chart/pdf/download/:_id',
  action: function() {

    var data = Charts.findOne({ _id: this.params._id }),
        slug = data.slug,
        width = determineWidth(data.print.columns),
        height = determineHeight(data.print.lines, width),
        dpi = app_settings.print.dpi;

    var headers = {
      'Content-Type': 'application/pdf',
      'Content-Disposition': "attachment; filename=" + slug + "-print-" + data.print.columns + ".pdf"
    };

    this.response.writeHead(200, headers);

    var options = {
      pageWidth: width.toFixed(2) + "mm",
      pageHeight: height.toFixed(2) + "mm",
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      noOutline: true,
      dpi: dpi,
      zoom: 1
      // disableSmartShrinking: true, // as per https://github.com/wkhtmltopdf/qt/pull/12#issuecomment-66429764
      // zoom: 0.78125
    };

    var url = this.request.headers.origin + "/chart/pdf/" + data._id;

    var r = wkhtmltopdf(url, options).pipe(this.response);

  }
});

// RESTful routes
Router.route('GET', {
  where: 'server',
  name: 'chart.api.get',
  path: '/api/get/:_id',
  action: function() {
    var chartJSON = Charts.findOne({_id: this.params._id });
    this.response.statusCode = 200;
    this.response.setHeader("Content-Type", "application/json");
    this.response.setHeader("Access-Control-Allow-Origin", "*");
    this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    this.response.end(JSON.stringify(chartJSON));
  }
});

Router.route('GET', {
  where: 'server',
  name: 'chart.api.status',
  path: '/api/status',
  action: function() {
    DBStatus.remove({});
    var statusResponse = {};
    try {
      Meteor.call("checkDBStatus")
      statusResponse.databaseConnected = true;
    } catch (e) {
      statusResponse.databaseConnected = false;
    }
    this.response.statusCode = 200;
    this.response.setHeader("Content-Type", "application/json");
    this.response.setHeader("Access-Control-Allow-Origin", "*");
    this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    this.response.end(JSON.stringify(statusResponse));
  }
});
