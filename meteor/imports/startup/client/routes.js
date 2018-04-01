import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import NewChart from '../../ui/pages/NewChart';
import Status from '../../ui/pages/Status';
// import NotFound from '../../ui/containers';

// import ShowChart from '../../ui/containers';
// import EditChart from '../../ui/containers';
// import PDF from '../../ui/containers';
// import Archive from '../../ui/containers';

import '../../ui/style/main.scss';
import '../../ui/style/chart-tool.css';

const browserHistory = createBrowserHistory();

export const routes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path='/' component={NewChart} />
      <Route exact path='/new' component={NewChart} />
      <Route exact path='/status' component={Status} />
      {/* <Route exact path='/chart/:_id' component={ShowChart} />
      <Route exact path='/chart/:_id/edit' component={EditChart} />
      <Route exact path='/chart/edit/:_id' component={EditChart} />
      <Route exact path='/chart/:_id/pdf' component={PDF} />
      <Route exact path='/chart/pdf/:_id' component={PDF} />
      <Route exact path='/archive' component={Archive} />
      <Route component={NotFound}/> */}
    </Switch>
  </Router>
);
