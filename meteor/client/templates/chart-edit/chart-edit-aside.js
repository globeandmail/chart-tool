Template.chartEditAside.helpers({
  isTimeSeries: function() {
    if (this.options) {
      var type = this.options["type"];
      if (type === "area" || type === "line" || type === "stream") {
        return true;
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
  isNotStackableExpandable: function() {
    if (this.options) {
      var type = this.options["type"];
      if (type === "area" || type === "bar" || type === "column") {
        return false;
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
  isOrdinal: function(val) {
    if (this.options) {
      var type = this.options["type"];
      if (type === "area" || type === "line" || type === "stream") {
        if (this.x_axis.scale === "ordinal") {
          return true;
        } else {
          return false;
        }
      }
    }
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
      str = " " + app_settings.standard_time,
      re = /\s\%H\:\%M/g;

    if (re.test(dateFormat)) { format += str; }
    updateAndSave("updateDateFormat", this, format );
  },
  "change .input-checkbox-hours": function(event) {
    var dateFormat = this.date_format,
      val = !this.hasHours,
      str = " " + app_settings.standard_time,
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

  "change .input-index": function(event) {
    var input = event.target.value;
    updateAndSave("updateIndex", this, input);
  },

  "change .select-format-x": function(event, template) {
    var format = event.target.value;
    updateAndSave("updateXFormat", this, format);
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

    obj["custom"] = format;
    updateAndSave("updateXFormat", this, obj);
  },
  "blur .input-data-edit": function(event) {
    var data = dataParse(event.target.value);
    updateAndSave("updateData", this, data);
    event.target.value = data;
  },

  "change .input-radio": function(event) {
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
  "change .input-checkbox-y-nice": function(event) {
    var val = !this.y_axis.nice;
    updateAndSave("updateYNice", this, val);
  },
  "change .input-checkbox-y-rescale": function(event) {
    var val = !this.y_axis.rescale;
    updateAndSave("updateYRescale", this, val);
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