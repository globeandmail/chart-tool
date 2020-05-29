import { csvToTable } from '../../utils/utils';
import { select } from 'd3-selection';
import 'd3-selection-multi';

export default function shareData(node, obj) {

  const chartContainer = select(node);

  let dataBtnClicked;

  let chartMeta = chartContainer.select(`.${obj.prefix}chart_meta`);

  if (chartMeta.node() === null) {
    chartMeta = chartContainer
      .append('div')
      .attr('class', `${obj.prefix}chart_meta`);
  }

  const chartDataBtn = chartMeta
    .append('div')
    .attr('class', `${obj.prefix}chart_meta_btn`)
    .text('Data');

  const chartData = chartContainer
    .append('div')
    .attr('class', `${obj.prefix}chart_data`);

  chartDataBtn.on('click', () => {
    if (!dataBtnClicked) shareDataClicked(node, obj);
    chartData.classed(`${obj.prefix}active`, true);
  });

  return {
    meta_nav: chartMeta,
    data_panel: chartData
  };

}

function shareDataClicked(node, obj) {

  const chartData = select(node)
    .select(`.${obj.prefix}chart_data`);

  const chartDataWrapper = chartData
    .append('div')
    .attr('class', `${obj.prefix}chart_data_wrapper`);

  chartDataWrapper
    .append('p')
    .attr('class', `${obj.prefix}chart_title`)
    .text(obj.heading);

  const chartDataTable = chartDataWrapper
    .append('div')
    .attr('class', `${obj.prefix}chart_data_inner`);

  const chartDataNav = chartDataWrapper
    .append('div')
    .attr('class', `${obj.prefix}chart_data_nav`);

  const csvDLBtn = chartDataNav
    .append('a')
    .attr('class', `${obj.prefix}chart_data_btn csv`)
    .text('Download CSV');

  const chartDataCloseBtn = chartDataNav
    .append('a')
    .attr('class', `${obj.prefix}chart_data_close`)
    .html('Close');

  csvToTable(chartDataTable, obj.data.csv);

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

}
