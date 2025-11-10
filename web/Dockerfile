FROM node:20-alpine

WORKDIR /blog_ipsum

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
