Template.header.events({
  "blur .input-slug-edit": function(event) {
    var slugData = event.target.value;
    var slug = slugParse(slugData);
    if (slug) {
      updateAndSave("updateSlug", this, slug);
      event.target.value = slug;
    } else {
      event.target.value = this.slug;
    }
  },
  "click .edit-indicator": function(event) {
    d3.select(".input-slug-edit").node().focus();
  },
  "click .header-help": function(event) {
    window.open(app_settings.help || "http://www.github.com/globeandmail/chart-tool", '_blank');
  }
});

Template.header.rendered = function() {
  var data = Router.current() && Router.current().data();
  if (data) {
    StretchyInit();
    Stretchy.resize(document.querySelector(".input-slug-edit"));
  }
};
