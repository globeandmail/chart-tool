import line from '../types/line';
import multiline from '../types/multiline';
import area from '../types/area';
import stackedArea from '../types/stacked-area';
import column from '../types/column';
import bar from '../types/bar';
import stackedColumn from '../types/stacked-column';

export default function plot(node, obj) {
  switch(obj.options.type) {
    case 'line':
      return line(node, obj);
    case 'multiline':
      return multiline(node, obj);
    case 'area':
      return obj.options.stacked ? stackedArea(node, obj) : area(node, obj);
    case 'bar':
      return bar(node, obj);
    case 'column':
      return obj.options.stacked ? stackedColumn(node, obj) : column(node, obj);
    default:
      return line(node, obj);
  }
}
