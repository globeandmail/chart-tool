import React, { Component } from 'react';
import { TwitterPicker as ColorPicker } from 'react-color';
import { updateAndSave, dataParse } from '../../modules/utils';
import { app_settings } from '../../modules/settings';
import { parse } from '../../modules/chart-tool';
import { timeFormat } from 'd3-time-format';
import Swal from 'sweetalert2';

export default class ChartAnnotations extends Component {

  constructor(props) {
    super(props);
    this.toggleCollapseExpand = this.toggleCollapseExpand.bind(this);
    this.toggleHighlightExpand = this.toggleHighlightExpand.bind(this);
    this.toggleTextExpand = this.toggleTextExpand.bind(this);
    this.toggleRangeExpand = this.toggleRangeExpand.bind(this);
    this.resetAnnotations = this.resetAnnotations.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);
    this.addRange = this.addRange.bind(this);
    this.state = {
      expanded: true,
      highlightExpanded: false,
      textExpanded: false,
      rangeExpanded: true
    };
  }

  expandStatus(category) {
    return this.state[category] ? 'expanded' : 'collapsed';
  }

  toggleCollapseExpand() {
    const expanded = !this.state.expanded;
    this.setState({ expanded });
    this.props.toggleAnnotationMode(expanded);
  }

  toggleHighlightExpand() {
    const highlightExpanded = !this.state.highlightExpanded;
    if (highlightExpanded) {
      this.setState({ textExpanded: false, rangeExpanded: false });
      this.props.handleCurrentAnnotation('type', 'highlight');
    }
    this.setState({ highlightExpanded });
  }

  toggleTextExpand() {
    const textExpanded = !this.state.textExpanded;
    const modObj = {};
    if (textExpanded) {
      modObj.highlightExpanded = false;
      modObj.rangeExpanded = false;
      this.props.handleCurrentAnnotation('type', 'text');
    }
    modObj.textExpanded = textExpanded;
    this.setState(modObj);
  }

  toggleRangeExpand() {
    const rangeExpanded = !this.state.rangeExpanded;
    if (rangeExpanded) {
      this.setState({ highlightExpanded: false, textExpanded: false });
      this.props.handleCurrentAnnotation('type', 'range');
    }
    this.setState({ rangeExpanded });
  }

  displayHighlight() {
    const { data } = dataParse(this.props.chart.data);

    let needsDates;

    if (this.props.chart.options.type !== 'bar') {
      needsDates = this.props.chart.x_axis.scale === 'ordinal' ? undefined : this.props.chart.date_format;
    }

    let dataObj, error;

    try {
      dataObj = parse(data, needsDates, this.props.chart.options.indexed);
    } catch(e) {
      error = e;
    }

    if (error) return;

    if (this.props.chart.options.type === 'bar' || this.props.chart.options.type === 'column') {
      return dataObj.seriesAmount === 1;
    } else {
      return false;
    }
  }

  highlightColors() {
    if (app_settings) return app_settings.highlightOptions;
  }

  currentAnno(type) {
    const chart = this.props.chart;
    if (chart.annotations && chart.annotations[type] && chart.annotations[type].length) {
      return true;
    } else {
      return false;
    }
  }

  removeHighlight(event) {
    const key = event.target.value;
    const h = this.props.chart.annotations.highlight.filter(d => {
      if (d.key !== key) return d;
    });
    updateAndSave('charts.update.annotation.highlight', this.props.chart._id, h);
  }

  addRange(event) {

  }

  resetAnnotations() {
    updateAndSave('charts.update.annotation.reset', this.props.chart._id);
  }

  helpHighlighting() {
    Swal({
      title: 'Highlighting?',
      text: "You can now highlight chosen bars and columns with a custom colour. Try it out by clicking on a colour, then clicking on the bar you'd like to recolour.",
      type: 'info'
    });
  }

  helpRanges() {

  }

  helpText() {

  }

  // RANGES
  // Should include a field where you can type the minimum and maximum value
  // How do I handle ordinal-time data?
  //
  // LINE OR AREA
  // column headings
  //
  // annotations = {
  //   highlight: [
  //     {
  //       key: 'Canada',
  //       color: '#HEX'
  //     }
  //   ],
  //   range: [
  //     {
  //       axis: 'x|y',
  //       style: '',
  //       start: 'DATE',
  //       end: 'DATE' // optional
  //     }
  //   ],
  //   text: [
  //     {
  //       type: 'point',
  //       x: '12%',
  //       y: '14%',
  //       alignment: 'tl'
  //     },
  //     {
  //       type: 'area',
  //       x1: '12%',
  //       y1: 'derp',
  //       x2: 'derp',
  //       y2: 'derp',
  //       alignment: 'tl'
  //     }
  //   ]
  // };

  render() {
    return (
      <div className='edit-box'>
        <h3 onClick={this.toggleCollapseExpand}>Annotations</h3>
        <div className={`unit-edit ${this.expandStatus('expanded')}`}>

          {this.props.annotationMode ?
            <p className='note'>Note: While the Annotation tab is open, previewed chart tips will be disabled.</p> : null
          }

          <div className='unit-edit unit-anno anno-highlight-edit'>
            <h4><span className='anno-subhed' onClick={this.toggleHighlightExpand}>Highlighting</span> <a onClick={this.helpHighlighting} className='help-toggle help-anno-higlight'>?</a></h4>
            {this.displayHighlight() ?
              <div className={`unit-annotation-expand ${this.expandStatus('highlightExpanded')}`}>
                <ColorPicker
                  triangle={'hide'}
                  colors={app_settings.highlightOptions}
                  onChangeComplete={this.props.handleHighlightColor}
                  color={this.props.currentAnnotation.highlight}
                  width={'100%'}
                  className={'color-picker'}
                />
                {this.currentAnno('highlight') ?
                  <div className='currently-highlighted'>
                    <p>Currently highlighted</p>
                    <ul>
                      {this.props.chart.annotations.highlight.map(d => {
                        const formatTime = timeFormat(this.props.chart.date_format);
                        let keyText = d.key;
                        if (this.props.chart.x_axis.scale === 'time' || this.props.chart.x_axis.scale === 'ordinal-time') {
                          keyText = formatTime(new Date(d.key));
                        }
                        return (
                          <li className='highlight-item' key={d.key}>
                            <div className='highlight-color' style={{ backgroundColor: d.color }}>
                              <button className='highlight-remove' value={d.key} onClick={this.removeHighlight}>&times;</button>
                            </div>
                            <div className='highlight-key'>{keyText}</div>
                          </li>
                        );
                      })}
                  </ul>
                  </div>
                : null }
              </div> : null }
          </div>

          <div className='unit-edit unit-anno anno-text-edit'>
            <h4><span className='anno-subhed' onClick={this.toggleRangeExpand}>Ranges</span> <a onClick={this.helpRanges} className='help-toggle help-anno-ranges'>?</a></h4>
            <div className={`unit-annotation-expand ${this.expandStatus('rangeExpanded')}`}>

              <form className='add-range' onSubmit={this.addRange}>
                <p>Add a new range</p>
                <ul>
                  <li>
                    <p>Axis</p>
                    <div className='select-wrapper'>
                      <select
                        className='select-rangeaxis'
                        name='rangeAxis'
                        defaultValue={this.props.currentAnnotation.rangeAxis}
                        onChange={this.props.handleRangeState}
                        >
                        {['x', 'y'].map(f => {
                          const str = `${f.toUpperCase()}-axis`;
                          return <option key={f} value={f}>{str}</option>;
                        })}
                      </select>
                    </div>
                  </li>
                  <li>
                    <p>Type</p>
                    <div className='select-wrapper'>
                      <select
                        className='select-rangetype'
                        name='rangeType'
                        defaultValue={this.props.currentAnnotation.rangeType}
                        onChange={this.props.handleRangeState}
                        >
                        {['Area', 'Line'].map(f => {
                          return <option key={f} value={f.toLowerCase()}>{f}</option>;
                        })}
                      </select>
                    </div>
                  </li>
                  <li>
                    <p>Start</p>
                    <p className='range-value'>{this.props.currentAnnotation.rangeStart}</p>
                  </li>
                  <li>
                    <p>End</p>
                    <p className='range-value'>{this.props.currentAnnotation.rangeEnd}</p>
                  </li>
                </ul>
                <button>Add range</button>
              </form>

              {this.currentAnno('range') ?
                <div className='current-ranges'>
                  <p>Current ranges</p>
                  <ul>
                    {this.props.chart.annotations.range.map(d => {
                      // const formatTime = timeFormat(this.props.chart.date_format);
                      // let keyText = d.key;
                      // if (this.props.chart.x_axis.scale === 'time' || this.props.chart.x_axis.scale === 'ordinal-time') {
                      //   keyText = formatTime(new Date(d.key));
                      // }
                      // return (
                      //   <li className='highlight-item' key={d.key}>
                      //     <div className='highlight-color' style={{ backgroundColor: d.color }}>
                      //       <button className='highlight-remove' value={d.key} onClick={this.removeHighlight}>&times;</button>
                      //     </div>
                      //     <div className='highlight-key'>{keyText}</div>
                      //   </li>
                      // );
                    })}
                </ul>
                </div>
              : null }
              {/* Add line|range
              Current range elements */}
            </div>
          </div>

          <div className='unit-edit anno-text-edit' style={{ opacity: 0.2 }}>
            <h4>Text annotations (coming soon) <a onClick={this.helpText} className='help-toggle help-anno-text'>?</a></h4>
            {/* Add point|area text
            Current text elements
            Alignment */}
          </div>

          <button className='annotation-reset' onClick={this.resetAnnotations}>Reset all annotations</button>

        </div>
      </div>
    );
  }

}
