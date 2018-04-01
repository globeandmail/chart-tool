import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { slugParse, dataParse } from '../../modules/utils';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default class NewChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slug: '',
      data: ''
    };
  }

  formatSlug(event) {
    const slug = slugParse(event.target.value);
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
          // need to figure out how to handle history stuff
          // history.push('/home', { some: result })
          // console.log('Chart added with id: ' + result);
          // Session.set('chartId', result);
          // Router.go('chart.edit', {_id: Session.get('chartId')});
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
        <Header />
        <section>
          <article>
            <form className='new-chart' onSubmit={this.createChart.bind(this)}>
              <input
                type='text'
                name='slug'
                placeholder='Slug'
                className='input-slug'
                value={this.state.slug}
                onChange={this.formatSlug.bind(this)}
              />
              <textarea
                type='text'
                name='pasteData'
                placeholder='Paste your spreadsheet data here'
                className='input-data'
                value={this.state.data}
                onChange={this.updateData.bind(this)}
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
