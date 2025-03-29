FROM node:alpine

WORKDIR /app

COPY package*.json .
COPY public .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173


CMD [ "npm", "run", "preview"]