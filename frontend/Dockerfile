FROM node:10-alpine

RUN mkdir -p /usr/app/sheephouse/frontend
WORKDIR /usr/app/sheephouse/frontend
COPY package.json package-lock.json ./

RUN npm i
COPY . /usr/app/sheephouse/frontend/

RUN npm run build

EXPOSE 3000
CMD ["npm","start"]