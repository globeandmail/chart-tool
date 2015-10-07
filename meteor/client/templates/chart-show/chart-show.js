Template.chartShow.helpers({
  isList: function() {
    var layout = Router.current()._layout._template;
    if (layout === "listLayout") {
      return true;
    }
  }

})