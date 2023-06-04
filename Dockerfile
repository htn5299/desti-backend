FROM node:18-alpine  AS builder
USER node
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN yarn install --immutable --immutable-cache --check-cache  && yarn cache clean

FROM node:18-alpine
USER node
WORKDIR /usr/src/app
COPY --from=builder --chown=node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node /usr/src/app/dist ./dist
COPY --from=builder --chown=node /usr/src/app/.env.production .
COPY --from=builder --chown=node /usr/src/app/package.json .
EXPOSE 4000
CMD [ "yarn", "start:prod" ]