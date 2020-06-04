import React, { Component } from 'react';
import { embed } from '../../modules/utils';
import { app_settings, app_build, app_version, prefix } from '../../modules/settings';

export default class ChartEmbed extends Component {

  constructor(props) {
    super(props);
  }

  selectEmbed(event) {
    event.target.select();
  }

  getEmbed() {
    let embedCode, error;
    try {
      embedCode = embed(this.props.chart);
    } catch (e) {
      error = e;
    }
    return !error ? embedCode : '';
  }

  embedCode() {
    return `<!-- CHART TOOL v${app_version}-${app_build} -->
<!-- edited: ${this.props.chart.lastEdited} -->
<!-- slug: ${this.props.chart.slug} -->
<div class="${prefix}chart" data-chartid="${prefix}${this.props.chart._id}">
  <script type="text/javascript">
    (function(root) {
      var data = ${JSON.stringify(this.getEmbed(), null, 2)};
      root.ChartTool = root.ChartTool || [];
      root.ChartTool.push({id: "${prefix}" + data.id, data: data});
      var b = document.getElementsByTagName("body")[0];
      if (!b.classList.contains("${prefix}charttool-init")) {
        b.classList.add("${prefix}charttool-init");
        var c = document.createElement("link");
        var j = document.createElement("script");
        c.href = "${app_settings.embedCSS}?token=${app_build}"; c.rel = "stylesheet";
        j.src = "${app_settings.embedJS}?token=${app_build}"; j.async = true; j.defer = true;
        document.getElementsByTagName("head")[0].appendChild(c);
        document.getElementsByTagName("head")[0].appendChild(j);
      }
    })(this);
  </script>
</div>`;
  }

  render() {
    return (
      <textarea
        className='export-embed'
        readOnly={true}
        value={this.embedCode()}
        onClick={this.selectEmbed}>
      </textarea>
    );
  }

}
