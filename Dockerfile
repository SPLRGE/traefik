ARG NODE_IMAGE=node:20-alpine

# -- PREPARE IMAGE --
FROM $NODE_IMAGE AS prepare
RUN apk --no-cache add dumb-init
RUN mkdir -p /app && chown node:node /app
WORKDIR /app
RUN npm install -g pnpm
USER node

# -- INSTALL DEPENDENCIES --
FROM prepare AS dependencies
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# -- BUILD APPLICATION --
FROM dependencies AS build
COPY --chown=node:node . .
RUN pnpm build

# -- FINAL IMAGE --
FROM prepare as final
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/build .
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
CMD ["/bin/sh", "-c", "node ace migration:run;dumb-init node server.js"]
