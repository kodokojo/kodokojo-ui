user  nginx;
worker_processes  1;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;
events {
    worker_connections  1024;
}
http {
    include       /etc/nginx/mime.types;
    include    /etc/nginx/proxy.conf;
    default_type  application/octet-stream;
    index    index.html;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    tcp_nopush   on;
    keepalive_timeout  65;
    #include /etc/nginx/conf.d/*.conf;
    server {
        listen       80;
        location ~ ^/api.* {
            proxy_pass      http://@@BACK_HOST@@:@@BACK_PORT@@;
        }
        location ~ .* {
          #root    /var/www/;
          try_files $uri /var/www/index.html
        }
      }
}