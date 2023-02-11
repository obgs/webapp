FROM node:18-bullseye

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm \
  && pnpm install --frozen-lockfile

COPY ./ ./

RUN pnpm build

CMD ["pnpm", "start"]
