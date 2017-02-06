FROM node:alpine

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/app && mv /tmp/node_modules /usr/app/

EXPOSE 80

WORKDIR /usr/app
ADD . /usr/app

CMD ["npm", "start"]
