import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { app_settings } from '../../modules/settings';
import { slugParse } from '../../modules/utils';
import { withTracker } from 'meteor/react-meteor-data';
// import Charts from '../api/Charts/Charts';

// Meteor.call('tasks.insert', text);

class Header extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  updateSlug(event) {
    const slugData = event.target.value,
      slug = slugParse(slugData);
    if (slug) {
      // updateAndSave('updateSlug', this, slug);
      event.target.value = slug;
    } else {
      event.target.value = this.slug;
    }
  }

  renderEditSlug() {
    return (
      <div className='header-grid'>
        <div className='chart-slug'>
          <input
            type='text'
            name='slug'
            className='input-slug-edit'
            placeholder='{{ slug }}'
            value='{{ slug }}'
            onBlur={this.updateSlug.bind(this)}
          />
        </div>
      </div>
    );
  }

  // componentDidMount() {
  //   StretchyInit();
  //   Stretchy.resize(document.querySelector('.input-slug-edit'));
  // }
  //
  // componentDidUpdate() {
  //   StretchyInit();
  //   Stretchy.resize(document.querySelector('.input-slug-edit'));
  // }

  render() {
    return (
      <header>
        <div className={this.props.edit ? 'header-edit' : ''}>

          <div className='topbar'></div>
          <div className='header-baseline'>

            {this.props.edit ? this.renderEditSlug() : null}

              <div className={this.props.edit ? 'header-edit-nav' : 'header-nav'}>
                <h2 className='header-help'><a href={ app_settings.help || 'http://www.github.com/globeandmail/chart-tool' } target='_blank'>Help</a></h2>
                <h2 className='header-list'><a href='/archive'>Archive</a></h2>
                <h2 className='header-new'><a href='/new'>New chart</a></h2>
              </div>
            </div>

        </div>
      </header>
    );
  }
}

export default withTracker(() => {
  // Meteor.subscribe('tasks');

  return {
    // tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    // currentUser: Meteor.user(),
  };
})(Header);
