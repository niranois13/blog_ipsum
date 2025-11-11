FROM node:20-alpine

WORKDIR /blog_ipsum/server

COPY package*.json ./

RUN npm install -g pnpm nodemon && npm install --frozen-lockfile

COPY server/. .
EXPOSE 3000

CMD ["npx", "nodemon", "src/index.js"]
