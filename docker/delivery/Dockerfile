FROM nginx:1.11-alpine
ADD nginx.conf.tpl /etc/nginx/nginx.conf.tpl
ADD proxy.conf /etc/nginx/proxy.conf
ADD start.sh /start.sh
RUN chmod +x /start.sh
ADD static/ /var/www/
ADD config.template.tpl /var/config/config.template.tpl

RUN chmod -R 755 /var/www/ && chown -R nginx:nginx /var/www/ && chmod -R 755 /var/config/

CMD [ "/start.sh" ]
