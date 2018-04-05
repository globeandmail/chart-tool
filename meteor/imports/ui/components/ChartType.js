import React, { Component } from 'react';
import { chartTypeFieldReset, updateAndSave } from '../../modules/utils';

export default class ChartType extends Component {

  constructor(props) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSelectChange(event) {
    const type = event.target.value;
    const fields = chartTypeFieldReset(type);
    updateAndSave('charts.update.multiple.fields', this.props.chart._id, fields, err => {
      if (err) console.log(err);
    });
  }

  render() {
    return (
      <div className='chart-selector'>
        <h3 className='selector-label'>Chart type</h3>
        <span className='selector-button'>
          <div className='select-wrapper'>
            { !this.props.loading ?
              <select
                className='chart-types'
                onChange={this.handleSelectChange}
                value={this.props.chart.options.type}
                >
                {['Line', 'Multiline', 'Area', 'Column', 'Bar'].map(t => {
                  const lower = t.toLowerCase();
                  return <option key={t} value={lower}>{t}</option>;
                })}
              </select> :
              null
            }
          </div>
        </span>
      </div>
    );
  }

}
