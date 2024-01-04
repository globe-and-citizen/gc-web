# Use an official Node.js runtime as the base image
FROM node:18.2.0-alpine as development
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./package-lock.json ./

# Install the application dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Command to run your Node.js application
CMD ["npm", "run", "dev"]

EXPOSE 3000
