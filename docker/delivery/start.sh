#!/bin/sh

if [ -n "${KODOKOJO_PORT_80_TCP_PORT}" ]; then
  BACK_HOST=$KODOKOJO_PORT_80_TCP_ADDR
  BACK_PORT=$KODOKOJO_PORT_80_TCP_PORT
fi
sed -e "s/@@BACK_HOST@@/${BACK_HOST}/g" -e "s/@@BACK_PORT@@/${BACK_PORT}/g" /etc/nginx/nginx.conf.tpl > /etc/nginx/nginx.conf

nginx -g 'daemon off;'
