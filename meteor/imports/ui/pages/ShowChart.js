import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { matchPath } from 'react-router';
import Tags from '../../api/Tags/Tags';
import Charts from '../../api/Charts/Charts';
import Header from '../components/Header';
import Chart from '../components/Chart';
import Footer from '../components/Footer';
import createBrowserHistory from 'history/createBrowserHistory';
import { withTracker } from 'meteor/react-meteor-data';
import { timeSince, prettyCreatedAt, renderLoading } from '../../modules/utils';

class ShowChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chart: this.props.chart
    };
  }

  forkChart() {
    Meteor.call('forkChart', this.props.id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const history = createBrowserHistory();
        history.push({
          pathname: `/chart/${result}/edit`,
          state: {
            id: result
          }
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.data !== nextProps.chart) {
      const chart = nextProps.chart;
      this.setState({ chart });
    }
  }

  goToChart() {
    const history = createBrowserHistory();
    history.push({
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
          <h3 className='slug'>{ this.state.chart.slug }</h3>
          <div className='chart-links'>
            <h3 className='edit'><a onClick={this.goToChart}>Edit</a></h3>
          </div>
        </div>
        <Chart
          editable={false}
          share_data={false}
          social={false}
          exportable={false}
          data={this.state.chart}
        />
        <div className='chart-show_tags'>
          <h4>Tags</h4>
          <ul>
            {this.props.tags.map(d => <li key={d}>{d}</li>)}
          </ul>
        </div>
        <div className='chart-show_dates'>
          <p>Created on { prettyCreatedAt(this.state.chart.createdAt) }</p>
          <p>Last edited { timeSince(this.state.chart.lastEdited) }</p>
        </div>
        <div className='chart-show_fork' onClick={this.forkChart}>Fork this chart</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Header />
        <section>
          <div className='chart-show'>
            {this.props.loading ? renderLoading() : this.renderChart()}
          </div>
        </section>
        <Footer />
      </div>
    );
  }

}

export default withTracker(() => {
  const history = createBrowserHistory(),
    match = matchPath(history.location.pathname, {
      path: '/chart/:id',
      exact: true,
      strict: false
    }),
    subscription = Meteor.subscribe('chart', match.params.id);
  Meteor.subscribe('chart.tags', match.params.id);
  return {
    loading: !subscription.ready(),
    tags: Tags.find().fetch().map(t => t.tagName),
    chart: Charts.findOne({ _id: match.params.id }),
    id: match.params.id
  };
})(ShowChart);
