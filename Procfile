express: node server.js
nginx: mkdir -p .nginx && nginx -c "$PWD/nginx.conf" -p "$PWD"
nginx-errors: tail -F ./.nginx/error.log
nginx-access: tail -F ./.nginx/access.log
