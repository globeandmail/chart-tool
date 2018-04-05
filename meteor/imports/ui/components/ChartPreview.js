import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Chart from './Chart';

export default class ChartPreview extends Component {

  constructor(props) {
    super(props);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(text, type) {
    Meteor.call(`charts.update.${type}`, this.props.match.params._id, text, err => {
      if (err) console.log(err);
    });
  }

  // need to determine which methods will require thumbnail generation
  // when updating, need to set chart as inactive and then as active

  render() {
    return (
      <div className='chart-preview'>
        <div className='desktop-preview'>
          <h5>Desktop</h5>
          { !this.props.loading ?
            <Chart
              type={'desktop'}
              chart={this.props.chart}
              editable={true}
              share_data={false}
              social={false}
              handleFieldChange={this.handleFieldChange}
            /> : null
          }
        </div>

        <div className='mobile-preview'>
          <h5>Mobile</h5>
          { !this.props.loading ?
            <Chart
              type={'mobile'}
              chart={this.props.chart}
              editable={true}
              share_data={false}
              social={false}
              handleFieldChange={this.handleFieldChange}
            /> : null
          }
        </div>
      </div>
    );
  }

}
