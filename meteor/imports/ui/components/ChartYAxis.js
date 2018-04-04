import React, { Component } from 'react';
import { dataParse, updateAndSave, isNumber } from '../../modules/utils';
import { app_settings } from '../../modules/settings';
import { min } from 'd3-array';
import Swal from 'sweetalert2';

const formats = [
  { format: 'comma', pretty: '1,234' },
  { format: 'general', pretty: '1234' },
  { format: 'round1', pretty: '12.3' },
  { format: 'round2', pretty: '12.34' },
  { format: 'round3', pretty: '12.345' },
  { format: 'round4', pretty: '12.3456' }
];

export default class ChartYAxis extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      prefix: this.props.chart.y_axis.prefix,
      formatVal: this.props.chart.y_axis.format,
      suffix: this.props.chart.y_axis.suffix,
      min: this.props.chart.y_axis.min,
      max: this.props.chart.y_axis.max,
      ticks: this.props.chart.y_axis.ticks,
      nice: this.props.chart.y_axis.nice
    };
  }

  expandStatus() {
    return this.state.expanded ? 'expanded' : 'collapsed';
  }

  displayMin() {
    const chart = this.props.chart,
      type = chart.options.type;

    if (type === 'area' || type === 'bar' || type === 'column') {

      const dateFormat = chart.x_axis.scale === 'ordinal' ? undefined : app_settings.chart.date_format,
        ChartToolParser = window.ChartTool.parse,
        cleanCSV = dataParse(chart.data),
        dataObj = ChartToolParser(cleanCSV, dateFormat, chart.options.indexed);

      const mArr = [];

      dataObj.data.map(dataObj.data, d => {
        for (let i = 0; i < d.series.length; i++) {
          mArr.push(Number(d.series[i].val));
        }
      });

      return min(mArr) > 0 ? false : true;
    } else {
      return true;
    }
  }

  toggleCollapseExpand() {
    const expanded = !this.state.expanded;
    this.setState({ expanded });
  }

  handlePrefix(event) {
    const prefix = event.target.value;
    updateAndSave('charts.update.y_axis.prefix', this.props.chart._id, prefix);
    this.setState({ prefix });
  }

  handleSuffix(event) {
    const suffix = event.target.value;
    updateAndSave('charts.update.y_axis.suffix', this.props.chart._id, suffix);
    this.setState({ suffix });
  }

  handleFormatVal(event) {
    const format = event.target.value;
    updateAndSave('charts.update.y_axis.format', this.props.chart._id, format);
    this.setState({ format });
  }

  handleMin(event) {
    const input = event.target.value,
      minVal = parseInt(input),
      maxVal = parseInt(this.state.max);

    if (input === '') {
      updateAndSave('charts.update.y_axis.min', this.props.chart._id, input);
      this.setState({ min: input });
      return;
    }

    if (input !== '' && !isNumber(minVal)) {
      Swal({
        title: 'Check your inputs',
        text: 'Value should be a number.',
        type: 'error',
        confirmButtonColor: '#fff'
      });
      return;
    }

    if (isNumber(minVal) && !maxVal) {
      updateAndSave('charts.update.y_axis.min', this.props.chart._id, input);
      this.setState({ min: input });
      return;
    }

    if (isNumber(minVal) && maxVal) {
      if (minVal < maxVal) {
        updateAndSave('charts.update.y_axis.min', this.props.chart._id, input);
        this.setState({ min: input });
      } else {
        Swal({
          title: 'Check your inputs',
          text: 'Min value should be less than max value.',
          type: 'error',
          confirmButtonColor: '#fff'
        });
      }
      return;
    }

  }

  handleMax(event) {
    const input = event.target.value,
      maxVal = parseInt(input),
      minVal = parseInt(this.state.min);

    if (input === '') {
      updateAndSave('charts.update.y_axis.max', this.props.chart._id, input);
      this.setState({ max: input });
      return;
    }

    if (input !== '' && !isNumber(maxVal)) {
      Swal({
        title: 'Check your inputs',
        text: 'Value should be a number.',
        type: 'error',
        confirmButtonColor: '#fff'
      });
      return;
    }

    if (isNumber(maxVal) && !minVal) {
      updateAndSave('charts.update.y_axis.max', this.props.chart._id, input);
      this.setState({ max: input });
      return;
    }

    if (isNumber(maxVal) && minVal) {
      if (minVal < maxVal) {
        updateAndSave('charts.update.y_axis.max', this.props.chart._id, input);
        this.setState({ max: input });
      } else {
        Swal({
          title: 'Check your inputs',
          text: 'Max value should be greater than min value.',
          type: 'error',
          confirmButtonColor: '#fff'
        });
      }
      return;
    }
  }

  handleTicks(event) {
    const ticks = !event.target.value ? 'auto' : event.target.valu;
    updateAndSave('charts.update.y_axis.ticks', this.props.chart._id, ticks);
    this.setState({ ticks });
  }

  handleNice(event) {
    const nice = event.target.value === 'on' ? true : false;
    updateAndSave('charts.update.y_axis.nice', this.props.chart._id, !nice);
    this.setState({ nice: !nice });
  }

  helpTicks() {
    Swal({
      title: 'Ticks?',
      text: 'Choose how many ticks to display on the Y-axis.',
      type: 'info',
      confirmButtonColor: '#fff'
    });
  }

  helpNice() {
    Swal({
      title: 'Niceify?',
      text: 'Enable this to make the Y-axis end on a nice round value.',
      type: 'info',
      confirmButtonColor: '#fff'
    });
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 onClick={() => this.toggleCollapseExpand()}>Y-axis</h3>
          <div className={`unit-edit ${this.expandStatus()}`}>
          { this.props.chart.options.type !== 'column' && this.props.chart.options.type !== 'bar' ?
            <div>
              <div className='unit-edit'>
                <h4>Formatting</h4>
                <div className='y-prefix-edit'>
                  <input
                    type='text'
                    name='prefix'
                    placeholder='$'
                    className='input-prefix-x input-field'
                    defaultValue={this.state.prefix}
                    onBlur={(event) => this.handlePrefix(event)}
                  />
                </div>
                <div className='y-formatval-edit'>
                  <div className='select-wrapper'>
                    <select className='select-formatval-y' onChange={this.handleFormatVal}>
                      {formats.map(f => {
                        return <option key={f.pretty} value={f.format}>{f.pretty}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className='y-suffix-edit'>
                  <input
                    type='text'
                    name='suffix'
                    placeholder='%'
                    className='input-suffix-y input-field'
                    defaultValue={this.state.suffix}
                    onBlur={(event) => this.handleSuffix(event)}
                  />
                </div>
              </div>
              <div className='unit-edit y-axisval-edit'>
                <h4>Custom range</h4>
                <span>
                  { this.displayMin() === true ?
                    <input
                      type='number'
                      name='min'
                      placeholder='Min'
                      className='input-min-y input-field'
                      defaultValue={this.state.min}
                      onBlur={(event) => this.handleMin(event)}
                    /> : null }
                    { this.displayMin() === true ? <span className='axisval-to'> to </span> : null }
                  <input
                    type='number'
                    name='max'
                    placeholder='Max'
                    className='input-max-y input-field'
                    defaultValue={this.state.max}
                    onBlur={(event) => this.handleMax(event)}
                  />
                </span>
              </div>
              <div className='unit-edit y-ticks-edit'>
                <h4>Ticks <a onClick={this.helpTicks} className='help-toggle help-y-ticks-edit'>?</a></h4>
                <input
                  type='number'
                  name='ticks'
                  placeholder='Ticks'
                  className='input-ticks-y input-field'
                  defaultValue={this.state.ticks}
                  onBlur={(event) => this.handleTicks(event)}
                />
              </div>
            </div>
          : null }
            <div className='unit-edit unit-edit-half y-nice-edit'>
              <h4>Niceify <a onClick={this.helpNice} className='help-toggle help-y-nice-edit'>?</a></h4>
              <input
                className='input-checkbox-y-nice'
                type='checkbox'
                name='yNice'
                checked={this.state.nice}
                onChange={(event) => this.handleNice(event)}
              />
            </div>
        </div>
      </div>
    );
  }

}
