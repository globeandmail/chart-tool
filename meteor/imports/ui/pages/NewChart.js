import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import slugify from 'slug';
import { dataParse } from '../../modules/utils';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default class NewChart extends Component {

  constructor(props) {
    super(props);
    this.createChart = this.createChart.bind(this);
    this.formatSlug = this.formatSlug.bind(this);
    this.updateData = this.updateData.bind(this);
    this.state = {
      slug: '',
      data: ''
    };
  }

  formatSlug(event) {
    const slug = slugify(event.target.value);
    this.setState({ slug });
  }

  updateData(event) {
    const data = event.target.pasteData.value;
    this.setState({ data });
  }

  createChart(event) {
    event.preventDefault();

    const data = this.state.data ? dataParse(this.state.data) : '';

    if (this.state.slug && data) {
      Meteor.call('addChart', this.state.slug, data, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          this.props.history.push({ pathname: `/chart/${result}/edit` });
        }
      });
    } else {
      Swal({
        title: 'Please check your slug and data.',
        text: "Looks like you're missing a slug or some data. Please add some and retry.",
        type: 'error',
        confirmButtonColor: '#fff'
      });
    }

  }

  render() {
    return(
      <div>
        <Header {...this.props} />
        <section>
          <article>
            <form className='new-chart' onSubmit={this.createChart}>
              <input
                type='text'
                name='slug'
                placeholder='Slug'
                className='input-slug'
                value={this.state.slug}
                onChange={this.formatSlug}
              />
              <textarea
                type='text'
                name='pasteData'
                placeholder='Paste your spreadsheet data here'
                className='input-data'
                value={this.state.data}
                onChange={this.updateData}
              >
              </textarea>
              <input
                type='submit'
                value='Create chart'
                className='input-submit'
              />
            </form>
          </article>
        </section>
        <Footer />
      </div>
    );
  }
}
