import 'core-js/library/fn/object/assign';
import chartSettings from './config/chart-settings';
import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import { parse } from './utils/dataparse';
import { ChartManager } from './charts/manager';
import {
  clearDrawn,
  clearObj,
  clearChart,
  getBounding,
  svgTest,
  generateThumb,
  waitForFonts,
  debounce as debounceFn
} from './utils/utils';

export default (root => {

  'use strict';

  const Meteor = this && this.Meteor || {},
    isServer = Meteor.isServer || undefined;

  if (!isServer) {

    if (root) {

      const ChartTool = (function ChartTool() {

        const charts = [];

        if (root.ChartTool && root.ChartTool.length) {
          for (let i = 0; i < root.ChartTool.length; i++) {
            charts.push(root.ChartTool[i]);
          }
        }

        let dispatchFunctions,
          drawn = [],
          fontsLoaded = false;

        const dispatcher = dispatch('start', 'finish', 'redraw', 'mouseOver', 'mouseMove', 'mouseOut', 'click');

        function createChart(cont, chart, callback) {

          dispatcher.call('start', this, chart);

          if (chart.data.chart.drawStart) { chart.data.chart.drawStart(); }

          drawn = clearDrawn(drawn, chart);

          const obj = clearObj(chart);

          const container = clearChart(cont);

          obj.data.width = getBounding(container, 'width');
          obj.dispatch = dispatcher;

          let chartObj;

          if (svgTest(root)) {
            chartObj = new ChartManager(container, obj);
          } else {
            generateThumb(container, obj);
          }

          drawn.push({ id: obj.id, chartObj: chartObj });

          obj.chartObj = chartObj;

          select(container)
            .on('click', () => dispatcher.call('click', this, chartObj))
            .on('mouseover', () => dispatcher.call('mouseOver', this, chartObj))
            .on('mousemove', () => dispatcher.call('mouseMove', this, chartObj))
            .on('mouseout', () => dispatcher.call('mouseOut', this, chartObj));

          dispatcher.call('finish', this, chartObj);
          if (chart.data.chart.drawFinished) { chart.data.chart.drawFinished(); }

          if (callback) { callback(); }

        }

        function readChart(id) {
          for (let i = 0; i < charts.length; i++) {
            if (charts[i].id === id) {
              return charts[i];
            }
          }
        }

        function listCharts() {
          const chartsArr = [];
          for (let i = 0; i < charts.length; i++) {
            chartsArr.push(charts[i].id);
          }
          return chartsArr;
        }

        function updateChart(id, obj) {
          const container = `.${chartSettings.baseClass}[data-chartid=${chartSettings.prefix}${id}]`;
          createChart(container, { id: id, data: obj });
        }

        function destroyChart(id) {
          let container, obj;
          for (let i = 0; i < charts.length; i++) {
            if (charts[i].id === id) {
              obj = charts[i];
            }
          }
          container = `.${chartSettings.baseClass}[data-chartid=${obj.id}]`;
          clearDrawn(drawn, obj);
          clearObj(obj);
          clearChart(container);
        }

        function createLoop() {
          if (charts.length) {
            for (let i = 0; i < charts.length; i++) {
              const chart = charts[i];
              const container = `.${chartSettings.baseClass}[data-chartid=${chart.id}]`;
              createChart(container, chart);
            }
          }
        }

        function initializer() {
          dispatchFunctions = root.__charttooldispatcher || [];
          for (let prop in dispatchFunctions) {
            if (dispatchFunctions.hasOwnProperty(prop)) {
              if (Object.keys(dispatcher._).indexOf(prop) > -1) {
                dispatcher.on(prop, dispatchFunctions[prop]);
              } else {
                console.log(`Chart Tool does not offer a dispatcher of type ${prop}. For available dispatcher types, please see the ChartTool.dispatch() method.`);
              }
            }
          }
          const debouncer = debounceFn(createLoop, chartSettings.debounce, root);
          select(root)
            .on(`resize.${chartSettings.prefix}debounce`, () => {
              dispatcher.call('redraw', this, charts);
              debouncer();
            });
          createLoop();
        }

        return {
          init: function() {
            if (!this.initialized) {
              waitForFonts(chartSettings.fonts).then(() => {
                fontsLoaded = true;
                initializer();
                this.initialized = true;
              }, err => {
                console.log(err);
              });
            }
          },
          // similar to the push method, except this is explicitly invoked by the user
          create: (container, obj, cb) => {
            return createChart(container, obj, cb);
          },
          // push is basically the same as the create method, except for embed-based charts only
          push: (obj, cb) => {
            if (listCharts().indexOf(obj.id) === -1) {
              charts.push(obj);
              const container = `.${chartSettings.baseClass}[data-chartid=${obj.id}]`;
              if (!fontsLoaded) {
                waitForFonts(chartSettings.fonts).then(() => createChart(container, obj, cb));
              } else {
                createChart(container, obj, cb);
              }
            }
          },
          read: id => {
            return readChart(id);
          },
          list: () => {
            return listCharts();
          },
          update: (id, obj) => {
            return updateChart(id, obj);
          },
          destroy: id => {
            return destroyChart(id);
          },
          dispatch: () => {
            return Object.keys(dispatcher);
          },
          parse: parse,
          version: chartSettings.version,
          build: chartSettings.build,
          wat: () => {
            console.log(`ChartTool v${chartSettings.version} is a free, open-source chart generator and front-end library maintained by The Globe and Mail. For more information, check out our GitHub repo: https://github.com/globeandmail/chart-tool`);
          }
        };

      })();

      if (!root.Meteor) { ChartTool.init(); }
      root.ChartTool = ChartTool;

    }

  }

})(typeof window !== 'undefined' ? window : this);
