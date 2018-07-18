import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateAndSave } from '../../modules/utils';
import Swal from 'sweetalert2';

export default class ChartOptions extends Component {

  constructor(props) {
    super(props);
    this.handleShareData = this.handleShareData.bind(this);
    this.handleSocial = this.handleSocial.bind(this);
    this.handleTips = this.handleTips.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleShareData(event) {
    const shareData = event.target.checked;
    updateAndSave('charts.update.options.share_data', this.props.chart._id, shareData);
  }

  handleSocial(event) {
    const social = event.target.checked;
    updateAndSave('charts.update.options.social', this.props.chart._id, social);
  }

  handleTips(event) {
    const tips = event.target.checked;
    updateAndSave('charts.update.options.tips', this.props.chart._id, tips);
  }

  handleDelete() {
    Swal({
      title: 'Are you sure you want to delete this chart?',
      text: "Deleted charts can't be recovered. Do you really want to do this?",
      type: 'warning',
      confirmButtonText: 'Delete chart',
      cancelButtonText: 'Cancel',
      showCancelButton: true
    }).then(result => {
      if (result.value) {
        Swal({
          title: 'Deleted!',
          text: 'Your chart has been deleted.',
          type: 'success'
        });
        Meteor.call('charts.delete', this.props.chart._id, err => {
          if (err) {
            console.log(err);
          } else {
            this.props.history.push({ pathname: `/archive` });
          }
        });
      }
    });
  }

  helpShareData() {
    Swal({
      title: 'Share data?',
      text: "Adds a 'data' button to each chart which can be toggled to present the charts data in a tabular form along with buttons allowing the raw data to be downloaded.",
      type: 'info',
    });
  }

  helpSocial() {
    Swal({
      title: 'Social sharing?',
      text: "Adds a 'social' button to each chart which can be toggled to present the user with social sharing options.",
      type: 'info',
    });
  }

  helpTips() {
    Swal({
      title: 'Show tips?',
      text: 'Show tooltips with the values of each series when you hover over the chart.',
      type: 'info',
    });
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 id='ChartOptions' onClick={this.props.toggleCollapseExpand}>Options</h3>
        <div className={`unit-edit ${this.props.expandStatus('ChartOptions')}`}>
          <div className='unit-edit share-data-edit'>
            <h4>Share data <a onClick={this.helpShareData} className='help-toggle help-share-data'>?</a></h4>
            <input
              className='input-checkbox-share-data'
              type='checkbox'
              name='Share'
              checked={this.props.chart.options.share_data}
              onChange={this.handleShareData}
            />
          </div>
          <div className='unit-edit social-edit'>
            <h4>Social sharing <a onClick={this.helpSocial} className='help-toggle help-social-sharing'>?</a></h4>
            <input
              className='input-checkbox-social'
              type='checkbox'
              name='Social'
              checked={this.props.chart.options.social}
              onChange={this.handleSocial}
            />
          </div>
          <div className='unit-edit tips-edit'>
            <h4>Show tips <a onClick={this.helpTips} className='help-toggle help-tips'>?</a></h4>
            <input
              className='input-checkbox-tips'
              type='checkbox'
              name='Tips'
              checked={this.props.chart.options.tips}
              onChange={this.handleTips}
            />
          </div>
          <button onClick={this.handleDelete} className='unit-edit unit-delete'>Delete chart</button>
        </div>
      </div>
    );
  }

}
