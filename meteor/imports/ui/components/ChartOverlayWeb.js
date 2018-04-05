import React, { Component } from 'react';
import { app_settings } from '../../modules/settings';

const exportSettings = {
  facebook: {
    width: '421',
    scale: '2.85',
    ratio: '52.3%'
  },
  instagram: {
    width: '380',
    scale: '2.85',
    ratio: '100%'
  }
};

// need to include white space around images
// drop source line?

export default class ChartStyling extends Component {

  constructor(props) {
    super(props);
    this.handleExport = this.handleExport.bind(this);
    this.handleCustomSize = this.handleCustomSize.bind(this);
    this.state = {
      width: '',
      height: ''
    };
  }

  handleExport(event) {
    event.preventDefault();

    debugger;

    const width = parseInt(event.target.width.value),
      ratio = parseFloat(event.target.ratio.value),
      scale = function (width) {
        switch(width) {
          case 460:
            return 5;
          case 620:
            return 4;
          case 940:
            return 3;
        }
      },
      options = {
        scale: scale(width),
        descriptor: 'web'
      };


    // descriptor needs to include event.target.name for buttons

    this.editable = false;
    this.exportable = {};
    this.exportable.type = 'web';
    this.exportable.dynamicHeight = true;
    this.exportable.width = width;
    this.exportable.height = width * (ratio / 100);

    // downloadImg(this, options);

    // return false;
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

  // 'click .web-export-button': function(event) {
  //
  //   var width = parseInt(event.target.dataset.width),
  //       ratio = parseFloat(event.target.dataset.ratio),
  //       options = {
  //         scale: event.target.dataset.scale,
  //         descriptor: event.target.dataset.descriptor
  //       };
  //
  //   if (!ratio) { ratio = 67; }
  //
  //   this.editable = false;
  //   this.exportable = {};
  //   this.exportable.type = "web";
  //   this.exportable.dynamicHeight = true;
  //   this.exportable.width = width;
  //   this.exportable.height = width * (ratio / 100);
  //
  //   downloadImg(this, options);
  // },
  // 'submit .web-export-custom-picker': function(event) {
  //   event.preventDefault();
  //
  //   var width = parseInt(event.target.width.value),
  //       height = parseFloat(event.target.height.value),
  //       options = {
  //         scale: parseFloat(event.target.scale.value),
  //         descriptor: "web"
  //       };
  //
  //   if (isNaN(width) || isNaN(height)) {
  //
  //     var title, text;
  //
  //     if (isNaN(width) && isNaN(height)) {
  //       title = "Missing width and height sizes";
  //       text = "Looks like you're missing width and height attributes for your custom size. Make sure to set those before downloading your image."
  //     } else {
  //       var missing = isNaN(width) ? "width" : "height";
  //       title = "Missing " + missing + " size"
  //       text = "Looks like you're missing a " + missing + " attribute for your custom size. Make sure to set it before downloading your image."
  //     }
  //
  //     sweetAlert({
  //       title: title,
  //       text: text,
  //       type: "info",
  //       confirmButtonColor: "#fff"
  //     });
  //
  //   } else {
  //
  //     this.editable = false;
  //     this.exportable = {};
  //     this.exportable.type = "web";
  //     this.exportable.dynamicHeight = true;
  //     this.exportable.width = width;
  //     this.exportable.height = height;
  //
  //     downloadImg(this, options);
  //
  //     return false;
  //
  //   }
  //
  // },

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

              <form onSubmit={this.handleExport} custom='picker' className='web-export-picker'>

                <div className='web-export-row'>

                  <div className='web-export-field web-export-field-width'>
                    <h5>Width</h5>
                    <div className='select-wrapper'>
                      <select type='choice' name='width' className='select-web-export-width' defaultValue={'460'}>
                        <option value='320'>320px</option>
                        <option value='460'>460px</option>
                        <option value='620'>620px</option>
                      </select>
                    </div>
                  </div>

                  <div className='web-export-field web-export-field-ratio'>
                    <h5>Ratio</h5>
                    <div className='select-wrapper'>
                      <select type='choice' name='ratio' className='select-web-export-ratio' defaultValue={'67%'}>
                        <option value='67%'>3&times;2</option>
                        <option value='56.25%'>16&times;9</option>
                        <option value='100%'>1&times;1</option>
                        <option value='150%'>2&times;3</option>
                        <option value='200%'>2&times;1</option>
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

              <form onSubmit={this.handleExport} type='custom' className='web-export-custom-picker'>

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
                  onClick={this.handleExport}
                  >
                  Instagram
                </button>

                <button
                  className='web-export-button'
                  name='facebook'
                  onClick={this.handleExport}
                  >
                  Facebook
                </button>

              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

}
