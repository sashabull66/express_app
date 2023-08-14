FROM node as FRONT_APP
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:latest
COPY --from=FRONT_APP app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx