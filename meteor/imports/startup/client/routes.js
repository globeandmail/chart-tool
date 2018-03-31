import React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import NewChart from '../../ui/containers';
import NotFound from '../../ui/containers';
import Status from '../../ui/containers';
import ShowChart from '../../ui/containers';
import EditChart from '../../ui/containers';
import PDF from '../../ui/containers';
import Archive from '../../ui/containers';

export const routes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path='/' component={NewChart} />
      <Route exact path='/new' component={NewChart} />
      <Route exact path='/404' component={NotFound} />
      <Route exact path='/status' component={Status} />
      <Route exact path='/chart/:_id' component={ShowChart} />
      <Route exact path='/chart/:_id/edit' component={EditChart} />
      <Route exact path='/chart/:_id/pdf' component={PDF} />
      <Route exact path='/archive' component={Archive} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);
