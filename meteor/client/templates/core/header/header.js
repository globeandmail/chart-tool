Template.header.rendered = function() {
  $(".input-slug-edit").autosizeInput({ space: 0 });
};

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
  }
});