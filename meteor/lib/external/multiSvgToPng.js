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

        var css = styles(d3.select(targetContainer).node(), options.selectorRemap);
        var item = d3.select(fos[i]).node().innerHTML;
        var elRef = d3.select(fos[i]);
        var elHeight = d3.select(fos[i]).node().getBoundingClientRect().height;
        var elWidth = d3.select(fos[i]).node().getBoundingClientRect().width;
        var elClass = elRef.attr('class');
        var newSVG = temp_obj.append('svg')
          .attr('class', elClass)
          .attr('xmlns', 'http://www.w3.org/2000/svg')
          .attr('width', elWidth)
          .attr('height', elHeight)
          .html(item);
        newSVG.insert('style', ':first-child').html(css);

      }

    }

  }

  obj.encode = function(options, cb) {
    var outputTarget = options.input,
        canvasTarget = options.output,
        scale = options.scale || 1;

    d3.selectAll('#theCanvas').remove();
    var svgs = d3.select(outputTarget).select('div').selectAll("svg")[0];
    var canvasHeight = 0;
    var currentHeight = 0;

    for (var i = 0; i < svgs.length; i++) {
      canvasHeight += d3.select(svgs[i]).node().getBoundingClientRect().height;
    }

    var theCanvas = d3.select(canvasTarget).append('canvas')
      .attr('id', 'theCanvas')
      .attr('width', canvasWidth * scale)
      .attr('height', canvasHeight * scale);

    var canvas = theCanvas.node(),
        context = canvas.getContext("2d");

    context.scale(scale, scale);

    context.fillStyle = d3.select(canvasTarget).style("background-color");

    var imageCounter = 0;

    for (var i = 0; i < svgs.length; i++) {
      (function(arr, k) {
        var currSvg = d3.select(arr[k]),
            currSvgHeight = currSvg.node().getBoundingClientRect().height;

        var item = currSvg.attr("version", 1.1).node().outerHTML;
        var imgsrc = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(item)));
        var image = new Image;
        image.src = imgsrc;
        image.onload = function() {
          if (!imageCounter) {
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            context.fill();
          }
          context.drawImage(image, 0, currentHeight);
          currentHeight += currSvgHeight;
          if ((arr.length - 1) === imageCounter) {
            var canvasData = canvas.toDataURL("image/png");
            if (cb) {
              cb(canvasData);
            } else {
              return canvasData;
            }
          } else {
            imageCounter++;
          }
        }
      })(svgs, i);
    }

  }

  obj.downloadPNG = function(options) {

    options = options || {},
    options.scale = options.scale || 1;

    obj.encode(options, function(data) {
      var a = document.createElement('a');
      a.download = options.filename + ".png";
      a.href = data;
      document.body.appendChild(a);
      a.addEventListener("click", function(e) {
        a.parentNode.removeChild(a);
      });
      a.click();
      d3.selectAll('#theCanvas').remove();
    })

  }

  function isExternal(url) {
    return url && url.lastIndexOf('http', 0) == 0 && url.lastIndexOf(window.location.host) == -1;
  }

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
