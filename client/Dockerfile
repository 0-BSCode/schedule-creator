FROM node:alpine

ARG VITE_SERVER_URL=/api

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5173

RUN npm run build