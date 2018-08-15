import puppeteer from 'puppeteer';
import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';
import { app_settings } from './settings';

const puppeteerSettings = {
  args: ['--enable-font-antialiasing', '--font-render-hinting=medium']
};

export async function generatePDF(chart, width, height) {
  const browser = await puppeteer.launch(puppeteerSettings);
  const page = await browser.newPage();
  await page.goto(`${Meteor.absoluteUrl()}chart/${chart._id}/pdf`, { waitUntil: ['load', 'networkidle0'] });
  await page.emulateMedia('screen');
  const pdf = await page.pdf({
    width: `${width}mm`,
    height: `${height}mm`,
    scale: 1,
    pageRanges: '1',
    printBackground: true
  });
  await page.close();
  await browser.close();
  return pdf;
}

export async function generatePNG(chart, params) {
  const browser = await puppeteer.launch(puppeteerSettings);
  const page = await browser.newPage();
  await page.setViewport({
    width: params.width,
    height: params.height,
    deviceScaleFactor: params.scale
  });
  const optionalMargin = params.margin ? `&margin=${params.margin}` : '';
  let hideStr = '';
  if (params.hide.head) hideStr = `${hideStr}&hideHead=true`;
  if (params.hide.qualifier) hideStr = `${hideStr}&hideQualifier=true`;
  if (params.hide.footer) hideStr = `${hideStr}&hideFooter=true`;
  await page.goto(`${Meteor.absoluteUrl()}chart/${chart._id}/png?width=${params.width}&height=${params.height}${optionalMargin}${hideStr}`, { waitUntil: ['load', 'networkidle0'] });

  const png = await page.screenshot({
    clip: {
      x: 0,
      y: 0,
      width: params.width,
      height: params.height
    },
    type: params.type ? params.type : 'png'
  });
  await page.close();
  await browser.close();
  return png;
}

export async function generateThumb(chart, params) {
  const browser = await puppeteer.launch(puppeteerSettings);
  const page = await browser.newPage();
  await page.setViewport({
    width: params.width,
    height: params.height || 600,
    deviceScaleFactor: params.scale
  });
  const optionalMargin = params.margin ? `&margin=${params.margin}` : '',
    optionalHeight = params.height ? `&height=${params.height}` : '';
  await page.goto(`${Meteor.absoluteUrl()}chart/${chart._id}/png?width=${params.width}&dynamicHeight=${params.dynamicHeight}${optionalHeight}${optionalMargin}`, { waitUntil: ['load', 'networkidle0'] });

  const chartElement = await page.$('.chart-png');
  const chartBBox = await chartElement.boundingBox();

  await page.setViewport({
    width: params.width,
    height: params.height || chartBBox.height,
    deviceScaleFactor: params.scale
  });

  const png = await page.screenshot({
    clip: {
      x: 0,
      y: 0,
      width: params.width,
      height: chartBBox.height
    },
    type: params.type ? params.type : 'png'
  });

  await page.close();

  await browser.close();

  if (app_settings.s3.enable) {

    AWS.config.setPromisesDependency(null);

    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_CHARTTOOL_KEY,
      secretAccessKey: process.env.S3_CHARTTOOL_SECRET,
      region: process.env.S3_CHARTTOOL_REGION
    });

    const upload = await s3.upload({
      Bucket: process.env.S3_CHARTTOOL_BUCKET,
      Key: `${app_settings.s3.base_path}${chart._id}/${app_settings.s3.filename}.${app_settings.s3.extension}`,
      Body: png,
      ContentType: 'image/png',
      ACL: 'public-read'
    }).promise();

    return upload.Location;

  } else {
    return `data:image/png;base64,${png.toString('base64')}`;
  }

}
