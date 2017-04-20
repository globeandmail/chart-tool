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
      var utc = new Date().toJSON().slice(0,10).replace(/-/g,'');
      console.log(utc);
      var dateTest = function(slug, utc) {
        var slugSlice = slug.slice(0,8);
        console.log(slugSlice);
        if(slugSlice == utc) {
          return true;
        } else {
          return false;
        }
      }
      if (rawData) { var data = dataParse(rawData); }
      if ( dateTest(slug,utc) && slug && data ) {
        Meteor.call("addChart", slug, data, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            Meteor.call('postSlack', slug, result);
            Session.set("chartId", result);
            Router.go('chart.edit', {_id: Session.get("chartId")});

          }
        });
      } else {
        sweetAlert({
          title: "Please check your slug and data.",
          text: "Looks like you're missing a slug or some data. Please add some and retry. Make sure slug starts with today's date, i.e. 20170420-pickles.",
          type: "error",
          confirmButtonColor: "#fff"
        });
      }

  }
});
