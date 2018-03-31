import React, { Component } from 'react';
import { app_version, app_build } from '../modules/settings';

class Footer extends Component {
  render() {
    return (
      <footer>
        <p className='version'><a href="http://www.github.com/globeandmail/chart-tool">Chart Tool {`${app_version} build ${app_build}`}</a></p>
      </footer>
    );
  }
}

export default Footer;
