FROM node:14.17.0-slim

RUN apt-get update && apt-get install -y locales \
    && locale-gen en_US.UTF-8 \
    && localedef -i en_US -f UTF-8 en_US.UTF-8 \
    && echo "export LC_ALL=en_US.UTF-8" >> ~/.bashrc \
    && rm -f /etc/localtime \
    && echo "Asia/Tokyo" > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata

RUN npm install -g gatsby-cli

RUN apt-get install -y \
    wget \
    curl \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
