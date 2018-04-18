FROM node:8.10

RUN echo '{"allow_root": true}' > /root/.bowerrc

WORKDIR /app

COPY package.json yarn.lock bower.json ./

RUN yarn --frozen-lockfile

COPY . /app

EXPOSE 3000
