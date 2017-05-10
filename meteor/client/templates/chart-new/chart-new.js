Template.chartNew.events({
  'blur .input-slug': function(event) {
    var slugData = event.target.value;
    var slug = slugParse(slugData);
    event.target.value = slug;
  },
  'submit .new-chart': function(event) {
      event.preventDefault();
      rawData = event.target.pasteData.value;
      slug = event.target.slug.value;
      if (rawData) { var data = dataParse(rawData); }
      if ( slug && data ) {
        Meteor.call("addChart", slug, data, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("Chart added with id: " + result);
            Meteor.call('postSlackMessage', slug, result);
            Session.set("chartId", result);
            Router.go('chart.edit', {_id: Session.get("chartId")});
          }
        });
      } else {
        sweetAlert({
          title: "Please check your slug and data.",
          text: "Looks like you're missing a slug or some data. Please add some and retry.",
          type: "error",
          confirmButtonColor: "#fff"
        });
      }

  }
});
