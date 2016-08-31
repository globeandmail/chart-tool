Template.chartEditAside.helpers({
  isTimeSeries: function() {
    if (this.options) {
      var scale = this.x_axis.scale;
      if (scale === "time" || scale === "ordinal-time") {
        return true;
      }
    }
  },
  isLineChartType: function() {
    if (this.options) {
      var type = this.options["type"];
      if (type === "area" || type === "line" || type === "stream") {
        return true;
      }
    }
  },
  isBarChartType: function() {
    if (this.options) {
      var type = this.options["type"];
      if (type === "column" || type === "bar") {
        return true;
      }
    }
  },
  isBarChart: function(value) {
    if (this.options) {
      var type = this.options["type"];
      if (value === true) {
        if (type === "bar") { return true; };
      } else {
        if (type !== "bar") { return true; };
      }
    }
  },
  isStackableExpandable: function() {
    if (this.options) {
      var type = this.options["type"];
      if (type === "area" || type === "bar" || type === "column") {
        return true;
      }
    }
  },
  displayMin: function() {
    if (this.options) {
      var type = this.options["type"];
      if (type === "area" || type === "bar" || type === "column") {
        var ChartToolParser = ChartTool.utils.dataParse.parse,
            cleanCSV = dataParse(this.data);
        var dataObj = ChartToolParser(cleanCSV, app_settings.chart.date_format, this.index);

        var mArr = [];

        d3.map(dataObj.data, function(d) {
          for (var j = 0; j < d.series.length; j++) {
            mArr.push(Number(d.series[j].val));
          }
        });

        return d3.min(mArr) > 0 ? false : true;
      } else {
        return true;
      }
    }
  },
  classChecked: function(val) {
    if (this["class"] && this["class"] === val) { return "checked"; }
  },
  isStacked: function(val) {
    if (this.options) {
      var type = this.options["type"];
      if (type === "area" || type === "bar" || type === "column") {
        if (this.options.stacked === true) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  isExpanded: function(val) {
    if (this.options) {
      var type = this.options["type"];
      if (type === "area" || type === "bar" || type === "column") {
        if (this.options.expanded === true) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  xScaleChecked: function(val) {
    if (this.x_axis && this.x_axis.scale === val) { return "checked"; }
  },
  xNice: function() {
    if (this.x_axis) {
      return (this.x_axis.nice ? true : false);
    }
  },
  xRescale: function() {
    if (this.x_axis) {
      return (this.x_axis.rescale ? true : false);
    }
  },
  yNice: function() {
    if (this.y_axis) {
      return (this.y_axis.nice ? true : false);
    }
  },
  yRescale: function() {
    if (this.y_axis) {
      return (this.y_axis.rescale ? true : false);
    }
  },
  dateCalc: function() {
    var today = new Date();
    var format = d3.time.format(this.date_format);
    return format(today);
  },
  dateSelected: function(val) {
    if (this.date_format && this.date_format === val) { return "selected"; }
  },
  xAxisFormatSelected: function(val) {
    var axis = this.x_axis;
    if (axis) {
      if (Object.keys(axis.format)[0] === val) { return "selected"; }
    }
  },
  xAxFormatCustom: function() {
    if (this.x_axis) {
      if (this.x_axis.format.custom) { return true; }
    }
  },
  xAxCustom: function() {
    var axis = this.x_axis;
    if (axis) {
      var format = axis.format.custom;
      if (format === "custom" ) {
        return "";
      } else {
        return format;
      }
    }
  },
  interpSelected: function(val) {
    if (this.options && this.options.interpolation === val) { return "selected"; }
  },
  yAxisFormatSelected: function(val) {
    var axis = this.y_axis;
    if (axis) {
      if (axis.format.number === val) { return "selected"; }
    }
  },
  primaryOrAlternate: function(val) {
    return app_settings[val] || val.toUpperCase();
  }
});

Template.chartEditAside.events({
  "click .edit-box h3": function(event) {
    var el = d3.select(event.target).node().nextElementSibling;
    if (el.dataset.state === "hidden") {
      d3.select(el)
        .style("display", "block")
        .transition()
        .duration(250)
        .style("height", "auto")
        .style("opacity", "1");
      el.dataset.state = "visible";
    } else {
      d3.select(el)
        .transition()
        .duration(250)
        .style("opacity", "0")
        .style("height", "0px")
        .each("end", function() {
          d3.select(this).style("display", "none");
        });
      el.dataset.state = "hidden";
    }
  },
  "click .help-x-axis-custom": function(event) {
    sweetAlert({
      title: "D3.js time formats only!",
      text: "Your time format must follow D3.js standards. For reference, visit Confluence.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },
  "change .select-date-construction": function(event) {
    var format = event.target.value;
      dateFormat = this.date_format,
      hasHours = this.hasHours,
      str = " " + app_settings.chart.time_format,
      re = /\s\%H\:\%M/g;

    if (re.test(dateFormat)) { format += str; }
    updateAndSave("updateDateFormat", this, format );
  },
  "change .input-checkbox-hours": function(event) {
    var dateFormat = this.date_format,
      val = !this.hasHours,
      str = " " + app_settings.chart.time_format,
      re = /\s\%H\:\%M/g;

    updateAndSave("updateHasHours", this, val);
    if (!re.test(dateFormat)) {
      updateAndSave("updateDateFormat", this,(dateFormat += str));
    } else {
      updateAndSave("updateDateFormat", this, (dateFormat.replace(str, "")));
    }
  },
  "click .help-date-construction": function(event) {
    sweetAlert({
      title: "Date format?",
      text: "Chart Tool sometimes needs you to tell it how your dates are formatted so it can figure out how to parse them. Make sure your selected date format matches that of your data!",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },
  "click .help-time-hours-edit": function(event) {
    sweetAlert({
      title: "Hours?",
      text: "Turn on this feature if your data contains timestamps as well as dates. Make sure your selected date format matches that of your data!",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },
  "click .help-date-calc": function(event) {
    sweetAlert({
      title: "Your dates should match?",
      text: "This shows an example of how your dates should be formatted so Chart Tool can parse them.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },

  "change .input-index": function(event) {
    var input = event.target.value;
    if (isNaN(Number(input)) || input === "") { input = false; }
    updateAndSave("updateIndex", this, input);
  },
  "click .help-index-edit": function(event) {
    sweetAlert({
      title: "Index?",
      text: "Scale the first value in each series to this value and show all other values relative to this index.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },

  "blur .input-prefix-x": function(event) {
    var input = event.target.value;
    updateAndSave("updateXPrefix", this, input);
  },
  "change .select-formatval-x": function(event) {
    var format = event.target.value;
    updateAndSave("updateXFormat", this, format);
  },
  "blur .input-suffix-x": function(event) {
    var input = event.target.value;
    updateAndSave("updateXSuffix", this, input);
  },
  "change .input-ticks-x": function(event) {
    var input = event.target.value;
    if (!input) { input = "auto"; }
    updateAndSave("updateXTicks", this, input);
  },
  "change .input-min-x": function(event) {
    var input = event.target.value,
        inputInt = parseInt(parseInt(event.target.value)),
        max_x = parseInt(this.max_x);

    if (isNumber(input)) {
      // if input is a number
      if (max_x) {
        // and if max_y exists
        if (inputInt < max_x) {
          // if input is less than max_y, update DB
          updateAndSave("updateXMin", this, input);
        } else {
          // if input is greater than max_y, alert and reset
          sweetAlert({
            title: "Check your inputs",
            text: "Min value should be less than max value.",
            type: "error",
            confirmButtonColor: "#fff"
          });
          event.target.value = this.min_x;
        }
      } else {
        // if max_y doesnt exist, update DB
        updateAndSave("updateXMin", this, input);
      }
    } else if (input === "") {
      // if input's being deleted, update DB
      updateAndSave("updateXMin", this, input);
    } else if ( !(input === "") && !isNumber(input) ) {
      // if input isnt a number or empty, reset
      event.target.value = this.min_x;
      sweetAlert({
        title: "Check your inputs",
        text: "Value should be a number.",
        type: "error",
        confirmButtonColor: "#fff"
      });
    }

  },

  "change .input-max-x": function(event) {
    var input = event.target.value,
        inputInt = parseInt(parseInt(event.target.value)),
        min_x = parseInt(this.min_x);

    if (isNumber(input)) {
      // if input is a number
      if (min_x) {
        // and if min_y exists
        if (inputInt > min_x) {
          // if input is greater than min_y, update DB
          updateAndSave("updateXMax", this, input);
        } else {
          // if input is less than min_y, alert and reset
          sweetAlert({
            title: "Check your inputs",
            text: "Max value should be greater than min value.",
            type: "error",
            confirmButtonColor: "#fff"
          });
          event.target.value = this.max_x;
        }
      } else {
        // if min_y doesnt exist, update DB
        updateAndSave("updateXMax", this, input);
      }
    } else if (input === "") {
      // if input's being deleted, update DB
      updateAndSave("updateXMax", this, input);
    } else if ( !(input === "") && !isNumber(input) ) {
      // if input isnt a number or empty, reset
      event.target.value = this.max_x;
      sweetAlert({
        title: "Check your inputs",
        text: "Value should be a number.",
        type: "error",
        confirmButtonColor: "#fff"
      });
    }

  },

  "change .input-radio-x-scale": function(event) {
    var xScale = event.target.value;
    updateAndSave("updateXScale", this, xScale);
  },

  "change .input-checkbox-x-nice": function(event) {
    var val = !this.x_axis.nice;
    updateAndSave("updateXNice", this, val);
  },
  "change .input-checkbox-x-rescale": function(event) {
    var val = !this.x_axis.rescale;
    updateAndSave("updateXRescale", this, val);
  },


  "blur .input-custom-x": function(event) {
    var format = event.target.value,
        obj = {};

    obj.custom = format;
    updateAndSave("updateXFormat", this, obj);
  },
  "blur .input-data-edit": function(event) {
    var data = dataParse(event.target.value);
    updateAndSave("updateData", this, data);
    event.target.value = data;
  },

  "change .input-radio-class": function(event) {
    var customClass = event.target.value;
    updateAndSave("updateClass", this, customClass);
  },

  "change .input-min-y": function(event) {
    var input = event.target.value,
        inputInt = parseInt(parseInt(event.target.value)),
        max_y = parseInt(this.max_y);

    if (isNumber(input)) {
      // if input is a number
      if (max_y) {
        // and if max_y exists
        if (inputInt < max_y) {
          // if input is less than max_y, update DB
          updateAndSave("updateYMin", this, input);
        } else {
          // if input is greater than max_y, alert and reset
          sweetAlert({
            title: "Check your inputs",
            text: "Min value should be less than max value.",
            type: "error",
            confirmButtonColor: "#fff"
          });
          event.target.value = this.min_y;
        }
      } else {
        // if max_y doesnt exist, update DB
        updateAndSave("updateYMin", this, input);
      }
    } else if (input === "") {
      // if input's being deleted, update DB
      updateAndSave("updateYMin", this, input);
    } else if ( !(input === "") && !isNumber(input) ) {
      // if input isnt a number or empty, reset
      event.target.value = this.min_y;
      sweetAlert({
        title: "Check your inputs",
        text: "Value should be a number.",
        type: "error",
        confirmButtonColor: "#fff"
      });
    }

  },

  "change .input-max-y": function(event) {
    var input = event.target.value,
        inputInt = parseInt(parseInt(event.target.value)),
        min_y = parseInt(this.min_y);

    if (isNumber(input)) {
      // if input is a number
      if (min_y) {
        // and if min_y exists
        if (inputInt > min_y) {
          // if input is greater than min_y, update DB
          updateAndSave("updateYMax", this, input);
        } else {
          // if input is less than min_y, alert and reset
          sweetAlert({
            title: "Check your inputs",
            text: "Max value should be greater than min value.",
            type: "error",
            confirmButtonColor: "#fff"
          });
          event.target.value = this.max_y;
        }
      } else {
        // if min_y doesnt exist, update DB
        updateAndSave("updateYMax", this, input);
      }
    } else if (input === "") {
      // if input's being deleted, update DB
      updateAndSave("updateYMax", this, input);
    } else if ( !(input === "") && !isNumber(input) ) {
      // if input isnt a number or empty, reset
      event.target.value = this.max_y;
      sweetAlert({
        title: "Check your inputs",
        text: "Value should be a number.",
        type: "error",
        confirmButtonColor: "#fff"
      });
    }

  },

  "blur .input-prefix-y": function(event) {
    var input = event.target.value;
    updateAndSave("updateYPrefix", this, input);
  },
  "change .select-formatval-y": function(event) {
    var format = event.target.value;
    updateAndSave("updateYFormat", this, format);
  },
  "blur .input-suffix-y": function(event) {
    var input = event.target.value;
    updateAndSave("updateYSuffix", this, input);
  },
  "change .input-ticks-y": function(event) {
    var input = event.target.value;
    if (!input) { input = "auto"; }
    updateAndSave("updateYTicks", this, input);
  },
  "click .help-y-ticks-edit": function(event) {
    sweetAlert({
      title: "Ticks?",
      text: "Choose how many ticks to display on the Y-axis.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },
  "change .input-checkbox-y-nice": function(event) {
    var val = !this.y_axis.nice;
    updateAndSave("updateYNice", this, val);
  },
  "click .help-y-nice-edit": function(event) {
    sweetAlert({
      title: "Niceify?",
      text: "Enable this to make the Y-axis end on a nice round value.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },
  "change .input-checkbox-y-rescale": function(event) {
    var val = !this.y_axis.rescale;
    updateAndSave("updateYRescale", this, val);
  },
  "click .help-y-rescale-edit": function(event) {
    sweetAlert({
      title: "Rescale?",
      text: "Rescale the Y-axis to add more whitespace at the top of the chart.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },

  "change .select-interpolation": function(event) {
    var interp = event.target.value;
    updateAndSave("updateInterpolation", this, interp);
  },
  "click .help-interpolation": function(event) {
    sweetAlert({
      title: "Interpolation?",
      text: "Interpolation refers to the smoothness and curvature of the line. Try it out!",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },
  "change .input-checkbox-stacked": function(event) {
    var val = !this.options.stacked;
    if (val === true) {
      updateAndSave("updateYMin", this, "");
      updateAndSave("updateYMax", this, "");
    }
    updateAndSave("updateStacked", this, val);
  },
  "click .help-stacked": function(event) {
    sweetAlert({
      title: "Stacked?",
      text: "Check this box to toggle series stacking and visualize cumulative data.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },
  "change .input-checkbox-expanded": function(event) {
    var val = !this.options.expanded;
    updateAndSave("updateExpanded", this, val);
  },
  "change .input-checkbox-tips": function(event) {
    var val = !this.options.tips;
    updateAndSave("updateTips", this, val);
  },
  "click .help-tips": function(event) {
    sweetAlert({
      title: "Show tips?",
      text: "Show tooltips with the values of each series when you hover over the chart.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },
  "change .input-checkbox-share-data": function(event) {
    var val = !this.options.share_data;
    updateAndSave("updateShareData", this, val);
  },
  "click .help-share-data": function(event) {
    sweetAlert({
      title: "Share data?",
      text: "Adds a 'data' button to each chart which can be toggled to present the charts data in a tabular form along with buttons allowing the raw data to be downloaded.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },
  "change .input-checkbox-social": function(event) {
    var val = !this.options.social;
    updateAndSave("updateSocial", this, val);
  },
  "click .help-social-sharing": function(event) {
    sweetAlert({
      title: "Social sharing?",
      text: "Adds a 'social' button to each chart which can be toggled to present the user with social sharing options.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  },
  "change .input-checkbox-ordinal": function(event) {
    var currScale = this.x_axis.scale;

    if (currScale != "ordinal") {
      updateAndSave("updateXScale", this, "ordinal");
    } else {
      updateAndSave("updateXScale", this, "time");
    }
  },
  "click .help-ordinal": function(event) {
    sweetAlert({
      title: "Ordinal scale?",
      text: "Check off this box if you want to treat your data points as discrete values, as you might with a set of names or categories.",
      type: "info",
      confirmButtonColor: "#fff"
    });
  }
});
