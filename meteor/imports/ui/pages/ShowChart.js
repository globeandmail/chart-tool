import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Charts from '../../api/Charts/Charts';
import Header from '../components/Header';
import Chart from '../components/Chart';
import Footer from '../components/Footer';
import { withTracker } from 'meteor/react-meteor-data';
import { timeSince, prettyCreatedAt, renderLoading } from '../../modules/utils';

class ShowChart extends Component {

  constructor(props) {
    super(props);
    this.forkChart = this.forkChart.bind(this);
    this.goToChart = this.goToChart.bind(this);
    this.state = {};
  }

  forkChart() {
    Meteor.call('charts.fork', this.props.id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.props.history.push({
          pathname: `/chart/${result}/edit`,
          state: { id: result }
        });
      }
    });
  }

  goToChart() {
    this.props.history.push({
      pathname: `/chart/${ this.props.id }/edit`,
      state: {
        id: this.props.id
      }
    });
  }

  renderChart() {
    return (
      <div>
        <div className='top-line'>
          <h3 className='slug'>{ this.props.chart.slug }</h3>
          <div className='chart-links'>
            <h3 className='edit'><Link to={`/chart/${ this.props.id }/edit`}>Edit</Link></h3>
          </div>
        </div>
        <Chart
          editable={false}
          share_data={false}
          social={false}
          exportable={false}
          chart={this.props.chart}
          tips={true}
        />
        <div className='chart-show_tags'>
          <h4>Tags</h4>
          <ul>
            { this.props.chart.tags.map(d => <li key={d}>{d}</li>) }
          </ul>
        </div>
        <div className='chart-show_dates'>
          <p>Created on { prettyCreatedAt(this.props.chart.createdAt) }</p>
          <p>Last edited { timeSince(this.props.chart.lastEdited) }</p>
        </div>
        <div className='chart-show_fork' onClick={this.forkChart}>Fork this chart</div>
      </div>
    );
  }

  render() {
    if (!this.props.loading && !this.props.chart) {
      return <Redirect to='/404' />;
    }
    return (
      <div>
        <Header {...this.props} />
        <section>
          <div className='chart-show'>
            { this.props.loading ? renderLoading() : this.renderChart() }
          </div>
        </section>
        <Footer />
      </div>
    );
  }

}

export default withTracker(props => {
  const subscription = Meteor.subscribe('chart', props.match.params._id);
  return {
    loading: !subscription.ready(),
    chart: Charts.findOne({ _id: props.match.params._id }),
    id: props.match.params._id,
    props
  };
})(ShowChart);
