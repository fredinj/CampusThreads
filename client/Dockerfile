# Stage 1: Build the Vite application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy .env specifically
COPY .env .env

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN npm run build

# Remove .env after build
RUN rm .env

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

# Copy the built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]