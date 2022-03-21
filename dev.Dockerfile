FROM node:16.13-alpine

# Create app directory
WORKDIR /usr/src/app

RUN npm i -g pnpm

# Files required by pnpm install
COPY .npmrc package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

# App source
COPY . .

CMD [ "pnpm", "start:dev" ]