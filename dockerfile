FROM node:22.11.0-alpine AS development

RUN apk update && apk add --no-cache git bash curl

WORKDIR /home/node/app

RUN chown -R node:node /home/node/app

USER node

CMD ["tail", "-f", "/dev/null"]