import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import {
  baseClass,
  debounce as debounceTime,
  prefix,
  version,
  build
} from './config/chart-settings';
import {
  clearDrawn,
  clearObj,
  clearChart,
  getBounding,
  svgTest,
  generateThumb,
  debounce as debounceFn
} from './utils/utils';

export default (root => {

  'use strict';

  const Meteor = this.Meteor || {},
    isServer = Meteor.isServer || undefined;

  if (!isServer) {

    const ChartTool = (function ChartTool() {

      const charts = root.__charttool || [],
        dispatchFunctions = root.__charttooldispatcher || [],
        drawn = [];

      const dispatcher = dispatch('start', 'finish', 'redraw', 'mouseOver', 'mouseMove', 'mouseOut', 'click');

      for (let prop in dispatchFunctions) {
        if (dispatchFunctions.hasOwnProperty(prop)) {
          if (Object.keys(dispatcher).indexOf(prop) > -1) {
            dispatcher.on(prop, dispatchFunctions[prop]);
          } else {
            console.log(`Chart Tool does not offer a dispatcher of type ${prop}. For available dispatcher types, please see the ChartTool.dispatch() method.`);
          }
        }
      }

      /**
       * Clears previous iterations of chart objects stored in obj or the drawn array, then punts chart construction to the Chart Manager.
       * @param  {String} container A string representing the container's selector.
       * @param  {Object} obj       The chart ID and embed data.
       */
      function createChart(container, obj) {

        dispatcher.start(obj);

        drawn = clearDrawn(drawn, obj);
        obj = clearObj(obj);
        container = clearChart(container);

        var ChartManager = require('./charts/manager');

        obj.data.width = getBounding(container, 'width');
        obj.dispatch = dispatcher;

        var chartObj;

        if (svgTest(root)) {
          chartObj = ChartManager(container, obj);
        } else {
          generateThumb(container, obj, settings);
        }

        drawn.push({ id: obj.id, chartObj: chartObj });
        obj.chartObj = chartObj;

        select(container)
          .on('click', () => dispatcher.click(this, chartObj))
          .on('mouseover', () => dispatcher.mouseOver(this, chartObj))
          .on('mousemove', () => dispatcher.mouseMove(this, chartObj))
          .on('mouseout', () => dispatcher.mouseOut(this, chartObj));

        dispatcher.finish(chartObj);

      }

      /**
       * Grabs data on a chart based on an ID.
       * @param {Array} charts Array of charts on the page.
       * @param  {String} id The ID for the chart.
       * @return {Object}    Returns stored embed object.
       */
      function readChart(id) {
        for (let i = 0; i < charts.length; i++) {
          if (charts[i].id === id) {
            return charts[i];
          }
        }
      }

      /**
       * List all the charts stored in the Chart Tool by chartid.
       * @param {Array} charts Array of charts on the page.
       * @return {Array}       List of chartid's.
       */
      function listCharts(charts) {
        const chartsArr = [];
        for (let i = 0; i < charts.length; i++) {
          chartsArr.push(charts[i].id);
        }
        return chartsArr;
      }

      function updateChart(id, obj) {
        const container = `.${baseClass()}[data-chartid=${prefix}${id}]`;
        createChart(container, { id: id, data: obj });
      }

      function destroyChart(id) {
        let container, obj;
        for (let i = 0; i < charts.length; i++) {
          if (charts[i].id === id) {
            obj = charts[i];
          }
        }
        container = `.${baseClass()}[data-chartid=${obj.id}]`;
        clearDrawn(drawn, obj);
        clearObj(obj);
        clearChart(container);
      }

      /**
       * Iterate over all the charts, draw each chart into its respective container.
       * @param {Array} charts Array of charts on the page.
       */
      function createLoop(charts) {
        const chartList = listCharts(charts);
        for (let i = 0; i < chartList.length; i++) {
          let obj = readChart(chartList[i]);
          let container = `.${baseClass()}[data-chartid=${chartList[i]}]`;
          createChart(container, obj);
        }
      }

      /**
       * Chart Tool initializer which sets up debouncing and runs the createLoop(). Run only once, when the library is first loaded.
       * @param {Array} charts Array of charts on the page.
       */
      function initializer(charts) {
        createLoop(charts);
        const debouncer = debounceFn(createLoop, charts, debounceTime, root);
        select(root)
          .on(`resize.${prefix}debounce`, debouncer)
          .on(`resize.${prefix}redraw`, dispatcher.redraw(charts));
      }

      return {
        init: function init() { return initializer(charts); },
        create: function create(container, obj) { return createChart(container, obj); },
        read: function read(id) { return readChart(id); },
        list: function list() { return listCharts(charts); },
        update: function update(id, obj) { return updateChart(id, obj); },
        destroy: function destroy(id) { return destroyChart(id); },
        dispatch: function dispatch() { return Object.keys(dispatcher); },
        version: version,
        build: build,
        wat: function wat() {
          console.log(`ChartTool v${version} is a free, open-source chart generator and front-end library maintained by The Globe and Mail. For more information, check out our GitHub repo: www.github.com/globeandmail/chart-tool`);
        }
      };

    })();

    if (!root.Meteor) { ChartTool.init(); }
    root.ChartTool = ChartTool;

  }

})(typeof window !== 'undefined' ? window : this);
