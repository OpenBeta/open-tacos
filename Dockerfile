
FROM node:16-bullseye-slim as builder

RUN apt-get update -y
RUN apt-get install -y gcc make musl-dev libvips-dev libvips
RUN yarn global add gatsby-cli
# The port gatsby runs on
EXPOSE 8000
WORKDIR /myapp
COPY ./package.json /myapp
COPY ./yarn.lock /myapp
RUN yarn install && yarn cache clean
COPY . /myapp
CMD ["gatsby", "develop", "-H", "0.0.0.0" ]