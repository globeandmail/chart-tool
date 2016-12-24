import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import chartSettings from './config/chart-settings';
import { clearDrawn, clearObj, clearChart, getBounding, svgTest, generateThumb, debounce as debounceFn } from './utils/utils';
import { ChartManager } from './charts/manager';
import 'core-js/library/fn/object/assign';

export default (root => {

  'use strict';

  const Meteor = this && this.Meteor || {},
    isServer = Meteor.isServer || undefined;

  if (!isServer) {

    if (root && !root.ChartTool) {

      const ChartTool = (function ChartTool() {

        let charts, dispatchFunctions;

        let drawn = [];

        const dispatcher = dispatch('start', 'finish', 'redraw', 'mouseOver', 'mouseMove', 'mouseOut', 'click');

        function createChart(cont, chart) {

          dispatcher.call('start', this, chart);

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

        }

        function readChart(id) {
          for (let i = 0; i < charts.length; i++) {
            if (charts[i].id === id) {
              return charts[i];
            }
          }
        }

        function listCharts(charts) {
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

        function createLoop(charts) {
          const chartList = listCharts(charts);
          for (let i = 0; i < chartList.length; i++) {
            let data = readChart(chartList[i]);
            let container = `.${chartSettings.baseClass}[data-chartid=${chartList[i]}]`;
            createChart(container, data);
          }
        }

        function initializer() {
          charts = root.__charttool || [];
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
          createLoop(charts);
          const debouncer = debounceFn(createLoop, charts, chartSettings.debounce, root);
          select(root)
            .on(`resize.${chartSettings.prefix}debounce`, debouncer)
            .on(`resize.${chartSettings.prefix}redraw`, dispatcher.call('redraw', this, charts));
        }

        return {
          init: function init() {
            this.initialized = true;
            document.addEventListener('DOMContentLoaded', initializer);
          },
          create: (container, obj) => {
            return createChart(container, obj);
          },
          read: (id) => {
            return readChart(id);
          },
          list: () => {
            return listCharts(charts);
          },
          update: (id, obj) => {
            return updateChart(id, obj);
          },
          destroy: (id) => {
            return destroyChart(id);
          },
          dispatch: () => {
            return Object.keys(dispatcher);
          },
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
