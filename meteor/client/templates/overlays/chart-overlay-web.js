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
    this.exportable.width = width;
    this.exportable.height = width * (ratio / 100);

    downloadImg(this, options);
  }
});