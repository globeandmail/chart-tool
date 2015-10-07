Template.chartEditEmbed.helpers({
  angleBracket: function() {
    return '<';
  },
  embedJSON: function() {
    if (!isEmpty(this)) {
      return JSON.stringify(embed(this), null, 2);
    }
  }
});