import { csvToTable } from '../../utils/utils';
import { select } from 'd3-selection';
import 'd3-selection-multi';

/**
 * Data sharing button module.
 * @module charts/components/share-data
 */

export default function shareData(node, obj) {

  const chartContainer = select(node);

  let chartMeta = chartContainer.select(`.${obj.prefix}chart_meta`);

  if (chartMeta.node() === null) {
    chartMeta = chartContainer
      .append('div')
      .attr('class', `${obj.prefix}chart_meta`);
  }

  const chartDataBtn = chartMeta
    .append('div')
    .attr('class', `${obj.prefix}chart_meta_btn`)
    .html('data');

  const chartData = chartContainer
    .append('div')
    .attr('class', `${obj.prefix}chart_data`);

  const chartDataCloseBtn = chartData
    .append('div')
    .attr('class', `${obj.prefix}chart_data_close`)
    .html('&#xd7;');

  const chartDataTable = chartData
    .append('div')
    .attr('class', `${obj.prefix}chart_data_inner`);

  chartData
    .append('h2')
    .html(obj.heading);

  const chartDataNav = chartData
    .append('div')
    .attr('class', `${obj.prefix}chart_data_nav`);

  const csvDLBtn = chartDataNav
    .append('a')
    .attr('class', `${obj.prefix}chart_data_btn csv`)
    .html('download csv');

  csvToTable(chartDataTable, obj.data.csv);

  chartDataBtn.on('click', () => {
    chartData.classed(`${obj.prefix}active`, true);
  });

  chartDataCloseBtn.on('click', () => {
    chartData.classed(`${obj.prefix}active`, false);
  });

  csvDLBtn.on('click', function() {
    select(this)
      .attrs({
        'href': `data:text/plain;charset=utf-8,${encodeURIComponent(obj.data.csv)}`,
        'download': `data_${obj.id}.csv`
      });
  });

  return {
    meta_nav: chartMeta,
    data_panel: chartData
  };

}
