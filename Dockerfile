# Use the correct base image tag for Node
FROM node:19-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and tsconfig files
COPY package*.json tsconfig.json pm2.json /app

# Install dependencies using Yarn
RUN npm install pm2 -g

# Install dependencies using Yarn
RUN npm install

# Copy the application code
COPY dist /app

# Build the application
RUN npm run build

# delete those things
RUN rm -rf ./node_modules

# run karo 
FROM node:19-alpine

# Expose port 3000
EXPOSE 3000

CMD [ "pm2", "start", "pm2.json", "--no-daemon"]