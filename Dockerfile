FROM node:20.10.0-alpine3.18 as builder

WORKDIR /usr/src/app

RUN apk add --no-cache -t build-dependencies git make gcc g++ python3 \
    libtool autoconf pkgconfig automake librdkafka-dev bash # wget tar xz

RUN cd $(npm root -g)/npm

RUN npm install -g node-gyp

COPY package*.json ./

RUN npm install

COPY . /usr/src/app

RUN npm run build

CMD ["npm", "start"]
