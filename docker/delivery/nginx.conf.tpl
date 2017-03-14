user  nginx;
worker_processes  1;
error_log  /dev/stderr info;
pid        /var/run/nginx.pid;
events {
    worker_connections  1024;
}
http {
    include       /etc/nginx/mime.types;
    include    /etc/nginx/proxy.conf;
    default_type  application/octet-stream;
    root     /var/www/;
    index    index.html;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /dev/stdout main;
    sendfile        on;
    tcp_nopush   on;
    keepalive_timeout  65;


    server {
        listen       80;

        location ~* .(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 365d;
        }

        location ~ ^/api/v1/event.* {
            proxy_pass http://@@BACK_HOST@@:@@BACK_PORT@@;
            proxy_set_header Connection "";
            proxy_http_version 1.1;
            chunked_transfer_encoding off;
            proxy_buffering off;
        }

        location ~ ^/api.* {
            proxy_pass      http://@@BACK_HOST@@:@@BACK_PORT@@;
        }

        location / {
          root /var/www/;
          index index.html;
          gzip_static on;
          try_files $uri $uri/ /index.html;
        }
    }
}