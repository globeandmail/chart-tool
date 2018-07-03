import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Charts from '../../api/Charts/Charts';
import { withTracker } from 'meteor/react-meteor-data';

class ArchiveCharts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      matchedCharts: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params !== nextProps.params) {
      Meteor.call('charts.matched.count', this.props.params, (err, res) => {
        if (!err) this.setState({ matchedCharts: res });
      });
    }
  }

  goToChart(id) {
    this.props.history.push({ pathname: `/chart/${id}` });
  }

  render() {
    return (
      <section className='charts-archive_results'>
        <div className='charts-archive_count'>
          <div className='charts-archive_count-left'>
            <h3>Displaying <span>{ this.props.charts.length }</span> of <span>{ this.state.matchedCharts }</span> charts</h3>
          </div>
          <div className='charts-archive_count-right'>
          <h3>Total charts to load:</h3>
            <select
              className='charts-archive_count-limit'
              value={this.props.limit}
              onChange={this.props.setLimit}>
              {[24, 48, 96].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className='charts-archive_grid'>
          {this.props.charts.map(chart => {
            return (
              <div
                className='charts-archive_single'
                key={chart._id}
                onClick={() => this.goToChart(chart._id)}
                >
                <div className='charts-archive_single-inner'>
                  <h4 className='slug'>{chart.slug}</h4>
                  {chart.img ?
                    <img src={chart.img} /> :
                    <div className='empty-image'><p>No image available</p></div>
                  }
                  <div className='hover-screen'></div>
                </div>
              </div>
            );
          })}
          <div className='charts-archive_empty-container'>
            <div className='charts-archive_empty'>
              <img src='/images/error.svg' className='chart-archive_empty-img'/>
              <h2>No charts found.</h2>
              <p>We couldn't find any charts that matched your criteria. Maybe try a broader search?</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withTracker({
  getMeteorData: props => {
    const params = {
      queryName: 'chart.archive',
      filters: {
        search: props.search,
        types: props.types,
        tags: props.tags,
      },
      limit: props.limit
    };
    const subscription = Meteor.subscribe('chart.archive', params),
      options = { sort: {} };
    options.sort = [[props.sort.field, props.sort.order]];
    return {
      params: params,
      loading: !subscription.ready(),
      charts: Charts.find({}, options).fetch(),
      setLimit: props.setLimit,
      search: props.search,
      types: props.types,
      tags: props.tags,
      limit: props.limit,
      history: props.history
    };
  },
  pure: false
})(ArchiveCharts);
