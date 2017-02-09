function setInactive() {
  var containers = document.querySelectorAll('.preview-outer-container');
  for (var i = 0; i < containers.length; i++) {
    containers[i].classList.add('preview-inactive');
  }
}

function setActive() {
  var containers = document.querySelectorAll('.preview-outer-container');
  for (var i = 0; i < containers.length; i++) {
    containers[i].classList.remove('preview-inactive');
  }
}

updateAndSave = function(method, obj, data) {
  setInactive();
  Meteor.call(method, obj._id, data, function(err, result) {
    if (!err) {
      var newObj = Charts.findOne(Session.get("chartId"));
      generateThumb(newObj);
    } else {
      console.log(err);
    }
    setActive();
  });
}

drawChart = function(container, obj, cb) {
  d3.select(container).selectAll(".chart-error-container").remove();
  var error;
  try {
    var chartObj = {};
    chartObj.id = obj._id;
    chartObj.data = embed(obj);
    ChartTool.create(container, chartObj, cb);
  } catch (e) {
    error = e;
    console.log(error);
    drawError(container, error);
    if (obj.drawFinished) { obj.drawFinished(); }
  } finally {
    return error;
  }
}

drawError = function(container, error) {

  d3.select(container).selectAll("svg").remove();
  d3.select(container).selectAll("div").remove();

  var errorContainer = d3.select(container).append("div")
    .attr("class", "chart-error-container");

  var errorGroup = errorContainer.append("div")
    .attr("class", "chart-error");

  errorGroup.append("img")
    .attr({
      "class": "chart-error_img",
      "src": "/images/error.svg"
    });

  errorGroup.append("h2")
    .attr("class", "chart-error_warning")
    .text("Chart error");

  errorGroup.append("p")
    .attr("class", "chart-error_text")
    .text(error.error)

  errorGroup.append("p")
    .attr("class", "chart-error_reason")
    .text(error.reason)

}

generateThumb = function(obj) {

  var scale = 2,
      ratio = 67,
      className = "chart-thumbnail",
      container = "." + className,
      div = document.createElement("div");

  obj.exportable = {};
  obj.exportable.type = "web";
  obj.exportable.dynamicHeight = false;
  obj.exportable.width = app_settings.s3.thumbnailWidth;
  div.style.width = obj.exportable.width + "px";

  if (obj.options.type !== "bar") {
    obj.exportable.height = obj.exportable.width * (ratio / 100);
    div.style.height = obj.exportable.height + "px";
  }

  div.className = className;
  document.body.appendChild(div);

  var chartError = drawChart(container, obj);

  if (!chartError) {

    var svgContainer = document.createElement("div");
    svgContainer.className = "svg-container";
    document.body.appendChild(svgContainer);

    var outputCanvas = document.createElement("div");
    outputCanvas.className = "canvas-container";
    document.body.appendChild(outputCanvas);

    var drawnChartContainer = d3.select(container);

    var prefix = app_settings.chart.prefix;

    drawnChartContainer.select("." + prefix + "chart_title")
      .classed("target", true);

    drawnChartContainer.select("." + prefix + "chart_svg")
      .classed("target", true);

    drawnChartContainer.select("." + prefix + "chart_source")
      .classed("target", true);

    multiSVGtoPNG.convertToSVG({
      input: '.chart-thumbnail',
      selector: "." + prefix + "chart_title.target, ." + prefix + "chart_svg.target, ." + prefix + "chart_source.target",
      output: '.svg-container'
    });

    multiSVGtoPNG.encode({
      input: '.svg-container',
      output: '.canvas-container',
      scale: scale || 2
    }, function(data) {

      if (app_settings.s3 && app_settings.s3.enable) {

        var file = dataURLtoBlob(data);
        file.name = app_settings.s3.filename + "." + app_settings.s3.extension;

        S3.upload({
          files: [file],
          path: app_settings.s3.base_path + obj._id,
          expiration: app_settings.s3.expiration || 30000,
          unique_name: false
        }, function(err, result) {
          if (err) {
            console.error("S3 thumbnail upload error!");
          } else {
            Meteor.call("updateImg", obj._id, result.secure_url);
          }
        });
      } else {
        Meteor.call("updateImg", obj._id, data);
      }

    });

    svgContainer.parentNode.removeChild(svgContainer);
    svgContainer = null;

    outputCanvas.parentNode.removeChild(outputCanvas);
    outputCanvas = null;

  }

  div.parentNode.removeChild(div);
  div = null;

}


// downloads a web image to certain specifications
downloadImg = function(_obj, _options) {

  var scale = _options.scale,
      className = "chart-export",
      container = "." + className,
      filename = _obj.slug + "-" + _options.descriptor + "-" + _obj.exportable.width,
      div = document.createElement("div");

  div.style.width = _obj.exportable.width + "px";
  div.style.height = _obj.exportable.height + "px";
  div.className = className;
  document.body.appendChild(div);

  var chartError = drawChart(container, _obj);

  if (!chartError) {

    var svgContainer = document.createElement("div");
    svgContainer.className = "svg-container";
    document.body.appendChild(svgContainer);

    var outputCanvas = document.createElement("div");
    outputCanvas.className = "canvas-container";
    document.body.appendChild(outputCanvas);

    var drawnChartContainer = d3.select("." + className);

    var prefix = app_settings.chart.prefix;

    drawnChartContainer.select("." + prefix + "chart_title")
      .classed("target", true);

    drawnChartContainer.select("." + prefix + "chart_svg")
      .classed("target", true);

    drawnChartContainer.select("." + prefix + "chart_source")
      .classed("target", true);

    multiSVGtoPNG.convertToSVG({
      input: '.chart-export',
      selector: "." + prefix + "chart_title.target, ." + prefix + "chart_svg.target, ." + prefix + "chart_source.target",
      output: '.svg-container'
    });

    multiSVGtoPNG.downloadPNG({
      filename: filename,
      input: '.svg-container',
      output: '.canvas-container',
      scale: scale || 2
    });

    svgContainer.parentNode.removeChild(svgContainer);
    svgContainer = null;

    outputCanvas.parentNode.removeChild(outputCanvas);
    outputCanvas = null;

  }

  div.parentNode.removeChild(div);
  div = null;

}
