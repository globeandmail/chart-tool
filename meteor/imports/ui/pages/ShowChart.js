import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Tags from '../../api/Tags/Tags';
import Charts from '../../api/Charts/Charts';
import Header from '../components/Header';
import ChartPreview from '../components/ChartPreview';
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
    Meteor.call('forkChart', this.props._id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const history = createBrowserHistory();
        history.push({
          pathname: `/chart/${result}/edit`,
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

  renderChart() {
    return (
      <div>
        <div className='top-line'>
          <h3 className='slug'>{ this.state.chart.slug }</h3>
          <div className='chart-links'>
            <h3 className='edit'><a href={`/chart/${ this.state.chart._id }/edit`}>Edit</a></h3>
          </div>
        </div>
        <ChartPreview
          editable={false}
          share={false}
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
            {this.state.chart ? this.renderChart() : renderLoading()}
          </div>
        </section>
        <Footer />
      </div>
    );
  }

}

export default withTracker(() => {
  const history = createBrowserHistory(),
    chartId = history.location.pathname.replace('/chart/', '');
  Meteor.subscribe('chart.tags', chartId);
  Meteor.subscribe('chart', chartId);
  return {
    tags: Tags.find().fetch().map(t => t.tagName),
    chart: Charts.findOne({ _id: chartId })
  };
})(ShowChart);
