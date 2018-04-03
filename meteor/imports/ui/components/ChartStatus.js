import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Presences } from 'meteor/tmeasday:presence';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';

class ChartStatus extends Component {

  constructor(props) {
    super(props);
  }

  help() {
    Swal({
      title: 'Who\u2019s editing my what now?',
      text: 'Surprise! Chart Tool allows for multiple people to edit your chart at once.',
      type: 'info',
      confirmButtonColor: '#fff'
    });
  }

  renderEditing() {
    return (
      <div className='edit-box'>
        <div className='unit-edit currently-editing'>
          <h4>Currently editing <a onClick={this.help} className='help-toggle help-editing'>?</a></h4>
          <ul>
            {this.props.connected.map(c => {
              const itMe = this.props.name === c.state.user,
                name = itMe ? `${c.state.user} (that’s you!)` : c.state.user;
              return (<li className={`${itMe ? 'current' : ''}`} key={c._id}>{name}</li>);
            })}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    return !this.props.loading && this.props.connected.length > 1 ? this.renderEditing() : null;
  }

}

export default withTracker(props => {
  const subscription = Meteor.subscribe('chart.users', props.match.params._id);
  return {
    loading: !subscription.ready(),
    connected: Presences.find({ 'state.currentChartId': props.match.params._id }, { fields: { 'state': true, 'userId': true }}).fetch(),
    props
  };
})(ChartStatus);
