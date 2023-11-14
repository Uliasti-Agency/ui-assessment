FROM node:16.13 AS builder

WORKDIR /app
ADD package.json ./
ADD package-lock.json ./
ADD public public/
ADD types types/
ADD src src/
ADD openapi openapi/

RUN npm install \
    && npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# change permission of env.sh script
RUN chmod +x ./env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "cd /usr/share/nginx/html/ && ./env.sh && nginx -g \"daemon off;\""]