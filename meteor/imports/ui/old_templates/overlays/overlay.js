Template.overlay.helpers({
  animation: function(argument) {
    return Session.get('overlay-animation') || 'fade';
  },
  data: function() {
    return Session.get('overlay-data');
  },
  overlayVisible: function() {
    return Session.get('overlay-visible');
  },
  currentOverlay: function(argument) {
    return Session.get('overlay');
  }
});

Template.overlay.events({
  'click .overlay-close': function() {
    Overlay.hide();
  }
});

Template.overlay.rendered = function() {
  window.onkeydown = function(e) {
    if (e.keyCode == 27) {
      Overlay.hide();
    }
  }
}

// API
Overlay = {
  show: function(template, data) {
    var data = data || {};
    if (data.closeable === undefined) data.closeable = true;
    _.extend(data, {
      isInOverlay: true
    });
    Session.set('overlay-data', data);
    Session.set('overlay', template);
    Session.set('overlay-animation', data.animation);
    Session.set('overlay-visible', true);
  },
  hide: function() {
    Session.set('overlay-visible', false);
  }
}
