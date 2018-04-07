import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import fileSaver from 'file-saver';

const exportSettings = {
  facebook: {
    width: 421,
    height: 220,
    scale: 2.85
  },
  instagram: {
    width: 380,
    height: 380,
    scale: 2.85
  }
};

// drop source line?
// need interstitial screen when image is downloading

export default class ChartOverlayWeb extends Component {

  constructor(props) {
    super(props);
    this.handleExport = this.handleExport.bind(this);
    this.handleCustomSize = this.handleCustomSize.bind(this);
    this.state = {
      width: '',
      height: '',
      margin: 3
    };
  }

  handleExport(event) {
    event.preventDefault();

    let filename = `${this.props.chart.slug}-web`;

    let width, height, scale;

    if (exportSettings[event.target.name]) {
      width = exportSettings[event.target.name].width;
      scale = exportSettings[event.target.name].scale;
      height = exportSettings[event.target.name].height;
      filename += `-${event.target.name}`;
    }

    if (event.target.name === 'picker') {
      for (let i = 0; i < event.target.length; i++) {
        const n = Number(event.target[i].value);
        if (event.target[i].name === 'width') width = n;
        if (event.target[i].name === 'ratio') height = width * n;
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
      margin: this.state.margin
    }, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        const blob = new Blob([response], { type: 'image/png' });
        fileSaver.saveAs(blob, `${filename}.png`);
      }
    });

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

  render() {
    return (
      <div>
        <div className='overlay-outer' />
        <div className='overlay-container'>
          <div className='overlay-header'>
            <h3>Web export</h3>
            <button value={'web'} onClick={this.props.toggleOverlay} className='overlay-close'>&times;</button>
          </div>
          <div className='overlay-web'>
            <div className='web-export web-export-web'>
              <h3>Web</h3>
              <p>Web images are available at several widths and aspect ratios, and download at 2&times; scale for retina screen support.</p>
              <form onSubmit={this.handleExport} name='picker' className='web-export-picker'>
                <div className='web-export-row'>
                  <div className='web-export-field web-export-field-width'>
                    <h5>Width</h5>
                    <div className='select-wrapper'>
                      <select type='choice' name='width' className='select-web-export-width' defaultValue={460}>
                        <option value={320}>320px</option>
                        <option value={460}>460px</option>
                        <option value={620}>620px</option>
                      </select>
                    </div>
                  </div>
                  <div className='web-export-field web-export-field-ratio'>
                    <h5>Ratio</h5>
                    <div className='select-wrapper'>
                      <select type='choice' name='ratio' className='select-web-export-ratio' defaultValue={0.67}>
                        <option value={0.67}>3&times;2</option>
                        <option value={0.5625}>16&times;9</option>
                        <option value={1}>1&times;1</option>
                        <option value={1.5}>2&times;3</option>
                        <option value={2}>2&times;1</option>
                      </select>
                    </div>
                  </div>
                </div>
                <input className='web-export-submit' value='Download' type='submit' />
              </form>
            </div>
            <div className='web-export web-export-custom'>
              <h3>Custom sizes</h3>
              <p>Need a custom-sized image of your chart? Just pick a width, height, and scaling factor.</p>
              <form onSubmit={this.handleExport} name='custom' className='web-export-custom-picker'>
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
            <div className='web-export web-export-social'>
              <h3>Social</h3>
              <p>Social images are sized to match the aspect ratios of their respective platforms&rsquo; &ldquo;cards&rdquo;.</p>
              <div className='web-export-social-buttons'>
                <button
                  className='web-export-button'
                  name='instagram'
                  onClick={this.handleExport}>Instagram</button>
                <button
                  className='web-export-button'
                  name='facebook'
                  onClick={this.handleExport}>Facebook</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
