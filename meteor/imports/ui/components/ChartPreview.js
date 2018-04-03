import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Charts from '../../api/Charts/Charts';
import Chart from './Chart';
import createBrowserHistory from 'history/createBrowserHistory';
import { withTracker } from 'meteor/react-meteor-data';
import { matchPath } from 'react-router';

class ChartPreview extends Component {

  constructor(props) {
    super(props);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.state = {
      chart: this.props.chart
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.chart !== nextProps.chart) {
      const chart = nextProps.chart;
      this.setState({ chart });
    }
  }

  handleFieldChange(text, type) {
    Meteor.call(`charts.update.${type}`, this.props.id, text, err => {
      if (err) console.log(err);
    });
  }

  render() {
    return (
      <div className='chart-preview'>
        <div className='desktop-preview'>
          <h5>Desktop</h5>
          { !this.props.loading ?
            <Chart
              type={'desktop'}
              data={this.state.chart}
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
              data={this.state.chart}
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

export default withTracker(() => {

  const history = createBrowserHistory(),
    match = matchPath(history.location.pathname, {
      path: '/chart/:id/edit',
      exact: true,
      strict: false
    }),
    subscription = Meteor.subscribe('chart', match.params.id);

  return {
    loading: !subscription.ready(),
    id: match.params.id,
    chart: Charts.findOne({ _id: match.params.id })
  };
})(ChartPreview);
