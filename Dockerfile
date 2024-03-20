# Use the official Node.js 18.17.1 image
FROM node:18.17.1

# Set the working directory
WORKDIR /home/nhat/view/gdscmeet/google-api

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port your app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "dev"]
