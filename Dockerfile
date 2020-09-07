FROM node:12-alpine
WORKDIR /app
COPY . ./
CMD ["npm", "run", "start:prod"]