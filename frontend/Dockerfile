FROM node:15-alpine as builder

# Phyton needed for node-gyp
RUN apk add --no-cache python make g++

# install and cache app dependencies
COPY package.json package-lock.json ./
RUN npm install && mkdir /frontend && mv ./node_modules ./frontend

ARG API_URL
ENV REACT_APP_BASE_URL=$API_URL

WORKDIR /frontend
COPY . .

RUN npm run build


FROM nginx:1.9-alpine
COPY --from=builder /frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]