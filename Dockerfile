# Use the correct base image tag for Node
FROM node:19-alpine AS build

# Copy package.json and tsconfig files
COPY package*.json tsconfig.json  .

# Copy the source code
COPY src ./src

# Install dependencies using Yarn
RUN npm install

# Build the application
RUN npm run build

COPY . .

# Expose port 3000
EXPOSE 3000

CMD [ "node", "dist/index.js"]

