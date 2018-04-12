import React, { Component } from 'react';
import Chart from './Chart';
import { renderLoading } from '../../modules/utils';

export default class ChartPreview extends Component {

  constructor(props) {
    super(props);
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
              editable={true}
              exportable={false}
              share_data={false}
              social={false}
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
              editable={true}
              exportable={false}
              share_data={false}
              social={false}
              {...this.props}
            /> : renderLoading()
          }
        </div>
      </div>
    );
  }

}
