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
import ChartOverlays from '../components/ChartOverlays';
import ChartMemo from '../components/ChartMemo';
import ChartStatus from '../components/ChartStatus';
import ChartData from '../components/ChartData';
import ChartXAxis from '../components/ChartXAxis';
import ChartYAxis from '../components/ChartYAxis';
import ChartAnnotations from '../components/ChartAnnotations';
import ChartTags from '../components/ChartTags';
import ChartStyling from '../components/ChartStyling';
import ChartOptions from '../components/ChartOptions';

const defaultAnnoSettings = {
  currId: '',
  highlight: '',
  rangeType: 'area',
  rangeAxis: 'x',
  rangeStart: '',
  rangeEnd: '',
  textAlign: 'left',
  textValign: 'top',
  textText: '',
  textX: '',
  textY: '',
  pointerX1: '',
  pointerY1: '',
  pointerX2: '',
  pointerY2: '',
  pointerCurve: 0.3
};

class EditChart extends Component {

  constructor(props) {
    super(props);
    this.resetCurrentAnnotation = this.resetCurrentAnnotation.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.handleHighlightColor = this.handleHighlightColor.bind(this);
    this.handleCurrentAnnotation = this.handleCurrentAnnotation.bind(this);
    this.expandStatus = this.expandStatus.bind(this);
    this.toggleCollapseExpand = this.toggleCollapseExpand.bind(this);
    const animalName = generateRandomAnimalName();
    this.state = {
      animalName: animalName,
      overlay: false,
      annotationMode: false,
      expanded: 'ChartData',
      currentAnnotation: this.resetCurrentAnnotation(),
      presence: {
        currentChartId: this.props.match.params._id,
        user: animalName
      }
    };
    Presence.state = () => this.state.presence;
  }

  resetCurrentAnnotation() {
    const currentAnnotation = {
      type: 'text'
    };

    Object.keys(defaultAnnoSettings).map(key => {
      let val;
      // need to handle ordinal chart instances
      if (key === 'rangeAxis' && !this.props.loading) {
        const scaleTypeX = this.props.chart.x_axis.scale,
          scaleTypeY = this.props.chart.y_axis.scale;
        if (scaleTypeX === 'ordinal' || scaleTypeY === 'ordinal') {
          val = scaleTypeX === 'ordinal' ? 'y' : 'x';
        } else {
          val = defaultAnnoSettings[key];
        }
      } else {
        val = defaultAnnoSettings[key];
      }
      currentAnnotation[key] = val;
    });

    return currentAnnotation;
  }

  expandStatus(type) {
    return this.state.expanded === type ? 'expanded' : 'collapsed';
  }

  toggleCollapseExpand(event) {
    const expanded = this.state.expanded === event.target.id ? false : event.target.id;

    const state = {
      expanded,
      annotationMode: expanded === 'ChartAnnotations'
    };

    if (state.annotationMode) {
      state.currentAnnotation = this.resetCurrentAnnotation();
    }

    this.setState(state);
  }

  toggleOverlay(event) {
    const overlay = event.target.value === this.state.overlay ? false : event.target.value;
    this.setState({ overlay });
  }

  handleCurrentAnnotation(key, value) {
    const currentAnnotation = Object.assign({}, this.state.currentAnnotation);
    if (typeof key === 'string') {
      currentAnnotation[key] = value;
    } else {
      key.map((k, i) => currentAnnotation[k] = value[i]);
    }
    if (key === 'rangeAxis' || key === 'rangeType') {
      currentAnnotation.rangeStart = '';
      currentAnnotation.rangeEnd = '';
    }
    this.setState({ currentAnnotation });
  }

  handleHighlightColor(event) {
    const currentAnnotation = Object.assign({}, this.state.currentAnnotation);
    currentAnnotation.highlight = event.hex;
    this.setState({ currentAnnotation });
  }

  renderPage() {
    return (
      <div>
        <Header edit={true} {...this.props} />
        <section>
          <article className='main-area'>
            <ChartType
              handleCurrentAnnotation={this.handleCurrentAnnotation}
              resetCurrentAnnotation={this.resetCurrentAnnotation}
              {...this.props}
            />
            <ChartPreview
              annotationMode={this.state.annotationMode}
              currentAnnotation={this.state.currentAnnotation}
              handleRangeState={this.handleRangeState}
              handleCurrentAnnotation={this.handleCurrentAnnotation}
              {...this.props}
            />
            <ChartOutput
              toggleOverlay={this.toggleOverlay}
              {...this.props}
            />
            <ChartOverlays
              overlay={this.state.overlay}
              toggleOverlay={this.toggleOverlay}
              {...this.props}
            />
          </article>
          <aside className='options-area'>
            <ChartMemo
              {...this.props}
            />
            <ChartStatus
              name={this.state.animalName}
              presence={this.state.presence}
              {...this.props}
            />
            <ChartData
              expandStatus={this.expandStatus}
              toggleCollapseExpand={this.toggleCollapseExpand}
              {...this.props}
            />
            <ChartXAxis
              expandStatus={this.expandStatus}
              toggleCollapseExpand={this.toggleCollapseExpand}
              handleCurrentAnnotation={this.handleCurrentAnnotation}
              {...this.props}
            />
            <ChartYAxis
              expandStatus={this.expandStatus}
              toggleCollapseExpand={this.toggleCollapseExpand}
              handleCurrentAnnotation={this.handleCurrentAnnotation}
              {...this.props}
            />
            <ChartAnnotations
              expandStatus={this.expandStatus}
              toggleCollapseExpand={this.toggleCollapseExpand}
              annotationMode={this.state.annotationMode}
              handleHighlightColor={this.handleHighlightColor}
              handleCurrentAnnotation={this.handleCurrentAnnotation}
              handleRangeState={this.handleRangeState}
              currentAnnotation={this.state.currentAnnotation}
              defaultAnnoSettings={defaultAnnoSettings}
              {...this.props}
            />
            <ChartTags
              expandStatus={this.expandStatus}
              toggleCollapseExpand={this.toggleCollapseExpand}
              expanded={this.state.expanded}
              {...this.props}
            />
            <ChartStyling
              expandStatus={this.expandStatus}
              toggleCollapseExpand={this.toggleCollapseExpand}
              {...this.props}
            />
            <ChartOptions
              expandStatus={this.expandStatus}
              toggleCollapseExpand={this.toggleCollapseExpand}
              {...this.props}
            />
          </aside>
        </section>
        <Footer />
      </div>
    );
  }

  render() {
    if (!this.props.loading && !this.props.chart) return <Redirect to='/404' />;
    return !this.props.loading ? this.renderPage() : null;
  }

}

export default withTracker(props => {
  const subscription = Meteor.subscribe('chart', props.match.params._id);
  return {
    loading: !subscription.ready(),
    chart: Charts.findOne({ _id: props.match.params._id })
  };
})(EditChart);
