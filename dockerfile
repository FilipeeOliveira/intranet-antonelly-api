FROM node:22.11.0-alpine AS development

RUN apk update && apk add --no-cache git bash curl tzdata

ENV TZ=America/Manaus

WORKDIR /home/node/app

RUN chown -R node:node /home/node/app

USER node

CMD ["npm", "run", "start:prod"]
## CMD ["tail", "-f", "/dev/null"]