FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN rm -f /root/.npmrc && npm install --omit=dev --registry=https://registry.npmjs.org

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
