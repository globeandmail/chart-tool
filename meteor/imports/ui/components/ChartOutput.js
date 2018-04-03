import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Charts from '../../api/Charts/Charts';
import ChartEmbed from './ChartEmbed';
import { withTracker } from 'meteor/react-meteor-data';

class ChartOutput extends Component {

  constructor(props) {
    super(props);
    // this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  // handleFieldChange(text, type) {
  //   Meteor.call(`charts.update.${type}`, this.props.id, text, err => {
  //     if (err) console.log(err);
  //   });
  // }

  // 'click .export-embed': function(e) {
  //   e.target.select();
  // },
  // 'click .export-png': function(e) {
  //   Overlay.show("chartOverlayWeb", this);
  //   window.scrollTo(0, 0);
  // },
  // 'click .export-pdf': function(e) {
  //   Overlay.show("chartOverlayPrint", this);
  //   window.scrollTo(0, 0);
  // }

  render() {
    return (
      <div className='output'>
        <div className='embed-code'>
          <h3>Embed code <span>(click to select)</span></h3>
          {!this.props.loading ? <ChartEmbed chart={this.props.chart}/> : null}
        </div>
        <div className='download'>
          <h3>Export</h3>
          <div className='button export-button export-png'>Web-ready PNG</div>
          <div className='button export-button export-pdf'>Print export</div>
        </div>

      </div>
    );
  }
}

export default withTracker(props => {
  const subscription = Meteor.subscribe('chart', props.match.params._id);
  return {
    loading: !subscription.ready(),
    chart: Charts.findOne({ _id: props.match.params._id })
  };
})(ChartOutput);
