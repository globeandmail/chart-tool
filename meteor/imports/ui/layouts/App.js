import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header />  {/* Needs to have header-edit class */}

        <section>

          <article class='main-area'>
            {/* {{ > yield 'type' }}
            {{ > yield 'preview' }}
            {{ > yield 'output' }}
            {{ > yield 'overlay' }} */}
          </article>

          <aside class='options-area'>
            {/* {{ > yield 'aside'}} */}
          </aside>

        </section>

        <Footer />
      </div>
    );
  }

}
