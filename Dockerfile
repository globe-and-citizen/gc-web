# Use an official Node.js runtime as the base image
FROM node:18.2.0-alpine as development

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./package.json ./package-lock.json ./

# Install the application dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Use a non-root user
USER node

# Command to run your Node.js application
CMD ["npm", "run", "dev"]

EXPOSE 5173

FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY --from=development /app/package.json /app/package-lock.json ./

# Copy the rest of the application code
COPY --from=development /app .

# Build Vue app
RUN npm run build

# Use nginx base image for serving Vue app
FROM nginx:latest as production

# Copy built app from build-stage to nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (default is 80 for nginx)
EXPOSE 80

# Command to start nginx
CMD ["nginx", "-g", "daemon off;"]