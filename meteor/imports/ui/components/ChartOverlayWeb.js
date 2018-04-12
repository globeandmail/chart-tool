import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import fileSaver from 'file-saver';
import Chart from './Chart';

const exportSettings = {
  facebook: {
    width: 500,
    height: Math.round(500 / 1.913636364),
    scale: 2.85
  },
  instagram: {
    width: 380,
    height: 380,
    scale: 2.85
  },
  twitter: {
    width: 500,
    height: Math.round(500 / 1.783898305),
    scale: 2.85
  },
  picker: {
    width: 460,
    height: 308,
    ratio: 0.67,
    scale: 2
  },
  custom: {
    width: 380,
    height: 200,
    scale: 2
  }
};

export default class ChartOverlayWeb extends Component {

  constructor(props) {
    super(props);
    this.handleExport = this.handleExport.bind(this);
    this.handleWebSize = this.handleWebSize.bind(this);
    this.handleCustomSize = this.handleCustomSize.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleWebMode = this.handleWebMode.bind(this);
    this.handleSocialMode = this.handleSocialMode.bind(this);
    this.state = {
      width: exportSettings.instagram.width,
      height: exportSettings.instagram.height,
      margin: 3,
      active: true,
      mode: 'social',
      socialMode: 'instagram',
      hide: {
        head: false,
        qualifier: false,
        footer: true
      }
    };
  }

  handleExport(event) {
    event.preventDefault();

    this.setState({ active: false });

    let filename = `${this.props.chart.slug}-web`;

    let width, height, scale;

    if (event.target.name === 'social') {
      width = exportSettings[this.state.socialMode].width;
      scale = exportSettings[this.state.socialMode].scale;
      height = exportSettings[this.state.socialMode].height;
      filename += `-${this.state.socialMode}`;
    }

    if (event.target.name === 'picker') {
      for (let i = 0; i < event.target.length; i++) {
        const n = Number(event.target[i].value);
        if (event.target[i].name === 'width') width = n;
        if (event.target[i].name === 'ratio') height = Math.round(width * n);
        scale = 2;
      }
    }

    if (event.target.name === 'custom') {
      width = Number(this.state.width);
      height = Number(this.state.height);
      scale = Number(event.target[2].value);
    }

    Meteor.call('chart.png.download', this.props.chart._id, {
      width,
      height,
      scale,
      margin: this.state.margin,
      hide: this.state.hide
    }, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        const blob = new Blob([response], { type: 'image/png' });
        fileSaver.saveAs(blob, `${filename}.png`);
        this.setState({ active: true });
      }
    });

  }

  handleWebSize(event) {
    const name = event.target.name,
      val = Number(event.target.value);
    if (name === 'width') this.setState({ width: val });
    if (name === 'ratio') {
      this.setState({ height: (this.state.width * val) });
    }
  }

  handleCustomSize(event) {
    const size = event.target.value,
      width = event.target.name === 'width',
      height = event.target.name === 'height';
    if (width) this.setState({ width: size });
    if (height) this.setState({ height: size });
  }

  canExport() {
    return (this.state.width && this.state.height) ? 'active' : '';
  }

  handleHide(event) {
    const hide = this.state.hide;
    hide[event.target.name] = event.target.checked;
    this.setState({ hide });
  }

  handleWebMode(event) {
    const mode = event.target.value;
    let width, height;
    if (mode === 'social') {
      width = exportSettings[this.state.socialMode].width;
      height = exportSettings[this.state.socialMode].height;
    } else {
      width = exportSettings[mode].width;
      height = exportSettings[mode].height;
    }
    this.setState({ mode, width, height });
  }

  handleSocialMode(event) {
    const socialMode = event.target.value,
      width = exportSettings[socialMode].width,
      height = exportSettings[socialMode].height;
    this.setState({
      socialMode,
      width,
      height
    });
  }

  renderSocial() {
    return (
      <div className='web-export web-export-form web-export-social'>
        <p>Social images are sized to match the aspect ratios of their respective platforms&rsquo; &ldquo;cards&rdquo;.</p>
        <form onSubmit={this.handleExport} name='social' className='web-export-social'>
          <ul>
            {['Instagram', 'Facebook', 'Twitter'].map(c => {
              const val = c.toLowerCase();
              return (
                <li key={c}>
                  <input
                    name={val}
                    id={`web-${val}`}
                    type='radio'
                    value={val}
                    className='input-radio'
                    checked={val === this.state.socialMode}
                    onChange={this.handleSocialMode}
                  />
                  <label htmlFor={`web-${val}`}>{c}</label>
                </li>
              );
            })}
          </ul>
          <input className={`web-export-submit web-export-submit-social ${this.canExport()}`} value='Download' type='submit' />
        </form>
      </div>
    );
  }

  renderCustom() {
    return (
      <div className='web-export web-export-form web-export-custom'>
        <p>Need a custom-sized image of your chart? Just pick a width, height, and scaling factor.</p>
        <form onSubmit={this.handleExport} name='custom' className='web-export-custom'>
          <div className='web-export-row'>
            <div className='web-export-custom-field web-export-custom-field-width'>
              <h5>Width</h5>
                <span><input
                  type='number'
                  name='width'
                  placeholder='400'
                  className='input-field'
                  value={this.state.width}
                  onChange={this.handleCustomSize}
                />px</span>
            </div>
            <div className='web-export-custom-field web-export-custom-field-height'>
              <h5>Height</h5>
                <span><input
                  type='number'
                  name='height'
                  placeholder='600'
                  className='input-field'
                  value={this.state.height}
                  onChange={this.handleCustomSize}
                />px</span>
            </div>
            <div className='web-export-custom-field web-export-custom-field-scale'>
              <h5>Scale</h5>
              <div className='select-wrapper'>
                <select type='choice' name='scale' className='select-web-export-custom-scale' defaultValue={'2'}>
                  <option value='2'>2&times;</option>
                  <option value='3'>3&times;</option>
                  <option value='4'>4&times;</option>
                  <option value='5'>5&times;</option>
                </select>
              </div>
            </div>
          </div>
          <input className={`web-export-submit web-export-submit-custom ${this.canExport()}`} value='Download' type='submit' />
        </form>
      </div>
    );
  }

  renderWeb() {
    return (
      <div className='web-export web-export-form web-export-web'>
        <p>Web images are available at several widths and aspect ratios, and download at 2&times; scale for retina screen support.</p>
        <form onSubmit={this.handleExport} name='picker' className='web-export-picker'>
          <div className='web-export-row'>
            <div className='web-export-field web-export-field-width'>
              <h5>Width</h5>
              <div className='select-wrapper'>
                <select
                  type='choice'
                  name='width'
                  className='select-web-export-width'
                  onChange={this.handleWebSize}
                  defaultValue={exportSettings.picker.width}>
                  <option value={320}>320px</option>
                  <option value={460}>460px</option>
                  <option value={620}>620px</option>
                </select>
              </div>
            </div>
            <div className='web-export-field web-export-field-ratio'>
              <h5>Ratio</h5>
              <div className='select-wrapper'>
                <select
                  type='choice'
                  name='ratio'
                  className='select-web-export-ratio'
                  onChange={this.handleWebSize}
                  defaultValue={exportSettings.picker.ratio}>
                  <option value={0.67}>3&times;2</option>
                  <option value={0.5625}>16&times;9</option>
                  <option value={1}>1&times;1</option>
                  <option value={1.5}>2&times;3</option>
                  <option value={0.5}>2&times;1</option>
                </select>
              </div>
            </div>
          </div>
          <input className='web-export-submit' value='Download' type='submit' />
        </form>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className='overlay-outer' />
        <div className={`overlay-container ${this.state.active ? 'active' : ''}`}>
          <div className='overlay-header'>
            <h3>Web export</h3>
            <button value={'web'} onClick={this.props.toggleOverlay} className='overlay-close'>&times;</button>
          </div>
          <div className='overlay-web'>
            <div className='web-export-preview'>
              <h3>Preview</h3>
              <p>A preview of your exported chart.</p>
              <div className='web-export-preview-chart'>
                <Chart
                  type={'png'}
                  chart={this.props.chart}
                  width={this.state.width}
                  height={this.state.height}
                  margin={this.state.margin}
                  hideHead={this.state.hide.head}
                  hideQualifier={this.state.hide.qualifier}
                  hideFooter={this.state.hide.footer}
                  dynamicHeight={true}
                  editable={false}
                  tips={false}
                  exportable={true}
                  share_data={false}
                  social={false}
                />
              </div>
            </div>
            <div className='web-export-options'>
              <h3>Export</h3>
              <p>Web charts can be exported in a variety of modes and sizes.</p>
              <div className='web-export-option-group'>
                <h4>Options</h4>
                <p>Select whether you'd like to hide the heading, qualifier, or source line below.</p>
                <ul>
                {['head', 'qualifier', 'footer'].map(d => {
                  const labels = { head: 'heading', qualifier: 'qualifier', footer: 'source' };
                  return (
                    <li key={d}>
                      <input
                        className='input-checkbox'
                        type='checkbox'
                        id={`hide-${d}`}
                        name={d}
                        onChange={this.handleHide}
                        checked={this.state.hide[d]}
                      />
                      <label htmlFor={`hide-${d}`}>Hide {labels[d]}</label>
                    </li>
                  );
                })}
                </ul>
              </div>
              <div className='web-export-option-group'>
                <h4>Export mode</h4>
                <div className='web-export-mode'>
                  {['Social', 'Picker', 'Custom'].map(m => {
                    const val = m.toLowerCase();
                    return (
                      <button
                        key={m}
                        className={`web-export-mode-button ${this.state.mode === val ? 'active' : ''}`}
                        value={val}
                        onClick={this.handleWebMode}>
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
              { this.state.mode === 'social' ? this.renderSocial() : null }
              { this.state.mode === 'picker' ? this.renderWeb() : null }
              { this.state.mode === 'custom' ? this.renderCustom() : null }
            </div>
          </div>
        </div>
      </div>
    );
  }

}
