import React, { Component } from 'react';
import { dataParse, updateAndSave, isNumber } from '../../modules/utils';
import { min } from 'd3-array';
import Swal from 'sweetalert2';
import { parse } from '../../modules/chart-tool';
import { DebounceInput } from 'react-debounce-input';

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
    this.handlePrefix = this.handlePrefix.bind(this);
    this.handleSuffix = this.handleSuffix.bind(this);
    this.handleFormatVal = this.handleFormatVal.bind(this);
    this.handleMin = this.handleMin.bind(this);
    this.handleMax = this.handleMax.bind(this);
    this.handleTicks = this.handleTicks.bind(this);
    this.handleNice = this.handleNice.bind(this);
  }

  displayMin() {
    const chart = this.props.chart,
      type = chart.options.type;

    if (type === 'area' || type === 'bar' || type === 'column') {

      const dateFormat = chart.x_axis.scale === 'ordinal' ? undefined : this.props.chart.date_format,
        { data } = dataParse(chart.data);

      let dataObj, error;

      try {
        dataObj = parse(data, dateFormat, chart.options.indexed);
      } catch(e) {
        error = e;
      }

      if (error) return;

      const mArr = [];

      dataObj.data.map(d => {
        for (let i = 0; i < d.series.length; i++) {
          mArr.push(Number(d.series[i].val));
        }
      });

      return min(mArr) > 0 ? false : true;
    } else {
      return true;
    }
  }

  handlePrefix(event) {
    const prefix = event.target.value;
    updateAndSave('charts.update.y_axis.prefix', this.props.chart._id, prefix);
  }

  handleSuffix(event) {
    const suffix = event.target.value;
    updateAndSave('charts.update.y_axis.suffix', this.props.chart._id, suffix);
  }

  handleFormatVal(event) {
    const format = event.target.value;
    updateAndSave('charts.update.y_axis.format', this.props.chart._id, format);
  }

  handleMin(event) {
    const input = event.target.value,
      minVal = parseInt(input),
      maxVal = parseInt(this.props.chart.y_axis.max);

    if (input === '') {
      updateAndSave('charts.update.y_axis.min', this.props.chart._id, input);
      return;
    }

    if (input !== '' && !isNumber(minVal)) {
      Swal({
        title: 'Check your inputs',
        text: 'Value should be a number.',
        type: 'error'
      });
      return;
    }

    if (isNumber(minVal) && !maxVal) {
      updateAndSave('charts.update.y_axis.min', this.props.chart._id, input);
      return;
    }

    if (isNumber(minVal) && maxVal) {
      if (minVal < maxVal) {
        updateAndSave('charts.update.y_axis.min', this.props.chart._id, input);
      } else {
        Swal({
          title: 'Check your inputs',
          text: 'Min value should be less than max value.',
          type: 'error'
        });
      }
      return;
    }

  }

  handleMax(event) {
    const input = event.target.value,
      maxVal = parseInt(input),
      minVal = parseInt(this.props.chart.y_axis.min);

    if (input === '') {
      updateAndSave('charts.update.y_axis.max', this.props.chart._id, input);
      return;
    }

    if (input !== '' && !isNumber(maxVal)) {
      Swal({
        title: 'Check your inputs',
        text: 'Value should be a number.',
        type: 'error'
      });
      return;
    }

    if (isNumber(maxVal) && !minVal) {
      updateAndSave('charts.update.y_axis.max', this.props.chart._id, input);
      return;
    }

    if (isNumber(maxVal) && minVal) {
      if (minVal < maxVal) {
        updateAndSave('charts.update.y_axis.max', this.props.chart._id, input);
      } else {
        Swal({
          title: 'Check your inputs',
          text: 'Max value should be greater than min value.',
          type: 'error'
        });
      }
      return;
    }
  }

  handleTicks(event) {
    const ticks = !event.target.value ? 'auto' : event.target.value;
    updateAndSave('charts.update.y_axis.ticks', this.props.chart._id, ticks);
  }

  handleNice(event) {
    const nice = event.target.checked;
    updateAndSave('charts.update.y_axis.nice', this.props.chart._id, nice);
  }

  helpTicks() {
    Swal({
      title: 'Ticks?',
      text: 'Choose how many ticks to display on the Y-axis.',
      type: 'info'
    });
  }

  helpNice() {
    Swal({
      title: 'Niceify?',
      text: 'Enable this to make the Y-axis end on a nice round value.',
      type: 'info'
    });
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 id='ChartYAxis' onClick={this.props.toggleCollapseExpand}>Y-axis</h3>
        <div className={`unit-edit ${this.props.expandStatus('ChartYAxis')}`}>
          { this.props.chart.options.type !== 'bar' ?
            <div>
              <div className='unit-edit'>
                <h4>Formatting</h4>
                <div className='y-prefix-edit'>
                  <DebounceInput
                    minLength={0}
                    debounceTimeout={300}
                    element='input'
                    type='text'
                    name='prefix'
                    placeholder='$'
                    className='input-prefix-y input-field'
                    value={this.props.chart.y_axis.prefix}
                    onChange={this.handlePrefix}
                  />
                </div>
                <div className='y-formatval-edit'>
                  <div className='select-wrapper'>
                    <select
                      className='select-formatval-y'
                      value={this.props.chart.y_axis.format}
                      onChange={this.handleFormatVal}
                    >
                      {formats.map(f => {
                        return <option key={f.pretty} value={f.format}>{f.pretty}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className='y-suffix-edit'>
                  <DebounceInput
                    minLength={0}
                    debounceTimeout={300}
                    element='input'
                    type='text'
                    name='suffix'
                    placeholder='%'
                    className='input-suffix-y input-field'
                    value={this.props.chart.y_axis.suffix}
                    onChange={this.handleSuffix}
                  />
                </div>
              </div>
              <div className='unit-edit y-axisval-edit'>
                <h4>Custom range</h4>
                <span>
                  { this.displayMin() === true ?
                    <DebounceInput
                      minLength={0}
                      debounceTimeout={300}
                      element='input'
                      type='number'
                      name='min'
                      placeholder='Min'
                      className='input-min-y input-field'
                      value={this.props.chart.y_axis.min}
                      onChange={this.handleMin}
                    /> : null }
                  { this.displayMin() === true ? <span className='axisval-to'> to </span> : null }
                  <DebounceInput
                    minLength={0}
                    debounceTimeout={300}
                    element='input'
                    type='number'
                    name='max'
                    placeholder='Max'
                    className='input-max-y input-field'
                    value={this.props.chart.y_axis.max}
                    onChange={this.handleMax}
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
                  value={this.props.chart.y_axis.ticks === 'auto' ? '' : this.props.chart.y_axis.ticks}
                  onChange={this.handleTicks}
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
              checked={this.props.chart.y_axis.nice}
              onChange={this.handleNice}
            />
          </div>
        </div>
      </div>
    );
  }

}
