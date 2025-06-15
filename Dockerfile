FROM node:22.16.0
WORKDIR /app
COPY . ./
CMD ["npm", "run", "start:prod"]