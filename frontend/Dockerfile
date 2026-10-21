FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG BACKEND_URL=https://devconnect-api-n7j6.onrender.com
ARG VITE_API_GITHUB_URL=https://api.github.com/repos/
ARG VITE_API_GITHUB_USERS_URL=https://api.github.com/users/
ARG VITE_GITHUB_WEB_URL=https://github.com/
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV BACKEND_URL=$BACKEND_URL
ENV VITE_API_GITHUB_URL=$VITE_API_GITHUB_URL
ENV VITE_API_GITHUB_USERS_URL=$VITE_API_GITHUB_USERS_URL
ENV VITE_GITHUB_WEB_URL=$VITE_GITHUB_WEB_URL

RUN npm run build

FROM nginx:1.27-alpine

ARG BACKEND_URL=https://devconnect-api-n7j6.onrender.com
ENV BACKEND_URL=$BACKEND_URL

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
