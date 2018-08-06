FROM mhart/alpine-node:latest

RUN rm -rf /tmp/node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

ADD files/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["npm", "run", "start"]
