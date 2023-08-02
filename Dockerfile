FROM node
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . .
ENV PORT 4200
EXPOSE $PORT
CMD ["yarn","start"]