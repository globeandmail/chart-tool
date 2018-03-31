import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { routes } from './routes';

Meteor.startup(() => {
  render(routes(), document.getElementById('app'));
});
