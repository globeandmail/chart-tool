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
    this.state = {
      expanded: true,
      prefix: this.props.chart.x_axis.prefix,
      formatVal: this.props.chart.x_axis.format,
      suffix: this.props.chart.x_axis.suffix,
      scale: this.props.chart.x_axis.scale
    };
  }

  expandStatus() {
    return this.state.expanded ? 'expanded' : 'collapsed';
  }

  toggleCollapseExpand() {
    const expanded = !this.state.expanded;
    this.setState({ expanded });
  }

  handlePrefix(event) {
    const prefix = event.target.value;
    updateAndSave('charts.update.x_axis.prefix', this.props.chart._id, prefix);
    this.setState({ prefix });
  }

  handleSuffix(event) {
    const suffix = event.target.value;
    updateAndSave('charts.update.x_axis.suffix', this.props.chart._id, suffix);
    this.setState({ suffix });
  }

  handleFormatVal(event) {
    const format = event.target.value;
    updateAndSave('charts.update.x_axis.format', this.props.chart._id, format);
    this.setState({ format });
  }

  handleScale(event) {
    const scale = event.target.value;
    updateAndSave('charts.update.x_axis.scale', this.props.chart._id, scale);
    this.setState({ scale });
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 onClick={() => this.toggleCollapseExpand()}>X-axis</h3>
        <div className={`unit-edit ${this.expandStatus()}`}>
          { this.props.chart.options.type === 'column' || this.props.chart.options.type === 'bar' ?
            <div className='unit-edit'>
              <h4>Formatting</h4>
              <div className='x-prefix-edit'>
                <input
                  type='text'
                  name='prefix'
                  placeholder='$'
                  className='input-prefix-x input-field'
                  defaultValue={this.state.prefix}
                  onBlur={(event) => this.handlePrefix(event)}
                />
              </div>
              <div className='x-formatval-edit'>
                <div className='select-wrapper'>
                  <select className='select-formatval-x' onChange={this.handleFormatVal}>
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
                  defaultValue={this.state.suffix}
                  onBlur={(event) => this.handleSuffix(event)}
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
                          checked={this.state.scale === s.value.toLowerCase()}
                          value={s.value.toLowerCase()}
                          onChange={(event) => this.handleScale(event)}
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
