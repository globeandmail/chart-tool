# Deploying your own Chart Tool

Deploying your Chart Tool instance can be done in about 20 minutes. You'll need:
- a static server for hosting Chart Tool's front-end libraries, and a way to upload files to that server (such as via FTP)
- Docker and docker-compose installed on your computer
- A service that allows for the deployment of docker-compose images, such as Amazon Web Service's Elastic Container Registry
- optionally, your S3 bucket name, region, key and secret key, if you're using Chart Tool's [upload-to-S3](https://github.com/globeandmail/chart-tool/blob/master/tutorials/thumbnails.md) feature

For a few different reasons, we recommend you build the project locally before trying to deploy it to a server. It'll save you a lot of pain and server space.

----------

### Before you do anything
Take a look at your `chart-tool-config.json` file, particularly the `embedJS` and `embedCSS` fields. You'll want to point these to the place you'll be hosting your Chart Tool static files – these are the bundled JavaScript and CSS libraries embed codes rely on to draw charts on your website. In the case of the Globe, our minified library files sit in `http://www.theglobeandmail.com/static/templates/tools/chart-tool/{version}/chart-tool.min.{js|css}`.


### **Step 1:** Build the image
Locally, run the Docker command to build a production-ready Chart Tool image, which compiles down the Meteor-side of Chart Tool into a simple Node project that can be deployed anywhere:
```sh
docker-compose -f docker-compose.production.yml build
```

### **Step 2:** Send the built image to your server
Instructions TK

### **Step 3:** Use Terraform to build a new server
Instructions TK

### **Step 4:** Upload your static files
Now that your app is running, you'll want to take the front-end libraries and upload them to the URL you specified in your `chart-tool-config.json`. First, get the production container up and running so that the files are available:

```sh
docker-compose -f docker-compose.production.yml up
```

Then, in a different terminal tab, copy the files from the container into your computer (the /dist folder will be copied to whichever directory you're running this command from):

```sh
docker cp $(docker ps | grep "chart-tool_app" | sed "s/ .*//"):/opt/bundle/dist $(pwd)
```

Upload the `chart-tool.min.js` and `chart-tool.min.css` files you just generated to the paths you specified in your `chart-tool-config.json`. Finally, make a chart using your app, grab the embed code, and publish it to your website. If you see a chart render on the page, you've done it! :tada:
