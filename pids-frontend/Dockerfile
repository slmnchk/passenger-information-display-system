FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/*.html /usr/share/nginx/html/
COPY --from=build /app/scripts /usr/share/nginx/html/scripts
COPY --from=build /app/styles /usr/share/nginx/html/styles
