randomFromArr = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

copyObj = function (o) {
  var copy = Object.create(Object.getPrototypeOf(o));
  var propNames = Object.getOwnPropertyNames(o);
  propNames.forEach(function(name) {
    var desc = Object.getOwnPropertyDescriptor(o, name);
    Object.defineProperty(copy, name, desc);
  });
  return copy;
}

isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}

escapeStr = function(str) {
  if (typeof str === "string") {
    return str ? str.replace(/\"/g, '\\\"') : str;
  }
}

cleanEmbed = function(data) {
  var arr = [];
  arr.push(
    "_id",
    "slug",
    "createdAt",
    "lastEdited",
    "version",
    "build",
    "heading",
    "qualifier",
    "source",
    "md5",
    "date_format",
    "time_format",
    "print",
    "img",
    "prefix"
  );
  var chartObj = deleteProp(data, arr);
  var newData = csvFormat(data);
  chartObj.data = newData;
  return deleteNullProps(chartObj);
}

embed = function(obj) {
  var data = {
    "version": obj.version,
    "id": obj._id,
    "heading": escapeStr(obj.heading),
    "qualifier": escapeStr(obj.qualifier),
    "source": escapeStr(obj.source)
  };
  data["chart"] = cleanEmbed(obj);
  return data;
}

deleteNullProps = function(obj) {
  for (var i in obj) {
    if ((obj[i] === null) || (obj[i] === undefined)) {
      delete obj[i];
    } else if (obj[i] === "") {
      delete obj[i];
    } else if (typeof obj[i] === 'object') {
      if (Object.keys(obj[i]).length) {
        deleteNullProps(obj[i]);
      } else {
        delete obj[i];
      }
    }
  }
  return obj;
}

deleteProp = function(obj, del) {
  var copy = copyObj(obj);
  for (var i = 0; i < del.length; i++) {
    var elem = del[i];
    delete copy[elem];
  };
  return copy;
}


jsonToCSV = function(objArray, config) {
  var defaults = {
    delimiter: ',',
    newline: '\n'
  };
  var opt = config || defaults;
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') { line += opt.delimiter };
      line += array[i][index];
    }

    if (i === array.length - 1) {
      str += line;
    } else {
      str += line + opt.newline;
    }
  }

  return str;
}

csvFormat = function(obj) {
  if (!isEmpty(obj)) {
    var data = obj.data;
    if (obj.x_axis.scale === "time") {
      var stdFormat = app_settings.chart.date_format;
      if (obj.hasHours) { stdFormat += " " + app_settings.chart.time_format; }
      var currFormat = obj.date_format;
      return standardizeDates(data, currFormat, stdFormat);
    } else {
      return data;
    }
  }
}

slugParse = function(slug) {
  var re = /^[a-zA-Z0-9-]*$/;
  if (!re.test(slug)) {
    return slug.replace(/[ +.,!@#$%^&*();:\/|<>_ =]/g,'-').toLowerCase();
  } else {
    return slug.toLowerCase();
  }
}

dataParse = function(data) {

  var newData = data.replace(/\n\n/g,"\n").trim();
  // parses data into JSON, then back into a CSV for delimiter consistency
  var headerRow = newData.split("\n")[0], //grab the first row of data - not concerned with the rest at this point.
    tryTabs = headerRow.split("\t").length,
    tryComma = headerRow.split(",").length,
    parseCSVParams = {
      delimiter: ","
    },
    parseTSVParams = {
      delimiter: "\t"
    },
    parseParams,
    parsedData,
    reformattedCSV,
    output;

  //check that there are tabs or commas
  if (tryTabs > tryComma && tryTabs > 0) {
    parseParams = parseTSVParams;
  } else if (tryComma > 0) {
    parseParams = parseCSVParams;
  } else {
    sweetAlert({
      title: "There's a problem with your data.",
      text: "No tabs or commas were detected in your data set. Please check it over and retry.",
      type: "error",
      confirmButtonColor: "#fff"
    });
  }

  if (parseParams) {
    parsedData = cleanData(Papa.parse(newData, parseParams).data);
    var csvOptions = {
      delimiter: ",",
      newline: "\n"
    };
    reformattedCSV = jsonToCSV(parsedData, csvOptions);
    output = reformattedCSV;
  } else {
    output = newData;
  }

  return output;

}

cleanData = function(data) {

  // strip empty lines

  //ignore the first item which would be the header row
  var headerRow = data.shift();

  //step through each line in the csv
  var output = data.map(function(obj) {

    //ignore the first row which would identify the series - everything following is a value
    var headerCol = obj.shift();

    //step through each value
    var line = obj.map(function(arr) {
      var line_output = cleanNumber(arr);
      return line_output;
    });

    var replace_slashes = /\//g;

    //add the first row back to the line
    line.unshift(headerCol.replace(replace_slashes,'-'));
    return line;
  });

  // add the header row back to the data
  output.unshift(headerRow);
  return output;
}

formatDate = function(data, format) {
  var d = format.parse(data);
  var output = format(d);
  return output;
}

cleanNumber = function(data) {
  // remove everything that isnt a number, decimal, or negative
  return data.toString().replace(/[^0-9\.-]/g, '');
}

removeNbsp = function(val) {
  var re = new RegExp(String.fromCharCode(160), "g");
  return val.replace(re, "");
}

isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// converts from columns into millimeters
determineWidth = function(columns) {
  var cols;

  switch (columns) {
    case "1col":
      cols = 1;
      break;
    case "2col":
      cols = 2;
      break;
    case "3col":
      cols = 3;
      break;
    case "4col":
      cols = 4;
      break;
    case "5col":
      cols = 5;
      break;
    default:
      cols = app_settings.print.default_cols;
      break;
  }
  return ((cols * app_settings.print.column_width) + ((cols - 1) * app_settings.print.gutter_width));
};

// converts from lines into mm
determineHeight = function(lines, width) {
  if (!lines) {
    return width * 0.75;
  } else {
    return app_settings.print.first_line_depth + (app_settings.print.line_depth * (lines - 1));
  }
}

standardizeDates = function(data, oldFormat, newFormat) {

  var stdFormat = d3.time.format(newFormat),
      currFormat = d3.time.format(oldFormat);

  var jsonData = Papa.parse(data, { delimiter: "," });

  for (var i = 1; i < jsonData.data.length; i++ ) {
    var date = currFormat.parse(jsonData.data[i][0]);
    if (date !== null) {
      jsonData.data[i][0] = stdFormat(date);
    } else {
      throw new Meteor.Error("Incompatible date formatting", "Make sure your data date formatting matches the formatting dropdown.");
    }
  }

  var csvOptions = {
    delimiter: ",",
    newline: "\n"
  };

  var output = jsonToCSV(jsonData.data, csvOptions);

  var op = output.replace(/\"/g, '\/\"');

  return op;

}

updateObject = function(chartObj, obj) {
  for (var prop in obj) {
    updateAndSave("update" + prop, chartObj, obj[prop]);
  }
}
