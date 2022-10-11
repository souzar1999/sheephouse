FROM node:10-alpine

RUN mkdir -p /usr/app/sheephouse/frontend
WORKDIR /usr/app/sheephouse/frontend
COPY package.json package-lock.json ./

RUN npm i
COPY . /usr/app/sheephouse/frontend/
#RUN npm install react-scripts@4.0.1 -g --silent
RUN npm run build



EXPOSE 3000
CMD ["npm","start"]