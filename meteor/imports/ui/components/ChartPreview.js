import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Chart from './Chart';
import { renderLoading } from '../../modules/utils';

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

  render() {
    return (
      <div className={this.props.annotationMode ? 'chart-preview chart-preview-annotation' : 'chart-preview'}>
        <div className='desktop-preview'>
          <h5>Desktop</h5>
          { !this.props.loading ?
            <Chart
              type={'desktop'}
              chart={this.props.chart}
              annotationMode={this.props.annotationMode}
              tips={!this.props.annotationMode}
              editable={true}
              share_data={false}
              social={false}
              handleFieldChange={this.handleFieldChange}
              {...this.props}
            /> : renderLoading()
          }
        </div>

        <div className='mobile-preview'>
          <h5>Mobile</h5>
          { !this.props.loading ?
            <Chart
              type={'mobile'}
              chart={this.props.chart}
              annotationMode={this.props.annotationMode}
              tips={!this.props.annotationMode}
              editable={true}
              share_data={false}
              social={false}
              handleFieldChange={this.handleFieldChange}
              {...this.props}
            /> : renderLoading()
          }
        </div>
      </div>
    );
  }

}
