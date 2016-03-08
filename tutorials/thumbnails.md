# Setting up chart thumbnails

By default, Chart Tool will generate thumbnails as base64-encoded images and append them to each embed code. Though it's nice to have a thumbnail to fall back on, it also means your embed code could easily be 40,000 characters long, which isn't nice.

To account for this, Chart Tool integrates with Amazon S3 to upload a new chart thumbnail whenever a chart is edited. All charts are uploaded to a folder with a name corresponding to the chart ID.

An example: if your chart has an ID of `MZD5dqxM6tTdncCck`, your thumbnail will live under `https://s3.amazonaws.com/bucketname/basepath/MZD5dqxM6tTdncCck/thumbnail.png`

Here's how to setup S3 thumbnails:


----------


### **Step 1:** Set up an S3 bucket

For this section, just follow the instructions [listed under "Create your Amazon S3"](https://github.com/Lepozepo/S3#create-your-amazon-s3).


### Step 2: Enable S3 upload under `chart-tool-config.json`

This is what `chart-tool-config.json` will look like by default:

```javascript
"image": {
  "enable": false,
  "base_path": "",
  "expiration": 30000,
  "region": "us-east-1",
  "filename": "thumbnail",
  "extension": "png",
  "thumbnailWidth": 460
}
```

You'll need to tweak those options based on the S3 bucket you just created.

* `enable`: Whether or not S3 upload should be used. Change this to `true`
* `base_path`: If you want to host your thumbnails within a specific directory, specify the directory name here.
* `expiration`: Time in milliseconds to wait before timing out an unsuccessful upload. You can probably just leave this as-is
* `region`: The region your bucket was created under
* `filename`: The filename for each thumbnail. You can probably just leave this as `thumbnail`
* `extension`: The file extension. Leave this as `png`
* `thumbnailWidth`: Width for the the thumbnail. The height will be determined automatically based on the width.


### **Step 3:** Set up your environment variables

For this step, we'll need the keys you created in [step 1](#step-1-set-up-an-s3-bucket). For security reasons, we don't want to have your AWS keys saved within the Chart Tool repo, so we use environment variables instead.

In your terminal, open up your `.bashrc` (or `.zshrc` if you're a zsh user). At the bottom of the file, add these two lines, replacing the curly braces with your AWS keys:

```sh
export S3_CHARTTOOL_BUCKET={BUCKET NAME GOES HERE}
export S3_CHARTTOOL_REGION={REGION NAME GOES HERE}
export S3_CHARTTOOL_KEY={KEY GOES HERE}
export S3_CHARTTOOL_SECRET={SECRET KEY GOES HERE}
```

Save and close the file, then restart your terminal for the changes to take effect. You can test that the environment variables are working by opening up a new shell and typing:

```sh
$ echo $S3_CHARTTOOL_KEY'\n'$S3_CHARTTOOL_SECRET'\n'$S3_CHARTTOOL_BUCKET'\n'$S3_CHARTTOOL_REGION
```

If you see both your keys returned within the terminal, you're good to go.


### **Step 4:** Test it out

At this point, start up a Chart Tool server by running `gulp`, create a new chart, and make some changes to it on the edit screen. Once that's done, take the chart ID and point your browser to `https://s3.amazonaws.com/{bucketname}/{basepath}/{chartID}/thumbnail.png`. If you see a PNG of the chart, congratulations! You've got S3 thumbnails up and running.
