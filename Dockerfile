# Use the correct base image tag for Node
FROM node:18.2.0-alpine

# Copy package.json and tsconfig files
COPY package*.json tsconfig.json .

# Copy the source code
COPY src ./src

# Install dependencies using Yarn
RUN npm install

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# run the application
CMD ["npm", "run", "start"]
