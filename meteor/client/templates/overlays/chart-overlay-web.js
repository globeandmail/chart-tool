Template.chartOverlayWeb.events({
  'submit .web-export-picker': function(event) {
    event.preventDefault();

    var width = parseInt(event.target.width.value),
        ratio = parseFloat(event.target.ratio.value),
        scale = function (width) {
          switch(width) {
            case 460:
              return 5;
            case 620:
              return 4;
            case 940:
              return 3;
          }
        },
        options = {
          scale: scale(width),
          descriptor: "web"
        };

    this.exportable = {};
    this.exportable.type = "web";
    this.exportable.dynamicHeight = false;
    this.exportable.width = width;
    this.exportable.height = width * (ratio / 100);

    downloadImg(this, options);

    return false;
  },
  'click .web-export-button': function(event) {

    var width = parseInt(event.target.dataset.width),
        ratio = parseFloat(event.target.dataset.ratio),
        options = {
          scale: event.target.dataset.scale,
          descriptor: event.target.dataset.descriptor
        };

    if (!ratio) { ratio = 67; }

    this.exportable = {};
    this.exportable.type = "web";
    this.exportable.dynamicHeight = true;
    this.exportable.width = width;
    this.exportable.height = width * (ratio / 100);

    downloadImg(this, options);
  },
  'submit .web-export-custom-picker': function(event) {
    event.preventDefault();

    var width = parseInt(event.target.width.value),
        height = parseFloat(event.target.height.value),
        options = {
          scale: parseFloat(event.target.scale.value),
          descriptor: "web"
        };

    if (isNaN(width) || isNaN(height)) {

      var title, text;

      if (isNaN(width) && isNaN(height)) {
        title = "Missing width and height sizes";
        text = "Looks like you're missing width and height attributes for your custom size. Make sure to set those before downloading your image."
      } else {
        var missing = isNaN(width) ? "width" : "height";
        title = "Missing " + missing + " size"
        text = "Looks like you're missing a " + missing + " attribute for your custom size. Make sure to set it before downloading your image."
      }

      sweetAlert({
        title: title,
        text: text,
        type: "info",
        confirmButtonColor: "#fff"
      });

    } else {

      this.exportable = {};
      this.exportable.type = "web";
      this.exportable.dynamicHeight = true;
      this.exportable.width = width;
      this.exportable.height = height;

      downloadImg(this, options);

      return false;

    }

  },
});
