FROM nginx
COPY dist /usr/share/nginx/html
COPY .env /etc/nginx/.env

RUN echo "env REACT_APP_API_URL=$(cat /etc/nginx/.env | grep REACT_APP_API_URL | cut -d '=' -f2)" > /etc/nginx/conf.d/env.conf