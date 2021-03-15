# There is no need to build anything considering everything has been build already
FROM node:alpine as base
WORKDIR /usr/src/app
EXPOSE 80
EXPOSE 443
COPY . /usr/src/app
CMD ENV=${ENV} node index.js