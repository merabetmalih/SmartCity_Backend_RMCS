FROM node:17.7.2-alpine

COPY . /smart-city
WORKDIR /smart-city

RUN npm install
RUN npm install -g nodemon


ENV NODE_ENV=production
EXPOSE $PORT

CMD export PORT=$PORT && npm run start:prod
