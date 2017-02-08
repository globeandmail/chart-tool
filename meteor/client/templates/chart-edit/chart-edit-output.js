Template.chartEditOutput.events({
  'click .export-embed': function(e) {
    e.target.select();
  },
  'click .export-png': function(e) {
    Overlay.show("chartOverlayWeb", this);
    window.scrollTo(0, 0);
  },
  'click .export-svg': function(e) {
    Overlay.show("chartOverlaySVG", this);
    window.scrollTo(0, 0);
  },
  'click .export-pdf': function(e) {
    Overlay.show("chartOverlayPrint", this);
    window.scrollTo(0, 0);
  }
});
