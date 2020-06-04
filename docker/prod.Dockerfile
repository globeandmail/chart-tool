FROM node:12.16.1-alpine

ENV APP_SOURCE_FOLDER /opt/src

WORKDIR $APP_SOURCE_FOLDER

COPY package*.json $APP_SOURCE_FOLDER/

# Install gulp so we can run our servers, then npm install
# everything and rebuild node-sass
RUN npm ci --unsafe-perm --ignore-scripts && \
  npm rebuild node-sass

COPY . $APP_SOURCE_FOLDER/

RUN npm run meteorPrebuild


# The tag here should match the Meteor version of your app, per .meteor/release
FROM geoffreybooth/meteor-base:1.10.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

# Copy app package.json and package-lock.json into container
COPY ./app/package*.json $APP_SOURCE_FOLDER/

RUN bash $SCRIPTS_FOLDER/build-app-npm-dependencies.sh

# Copy app source into container
COPY --from=0 $APP_SOURCE_FOLDER/app $APP_SOURCE_FOLDER/

RUN bash $SCRIPTS_FOLDER/build-meteor-bundle.sh


# Use the specific version of Node expected by your Meteor release, per https://docs.meteor.com/changelog.html; this is expected for Meteor 1.10.2
FROM node:12.16.1-alpine

ENV APP_BUNDLE_FOLDER /opt/bundle
ENV SCRIPTS_FOLDER /docker

# # Install OS build dependencies, which stay with this intermediate image but don’t become part of the final published image
# RUN apk --no-cache add \
# 	bash \
# 	g++ \
# 	make \
# 	python
#
# # Copy in entrypoint
# COPY --from=1 $SCRIPTS_FOLDER $SCRIPTS_FOLDER/
#
# # Copy in app bundle
# COPY --from=1 $APP_BUNDLE_FOLDER/bundle $APP_BUNDLE_FOLDER/bundle/
#
# RUN bash $SCRIPTS_FOLDER/build-meteor-npm-dependencies.sh --build-from-source

# Runtime dependencies; if your dependencies need compilation (native modules such as bcrypt) or you are using Meteor <1.8.1, use app-with-native-dependencies.dockerfile instead
RUN apk --no-cache add \
		bash \
		ca-certificates

# Copy in entrypoint
COPY --from=1 $SCRIPTS_FOLDER $SCRIPTS_FOLDER/

# Copy in app bundle
COPY --from=1 $APP_BUNDLE_FOLDER/bundle $APP_BUNDLE_FOLDER/bundle/

RUN bash $SCRIPTS_FOLDER/build-meteor-npm-dependencies.sh

# # Start another Docker stage, so that the final image doesn’t contain the layer with the build dependencies
# # See previous FROM line; this must match
# FROM node:12.16.1-alpine
#
# ENV APP_BUNDLE_FOLDER /opt/bundle
# ENV SCRIPTS_FOLDER /docker
#
# # Install OS runtime dependencies
# RUN apk --no-cache add \
# 	bash \
# 	ca-certificates
#
# # Copy in entrypoint with the built and installed dependencies from the previous image
# COPY --from=2 $SCRIPTS_FOLDER $SCRIPTS_FOLDER/
#
# # Copy in app bundle with the built and installed dependencies from the previous image
# COPY --from=2 $APP_BUNDLE_FOLDER/bundle $APP_BUNDLE_FOLDER/bundle/
#
# RUN bash $SCRIPTS_FOLDER/build-meteor-npm-dependencies.sh

# Start app
ENTRYPOINT ["/docker/entrypoint.sh"]

CMD ["node", "main.js"]
