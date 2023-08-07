FROM node
WORKDIR /front
COPY package.json /app
RUN yarn install
COPY . .
CMD ["yarn","start"]