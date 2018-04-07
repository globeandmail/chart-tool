import puppeteer from 'puppeteer';
import { Meteor } from 'meteor/meteor';

export async function generatePDF(chart, width, height) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${Meteor.absoluteUrl()}chart/${chart._id}/pdf`, { waitUntil: ['load', 'networkidle0'] });
  await page.emulateMedia('screen');
  const pdf = await page.pdf({
    width: `${width}mm`,
    height: `${height}mm`,
    scale: 1,
    pageRanges: '1'
  });
  await browser.close();
  return pdf;
}

export async function generatePNG(chart, params) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: params.width,
    height: params.height,
    deviceScaleFactor: params.scale
  });
  const optionalMargin = params.margin ? `&margin=${params.margin}` : '';
  await page.goto(`${Meteor.absoluteUrl()}chart/${chart._id}/png?width=${params.width}&height=${params.height}${optionalMargin}`, { waitUntil: ['load', 'networkidle0'] });
  const png = await page.screenshot({
    clip: {
      x: 0,
      y: 0,
      width: params.width,
      height: params.height
    },
    type: params.type ? params.type : 'png'
  });
  await browser.close();
  return png;
}
