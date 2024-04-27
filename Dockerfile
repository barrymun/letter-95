FROM node:18 as node

RUN mkdir -p /usr/src/client
WORKDIR /usr/src/client

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

# use Nginx as the production server
FROM nginx:alpine
# copy the custom Nginx configuration file to the container
COPY client/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# copy the built React app to Nginx's web server directory
COPY --from=node /usr/src/client/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
