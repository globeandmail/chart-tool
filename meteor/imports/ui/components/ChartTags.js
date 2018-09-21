import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import slug from 'slug';
import Tags from '../../api/Tags/Tags';
import { Creatable as Select } from 'react-select';
import { withTracker } from 'meteor/react-meteor-data';
import { arrayDiff } from '../../modules/utils';

class ChartTags extends Component {

  constructor(props) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleNewTag = this.handleNewTag.bind(this);
  }

  handleSelectChange(selectedOptions) {
    const newChartTags = selectedOptions.map(s => s.value),
      oldChartTags = this.props.chartTags.map(s => s.value),
      tagId = arrayDiff(newChartTags, oldChartTags)[0];

    Meteor.call('tags.change', tagId, this.props.chart._id, selectedOptions.map(s => s.label), err => {
      if (err) { console.log(err); }
    });
  }

  handleNewTag(event) {
    const newTag = slug(event.value),
      newChartTags = this.props.chartTags.map(s => s.label);

    newChartTags.push(newTag);

    Meteor.call('tags.create', newTag, this.props.chart._id, newChartTags, err => {
      if (err) { console.log(err); }
    });
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 id='ChartTags' onClick={this.props.toggleCollapseExpand}>Tags</h3>
        <div className={`unit-edit ${this.props.expandStatus('ChartTags')}`}>
          <h4>Add a few tags below</h4>
          { !this.props.loading ?
            <Select
              multi={true}
              className={'edit-tags-select'}
              value={this.props.chartTags}
              onChange={this.handleSelectChange}
              options={this.props.availableTags}
              onNewOptionClick={this.handleNewTag}
            /> : null }
        </div>
      </div>
    );
  }

}

export default withTracker(props => {
  const subscription = Meteor.subscribe('tags');
  return {
    props,
    loading: !subscription.ready(),
    chartTags: Tags.find({ tagged: props.chart._id }).fetch().map(t => ({ value: t._id, label: t.tagName })),
    availableTags: Tags.find().fetch().map(t => ({ value: t._id, label: t.tagName }))
  };
})(ChartTags);
