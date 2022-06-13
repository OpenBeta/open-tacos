
FROM node:16-bullseye-slim as builder

ENV PATH /app/node_modules/.bin:$PATH

RUN apt-get update -y
# The port next runs on
EXPOSE 3000
WORKDIR /app

# Note: 
# No COPY commands here.
# For development we don't want a static version of files under src/
# See docker-compose.yml for local dir --> container mapping.

CMD ["sh", "-c", "yarn install --network-timeout 300000 && yarn dev"]
