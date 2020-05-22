FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 5000

ENV HOST=0.0.0.0

CMD [ "npm", "start" ]