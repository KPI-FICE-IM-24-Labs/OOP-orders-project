ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY test/.env.test ./.env

COPY .. .

RUN pnpm install

CMD ["pnpm", "run", "test"]
