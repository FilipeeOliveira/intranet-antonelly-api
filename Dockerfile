FROM node:22.11.0-alpine AS development

USER root

RUN npm install -g @nestjs/cli

RUN apk --update add  \
    bash \
    ca-certificates \
    coreutils \
    curl \
    git \
    git-flow \
    procps \
    wget

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]