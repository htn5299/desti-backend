FROM node:latest
ENV NODE_ENV=development
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
COPY . .
RUN yarn install
CMD ["yarn", "start:dev"]