import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Tags from '../../api/Tags/Tags';
import { Creatable as Select } from 'react-select';
import { withTracker } from 'meteor/react-meteor-data';
import { updateAndSave } from '../../modules/utils';

class ChartTags extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      tags: this.props.chart.tags
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.availableTags !== nextProps.availableTags) {
  //     const filteredTags = nextProps.tags.filter(t => {
  //       return this.state.tags.indexOf(t.label) !== -1 ? true : false;
  //     });
  //     const filters = this.state.filters;
  //     filters.tags = filteredTags.map(d => d.label);
  //     this.setState({ filters });
  //     this.setState({ selectedOption: filteredTags });
  //   }
  // }

  expandStatus() {
    return this.state.expanded ? 'expanded' : 'collapsed';
  }

  handleSelectChange(selectedOption) {
    debugger;
    // const tags = selectedOption.map(s => s.label);
    // updateAndSave('charts.update.tags', this.props.chart._id, tags);
    // this.setState({ tags });
  }

  handleNewTag(event) {
    debugger;
  }

//   Meteor.call('createTag', input, chartId, function(err, result) {
//     if (err) {
//       console.log(err);
//     } else if (result) {
//       debugger;
//       Meteor.call('updateTags', chartId, tagName);
//       callback(result);
//     }
//   });
// Meteor.call('addTag', value, chartId, function(err, result) {
//   if (err) {
//     console.log(err);
//   } else if (result) {
//     Meteor.call('updateTags', chartId, item[0].innerText);
//   }
// });
// Meteor.call('removeTag', value, chartId, function(err, result) {
//   if (err) {
//     console.log(err);
//   } else if (result) {
//     Meteor.call('updateTags', chartId, item[0].innerText);
//   }
// });

  render() {
    return (
      <div className='edit-box'>
        <h3 onClick={() => this.toggleCollapseExpand()}>Tags</h3>
        {/* <div className="edit-box_toggle"> */}
          <div className={`unit-edit ${this.expandStatus()}`}>
            <h4>Add a few tags below</h4>
            { !this.props.loading ?
              <Select
                multi={true}
                className={'edit-tags-select'}
                value={this.state.tags}
                onChange={(event) => this.handleSelectChange(event)}
                options={this.props.availableTags}
                onNewOptionClick={(event) => this.handleNewTag(event)}
              /> : null
            }
          </div>
        {/* </div> */}
      </div>
    );
  }

}

export default withTracker(props => {
  const subscription = Meteor.subscribe('tags');
  return {
    props,
    loading: !subscription.ready(),
    availableTags: Tags.find().fetch().map(t => ({ value: t._id, label: t.tagName }))
  };
})(ChartTags);
