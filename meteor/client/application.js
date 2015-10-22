$.extend($.fn.pulse = function() {
  var minOpacity = 0.2;
  var fadeOutDuration = 600;
  var fadeInDuration = 600;
  $(this).attr('pulsing', 'y');

  $(this).animate({
    opacity: minOpacity
  }, fadeOutDuration, function() {
    $(this).animate({
      opacity: 1
    }, fadeInDuration, function() {
      if ($(this).attr('pulsing') == 'y') $(this).pulse();
    })
  });
  return $(this);
});

$.extend($.fn.stopPulse = function() {
  $(this).attr('pulsing', '').stop(true, true).animate({
    opacity: 1
  });
});

updateAndSave = function(method, obj, data) {
  $(".save-state").show();
  $(".save-state").pulse();
  Meteor.call(method, obj._id, data, function(err, result) {
    if (!err) {
      var newObj = Charts.findOne(Session.get("chartId"));
      generateImg(newObj);
      $(".save-state").stopPulse();
      $(".save-state").html("Saved!");
      setTimeout(function() {
        $(".save-state").animate({
          opacity: 0
        }, 800, function() {
          $(".save-state").html("Saving...");
        });
      }, 3 * 1000);
    } else {
      console.log(err);
    }
  });
}

drawPreviews = function(obj) {
  drawChart(".desktop-preview-container", obj);
  drawChart(".mobile-preview-container", obj);
}

drawChart = function(container, obj) {
  var chartObj = {};
  chartObj.id = obj._id;
  chartObj.data = embed(obj);
  ChartTool.create(container, chartObj);
}

generateImg = function(obj) {

  var width = 620,
    scale = 1,
    ratio = 0.75,
    className = "chart-thumbnail",
    container = "." + className,
    div = document.createElement("div"),
    img = document.createElement("img"),
    canvasEl = document.createElement("canvas");

  document.body.appendChild(div);

  div.style.position = "absolute";
  div.style.left = "9999px";
  div.style.top = "0px";
  div.style.width = width + "px"; //set chart source to target width
  div.className = className;

  drawChart(container, obj);

  //add required attributes to svg tag
  var svg = d3.select(div).select('.' + prefix + 'chart_svg')
    .attr("version", 1.1)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width);

  var height = svg.node().getBoundingClientRect().height;

  var canvas = d3.select(canvasEl)
    .style("display", "none")
    .attr("width", width)
    .attr("height", height);

  var svgOpt = { scale: scale };

  svgAsDataUri(svg.node(), svgOpt, function(uri) {
    d3.select(img).attr('src', uri);
    d3.select(img).node().addEventListener('load', function() {
      var ctx = canvas.node().getContext("2d");
      ctx.drawImage(this, 0, 0);
      var png = canvas.node().toDataURL("image/png");
      Meteor.call("updateImg", obj._id, png);
    }, false);
  });

  // cleaning up
  d3.select(div).remove();
  div = null;
  img = null;
  canvasEl = null;

}

// downloads a web image to certain specifications
downloadImg = function(_obj, _options) {

  var scale = _options.scale,
      descriptor = _options.descriptor,
      className = "chart-export",
      container = "." + className,
      filename = _obj.slug + "-" + descriptor + "-" + _obj.exportable.width + ".png",
      div = document.createElement("div");

  div.style.position = "absolute";
  div.style.left = "400px";
  div.style.top = "400px";
  div.style.width = _obj.exportable.width + "px";
  div.style.height = _obj.exportable.height + "px";
  div.className = className;
  document.body.appendChild(div);

  //set chart source to the target width
  d3.select(div).style('width', _obj.exportable.width + 'px');

  //call drawChart function to refresh - this function is going to differ slightly from the loader
  drawChart(container, _obj);

  //add required attributes to svg tag
  var svg = d3.select(div).select('svg')
    .attr("version", 1.1)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", _obj.exportable.width)
    .attr("height", _obj.exportable.height);

  saveSvgAsPng(svg.node(), filename, {
    scale: scale
  });

  div.parentNode.removeChild(div);
  div = null;

}

// downloads a print-ready JPG
downloadJpg = function(_obj) {

  var magicW = app_settings.print.magic.width,
      magicH = app_settings.print.magic.height,
      width = determineWidth(_obj.print.columns) * magicW,
      height = determineHeight(_obj.print.lines, width) * magicH,
      scale = app_settings.print.default_scale,
      className = "chart-print-export",
      container = "." + className,
      filename = _obj.slug + "-print-" + _obj.print.columns + ".jpg",
      div = document.createElement("div");

  div.style.position = "absolute";
  div.style.left = "9999px";
  div.style.top = "0px";
  div.style.width = width + "px";
  div.style.height = height + "px";
  div.className = className;
  document.body.appendChild(div);

  _obj.exportable = {};
  _obj.exportable.width = width;
  _obj.exportable.height = height;
  _obj.exportable.type = "pdf";

  drawChart(container, _obj);

  //add required attributes to svg tag
  var svg = d3.select(div).select('svg')
    .attr("version", 1.1)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height);

  saveSvgAsJpg(svg.node(), filename, {
    scale: scale,
    quality: 1.0,
    selectorRemap: function(s) {
      return s.replace(".chart-print-export", "");
    }
  });

  div.parentNode.removeChild(div);
  div = null;

}
