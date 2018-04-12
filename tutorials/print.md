# Setting up print export

In past versions of Chart Tool, PDF export was a complicated and finicky process. Chart Tool now uses the Google Chrome team's [`puppeteer`](https://github.com/GoogleChrome/puppeteer) package for PDF generation, making things a lot simpler.

----------

### **Step 1:** Base64 your fonts
For best results, you'll need to base64 encode your fonts and reference them in [`meteor-custom.scss`](https://github.com/globeandmail/chart-tool/blob/master/tutorials/customizing.md) so that Meteor can tell wkhtmltopdf where to look for them. If you don't base64 your fonts, you'll run into font loading issues and PDFs will be significantly harder to output reliably.


### **Step 2:** Set your line depth, column, and gutter settings

PDF export works a bit differently than PNG export — instead of expecting a width and a height in pixels, we're going to specify a width in **columns** and a height in **lines**, as this is how most print publishing systems work.

You'll want to open up [`meteor-config.js`](https://github.com/globeandmail/chart-tool/blob/master/tutorials/customizing.md) and take a look at the `print` object, and these values in particular:

```javascript
print: {
  gutter_width: 4, // space between each column, assuming there's more than one
  column_width: 47, // width of an individual column
  first_line_depth: 2.14, // depth of the first line
  line_depth: 3.35 // depth of every subsequent line
}
```

A values refer to print sizes in **millimetres**. So in this case, we're setting up a print PDF that takes 47mm columns with 4mm gutters, with its first line coming out at 2.14mm and every line after that at 3.35mm.

Once you've fixed up your `meteor-config.js` file, be sure to kill any active Chart Tool processes and re-run `gulp` so that your changes can propagate across the app.

### **Step 3:** Tweak your CSS

Assuming you haven't loaded any charts into Chart Tool yet, do that now — you'll want to have a proper chart to test PDF export against.

Once that's done, you'll want to point your browser to [`/chart/pdf/_id`](https://github.com/globeandmail/chart-tool/blob/master/tutorials/interface.md) to preview what your chart will look like to wkhtmltopdf. At this point, you'll want to go back to [`meteor-custom.scss`](https://github.com/globeandmail/chart-tool/blob/master/tutorials/customizing.md) to tweak your print-specific CSS. There should be a section that looks something like this:

```css
.chart-pdf,
.print-export-preview-chart,
.chart-print-export {
  ... 
}
```

That's where you'll want to put your custom styles. If you need a visual aid while debugging your PDF, feel free to uncomment the debugging CSS rule at the top of `meteor-custom.scss`.

You'll notice that stroke widths are rendered using a `ptToPx` SCSS function. This converts screen pixel sizes to their print point-size equivalent.


### **Step 4:** Download a PDF

Once you've done all that, you can just head on over to `/chart/:_id/edit` and try downloading a PDF of your chart. Chances are, you'll have to do additional CSS tweaking after the fact to get everything sized just right.

#### A note on colour spaces

One thing to keep in mind: once you download a PDF, you'll be able to manipulate it in Adobe Illustrator as needed, but the chart will still be in an **RGB colour space**. If you need your charts to be converted to CMYK (assuming your print workflow doesn't take care of this for you), we recommend looking into something like [ghostscript](http://graphicdesign.stackexchange.com/questions/38306/converting-pdf-from-rgb-to-cmyk-with-freeware-or-oss) or an Adobe Illustrator action.
