import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Charts from '../../api/Charts/Charts';
import createBrowserHistory from 'history/createBrowserHistory';
import { withTracker } from 'meteor/react-meteor-data';
import { matchPath } from 'react-router';
import { chartTypeFieldReset } from '../../modules/utils';

class ChartType extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.type !== nextProps.type) {
      const type = nextProps.type;
      this.setState({ type });
    }
  }

  handleSelectChange(event) {
    const type = event.target.value;
    this.setState({ type });
    const fields = chartTypeFieldReset(type);
    Meteor.call('charts.update.multiple.fields', this.props.id, fields, err => {
      if (err) console.log(err);
    });
  }

  render() {
    return (
      <div className='chart-selector'>
        <h3 className='selector-label'>Chart type</h3>
        <span className='selector-button'>
          <div className='select-wrapper'>
            { !this.props.loading ?
              <select className='chart-types' onChange={this.handleSelectChange.bind(this)} value={this.state.type}>
                {['Line', 'Multiline', 'Area', 'Column', 'Bar'].map(t => {
                  const lower = t.toLowerCase();
                  return <option key={t} value={lower}>{t}</option>;
                })}
              </select> :
              null
            }
          </div>
        </span>
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
    subscription = Meteor.subscribe('chart', match.params.id),
    chart = Charts.findOne({ _id: match.params.id });

  return {
    loading: !subscription.ready(),
    id: match.params.id,
    type: chart && chart.options.type
  };
})(ChartType);
