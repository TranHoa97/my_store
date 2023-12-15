FROM node:18.19.0-alpine

WORKDIR /my_store/backend

COPY package*.json ./

RUN npm install

RUN npm install -g @babel/core @babel/cli

COPY . .

RUN npm run build-src

CMD ["npm", "run", "build"]

