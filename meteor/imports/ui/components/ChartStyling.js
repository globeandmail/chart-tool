import React, { Component } from 'react';
import { updateAndSave } from '../../modules/utils';
import { app_settings } from '../../modules/settings';
import Swal from 'sweetalert2';

const interpolations = [
  { format: 'linear', pretty: 'Linear' },
  { format: 'step', pretty: 'Step' },
  { format: 'step-before', pretty: 'Step-before' },
  { format: 'step-after', pretty: 'Step-after' },
  { format: 'natural', pretty: 'Natural' }
];

export default class ChartStyling extends Component {

  constructor(props) {
    super(props);
    this.toggleCollapseExpand = this.toggleCollapseExpand.bind(this);
    this.handlePalette = this.handlePalette.bind(this);
    this.handleStacked = this.handleStacked.bind(this);
    this.handleInterpolation = this.handleInterpolation.bind(this);
    this.state = {
      expanded: false
    };
  }

  expandStatus() {
    return this.state.expanded ? 'expanded' : 'collapsed';
  }

  toggleCollapseExpand() {
    const expanded = !this.state.expanded;
    this.setState({ expanded });
  }

  handlePalette(event) {
    const palette = event.target.value;
    updateAndSave('charts.update.class', this.props.chart._id, palette);
  }

  handleStacked(event) {
    const stacked = event.target.checked;

    const fields = {
      'options.stacked': stacked
    };

    if (stacked) {
      fields['y_axis.min'] = '';
      fields['y_axis.max'] = '';
    }

    updateAndSave('charts.update.multiple.fields', this.props.chart._id, fields, err => {
      if (err) console.log(err);
    });
  }

  isStacked() {
    return this.isStackableExpandable() && this.props.chart.options.stacked;
  }

  handleInterpolation(event) {
    const interpolation = event.target.value;
    updateAndSave('charts.update.options.interpolation', this.props.chart._id, interpolation);
  }

  isStackableExpandable() {
    const type = this.props.chart.options.type,
      stackableExpandableTypes = ['area', 'bar', 'column'];
    return stackableExpandableTypes.indexOf(type) === -1 ? false : true;
  }

  isLineChartType() {
    const type = this.props.chart.options.type,
      lineTypes = ['area', 'line', 'stream', 'multiline'];
    return lineTypes.indexOf(type) === -1 ? false : true;
  }

  helpStacked() {
    Swal({
      title: 'Stacked?',
      text: 'Check this box to toggle series stacking and visualize cumulative data.',
      type: 'info',
    });
  }

  helpInterpolation() {
    Swal({
      title: 'Interpolation?',
      text: 'Interpolation refers to the smoothness and curvature of the line. Try it out!',
      type: 'info',
    });
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 onClick={this.toggleCollapseExpand}>Styling</h3>
        <div className={`unit-edit ${this.expandStatus()}`}>
          <div className='unit-edit color-edit'>
            <h4>Pick a colour palette</h4>
            <div className='radio-buttons'>
              <ul>
                {app_settings.palettes.map(d => {
                  const p = d.toLowerCase();
                  return (
                    <li key={p}>
                      <input
                        id={`color-${p}`}
                        type='radio'
                        name='color'
                        value={p}
                        className={`input-radio input-radio-class input-radio-${p}`}
                        checked={this.props.chart.class === p}
                        value={p}
                        onChange={this.handlePalette}
                      />
                      <label htmlFor={`color-${p}`}>{p}</label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          { this.isStackableExpandable() ?
            <div className='unit-edit stacked-edit'>
              <h4>Stacked? <a onClick={this.helpStacked} className='help-toggle help-stacked'>?</a></h4>
              <input
                className='input-checkbox-stacked'
                type='checkbox'
                name='isStacked'
                onChange={this.handleStacked}
                checked={this.isStacked()}
              />
            </div>
          : null }
          { this.isLineChartType() ?
            <div className='unit-edit interpolation-edit'>
              <h4>Interpolation <a onClick={this.helpInterpolation} className='help-toggle help-interpolation'>?</a></h4>
              <div className='select-wrapper'>
                <select
                  className='select-interpolation'
                  value={this.props.chart.options.interpolation}
                  onChange={this.handleInterpolation}
                  >
                  {interpolations.map(d => {
                    return <option key={d.format} value={d.format}>{d.pretty}</option>;
                  })}
                </select>
              </div>
            </div>
          : null }
        </div>
      </div>
    );
  }

}
