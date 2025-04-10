# Stage 1: Build the app
FROM node:lts-alpine AS builder

RUN npm install -g npm@latest

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --production && npm i layer8-interceptor-rs

# Copy the rest of the application and build
COPY . .
RUN npm run build

# Stage 2: Serve the app
FROM node:lts-alpine

# Install a lightweight HTTP server
RUN npm install -g http-server

# Copy the built files from the builder stage
WORKDIR /app
COPY --from=builder /app/dist /app/dist

# Expose port and define command
EXPOSE 8080
CMD [ "http-server", "dist", "--port", "8080" ]
