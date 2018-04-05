import React, { Component } from 'react';
import ChartEmbed from './ChartEmbed';

export default class ChartOutput extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='output'>
        <div className='embed-code'>
          <h3>Embed code <span>(click to select)</span></h3>
          {!this.props.loading ? <ChartEmbed chart={this.props.chart}/> : null}
        </div>
        <div className='download'>
          <h3>Export</h3>
          <button
            value={'web'}
            onClick={this.props.toggleOverlay}
            className='button export-button export-png'>Web-ready PNG</button>
          <button
            value={'print'}
            onClick={this.props.toggleOverlay}
            className='button export-button export-pdf'>Print export</button>
        </div>

      </div>
    );
  }
}
