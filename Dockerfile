FROM node:8.10

RUN echo '{"allow_root": true}' > /root/.bowerrc

WORKDIR /app
ADD . /app

EXPOSE 3000
