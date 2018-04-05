import React, { Component } from 'react';
import ChartOverlayWeb from './ChartOverlayWeb';
// import ChartOverlayPrint from './ChartOverlayPrint';

export default class ChartStyling extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.overlay === 'web') {
      return <ChartOverlayWeb
        toggleOverlay={this.props.toggleOverlay}
        {...this.props}
      />;
    }
    if (this.props.overlay === 'print') {
      // return <ChartOverlayPrint
      //   toggleOverlay={this.props.toggleOverlay}
      // />;
    }
    return null;
  }

}
