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

    function dataURLtoBlob(dataURL) {
      var arr = dataURL.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }

    var filedata = dataURLtoBlob(this.img);

    filedata.name = this.slug + "-" + this._id + ".png";

    var now = new Date();

    S3.upload({
      files: [filedata],
      path: app_settings.s3.base_path + this._id,
      expiration: app_settings.s3.expiration || 30000,
      unique_name: false
    }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        console.log(((new Date()) - now) + "ms");
      }
    });

    // downloadImg(this, options);
  }
});
