import { Meteor } from 'meteor/meteor';
import MD5 from 'crypto-js/md5';
import Charts from './Charts';
import { extend, queryConstructor } from '../../modules/utils';
import { app_settings } from '../../modules/settings';

Meteor.methods({
  // addChart only takes the text and data from the /new route
  // everything else is taken from settings.js in /lib
  'charts.add'(text, data) {
    const newChart = extend(app_settings.chart),
      now = new Date();

    newChart.createdAt = now;
    newChart.lastEdited = now;
    newChart.slug = text;
    newChart.data = data;
    newChart.md5 = MD5(data).toString();

    return Charts.insert(newChart);
  },

  'charts.delete'(chartId) {
    return Charts.remove(chartId);
  },

  'charts.fork'(chartId) {
    const newChart = Charts.findOne(chartId),
      now = new Date();

    newChart.createdAt = now;
    newChart.lastEdited = now;

    delete newChart._id;

    return Charts.insert(newChart);
  },

  'charts.update.multiple.fields'(chartId, fields) {
    const obj = fields;
    obj.lastEdited = new Date();
    return Charts.update(chartId, { $set: obj });
  },

  // Update methods

  'charts.update.slug'(chartId, text) {
    return Charts.update(chartId, {
      $set: {
        slug: text,
        lastEdited: new Date()
      }
    });
  },

  'charts.update.data'(chartId, data) {
    return Charts.update(chartId, {
      $set: {
        data: data,
        md5: MD5(data).toString(),
        lastEdited: new Date()
      }
    });
  },
  'charts.update.dateformat'(chartId, format) {
    return Charts.update(chartId, {
      $set: {
        date_format: format,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.hashours'(chartId, hasHours) {
    return Charts.update(chartId, {
      $set: {
        hasHours: hasHours,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.heading'(chartId, hed) {
    return Charts.update(chartId, {
      $set: {
        heading: hed,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.qualifier'(chartId, qual) {
    return Charts.update(chartId, {
      $set: {
        qualifier: qual,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.source'(chartId, src) {
    return Charts.update(chartId, {
      $set: {
        source: src,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.class'(chartId, customClass) {
    return Charts.update(chartId, {
      $set: {
        class: customClass,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.img'(chartId, src) {
    return Charts.update(chartId, {
      $set: {
        img: src,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.tags'(chartId, tagArr) {
    return Charts.update(chartId, {
      $set: {
        tags: tagArr,
        lastEdited: new Date()
      }
    });
  },

  // 'Options' methods

  'charts.update.options.type'(chartId, type) {
    return Charts.update(chartId, {
      $set: {
        'options.type': type,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.interpolation'(chartId, interpolation) {
    return Charts.update(chartId, {
      $set: {
        'options.interpolation': interpolation,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.stacked'(chartId, stacked) {
    return Charts.update(chartId, {
      $set: {
        'options.stacked': stacked,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.expanded'(chartId, expanded) {
    return Charts.update(chartId, {
      $set: {
        'options.expanded': expanded,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.head'(chartId, head) {
    return Charts.update(chartId, {
      $set: {
        'options.head': head,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.deck'(chartId, deck) {
    return Charts.update(chartId, {
      $set: {
        'options.deck': deck,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.legend'(chartId, legend) {
    return Charts.update(chartId, {
      $set: {
        'options.legend': legend,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.footer'(chartId, footer) {
    return Charts.update(chartId, {
      $set: {
        'options.footer': footer,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.x_axis'(chartId, x_axis) {
    return Charts.update(chartId, {
      $set: {
        'options.x_axis': x_axis,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.y_axis'(chartId, y_axis) {
    return Charts.update(chartId, {
      $set: {
        'options.y_axis': y_axis,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.tips'(chartId, tips) {
    return Charts.update(chartId, {
      $set: {
        'options.tips': tips,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.annotations'(chartId, annotations) {
    return Charts.update(chartId, {
      $set: {
        'options.annotations': annotations,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.qualifier'(chartId, qualifier) {
    return Charts.update(chartId, {
      $set: {
        'options.qualifier': qualifier,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.share_data'(chartId, shareData) {
    return Charts.update(chartId, {
      $set: {
        'options.share_data': shareData,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.social'(chartId, social) {
    return Charts.update(chartId, {
      $set: {
        'options.social': social,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.options.indexed'(chartId, index) {
    return Charts.update(chartId, {
      $set: {
        'options.indexed': index,
        lastEdited: new Date()
      }
    });
  },

  // X Axis methods

  'charts.update.x_axis.scale'(chartId, scale) {
    return Charts.update(chartId, {
      $set: {
        'x_axis.scale': scale,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.x_axis.ticks'(chartId, ticks) {
    return Charts.update(chartId, {
      $set: {
        'x_axis.ticks': ticks,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.x_axis.orient'(chartId, orient) {
    return Charts.update(chartId, {
      $set: {
        'x_axis.orient': orient,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.x_axis.format'(chartId, format) {
    return Charts.update(chartId, {
      $set: {
        'x_axis.format': format,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.x_axis.prefix'(chartId, pfx) {
    return Charts.update(chartId, {
      $set: {
        'x_axis.prefix': pfx,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.x_axis.suffix'(chartId, sfx) {
    return Charts.update(chartId, {
      $set: {
        'x_axis.suffix': sfx,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.x_axis.min'(chartId, minY) {
    return Charts.update(chartId, {
      $set: {
        'x_axis.min': minY,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.x_axis.max'(chartId, maxY) {
    return Charts.update(chartId, {
      $set: {
        'x_axis.max': maxY,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.x_axis.nice'(chartId, nice) {
    return Charts.update(chartId, {
      $set: {
        'x_axis.nice': nice,
        lastEdited: new Date()
      }
    });
  },

  // Y Axis methods

  'charts.update.y_axis.scale'(chartId, scale) {
    return Charts.update(chartId, {
      $set: {
        'y_axis.scale': scale,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.y_axis.ticks'(chartId, ticks) {
    return Charts.update(chartId, {
      $set: {
        'y_axis.ticks': ticks,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.y_axis.orient'(chartId, orient) {
    return Charts.update(chartId, {
      $set: {
        'y_axis.orient': orient,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.y_axis.format'(chartId, format) {
    return Charts.update(chartId, {
      $set: {
        'y_axis.format': format,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.y_axis.prefix'(chartId, pfx) {
    return Charts.update(chartId, {
      $set: {
        'y_axis.prefix': pfx,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.y_axis.suffix'(chartId, sfx) {
    return Charts.update(chartId, {
      $set: {
        'y_axis.suffix': sfx,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.y_axis.min'(chartId, minY) {
    return Charts.update(chartId, {
      $set: {
        'y_axis.min': minY,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.y_axis.max'(chartId, maxY) {
    return Charts.update(chartId, {
      $set: {
        'y_axis.max': maxY,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.y_axis.nice'(chartId, nice) {
    return Charts.update(chartId, {
      $set: {
        'y_axis.nice': nice,
        lastEdited: new Date()
      }
    });
  },

  // Other methods

  'charts.reset.x_axis'(chartId) {
    return Charts.update(chartId, {
      $set: {
        x_axis: app_settings.chart.x_axis,
        lastEdited: new Date()
      }
    });
  },
  'charts.reset.y_axis'(chartId) {
    return Charts.update(chartId, {
      $set: {
        y_axis: app_settings.chart.y_axis,
        lastEdited: new Date()
      }
    });
  },

  // Print methods

  'charts.update.print.mode'(chartId, mode) {
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
  'charts.update.print.columns'(chartId, cols) {
    return Charts.update(chartId, {
      $set: {
        'print.columns': cols,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.print.lines'(chartId, lines) {
    return Charts.update(chartId, {
      $set: {
        'print.lines': lines,
        lastEdited: new Date()
      }
    });
  },
  'charts.update.print.width'(chartId, width) {
    return Charts.update(chartId, {
      $set: {
        'print.width': Number(width),
        lastEdited: new Date()
      }
    });
  },
  'charts.update.print.height'(chartId, height) {
    return Charts.update(chartId, {
      $set: {
        'print.height': Number(height),
        lastEdited: new Date()
      }
    });
  },

  // Stats methods

  'charts.matched.count'(params) {
    const parameters = queryConstructor(params);
    delete parameters.options.limit;
    return Charts.find(parameters.find, parameters.options).count();
  }
});
