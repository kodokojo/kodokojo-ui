#!/bin/sh

if [ -n "${KODOKOJO_PORT_80_TCP_PORT}" ]; then
  BACK_HOST=$KODOKOJO_PORT_80_TCP_ADDR
  BACK_PORT=$KODOKOJO_PORT_80_TCP_PORT
fi
sed -e "s/@@BACK_HOST@@/${BACK_HOST}/g" -e "s/@@BACK_PORT@@/${BACK_PORT}/g" /etc/nginx/nginx.conf.tpl > /etc/nginx/nginx.conf

cat /var/config/config.template.tpl | sed -e "s#@@CRISP@@#$CRISP_ENV#g" -e "s#@@HELP_EMAIL@@#$HELP_EMAIL_ENV#g" -e "s#@@RECAPTCHA@@#$RECAPTCHA_ENV#g" -e "s#@@TOS@@#$TOS_ENV#g" -e "s#@@WAITING_LIST@@#$WAITING_LIST_ENV#g" -e "s#@@SIGNUP@@#$SIGNUP_ENV#g" > /var/www/assets/json/ui.configuration.json

nginx -g 'daemon off;'
