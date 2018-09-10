import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Chart from './Chart';
import { app_settings } from '../../modules/settings';
import { isNumber, updateAndSave, generateMeasurements } from '../../modules/utils';
import fileSaver from 'file-saver';

const columns = [
  { format: '1col', pretty: '1 column' },
  { format: '2col', pretty: '2 columns' },
  { format: '3col', pretty: '3 columns' },
  { format: '4col', pretty: '4 columns' }
];

export default class ChartOverlayPrint extends Component {

  constructor(props) {
    super(props);
    this.handleExport = this.handleExport.bind(this);
    this.togglePrintMode = this.togglePrintMode.bind(this);
    this.handleColumns = this.handleColumns.bind(this);
    this.handleLines = this.handleLines.bind(this);
    this.handleMMDimension = this.handleMMDimension.bind(this);
    this.state = {
      active: true
    };
  }

  handleExport(event) {
    event.preventDefault();

    this.setState({ active: false });

    const print = generateMeasurements(this.props.chart.print),
      filename = `${this.props.chart.slug}-print-${print.name}.pdf`;

    Meteor.call('charts.pdf.download', this.props.chart._id, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        const blob = new Blob([response], { type: 'application/pdf' });
        fileSaver.saveAs(blob, filename);
        this.setState({ active: true });
      }
    });
  }

  handleColumns(event) {
    updateAndSave('charts.update.print.columns', this.props.chart._id, event.target.value);
  }

  handleLines(event) {
    const lines = Number(event.target.value);
    if (isNumber(lines) && lines > 0) {
      updateAndSave('charts.update.print.lines', this.props.chart._id, Math.round(lines));
    }
  }

  togglePrintMode(event) {
    updateAndSave('charts.update.print.mode', this.props.chart._id, event.target.value);
  }

  handleMMDimension(event) {
    updateAndSave(`charts.update.print.${event.target.name}`, this.props.chart._id, event.target.value);
  }

  renderColumns() {
    return (
      <div className='print-export-form print-export-form-columns'>
        <ul>
          {columns.map(c => {
            return (
              <li key={c.format}>
                <input
                  name='columns'
                  id={`print-${c.format}`}
                  type='radio'
                  value={c.format}
                  className='input-radio'
                  checked={c.format === this.props.chart.print.columns}
                  onChange={this.handleColumns}
                />
                <label htmlFor={`print-${c.format}`}>{c.pretty}</label>
              </li>
            );
          })}
          <li>
            <input name='lines'
              id='print-lines'
              type='number'
              value={this.props.chart.print.lines}
              className='input-field input-lines'
              placeholder='20'
              onChange={this.handleLines}
            />
            <label htmlFor='print-lines'>Lines</label>
          </li>
        </ul>
        <input className='print-export-button_pdf' value='Generate editable PDF' onClick={this.handleExport} type='button' />
      </div>
    );
  }

  renderMM() {
    return (
      <div className='print-export-form print-export-form-millimetres'>
        <ul>
          <li>
            <input
              step='0.01'
              min='1'
              max='150'
              name='width'
              id='print-width'
              type='number'
              className='input-field input-width'
              value={this.props.chart.print.width || app_settings.print.column_width}
              onChange={this.handleMMDimension}
            />
            <label htmlFor='print-width'>mm wide</label>
          </li>
          <li>
            <input
              step='0.01'
              min='1'
              max='150'
              name='height'
              id='print-height'
              type='number'
              className='input-field input-height'
              value={this.props.chart.print.height || app_settings.print.column_width}
              onChange={this.handleMMDimension}
            />
            <label htmlFor='print-height'>mm tall</label>
          </li>
        </ul>
        <input className='print-export-button_pdf' value='Download editable PDF' onClick={this.handleExport} type='button' />
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className='overlay-outer' />
        <div className={`overlay-container ${this.state.active ? 'active' : ''}`}>
          <div className='overlay-header'>
            <h3>Print export</h3>
            <button value={'print'} onClick={this.props.toggleOverlay} className='overlay-close'>&times;</button>
          </div>
          <div className='overlay-print print-export'>
            <div className='print-export-preview'>
              <h3>Preview</h3>
              <p>A preview of your exported chart. Note that type will seem small since it&rsquo;s typeset for print.</p>
              <div className='print-export-preview-chart'>
                <Chart
                  type={'print'}
                  chart={this.props.chart}
                  margin={app_settings.print.overall_margin || 0}
                  editable={false}
                  tips={false}
                  exportable={true}
                  share_data={false}
                  social={false}
                />
              </div>
            </div>
            <div className='print-export-options'>
              <h3>Export</h3>
              <p>Print charts can be exported in columns-and-lines mode (at 1col, 2col, 3col and 4col widths, and then selecting a number of lines) and millimetre mode (using exact width and height values).</p>
              <h4>Sizing mode</h4>
              <div className='print-export-mode'>
                <button
                  className={`print-export-mode-button ${this.props.chart.print.mode === 'columns' ? 'active' : ''}`}
                  value={'columns'}
                  onClick={this.togglePrintMode}>
                  Columns</button>
                <button
                  className={`print-export-mode-button ${this.props.chart.print.mode === 'millimetres' ? 'active' : ''}`}
                  value={'millimetres'}
                  onClick={this.togglePrintMode}>
                  Millimetres</button>
              </div>
              { this.props.chart.print.mode === 'millimetres' ?
                this.renderMM() :
                this.renderColumns() }
            </div>
          </div>
        </div>
      </div>
    );
  }

}
