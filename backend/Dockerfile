## backend
FROM node:lts-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm cache clean --force && rm -rf node_modules && npm install && npm i layer8-middleware-rs
COPY . .
EXPOSE 80
# RUN npm run start
CMD ["npm", "run", "start"]