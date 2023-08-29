FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json yarn.lock .
RUN npm install
RUN npm run build
COPY dist .
EXPOSE 3000
CMD [ "npm", "pm2"]