import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChartType from '../components/ChartType';
import ChartPreview from '../components/ChartPreview';

export default class EditChart extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header edit={true} />
        <section>
          <article className='main-area'>
            <ChartType />
            <ChartPreview />
            {/* {{ > yield 'output' }}
            {{ > yield 'overlay' }} */}
          </article>
          <aside className='options-area'>
            {/* {{ > yield 'aside'}} */}
          </aside>
        </section>
        <Footer />
      </div>
    );
  }

}
