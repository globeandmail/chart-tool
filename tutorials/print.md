# Setting up print export

Take a deep breath. Good? Okay, let's get to it.

PDF export can be **very finicky**. As it turns out, taking an HTML file and turning it into a PDF isn't easy. Luckily, once you get it right for your setup it should require little to no tweaking after the fact. 


----------


### **Step 1:** Install wkhtmltopdf locally

The only reason PDF export in Chart Tool works at all is because of the [wkhtmltopdf library](http://wkhtmltopdf.org/), so let's go ahead and install that. You'll want version 0.12.2.1 or greater (with patched Qt). We recommend downloading a release straight from the [wkhtmltopdf website](http://wkhtmltopdf.org/downloads.html).


### **Step 2:** Base64 your fonts
For best results, you'll need to base64 encode your fonts and reference them in [`meteor-custom.scss`](https://github.com/globeandmail/chart-tool/blob/master/tutorials/customizing.md) so that Meteor can tell wkhtmltopdf where to look for them. If you don't base64 your fonts, you'll run into font loading issues and PDFs will be significantly harder to output reliably.


### **Step 3:** Set your line depth, column, and gutter settings

PDF export works a bit differently than PNG export — instead of expecting a width and a height in pixels, we're going to specify a width in **columns** and a height in **lines**, as this is how most print publishing systems work.

You'll want to open up [`meteor-config.js`](https://github.com/globeandmail/chart-tool/blob/master/tutorials/customizing.md) and take a look at the `print` object, and these values in particular:

```javascript
print: {
  gutter_width: 4, // space between each column, assuming there's more than one
  column_width: 47, // width of an individual column
  first_line_depth: 2.14, // depth of the first line
  line_depth: 3.35, // depth of every subsequent line
  dpi: 266, // DPI value, though this currently does nothing in wkthmltopdf pending an upstream change
  magic: { // hoooo boy
    width: 3.698,
    height: 3.675
  }
}
```

With the exception of `dpi` and the obtuse-sounding `magic`, all other values refer to print sizes in **millimetres**. So in this case, we're setting up a print PDF that takes 47mm columns with 4mm gutters, with its first line coming out at 2.14mm and every line after that at 3.35mm.

Once you've fixed up your `meteor-config.js` file, be sure to kill any active Chart Tool processes and re-run `gulp` so that your changes can propagate across the app.

#### Wait. What's the deal with this `magic` stuff?

Glad you asked! There's an [upstream bug](https://github.com/wkhtmltopdf/wkhtmltopdf/issues/2290) in wkhtmltopdf which means all charts will be sized improperly without a multiplicative value. `magic.width` and `magic.height` are what we multiply the pixel dimensions of a chart by to get its proper dimensions in millimetres. More than likely, you won't have to change these.



### **Step 4:** Tweak your CSS

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

You'll notice that stroke widths are rendered using a `ptToPx` SCSS function. This is again due to the upstream bug in wkhtmltopdf. Same thing goes for these font sizes:

```CSS
$six-five-pt: 8px; // actually renders at 6.15pt
$eight-pt: 10px; // actually renders at 7.69pt
$nine-pt: 12.0px; // actually renders at 9.22pt
```

Due to that same bug, you'll only be able to approximate the font sizes you want. We recommend just trying out different pixel values until you find one that outputs a PDF with font sizes closest to what you're looking for.


### **Step 5:** Download a PDF

Once you've done all that, you can just head on over to `/chart/edit/_id` and try downloading a PDF of your chart. Chances are, you'll have to do additional CSS tweaking after the fact to get everything sized just right.

#### A note on colour spaces

One thing to keep in mind: once you download a PDF, you'll be able to manipulate it in Adobe Illustrator as needed, but the chart will still be in an **RGB colour space**. If you need your charts to be converted to CMYK (assuming your print workflow doesn't take care of this for you), we recommend looking into something like [ghostscript](http://graphicdesign.stackexchange.com/questions/38306/converting-pdf-from-rgb-to-cmyk-with-freeware-or-oss) or an Adobe Illustrator action.
