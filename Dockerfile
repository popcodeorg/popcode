FROM node:8.12.0

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

RUN npm install --global npm@6.4.1

RUN echo '{"allow_root": true}' > /root/.bowerrc
RUN npm config set unsafe-perm true

WORKDIR /app

ARG install_dependencies=true
COPY package.json package-lock.json bower.json /app/
RUN if [ $install_dependencies = true ]; then npm ci; fi

COPY . /app/

ENTRYPOINT ["npx", "--quiet", "--no-install"]

EXPOSE 3000
