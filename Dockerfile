FROM node:alpine
#FROM node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk add -t .gyp --no-cache git python g++ make \
    && npm install -g truffle@3.2.x \
    && apk del .gyp

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# RUN npm install --loglevel=error

# Bundle app source
COPY . .

ENTRYPOINT ["truffle"]
CMD ["deploy"]
