import { axisManager as Axis, axisCleanup, addZeroLine } from '../components/axis';
import { scaleManager as Scale } from '../components/scale';
import 'd3-selection-multi';
import { createVoronoi } from '../../utils/utils';
// import { gridify } from '../../utils/dataparse';

export default function scatterplotChart(node, obj) {

  const xScaleObj = new Scale(obj, 'xAxis'),
    yScaleObj = new Scale(obj, 'yAxis'),
    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  const xAxisObj = new Axis(node, obj, xScaleObj.scale, 'xAxis'),
    yAxisObj = new Axis(node, obj, yScaleObj.scale, 'yAxis');

  axisCleanup(node, obj, xAxisObj, yAxisObj);

  if (obj.data.seriesAmount === 1) {
    obj.seriesHighlight = () => { return 0; };
  }

  const seriesGroup = node.append('g')
    .attrs({
      'class': `${obj.prefix}series_group`
    });

  const dotItem = seriesGroup
    .selectAll(`.${obj.prefix}dot`)
    .data(obj.data.data).enter()
    .append('circle')
    .attrs({
      'class': (d, i) => `${obj.prefix}dot ${obj.prefix}dot-${i}`,
      'data-key': d => d.key,

      // 'class': function (d, i, o) {
        // const category = (d.series.length > 1) ? d.series[d.series.length-1].val : undefined;
        //
        // let index = obj.data.keys.indexOf(category)-1;
        //     index = (index < 0) ? 0 : index;
        // let cx = xScale(d.key) + xAxisPadding;
        // let cy = yScale(d.series[0].val);
        //
        // o[i].setAttribute('cx', cx);
        // o[i].setAttribute('cy', cy);
        //
        // voronoiData.push([{
        //   'obj':o[i],
        //   'x': cx,
        //   'y': cy,
        //   'xd': {key:obj.xAxis.label, val:d.key},
        //   'yd': {key:obj.yAxis.label, val:d.series[0].val},
        //   'category': category
        // }]);
        // return ((obj.prefix) + obj.options.type + ' ' + (obj.prefix) + obj.options.type + '-' + index);
      // },
      'cx': d => xScale(d.series[0].val),
      'cy': d => yScale(d.series[1].val),
      'r': obj.dimensions.scatterplotRadius
    });

  // dotItem.append('circle')
  //   .attrs({
  //
  //   });

  // obj.xAxis.label = obj.data.data.columns[0];
  // obj.yAxis.label = obj.data.data.columns[1];

  // const yScaleObj = new Scale(obj, 'yAxis'),
  //   xScaleObj = new Scale(obj, 'xAxis'),
  //   xScale = xScaleObj.scale, yScale = yScaleObj.scale;
  //
  // const yAxisObj = new Axis(node, obj, yScaleObj.scale, 'yAxis'),
  //   xAxisObj = new Axis(node, obj, xScaleObj.scale, 'xAxis');
  //
  // const xAxisPadding = obj.dimensions.computedWidth() - obj.dimensions.tickWidth();
  //
  // switch(xScaleObj.obj.type){
  //   case 'ordinal-time':
  //   case 'ordinal':
  //     xScale
  //       .range([0, obj.dimensions.tickWidth()])
  //       .padding(0);
  //     break;
  //   case 'linear':
  //     xScale.range([0, obj.dimensions.tickWidth()]);
  //     break;
  // }
  //
  // axisCleanup(node, obj, xAxisObj, yAxisObj);
  //
  // addZeroLine(obj, node, yAxisObj, 'yAxis');
  //
  // if (xScaleObj.obj.type !== 'ordinal-time') {
  //   addZeroLine(obj, node, xAxisObj, 'xAxis');
  // }

  // const voronoi = new createVoronoi(xAxisPadding, 0, obj.dimensions.computedWidth(), obj.dimensions.yAxisHeight());
  //
  // const voronoiGrid = node.append('g')
  //   .attr('class', obj.prefix + obj.options.type + '-voronoi');
  //
  // let voronoiData = [];
  //
  // obj.voronoi = voronoi;
  // obj.voronoi.data = voronoiData;
  // obj.voronoi.grid = voronoiGrid;

  // const dotItem = seriesGroup
  //   .selectAll(('.' + (obj.prefix) + obj.options.type))
  //   .data(obj.data.data).enter()
  //   .append('circle')
  //   .attrs({
  //     'class': function(d,i,o){
  //       const category = (d.series.length > 1) ? d.series[d.series.length-1].val : undefined;
  //
  //       let index = obj.data.keys.indexOf(category)-1;
  //           index = (index < 0) ? 0 : index;
  //       let cx = xScale(d.key) + xAxisPadding;
  //       let cy = yScale(d.series[0].val);
  //
  //       o[i].setAttribute('cx', cx);
  //       o[i].setAttribute('cy', cy);
  //
  //       voronoiData.push([{
  //         'obj':o[i],
  //         'x': cx,
  //         'y': cy,
  //         'xd': {key:obj.xAxis.label, val:d.key},
  //         'yd': {key:obj.yAxis.label, val:d.series[0].val},
  //         'category': category
  //       }]);
  //       return ((obj.prefix) + obj.options.type + ' ' + (obj.prefix) + obj.options.type + '-' + index);
  //     }
  //   });

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj
  };

}
