FROM node:14.17-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# node-gyp dependencies
RUN apk add --update python make g++ && rm -rf /var/cache/apk/*

# Install dependencies from package-lock.json
RUN npm ci --no-audit --no-fund

COPY . .

RUN npm run build

# Remove the packages specified in devDependencie
RUN npm prune --production

# By using the FROM statement again, we are telling Docker that it should create a new,
# fresh image without any connection to the previous one.
FROM node:14.17-alpine AS build

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm ci --only=production --no-audit --no-fund
# Copy node_modules from builder. This will contains only production dependencies
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy the built /dist folder from the builder image.
# This way we are only getting the /dist directory, without the devDependencies,
# installed in our final image.
COPY --from=builder /usr/src/app/dist ./dist

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

CMD [ "npm", "run", "start:prod" ]