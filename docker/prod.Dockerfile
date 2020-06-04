FROM node:12.16.1-alpine

ENV APP_SOURCE_FOLDER /opt/src

WORKDIR $APP_SOURCE_FOLDER

COPY package*.json $APP_SOURCE_FOLDER/

# Install gulp so we can run our servers, then npm install
# everything and rebuild node-sass
RUN npm ci --unsafe-perm --ignore-scripts && \
  npm rebuild node-sass

COPY . $APP_SOURCE_FOLDER/

RUN mkdir $APP_SOURCE_FOLDER/dist

RUN npm run build


# The tag here should match the Meteor version of your app, per .meteor/release
FROM geoffreybooth/meteor-base:1.10.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

# Copy app package.json and package-lock.json into container
COPY ./app/package*.json $APP_SOURCE_FOLDER/

RUN bash $SCRIPTS_FOLDER/build-app-npm-dependencies.sh

RUN mkdir $APP_SOURCE_FOLDER/dist

# Copy app source into container
COPY --from=0 $APP_SOURCE_FOLDER/app $APP_SOURCE_FOLDER/
COPY --from=0 $APP_SOURCE_FOLDER/dist $APP_SOURCE_FOLDER/dist

RUN bash $SCRIPTS_FOLDER/build-meteor-bundle.sh


# Use the specific version of Node expected by your Meteor release, per https://docs.meteor.com/changelog.html; this is expected for Meteor 1.10.2
FROM node:12.16.1-alpine

ENV APP_SOURCE_FOLDER /opt/src
ENV APP_BUNDLE_FOLDER /opt/bundle
ENV SCRIPTS_FOLDER /docker

# Runtime dependencies; if your dependencies need compilation (native modules such as bcrypt) or you are using Meteor <1.8.1, use app-with-native-dependencies.dockerfile instead
RUN apk --no-cache add \
    bash \
    ca-certificates

# Copy in entrypoint
COPY --from=1 $SCRIPTS_FOLDER $SCRIPTS_FOLDER/

# Copy in app bundle
COPY --from=1 $APP_BUNDLE_FOLDER/bundle $APP_BUNDLE_FOLDER/bundle/
COPY --from=1 $APP_SOURCE_FOLDER/dist $APP_BUNDLE_FOLDER/dist

RUN bash $SCRIPTS_FOLDER/build-meteor-npm-dependencies.sh

# Start app
ENTRYPOINT ["/docker/entrypoint.sh"]

CMD ["node", "main.js"]
