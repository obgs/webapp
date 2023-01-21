FROM node:18-bullseye AS builder

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm \
  && pnpm install --frozen-lockfile

COPY ./ ./

RUN pnpm next build

RUN pnpm next export

FROM caddy:2.6-alpine

COPY --from=builder /out /srv

CMD ["caddy", "file-server"]
