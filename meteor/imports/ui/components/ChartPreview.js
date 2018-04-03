import React, { Component } from 'react';
// import ChartTool from '../../modules/chart-tool';
import ReactFauxDOM from 'react-faux-dom';
import { drawChart } from '../../modules/utils';

export default class ChartPreview extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const container = ReactFauxDOM.createElement('div');
    const chart = this.props.data;
    if (this.props.editable) chart.editable = this.props.editable;
    if (this.props.share) chart.options.share = this.props.share;
    if (this.props.social) chart.options.social = this.props.social;
    // if (this.props.exportable) chart.options.exportable
    drawChart(container, chart);
    return container.toReact();
  }

}
