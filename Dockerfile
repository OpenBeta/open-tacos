
FROM node:16-bullseye-slim as builder

ENV PATH /app/node_modules/.bin:$PATH

RUN apt-get update -y
# The port next runs on
EXPOSE 3000
WORKDIR /app
COPY ./package.json /app
COPY ./yarn.lock /app
COPY . /app
CMD ["sh", "-c", "yarn install && yarn dev"]
