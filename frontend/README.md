# Introduction

OBGS stands for Open Board Game Stats. It is meant to be an opensource social network for board games. It aims to collect play group stats from different games and showing them in a nice way. It is still in its early stages of development.

## Development

### Getting started

- install [pnpm](https://pnpm.io/)
- `pnpm i`
- `pnpm dev`

### Stack

- [typescript](https://www.typescriptlang.org/)
- [nextjs](https://nextjs.org/)
- Communication with the backend is made with GraphQL requests using [Apollo](https://www.apollographql.com/docs/react/).
- The UI is constructed with [Material UI](https://mui.com/).
- At the moment, there is no global storage used here outside React's Context API and Apollo's cache.
