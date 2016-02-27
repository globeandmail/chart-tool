/**
 * Sharing Data module.
 * @module charts/components/share_data
 */

/*
This component adds a "data" button to each chart which can be toggled to present the charts data in a tabular form along with buttons allowing the raw data to be downloaded
 */
function shareDataComponent(node, obj) {

 	var chartContainer = d3.select(node);

 	var chartMeta = chartContainer
 		.append('div')
 		.attr('class', obj.prefix + 'chart_meta');

	var chartDataBtn = chartMeta
		.append('div')
		.attr('class', obj.prefix + 'chart_meta_btn')
		.html('data');

	var chartData = chartContainer
		.append('div')
		.attr('class', obj.prefix + 'chart_data');

	var chartDataCloseBtn = chartData
		.append('div')
		.attr('class', obj.prefix + 'chart_data_close')
		.html('&#xd7;');

	var chartDataTable = chartData
		.append('div')
		.attr('class', obj.prefix + 'chart_data_inner');

	var chartDataHeader = chartData
		.append('h2')
		.html(obj.heading);

	var chartDataNav = chartData
		.append('div')
		.attr('class', obj.prefix + 'chart_data_nav');

	var csvDLBtn = chartDataNav
		.append('a')
		.attr('class', obj.prefix + 'chart_data_btn csv')
		.html('download csv');

  var csvToTable = require("../../utils/utils").csvToTable;

	csvToTable(chartDataTable, obj.data.csv);

	chartDataBtn.on('click', function() {
		chartData.classed(obj.prefix + 'active', true);
	});

	chartDataCloseBtn.on('click', function() {
		chartData.classed(obj.prefix + 'active', false);
	});

	csvDLBtn.on('click',function() {
	  var dlData = 'data:text/plain;charset=utf-8,' + encodeURIComponent(obj.data.csv);
	  d3.select(this)
	  	.attr('href', dlData)
	  	.attr('download','data_' + obj.id + '.csv');
	});

	return {
		meta_nav: chartMeta,
		data_panel: chartData
	};

}

module.exports = shareDataComponent;
