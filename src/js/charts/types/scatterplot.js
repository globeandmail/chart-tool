import { axisManager as Axis, axisCleanup, addZeroLine } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import { line } from 'd3-shape';
import { getCurve } from '../../utils/utils';
import 'd3-selection-multi';
import { Voronoi } from '../../utils/utils';
import { gridify } from '../../utils/dataparse';

export default function scatterplotChart(node, obj) {
  let textStr = "Year\tDied in the mission\tDied by suicide\n2002\t4\t0\n2003\t2\t0\n2004\t1\t1\n2005\t1\t0\n2006\t36\t2\n2007\t30\t1\n2008\t32\t4\n2009\t32\t4\n2010\t16\t2\n2011\t4\t12\n2012\t0\t5\n2013\t0\t7\n2014\t0\t11\n2015\t0\t5\n"
  // let textStr = "Year,Died in the mission,Died by suicide\n2002,40,0\n2003,20,0\n2004,10,10\n2005,10,0\n2006,360,20\n2007,300,10\n2008,320,40\n2009,320,40\n2010,160,20\n2011,40,120\n2012,0,50\n2013,0,70\n2014,0,110\n2015,0,50";
  let str = gridify(textStr);

  obj.xAxis.label = obj.data.data.columns[0];
  obj.yAxis.label = obj.data.data.columns[1];

  const 
    yScaleObj = new Scale(obj, 'yAxis'),
    xScaleObj = new Scale(obj, 'xAxis'),
    xScale = xScaleObj.scale, yScale = yScaleObj.scale;
  const
    yAxisObj = new Axis(node, obj, yScaleObj.scale, 'yAxis'),
    xAxisObj = new Axis(node, obj, xScaleObj.scale, 'xAxis');

  const xAxisPadding = obj.dimensions.computedWidth() - obj.dimensions.tickWidth();

  switch(xScaleObj.obj.type){
    case 'ordinal-time':
    case 'ordinal':
      xScale
        .range([0, obj.dimensions.tickWidth()])
        .padding(0);
    break;
    case 'linear':
      xScale.range([0, obj.dimensions.tickWidth()]);
    break;
  }
  axisCleanup(node, obj, xAxisObj, yAxisObj);
  
  addZeroLine(obj, node, yAxisObj, 'yAxis');
  if(xScaleObj.obj.type !== 'ordinal-time'){
    addZeroLine(obj, node, xAxisObj, 'xAxis');
  }
  
  const seriesGroup = node.append('g')
    .attrs({
      'class': (obj.prefix) + 'series_group ' + obj.options.type,
      'transform': function () {
        if (xScaleObj.obj.type === 'ordinal') {
          return ('translate(' + (xScale.bandwidth() / 2) + ',0)');
        }
      }
    });

  const voronoi = new Voronoi(xAxisPadding, 0, obj.dimensions.computedWidth(), obj.dimensions.yAxisHeight());

  const voronoiGrid = node.append('g')
    .attr('class', obj.prefix + obj.options.type + '-voronoi');
  
  let voronoiData = [];
  
  obj.voronoi = voronoi;
  obj.voronoi.data = voronoiData;
  obj.voronoi.grid = voronoiGrid;

  const dotItem = seriesGroup
    .selectAll(('.' + (obj.prefix) + obj.options.type))
    .data(obj.data.data).enter()
    .append('circle')
    .attrs({
      'class': function(d,i,o){
        const category = (d.series.length > 1) ? d.series[d.series.length-1].val : undefined;
        
        let index = obj.data.keys.indexOf(category)-1;
            index = (index < 0) ? 0 : index;
        let cx = xScale(d.key) + xAxisPadding;
        let cy = yScale(d.series[0].val);
        
        o[i].setAttribute('cx', cx);
        o[i].setAttribute('cy', cy);
        
        voronoiData.push([{
          'obj':o[i],
          'x': cx,
          'y': cy,
          'xd': {key:obj.xAxis.label, val:d.key},
          'yd': {key:obj.yAxis.label, val:d.series[0].val},
          'category': category
        }]);
        return ((obj.prefix) + obj.options.type + ' ' + (obj.prefix) + obj.options.type + '-' + index);
      }
    });

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj
  };

}
