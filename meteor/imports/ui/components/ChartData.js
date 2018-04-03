import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { dataParse } from '../../modules/utils';
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
    this.state = {
      expanded: true,
      data: this.props.chart.data,
      dateConstruction: this.props.chart.date_format,
      hasHours: false,
      index: this.props.chart.index
    };
  }

  expandStatus() {
    return this.state.expanded ? 'expanded' : 'collapsed';
  }

  toggleCollapseExpand() {
    const expanded = !this.state.expanded;
    this.setState({ expanded });
  }

  handleData(event) {
    const data = dataParse(event.target.value);
    this.setState({ data });
    // updateAndSave('updateData', this, data);
    // event.target.value = data;
  }

  handleDateConstruction(event) {

  }

  handleHasHours(event) {

  }

  handleIndex(event) {

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
      type: 'info',
      confirmButtonColor: '#fff'
    });
  }

  helpHours() {
    Swal({
      title: 'Hours?',
      text: 'Turn on this feature if your data contains timestamps as well as dates. Make sure your selected date format matches that of your data!',
      type: 'info',
      confirmButtonColor: '#fff'
    });
  }

  helpDateCalc() {
    Swal({
      title: 'Your dates should match',
      text: 'This shows an example of how your dates should be formatted so Chart Tool can parse them.',
      type: 'info',
      confirmButtonColor: '#fff'
    });
  }

  helpIndex() {
    Swal({
      title: 'Index?',
      text: 'Scale the first value in each series to this value and show all other values relative to this index.',
      type: 'info',
      confirmButtonColor: '#fff'
    });
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 onClick={() => this.toggleCollapseExpand()}>Data</h3>

        <div className={`unit-edit ${this.expandStatus()}`}>

          <div className='unit-edit'>
            <h4>Data</h4>
            <textarea
              type='text'
              name='pasteData'
              placeholder='Paste your spreadsheet data here'
              className='input-data-edit'
              onBlur={() => this.handleData.bind(this)}
              defaultValue={this.state.data}
              ></textarea>
          </div>

          { this.props.chart.x_axis.scale === 'time' || this.props.chart.x_axis.scale === 'ordinal-time' ?
            <div>
              <div className='unit-edit unit-edit-time time-format-edit'>
                <h4>Date format <a onClick={this.helpDateConstruction} className='help-toggle help-date-construction'>?</a></h4>
                <div className='select-wrapper'>
                  <select className='select-date-construction' onChange={this.handleDateConstruction}>
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
                  value={this.state.hasHours}
                  onChange={this.handleHasHours} />
              </div>

              <div className='unit-edit'>
                <h4>Your dates should match <a onClick={this.helpDateCalc} className='help-toggle help-date-calc'>?</a></h4>
                <div className='date-calculation'>{ this.dateCalc() }</div>
              </div>

              <div className='unit-edit index-edit'>
                <h4>Index <a onClick={this.helpIndex} className='help-toggle help-index-edit'>?</a></h4>
                <input
                  type='number'
                  name='index'
                  placeholder='100'
                  className='input-index input-field'
                  value={this.state.index}
                  onChange={this.handleIndex} />
              </div>
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
