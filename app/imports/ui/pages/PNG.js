import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { parse as parseQueryString } from 'query-string';
import Charts from '../../api/Charts/Charts';
import Chart from '../components/Chart';
import { withTracker } from 'meteor/react-meteor-data';

class PNG extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='chart-png'>
        { !this.props.loading ?
          <Chart
            type={'png'}
            chart={this.props.chart}
            width={this.props.query.width}
            height={this.props.query.height}
            dynamicHeight={this.props.query.dynamicHeight}
            margin={this.props.query.margin}
            hideHead={this.props.query.hideHead}
            hideQualifier={this.props.query.hideQualifier}
            hideFooter={this.props.query.hideFooter}
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
})(PNG);
