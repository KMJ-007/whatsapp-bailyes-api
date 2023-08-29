FROM node:latest
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src app/src
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]