import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { matchPath } from 'react-router';
import { parse as parseQueryString } from 'query-string';
import Charts from '../../api/Charts/Charts';
import Chart from '../components/Chart';
import createBrowserHistory from 'history/createBrowserHistory';
import { withTracker } from 'meteor/react-meteor-data';
import { app_settings } from '../../modules/settings';
import { determineWidth, determineHeight } from '../../modules/utils';

class PDF extends Component {

  constructor(props) {
    super(props);

    let width, height;

    const magicW = app_settings.print.magic.width,
      magicH = app_settings.print.magic.height;

    if (this.props.query.mode === 'millimetres') {
      width = this.props.query.width * magicW;
      height = this.props.query.height * magicH;
    } else {
      width = determineWidth(this.props.query.columns) * magicW;
      height = determineHeight(this.props.query.lines, width) * magicH;
    }

    const chart = this.props.chart;

    if (!this.props.loading) {
      chart.exportable = {
        width: width,
        height: height,
        dynamicHeight: true,
        x_axis: app_settings.print.x_axis,
        y_axis: app_settings.print.y_axis,
        margin: app_settings.print.margin,
        type: 'pdf',
        barLabelOffset: app_settings.print.barLabelOffset
      };
    }

    this.state = {
      chart,
      width,
      height
    };

  }

  componentWillReceiveProps(nextProps) {
    if (this.state.chart !== nextProps.chart) {
      const chart = nextProps.chart;
      chart.exportable = {
        width: this.state.width,
        height: this.state.height,
        dynamicHeight: true,
        x_axis: app_settings.print.x_axis,
        y_axis: app_settings.print.y_axis,
        margin: app_settings.print.margin,
        type: 'pdf',
        barLabelOffset: app_settings.print.barLabelOffset
      };
      this.setState({ chart });
    }
  }

  render() {
    return (
      <div className='chart-pdf'>
        { !this.props.loading ?
          <Chart
            editable={false}
            share_data={false}
            social={false}
            data={this.state.chart}
          /> : null
        }
      </div>
    );
  }

}

export default withTracker(() => {
  const history = createBrowserHistory(),
    match = matchPath(history.location.pathname, {
      path: '/chart/:id/pdf',
      exact: true,
      strict: false
    }),
    subscription = Meteor.subscribe('chart', match.params.id),
    query = parseQueryString(history.location.search);

  return {
    loading: !subscription.ready(),
    chart: Charts.findOne({ _id: match.params.id }),
    query
  };
})(PDF);
