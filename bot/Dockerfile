FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY startup.sh /startup.sh

RUN chmod +x /app/startup.sh

EXPOSE 8080

ENTRYPOINT ["sh", "/app/startup.sh"]
