import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import pathToRegexp from 'path-to-regexp';
import createBrowserHistory from 'history/createBrowserHistory';
import NewChart from '../../ui/pages/NewChart';
import Status from '../../ui/pages/Status';
import Archive from '../../ui/pages/Archive';
import ShowChart from '../../ui/pages/ShowChart';
import PDF from '../../ui/pages/PDF';
import NotFound from '../../ui/pages/NotFound';
import EditChart from '../../ui/layouts/EditChart';

import 'react-select/dist/react-select.css';
import '../../ui/style/main.scss';
import 'sweetalert2/dist/sweetalert2.css';
import '../../ui/style/chart-tool.css';

// cribbed from here: https://stackoverflow.com/questions/43399740/react-router-redirect-drops-param
const RedirectWithParams = ({ exact, from, push, to }) => {
  const pathTo = pathToRegexp.compile(to);
  return (
    <Route exact={exact} path={from} component={({ match: { params } }) => (
      <Redirect to={pathTo(params)} push={push} />
    )} />
  );
};

export default class Routes extends Component {
  render() {
    const browserHistory = createBrowserHistory();
    return (
      <Router history={browserHistory}>
        <Switch>
          <Redirect exact from='/' to='/new' />
          <Redirect exact from='/list' to='/archive' />
          <RedirectWithParams exact from={'/chart/pdf/:_id'} to={'/chart/:_id/pdf'} />
          <RedirectWithParams exact from={'/chart/edit/:_id'} to={'/chart/:_id/edit'} />
          <Route exact path='/new' render={props => <NewChart {...props} />} />
          <Route exact path='/status' render={props => <Status {...props} />} />
          <Route exact path='/archive' render={props => <Archive {...props} />} />
          <Route exact path='/chart/:_id' render={props => <ShowChart {...props} />} />
          <Route exact path='/chart/:_id/pdf' render={props => <PDF {...props} />} />
          <Route exact path='/chart/:_id/edit' render={props => <EditChart {...props} />} />
          <Route path='*' render={props => <NotFound {...props} />} />
        </Switch>
      </Router>
    );
  }
}
