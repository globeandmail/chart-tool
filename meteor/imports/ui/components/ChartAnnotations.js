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
    this.toggleHighlightExpand = this.toggleHighlightExpand.bind(this);
    this.toggleTextExpand = this.toggleTextExpand.bind(this);
    this.toggleRangeExpand = this.toggleRangeExpand.bind(this);
    this.togglePointerExpand = this.togglePointerExpand.bind(this);
    this.resetAnnotations = this.resetAnnotations.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);
    this.addRange = this.addRange.bind(this);
    this.editRange = this.editRange.bind(this);
    this.removeRange = this.removeRange.bind(this);
    this.setRangeConfig = this.setRangeConfig.bind(this);
    this.formatRangeValue = this.formatRangeValue.bind(this);
    this.renderRangeValueInput = this.renderRangeValueInput.bind(this);
    this.setRangeValue = this.setRangeValue.bind(this);
    this.setTextConfig = this.setTextConfig.bind(this);
    this.addText = this.addText.bind(this);
    this.editText = this.editText.bind(this);
    this.removeText = this.removeText.bind(this);
    this.state = {
      textExpanded: true,
      pointerExpanded: false,
      highlightExpanded: false,
      rangeExpanded: false
    };
  }

  expandStatus(category) {
    return this.state[category] ? 'expanded' : 'collapsed';
  }

  toggleHighlightExpand() {
    const highlightExpanded = !this.state.highlightExpanded;
    if (highlightExpanded) {
      this.setState({ textExpanded: false, rangeExpanded: false, pointerExpanded: false });
      this.props.handleCurrentAnnotation('type', 'highlight');
    }
    this.setState({ highlightExpanded });
  }

  toggleTextExpand() {
    const textExpanded = !this.state.textExpanded;
    if (textExpanded) {
      this.setState({ highlightExpanded: false, rangeExpanded: false, pointerExpanded: false });
      this.props.handleCurrentAnnotation('type', 'text');
    }
    this.setState({ textExpanded });
  }

  toggleRangeExpand() {
    const rangeExpanded = !this.state.rangeExpanded;
    if (rangeExpanded) {
      this.setState({ highlightExpanded: false, textExpanded: false, pointerExpanded: false });
      this.props.handleCurrentAnnotation('type', 'range');
    }
    this.setState({ rangeExpanded });
  }

  togglePointerExpand() {
    const pointerExpanded = !this.state.pointerExpanded;
    if (pointerExpanded) {
      this.setState({ highlightExpanded: false, rangeExpanded: false, textExpanded: false });
      this.props.handleCurrentAnnotation('type', 'pointer');
    }
    this.setState({ pointerExpanded });
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

  setRangeConfig(event) {
    this.props.handleCurrentAnnotation(event.target.name, event.target.value);
  }

  formatRangeValue(range) {
    const data = this.props.currentAnnotation[range];

    if (!data) return '';

    const axis = this.props.chart[`${this.props.currentAnnotation.rangeAxis}_axis`];

    if (axis.scale === 'time' || axis.scale === 'ordinal-time') {
      const formatTime = timeFormat(this.props.chart.date_format);
      return formatTime(new Date(data));
    } else {

      // if it's direct input, let it be whatever the user wants
      if (event.type === 'input') return data;

      const rangeFormatting = {
        comma: 100,
        general: 100,
        round1: 10,
        round2: 100,
        round3: 1000,
        round4: 10000
      };

      return Math.round(Number(data) * rangeFormatting[axis.format]) / rangeFormatting[axis.format];
    }
  }

  setRangeValue(event) {
    this.props.handleCurrentAnnotation(event.target.id, event.target.value);
  }

  renderRangeValueInput(type) {

    const rangeAxis = this.props.currentAnnotation.rangeAxis,
      rangeType = this.props.currentAnnotation.rangeType,
      scaleType = this.props.chart[`${rangeAxis}_axis`].scale,
      labelText = type === 'rangeStart' ? 'Start' : 'End (optional)';

    return (
      <div className={`range-row-item ${rangeType === 'line' && type === 'rangeEnd' ? 'muted' : ''}`}>
        <label
          className={`range-value ${scaleType === 'linear' ? 'editable' : ''}`}
          htmlFor={type}>{labelText}</label>
        <input
          id={type}
          className={`range-value ${scaleType === 'linear' ? 'editable' : ''}`}
          value={this.formatRangeValue(type)}
          onChange={this.setRangeValue}
        />
      </div>
    );

  }

  addRange() {
    const data = {
      axis: this.props.currentAnnotation.rangeAxis,
      start: this.props.currentAnnotation.rangeStart.toString(),
      end: this.props.currentAnnotation.rangeEnd.toString()
    };
    const range = this.props.chart.annotations.range || [];
    range.push(data);
    updateAndSave('charts.update.annotation.range', this.props.chart._id, range);
    this.props.handleCurrentAnnotation(['rangeStart', 'rangeEnd'], ['', '']);
  }

  editRange(event) {
    const range = this.props.chart.annotations.range.slice(),
      item = range[Number(event.target.value)];

    const keyArr = [
      'rangeStart',
      'rangeEnd',
      'rangeAxis',
      'rangeType'
    ];

    const valueArr = [
      item.start,
      item.end,
      item.axis,
      item.end ? 'area' : 'line'
    ];

    this.props.handleCurrentAnnotation(keyArr, valueArr);
    this.removeRange(event);
  }

  removeRange(event) {
    const range = this.props.chart.annotations.range.slice();
    range.splice(Number(event.target.value), 1);
    updateAndSave('charts.update.annotation.range', this.props.chart._id, range);
  }

  setTextConfig(event) {
    this.props.handleCurrentAnnotation(event.target.id, event.target.value);
  }

  addText() {
    const data = {
      text: this.props.currentAnnotation.textText,
      valign: this.props.currentAnnotation.textValign,
      'text-align': this.props.currentAnnotation.textAlign,
      position: {
        x: Number(this.props.currentAnnotation.textX),
        y: Number(this.props.currentAnnotation.textY),
      }
    };
    const text = this.props.chart.annotations.text || [];
    text.push(data);
    updateAndSave('charts.update.annotation.text', this.props.chart._id, text);
    this.props.handleCurrentAnnotation(['textText', 'textAlign', 'textValign', 'textX', 'textY'], ['', 'left', 'top', '', '']);
  }

  editText(event) {
    const text = this.props.chart.annotations.text.slice(),
      item = text[Number(event.target.value)];

    const keyArr = [
      'textText',
      'textAlign',
      'textValign',
      'textX',
      'textY'
    ];

    const valueArr = [
      item.text,
      item['text-align'],
      item.valign,
      Number(item.position.x),
      Number(item.position.y)
    ];

    this.props.handleCurrentAnnotation(keyArr, valueArr);
    this.removeText(event);
  }

  removeText(event) {
    const text = this.props.chart.annotations.text.slice();
    text.splice(Number(event.target.value), 1);
    updateAndSave('charts.update.annotation.text', this.props.chart._id, text);
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

  helpPointer() {
    Swal({
      title: 'Pointers?',
      text: 'Use pointer annotations to draw an arrow from one point to another.',
      type: 'info'
    });
  }

  helpRanges() {
    Swal({
      title: 'Ranges and lines?',
      text: 'You can click and drag on the chart to create a custom range annotation across the x- or y-axis.',
      type: 'info'
    });
  }

  helpText() {
    Swal({
      title: 'Text?',
      text: 'You can click on the chart to create a custom text annotation.',
      type: 'info'
    });
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 id='ChartAnnotations' onClick={this.props.toggleCollapseExpand}>Annotations</h3>
        <div className={`unit-edit ${this.props.expandStatus('ChartAnnotations')}`}>

          {this.props.annotationMode ?
            <p className='note'>Note: While the Annotation tab is open, previewed chart tips will be disabled.</p> : null
          }

          <div className='unit-edit unit-anno anno-text-edit'>
            <h4><span className='anno-subhed' onClick={this.toggleTextExpand}>Text annotations</span> <a onClick={this.helpText} className='help-toggle help-anno-text'>?</a></h4>
            <div className={`unit-annotation-expand ${this.expandStatus('textExpanded')}`}>
              <div className='add-text'>
                <div className='text-row'>
                  <div className='text-row-item'>
                    <label htmlFor='textAlign'>Text alignment</label>
                    <div className='select-wrapper'>
                      <select
                        id='textAlign'
                        className='select-textalign'
                        name='textAlign'
                        value={this.props.currentAnnotation.textAlign}
                        onChange={this.setTextConfig}
                      >
                        {['Left', 'Middle', 'Right'].map(f => {
                          return <option key={f} value={f.toLowerCase()}>{f}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className='text-row-item'>
                    <label htmlFor='textValign'>Vertical align</label>
                    <div className='select-wrapper'>
                      <select
                        id='textValign'
                        className='select-textvalign'
                        name='textValign'
                        value={this.props.currentAnnotation.textValign}
                        onChange={this.setTextConfig}
                      >
                        {['Top', 'Middle', 'Bottom'].map(f => {
                          return <option key={f} value={f.toLowerCase()}>{f}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  className={this.props.currentAnnotation.textText ? 'active' : ''}
                  onClick={this.addText}
                >Save text</button>
              </div>

              {this.currentAnno('text') ?
                <div className='current-text'>
                  <p>Current text annotations</p>
                  <ul>
                    {this.props.chart.annotations.text.map((d, i) => {
                      return (
                        <li className='text-item' key={i}>
                          <p>{d.text}</p>
                          <div className='text-tools'>
                            <button className='text-edit' value={i} onClick={this.editText}>Edit</button>
                            <button className='text-remove' value={i} onClick={this.removeText}>&times;</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                : null }
            </div>
          </div>


          <div className='unit-edit unit-anno anno-pointer-edit'>
            <h4><span className='anno-subhed' onClick={this.togglePointerExpand}>Pointers</span> <a onClick={this.helpPointer} className='help-toggle help-anno-pointer'>?</a></h4>
            <div className={`unit-annotation-expand ${this.expandStatus('pointerExpanded')}`}>
              <div className='add-pointer'>
                <div className='pointer-row'>
                  <div className='pointer-row-item'>
                    {/* <label htmlFor='textAlign'>Text alignment</label>
                    <div className='select-wrapper'>
                      <select
                        id='textAlign'
                        className='select-textalign'
                        name='textAlign'
                        value={this.props.currentAnnotation.textAlign}
                        onChange={this.setTextConfig}
                      >
                        {['Left', 'Middle', 'Right'].map(f => {
                          return <option key={f} value={f.toLowerCase()}>{f}</option>;
                        })}
                      </select>
                    </div> */}
                  </div>
                  <div className='pointer-row-item'>
                    {/* <label htmlFor='textValign'>Vertical align</label>
                    <div className='select-wrapper'>
                      <select
                        id='textValign'
                        className='select-textvalign'
                        name='textValign'
                        value={this.props.currentAnnotation.textValign}
                        onChange={this.setTextConfig}
                      >
                        {['Top', 'Middle', 'Bottom'].map(f => {
                          return <option key={f} value={f.toLowerCase()}>{f}</option>;
                        })}
                      </select>
                    </div> */}
                  </div>
                </div>
                <button
                  // className={this.props.currentAnnotation.textText ? 'active' : ''}
                  onClick={this.addPointer}
                >Save pointer</button>
              </div>

              {this.currentAnno('pointer') ?
                <div className='current-pointer'>
                  <p>Current pointers</p>
                  <ul>
                    {this.props.chart.annotations.pointer.map((d, i) => {
                      // return (
                      //   <li className='text-item' key={i}>
                      //     <p>{d.text}</p>
                      //     <div className='text-tools'>
                      //       <button className='text-edit' value={i} onClick={this.editText}>Edit</button>
                      //       <button className='text-remove' value={i} onClick={this.removeText}>&times;</button>
                      //     </div>
                      //   </li>
                      // );
                    })}
                  </ul>
                </div>
                : null }
            </div>
          </div>

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
            <h4><span className='anno-subhed' onClick={this.toggleRangeExpand}>Ranges and lines</span> <a onClick={this.helpRanges} className='help-toggle help-anno-ranges'>?</a></h4>
            <div className={`unit-annotation-expand ${this.expandStatus('rangeExpanded')}`}>
              <div className='add-range'>
                <p className='note'>Select a start value (and optionally an end value) by clicking and dragging on the chart or editing the fields below.</p>
                <div className='range-row'>
                  <div className='range-row-item'>
                    <label htmlFor='rangeAxis'>Axis</label>
                    <div className='select-wrapper'>
                      <select
                        id='rangeAxis'
                        className='select-rangeaxis'
                        name='rangeAxis'
                        defaultValue={this.props.currentAnnotation.rangeAxis}
                        onChange={this.setRangeConfig}
                      >
                        {['x', 'y'].map(f => {
                          const str = `${f.toUpperCase()}-axis`;
                          return <option key={f} value={f}>{str}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className='range-row-item'>
                    <label htmlFor='rangeType'>Type</label>
                    <div className='select-wrapper'>
                      <select
                        id='rangeType'
                        className='select-rangetype'
                        name='rangeType'
                        defaultValue={this.props.currentAnnotation.rangeType}
                        onChange={this.setRangeConfig}
                      >
                        {['Area', 'Line'].map(f => {
                          return <option key={f} value={f.toLowerCase()}>{f}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='range-row'>
                  { this.renderRangeValueInput('rangeStart') }
                  { this.renderRangeValueInput('rangeEnd') }
                </div>
                <button
                  className={this.props.currentAnnotation.rangeStart ? 'active' : ''}
                  onClick={this.addRange}
                >Save range</button>
              </div>

              {this.currentAnno('range') ?
                <div className='current-ranges'>
                  <p>Current ranges</p>
                  <ul>
                    {this.props.chart.annotations.range.map((d, i) => {
                      const axis = this.props.chart[`${d.axis}_axis`];
                      const data = {};
                      if (axis.scale === 'time' || axis.scale === 'ordinal-time') {
                        const formatTime = timeFormat(this.props.chart.date_format);
                        data.start = formatTime(new Date(d.start));
                        data.end = formatTime(new Date(d.end));
                      } else {
                        const rangeFormatting = {
                          comma: 100,
                          general: 100,
                          round1: 10,
                          round2: 100,
                          round3: 1000,
                          round4: 10000
                        };
                        data.start = Math.round(Number(d.start) * rangeFormatting[axis.format]) / rangeFormatting[axis.format];
                        data.end = Math.round(Number(d.end) * rangeFormatting[axis.format]) / rangeFormatting[axis.format];
                      }
                      return (
                        <li className='range-item' key={i}>
                          <p>{d.axis}, {d.end ? 'Area' : 'Line'} <span>{data.start}</span>{d.end ? ' to ' : ''}{d.end ? <span>{data.end}</span> : null}</p>
                          <div className='range-tools'>
                            <button className='range-edit' value={i} onClick={this.editRange}>Edit</button>
                            <button className='range-remove' value={i} onClick={this.removeRange}>&times;</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                : null }
            </div>
          </div>

          <button className='annotation-reset' onClick={this.resetAnnotations}>Reset all annotations</button>

        </div>
      </div>
    );
  }

}
