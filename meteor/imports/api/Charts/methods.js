import { Meteor } from 'meteor/meteor';
import MD5 from 'crypto-js/md5';
import Charts from './Charts';
import queryConstructor from '../modules/queries';
import { extend } from '../modules/utils';

Meteor.methods({
  // addChart only takes the text and data from the /new route
  // everything else is taken from settings.js in /lib
  addChart: (text, data) => {
    const newChart = extend(app_settings.chart),
      now = new Date();

    newChart.createdAt = now;
    newChart.lastEdited = now;
    newChart.slug = text;
    newChart.data = data;
    newChart.md5 = MD5(data).toString();

    return Charts.insert(newChart);
  },

  deleteChart: chartId => {
    return Charts.remove(chartId);
  },

  forkChart: chartId => {
    const newChart = Charts.findOne(chartId),
      now = new Date();

    newChart.createdAt = now;
    newChart.lastEdited = now;

    delete newChart._id;

    return Charts.insert(newChart);
  },

  // Update methods

  updateSlug: (chartId, text) => {
    return Charts.update(chartId, {
      $set: {
        slug: text,
        lastEdited: new Date()
      }
    });
  },
  updateData: (chartId, data) => {
    return Charts.update(chartId, {
      $set: {
        data: data,
        md5: MD5(data).toString(),
        lastEdited: new Date()
      }
    });
  },
  updateDateFormat: (chartId, format) => {
    return Charts.update(chartId, {
      $set: {
        date_format: format,
        lastEdited: new Date()
      }
    });
  },
  updateHasHours: (chartId, hasHours) => {
    return Charts.update(chartId, {
      $set: {
        hasHours: hasHours,
        lastEdited: new Date()
      }
    });
  },
  updateHed: (chartId, hed) => {
    return Charts.update(chartId, {
      $set: {
        heading: hed,
        lastEdited: new Date()
      }
    });
  },
  updateQual: (chartId, qual) => {
    return Charts.update(chartId, {
      $set: {
        qualifier: qual,
        lastEdited: new Date()
      }
    });
  },
  updateSource: (chartId, src) => {
    return Charts.update(chartId, {
      $set: {
        source: src,
        lastEdited: new Date()
      }
    });
  },
  updateClass: (chartId, customClass) => {
    return Charts.update(chartId, {
      $set: {
        class: customClass,
        lastEdited: new Date()
      }
    });
  },
  updateImg: (chartId, src) => {
    return Charts.update(chartId, {
      $set: {
        img: src,
        lastEdited: new Date()
      }
    });
  },
  updateTags: (chartId, tagName) => {

    const taggedArr = Charts.findOne(chartId).tags,
      index = taggedArr.indexOf(tagName);

    if (index > -1) {
      // tag is already in chart, remove it
      taggedArr.splice(index, 1);
    } else {
      // add tag to chart
      taggedArr.push(tagName);
    }

    return Charts.update(chartId, {
      $set: {
        tags: taggedArr,
        lastEdited: new Date()
      }
    });
  },

  // 'Options' methods

  updateType: (chartId, type) => {
    return Charts.update(chartId, {
      $set: {
        'options.type': type,
        lastEdited: new Date()
      }
    });
  },
  updateInterpolation: (chartId, interpolation) => {
    return Charts.update(chartId, {
      $set: {
        'options.interpolation': interpolation,
        lastEdited: new Date()
      }
    });
  },
  updateStacked: (chartId, stacked) => {
    return Charts.update(chartId, {
      $set: {
        'options.stacked': stacked,
        lastEdited: new Date()
      }
    });
  },
  updateExpanded: (chartId, expanded) => {
    return Charts.update(chartId, {
      $set: {
        'options.expanded': expanded,
        lastEdited: new Date()
      }
    });
  },
  updateHead: (chartId, head) => {
    return Charts.update(chartId, {
      $set: {
        'options.head': head,
        lastEdited: new Date()
      }
    });
  },
  updateDeck: (chartId, deck) => {
    return Charts.update(chartId, {
      $set: {
        'options.deck': deck,
        lastEdited: new Date()
      }
    });
  },
  updateLegend: (chartId, legend) => {
    return Charts.update(chartId, {
      $set: {
        'options.legend': legend,
        lastEdited: new Date()
      }
    });
  },
  updateFooter: (chartId, footer) => {
    return Charts.update(chartId, {
      $set: {
        'options.footer': footer,
        lastEdited: new Date()
      }
    });
  },
  updateXAxis: (chartId, x_axis) => {
    return Charts.update(chartId, {
      $set: {
        'options.x_axis': x_axis,
        lastEdited: new Date()
      }
    });
  },
  updateYAxis: (chartId, y_axis) => {
    return Charts.update(chartId, {
      $set: {
        'options.y_axis': y_axis,
        lastEdited: new Date()
      }
    });
  },
  updateTips: (chartId, tips) => {
    return Charts.update(chartId, {
      $set: {
        'options.tips': tips,
        lastEdited: new Date()
      }
    });
  },
  updateAnnotations: (chartId, annotations) => {
    return Charts.update(chartId, {
      $set: {
        'options.annotations': annotations,
        lastEdited: new Date()
      }
    });
  },
  updateQualifierOption: (chartId, qualifier) => {
    return Charts.update(chartId, {
      $set: {
        'options.qualifier': qualifier,
        lastEdited: new Date()
      }
    });
  },
  updateShareData: (chartId, shareData) => {
    return Charts.update(chartId, {
      $set: {
        'options.share_data': shareData,
        lastEdited: new Date()
      }
    });
  },
  updateSocial: (chartId, social) => {
    return Charts.update(chartId, {
      $set: {
        'options.social': social,
        lastEdited: new Date()
      }
    });
  },
  updateIndex: (chartId, index) => {
    return Charts.update(chartId, {
      $set: {
        'options.indexed': index,
        lastEdited: new Date()
      }
    });
  },

  // X Axis methods

  updateXScale: (chartId, scale) => {
    return Charts.update(chartId, {
      $set: {
        'x_axis.scale': scale,
        lastEdited: new Date()
      }
    });
  },
  updateXTicks: (chartId, ticks) => {
    return Charts.update(chartId, {
      $set: {
        'x_axis.ticks': ticks,
        lastEdited: new Date()
      }
    });
  },
  updateXOrient: (chartId, orient) => {
    return Charts.update(chartId, {
      $set: {
        'x_axis.orient': orient,
        lastEdited: new Date()
      }
    });
  },
  updateXFormat: (chartId, format) => {
    return Charts.update(chartId, {
      $set: {
        'x_axis.format': format,
        lastEdited: new Date()
      }
    });
  },
  updateXPrefix: (chartId, pfx) => {
    return Charts.update(chartId, {
      $set: {
        'x_axis.prefix': pfx,
        lastEdited: new Date()
      }
    });
  },
  updateXSuffix: (chartId, sfx) => {
    return Charts.update(chartId, {
      $set: {
        'x_axis.suffix': sfx,
        lastEdited: new Date()
      }
    });
  },
  updateXMin: (chartId, minY) => {
    return Charts.update(chartId, {
      $set: {
        'x_axis.min': minY,
        lastEdited: new Date()
      }
    });
  },
  updateXMax: (chartId, maxY) => {
    return Charts.update(chartId, {
      $set: {
        'x_axis.max': maxY,
        lastEdited: new Date()
      }
    });
  },
  updateXNice: (chartId, nice) => {
    return Charts.update(chartId, {
      $set: {
        'x_axis.nice': nice,
        lastEdited: new Date()
      }
    });
  },

  // Y Axis methods

  updateYScale: (chartId, scale) => {
    return Charts.update(chartId, {
      $set: {
        'y_axis.scale': scale,
        lastEdited: new Date()
      }
    });
  },
  updateYTicks: (chartId, ticks) => {
    return Charts.update(chartId, {
      $set: {
        'y_axis.ticks': ticks,
        lastEdited: new Date()
      }
    });
  },
  updateYOrient: (chartId, orient) => {
    return Charts.update(chartId, {
      $set: {
        'y_axis.orient': orient,
        lastEdited: new Date()
      }
    });
  },
  updateYFormat: (chartId, format) => {
    return Charts.update(chartId, {
      $set: {
        'y_axis.format': format,
        lastEdited: new Date()
      }
    });
  },
  updateYPrefix: (chartId, pfx) => {
    return Charts.update(chartId, {
      $set: {
        'y_axis.prefix': pfx,
        lastEdited: new Date()
      }
    });
  },
  updateYSuffix: (chartId, sfx) => {
    return Charts.update(chartId, {
      $set: {
        'y_axis.suffix': sfx,
        lastEdited: new Date()
      }
    });
  },
  updateYMin: (chartId, minY) => {
    return Charts.update(chartId, {
      $set: {
        'y_axis.min': minY,
        lastEdited: new Date()
      }
    });
  },
  updateYMax: (chartId, maxY) => {
    return Charts.update(chartId, {
      $set: {
        'y_axis.max': maxY,
        lastEdited: new Date()
      }
    });
  },
  updateYNice: (chartId, nice) => {
    return Charts.update(chartId, {
      $set: {
        'y_axis.nice': nice,
        lastEdited: new Date()
      }
    });
  },

  // Other methods

  resetXAxis: chartId => {
    return Charts.update(chartId, {
      $set: {
        x_axis: app_settings.chart.x_axis,
        lastEdited: new Date()
      }
    });
  },
  resetYAxis: chartId => {
    return Charts.update(chartId, {
      $set: {
        y_axis: app_settings.chart.y_axis,
        lastEdited: new Date()
      }
    });
  },

  // Print methods

  updatePrintMode: (chartId, mode) => {
    const obj = {
      'print.mode': mode,
      lastEdited: new Date()
    };
    if (mode === 'millimetres') {
      const chart = Charts.findOne(chartId);
      if (!chart.print.height) {
        obj['print.height'] = Number(app_settings.print.column_width);
      }
      if (!chart.print.width) {
        obj['print.width'] = Number(app_settings.print.column_width);
      }
    }
    return Charts.update(chartId, {
      $set: obj
    });
  },
  updatePrintCols: (chartId, cols) => {
    return Charts.update(chartId, {
      $set: {
        'print.columns': cols,
        lastEdited: new Date()
      }
    });
  },
  updatePrintLines: (chartId, lines) => {
    return Charts.update(chartId, {
      $set: {
        'print.lines': lines,
        lastEdited: new Date()
      }
    });
  },
  updatePrintMMWidth: (chartId, width) => {
    return Charts.update(chartId, {
      $set: {
        'print.width': Number(width),
        lastEdited: new Date()
      }
    });
  },
  updatePrintMMHeight: (chartId, height) => {
    return Charts.update(chartId, {
      $set: {
        'print.height': Number(height),
        lastEdited: new Date()
      }
    });
  },

  // Stats methods

  matchedCharts: params => {
    const parameters = queryConstructor(params);
    delete parameters.options.limit;
    return Charts.find(parameters.find, parameters.options).count();
  }
});
