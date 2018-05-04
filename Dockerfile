FROM node:8.11.1

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

RUN echo '{"allow_root": true}' > /root/.bowerrc

WORKDIR /app

COPY package.json yarn.lock bower.json ./

RUN yarn --frozen-lockfile

COPY . /app

EXPOSE 3000
