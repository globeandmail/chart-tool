import React, { Component } from 'react';
import { TwitterPicker as ColorPicker } from 'react-color';
import { updateAndSave, dataParse, isNumber } from '../../modules/utils';
import { app_settings } from '../../modules/settings';
import { parse } from '../../modules/chart-tool';
import { timeFormat } from 'd3-time-format';
import Swal from 'sweetalert2';
import Slider from 'rc-slider';

export default class ChartAnnotations extends Component {

  constructor(props) {
    super(props);
    this.toggleHighlightExpand = this.toggleHighlightExpand.bind(this);
    this.toggleTextExpand = this.toggleTextExpand.bind(this);
    this.toggleRangeExpand = this.toggleRangeExpand.bind(this);
    this.togglePointerExpand = this.togglePointerExpand.bind(this);
    this.resetAnnotations = this.resetAnnotations.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);
    this.editRange = this.editRange.bind(this);
    this.removeRange = this.removeRange.bind(this);
    this.setRangeConfig = this.setRangeConfig.bind(this);
    this.formatRangeValue = this.formatRangeValue.bind(this);
    this.renderRangeValueInput = this.renderRangeValueInput.bind(this);
    this.setRangeValue = this.setRangeValue.bind(this);
    this.setTextConfig = this.setTextConfig.bind(this);
    this.editText = this.editText.bind(this);
    this.removeText = this.removeText.bind(this);
    this.handlePointerCurve = this.handlePointerCurve.bind(this);
    this.editPointer = this.editPointer.bind(this);
    this.removePointer = this.removePointer.bind(this);
    this.pointerDataExists = this.pointerDataExists.bind(this);
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
      const keyArr = ['type'],
        valArr = ['highlight'];
      Object.keys(this.props.defaultAnnoSettings).map(key => {
        keyArr.push(key);
        let val;
        if (key === 'rangeAxis') {
          const scaleTypeX = this.props.chart.x_axis.scale,
            scaleTypeY = this.props.chart.y_axis.scale;
          if (scaleTypeX === 'ordinal' || scaleTypeY === 'ordinal') {
            val = scaleTypeX === 'ordinal' ? 'y' : 'x';
          } else {
            val = this.props.defaultAnnoSettings[key];
          }
        } else {
          val = this.props.defaultAnnoSettings[key];
        }
        valArr.push(val);
      });
      this.props.handleCurrentAnnotation(keyArr, valArr);
    }
    this.setState({ highlightExpanded });
  }

  toggleTextExpand() {
    const textExpanded = !this.state.textExpanded;
    if (textExpanded) {
      this.setState({ highlightExpanded: false, rangeExpanded: false, pointerExpanded: false });
      const keyArr = ['type'],
        valArr = ['text'];
      Object.keys(this.props.defaultAnnoSettings).map(key => {
        keyArr.push(key);
        let val;
        if (key === 'rangeAxis') {
          const scaleTypeX = this.props.chart.x_axis.scale,
            scaleTypeY = this.props.chart.y_axis.scale;
          if (scaleTypeX === 'ordinal' || scaleTypeY === 'ordinal') {
            val = scaleTypeX === 'ordinal' ? 'y' : 'x';
          } else {
            val = this.props.defaultAnnoSettings[key];
          }
        } else {
          val = this.props.defaultAnnoSettings[key];
        }
        valArr.push(val);
      });
      this.props.handleCurrentAnnotation(keyArr, valArr);
    }
    this.setState({ textExpanded });
  }

  toggleRangeExpand() {
    const rangeExpanded = !this.state.rangeExpanded;
    if (rangeExpanded) {
      this.setState({ highlightExpanded: false, textExpanded: false, pointerExpanded: false });
      const keyArr = ['type'],
        valArr = ['range'];
      Object.keys(this.props.defaultAnnoSettings).map(key => {
        keyArr.push(key);
        let val;
        if (key === 'rangeAxis') {
          const scaleTypeX = this.props.chart.x_axis.scale,
            scaleTypeY = this.props.chart.y_axis.scale;
          if (scaleTypeX === 'ordinal' || scaleTypeY === 'ordinal') {
            val = scaleTypeX === 'ordinal' ? 'y' : 'x';
          } else {
            val = this.props.defaultAnnoSettings[key];
          }
        } else {
          val = this.props.defaultAnnoSettings[key];
        }
        valArr.push(val);
      });
      this.props.handleCurrentAnnotation(keyArr, valArr);
    }
    this.setState({ rangeExpanded });
  }

  togglePointerExpand() {
    const pointerExpanded = !this.state.pointerExpanded;
    if (pointerExpanded) {
      this.setState({ highlightExpanded: false, rangeExpanded: false, textExpanded: false });
      const keyArr = ['type'],
        valArr = ['pointer'];
      Object.keys(this.props.defaultAnnoSettings).map(key => {
        keyArr.push(key);
        let val;
        if (key === 'rangeAxis') {
          const scaleTypeX = this.props.chart.x_axis.scale,
            scaleTypeY = this.props.chart.y_axis.scale;
          if (scaleTypeX === 'ordinal' || scaleTypeY === 'ordinal') {
            val = scaleTypeX === 'ordinal' ? 'y' : 'x';
          } else {
            val = this.props.defaultAnnoSettings[key];
          }
        } else {
          val = this.props.defaultAnnoSettings[key];
        }
        valArr.push(val);
      });
      this.props.handleCurrentAnnotation(keyArr, valArr);
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
    this.props.handleCurrentAnnotation(
      ['currId', event.target.name, 'rangeStart', 'rangeEnd'],
      ['', event.target.value, '', '']
    );
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

    const rangePosition = event.target.id,
      rangeValue = event.target.value,
      id = this.props.currentAnnotation.currId;

    if (!isNumber(rangeValue)) return;

    this.props.handleCurrentAnnotation(rangePosition, rangeValue);

    if (isNumber(id)) {
      const range = this.props.chart.annotations.range.slice(),
        key = rangePosition === 'rangeStart' ? 'start' : 'end';
      range[id][key] = rangeValue;
      updateAndSave('charts.update.annotation.range', this.props.chart._id, range);
    }
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
          type={scaleType === 'linear' ? 'number' : 'text'}
          className={`range-value ${scaleType === 'linear' ? 'editable' : ''}`}
          value={this.formatRangeValue(type)}
          onChange={this.setRangeValue}
        />
      </div>
    );

  }

  editRange(event) {
    const range = this.props.chart.annotations.range.slice(),
      id = parseInt(event.target.value),
      item = range[id];

    const keyArr = [
      'rangeStart',
      'rangeEnd',
      'rangeAxis',
      'rangeType',
      'currId'
    ];

    const valueArr = [
      item.start,
      item.end,
      item.axis,
      item.end ? 'area' : 'line',
      id
    ];

    this.props.handleCurrentAnnotation(keyArr, valueArr);
  }

  removeRange(event) {
    const range = this.props.chart.annotations.range.slice();
    range.splice(Number(event.target.value), 1);
    updateAndSave('charts.update.annotation.range', this.props.chart._id, range);
    this.props.handleCurrentAnnotation(
      ['currId', 'rangeStart', 'rangeEnd', 'rangeAxis', 'rangeType'],
      ['', '', '', 'x', 'area']
    );
  }

  setTextConfig(event) {
    this.props.handleCurrentAnnotation(event.target.id, event.target.value);

    const id = this.props.currentAnnotation.currId;

    if (isNumber(id)) {
      const text = this.props.chart.annotations.text.slice();
      text[id][event.target.id === 'textAlign' ? 'text-align' : 'valign'] = event.target.value;
      updateAndSave('charts.update.annotation.text', this.props.chart._id, text);
    }
  }

  editText(event) {
    const text = this.props.chart.annotations.text.slice(),
      id = parseInt(event.target.value),
      item = text[id];

    const keyArr = [
      'textText',
      'textAlign',
      'textValign',
      'textX',
      'textY',
      'currId'
    ];

    const valueArr = [
      item.text,
      item['text-align'],
      item.valign,
      Number(item.position.x),
      Number(item.position.y),
      id
    ];

    this.props.handleCurrentAnnotation(keyArr, valueArr);
  }

  removeText(event) {
    const text = this.props.chart.annotations.text.slice();
    text.splice(Number(event.target.value), 1);
    updateAndSave('charts.update.annotation.text', this.props.chart._id, text);
    this.props.handleCurrentAnnotation(
      ['currId', 'textText', 'textX', 'textY', 'textAlign', 'textValign'],
      ['', '', '', '', 'left', 'top']
    );
  }

  handlePointerCurve(value) {
    this.props.handleCurrentAnnotation('pointerCurve', value);

    const id = this.props.currentAnnotation.currId;

    if (isNumber(id)) {
      const pointer = this.props.chart.annotations.pointer.slice();
      pointer[id].curve = value;
      updateAndSave('charts.update.annotation.pointer', this.props.chart._id, pointer);
    }

  }

  editPointer(event) {

    const pointer = this.props.chart.annotations.pointer.slice(),
      id = parseInt(event.target.value),
      item = pointer[id];

    const keyArr = [
      'pointerCurve',
      'pointerX1',
      'pointerY1',
      'pointerX2',
      'pointerY2',
      'currId'
    ];

    const valueArr = [
      item.curve,
      Number(item.position[0].x),
      Number(item.position[0].y),
      Number(item.position[1].x),
      Number(item.position[1].y),
      id
    ];

    this.props.handleCurrentAnnotation(keyArr, valueArr);

  }

  removePointer(event) {
    const pointer = this.props.chart.annotations.pointer.slice();
    pointer.splice(Number(event.target.value), 1);
    updateAndSave('charts.update.annotation.pointer', this.props.chart._id, pointer);
    this.props.handleCurrentAnnotation(
      ['pointerCurve', 'pointerX1', 'pointerY1', 'pointerX2', 'pointerY2', 'currId'],
      [0.3, '', '', '', '', '']
    );
  }

  resetAnnotations() {
    updateAndSave('charts.reset.annotation', this.props.chart._id);
  }

  helpHighlighting(event) {
    event.stopPropagation();
    Swal({
      title: 'Highlighting?',
      text: "You can now highlight chosen bars and columns with a custom colour. Try it out by clicking on a colour, then clicking on the bar you'd like to recolour.",
      type: 'info'
    });
  }

  helpPointer(event) {
    event.stopPropagation();
    Swal({
      title: 'Pointers?',
      text: 'Use pointer annotations to draw an arrow from one point to another.',
      type: 'info'
    });
  }

  helpRanges(event) {
    event.stopPropagation();
    Swal({
      title: 'Ranges and lines?',
      text: 'You can click and drag on the chart to create a custom range annotation across the x- or y-axis.',
      type: 'info'
    });
  }

  helpText(event) {
    event.stopPropagation();
    Swal({
      title: 'Text?',
      text: 'You can click on the chart to create a custom text annotation.',
      type: 'info'
    });
  }

  pointerDataExists() {
    const anno = this.props.currentAnnotation;
    return anno.pointerX1 && anno.pointerY1 && anno.pointerX2 && anno.pointerY2;
  }

  render() {
    return (
      <div className='edit-box'>
        <h3 id='ChartAnnotations' onClick={this.props.toggleCollapseExpand}>Annotations</h3>
        <div className={`unit-edit ${this.props.expandStatus('ChartAnnotations')}`}>

          {this.props.annotationMode ?
            <p className='note'>While the Annotation tab is open, previewed chart tips are disabled. Annotations being edited will appear in <span className='note-anno-color'>this color</span>.</p> : null
          }

          <div className='unit-edit unit-anno anno-text-edit'>
            <h4 onClick={this.toggleTextExpand}><span className='anno-subhed'>Text annotations</span> <a onClick={this.helpText} className='help-toggle help-anno-text'>?</a></h4>
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
                    <label htmlFor='textValign'>Vertical alignment</label>
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
              </div>

              {this.currentAnno('text') ?
                <div className='current-text'>
                  <p>Current text annotations</p>
                  <ul>
                    {this.props.chart.annotations.text.map((d, i) => {
                      let keyId;
                      if (this.props.currentAnnotation.type === 'text') {
                        keyId = this.props.currentAnnotation.currId;
                      }
                      return (
                        <li
                          className={`text-item ${i === keyId ? 'text-item-selected' : ''}`}
                          key={i}
                        >
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
            <h4 onClick={this.togglePointerExpand}><span className='anno-subhed'>Pointers</span> <a onClick={this.helpPointer} className='help-toggle help-anno-pointer'>?</a></h4>
            <div className={`unit-annotation-expand ${this.expandStatus('pointerExpanded')}`}>
              <div className='add-pointer'>
                <div className='pointer-row'>
                  <div className='pointer-row-item'>
                    <label>Pointer curviness</label>
                    <Slider
                      min={-1}
                      max={1}
                      value={this.props.currentAnnotation.pointerCurve}
                      step={0.1}
                      onChange={this.handlePointerCurve}
                    />
                  </div>
                </div>
              </div>

              {this.currentAnno('pointer') ?
                <div className='current-pointer'>
                  <p>Current pointers</p>
                  <ul>
                    {this.props.chart.annotations.pointer.map((d, i) => {
                      let keyId;
                      if (this.props.currentAnnotation.type === 'pointer') {
                        keyId = this.props.currentAnnotation.currId;
                      }
                      return (
                        <li
                          className={`pointer-item ${i === keyId ? 'pointer-item-selected' : ''}`}
                          key={i}
                        >
                          <p>Pointer {i + 1}</p>
                          <div className='pointer-tools'>
                            <button className='pointer-edit' value={i} onClick={this.editPointer}>Edit</button>
                            <button className='pointer-remove' value={i} onClick={this.removePointer}>&times;</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                : null }
            </div>
          </div>

          <div className='unit-edit unit-anno anno-highlight-edit'>
            <h4 onClick={this.toggleHighlightExpand}><span className='anno-subhed'>Highlighting</span> <a onClick={this.helpHighlighting} className='help-toggle help-anno-higlight'>?</a></h4>
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
                  <div className='current-highlight'>
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
            <h4 onClick={this.toggleRangeExpand}><span className='anno-subhed'>Ranges and lines</span> <a onClick={this.helpRanges} className='help-toggle help-anno-ranges'>?</a></h4>
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
                        value={this.props.currentAnnotation.rangeAxis}
                        onChange={this.setRangeConfig}
                      >
                        {['x', 'y']
                          .filter(axis => {
                            return this.props.chart[`${axis}_axis`].scale !== 'ordinal';
                          })
                          .map(f => {
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
                        value={this.props.currentAnnotation.rangeType}
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
              </div>

              {this.currentAnno('range') ?
                <div className='current-ranges'>
                  <p>Current ranges</p>
                  <ul>
                    {this.props.chart.annotations.range.map((d, i) => {
                      if (d === null) return;
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
                      let keyId;
                      if (this.props.currentAnnotation.type === 'range') {
                        keyId = this.props.currentAnnotation.currId;
                      }
                      return (
                        <li
                          className={`range-item ${i === keyId ? 'range-item-selected' : ''}`}
                          key={i}
                        >
                          <p>{d.axis.toUpperCase()}, {d.end ? 'AREA' : 'LINE'} <span>{data.start}</span>{d.end ? ' to ' : ''}{d.end ? <span>{data.end}</span> : null}</p>
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
