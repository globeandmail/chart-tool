import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Charts from '../../api/Charts/Charts';
import '../../api/DBStatus/methods';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { withTracker } from 'meteor/react-meteor-data';

class Status extends Component {

  constructor(props) {
    super(props);
    this.state = {
      totalCharts: Number(props.chartCount).toLocaleString('en'),
      // totalActiveUsers: Number(props.chartUserCount).toLocaleString('en'),
      totalActiveUsers: 12,
      databaseStatus: 'status-inactive'
    };
  }

  componentDidMount() {
    Meteor.call('dbstatus.check', (err, result) => {
      const databaseStatus = err ? 'status-inactive' : 'status-active';
      this.setState({ databaseStatus });
    });
  }

  render() {
    return(
      <div>
        <Header />

        <section>
          <h1 className='status-header'>Chart Tool status dashboard</h1>
          <div className='status-rule'></div>
          <div className='status-description'>
            <p>This page tracks statistics on chart usage and server and database availability.</p>
          </div>

          <div className='status-indicators'>

            <div className='status-dot-group'>
              <span className={`status-dot status-server-connection ${this.props.serverStatus}`}>&nbsp;</span><h4>server connection</h4>
            </div>

            <div className='status-dot-group'>
              <span className={`status-dot status-database-connection ${this.state.databaseStatus}`}></span><h4>database connection</h4>
            </div>

          </div>

          <div className='status-numbers'>

            <div className='status-number'>
              <div className='big-number'>{ this.state.totalCharts }</div>
              <h3>charts in database</h3>
            </div>
            <div className='status-number'>
              <div className='big-number'>{ this.state.totalActiveUsers }</div>
              <h3>active users</h3>
            </div>
            <div className='status-number'>
              <div className='big-number'>{ this.state.totalChartsThisMonth }</div>
              <h3>charts this month</h3>
            </div>

          </div>
        </section>

        <Footer />

      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('chartCount');
  Meteor.subscribe('chartUserCount');

  const now = new Date(),
    m = now.getMonth() + 1,
    y = now.getFullYear();

  return {
    chartCount: Charts.find().fetch().length,
    // chartUserCount = Presences.find().fetch().length,
    chartsThisMonth: Charts.find({ createdAt: { $gte: new Date(`${y}-${m}-01`) } }).fetch().length,
    serverStatus: Meteor.status().connected ? 'status-active' : 'status-inactive'
  };
})(Status);
