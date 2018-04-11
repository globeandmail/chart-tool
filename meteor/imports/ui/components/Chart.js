import React, { Component } from 'react';
import { drawChart, removeNbsp, generateMeasurements, updateAndSave, extend } from '../../modules/utils';
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

  return JSON.stringify(obj);
}

export default class Chart extends Component {

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.titleBlur = this.titleBlur.bind(this);
    this.qualifierBlur = this.qualifierBlur.bind(this);
    this.sourceBlur = this.sourceBlur.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
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
    const currText = event.target.textContent;
    let text;
    if (currText === `${app_settings.chart.source}${app_settings.source_suffix}` || !currText) {
      text = app_settings.chart.source;
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

  handleHighlight(event) {

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
    const rectBar = this.chartRef.current.querySelectorAll(`.${prefix}series_group g.${prefix}bar`),
      rectCol = this.chartRef.current.querySelectorAll(`.${prefix}series_group g.${prefix}column`);
    for (let i = 0; i < rectBar.length; i++) {
      rectBar[i].addEventListener('click', this.handleHighlight);
    }
    for (let i = 0; i < rectCol.length; i++) {
      rectCol[i].addEventListener('click', this.handleHighlight);
    }
  }

  componentChangeFunction() {
    const chart = extend(this.props.chart);

    if ('editable' in this.props) chart.editable = this.props.editable;
    if ('share_data' in this.props) chart.options.share_data = this.props.share_data;
    if ('social' in this.props) chart.options.social = this.props.social;
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

    if (this.props.annotationMode) chart.options.tips = false;

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
