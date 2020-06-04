# In dev environment, we expect to keep running gulp to build Chart Tool library
# JS/CSS files, and then Docker will watch those changes occur in the folder and
# reflect them in our containerized instance.

# Borrowing from https://github.com/disney/meteor-base/ and https://github.com/staeke/meteor-alpine/

# Use the specific version of Node expected by your Meteor release, per https://docs.meteor.com/changelog.html; this is expected for Meteor 1.10.2
FROM node:12.16.1-alpine

# Setup environment variables that will be available to the instance
ENV METEOR_VERSION 1.10.2

RUN apk add --update --no-cache bash

# Here we're running https://github.com/staeke/meteor-alpine/ with a few tweaks
RUN export TEMP_PACKAGES="alpine-sdk libc6-compat python linux-headers" && \
    apk add --update --no-cache $TEMP_PACKAGES && \
    curl https://install.meteor.com/?release=${METEOR_VERSION} | sh && \
    cd /root/.meteor/packages/meteor-tool/*/mt-os.linux.x86_64 && \
    cp scripts/admin/launch-meteor /usr/bin/meteor && \
    cd dev_bundle && \
    cd bin && \
    rm node && \
    rm npm && \
    rm npx && \
    ln -s $(which node) && \
    ln -s $(which npm) && \
    ln -s $(which npx) && \
    cd ../mongodb/bin && \
    rm mongo mongod && \
    cd ../../lib && \
    npm rebuild && \
    cd ~ && \
    ln -s /root/.meteor && \
    apk del $TEMP_PACKAGES

ENV APP_HOME /chart-tool

# Create a directory for our application
# and set it as the working directory
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/app
RUN mkdir $APP_HOME/app/.meteor

WORKDIR $APP_HOME

# Copy app and meteor package.json and package-lock.json into container
COPY package*.json $APP_HOME/
COPY app/package*.json $APP_HOME/app/

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

# Fix permissions warning; https://github.com/meteor/meteor/issues/7959
ENV METEOR_ALLOW_SUPERUSER=1

# Install gulp so we can run our servers, then npm install
# everything and rebuild node-sass
RUN npm ci --unsafe-perm && \
  npm rebuild node-sass

COPY . $APP_HOME

COPY ./docker/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000
EXPOSE 3030

CMD ["/bin/sh" , "-c" , "cd ./app && meteor --no-release-check"]
