import React, { Component } from 'react';
import Chart from './Chart';
import { renderLoading } from '../../modules/utils';

export default class ChartPreview extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const previewClass = this.props.annotationMode ?
      `chart-preview chart-preview-annotation chart-preview-annotation-${this.props.currentAnnotation.type}` :
      'chart-preview';
    return (
      <div className={previewClass}>
        <div className='desktop-preview'>
          <h5>Desktop <span>{this.props.annotationMode ? `Annotation mode: ${this.props.currentAnnotation.type}` : ''}</span></h5>
          { !this.props.loading ?
            <Chart
              type={'desktop'}
              chart={this.props.chart}
              annotationMode={this.props.annotationMode}
              currentAnnotation={this.props.currentAnnotation}
              editable={true}
              exportable={false}
              share_data={false}
              social={false}
              {...this.props}
            /> : renderLoading()
          }
        </div>

        <div className='mobile-preview'>
          <h5>Mobile <span>{this.props.annotationMode ? `Annotation mode: ${this.props.currentAnnotation.type}` : ''}</span></h5>
          { !this.props.loading ?
            <Chart
              type={'mobile'}
              chart={this.props.chart}
              annotationMode={this.props.annotationMode}
              currentAnnotation={this.props.currentAnnotation}
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
