FROM node:18-alpine
WORKDIR /app
RUN apk update && apk add --no-cache g++ python3 openjdk17-jdk
COPY package.json .
RUN npm i
COPY .env .
COPY . .
EXPOSE 8080
CMD ["node","index.js"]
