import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import Settings from './config/chart-settings';
import { clearDrawn, clearObj, clearChart, getBounding, svgTest, generateThumb, debounce as debounceFn } from './utils/utils';
import { ChartManager } from './charts/manager';
import 'core-js/library/fn/object/assign';

// CHECK THAT OBJECT.ASSIGN IS GETTING POLYFILLED

export default (root => {

  'use strict';

  const Meteor = this && this.Meteor || {},
    isServer = Meteor.isServer || undefined;

  if (!isServer) {

    const ChartTool = (function ChartTool() {

      const charts = root.__charttool || [],
        dispatchFunctions = root.__charttooldispatcher || [];

      let drawn = [];

      const s = new Settings();

      const dispatcher = dispatch('start', 'finish', 'redraw', 'mouseOver', 'mouseMove', 'mouseOut', 'click');

      for (let prop in dispatchFunctions) {
        if (dispatchFunctions.hasOwnProperty(prop)) {
          if (Object.keys(dispatcher._).indexOf(prop) > -1) {
            dispatcher.on(prop, dispatchFunctions[prop]);
          } else {
            console.log(`Chart Tool does not offer a dispatcher of type ${prop}. For available dispatcher types, please see the ChartTool.dispatch() method.`);
          }
        }
      }

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
        const container = `.${s.baseClass()}[data-chartid=${s.prefix}${id}]`;
        createChart(container, { id: id, data: obj });
      }

      function destroyChart(id) {
        let container, obj;
        for (let i = 0; i < charts.length; i++) {
          if (charts[i].id === id) {
            obj = charts[i];
          }
        }
        container = `.${s.baseClass()}[data-chartid=${obj.id}]`;
        clearDrawn(drawn, obj);
        clearObj(obj);
        clearChart(container);
      }

      function createLoop(charts) {
        const chartList = listCharts(charts);
        for (let i = 0; i < chartList.length; i++) {
          let data = readChart(chartList[i]);
          let container = `.${s.baseClass()}[data-chartid=${chartList[i]}]`;
          createChart(container, data);
        }
      }

      function initializer(charts) {
        createLoop(charts);
        const debouncer = debounceFn(createLoop, charts, s.debounce, root);
        select(root)
          .on(`resize.${s.prefix}debounce`, debouncer)
          .on(`resize.${s.prefix}redraw`, dispatcher.redraw(charts));
      }

      return {
        init: function init() { return initializer(charts); },
        create: function create(container, obj) { return createChart(container, obj); },
        read: function read(id) { return readChart(id); },
        list: function list() { return listCharts(charts); },
        update: function update(id, obj) { return updateChart(id, obj); },
        destroy: function destroy(id) { return destroyChart(id); },
        dispatch: function dispatch() { return Object.keys(dispatcher); },
        version: s.version,
        build: s.build,
        wat: function wat() {
          console.log(`ChartTool v${s.version} is a free, open-source chart generator and front-end library maintained by The Globe and Mail. For more information, check out our GitHub repo: https://github.com/globeandmail/chart-tool`);
        }
      };

    })();

    if (!root.Meteor) { ChartTool.init(); }
    root.ChartTool = ChartTool;

  }

})(typeof window !== 'undefined' ? window : this);
