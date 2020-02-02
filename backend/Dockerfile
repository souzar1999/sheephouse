FROM node:10-alpine

RUN mkdir -p /usr/app/sheephouse/backend
WORKDIR /usr/app/sheephouse/backend
COPY package.json package-lock.json ./

RUN npm i

COPY . .

EXPOSE 3333
CMD ["npm","start"]
