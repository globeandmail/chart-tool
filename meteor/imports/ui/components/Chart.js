import React, { Component } from 'react';
import { drawChart, removeNbsp, generateMeasurements, updateAndSave, extend, isNumber } from '../../modules/utils';
import { app_settings } from '../../modules/settings';
import '../../modules/cursorManager';
import ChartTool from '../../modules/chart-tool';

function chartPresentationalString(props) {
  const data = extend(props.chart);
  if (props.annotationMode) data.options.tips = false;
  if (props.hideHead) data.options.head = !props.hideHead;
  if (props.hideQualifier) data.options.qualifier = !props.hideQualifier;
  if (props.hideFooter) data.options.footer = !props.hideFooter;
  if ('exportable' in props) data.exportable = {};
  if ('width' in props) data.exportable.width = props.width;
  if ('height' in props) data.exportable.height = props.height;
  const obj = {
    'annotations': data.annotations,
    'class': data.class,
    'data': data.data,
    'date_format': data.date_format,
    'deck': data.deck,
    'hasHours': data.hasHours,
    'heading': data.heading,
    'options.expanded': data.options.expanded,
    'options.indexed': data.options.indexed,
    'options.interpolation': data.options.interpolation,
    'options.stacked': data.options.stacked,
    'options.tips': data.options.tips,
    'options.type': data.options.type,
    'options.head': data.options.head,
    'options.qualifier': data.options.qualifier,
    'options.footer': data.options.footer,
    'print': data.print,
    'qualifier': data.qualifier,
    'range': data.range,
    'series': data.series,
    'source': data.source,
    'time_format': data.time_format,
    'x_axis': data.x_axis,
    'y_axis': data.y_axis,
    'exportable': data.exportable
  };

  if (props.annotationMode) {
    obj.annotationType = props.currentAnnotation.type;
    obj.annotationId = props.currentAnnotation.currId;
    obj.annotationRangeType = props.currentAnnotation.rangeType;
    obj.annotationRangeAxis = props.currentAnnotation.rangeAxis;
    obj.annotationRangeStart = props.currentAnnotation.rangeStart;
    obj.annotationRangeEnd = props.currentAnnotation.rangeEnd;
    obj.annotationTextAlign = props.currentAnnotation.textAlign;
    obj.annotationTextValign = props.currentAnnotation.textValign;
    obj.annotationTextText = props.currentAnnotation.textText;
    obj.annotationTextX = props.currentAnnotation.textX;
    obj.annotationTextY = props.currentAnnotation.textY;
    obj.annotationPointerX1 = props.currentAnnotation.pointerX1;
    obj.annotationPointerY1 = props.currentAnnotation.pointerY1;
    obj.annotationPointerX2 = props.currentAnnotation.pointerX2;
    obj.annotationPointerY2 = props.currentAnnotation.pointerY2;
    obj.annotationPointerCurve = props.currentAnnotation.pointerCurve;
  }

  return JSON.stringify(obj);
}

export default class Chart extends Component {

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.titleBlur = this.titleBlur.bind(this);
    this.qualifierBlur = this.qualifierBlur.bind(this);
    this.sourceBlur = this.sourceBlur.bind(this);
    this.handleHighlightAnnotation = this.handleHighlightAnnotation.bind(this);
    this.handleRangeAnnotation = this.handleRangeAnnotation.bind(this);
    this.handleTextAnnotation = this.handleTextAnnotation.bind(this);
    this.handlePointerAnnotation = this.handlePointerAnnotation.bind(this);
    this.selectRangeAnnotation = this.selectRangeAnnotation.bind(this);
    this.selectTextAnnotation = this.selectTextAnnotation.bind(this);
    this.selectPointerAnnotation = this.selectPointerAnnotation.bind(this);
  }

  componentDidMount() {
    this.componentChangeFunction();
  }

  componentDidUpdate() {
    this.componentChangeFunction();
  }

  shouldComponentUpdate(nextProps) {
    const oldChart = chartPresentationalString(this.props),
      newChart = chartPresentationalString(nextProps);

    return oldChart !== newChart;
  }

  drawError(error) {
    return `<div class='chart-error-container'>
        <div class='chart-error'>
          <img src='/images/error.svg' class='chart-error_img' />
          <p class='chart-error_text'>${error.error}</p>
          <p class='chart-error_reason'>${error.reason}</p>
        </div>
      </div>`;
  }

  titleBlur(event) {
    event.preventDefault();
    const text = removeNbsp(event.target.innerText).trim();
    if (this.props.chart.heading !== text) {
      updateAndSave('charts.update.heading', this.props.chart._id, text);
    }
  }

  qualifierBlur(event) {
    event.preventDefault();
    const text = removeNbsp(event.target.innerText).trim();
    if (this.props.chart.qualifier !== text) {
      updateAndSave('charts.update.qualifier', this.props.chart._id, text);
    }
  }

  sourceBlur(event) {
    event.preventDefault();
    const currText = removeNbsp(event.target.textContent).trim();
    let text;
    if (currText === `${app_settings.chart.source}${app_settings.source_suffix}` || currText === `${app_settings.chart.source}` || !currText) {
      text = app_settings.chart.source;
      event.target.textContent = text;
    } else {
      const newText = currText.replace(`${app_settings.chart.source}${app_settings.source_suffix}`, '').trim();
      text = `${app_settings.chart.source}${app_settings.source_suffix} ${newText}`;
      text = removeNbsp(text).trim();
    }
    if (this.props.chart.source !== text) {
      updateAndSave('charts.update.source', this.props.chart._id, text);
    }
  }

  sourceClick(event) {
    event.preventDefault();
    const currText = event.target.textContent.trim();
    if (currText === app_settings.chart.source || !currText) {
      event.target.textContent = `${app_settings.chart.source}${app_settings.source_suffix}`;
    }
    window.cursorManager.setEndOfContenteditable(event.target);
  }

  handleHighlightAnnotation(event) {

    const chart = this.props.chart,
      key = event.target.parentElement.dataset.key,
      color = this.props.currentAnnotation.highlight;

    let highlight;

    if (chart.annotations && chart.annotations.highlight) {
      highlight = extend(chart.annotations.highlight);
    } else {
      highlight = [];
    }

    const keyIndex = highlight.map(d => d.key).indexOf(key);

    if (keyIndex === -1) {
      highlight.push({ key, color });
    } else {
      if (highlight[keyIndex].color !== color) {
        highlight[keyIndex].color = color;
      } else {
        highlight.splice(keyIndex, 1);
      }
    }

    const h = highlight.filter(d => {
      if (d.color && d.key) return d;
    });

    updateAndSave('charts.update.annotation.highlight', this.props.chart._id, h);

  }

  handleRangeAnnotation(data, id) {

    const keyArr = ['currId', 'rangeAxis', 'rangeStart'],
      valArr = [];

    if (!data) {
      keyArr.push('rangeEnd');
      valArr.push('', 'x', '', '');
      this.props.handleCurrentAnnotation(keyArr, valArr);
      return;
    } else {
      valArr.push(id, data.axis, data.start);
      if (data.end) {
        keyArr.push('rangeEnd');
        valArr.push(data.end);
      }
      this.props.handleCurrentAnnotation(keyArr, valArr);
    }

    if (data && isNumber(id)) {
      const range = (this.props.chart.annotations.range || []).slice();
      range[id] = {
        axis: data.axis,
        start: data.start.toString(),
        end: data.end ? data.end.toString() : ''
      };
      updateAndSave('charts.update.annotation.range', this.props.chart._id, range);
    }

  }

  selectRangeAnnotation(event) {
    const id = parseInt(event.target.classList[1].replace(`${this.props.chart.prefix}annotation_range-`, '')),
      range = this.props.chart.annotations.range[id],
      keyArr = ['currId', 'rangeAxis', 'rangeType', 'rangeStart', 'rangeEnd'],
      valArr = [id, range.axis, range.end ? 'area' : 'line', range.start, range.end || ''];
    this.props.handleCurrentAnnotation(keyArr, valArr);
  }

  handleTextAnnotation(data, id) {

    const keyArr = ['currId', 'textText', 'textX', 'textY'],
      valArr = [];

    if (!data) {
      keyArr.push('textAlign', 'textValign');
      valArr.push('', '', '', '', 'left', 'top');
      this.props.handleCurrentAnnotation(keyArr, valArr);
      return;
    } else {
      valArr.push(id, data.text, data.position.x, data.position.y);
      this.props.handleCurrentAnnotation(keyArr, valArr);
    }

    if (data.text && isNumber(id)) {
      const text = (this.props.chart.annotations.text || []).slice();
      text[id] = {
        text: data.text,
        valign: this.props.currentAnnotation.textValign,
        'text-align': this.props.currentAnnotation.textAlign,
        position: {
          x: data.position.x,
          y: data.position.y,
        }
      };
      updateAndSave('charts.update.annotation.text', this.props.chart._id, text);
    }

  }

  selectTextAnnotation(event) {
    let node = event.target;
    if (event.target.nodeName === 'tspan') node = event.target.parentNode;
    const id = parseInt(node.classList[1].replace(`${this.props.chart.prefix}annotation_text-`, '')),
      text = this.props.chart.annotations.text[id],
      keyArr = ['currId', 'textText', 'textX', 'textY', 'textAlign', 'textValign'],
      valArr = [id, text.text, text.position.x, text.position.y, text['text-align'], text.valign];
    this.props.handleCurrentAnnotation(keyArr, valArr);
  }

  handlePointerAnnotation(data, id) {

    const keyArr = ['currId', 'pointerX1', 'pointerY1', 'pointerX2', 'pointerY2'],
      valArr = [];

    if (!data) {
      keyArr.push('pointerCurve');
      valArr.push('', '', '', '', '', 0.3);
      this.props.handleCurrentAnnotation(keyArr, valArr);
      return;
    } else {
      valArr.push(id, data[0].x, data[0].y, data[1].x, data[1].y);
      this.props.handleCurrentAnnotation(keyArr, valArr);
    }

    if (data && isNumber(id)) {
      const pointer = (this.props.chart.annotations.pointer || []).slice();
      pointer[id] = {
        curve: this.props.currentAnnotation.pointerCurve,
        position: [
          { x: data[0].x, y: data[0].y },
          { x: data[1].x, y: data[1].y }
        ]
      };
      updateAndSave('charts.update.annotation.pointer', this.props.chart._id, pointer);
    }

  }

  selectPointerAnnotation(event) {
    const id = parseInt(event.target.classList[1].replace(`${this.props.chart.prefix}pointer-path-`, '')),
      pointer = this.props.chart.annotations.pointer[id],
      keyArr = ['currId', 'pointerX1', 'pointerY1', 'pointerX2', 'pointerY2', 'pointerCurve'],
      valArr = [id, pointer.position[0].x, pointer.position[0].y, pointer.position[1].x, pointer.position[1].y, pointer.curve];
    this.props.handleCurrentAnnotation(keyArr, valArr);
  }

  chartEditable() {
    const title = this.chartRef.current.querySelector('.editable-chart_title'),
      qualifier = this.chartRef.current.querySelector('.editable-chart_qualifier'),
      source = this.chartRef.current.querySelector('.editable-chart_source');

    title.addEventListener('blur', this.titleBlur);
    qualifier.addEventListener('blur', this.qualifierBlur);
    source.addEventListener('click', this.sourceClick);
    source.addEventListener('blur', this.sourceBlur);
  }

  chartAnnotatable() {
    const prefix = app_settings.chart.prefix;

    if (this.props.currentAnnotation.type === 'highlight') {
      this.chartRef.current
        .querySelectorAll(`.${prefix}series_group g.${prefix}bar, .${prefix}series_group g.${prefix}column`)
        .forEach(barOrCol => {
          barOrCol.addEventListener('click', this.handleHighlightAnnotation);
        });
    }

    if (this.props.currentAnnotation.type === 'text') {
      this.chartRef.current
        .querySelectorAll(`g.${prefix}annotations .${prefix}annotation_text`)
        .forEach(text => {
          text.addEventListener('click', this.selectTextAnnotation);
        });
    }

    if (this.props.currentAnnotation.type === 'pointer') {
      this.chartRef.current
        .querySelectorAll(`g.${prefix}annotations .${prefix}pointer-path`)
        .forEach(pointer => {
          pointer.addEventListener('click', this.selectPointerAnnotation);
        });
    }

    if (this.props.currentAnnotation.type === 'range') {
      // cant select the area ranges because they're underneath
      // the overlay rect, so dont bother with area, just line
      this.chartRef.current
        .querySelectorAll(`g.${prefix}annotations .${prefix}annotation_range`)
        .forEach(range => {
          range.addEventListener('click', this.selectRangeAnnotation);
        });
    }
  }

  componentChangeFunction() {
    const chart = extend(this.props.chart);

    if ('editable' in this.props) chart.editable = this.props.editable;
    if ('share_data' in this.props) chart.options.share_data = this.props.share_data;
    if ('tips' in this.props) chart.options.tips = this.props.tips;

    if (this.props.exportable) {

      chart.exportable = {
        dynamicHeight: this.props.dynamicHeight || true
      };

      if (this.props.type === 'print') {
        const { width, height } = generateMeasurements(chart.print);
        chart.exportable.type = 'pdf';
        chart.exportable.width = width;
        chart.exportable.height = height;
        chart.exportable.x_axis = app_settings.print.x_axis;
        chart.exportable.y_axis = app_settings.print.y_axis;
        chart.exportable.margin = app_settings.print.margin;
        chart.exportable.barLabelOffset = app_settings.print.barLabelOffset;
        if (this.props.margin) {
          chart.exportable.width = chart.exportable.width - (this.props.margin * 2);
          chart.exportable.height = chart.exportable.height - (this.props.margin * 2);
        }
      }

      if (this.props.type === 'png') {
        chart.exportable.type = 'png';
        chart.exportable.width = this.props.width;
        chart.exportable.margin = app_settings.web.margin;
        if (this.props.height) chart.exportable.height = this.props.height;
        if (this.props.hideHead) chart.options.head = !this.props.hideHead;
        if (this.props.hideQualifier) chart.options.qualifier = !this.props.hideQualifier;
        if (this.props.hideFooter) chart.options.footer = !this.props.hideFooter;
        if (this.props.margin) {
          chart.exportable.width = chart.exportable.width - (this.props.margin * 2);
          chart.exportable.height = chart.exportable.height - (this.props.margin * 2);
        }
      }
    }

    if (this.props.annotationMode) {
      chart.options.tips = false;
      chart.annotationHandlers = {
        currId: this.props.currentAnnotation.currId,
        rangeHandler: this.handleRangeAnnotation,
        textHandler: this.handleTextAnnotation,
        highlightHandler: this.handleHighlightAnnotation,
        pointerHandler: this.handlePointerAnnotation,
        type: this.props.currentAnnotation.type,
        rangeType: this.props.currentAnnotation.rangeType,
        rangeAxis: this.props.currentAnnotation.rangeAxis,
        rangeStart: this.props.currentAnnotation.rangeStart.toString(),
        rangeEnd: this.props.currentAnnotation.rangeEnd.toString(),
        'text-align': this.props.currentAnnotation.textAlign,
        valign: this.props.currentAnnotation.textValign,
        textText: this.props.currentAnnotation.textText,
        textX: this.props.currentAnnotation.textX,
        textY: this.props.currentAnnotation.textY,
        pointerCurve: this.props.currentAnnotation.pointerCurve,
        pointerX1: this.props.currentAnnotation.pointerX1,
        pointerY1: this.props.currentAnnotation.pointerY1,
        pointerX2: this.props.currentAnnotation.pointerX2,
        pointerY2: this.props.currentAnnotation.pointerY2
      };
    }

    const errors = drawChart(this.chartRef.current, chart);

    if (errors) {
      this.chartRef.current.innerHTML = this.drawError(errors);
      return;
    }

    if (this.props.editable) this.chartEditable();
    if (this.props.annotationMode) this.chartAnnotatable();

  }

  componentWillUnmount() {
    if (this.props.editable) {
      const title = this.chartRef.current.querySelector('.editable-chart_title'),
        qualifier = this.chartRef.current.querySelector('.editable-chart_qualifier'),
        source = this.chartRef.current.querySelector('.editable-chart_source');

      if (title) title.removeEventListener('blur', this.titleBlur);
      if (qualifier) qualifier.removeEventListener('blur', this.qualifierBlur);
      if (source) source.removeEventListener('click', this.sourceClick);
      if (source) source.removeEventListener('blur', this.sourceBlur);
    }
    ChartTool.destroy(this.chartRef.current);
  }

  render() {
    const style = {};
    if (this.props.margin) {
      style.top = `${this.props.margin}px`;
      style.left = `${this.props.margin}px`;
      style.position = 'absolute';
    }
    return <div className='chart-wrapper' ref={this.chartRef} style={style} />;
  }

}
