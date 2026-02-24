FROM nginx:alpine

# Copy all files from the current directory to Nginx's default public directory
# The Nginx default configuration automatically serves an index.html file if present
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
