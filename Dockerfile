# Use Node.js official image as a base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Set the environment variable for production (optional)
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start:prod"]
