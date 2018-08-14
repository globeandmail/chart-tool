import React, { Component } from 'react';
import MD5 from 'crypto-js/md5';
import { dataParse, updateAndSave } from '../../modules/utils';
import { app_settings } from '../../modules/settings';
import { parse } from '../../modules/chart-tool';
import { timeFormat } from 'd3-time-format';
import Swal from 'sweetalert2';

const formats = [
  {
    format: '%Y-%m-%d',
    pretty: 'YYYY-MM-DD'
  }, {
    format: '%Y-%d-%m',
    pretty: 'YYYY-DD-MM'
  }, {
    format: '%y-%m-%d',
    pretty: 'YY-MM-DD'
  }, {
    format: '%y-%d-%m',
    pretty: 'YY-DD-MM'
  }, {
    format: '%m-%d-%Y',
    pretty: 'MM-DD-YYYY'
  }, {
    format: '%m-%e-%Y',
    pretty: 'MM-D-YYYY'
  }, {
    format: '%m-%d-%y',
    pretty: 'MM-DD-YY'
  }, {
    format: '%d-%m-%Y',
    pretty: 'DD-MM-YYYY'
  }, {
    format: '%d-%m-%y',
    pretty: 'DD-MM-YY'
  }, {
    format: '%Y',
    pretty: 'YYYY'
  }
];

export default class ChartData extends Component {

  constructor(props) {
    super(props);
    this.shouldDisplayIndex = this.shouldDisplayIndex.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleDateConstruction = this.handleDateConstruction.bind(this);
    this.handleHasHours = this.handleHasHours.bind(this);
    this.handleIndex = this.handleIndex.bind(this);
  }

  shouldDisplayIndex() {
    return this.props.chart.options.type !== 'scatterplot';
  }

  handleData(event) {
    const { data } = dataParse(event.target.value),
      chart = this.props.chart;
    if (data !== chart.data) {

      const hasHighlights = chart.annotations && chart.annotations.highlight && chart.annotations.highlight.length;

      const fields = {
        data: data,
        md5: MD5(data).toString()
      };

      if (hasHighlights) {
        const dateFormat = (chart.x_axis.scale === 'time' || chart.x_axis.scale === 'ordinal-time') ? chart.date_format : undefined;
        const keys = parse(data, dateFormat).data.map(d => d.key.toString());
        const h = chart.annotations.highlight.filter(d => {
          if (keys.indexOf(d.key) !== -1) return d;
        });
        if (h.length !== chart.annotations.highlight.length) {
          fields['annotations.highlight'] = h;
        }
      }

      event.target.value = fields.data;

      updateAndSave('charts.update.multiple.fields', chart._id, fields);
    }
  }

  handleDateConstruction(event) {
    let dateConstruction = event.target.value;

    const dateFormat = this.props.chart.date_format,
      str = ` ${app_settings.chart.time_format}`,
      re = /\s%H:%M/g;

    if (re.test(dateFormat)) dateConstruction += str;

    updateAndSave('charts.update.dateformat', this.props.chart._id, dateConstruction);
  }

  handleHasHours(event) {
    let dateFormat = this.props.chart.date_format;

    const hasHours = event.target.checked,
      str = ` ${app_settings.chart.time_format}`,
      re = /\s%H:%M/g;

    const fields = {
      hasHours
    };

    if (!re.test(dateFormat)) {
      fields.date_format = dateFormat += str;
    } else {
      fields.date_format = dateFormat.replace(str, '');
    }

    updateAndSave('charts.update.multiple.fields', this.props.chart._id, fields);

  }

  handleIndex(event) {
    let indexed = event.target.value;
    if (isNaN(Number(indexed)) || indexed === '') { indexed = false; }
    updateAndSave('charts.update.options.indexed', this.props.chart._id, indexed);
  }

  dateCalc() {
    const today = new Date(),
      format = timeFormat(this.props.chart.date_format);
    return format(today);
  }

  indexSelected() {
    const index = this.props.chart.options.indexed;
    return (index === false || index === undefined) ? '' : Number(index);
  }

  helpDateConstruction() {
    Swal({
      title: 'Date format?',
      text: 'Chart Tool sometimes needs you to tell it how your dates are formatted so it can figure out how to parse them. Make sure your selected date format matches that of your data!',
      type: 'info'
    });
  }

  helpHours() {
    Swal({
      title: 'Hours?',
      text: 'Turn on this feature if your data contains timestamps as well as dates. Make sure your selected date format matches that of your data!',
      type: 'info'
    });
  }

  helpDateCalc() {
    Swal({
      title: 'Your dates should match',
      text: 'This shows an example of how your dates should be formatted so Chart Tool can parse them.',
      type: 'info'
    });
  }

  helpIndex() {
    Swal({
      title: 'Index?',
      text: 'Scale the first value in each series to this value and show all other values relative to this index.',
      type: 'info'
    });
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 id='ChartData' onClick={this.props.toggleCollapseExpand}>Data</h3>
        <div className={`unit-edit ${this.props.expandStatus('ChartData')}`}>

          <div className='unit-edit'>
            <h4>Data</h4>
            <textarea
              type='text'
              name='pasteData'
              placeholder='Paste your spreadsheet data here'
              className='input-data-edit'
              onBlur={this.handleData}
              defaultValue={this.props.chart.data}
            ></textarea>
          </div>

          { this.props.chart.x_axis.scale === 'time' || this.props.chart.x_axis.scale === 'ordinal-time' ?
            <div>
              <div className='unit-edit unit-edit-time time-format-edit'>
                <h4>Date format <a onClick={this.helpDateConstruction} className='help-toggle help-date-construction'>?</a></h4>
                <div className='select-wrapper'>
                  <select
                    className='select-date-construction'
                    value={this.props.chart.date_format.replace('%H:%M', '').trim()}
                    onChange={this.handleDateConstruction}
                  >
                    {formats.map(f => {
                      return <option key={f.pretty} value={f.format}>{f.pretty}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className='unit-edit unit-edit-time time-hours-edit'>
                <h4>Hours <a onClick={this.helpHours} className='help-toggle help-time-hours-edit'>?</a></h4>
                <input
                  className='input-checkbox-hours'
                  type='checkbox'
                  name='Hours'
                  checked={this.props.chart.hasHours}
                  onChange={this.handleHasHours} />
              </div>

              <div className='unit-edit'>
                <h4>Your dates should match <a onClick={this.helpDateCalc} className='help-toggle help-date-calc'>?</a></h4>
                <div className='date-calculation'>{ this.dateCalc() }</div>
              </div>

              { this.shouldDisplayIndex() ?
                <div className='unit-edit index-edit'>
                  <h4>Index <a onClick={this.helpIndex} className='help-toggle help-index-edit'>?</a></h4>
                  <input
                    type='number'
                    name='index'
                    placeholder='100'
                    className='input-index input-field'
                    value={this.props.chart.options.indexed}
                    onChange={this.handleIndex} />
                </div>
                : null }

            </div>
            : null }

          <div className='unit-edit data-download'>
            <a href={`data:text/csv;charset=utf-8,${escape(this.props.chart.data)}`} download={`${this.props.chart.slug}.csv`}>Download data</a>
          </div>

        </div>

      </div>
    );
  }

}
