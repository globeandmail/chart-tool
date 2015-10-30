/**
 * Chart Tool.
 * @version 1.1.0
 * @author Jeremy Agius <jagius@globeandmail.com>
 * @author Tom Cardoso <tcardoso@globeandmail.com>
 * @author Michael Pereira <mpereira@globeandmail.com>
 * @see {@link} for further information.
 * @see {@link http://www.github.com/globeandmail/chart-tool|Chart Tool}
 * @license MIT
 */

(function ChartToolInit(root) {

  if (root.d3) {

    var ChartTool = (function ChartTool() {

      var charts = root.__charttool,
          dispatchFunctions = root.__chartDispatcher,
          drawn = [];

      var settings = require("./config/chart-settings"),
          utils = require("./utils/utils");

      var dispatcher = d3.dispatch("start", "finish", "redraw", "hoverIn", "hoverOut", "click");

      for (var prop in dispatchFunctions) {
        if (d3.keys(dispatcher).indexOf(prop) > -1) {
          dispatcher.on(prop, dispatchFunctions[prop]);
        } else {
          throw "Chart Tool does not offer a dispatcher of type '" + prop + "'. For available dispatcher types, please see the ChartTool.dispatch() method." ;
        }
      }

      /**
       * Clears previous iterations of chart objects stored in obj or the drawn array, then punts chart construction to the Chart Manager.
       * @param  {String} container A string representing the container's selector.
       * @param  {Object} obj       The chart ID and embed data.
       */
      function createChart(container, obj) {

        dispatcher.start(obj);

        // clearing variables
        drawn = utils.clearDrawn(drawn, obj);
        obj = utils.clearObj(obj);
        container = utils.clearChart(container);

        var ChartManager = require("./charts/manager");

        obj.data.width = utils.getBounding(container, "width");
        obj.dispatch = dispatcher;

        var chartObj = ChartManager(container, obj);

        drawn.push({ id: obj.id, chartObj: chartObj });
        obj.chartObj = chartObj;

        dispatcher.finish(chartObj);

      }

      /**
       * Grabs data on a chart based on an ID.
       * @param {Array} charts Array of charts on the page.
       * @param  {String} id The ID for the chart.
       * @return {Object}    Returns stored embed object.
       */
      function readChart(id) {
        for (var i = 0; i < charts.length; i++) {
           if (charts[i].id === id) {
            return charts[i];
          }
        };
      }

      /**
       * List all the charts stored in the Chart Tool by chartid.
       * @param {Array} charts Array of charts on the page.
       * @return {Array}       List of chartid's.
       */
      function listCharts(charts) {
        var chartsArr = [];
        for (var i = 0; i < charts.length; i++) {
          chartsArr.push(charts[i].id);
        };
        return chartsArr;
      }

      function updateChart(id, obj) {
        var container = '.' + settings.baseClass() + '[data-chartid=' + id + ']';
        createChart(container, { id: id, data: obj });
      }

      function destroyChart(id) {
        var container, obj;
        for (var i = 0; i < charts.length; i++) {
          if (charts[i].id === id) {
            obj = charts[i];
          }
        };
        container = '.' + settings.baseClass() + '[data-chartid=' + obj.id + ']';
        utils.clearDrawn(drawn, obj);
        utils.clearObj(obj);
        utils.clearChart(container);
      }

      /**
       * Iterate over all the charts, draw each chart into its respective container.
       * @param {Array} charts Array of charts on the page.
       */
      function createLoop(charts) {
        var chartList = listCharts(charts);
        for (var i = 0; i < chartList.length; i++) {
          var obj = readChart(chartList[i]);
          var container = '.' + settings.baseClass() + '[data-chartid=' + chartList[i] + ']';
          createChart(container, obj);
        };
      }

      /**
       * Chart Tool initializer which sets up debouncing and runs the createLoop(). Run only once, when the library is first loaded.
       * @param {Array} charts Array of charts on the page.
       */
      function initializer(charts) {
        createLoop(charts);
        var debounce = utils.debounce(createLoop, charts, settings.debounce, root);

        d3.select(root)
          .on('resize.debounce', debounce)
          .on('resize.redraw', dispatcher.redraw(charts));
      }


      return {

        init: function init() {
          return initializer(charts);
        },

        create: function create(container, obj) {
          return createChart(container, obj);
        },

        read: function read(id) {
          return readChart(id);
        },

        list: function list() {
          return listCharts(charts);
        },

        update: function update(id, obj) {
          return updateChart(id, obj);
        },

        destroy: function destroy(id) {
          return destroyChart(id);
        },

        listen: function listen(id, type) {
          return;
        },

        dispatch: function dispatch() {
          return d3.keys(dispatcher);
        },

        wat: function wat() {
          console.info("ChartTool v" + settings.version + " is a free, open-source chart generator and front-end library maintained by The Globe and Mail. For more information, check out our GitHub repo: www.github.com/globeandmail/chart-tool");
        },

        version: settings.version,
        build: settings.build,
        settings: require("./config/chart-settings"),
        charts: require("./charts/manager"),
        components: require("./charts/components/components"),
        helpers: require("./helpers/helpers"),
        utils: require("./utils/utils"),
        line: require("./charts/types/line"),
        area: require("./charts/types/area"),
        stackedArea: require("./charts/types/stacked-area"),
        column: require("./charts/types/column"),
        stackedColumn: require("./charts/types/stacked-column"),
        streamgraph: require("./charts/types/streamgraph")

      }

    })();

    if (!root.Meteor) { ChartTool.init(); }

  } else {

    if (!root.Meteor) {
      console.error("Chart Tool: no D3 library detected.");
    }

  }

  root.ChartTool = ChartTool;

})(typeof window !== "undefined" ? window : this);
