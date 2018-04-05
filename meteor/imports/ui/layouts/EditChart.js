import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Presence } from 'meteor/tmeasday:presence';
import generateRandomAnimalName from 'random-animal-name-generator';
import Charts from '../../api/Charts/Charts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChartType from '../components/ChartType';
import ChartPreview from '../components/ChartPreview';
import ChartOutput from '../components/ChartOutput';
// import ChartOverlays from '../components/ChartOverlays';
import ChartStatus from '../components/ChartStatus';
import ChartData from '../components/ChartData';
import ChartXAxis from '../components/ChartXAxis';
import ChartYAxis from '../components/ChartYAxis';
import ChartTags from '../components/ChartTags';
import ChartStyling from '../components/ChartStyling';
import ChartOptions from '../components/ChartOptions';

class EditChart extends Component {

  constructor(props) {
    super(props);
    const animalName = generateRandomAnimalName();
    Presence.state = () => {
      return { currentChartId: this.props.match.params._id, user: animalName };
    };
    this.state = {
      animalName: animalName
    };
  }

  render() {
    const chartAvailable = !this.props.loading && this.props.chart;
    if (!this.props.loading && !this.props.chart) {
      return <Redirect to='/404' />;
    }
    return (
      <div>
        { chartAvailable ? <Header edit={true} {...this.props} /> : null }
        <section>
          <article className='main-area'>
            { chartAvailable ? <ChartType {...this.props} /> : null }
            { chartAvailable ? <ChartPreview {...this.props} /> : null }
            { chartAvailable ? <ChartOutput {...this.props} /> : null }
            {/* { chartAvailable ? <ChartOverlays {...this.props} /> : null } */}
          </article>
          <aside className='options-area'>
            { chartAvailable ? <ChartStatus {...this.props} name={this.state.animalName} /> : null }
            { chartAvailable ? <ChartData {...this.props} /> : null }
            { chartAvailable ? <ChartXAxis {...this.props} /> : null }
            { chartAvailable ? <ChartYAxis {...this.props} /> : null }
            { chartAvailable ? <ChartTags {...this.props} /> : null }
            { chartAvailable ? <ChartStyling {...this.props} /> : null }
            { chartAvailable ? <ChartOptions {...this.props} /> : null }
          </aside>
        </section>
        <Footer />
      </div>
    );
  }

}

export default withTracker(props => {
  const subscription = Meteor.subscribe('chart', props.match.params._id);
  return {
    loading: !subscription.ready(),
    chart: Charts.findOne({ _id: props.match.params._id })
  };
})(EditChart);
