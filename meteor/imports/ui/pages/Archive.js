import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { parse as parseQueryString, stringify } from 'query-string';
import Tags from '../../api/Tags/Tags';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { debounce } from '../../modules/utils';
import { withTracker } from 'meteor/react-meteor-data';
import ArchiveChartsComponent from '../components/ArchiveCharts';
import Select from 'react-select';

class Archive extends Component {

  constructor(props) {
    super(props);

    const query = parseQueryString(this.props.history.location.search);

    let types = [],
      tags = [],
      search = '',
      limit = 24,
      sortOrder = '',
      sortField = '';

    if (query.types) { types = query.types.split(','); }
    if (query.tags) { tags = query.tags.split(','); }
    if (query.search) { search = query.search; }
    if (query.sortOrder) { sortOrder = query.sortOrder; }
    if (query.sortField) { sortField = query.sortField; }

    const filters = {
      search,
      types,
      tags
    };

    const sort = {
      field: sortField || 'lastEdited',
      order: sortOrder || 'desc'
    };

    if (query.limit) {
      limit = parseInt(query.limit);
    }

    this.setQueryUrl = this.setQueryUrl.bind(this);
    this.setLimit = this.setLimit.bind(this);
    this.setSearch = debounce(this.setSearch, 300);
    this.setChartType = this.setChartType.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSortFieldChange = this.handleSortFieldChange.bind(this);
    this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
    this.state = {
      filters,
      limit,
      sort,
      expanded: {
        search: true,
        sort: true,
        tags: true,
        chartType: true
      },
      selectedOption: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tags !== nextProps.tags) {
      const filteredTags = nextProps.tags.filter(t => {
        return this.state.filters.tags.indexOf(t.label) !== -1 ? true : false;
      });
      const filters = this.state.filters;
      filters.tags = filteredTags.map(d => d.label);
      this.setState({ filters });
      this.setState({ selectedOption: filteredTags });
    }
  }

  setQueryUrl() {

    const filters = this.state.filters;

    const queryObj = {};

    for (let prop in filters) {
      if (Array.isArray(filters[prop])) {
        if (filters[prop].length) {
          queryObj[prop] = filters[prop].join(',');
        }
      } else if (filters[prop] !== undefined && filters[prop] !== '') {
        queryObj[prop] = filters[prop];
      }
    }

    queryObj.sortOrder = this.state.sort.order;
    queryObj.sortField = this.state.sort.field;

    window.history.replaceState({}, '', `/archive?${stringify(queryObj)}`);
  }

  componentDidUpdate() {
    this.setQueryUrl();
  }

  setSearch(event) {
    let search = event.target.value.trim().replace(/^\s+/, '');
    const filters = this.state.filters;
    filters.search = search;
    const sort = this.state.sort;
    sort.field = search !== '' ? 'score' : 'lastEdited';
    this.setState({ filters, sort });
  }

  setChartType(event) {
    const type = event.target.value,
      filters = this.state.filters;
    let newTypes;
    if (filters.types.indexOf(type) === -1) {
      newTypes = filters.types;
      newTypes.push(type);
    } else {
      newTypes = filters.types.filter(f => f !== type);
    }
    filters.types = newTypes;
    this.setState({ filters });
  }

  setLimit(event) {
    const limit = parseInt(event.target.value);
    this.setState({ limit });
  }

  isChecked(value) {
    const index = this.state.filters.types.indexOf(value.toLowerCase());
    return index === -1 ? false : true;
  }

  toggleCollapseExpand(type) {
    const expanded = this.state.expanded;
    expanded[type] = !expanded[type];
    this.setState({ expanded });
  }

  expandStatus(type) {
    return this.state.expanded[type] ? 'expanded' : 'collapsed';
  }

  handleSelectChange(selectedOption) {
    const filters = this.state.filters;
    filters.tags = selectedOption.map(s => s.label);
    this.setState({ selectedOption });
    this.setState({ filters });
  }

  handleSortFieldChange(event) {
    const sort = this.state.sort;
    sort.field = event.target.value;
    this.setState({ sort });
  }

  handleSortOrderChange(event) {
    const sort = this.state.sort;
    sort.order = event.target.value;
    this.setState({ sort });
  }

  render() {
    return (
      <div>
        <Header />
        <div className='charts-archive'>
          <aside className='charts-archive_aside-wrapper'>
            <div className='charts-archive_aside'>
              <h2>Filters</h2>
              <div className='edit-box'>
                <h3 onClick={() => this.toggleCollapseExpand('search')}>Search</h3>
                <div className={`unit-edit charts-archive_search ${this.expandStatus('search')}`}>
                  <input
                    className='charts-archive_search-field input-search'
                    type='text'
                    placeholder='Search by keyword…'
                    onChange={this.setSearch}
                    defaultValue={this.state.filters.search}
                  />
                </div>
              </div>
              <div className='edit-box'>
                <h3 onClick={() => this.toggleCollapseExpand('sort')}>Sorting</h3>
                <div className={`unit-edit charts-archive_sort ${this.expandStatus('sort')}`}>
                  <div className='select-wrapper'>
                    <select id='sortField' onChange={this.handleSortFieldChange} value={this.state.sort.field}>
                      {['score', 'lastEdited', 'createdAt', 'slug'].map(s => {
                        let text = '';
                        switch (s) {
                          case 'score':
                            text = 'Relevancy';
                            break;
                          case 'lastEdited':
                            text = 'Date last edited';
                            break;
                          case 'createdAt':
                            text = 'Date created';
                            break;
                          case 'slug':
                            text = 'Slug';
                            break;
                        }
                        return <option key={s} value={s}>{text}</option>;
                      })}
                    </select>
                  </div>
                  <div className='select-wrapper'>
                    <select id='sortOrder' onChange={this.handleSortOrderChange} value={this.state.sort.order}>
                      {['desc', 'asc'].map(s => {
                        const text = s === 'desc' ? 'Descending' : 'Ascending';
                        return <option key={s} value={s}>{text}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className='edit-box'>
                <h3 onClick={() => this.toggleCollapseExpand('tags')}>Tags</h3>
                <div className={`unit-edit charts-archive_tags ${this.expandStatus('tags')}`}>
                  <Select
                    multi={true}
                    className={'archive-tags-select'}
                    value={this.state.selectedOption}
                    onChange={this.handleSelectChange}
                    options={this.props.tags}
                  />
                </div>
              </div>
              <div className='edit-box'>
                <h3 onClick={() => this.toggleCollapseExpand('chartType')}>Chart type</h3>
                <div className={`unit-edit charts-archive_type ${this.expandStatus('chartType')}`}>
                  <ul>
                    {['Line', 'Multiline', 'Area', 'Column', 'Bar'].map(t => {
                      return (
                        <li key={t}>
                          <input
                            id={`${t.toLowerCase()}Type`}
                            type='checkbox'
                            value={t.toLowerCase()}
                            className='input-checkbox'
                            onChange={this.setChartType}
                            checked={this.isChecked(t)}
                          />
                          <label htmlFor={`${t.toLowerCase()}Type`}>{t}</label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </aside>
          <ArchiveChartsComponent
            search={this.state.filters.search}
            types={this.state.filters.types}
            tags={this.state.filters.tags}
            limit={this.state.limit}
            sort={this.state.sort}
            setLimit={this.setLimit}
            history={this.props.history}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default withTracker(props => {
  Meteor.subscribe('tags');
  return {
    props,
    tags: Tags.find().fetch().map(t => ({ value: t._id, label: t.tagName }))
  };
})(Archive);
