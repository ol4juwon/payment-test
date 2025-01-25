FROM node:18.13.0-alpine
WORKDIR /app
COPY package.json ./

RUN npm install --silent
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]