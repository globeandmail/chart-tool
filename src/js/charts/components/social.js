/**
 * Social module.
 * @module charts/components/social
 */

/*
This component adds a "social" button to each chart which can be toggled to present the user with social sharing options
 */

function socialComponent(node, d) {

	var socialOptions = [];

	for (var prop in d.social) {
		if (d.social[prop]) {
			switch (d.social[prop].label) {
				case "Twitter":
					d.social[prop].url = constructTwitterURL(d);
					d.social[prop].popup = true;
					break;
				case "Facebook":
					d.social[prop].url = constructFacebookURL(d);
					d.social[prop].popup = true;
					break;
				case "Email":
					d.social[prop].url = constructMailURL(d);
					d.social[prop].popup = false;
					break;
				case "SMS":
					d.social[prop].url = constructSMSURL(d);
					d.social[prop].popup = false;
					break;
				default:
					console.log('INCORRECT SOCIAL ITEM DEFINITION')
			}
			socialOptions.push(d.social[prop]);
		}
	}

	function getThumbnail(d){
		return "https://s3.amazonaws.com/" + d.image.bucket + "/" + d.image.base_path + d.id.replace(d.prefix,'') + "/" + d.image.filename + "." + d.image.extension;
	}

	function constructFacebookURL(d){
		var base = 'https://www.facebook.com/dialog/share?';
		var redirect = d.social.facebook.redirect;
		return base + 'app_id=' + d.social.facebook.appID + '&amp;display=popup&amp;title=' + d.heading + '&amp;description=From%20article' + document.title + '&amp;href=' + window.location.href + '&amp;redirect_uri=' + redirect + '&amp;picture=' + getThumbnail(d);
	}

	function constructMailURL(d){
		var base = 'mailto:?';
		return base + 'subject=' + d.heading + '&amp;body=' + d.heading + '%0A' + getThumbnail(d) + '%0Afrom article: ' + document.title + '%0A' + window.location.href;
	}

	function constructSMSURL(d){
		var base = 'sms:';
		return base + '&body=Check%20out%20this%20chart: ' + d.heading+'%20'+getThumbnail(d);
	}

	function constructTwitterURL(d){
		var base = 'https://twitter.com/intent/tweet?';
		var hashtag = d.social.twitter.hashtag;
		return base + 'url=' + window.location.href  + '&amp;via=' + d.social.twitter.via + '&amp;text=' + encodeURI(d.heading)+ '%20' + getThumbnail(d) + '%20';
	}

	// social popup
	function windowPopup(url, width, height) {
	  // calculate the position of the popup so it’s centered on the screen.
	  var left = (screen.width / 2) - (width / 2),
	      top = (screen.height / 2) - (height / 2);
	  window.open(
	    url,
	    "",
	    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
	  );
	}


	var chartContainer = d3.select(node);

 	var chartMeta = chartContainer.select('.ct-chart_meta');

	var chartSocialBtn = chartMeta
		.append('div')
		.attr('class','ct-chart_meta_btn gi-social-btn')
		.html('share');
	
	var chartSocial = chartContainer
		.append('div')
		.attr('class','ct-chart_social');

	var chartSocialCloseBtn = chartSocial
		.append('div')
		.attr('class','ct-chart_social_close')
		.html('&#xd7;');

	var chartSocialOptions = chartSocial
		.append('div')
		.attr('class','ct-chart_social_options');

	var chartSocialOptionsTitle = chartSocialOptions
		.append('h3')
		.html('Share this chart:');

	chartSocialBtn.on('click',function() {
		chartSocial.classed('active',true);
	})

	chartSocialCloseBtn.on('click',function() {
		chartSocial.classed('active',false);
	})

	var itemAmount = socialOptions.length;
	for(var i=0; i < itemAmount; i++ ) {
		var socialItem = chartSocialOptions
			.selectAll('.social-item')
			.data(socialOptions)
			.enter()
			.append('div')
			.attr('class','social-item').html(function(d){
				if(!d.popup){
					return '<a href="'+d.url+'"><img class="ct-social-icon" src="'+d.icon+'" title="'+d.label+'"/></a>';
				}else{
					return '<a class="js-gi-share" href="'+d.url+'"><img class="ct-social-icon" src="'+d.icon+'" title="'+d.label+'"/></a>';
				}
			});
	}

	var chartSocialOptionsTitle = chartSocialOptions
		.append('div')
		.attr('class','ct-image-url')
		.attr('contentEditable','true')
		.html(function(){
			var img = "https://s3.amazonaws.com/" + d.image.bucket + "/" + d.image.base_path + d.id.replace(d.prefix,'') + "/" + d.image.filename + "." + d.image.extension;
			return img;
		});

	var giSharePopup = document.querySelectorAll(".js-gi-share");
  if (giSharePopup) {
    [].forEach.call(giSharePopup, function(anchor) {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();
        windowPopup(this.href, 600, 620);
      });
    });
  }

	return {
		meta_nav:chartMeta
	};
	
}
module.exports = socialComponent;