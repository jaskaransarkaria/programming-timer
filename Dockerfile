FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "build"]

COPY . .

EXPOSE 5000

ENV HOST=0.0.0.0

CMD [ "npm", "start" ]