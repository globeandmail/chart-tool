import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChartType from '../components/ChartType';
import ChartPreview from '../components/ChartPreview';
import ChartOutput from '../components/ChartOutput';

export default class EditChart extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header edit={true} {...this.props} />
        <section>
          <article className='main-area'>
            <ChartType {...this.props} />
            <ChartPreview {...this.props} />
            <ChartOutput {...this.props} />
            {/* {{ > yield 'overlay' }} */}
          </article>
          <aside className='options-area'>
            {/* <ChartStatus {...this.props} /> */}
            {/* <ChartData {...this.props} />
            <ChartXAxis {...this.props} />
            <ChartYAxis {...this.props} />
            <ChartTags {...this.props} />
            <ChartStyling {...this.props} />
            <ChartOptions {...this.props} /> */}
          </aside>
        </section>
        <Footer />
      </div>
    );
  }

}
