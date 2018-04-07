import React, { Component } from 'react';
import ChartOverlayWeb from './ChartOverlayWeb';
import ChartOverlayPrint from './ChartOverlayPrint';

export default class ChartStyling extends Component {

  constructor(props) {
    super(props);
    this.onEscape = this.onEscape.bind(this);
  }

  onEscape({ keyCode }) {
    if (keyCode === 27 && this.props.overlay) {
      this.props.toggleOverlay({ target: { value: this.props.overlay } });
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onEscape);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEscape);
  }

  render() {
    if (this.props.overlay === 'web') {
      return <ChartOverlayWeb
        toggleOverlay={this.props.toggleOverlay}
        {...this.props}
      />;
    }
    if (this.props.overlay === 'print') {
      return <ChartOverlayPrint
        toggleOverlay={this.props.toggleOverlay}
        {...this.props}
      />;
    }
    return null;
  }

}
