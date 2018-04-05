import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import NewChart from '../../ui/pages/NewChart';
import Status from '../../ui/pages/Status';
import Archive from '../../ui/pages/Archive';
import ShowChart from '../../ui/pages/ShowChart';
import PDF from '../../ui/pages/PDF';
import EditChart from '../../ui/layouts/EditChart';

import 'react-select/dist/react-select.css';
import '../../ui/style/main.scss';
import 'sweetalert2/dist/sweetalert2.css';
import '../../ui/style/chart-tool.css';

export default class Routes extends Component {
  render() {
    const browserHistory = createBrowserHistory();
    return (
      <Router history={browserHistory}>
        <Switch>
          <Route exact path='/new' render={props => <NewChart {...props} />} />
          <Route exact path='/status' render={props => <Status {...props} />} />
          <Route exact path='/archive' render={props => <Archive {...props} />} />
          <Route exact path='/chart/:_id' render={props => <ShowChart {...props} />} />
          <Route exact path='/chart/:_id/pdf' render={props => <PDF {...props} />} />
          <Route exact path='/chart/:_id/edit' render={props => <EditChart {...props} />} />
          <Redirect from='/' to='/new' />
          <Redirect from='/list' to='/archive' />
          <Redirect from='/chart/pdf/:_id' to='/chart/:_id/pdf' />
          <Redirect from='/chart/edit/:_id' to='/chart/:_id/edit' /> */}
          {/* <Route component={NotFound}/> */}
        </Switch>
      </Router>
    );
  }
}
