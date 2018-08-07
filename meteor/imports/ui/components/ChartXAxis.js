import React, { Component } from 'react';
import { updateAndSave } from '../../modules/utils';

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
  { id: 'scaleOrdinalTime', value: 'Ordinal-Time' }
];

export default class ChartXAxis extends Component {

  constructor(props) {
    super(props);
    this.handlePrefix = this.handlePrefix.bind(this);
    this.handleSuffix = this.handleSuffix.bind(this);
    this.handleFormatVal = this.handleFormatVal.bind(this);
    this.handleScale = this.handleScale.bind(this);
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

  render() {
    return (
      <div className='edit-box'>
        <h3 id='ChartXAxis' onClick={this.props.toggleCollapseExpand}>X-axis</h3>
        <div className={`unit-edit ${this.props.expandStatus('ChartXAxis')}`}>
          { this.props.chart.options.type === 'bar' ?
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
            :
            <div className='unit-edit x-axis-scale-edit'>
              <h4>Scale</h4>
              <form action='' className='radio-buttons'>
                <ul>
                  {scales.map(s => {
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
          }
        </div>
      </div>
    );
  }

}
