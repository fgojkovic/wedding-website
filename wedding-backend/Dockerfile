FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org && npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
