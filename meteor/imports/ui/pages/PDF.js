import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { parse as parseQueryString } from 'query-string';
import Charts from '../../api/Charts/Charts';
import Chart from '../components/Chart';
import { withTracker } from 'meteor/react-meteor-data';

class PDF extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='chart-pdf'>
        { !this.props.loading ?
          <Chart
            type={'print'}
            chart={this.props.chart}
            margin={this.props.query.margin}
            editable={false}
            tips={false}
            exportable={true}
            share_data={false}
          /> : null
        }
      </div>
    );
  }

}

export default withTracker(props => {
  const subscription = Meteor.subscribe('chart', props.match.params._id),
    query = parseQueryString(props.history.location.search);
  return {
    loading: !subscription.ready(),
    chart: Charts.findOne({ _id: props.match.params._id }),
    query
  };
})(PDF);
