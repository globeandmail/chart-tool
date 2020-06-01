import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default class NotFound extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <section>
          <article>
            <div className='notfound'>
              <h1>404</h1>
              <iframe
                src='https://giphy.com/embed/xT5LMDYj4kvKNlGDHq'
                width='480'
                height='360'
                frameBorder='0'
                allowFullScreen
              />
              <h2>The page you&rsquo;re looking for doesn't exist.</h2>
            </div>
          </article>
        </section>
        <Footer />
      </div>
    );
  }

}
