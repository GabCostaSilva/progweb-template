FROM node:13-alpine

WORKDIR /src

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD node src/index.js
