# FROM node:16.13.2-alpine3.15

FROM node:14.18.3-bullseye

WORKDIR /app

COPY . /app/
RUN npm install && npm run build


# FRONTEND
FROM nginx:1.21.5

ARG ARG_BRANCH
ARG ARG_VERSION
ARG ARG_IMG_TAG
ARG ARG_ENV
ARG ARG_BUILD_DATE

ENV LC_ALL=C.UTF-8 \
    LANG=C.UTF-8

RUN apt-get update && \
    apt-get install --no-install-recommends --no-install-suggests -y nano vim curl htop iputils-ping net-tools iproute2 telnet ethtool && \
    echo "alias ll='ls -alF'" >> ~/.bashrc

WORKDIR /root/

COPY --from=0 /app/dist/. /usr/share/nginx/html

COPY nginx.conf /etc/nginx/
COPY fe.conf /etc/nginx/conf.d/default.conf

ENV APP_BRANCH=${ARG_BRANCH} \
    APP_VERSION=${ARG_VERSION} \
    APP_IMG_TAG=${ARG_IMG_TAG} \
    APP_ENV=${ARG_ENV} \
    APP_BUILD_DATE=${ARG_BUILD_DATE}
