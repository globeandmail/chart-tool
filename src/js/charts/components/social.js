import { getThumbnailPath } from '../../utils/utils';
import { select } from 'd3-selection';

export default function social(node, obj) {

  const socialOptions = [];

  for (let prop in obj.social) {
    if (obj.social[prop]) {
      switch (obj.social[prop].label) {
        case 'Twitter':
          obj.social[prop].url = constructTwitterURL(obj);
          obj.social[prop].popup = true;
          break;
        case 'Facebook':
          obj.social[prop].url = constructFacebookURL(obj);
          obj.social[prop].popup = true;
          break;
        case 'Email':
          obj.social[prop].url = constructMailURL(obj);
          obj.social[prop].popup = false;
          break;
        case 'SMS':
          obj.social[prop].url = constructSMSURL(obj);
          obj.social[prop].popup = false;
          break;
        default:
          console.log('Incorrect social item definition.');
      }
      socialOptions.push(obj.social[prop]);
    }
  }

  const chartContainer = select(node);

  let chartMeta = chartContainer.select(`.${obj.prefix}chart_meta`);

  if (chartMeta.node() === null) {
    chartMeta = chartContainer
      .append('div')
      .attr('class', `${obj.prefix}chart_meta`);
  }

  const chartSocialBtn = chartMeta
    .append('div')
    .attr('class', `${obj.prefix}chart_meta_btn`)
    .html('share');

  const chartSocial = chartContainer
    .append('div')
    .attr('class', `${obj.prefix}chart_social`);

  const chartSocialCloseBtn = chartSocial
    .append('div')
    .attr('class', `${obj.prefix}chart_social_close`)
    .html('&#xd7;');

  const chartSocialOptions = chartSocial
    .append('div')
    .attr('class', `${obj.prefix}chart_social_options`);

  chartSocialOptions
    .append('h3')
    .html('Share this chart:');

  chartSocialBtn.on('click', () => {
    chartSocial.classed(`${obj.prefix}active`, true);
  });

  chartSocialCloseBtn.on('click', () => {
    chartSocial.classed(`${obj.prefix}active`, false);
  });

  const itemAmount = socialOptions.length;

  for (let i = 0; i < itemAmount; i++) {
    chartSocialOptions
      .selectAll(`.${obj.prefix}social-item`)
      .data(socialOptions)
      .enter()
      .append('div')
      .attr('class', `${obj.prefix}social-item`)
      .html(d => {
        if (!d.popup) {
          return `<a href='${d.url}'><img class='${obj.prefix}social-icon' src='${d.icon}' title='${d.label}'></a>`;
        } else {
          return `<a class='${obj.prefix}js-share' href='${d.url}'><img class='${obj.prefix}social-icon' src='${d.icon}' title='${d.label}'></a>`;
        }
      });
  }

  if (obj.image && obj.image.enable) {
    chartSocialOptions
      .append('div')
      .attr('class', `${obj.prefix}image-url`)
      .attr('contentEditable', 'true')
      .html(getThumbnailPath(obj));
  }

  const sharePopup = document.querySelectorAll(`.${obj.prefix}js-share`);

  if (sharePopup) {
    [].forEach.call(sharePopup, anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        windowPopup(this.href, 600, 620);
      });
    });
  }

  return {
    meta_nav: chartMeta
  };

}

function windowPopup(url, width, height) {

  // calculate the position of the popup so it’s centered on the screen
  const left = (screen.width / 2) - (width / 2),
    top = (screen.height / 2) - (height / 2);

  window.open(
    url,
    '',
    `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=${width},height=${height},top=${top},left=${left}`
  );
}

function constructFacebookURL(obj){
  const base = 'https://www.facebook.com/dialog/share?',
    redirect = obj.social.facebook.redirect;
  let url = `app_id=${obj.social.facebook.appID}&amp;display=popup&amp;title=${obj.heading}&amp;description=From%20article${document.title}&amp;href=${window.location.href}&amp;redirect_uri=${redirect}`;
  if (obj.image && obj.image.enable) { url += `&amp;picture=${getThumbnailPath(obj)}`; }
  return `${base}${url}`;
}

function constructMailURL(obj){
  const base = 'mailto:?';
  const thumbnail = (obj.image && obj.image.enable) ? `%0A${getThumbnailPath(obj)}` : '';
  return `${base}subject=${obj.heading}&amp;body=${obj.heading}${thumbnail}%0Afrom article: ${document.title}%0A${window.location.href}`;
}

function constructSMSURL(obj){
  const base = 'sms:';
  let url = `&body=Check%20out%20this%20chart: ${obj.heading}`;
  if (obj.image && obj.image.enable) {  url += `%20${getThumbnailPath(obj)}`; }
  return `${base}${url}`;
}

function constructTwitterURL(obj){
  const base = 'https://twitter.com/intent/tweet?',
    hashtag = (obj.social.twitter.hashtag) ? `&amp;hashtags=${obj.social.twitter.hashtag}` : '',
    via = (obj.social.twitter.via) ? `&amp;via=${obj.social.twitter.via}` : '';
  let url = `url=${window.location.href}${via}&amp;text=${encodeURI(obj.heading)}${hashtag}`;
  if (obj.image && obj.image.enable) {  url += `%20${getThumbnailPath(obj)}`; }
  return `${base}${url}`;
}
