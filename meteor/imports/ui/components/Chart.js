import React, { Component } from 'react';
import { drawChart, removeNbsp } from '../../modules/utils';
import { app_settings } from '../../modules/settings';
import '../../modules/chart-tool';
import '../../modules/cursorManager';

export default class Chart extends Component {

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.titleBlur = this.titleBlur.bind(this);
    this.qualifierBlur = this.qualifierBlur.bind(this);
    this.sourceBlur = this.sourceBlur.bind(this);
    this.state = {
      width: 0,
      height: 0
    };
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
    this.props.handleFieldChange(text, 'heading');
  }

  qualifierBlur(event) {
    event.preventDefault();
    const text = removeNbsp(event.target.innerText).trim();
    this.props.handleFieldChange(text, 'qualifier');
  }

  sourceBlur(event) {
    event.preventDefault();
    const currText = event.target.textContent;
    let text;
    if (currText === app_settings.chart.source + app_settings.source_suffix || currText === '') {
      event.target.textContent = app_settings.chart.source;
      text = app_settings.chart.source;
    } else {
      text = removeNbsp(currText).trim();
    }
    this.props.handleFieldChange(text, 'source');
  }

  sourceClick(event) {
    event.preventDefault();
    const currText = event.target.textContent.trim();
    if (currText === app_settings.chart.source || currText === '') {
      event.target.textContent = app_settings.chart.source + app_settings.source_suffix;
    }
    window.cursorManager.setEndOfContenteditable(event.target);
  }

  componentChangeFunction() {
    const chart = this.props.data;
    if (this.props.editable || this.props.editable === false) chart.editable = this.props.editable;
    if (this.props.share_data || this.props.share_data === false) chart.options.share_data = this.props.share_data;
    if (this.props.social || this.props.social === false) chart.options.social = this.props.social;

    const errors = drawChart(this.chartRef.current, chart);

    if (!errors && this.props.editable) {
      const title = this.chartRef.current.querySelector('.editable-chart_title'),
        qualifier = this.chartRef.current.querySelector('.editable-chart_qualifier'),
        source = this.chartRef.current.querySelector('.editable-chart_source');

      title.addEventListener('blur', this.titleBlur);
      qualifier.addEventListener('blur', this.qualifierBlur);
      source.addEventListener('click', this.sourceClick);
      source.addEventListener('blur', this.sourceBlur);
    } else if (errors) {
      this.chartRef.current.innerHTML = this.drawError(errors);
    }
  }

  componentDidMount() {
    this.componentChangeFunction();
  }

  componentDidUpdate() {
    this.componentChangeFunction();
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
    window.ChartTool.destroy(this.chartRef.current);
  }

  render() {
    return <div className='chart-wrapper' ref={this.chartRef} />;
  }

}
