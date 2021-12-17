
FROM node:16-bullseye-slim as builder

ENV GATSBY_TELEMETRY_DISABLED=1
ENV PATH /app/node_modules/.bin:$PATH

RUN apt-get update -y
# The port gatsby runs on
EXPOSE 8000
WORKDIR /app
COPY ./package.json /app
COPY ./yarn.lock /app
COPY . /app
CMD ["sh", "-c", "yarn install && gatsby develop -H 0.0.0.0"]
