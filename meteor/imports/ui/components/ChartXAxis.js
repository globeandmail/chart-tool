import React, { Component } from 'react';
import { updateAndSave, isNumber } from '../../modules/utils';
import Swal from 'sweetalert2';

const formats = [
  { format: 'comma', pretty: '1,234' },
  { format: 'general', pretty: '1234' },
  { format: 'round1', pretty: '12.3' },
  { format: 'round2', pretty: '12.34' },
  { format: 'round3', pretty: '12.345' },
  { format: 'round4', pretty: '12.3456' }
];

const scales = [
  { id: 'scaleTime', value: 'Time' },
  { id: 'scaleOrdinal', value: 'Ordinal' },
  { id: 'scaleOrdinalTime', value: 'Ordinal-Time' },
  { id: 'scaleLinear', value: 'Linear' }
];

export default class ChartXAxis extends Component {

  constructor(props) {
    super(props);
    this.shouldDisplayFormatting = this.shouldDisplayFormatting.bind(this);
    this.shouldDisplayScales = this.shouldDisplayScales.bind(this);
    this.shouldDisplayMinMaxTicksNice = this.shouldDisplayMinMaxTicksNice.bind(this);
    this.handlePrefix = this.handlePrefix.bind(this);
    this.handleSuffix = this.handleSuffix.bind(this);
    this.handleFormatVal = this.handleFormatVal.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.handleMin = this.handleMin.bind(this);
    this.handleMax = this.handleMax.bind(this);
    this.handleTicks = this.handleTicks.bind(this);
    this.handleNice = this.handleNice.bind(this);
  }

  shouldDisplayFormatting() {
    if (this.props.chart.options.type === 'bar') return true;
    if (this.props.chart.options.type === 'scatterplot' && this.props.chart.x_axis.scale === 'linear') return true;
    return false;
  }

  shouldDisplayScales() {
    if (this.props.chart.options.type === 'bar') return false;
    if (this.props.chart.options.type === 'scatterplot') return true;
    return true;
  }

  shouldDisplayMinMaxTicksNice() {
    if (this.props.chart.options.type === 'scatterplot' && this.props.chart.x_axis.scale === 'linear') return true;
    return false;
  }

  handlePrefix(event) {
    const prefix = event.target.value;
    updateAndSave('charts.update.x_axis.prefix', this.props.chart._id, prefix);
  }

  handleSuffix(event) {
    const suffix = event.target.value;
    updateAndSave('charts.update.x_axis.suffix', this.props.chart._id, suffix);
  }

  handleFormatVal(event) {
    const format = event.target.value;
    updateAndSave('charts.update.x_axis.format', this.props.chart._id, format);
  }

  handleScale(event) {
    const scale = event.target.value;

    if (event.target.value === 'ordinal') {
      this.props.handleCurrentAnnotation('rangeAxis', 'y');
    }

    updateAndSave('charts.update.x_axis.scale', this.props.chart._id, scale);
  }

  handleMin(event) {
    const input = event.target.value,
      minVal = parseInt(input),
      maxVal = parseInt(this.props.chart.x_axis.max);

    if (input === '') {
      updateAndSave('charts.update.x_axis.min', this.props.chart._id, input);
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
      updateAndSave('charts.update.x_axis.min', this.props.chart._id, input);
      return;
    }

    if (isNumber(minVal) && maxVal) {
      if (minVal < maxVal) {
        updateAndSave('charts.update.x_axis.min', this.props.chart._id, input);
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
      minVal = parseInt(this.props.chart.x_axis.min);

    if (input === '') {
      updateAndSave('charts.update.x_axis.max', this.props.chart._id, input);
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
      updateAndSave('charts.update.x_axis.max', this.props.chart._id, input);
      return;
    }

    if (isNumber(maxVal) && minVal) {
      if (minVal < maxVal) {
        updateAndSave('charts.update.x_axis.max', this.props.chart._id, input);
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
    updateAndSave('charts.update.x_axis.ticks', this.props.chart._id, ticks);
  }

  handleNice(event) {
    const nice = event.target.checked;
    updateAndSave('charts.update.x_axis.nice', this.props.chart._id, nice);
  }

  helpTicks() {
    Swal({
      title: 'Ticks?',
      text: 'Choose how many ticks to display on the X-axis. Only applies to linear-scale scatterplots.',
      type: 'info'
    });
  }

  helpNice() {
    Swal({
      title: 'Niceify?',
      text: 'Enable this to make the Y-axis end on a nice round value. Only applies to linear-scale scatterplots.',
      type: 'info'
    });
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 id='ChartXAxis' onClick={this.props.toggleCollapseExpand}>X-axis</h3>
        <div className={`unit-edit ${this.props.expandStatus('ChartXAxis')}`}>
          { this.shouldDisplayScales() ?
            <div className='unit-edit x-axis-scale-edit'>
              <h4>Scale</h4>
              <form action='' className='radio-buttons'>
                <ul>
                  {scales
                    .filter(s => {
                      if (this.props.chart.options.type !== 'scatterplot' && s.id === 'scaleLinear') {
                        return false;
                      } else {
                        return true;
                      }
                    })
                    .map(s => {
                      return (
                        <li key={s.id}>
                          <input id={s.id}
                            type='radio'
                            name='x-axis-scale'
                            checked={this.props.chart.x_axis.scale === s.value.toLowerCase()}
                            value={s.value.toLowerCase()}
                            onChange={this.handleScale}
                            className='input-radio input-radio-x-scale'
                          />
                          <label htmlFor={s.id}>{s.value}</label>
                        </li>
                      );
                    })}
                </ul>
              </form>
            </div>
            : null }
          { this.shouldDisplayFormatting() ?
            <div className='unit-edit'>
              <h4>Formatting</h4>
              <div className='x-prefix-edit'>
                <input
                  type='text'
                  name='prefix'
                  placeholder='$'
                  className='input-prefix-x input-field'
                  defaultValue={this.props.chart.x_axis.prefix}
                  onBlur={this.handlePrefix}
                />
              </div>
              <div className='x-formatval-edit'>
                <div className='select-wrapper'>
                  <select
                    className='select-formatval-x'
                    value={this.props.chart.x_axis.format}
                    onChange={this.handleFormatVal}
                  >
                    {formats.map(f => {
                      return <option key={f.pretty} value={f.format}>{f.pretty}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className='x-suffix-edit'>
                <input
                  type='text'
                  name='suffix'
                  placeholder='%'
                  className='input-suffix-x input-field'
                  defaultValue={this.props.chart.x_axis.suffix}
                  onBlur={this.handleSuffix}
                />
              </div>
            </div>
            : null }
          { this.shouldDisplayMinMaxTicksNice() ?
            <div>
              <div className='unit-edit x-axisval-edit'>
                <h4>Custom range</h4>
                <span>
                  <input
                    type='number'
                    name='min'
                    placeholder='Min'
                    className='input-min-x input-field'
                    defaultValue={this.props.chart.x_axis.min}
                    onBlur={this.handleMin}
                  />
                  <span className='axisval-to'> to </span>
                  <input
                    type='number'
                    name='max'
                    placeholder='Max'
                    className='input-max-x input-field'
                    defaultValue={this.props.chart.x_axis.max}
                    onBlur={this.handleMax}
                  />
                </span>
              </div>
              <div className='unit-edit x-ticks-edit'>
                <h4>Ticks <a onClick={this.helpTicks} className='help-toggle help-x-ticks-edit'>?</a></h4>
                <input
                  type='number'
                  name='ticks'
                  placeholder='Ticks'
                  className='input-ticks-x input-field'
                  value={this.props.chart.x_axis.ticks === 'auto' ? '' : this.props.chart.x_axis.ticks}
                  onChange={this.handleTicks}
                />
              </div>
              <div className='unit-edit unit-edit-half x-nice-edit'>
                <h4>Niceify <a onClick={this.helpNice} className='help-toggle help-x-nice-edit'>?</a></h4>
                <input
                  className='input-checkbox-x-nice'
                  type='checkbox'
                  name='xNice'
                  checked={this.props.chart.x_axis.nice}
                  onChange={this.handleNice}
                />
              </div>
            </div>
            : null }
        </div>
      </div>
    );
  }

}
