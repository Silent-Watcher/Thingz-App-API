FROM oven/bun:1 as Build

WORKDIR /build

COPY package.json bun.lockb /build/

RUN bun  install

COPY . .

RUN bun run build

FROM oven/bun:1 as production

WORKDIR /app

COPY package.json bun.lockb /app/

RUN  bun install --production

COPY --from=Build ./build/dist ./app/dist

CMD [ "bun","start" ]
