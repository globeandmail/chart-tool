/**
 * Sharing Data module.
 * @module charts/components/share_data
 */

function shareDataComponent(node, d) {
	
	
 	var chartContainer = d3.select(node);
 	var chartMeta = chartContainer.append('div').attr('class','ct-chart_meta');
	var chartDataBtn = chartMeta.append('div').attr('class','ct-chart_meta_btn gi-dl-btn').html('data');
	var chartData = chartContainer.append('div').attr('class','ct-chart_data');
	var chartDataCloseBtn = chartData.append('div').attr('class','ct-chart_data_close').html('x');
	var chartDataTable = chartData.append('div').attr('class','ct-chart_data_inner');
	var chartDataHeader = chartData.append('h2').html(d.heading);
	var chartDataNav = chartData.append('div').attr('class','ct-chart_data_nav');
	var csvDLBtn = chartDataNav.append('a').attr('class','ct-chart_data_btn csv').html('download csv');
	chartDataNav.append('div').attr('class','ct-chart_data_btn').html('download json');
	csvToTable(chartDataTable,d.data.csv);
	chartDataBtn.on('click',function(){
		chartData.classed('active',true);
	})
	chartDataCloseBtn.on('click',function(){
		chartData.classed('active',false);
	})
	csvDLBtn.on('click',function(){
	  var dlData = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(d.data.csv);
	  d3.select(this).attr('href',dlData).attr('download','data_'+d.id+'.csv');
	})

  function csvToTable(target,data){
      var parsedCSV = d3.csv.parseRows(data);
      var container = target.append("table").selectAll("tr")
                        .data(parsedCSV).enter()
                        .append("tr").selectAll("td")
                        .data(function(d) { return d; }).enter()
                        .append("td")
                        .text(function(d) { return d; });
    }

	var obj = {meta_nav:chartMeta,data_panel:chartData};
	return obj;
}
module.exports = shareDataComponent;