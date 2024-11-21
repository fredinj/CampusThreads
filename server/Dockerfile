# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the application's port
EXPOSE 3000

# Define the command to run your app
# CMD ["npm", "run", "dev"]
CMD ["npm", "run", "serve"]