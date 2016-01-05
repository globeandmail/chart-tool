/*
 * Customized version of saveSvgAsPng.js that can handle a combination
 * of HTML + SVG divs by converting HTML into foreignObjects
 * https://github.com/jagius/multi-svg-to-png
 */

multiSVGtoPNG = (function multiSVGtoPNG() {

  var options = {};
  var obj = {}
  var canvasWidth = 0;

  obj.convertToSVG = function(options) {

    var targetContainer = options.input,
      targetChild = options.selector,
      outputLocation = options.output;

    d3.select(outputLocation).selectAll('#output').remove();
    var outputContainer = 'output';
    var temp_obj = d3.select(outputLocation)
      .append('div')
      .attr('xmlns', 'http://www.w3.org/1999/xhtml')
      .attr('id', outputContainer);

    var copy = d3.select(targetContainer).html();
    canvasWidth = d3.select(targetContainer).style('display', 'inline-block').node().getBoundingClientRect().width;

    var fos = d3.select(targetContainer).selectAll(targetChild).attr('xmlns', 'http://www.w3.org/1999/xhtml')[0];

    for (var i = 0; i < fos.length; i++) {

      var nodeType = d3.select(fos[i]).node().nodeName;

      if (nodeType != 'svg') {

        var item = d3.select(fos[i]).node().outerHTML;
        var elRef = d3.select(fos[i]);
        var css = styles(d3.select(targetContainer).node(), options.selectorRemap);
        var elHeight = d3.select(fos[i]).node().getBoundingClientRect().height;
        var elWidth = d3.select(fos[i]).node().getBoundingClientRect().width;
        var newSVG = temp_obj.append('svg')
          .attr('xmlns', 'http://www.w3.org/2000/svg')
          .attr('width', elWidth)
          .attr('height', elHeight)
          .append('foreignObject')
          .attr('xmlns', 'http://www.w3.org/2000/svg')
          .attr('width', elWidth)
          .attr('height', elHeight)
          .style('font-family', 'Helvetica')
          .style('width', elWidth)
          .html(item);

        newSVG.insert('style', ':first-child').html(css);

      } else {

        var item = d3.select(fos[i]).node().innerHTML;
        var elRef = d3.select(fos[i]);
        var elHeight = d3.select(fos[i]).node().getBoundingClientRect().height;
        var elWidth = d3.select(fos[i]).node().getBoundingClientRect().width;

        var css = styles(d3.select(fos[i]).node(), options.selectorRemap);

        var newSVG = temp_obj
          .append('svg')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('width', elWidth)
            .attr('height', elHeight)
            .html(item)

        newSVG.insert('defs', ':first-child')
          .append('style')
          .attr("type", "text/css")
          .html("<![CDATA[\n" + css + "\n]]>");

      }

    }

  }

  obj.encode = function(options) {
    var outputTarget = options.input,
        canvasTarget = options.output;
        // scale = options.scale || 1;
    //remove existing  canvas
    d3.selectAll('#theCanvas').remove();
    var svgs = d3.select(outputTarget).select('div').selectAll("svg")[0];
    var canvasHeight = 0;
    var currentHeight = 0;

    for (var i = 0; i < svgs.length; i++) {
      //add the height of the current object to the currentHeight variable - which is used to position the elements
      canvasHeight += d3.select(svgs[i]).node().getBoundingClientRect().height;
    }

    //set the width and height of the canas element to the required dimensions
    var theCanvas = d3.select(canvasTarget).append('canvas')
      .attr('id', 'theCanvas')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight);

    //create a canvas/context to write to
    var canvas = document.querySelector("canvas"),

      context = canvas.getContext("2d");

    //loop through each and draw it to the target context
    for (var i = 0; i < svgs.length; i++) {
      //grab a reference to the target elements outerHTML
      var item = d3.select(svgs[i]).attr("version", 1.1).node().outerHTML;
      //encode it as base64
      var imgsrc = 'data:image/svg+xml;base64,' + btoa(item);
      //create an image
      var image = new Image;
      //assign the base64 encoded data as its src attribute
      image.src = imgsrc;
      //draw the image to the context at the right position
      context.drawImage(image, 0, currentHeight);
      //add the height of the current object to the currentHeight variable - which is used to position the elements
      currentHeight += d3.select(svgs[i]).node().getBoundingClientRect().height;
    }

    //create a reference to the canvas's data URL
    var canvasdata = canvas.toDataURL("image/png");

    return canvasdata;

  }

  obj.downloadPNG = function(options) {
    var data = options.data,
        filename = options.filename;

    //create a link to kick off the download from and trigger it.
    var a = document.createElement("a");
    a.download = filename + ".png";
    a.href = data;
    a.click();
  }

  /*Borrowed from https://github.com/exupero/saveSvgAsPng/blob/gh-pages/saveSvgAsPng.js*/
  function isExternal(url) {
    return url && url.lastIndexOf('http', 0) == 0 && url.lastIndexOf(window.location.host) == -1;
  }

  /*Borrowed from https://github.com/exupero/saveSvgAsPng/blob/gh-pages/saveSvgAsPng.js*/
  function styles(el, selectorRemap) {
    var css = "";
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
      if (isExternal(sheets[i].href)) {
        console.warn("Cannot include styles from other hosts: " + sheets[i].href);
        continue;
      }
      var rules = sheets[i].cssRules;
      if (rules != null) {
        for (var j = 0; j < rules.length; j++) {
          var rule = rules[j];
          if (typeof(rule.style) != "undefined") {
            var match = null;
            try {
              match = el.querySelector(rule.selectorText);
            } catch (err) {
              console.warn('Invalid CSS selector "' + rule.selectorText + '"', err);
            }
            if (match) {
              var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
              css += selector + " { " + rule.style.cssText + " }\n";
            } else if (rule.cssText.match(/^@font-face/)) {
              css += rule.cssText + '\n';
            }
          }
        }
      }
    }
    return css;
  }

  return obj;

})();
