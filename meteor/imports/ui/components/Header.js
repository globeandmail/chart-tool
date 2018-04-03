import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { matchPath } from 'react-router';
import { app_settings } from '../../modules/settings';
import { slugParse, debounce } from '../../modules/utils';
import { withTracker } from 'meteor/react-meteor-data';
import createBrowserHistory from 'history/createBrowserHistory';
import Charts from '../../api/Charts/Charts';

class Header extends Component {

  constructor(props) {
    super(props);
    this.setSlugValue = debounce(this.setSlugValue, 500);
    this.state = {
      slug: this.props.chart && this.props.chart.slug ? this.props.chart.slug : ''
    };
  }

  setSlugValue(slug) {
    Meteor.call('charts.update.slug', this.props.chart._id, slug, err => {
      if (err) console.log(err);
    });
  }

  updateSlug(event) {
    const slugData = event.target.value,
      slug = slugParse(slugData);
    if (slug) {
      this.setState({ slug });
      this.setSlugValue(slug);
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
            placeholder={this.state.slug}
            value={this.state.slug}
            onChange={this.updateSlug.bind(this)}
          />
        </div>
        { this.renderNav() }
      </div>
    );
  }

  renderNav() {
    return (
      <div className={this.props.edit ? 'header-edit-nav' : 'header-nav'}>
        <h2 className='header-help'><a href={ app_settings.help || 'http://www.github.com/globeandmail/chart-tool' } target='_blank'>Help</a></h2>
        <h2 className='header-list'><a href='/archive'>Archive</a></h2>
        <h2 className='header-new'><a href='/new'>New chart</a></h2>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.chart !== nextProps.chart) {
      const slug = nextProps.chart.slug;
      this.setState({ slug });
    }
  }

  render() {
    return (
      <header className={this.props.edit ? 'header-edit' : ''}>
        <div className='topbar'></div>
        <div className='header-baseline'>
          {this.props.edit && !this.props.loading ? this.renderEditSlug() : this.renderNav()}
        </div>
      </header>
    );
  }
}

export default withTracker(({ edit }) => {
  const props = {};
  if (edit) {
    const history = createBrowserHistory(),
      match = matchPath(history.location.pathname, {
        path: '/chart/:id/edit',
        exact: true,
        strict: false
      }),
      subscription = Meteor.subscribe('chart', match.params.id);
    props.loading = !subscription.ready();
    props.chart = Charts.findOne({ _id: match.params.id });
  }
  return props;
})(Header);
