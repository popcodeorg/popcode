FROM node:8.15.0

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
        apt-get update && \
        apt-get install -y google-chrome-stable

ENV YARN_VERSION 1.13.0

RUN curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz

RUN echo '{"allow_root": true}' > /root/.bowerrc

WORKDIR /app

ARG install_dependencies=true
COPY package.json yarn.lock bower.json /app/
RUN if [ $install_dependencies = true ]; then yarn install --frozen-lockfile; fi

ARG install_dev_packages=false
RUN if [ $install_dev_packages = true ]; then apt-get install splitvt; fi

COPY . /app/

EXPOSE 3000
