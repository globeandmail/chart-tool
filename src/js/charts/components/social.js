/**
 * Social module.
 * @module charts/components/social
 */

/*
This component adds a "social" button to each chart which can be toggled to present the user with social sharing options
 */

var getThumbnail = require("../../utils/utils").getThumbnailPath;

function socialComponent(node, obj) {

	var socialOptions = [];

	for (var prop in obj.social) {
		if (obj.social[prop]) {
			switch (obj.social[prop].label) {
				case "Twitter":
					obj.social[prop].url = constructTwitterURL(obj);
					obj.social[prop].popup = true;
					break;
				case "Facebook":
					obj.social[prop].url = constructFacebookURL(obj);
					obj.social[prop].popup = true;
					break;
				case "Email":
					obj.social[prop].url = constructMailURL(obj);
					obj.social[prop].popup = false;
					break;
				case "SMS":
					obj.social[prop].url = constructSMSURL(obj);
					obj.social[prop].popup = false;
					break;
				default:
					console.log('INCORRECT SOCIAL ITEM DEFINITION')
			}
			socialOptions.push(obj.social[prop]);
		}
	}

	var chartContainer = d3.select(node);

  var chartMeta = chartContainer.select('.' + obj.prefix + 'chart_meta');

  if (chartMeta.node() === null) {
    chartMeta = chartContainer
      .append('div')
      .attr('class', obj.prefix + 'chart_meta');
  }

	var chartSocialBtn = chartMeta
		.append('div')
		.attr('class', obj.prefix + 'chart_meta_btn')
		.html('share');

	var chartSocial = chartContainer
		.append('div')
		.attr('class', obj.prefix + 'chart_social');

	var chartSocialCloseBtn = chartSocial
		.append('div')
		.attr('class', obj.prefix + 'chart_social_close')
		.html('&#xd7;');

	var chartSocialOptions = chartSocial
		.append('div')
		.attr('class', obj.prefix + 'chart_social_options');

	chartSocialOptions
		.append('h3')
		.html('Share this chart:');

	chartSocialBtn.on('click', function() {
		chartSocial.classed(obj.prefix + 'active', true);
	});

	chartSocialCloseBtn.on('click', function() {
		chartSocial.classed(obj.prefix + 'active', false);
	});

	var itemAmount = socialOptions.length;

	for(var i = 0; i < itemAmount; i++ ) {
		chartSocialOptions
			.selectAll('.' + obj.prefix + 'social-item')
			.data(socialOptions)
			.enter()
			.append('div')
			.attr('class', obj.prefix + 'social-item').html(function(d) {
				if (!d.popup) {
					return '<a href="' + d.url + '"><img class="' + obj.prefix + 'social-icon" src="' + d.icon + '" title="' + d.label + '"/></a>';
				} else {
					return '<a class="' + obj.prefix + 'js-share" href="' + d.url + '"><img class="' + obj.prefix + 'social-icon" src="' + d.icon + '" title="' + d.label + '"/></a>';
				}
			});
	}

  if (obj.image && obj.image.enable) {
    chartSocialOptions
      .append('div')
      .attr('class', obj.prefix + 'image-url')
      .attr('contentEditable', 'true')
      .html(getThumbnail(obj));
  }

	var sharePopup = document.querySelectorAll("." + obj.prefix + "js-share");

  if (sharePopup) {
    [].forEach.call(sharePopup, function(anchor) {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();
        windowPopup(this.href, 600, 620);
      });
    });
  }

	return {
		meta_nav: chartMeta
	};

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

function constructFacebookURL(obj){
  var base = 'https://www.facebook.com/dialog/share?',
      redirect = obj.social.facebook.redirect,
      url = 'app_id=' + obj.social.facebook.appID + '&amp;display=popup&amp;title=' + obj.heading + '&amp;description=From%20article' + document.title + '&amp;href=' + window.location.href + '&amp;redirect_uri=' + redirect;
  if (obj.image && obj.image.enable) {  url += '&amp;picture=' + getThumbnail(obj); }
  return base + url;
}

function constructMailURL(obj){
  var base = 'mailto:?';
  var thumbnail = (obj.image && obj.image.enable) ? '%0A' + getThumbnail(obj) : "";
  return base + 'subject=' + obj.heading + '&amp;body=' + obj.heading + thumbnail + '%0Afrom article: ' + document.title + '%0A' + window.location.href;
}

function constructSMSURL(obj){
  var base = 'sms:',
      url = '&body=Check%20out%20this%20chart: ' + obj.heading;
  if (obj.image && obj.image.enable) {  url += '%20' + getThumbnail(obj); }
  return base + url;
}

function constructTwitterURL(obj){
  var base = 'https://twitter.com/intent/tweet?',
      hashtag = !!(obj.social.twitter.hashtag) ? '&amp;hashtags=' + obj.social.twitter.hashtag : "",
      via = !!(obj.social.twitter.via) ? '&amp;via=' + obj.social.twitter.via : "",
      url = 'url=' + window.location.href  + via + '&amp;text=' + encodeURI(obj.heading) + hashtag;
  if (obj.image && obj.image.enable) {  url += '%20' + getThumbnail(obj); }
  return base + url;
}

module.exports = socialComponent;
