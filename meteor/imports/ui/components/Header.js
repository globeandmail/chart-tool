import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import slugify from 'slug';
import { Link } from 'react-router-dom';
import { app_settings } from '../../modules/settings';
import { setDocumentTitle } from '../../modules/utils';
import { DebounceInput } from 'react-debounce-input';

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.setSlugValue = this.setSlugValue.bind(this);
    this.updateSlug = this.updateSlug.bind(this);
  }

  componentDidMount() {
    const slug = this.props.chart && this.props.chart.slug ? this.props.chart.slug : undefined;
    document.title = setDocumentTitle(this.props.match.path, slug);
  }

  componentDidUpdate() {
    const slug = this.props.chart && this.props.chart.slug ? this.props.chart.slug : undefined;
    document.title = setDocumentTitle(this.props.match.path, slug);
  }

  setSlugValue(slug) {
    Meteor.call('charts.update.slug', this.props.match.params._id, slug, err => {
      if (err) console.log(err);
    });
  }

  updateSlug(event) {
    const slugData = event.target.value,
      slug = slugify(slugData);
    event.target.value = slug;
    if (slug) this.setSlugValue(slug);
  }

  renderEditSlug() {
    return (
      <div className='header-grid'>
        <div className='chart-slug'>
          <DebounceInput
            minLength={2}
            debounceTimeout={500}
            element='input'
            className='input-slug-edit'
            placeholder={this.props.chart.slug}
            type='text'
            name='slug'
            onChange={this.updateSlug}
            forceNotifyByEnter={false}
            value={this.props.chart.slug}
          />
        </div>
        { this.renderNav() }
      </div>
    );
  }

  renderNav() {
    return (
      <div className={this.props.edit ? 'header-edit-nav' : 'header-nav'}>
        <h2 className='header-help'><Link to={ app_settings.help ? app_settings.help : 'http://www.github.com/globeandmail/chart-tool' }>Help</Link></h2>
        <h2 className='header-list'><Link to='/archive'>Archive</Link></h2>
        <h2 className='header-new'><Link to='/new'>New chart</Link></h2>
      </div>
    );
  }

  render() {
    return (
      <header className={this.props.edit ? 'header-edit' : ''}>
        <div className='topbar'></div>
        <div className='header-baseline'>
          {this.props.edit ? this.renderEditSlug() : this.renderNav()}
        </div>
      </header>
    );
  }
}
